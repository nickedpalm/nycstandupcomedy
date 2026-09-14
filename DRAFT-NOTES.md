# Skint-inspired editorial draft — September 11, 2026

Custodian: Codex / Nick. Isolated branch codex/skint-editorial-draft, based on production source 77097aa. Uncommitted changes are intentional review work: five HTML routes, editorial.css, picks.js, data/picks.json, and these notes. No pre-existing edits were present; nothing pushed or deployed.

The homepage presents a dated, original comedy shortlist. Fourteen September 12–17 events now fill the calendar, with source links in picks.json. Unknown prices are not guessed; only the $10 Funny Pages price is eligible for the $15 filter. Funny Pages has no verified ending time, so its end_time_confirmed=false record uses an undisplayed end-of-day expiry cutoff. The nine new Union Hall/Bell House records also use an undisplayed end-of-day expiry cutoff with end_time_confirmed=false; other original event end times come from ticket-page evidence.

All routes use the editorial theme. Best/neighborhood views share the current shortlist, replacing February sample listings. The old comedian database and dead links give way to current event sources. Newsletter signup is explicitly unavailable until a real opt-in service is connected; the previous mock-success form was removed. No subscribers are collected and no sponsorship/affiliate system is live.

Validation: npm run build passed; node --check web/picks.js passed; data IDs, HTTPS source links, timestamp order, price types, built route/assets, and sitemap XML checked. Local homepage returned HTTP 200. Browser interaction/visual QA has not been performed. Local preview: http://127.0.0.1:8766/ while its development server remains active.

Mazzie has a copy under /opt/data/profiles/comedy/workspace/drafts/skint-20260911/site and the editorial/business guide in the workspace. Her normal production-based checkout remains separate. Compare edits before integrating. The business model is proposed sponsorship-funded curation plus a repeat-reader email audience, not a claim of current revenue or advertiser commitments.


## Comedy Cellar reference revision — September 11, 2026
Design reference inspected: https://web.archive.org/web/20171128152633/http://www.comedycellar.com/
Adapted brick backdrop, wood-toned header, warm amber palette, printed poster hierarchy and ticket treatment. Original site branding and generated brick texture; no Comedy Cellar logo or performer photos reused. All five routes updated. Previous draft web files preserved at /private/tmp/comedy-before-cellar/web. Local review only; no production deploy.
Funny Pages Eventbrite ID has conflicting title evidence. Replaced direct ticket URL with corroborating StayHappening event listing; direct ticket identity remains unverified.

## Cafe intranet refinement
Nick asked for a coffee-shop intranet feel. Shifted the existing draft toward a neighborhood bulletin board: muted green, warm paper, mixed flyers, practical monospace labels, quieter serif titles, and mailing-list navigation. Existing routes, filters, and saved picks remain. No fictional cafe services or community activity added. Local review only.

## Real poster pass
Added three official promotional assets with source captions, full-size links, lazy loading and preserved proportions. See POSTER-SOURCES.json and POSTER-INTAKE.md. No Instagram embed or newsletter subscription is configured. Funny Pages source_url now points to the corroborating secondary listing; the disputed old URL is retained explicitly as disputed_source_url.

## Fuller calendar design pass
Expanded to 14 shows across Lower East Side, Williamsburg, Park Slope and Gowanus. Home has three featured flyers above compact dated rows; seven listings have official promotional artwork. Neighborhood filtering, result counts and a room index use the same data. Union Hall and Bell House newsletter leads were checked against public venue calendars and linked ticket pages. LAUGH is held out because its ticket location says TBD. Unknown prices stay unknown. Images retain original proportions; undated art is identified in POSTER-SOURCES.json.

The build, JavaScript syntax, whitespace, unique IDs, date ordering, source links, artwork files and page hooks passed checks. Browser visual and interaction QA remains outstanding. This is a manually curated local review dataset, not a subscription or automated ingestion service.

