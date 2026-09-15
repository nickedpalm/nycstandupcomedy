# Stand Up Comedy NYC

A curated, dated shortlist of NYC stand-up shows worth going out for, plus recurring bar rooms, open mics and the Manhattan clubs. Published at [standupcomedynyc.com](https://standupcomedynyc.com).

The site is static HTML, CSS and browser JavaScript. There is no database, no scraper and no server. Editors change JSON files, checks run, and a push to `main` publishes.

## Layout

```
web/                 the site as served (pages, editorial.css, scripts, assets)
web/data/            editorial data: picks, recurring, open-mics, clubs
web/data/archive/    past picks, one file per month, written by `npm run rotate`
scripts/rotate.js    moves expired picks (and their artwork) into the archive
scripts/ig-card.js   renders Instagram cards (1080x1350 JPEG) into web/assets/ig/
scripts/ig-post.js   publishes cards to Instagram; POSTED-IG.json is its log
scripts/badslava.js  pulls Badslava's New York open-mic table into candidates/ for review
scripts/heat.js      demand signals per pick (ticket availability, second shows, Wikipedia pageviews); sets the Sold out / Going fast tags
scripts/eventbrite.js pulls upcoming events from the Eventbrite organizer pages of registered rooms into candidates/
web/areas.js         the Neighborhoods directory: every room by borough and neighborhood
candidates/          discovery output (crowd-sourced, unverified); never served, never copied into web/data without a venue check
web/assets/fonts/    Oswald and Permanent Marker (OFL/Apache) for offline card rendering
functions/api/       Cloudflare Pages Function for POST /api/subscribe (Listmonk)
functions/_middleware.js  serves the Markdown edition when a client asks for text/markdown
scripts/markdown.js  builds the Markdown edition and llms.txt into dist/ (run by npm run build)
scripts/stamp.js     versions CSS and JS references in the built HTML (?v=hash) so browsers never serve a stale stylesheet
web/404.html, web/_headers, web/.well-known/api-catalog
scripts/check.js     data and source checks run by `npm test` and CI
robots.txt, sitemap.xml
POSTER-SOURCES.json  provenance for every piece of artwork in web/assets/posters
DRAFT-NOTES.md, QA-NOTES.md, RECURRING-INTAKE.md, POSTER-INTAKE.md
                     editorial working notes, newest entries at the bottom
```

## Data files

| File | What it holds | Tier value |
|---|---|---|
| `web/data/picks.json` | Dated one-off shows on the home board. The flyer shelf shows every upcoming pick that has artwork, `featured` ones first, three at a time, cycling through the rest every few seconds with a slow drift on each flyer. | `featured`, `special` |
| `web/data/recurring.json` | Weekly and monthly bar shows in the home sidebar. | `recurring` |
| `web/data/open-mics.json` | Open mics grouped by night on /open-mics.html. | `open-mic` |
| `web/data/clubs.json` | Manhattan clubs with policies on /clubs.html. | `club` |
| `web/data/venues.json` | The venue registry: every room's address, neighborhood and borough. The site resolves a show's neighborhood from this file by venue name, and the check fails on any venue that isn't registered or any record whose neighborhood disagrees. Add the venue here first, then the show. Optional `calendar_url` points at the page that lists upcoming shows; optional `eventbrite_organizer` (an eventbrite.com/o/ URL) lets `npm run eventbrite` pull that room's listings as leads. | |

Every record carries a `source_url` that was actually opened and a `verified_at` date. Unknown prices stay unknown; never guess. Artwork must be official promotional material with a credit and a record in POSTER-SOURCES.json.

## Neighborhoods

Neighborhoods are a layer, not a label. Every room in venues.json carries one, the home filter lists every neighborhood in the registry grouped by borough (with "rooms only" on those without a dated pick this week), and /neighborhoods.html is a directory of all of them: this week's picks, the weekly rooms, the open mics and every room in each. A neighborhood with no picks still shows its rooms and mics.

## Heat and demand tags

`npm run heat` scores every upcoming pick from signals we can actually read: ticket availability in the Eventbrite page's structured data, a second show of the same title at the same room the same night, Wikipedia pageviews for touring names, and how many rooms list a performer this month. The score and its reasons go to candidates/heat.json for the editor. Only two signals reach readers: `demand: "sold_out"` when the ticket page says so and `demand: "going_fast"` for limited availability or a second show, shown as a tag on the listing and in the Markdown edition. The nightly workflow refreshes it; Mazzie's edition runs it too.

## Leads

Two candidate feeds live in candidates/ and never reach the site directly: Badslava's open-mic table and the Eventbrite organizer pages of registered rooms (matched to the venue by the organizer link on venues.json). The editor opens the page, registers the venue if needed, and only then adds a pick, room or mic.

## Revolving board

The board is always current and never runs dry:

- The page only renders picks whose `ends_at` is in the future, so a show leaves the board the moment it ends.
- `npm run rotate` moves expired picks into `web/data/archive/YYYY-MM.json`, moves their posters to `web/assets/posters/archive/`, and marks the provenance records archived. Nothing is deleted. A GitHub Actions job runs it every morning at 09:15 UTC and commits the result, which deploys.
- `npm run check` warns when fewer than eight picks are upcoming, when nothing is listed a week out, when an upcoming pick was last verified more than 14 days ago, or when expired picks are still in picks.json.
- Mazzie's daily edition at 11:00 UTC adds verified picks for the coming week and pushes.

## Workflow

```bash
npm test          # data checks, syntax checks, then a build into dist/
npm run rotate    # archive expired picks (--dry-run to preview, --now=ISO to test)
npm run preview   # serve dist/ on http://127.0.0.1:8080
npm run ig-card -- --tonight     # cover + one card per pick tonight (also --weekend, --pick <id>)
npm run badslava                 # refresh candidates/badslava-ny.json and print what's new
npm run heat                     # score demand per pick; sets demand (sold_out / going_fast) on picks.json
npm run eventbrite               # refresh candidates/eventbrite.json from registered rooms' organizer pages
```

1. Edit the JSON under `web/data/` or the pages under `web/`. Never edit `dist/`.
2. Run `npm test`. It fails on missing fields, duplicate IDs, non-https sources, bad dates, missing poster files, sitemap drift and syntax errors.
3. Commit with a message that says what changed editorially, and push to `main`.

GitHub Actions runs the same `npm test` on every push and pull request.

## Publishing

Cloudflare Pages (project `standupcomedynyc`) is connected to this repository's `main` branch. Each push builds with `npm run build` and deploys `dist/` to standupcomedynyc.com and www.standupcomedynyc.com, with the Pages Function providing `/api/subscribe`. A push to `main` is a public deployment.

To confirm what is live, compare a file hash rather than trusting labels:

```bash
curl -s https://standupcomedynyc.com/editorial.css | md5sum; md5sum web/editorial.css
```

## Instagram cards

`npm run ig-card -- --tonight` renders a Tonight cover and one card per pick into `web/assets/ig/`, so a push makes them public at standupcomedynyc.com/assets/ig/<id>.jpg, which the Instagram API needs. Cards are text-only in the site's style. Artwork is included only when its record in POSTER-SOURCES.json has `reuse: "granted"`. Paid listings are labeled on the card. Rendering needs a Chromium headless shell: set `IG_BROWSER` or let the script find one under `PLAYWRIGHT_BROWSERS_PATH` or `~/.cache/ms-playwright`. Rotation deletes cards for expired picks and past covers.

Posting: `npm run ig-post -- --tonight` publishes the cover plus tonight's cards as one carousel (`--story` for a story, `--pick <id>` for a single show, `--dry-run` to preview). It needs `IG_ACCESS_TOKEN` and `IG_USER_ID` in the environment, from a Meta app using the Instagram API with Instagram Login, and the cards must already be pushed so their URLs are public. Every post is appended to POSTED-IG.json and the same pick is refused twice in a day. `--refresh-token` extends the 60-day token; set `IG_TOKEN_FILE` to save it.

## Agents and crawlers

The build writes a Markdown edition of every section (index.md, this-week.md, rooms.md, open-mics.md, clubs.md, neighborhoods.md) plus llms.txt into dist/ from the same JSON. A Pages middleware returns the Markdown version of a page when the request prefers `text/markdown`, with a Link header pointing at it either way. `/.well-known/api-catalog` (RFC 9727 linkset) lists the JSON data files, and `web/_headers` sets their content types and open CORS on /data/. A real 404 page means unknown paths no longer return the home page with a 200.

## Newsletter

`web/subscribe.html` and `web/signup.js` post to `/api/subscribe`, which forwards to the public Listmonk subscription endpoint for the Stand Up Comedy NYC list. No secrets are involved; keep it that way.
