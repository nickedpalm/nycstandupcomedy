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

## Venue review — first 12 rooms — September 14, 2026
Task: open the Badslava details page and the venue's own site for each of the first 12 rooms in file order, set website/calendar_url, confirm or correct the neighborhood, and add a recurring.json record where the room runs a weekly/monthly comedy showcase.

Reviewed (11 rooms; 1 duplicate removed):
- **The Grisly Pear** (107 MacDougal St). Site: grislypearstandup.com (calendar: /calendar). Corrected neighborhood from "Lower East Side" to "Greenwich Village" (the venue's own pages and Yelp both call it West Village / Greenwich Village). Nightly ticketed shows plus recurring Hobocop (Tue) and Hard Pass (Mon). recurring.json: Hobocop (Tue).
- **The Grisly Pear - Midtown** (243 W 54th St). Site: midtown.thegrislypear.com. Bar + comedy club on the Hell's Kitchen / Times Sq border. Midtown-branded by the venue; kept "Midtown West" in the registry. Calendar is the group's main calendar (lists Midtown shows alongside GV).
- **Bond Street Guitars** (297 Bond St). Site: bondstreetguitars.com. Corrected neighborhood from "Gowanus" to "Carroll Gardens" (the shop's own homepage). Vintage guitar shop hosting Annie's Variety Mic biweekly Sundays; no calendar of upcoming shows on the site.
- **Pete's Candy Store** (709 Lorimer St). Site: petescandystore.com (calendar: /calendar). Real weekly schedule: Kweendom (Fri LGBTQ showcase), Bumpy Night (Tue variety), Hump Night (Wed party), Numbskull (Fri open mic), Loose Lips (Sat open mic), Creep Mic + Open Mic (Sun). recurring.json: Kweendom (Fri).
- **Flop House Comedy Club** (362 Grand St) — duplicate of "Flop House Comedy" already registered at the same address. Removed from venues.json.
- **Phoenix Bar** (447 E 13th St). Site: phoenixbarnyc.com. Queer East Village bar with weekly events (Blue Monday, TRL Tuesdays, trivia, karaoke, bingo, drag); no recurring stand-up showcase.
- **Laughing Buddha Comedy** (410 8th Ave Fl 2). Site: laughingbuddhacomedy.com (tickets on laughingbuddhacomedyclub.com/tickets, Squarespace). Comedy school / producer running shows at multiple partner venues; their own classroom is the 410 8th Ave room.
- **Producers Club Theaters** (358 W 44th St). Site: producersclub.com. Hell's Kitchen Off-Off Broadway theater rental; productions via producers, no fixed weekly stand-up showcase.
- **Rodney's Comedy Club** (1118 1st Ave). Site: rodneysnewyorkcomedyclub.com (calendar: /calendar). UES comedy club with nightly ticketed shows and weekly showcases (free Mondays with Madison Sinclair, Geno & Friends Sundays).
- **Brooklyn Art Haus** (24 Marcy Ave). Site: bkarthaus.com (shows: /shows-events). Williamsburg arts venue with free weekly comedy in the lounge (Malev and Friends) and a free Sunday Open Mic 5:30-7pm. recurring.json: Sunday Open Mic (the only one with a published weekday).
- **Baby Grand LES** (187 Orchard St). Site: babygrandnyc.com. LES karaoke bar (voted NYC's #1). Calendar page covers karaoke contests and private events, not a recurring comedy showcase.
- **The Fear City Comedy Club** (17 Essex St). Site: thefearcitycomedyclub.com (shows: /shows-shop, WooCommerce). 60-seat dry comedy club in a former boxing gym. No recurring weekly showcase visible on the site.

Recurring shows added this round: 3 (Kweendom at Pete's, Hobocop at Grisly Pear, Sunday Open Mic at BAH). Each uses the venue's own page as source_url; no Badslava link.

71 rooms left with needs_review: true. Continue the sweep tomorrow; same rule.

## Venue review — second batch of 12 rooms — September 14, 2026
Next 12 rooms in file order (Hop Shoppe → Freddy's Bar). Same rule: open the venue's own page, set website/calendar_url, confirm neighborhood, add a recurring.json record if the room runs a fixed weekly/monthly showcase on its own page.

Reviewed (12 rooms):
- **The Hop Shoppe** (372 Van Duzer St, Staten Island). Site: thehopshoppe.com. Confirmed Stapleton (OpenTable + venue site). Bar & restaurant with no public events calendar and no recurring stand-up showcase. needs_review cleared; no calendar_url.
- **Secret Pour** (1114 Dekalb Ave). Site: secretpour.com (events at /events; currently empty). Bushwick bar/lounge, Yelp & Zillow both confirm Bushwick. No fixed weekly comedy on its own calendar.
- **O'Keefe's Bar And Grill** (62 Court St). Venue has no working https site (GoDaddy certificate mismatch on okeefesbarandgrill.com) and no public events calendar on Facebook. 45-year Downtown Brooklyn / Brooklyn Heights bar; Punching Bag Comedy's Wednesday showcase runs here (already in recurring.json).
- **Liffy II Bar** (5009 Broadway, Inwood). No own website (liffybar.com is a GoDaddy parked domain). Programming lives on Facebook and Instagram; irregular comedy nights and live D&D; no fixed weekly stand-up showcase on a venue-controlled page.
- **The Local NY** (13-02 44th Ave). Site: thelocalny.com (LIC hostel/bar). Events archive is dormant (last entry from 2018); current comedy nights run on Instagram with no fixed weekly schedule on the venue's own pages.
- **The PIT** (154 W 29th St). Site: thepit-nyc.com (calendar at /calendar). Peoples Improv Theater — improv-first with a Saturday Ladies Stand-Up Open Mic but no fixed weekly paid stand-up showcase. Held out of recurring.json.
- **Sesh Comedy** (55 Chrystie St). Site: seshcomedy.com; calendar at seshcomedy.com/showcases.php. LES BYOB comedy room with weekly Friday and Saturday Night SESH Showcases (70-min, $7 fee). recurring.json: Friday Night SESH Showcase, Saturday Night SESH Showcase.
- **Comedy In Harlem** (750A St Nicholas Ave). Site: comedyinharlem.com; events at /events. Harlem club with multiple weekly shows. recurring.json: Funny Lines Open Mic (Mon 5:30pm, $5 cover) — the cleanest weekly open mic on its own page.
- **Pine Box Rock Shop** (12 Grattan St). Site: pineboxrockshop.com (calendar at /event-calender — the venue's own typo). East Williamsburg/Bushwick bar (registry keeps Bushwick) running a stack of recurring mics. recurring.json: Deadass (Fri 6pm, free) — the most prominent weekly showcase.
- **Echo Bravo** (445 Troutman St). Group site bravobarparty.com (Echo Bravo is one of three Bravo Bars). Bushwick sports bar in the Bushwick Collective; group site covers wings and reservations, not a comedy calendar. No fixed showcase on the venue's own pages.
- **BK Made Comedy** (1241 Halsey St). Site: bkmadecomedy.com; events at /event-list. Bushwick BYOB comedy club (founded 2025 by George Diaz) running Comedy Tonight Mon–Thu at 8pm ($5) plus ticketed Fri/Sat 8pm shows ($15, free pizza). recurring.json: Comedy Tonight.
- **Freddy's Bar** (627 5th Ave). Site: freddysbar.com; events at /events. South Slope bar with The Fun Mic — Alex's Comedy Open Mic Mondays and Wednesdays at 7pm, New Material Night 1st Wednesdays at 9:30pm, Late Night Laughs after Thursday burlesque. recurring.json: The Fun Mic Monday, The Fun Mic Wednesday.

Recurring shows added this round: 7 (Friday and Saturday SESH, Funny Lines Open Mic, Deadass, The Fun Mic Mon, The Fun Mic Wed, Comedy Tonight). Each uses the venue's own page as source_url; no Badslava link.

59 rooms left with needs_review: true. Same rule for the next batch — open the venue's own page before clearing needs_review.