## Spacing and QA fix pass — September 11, 2026 (applied on the VPS copy)
Claude ran headless-browser QA (see ../QA-NOTES.md) and, at Nick's request, applied to this copy: a spacing block at the end of editorial.css (looser day groups, separated listing rows, roomier shelf and sidebar, 40px tap targets on nav and row actions); a pluralization fix for the result counter; and skipping the listing thumbnail for landscape artwork (poster width > height), which was unreadable at 80px. Pinned flyers and "Flyer source" links are unchanged. Verified: no overflow at 1280/390, no console errors, counter reads "1 neighborhood", no sub-24px targets. The Mac draft was byte-identical before this pass; the same two files are staged on the Mac at ~/comedy-spacing-20260911/web/ for copying into the draft. Nick's IA direction from this review: a featured tier for one-off concept shows and special events, then recurring weekly/monthly bar shows, then open mics, then clubs. Not built; data has no tier field yet.

## Tiers, recurring rooms and open mics — September 11, 2026
Added `tier` to all picks (featured/special). New data files: recurring.json (4 weekly bar stand-up shows) and open-mics.json (9 entries, 6 rooms), each checked against the venue or organizer page named in the record; see ../RECURRING-INTAKE.md for conflicts and hold-outs. New route /open-mics.html groups mics by night with where/cost/sign-up/set/formats/age and a "checked" date; nav link added on all pages and sitemap updated. Home sidebar gains a WEEKLY & MONTHLY ROOMS rail from recurring.json (board.js). Verified at 1280/390: no overflow, no console errors, no sub-24px targets. All changed files are staged on the Mac at ~/comedy-spacing-20260911/ (mirrors web/ layout plus sitemap.xml).

## Clubs tier — September 11, 2026
Added clubs.json (7 Manhattan clubs, tier `club`) with address, rooms, ticket range where published, minimum, age, getting-in rules, an original one-line room description, calendar link and policy source with a checked date. New route /clubs.html (clubs.js) lists them and cross-links any current picks at that venue. CLUBS added to the nav on all pages and to the sitemap; home rail links to both Open mics and Clubs. Two entries (The Stand, West Side) carry a verification note because their sites blocked the fetcher. Verified at 1280/390: no overflow, nav wraps to two rows on mobile, no console errors, no small targets. Staged on the Mac at ~/comedy-spacing-20260911/.

## Daily edition refresh — September 12, 2026
Kept the 14 Sep 12–17 picks from the previous pass and added 9 verified Sep 18–24 specials (tier `special`): A Drinking Game NYC: Practical Magic and Sam Taggart: Special Taping at the Bell House Sep 18 / 19; Sophie Buddle at Union Hall Sep 18; Fun in Moderation: Sketch Comedy at Caveat Sep 19; Josh Sharp crowd-work hour and Obey in Advance book launch Sep 20; Climate Town & Amy Westervelt at Bell House Sep 21; David Nihill's Taking Tangents Tour at Bell House Sep 23; and Vidura Bandara Rajapaksa: The Paradise Gothic Tour at Bell House Sep 24. Each new entry has a source_url actually opened today (Bell House calendar, Caveat events page, Union Hall calendar). Featured tier still capped at 3 (Vampire Movie, Quacks & Whacks, Rainbow Riot), since no new entries had official artwork downloaded.

## Faculty Lounge recheck — September 12, 2026
The recurring intake flagged a Thursday-vs-Sunday conflict for Faculty Lounge. Re-checked the Sep 20 event page directly: BCC shows Faculty Lounge on Sundays at 8:30pm in Eris Deep Space, doors 8:15pm, tagged "Stand-up", "brand new weekly stand up show". The show page is authoritative; recurring.json's verified_at and note updated to reflect today's check, source_url switched to the live Sep 20 slug.

## Stale noscript text — September 12, 2026
Replaced the dated Sep 12/13 sentence in index.html, best.html, and neighborhoods.html `<noscript>` tags with a generic, evergreen line that points readers at the Union Hall, Bell House, and Caveat calendars — so the no-JS fallback no longer names specific past dates.

## Held-out notes — September 12, 2026
Michelle Buteau at Bell House Sep 22 is shown as SOLD OUT on the venue calendar; not added to the board until it returns from the venue. Taylor Tomlinson: Tries Out New Ideas at Union Hall Sep 18 10pm shows as sold out via bandsintown and the *cancelled* slug appears next to a Sep 17 Union Hall record, so neither date was added. NYC Comedy Festival 2026 lead is in NEWSLETTER-SOURCES.md but not added as a pick yet (no dates cross-checked).

