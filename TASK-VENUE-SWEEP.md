# Task: venue and room sweep (from Nick, September 14, 2026)

Read README.md and CLAUDE.md first. This task is done inside the existing static site. Do NOT rebuild a scraper, do not create scrapers/ or shows.json, do not add axios, cheerio or Puppeteer, and do not ask where a scraper should run. The repo has no scraper by design; you are the editor and the Nous managed browser is your research tool.

## 1. Register every venue in web/data/venues.json
For each room below, open its site in the browser and add a record: name, address, neighborhood, borough, calendar_url (the page that lists upcoming shows), source_label, and an access note (loads plainly / needs the managed browser / Eventbrite / Squarespace). Confirm the room is currently operating; drop anything closed (Carolines closed in 2022; "Williamsburg Comedy Club" is now Flop House Comedy).

Manhattan clubs from the original plan: Comedy Cellar, Gotham, The Stand, New York Comedy Club (all three rooms), Comic Strip Live, West Side, Stand Up NY, Broadway Comedy Club, The Comedy Shop, Eastville is Brooklyn.
Brooklyn: Bushwick Comedy Club, Greenpoint Comedy Club, Flop House Comedy, Eastville Comedy Club, Brooklyn Comedy Collective, Comedians You Should Know, The Bell House, Littlefield, Union Hall, Young Ethel's, Halyard's, The Tiny Cupboard, Brooklyn Improv Theater if it exists, House of Yes only if it runs comedy regularly.
Nick asks specifically: what is in Downtown Brooklyn? Find out and register anything real. Neighborhood must be the real one for the address (Young Ethel's is South Slope, Halyard's is Gowanus).

## 2. Bar shows and alt rooms go in recurring.json
A weekly or monthly show at a bar or alt room is a recurring record: id, title, venue (must match venues.json), neighborhood, weekday (0=Sunday), cadence, time_label, price_label, source_url you opened, source_label, verified_at, tier "recurring", one original sentence. Open mics go in open-mics.json with the fields already used there. If a room only publishes dated one-offs, those are picks, not recurring records.

## 3. Artwork
Official promotional images are downloaded into web/assets/posters/ and recorded in POSTER-SOURCES.json with source_url, credit, alt, dimensions, sha256, retrieved_at and reuse_status, following POSTER-INTAKE.md. Never hotlink an image. Artwork is only used for the three featured picks on the home board. Do not add artwork for every show.

## 4. Verify, test, ship
Every record needs a source you opened and a verified_at date. Run `npm test`; the venue check will fail on any venue not in venues.json or any neighborhood that disagrees. Commit in small batches ("Register Brooklyn rooms", "Recurring shows: Bushwick and Greenpoint") and push after each; a push publishes. Append a dated note to RECURRING-INTAKE.md listing what you registered and what you held out and why. Then send Nick a short Telegram summary.
