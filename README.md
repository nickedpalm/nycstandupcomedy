# Stand Up Comedy NYC

A curated, dated shortlist of NYC stand-up shows worth going out for, plus recurring bar rooms, open mics and the Manhattan clubs. Published at [standupcomedynyc.com](https://standupcomedynyc.com).

The site is static HTML, CSS and browser JavaScript. There is no database, no scraper and no server. Editors change JSON files, checks run, and a push to `main` publishes.

## Layout

```
web/                 the site as served (pages, editorial.css, scripts, assets)
web/data/            editorial data: picks, recurring, open-mics, clubs
functions/api/       Cloudflare Pages Function for POST /api/subscribe (Listmonk)
scripts/check.js     data and source checks run by `npm test` and CI
robots.txt, sitemap.xml
POSTER-SOURCES.json  provenance for every piece of artwork in web/assets/posters
DRAFT-NOTES.md, QA-NOTES.md, RECURRING-INTAKE.md, POSTER-INTAKE.md
                     editorial working notes, newest entries at the bottom
```

## Data files

| File | What it holds | Tier value |
|---|---|---|
| `web/data/picks.json` | Dated one-off shows on the home board. At most three are `featured` and need artwork. | `featured`, `special` |
| `web/data/recurring.json` | Weekly and monthly bar shows in the home sidebar. | `recurring` |
| `web/data/open-mics.json` | Open mics grouped by night on /open-mics.html. | `open-mic` |
| `web/data/clubs.json` | Manhattan clubs with policies on /clubs.html. | `club` |

Every record carries a `source_url` that was actually opened and a `verified_at` date. Unknown prices stay unknown; never guess. Picks expire from the board automatically once `ends_at` passes, so past shows can be deleted at leisure. Artwork must be official promotional material with a credit and a record in POSTER-SOURCES.json.

## Workflow

```bash
npm test          # data checks, syntax checks, then a build into dist/
npm run preview   # serve dist/ on http://127.0.0.1:8080
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

## Newsletter

`web/subscribe.html` and `web/signup.js` post to `/api/subscribe`, which forwards to the public Listmonk subscription endpoint for the Stand Up Comedy NYC list. No secrets are involved; keep it that way.