## Comedy Cellar pass — September 12, 2026
Nick asked for the live site to look more like the 2017 Comedy Cellar homepage (https://web.archive.org/web/20171128152633/http://www.comedycellar.com/). Added a final override block in editorial.css: gold-and-red wordmark, orange marquee bill, dashed ticket-stub link, Oswald condensed headings, Permanent Marker hand-lettered arrow links and red buttons, CSS-generated crumpled-paper panels, red torn-edge section bars, flyers straight on the brick, a stenciled venue-name band over dark wood above the footer. Google Fonts (Oswald, Permanent Marker) linked in every page head. Still original branding: no Comedy Cellar logo, photos, or copy. Verified at 1280 and 390: no overflow, no console errors, fonts load.

## Repository reorganization — September 13, 2026
Committed Mazzie's morning data edits (five Sep 21–27 picks; The Stand and West Side policies reverified in a browser). Removed the legacy scraper, SQLite database, Node server, Vercel config, stale shows.json, the pets-browser gitlink and 12,450 tracked node_modules files; tagged the prior state pre-reorg-20260913. Added scripts/check.js (run by `npm test` and by GitHub Actions on every push and pull request), a real .gitignore, a README describing the editorial workflow, and a shorter CLAUDE.md. Two poster records (Vampire Movie, Emil Wakim) now refer to expired picks; the check warns so they can be retired. Cloudflare's Git integration remains the publication path; removing the gitlink unblocks it.

## Revolving board — September 13, 2026
Added scripts/rotate.js (`npm run rotate`) and a daily 09:15 UTC GitHub Actions job that archives expired picks into web/data/archive/YYYY-MM.json, moves their artwork to web/assets/posters/archive/ and commits. Restored the four Sep 12 picks that had been deleted (Modern Whitney, Funny Pages, Emil Wakim, Improvised Vampire Movie) so the archive starts complete; their two posters moved with them. The check now warns on a thin or stale board and on expired picks left in picks.json.

## Tonight-first home page — September 13, 2026
Home now leads with the flyer shelf (paid listings first, tagged "Paid listing", then editor's picks, max four), then a dated TONIGHT block listing today's picks at larger size, the signup strip, THIS WEEKEND (hidden when the weekend has passed) and COMING UP by day. The Tonight and This weekend filter buttons were removed; neighborhood, $15 & under and Saved still apply to all sections. On a night with no picks, Tonight lists that weekday's recurring rooms and open mics from the existing data. New optional pick field `sponsored: true` (checked: needs https ticket_url and artwork). Verified headless at 1280 and 390: no overflow, no console errors, no sub-24px targets; empty-night and paid-card states exercised against a modified built copy.

## Instagram card renderer — September 13, 2026
Added scripts/ig-card.js (`npm run ig-card`): 1080x1350 JPEG cards in the bulletin-board style, a Tonight/This weekend cover plus one card per pick, written to web/assets/ig/ so Cloudflare hosts them for the Instagram API. Text-only unless a poster record carries reuse: "granted"; all current artwork is unlicensed for reuse so no flyers appear. Fonts bundled locally (Oswald OFL, Permanent Marker Apache) and embedded at render time. playwright-core is a devDependency; the browser is the headless shell already present in Mazzie's container. Rotation now removes cards for expired picks. Publisher and Mazzie's posting job wait for the account and token.
Publisher added the same day: scripts/ig-post.js (`npm run ig-post`) posts a Tonight carousel, single-pick images or stories through graph.instagram.com, logs to POSTED-IG.json and refuses duplicates. Dry-run verified; no live post yet because the Meta developer registration is blocked by Facebook's new-device rule on Nick's Mac (email is now on the account; retry from phone or after a few days).

## Home page reverted — September 14, 2026
Nick preferred the previous board, so the Tonight-first layout (Tonight block, This weekend, Coming up, paid-first shelf) is reverted. The home page is back to the pinned flyer shelf plus the dated board with Tonight / This weekend as filters. Rotation, checks, Instagram cards and publisher are unchanged. The `sponsored` pick field is no longer rendered; re-add a paid slot to this layout if wanted.

## Venue registry — September 14, 2026
Nick: every venue carries a neighborhood as a layer of site logic. Added web/data/venues.json (23 rooms with address, neighborhood, borough). picks.js and board.js now take the neighborhood from the registry by venue name; the record's own field is only a fallback. check.js fails on unregistered venues or neighborhood/address disagreements. Corrected Young Ethel's (506 5th Ave, 12th–13th St) from Park Slope to South Slope; Halyard's was already Gowanus. Open-mic records for New York Comedy Club now name the room (Midtown / East Village) to match the registry.

## Living flyer shelf — September 14, 2026
Nick wanted the animated-poster feel of the 2017 Comedy Cellar site. The pinned shelf now holds three slots and cycles through every upcoming pick with artwork (featured first), crossfading one slot every 6 seconds; each flyer drifts slowly (Ken Burns) with staggered timing. Cycling pauses on hover, focus and hidden tabs; prefers-reduced-motion disables drift and transitions but keeps the swap. Image files are untouched; this is presentation only. Verified headless at 1280 and 390 against a five-poster copy: slot swap observed, no overflow, no console errors.

## Landscape thumbnails — September 14, 2026
Every poster currently on the board is a wide crop (Eventbrite and Union Hall serve 2:1), and the listing rows had skipped landscape art since the Sep 11 spacing pass. Rows now show landscape art as a 150px-wide thumbnail (110px under 700px, 96px under 400px) instead of nothing. Verified headless: six thumbnails at 1280 and 390, no overflow, no errors.

## Sidebar rooms by night — September 14, 2026
With 15 recurring rooms the WEEKLY & MONTHLY ROOMS rail is now grouped by night, starting with Tonight and Tomorrow, then the rest of the week in order; rooms sort by start time within a night, and "Every X" cadences are dropped from the detail line since the heading says the night. Monthly cadences still show. Verified headless: seven night headings, 15 rooms, no errors.

## Agent-readable edition — September 14, 2026
isitagentready.com scored the site Level 2 (Bot-Aware); the missing piece for Level 3 was Markdown content negotiation, and most other "failures" were the SPA fallback returning the home page for unknown paths. Added: a styled 404.html; scripts/markdown.js building a Markdown edition of every section plus llms.txt at build time; functions/_middleware.js serving it for Accept: text/markdown with Vary and Link headers; /.well-known/api-catalog listing the JSON data; _headers for content types and CORS on /data/. Verified in wrangler pages dev: negotiation, 404 status, catalog type, signup unaffected.

## Neighborhood layer, Eventbrite leads, artwork spread — September 14, 2026
Nick: only four neighborhoods showed. Cause: the filter and the Neighborhoods page were built from this week's picks only. Now the home filter lists every neighborhood in venues.json by borough ("rooms only" when no dated pick), the empty state links to that neighborhood's rooms, and /neighborhoods.html (areas.js) is a directory of all 46 neighborhoods across the five boroughs with this week's picks, weekly rooms, open mics and every room. Eventbrite added as a lead feed matched to rooms: venues.json gains eventbrite_organizer (six rooms so far), scripts/eventbrite.js reads those organizer pages and each event's JSON-LD into candidates/eventbrite.json, flagged already-a-pick or new. Pulled 16 more flyers (Caveat via Eventbrite, Bell House via its own site) so 22 of 26 picks have art, and the shelf now alternates venues so three Union Hall flyers no longer sit together. Fixed a phone-width overflow from the shelf's negative margin. Mazzie's persona and daily job updated: run both lead feeds, register organizer pages, never guess a neighborhood.

## Cache-busting — September 14, 2026
Nick saw the new Neighborhoods page painted with the old stylesheet: Cloudflare serves CSS and JS with a four-hour cache, HTML with none, so a redesign could load against stale styles. scripts/stamp.js now rewrites every stylesheet and script reference in the built HTML with a content hash (?v=…) during npm run build, so changed assets get a new URL on the next page load.
