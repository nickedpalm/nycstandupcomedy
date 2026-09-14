# Recurring shows and open mics — intake, 2026-09-11

Tier field added to every record: `featured` (3 pinned), `special` (11 dated one-offs) in picks.json; `recurring` in recurring.json; `open-mic` in open-mics.json. Clubs tier not started.

## Listed (checked against the source URL in each record)
Recurring: We Have Fun (Young Ethel's, Wed, free, Eventbrite); Bitches' Brew (Halyard's, Fri, price unknown, Eventbrite organizer page); Faculty Lounge (BCC Eris, Sun, ticketed, BCC show page); Bomb Shelter Comedy (The Gaf West, Thu/Sat, free, Eventbrite).
Open mics: Eiffel Tower Mic and Weirdos (BCC pages); Cuckoo's, Thursday Night Mic, Lifeboat (SoHo Playhouse); New York Comedy Club x2 locations (club page); QED Astoria (venue collection page); The Tiny Cupboard (venue sign-up page).

## Conflicts noted in the data
- Faculty Lounge: BCC overview page lists it under Thursdays; its own show page says every Sunday 8:30pm. Show page used.
- Weirdos: BCC homepage said Wednesday, overview said Friday, mic page says Friday with Sep 11 as the only listed date. Cadence marked "check calendar".
- Eiffel Tower Mic: homepage said Saturday, overview said Sunday, mic page says every Tuesday (matches the jams page). Mic page used.

## Held out (do not add without confirming)
- Stand Up NY open mic: page shows "OPEN MIC CANCELLED"; unclear scope.
- Whiplash (UCB, Mondays 10pm): ucbcomedy.com returned 403 to the fetcher.
- Not Ripe Bananas (West Side Comedy Club, Tue 8pm) and the club's mic: calendar page returned no readable content.
- Nevermind (Williamsburg Comedy Club, Thu 6pm), Vig Bar Sundays, Iggy's Tuesdays, Hell Yeah Comedy, Training Day: only seen on aggregators (nycforfree.co) or Instagram; no official page read.
- BCC weekly improv shows (Demon Time, The Good Time, etc.): real and weekly but improv; excluded from a stand-up-first rail for now.
- Littlefield calendar returned empty to the fetcher.

## Rechecks needed before publication
Every record has `verified_at: 2026-09-11`. Prices marked unknown stay unknown. Bomb Shelter and We Have Fun listings do not show specific upcoming dates; confirm the show is still running before each edition.

## Clubs tier — 2026-09-11
clubs.json (tier `club`, 7 entries) and /clubs.html. Each entry records the club's own policy page as source_url with a verified_at date. The page cross-references picks.json by venue name and shows "On our board" links when a club has a pick.

Read directly from club sites: Comedy Cellar (reservations + contact pages), New York Comedy Club (FAQ), Gotham (purchase policy), Stand Up NY (FAQ), Broadway Comedy Club (about; no policy page found).
Flagged in the record, recheck before publication: The Stand (site returned 403; details from search excerpts of its FAQ), West Side Comedy Club (FAQ page returned empty; details from search excerpts).
Held out: The Comedy Shop (domain did not resolve), Greenwich Village Comedy Club and Eastville (not researched yet). BCC, QED, Union Hall, Bell House, Caveat are treated as theaters/bar rooms, not clubs.
Ticket prices are only stated where the club publishes them (Comedy Cellar by night; The Stand approximate; Gotham a floor from one listing). Others say "see the show page".

## Venue and room sweep — 2026-09-14
Nick's TASK-VENUE-SWEEP.md (Sep 14): register Brooklyn rooms, fill in missing Manhattan clubs, then add bar-show/alt-room recurring shows. No scraper; managed browser only. Every record gets a source URL I opened and a `verified_at` date.

### Registered (venues.json)
Every new entry carries `calendar_url`, `source_label`, `verified_at: 2026-09-14` and an `access_note`.

Brooklyn:
- Bushwick Comedy Club, 259 Melrose St, Bushwick (Wix; calendar at homepage — `/calendar` returns 404).
- Greenpoint Comedy Club, 66 Greenpoint Ave, Greenpoint (Squarespace-style; Showtimes/FAQ subpages return 404, listings live on the home grid and on Jump Comedy).
- Flop House Comedy, 362 Grand St, Williamsburg (Squarespace; formerly "Williamsburg Comedy Club" per the brief).
- Eastville Comedy Club, 487 Atlantic Ave, Boerum Hill — NOT the East Village despite the name.
- Comedians You Should Know (Brooklyn), 200 N 14th St, Williamsburg (Gutter Bar — see note below).
- Brooklyn Improv, 64 N 9th St, Williamsburg (Main Room + The Lab).
- Punching Bag Comedy, 62 Court St, Downtown Brooklyn (run out of O'Keefe's bar).

Manhattan (missing from registry):
- The Comedy Shop, 167 Bleecker St, Greenwich Village (BentoBox site; the clubs.html note that the domain did not resolve was wrong).
- Comic Strip Live, 1568 Second Ave, Upper East Side (plain fetcher blocks the site; opens in the managed browser).
- Greenwich Village Comedy Club, 99 MacDougal St, Greenwich Village (above the Comedy Cellar).

Added `calendar_url` and `access_note` to every pre-existing venue that did not already have them.

### Recurring shows added (recurring.json)
- Brooklyn Power Hour (Eastville Comedy Club, every Friday 6pm, from $20). Source: eastvillecomedy.com/shows/brooklyn-power-hour ("RECURRING SHOW", 41 listed dates).
- Comedians You Should Know (Greenpoint Comedy Club, every Wednesday 8pm, doors 7:30pm, 1-item minimum). Source: jumpcomedy.com/b/greenpointcomedyclub. CYSK moved to GCC from the Gutter Bar in May 2026 (per Instagram). CYSK's own site still shows only the old Gutter Bar history, so the GCC/Jump calendar is the source of record. The `Comedians You Should Know (Brooklyn)` venue record still points to 200 N 14th St for now because that's where the listing pages reference; revisit after the move settles.

### Held out (with reasons)
- **House of Yes, 2 Wyckoff Ave, Bushwick** — task brief: "only if it runs comedy regularly." Variety/cabaret/burlesque nightclub (Dirty Circus); no regular stand-up bill. Not registered.
- **Carolines on Broadway** — closed end of 2022 per Variety/Reddit/Wikipedia. Held out per the brief.
- **BoogieManja (Brooklyn Improv The Lab, Thursdays 7pm)** — real and weekly but sketch comedy (not stand-up); excluded from a stand-up-first rail (same rule as the BCC improv shows). Source: improv.com/brooklyn/comic/boogiemanja/.
- **Punching Bag Comedy (O'Keefe's, Wednesdays 7pm)** — every Wed confirmed via Instagram/Facebook posts, but no own website and the Eventbrite organizer page did not resolve. Held out until an opened source URL is available.
- **Town Hall Tuesday / 9:30 Comedy Show (Flop House)** — both show up on the Flop House calendar and Eventbrite but on sporadic dates, not confirmed weekly.

### Notes for follow-up
- Eastville's neighborhood was wrong in the prior intake (clubs.html "NOT LISTED YET" mentioned it as Eastville without context). The club is at 487 Atlantic Ave in Boerum Hill, Brooklyn — not the East Village.
- Eastville runs an "Open Mic" page (open-mic schedule). Not added to open-mics.json yet — pending a real page read.
- BCC's two venues are at 167 Graham Ave (Eris Mainstage + Eris Deep Space) and 144 Boerum St (BCC Pig Pen). BCC's own site calls the area "East Williamsburg"; the registry keeps "Williamsburg" to match the existing recurring/open-mic records. The venue check would otherwise fail those records.
- Bushwick Comedy Club's calendar URL is the homepage (the `/calendar` slug returns 404).
- Greenpoint Comedy Club's "Showtimes & Tickets" and FAQ subpages return 404; the live calendar lives at jumpcomedy.com/b/greenpointcomedyclub (the venue's ticketing partner).


## Badslava as a discovery source — September 14, 2026
`npm run badslava` pulls the New York open-mic table (badslava.com, crowd-sourced, "call before you haul") into candidates/badslava-ny.json: one entry per venue, weekday and start time, flagged whether the venue is already in open-mics.json or venues.json, and it prints what is new since the previous pull. First pull: 301 slots across the coming week; 12 venues already listed. Rule: a Badslava row is a lead, not a source. Before a mic enters open-mics.json, open the venue's own page or listing, register the venue in venues.json, and record that page as source_url.

## Badslava rooms registered for review — September 14, 2026
83 rooms from the Badslava New York table added to venues.json with needs_review: true (address from Badslava, neighborhood assigned from the address, badslava_url kept). Out-of-city rooms (Long Island) and obvious non-venues were left out; Badslava names that are aliases of registered rooms (NYCC rooms, The Stand, Halyard's, Tiny Cupboard, Sesh's bigger room) were not duplicated. Review rule per room: confirm the neighborhood, find the venue website and its events page (website, calendar_url), and note whether it runs weekly or monthly showcases; those become recurring.json records with the venue page as source. The check warns while any room is unreviewed.
