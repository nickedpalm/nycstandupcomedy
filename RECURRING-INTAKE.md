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

## Filing rule — September 14, 2026
Open mics live in open-mics.json (tier open-mic); recurring.json is for weekly and monthly shows with a lineup. Four mics from the first Badslava review batch (Brooklyn Art Haus Sunday mic, Funny Lines at Comedy In Harlem, The Fun Mic at Freddy's Mon and Wed) were moved accordingly. The check now fails a recurring record whose title says "open mic".

## Venue review — third batch of 12 rooms — September 14, 2026
Next 12 rooms in file order (Suite → Otto's Shrunken Head). Same rule: open the venue's own page, set website/calendar_url, confirm neighborhood, add a recurring.json record if the room runs a fixed weekly/monthly showcase on its own page; add an open-mics.json record for open mics on the venue's own page.

Reviewed (12 rooms; 0 duplicates removed):
- **Suite** (992 Amsterdam Ave). Site: suitenyc.com. Gay pub with an entertainment schedule (Weds/Fri/Sun) but no dedicated events page; Badslava's "Femmes And Friends" Monday open mic is not on the venue's own site. Held out of recurring.json and open-mics.json.
- **Good Judy** (563 5th Ave). Site: goodjudybk.com. **Corrected neighborhood from "South Slope" to "Park Slope"** — the venue's own Instagram bio and Yelp both call the area Park Slope. /events returns 404; the Blue Room hosts drag and karaoke; Badslava's "Freak Latte" Monday open mic is on Instagram only. Held out of recurring.json and open-mics.json.
- **SkyBox Sports Bar** (2241 1st Ave). Site: skyboxsportsbareastharlem.com. East Harlem's first woman-owned sports bar. The site's homepage "What's Happening" carousel lists "Laugh Out Loud Mondays — Monday Comedy Night & Open Mic" every Monday at 8 PM. **open-mics.json: Laugh Out Loud Mondays** (venue's own homepage as source_url).
- **Zofia's Hideout** (301 E 84th St). No own website (Facebook + Instagram only). Tiki speakeasy opened recently replacing "Not a Speakeasy." Programming (80s Dance Party, Tiki nights) lives on Facebook/Instagram. Held out — no venue-controlled source.
- **The Wild Goose** (5420 Roosevelt Ave). Site: wildgoosenyc.com. The "Sunnyside / Woodside" neighborhood call is from the venue's own homepage. Upcoming Events widget shows "No upcoming events." Live music on weekends only; no stand-up on the venue's own site.
- **The Cobra Club** (6 Wyckoff Ave). Site: cobraclubbk.com. Bushwick rock bar ("Just off Jefferson L stop in Bushwick"). /events returns 404; upcoming programming on Instagram. Past Facebook posts had Monday open mic + Tuesday stand-up but no fixed weekly showcase currently listed on its own site.
- **Freda** (801 Seneca Ave). Site: barfreda.com. Ridgewood dive bar; **corrected address** from "8-01 Seneca Ave #801" to "801 Seneca Ave" per the venue header. Events page is Wix dynamic content (does not render as static); comedy nights appear (Comic Book Cabaret, All Show No Boat, Bad Jazz) but none with a published weekly cadence on the venue's own page.
- **Red Eye NY** (355 W 41st St). Site: redeyeny.com; **calendar at /events/**. Hell's Kitchen queer coffee bar + nightclub (Yelp lists Midtown West / Hell's Kitchen / Theater District; kept Hell's Kitchen). Full WP events calendar with weekly Monday **Crash Landing Comedy** (open-mic stand-up hosted by Ashley Ryan, 8 PM, no cover) and weekly Saturday Vogue with Jason Rodriguez. **open-mics.json: Crash Landing Comedy** (venue's own event page as source_url). Vogue is a ballroom/vogue night, not stand-up, so held out.
- **Area 140 First Bar** (140 1st Ave). Site: area140first.com. East Village dive ("classic dive bar in the East Village" per the venue's own homepage). /events lists Rock and Roll Live Karaoke (12/12/24), the 2024-25 Ipswich Town soccer schedule and Live Rock Band Karaoke every Thursday — all stale or non-comedy. No recurring stand-up.
- **Grove 34** (31-83 34th St). Site: grove34.com. **Astoria dedicated comedy club** with multiple weekly shows. Show pages confirm **Grove Comedy** weekly Fridays 7:30 PM (Sep 18, Sep 25; Oct 16 is the "Grove Comedy Live!" special). Roast Battle League NYC also runs weekly (Sep 16, Sep 23, Sep 30). **recurring.json: Grove Comedy (Fri 7:30 PM)**. Roast Battle and the Sounds Funny / Improv Night / Great Improv Experiment slots are weekly too but are not the headline showcase; revisit when the venue gives them stable show-page URLs.
- **The Windjammer** (552 Grandview Ave). **No own website**. Programming is run by Footlight Underground (footlightunderground.com — "Footlight Underground at The Windjammer"), which lists weekly Monday "The Joy of Ranting" mixed-medium open mic 9 PM (sign-up 8:45) and weekly Tuesday Open Mic Comedy 8 PM on its own calendar. Held out — operator site is not the venue's own page, same rule that held out Punching Bag at O'Keefe's.
- **Otto's Shrunken Head** (538 E 14th St). Site: ottosshrunkenhead.com. Old static site; /events returns 404. NYC Tourism describes it as rockabilly / comedy / burlesque, but the live schedule is on Facebook and Instagram (@ottosnyc). No own calendar lists a recurring weekly showcase.

Corrections this round:
- Good Judy: South Slope → Park Slope.
- Freda: address simplified to "801 Seneca Ave".
- Red Eye NY: address dropped the period ("355 W 41st St").

Recurring shows added this round: 1 (Grove Comedy at Grove 34).
Open mics added this round: 2 (Laugh Out Loud Mondays at SkyBox, Crash Landing Comedy at Red Eye NY).

46 rooms left with needs_review: true. Same rule for the next batch — open the venue's own page before clearing needs_review; open mics go in open-mics.json, not recurring.json.

## Venue review — fourth batch of 12 rooms — September 14, 2026
Next 12 rooms in file order (The Throwback → Teddy's F&B Bar & Grill). Same rule: open the venue's own page, set website/calendar_url, confirm neighborhood, add a recurring.json record if the room runs a fixed weekly/monthly showcase on its own page; add an open-mics.json record for open mics on the venue's own page.

Reviewed (12 rooms; 0 duplicates removed, 0 open-mic/recurring added):
- **The Throwback** (710 Amsterdam Ave, UWS). Site: thethrowbacknyc.com (SpotHopper-built). UWS sports bar with memorabilia, daily Happy Hour, full menu. Badslava's "The Throwback Mic" is a monthly Tuesday 4:30-6:30pm open mic run by Ross Belsky via @error404theater_boy on Instagram, not on the venue's own site. Held out.
- **The Rose** (160 W 25th St, Chelsea). Site: therosenyc.com; calendar at /calendar (events iframe). Chelsea neon-pink cocktail bar with upcoming shows (Supa Grind Mode 2 Thu Sep 17, NYC's Most Eligible Bachelorettes Mon Sep 21). Badslava's biweekly Tuesday "Top Secret Mic" is not on the venue's own page.
- **Lust77 bar&grill** (2363 Adam Clayton Powell Jr Blvd, Harlem). **No own website** (Badslava lists no venue URL); Tuesday 6pm open mic is via producer TE Adams's Instagram (@te_adams). No venue-controlled source.
- **Silvana** (300 W 116 St, Harlem). Site: silvana-nyc.com exists but renders only the nav (subpages /calendar and /about return 404). Female-performer Tuesday open mic "Off The Clock" is a third-party Funny Hunnyz production promoted via @funnyhunnyz and funnyhunnyz.com, not on the venue site.
- **Room 52** (212 E 52nd St, Midtown East). Site: room52nyc.com. Private event speakeasy built in 1902 ("The Room With A Past") — venue for hire, not a regular comedy stage. Badslava's Tuesday 6pm free open mic ("Open to all creators and innovators") is not on the venue's own page.
- **iNine Bistro** (53 Bruckner Blvd, Mott Haven). Site: ininebistro.com; events at /events. Afro-fusion bistro (Caribbean / West African). Events page covers private celebrations (Birthday Table, Signature Celebration $110/guest, Milestone VIP, bottle service). No comedy listings on the venue site; Badslava's "Taco Tuesday" weekly open mic (Tue 6:30pm signup / 7:30pm show, one-item minimum, signup closes at 10 performers or 8:30pm) is a third-party Comedy on purpose listing.
- **The Duplex** (61 Christopher St, West Village). Site: theduplex.com. World-famous Piano Bar + Drag Room cabaret. Site lists Happy Hour Mon-Thu 4-7pm and the upstairs/downstairs rooms but no events calendar. Badslava's "Suddenly Stand Up" Tuesday open mic (6:30-8:30pm, hosted by Danny McWilliams, 2-drink minimum at happy-hour prices) is not on the venue homepage.
- **Block Hill Station** (718 5th Ave, Greenwood Heights). Site: blockhillstation.com. Craft beer bar with deep tap list and signature cocktails; nav is just Home + Contact. No events page. Badslava's "Peer Pressure" Tuesday weekly open mic (7:30pm, one-drink minimum, @peerpressurecomedy) is not on the venue site.
- **Comedy Village** (352 W 44th St, Hell's Kitchen). Site: comedyvillage.com; events at /events/. Real Times Square / Hell's Kitchen / Theatre District comedy club running ticketed "Times Square Comedy" shows every night ($22-28). Each show is a dated ticketed event, not a recurring weekly showcase — held out of recurring.json. Badslava's Tuesday "Girl Dinner! - Women And LGBTQ+ Mic" (7:30pm, paid, @womenstandup) is not on the club's own events page. Future candidate for clubs.json once policies and minimums are read from the site.
- **The Corner Store** (753 Nostrand Ave, Crown Heights). Site: cornerstorebk.com. Cafe & cocktail bar (breakfast/brunch 9am-4pm Mon-Fri / 10am-4pm Sat-Sun, cocktails and wine all night). Nav is just Menus and Event Inquiry — no events page. Badslava's "Franzia" Tuesday weekly open mic (7:45pm, signup 7:30pm, one-item purchase, @franziaofficial) is not on the venue site.
- **Somebody's Darling** (1664 1st Ave, UES). **No own website** (Badslava lists only the venue Instagram). Badslava's "Hot Mic" Tuesday weekly open mic (8pm, 1-drink minimum, email signup at clairegrant327@gmail.com) is on Instagram only.
- **Teddy's F&B Bar & Grill** (2171 2nd Ave). Site: teddysnyc.com. Bar & grill the venue labels **"BORN & BRED In Spanish Harlem"** — neighborhood updated from "East Harlem" to **"Spanish Harlem"** per the venue's own homepage. Events nav covers NFL Schedule and Teddy's F&B Live Music Series (the series page itself 404s); no comedy on the venue site. Badslava's "The Bar Mic" Tuesday weekly open mic ($5 for 5 min, walk-in or email signup via slimonstage@gmail.com) is a separate Comedy on purpose listing.

Calendar URLs found this round: 3 (The Rose, iNine Bistro, Comedy Village). Comedys hosted on the venue's own page: 0. Recurring shows added this round: 0. Open mics added this round: 0.

Venue-controlled comedy sources remain the bottleneck: every Badslava listing in this batch is a producer-run mic via Instagram or a personal email, not a venue-published schedule. Same rule for the next batch — only add a record when the venue's own page or a ticketed partner lists the show with a fixed cadence.

10 rooms left with needs_review: true.

## Venue review — sixth batch of 12 rooms — September 14, 2026
Next 12 rooms in file order (Shillelagh Tavern → Cool Beans! Coffee House). Same rule: open the venue's own page, set website/calendar_url, confirm neighborhood, add a recurring.json record if the room runs a fixed weekly/monthly showcase on its own page; add an open-mics.json record for open mics on the venue's own page.

Reviewed (12 rooms; 0 duplicates removed):

- **The Shillelagh Tavern** (47-22 30th Ave, Astoria). shillelaghtavern.com is a parked Wix page ("This domain isn't connected to a site") — venue has no working own website. Badslava lists a Wed 7:30pm weekly free open mic and the venue Instagram @shilltavern; mic not on a venue-controlled page, held out of open-mics.json. needs_review cleared; no calendar_url.
- **Postcard Brewing** (111-30 Beach Channel Dr, Rockaway Beach). postcardbrewing.com is parked on GoDaddy (Domain For Sale) — no working own website. Badslava lists a weather-dependent Wed 7:30pm weekly free open mic. Held out — venue-controlled source does not exist.
- **Starr Bar** (214 Starr St, Bushwick). starrbar.com (Squarespace). The events page (not /stageroomevents which 404s) lists **Kismet Comedy** (Tue 8:30pm stand-up showcase, $10 at the door, Sep 15 confirmed), Art vs Life Open Mic (biweekly Mondays, doors 5pm, sign-ups 7pm — bands/singers/poets/dancers, not strictly stand-up), HRTuesday! (last Tuesday of every month, trans fundraiser with comedians and drag), and a weekly NYC Salsa Social & Karaoke. **recurring.json: Kismet Comedy (Tue 8:30pm, $10)**. Bushwick confirmed by the venue's own homepage ("a Bushwick destination").
- **Essence Bar** (1662 Atlantic Ave, Bedford-Stuyvesant). essencebar.com now lands on the WordPress `wp-admin/setup-config.php` page — the WP install is broken/unconfigured, not a working site. Instagram @essencebar is the only public source. Badslava's Wed 8pm weekly "Under New Mgmt Comedy Show" open mic is not on a venue-controlled page; held out.
- **the Rock House bar and grill** (507 Seguine Ave, Staten Island — Prince's Bay). therockhouserocks.com (Wix). The venue's own homepage "how the week shapes up" block lists **'Weds............Open Mic night 8pm'** every Wednesday as a recurring weekly event; Badslava confirms 7pm sign-up, 8pm start, free. The footer confirms the address "507 Seguine Avenue, Staten Island, New York 10309". **open-mics.json: Open Mic Night at The Rock House (Wed 8pm, sign-up 7pm, free)**. No calendar_url since the weekly schedule is inline on the homepage.
- **Hart Bar** (538 Hart St #1, Bushwick). hartbarnyc.com with a SHOWS nav linking to a Google Calendar embedded in the venue's own page. Calendar lists music, karaoke (Charlie-oke Mondays in the Garage, Savage Karaoke! Thursdays), burlesque and indie showcases. Badslava lists a bi-weekly Foolery open mic (1st & 3rd Wednesdays, Hart Garage) that does NOT appear in the venue's calendar on the relevant September Wednesdays — mic appears dormant. Held out of open-mics.json until the venue's calendar lists it.
- **Captain Kirk's Comedy Lounge** (1000 Broadway, Brooklyn — Bed-Stuyvesant per zip 11221). captainkirkscomedylounge.com (GoDaddy Airo). Brooklyn comedy club (footer confirms "1000 Broadway, Brooklyn, New York 11221"). $20 food/beverage minimum, cash not accepted at the door. The COMEDY SHOWS / EVENTS section on the venue's own home lists **Double The Trouble Thursdays (every Thursday from Aug 27, 6pm-12am, LADIES FREE)**, Fashion Week Every Week (Mondays starting Sep 14, 5pm-11pm) and ticketed showcase nights (Pass The Mic Sep 18, New York King Of Comedy Talent Sep 19-20, Joselito Dapuppet Sep 25, Mark Viera, Chris Grant, Anthony Fuentes, Captain Kirk's Birthday Starring Tony Rock, Halloween Haunted Comedy). **recurring.json: Double Trouble Thursdays (Thu 6pm-midnight)**. Badslava's Wed 8pm Open Mic Night is producer-run by @dslaughtercomedy / danniellewornall@gmail.com — not on the venue's own page, held out of open-mics.json.
- **Commune Cafe + Wine Bar** (415 Classon Ave, Brooklyn — Clinton Hill). commune-nyc.com loads with only nav links (Event Calendar 404s); the site's own page title self-labels "Bed Stuy, Brooklyn" but 415 Classon is Clinton Hill per the address (registry label kept). The /event-calendar subpage 404s — no working calendar_url to attach. Badslava lists a free Thu 6pm weekly ADHD Mic (sign-up via Slotted link) — held out since the venue's event calendar does not load.
- **Terraza 7** (40-19 Gleane St, Elmhurst). terraza7.com with a real Concert Schedule on the home page listing nearly-nightly Latin jazz, salsa, Brazilian jazz and Colombian folk sets; open daily 4pm-4am, performances almost every night from 8pm. The venue's own page title self-labels "40-19 Gleane St, Elmhurst, Queens, NY 11373" — Elmhurst label confirmed. Badslava's Thu 7pm weekly open mic is NOT on the venue's own page; held out of open-mics.json. calendar_url set to /events (the venue's own events page).
- **Partea Lab** (32 E 32nd St, Murray Hill). partealab.com. **Venue is closed**: the venue's own homepage banner announces "Our last day of service will be Friday, September 11th. Book now!" Closed as of Sep 12, 2026. Badslava's Humor Section Comedy Open Mic (bi-weekly Thu 7pm, English/Chinese friendly) ran there until closing but is no longer operating; Humor Section co-presents the JEST ASIANS showcase with Asia Society and runs ongoing Mandarin shows at QED Astoria and Broadway Comedy Club, so the mic may move. Held out of open-mics.json — Humor Section is looking for a new room.
- **Island Rib House** (611 Nostrand Ave, Crown Heights). islandribhouse.com returns 404; no working own website. Badslava's Thu 7:30pm weekly open mic ("Thursdays", 7:30 signup, buy one item from the venue) is producer-side via book.kylekilledkyle@gmail.com — held out.
- **Cool Beans! Coffee House** (50-20 39th Ave, Woodside). coolbeansnyc.com returns "Squarespace - Website Expired" and coolbeanscoffee.com returns 200 with 114 bytes of empty content — no working venue website. Badslava lists the free Thu 8pm weekly Pop Shop mic (sign-up via @popshopmic Instagram) — held out.

Corrections this round: none (all neighborhoods already matched).

Calendar URLs found this round: 4 (Starr Bar /events, Hart Bar /shows, Terraza 7 /events, Captain Kirk's home as calendar). Venue websites found: 5 (Starr Bar, Rock House, Hart Bar, Captain Kirk's, Commune, Terraza 7, Partea Lab). Rooms with no site: 4 (Shillelagh Tavern, Postcard Brewing, Essence Bar, Island Rib House, Cool Beans!). Recurring shows added this round: 2 (Kismet Comedy at Starr Bar, Double Trouble Thursdays at Captain Kirk's). Open mics added this round: 1 (Open Mic Night at The Rock House).

10 rooms left with needs_review: true (N&M's Pizza Bar, Mexican Mariachi Cantina, Acoustik Garden Lounge, Blind Barber, Bibblebash, Dacia Gallery, Qahwah House - Broadway, Ruhani Cafe, Black Cat LES, Balance Arts Center). Same rule for the next batch — only add a record when the venue's own page or a ticketed partner lists the show with a fixed cadence.

## Venue review — fifth batch of 12 rooms — September 14, 2026
Next 12 rooms in file order (Branded Saloon → Brooklyn Beso). Same rule: open the venue's own page, set website/calendar_url, confirm neighborhood, add a recurring.json record if the room runs a fixed weekly/monthly showcase on its own page; add an open-mics.json record for open mics on the venue's own page.

Reviewed (12 rooms; 0 duplicates removed):
- **Branded Saloon** (603 Vanderbilt Ave, Prospect Heights). Site: brandedsaloon.com (Google Sites). Prospect Heights bar confirmed by the venue's own footer. "Events" nav link returns 404; "Book a Show" page exists for promoter inquiries but no public calendar. Badslava's Tuesday 8pm open mic (1-item min) is a producer-run show — not on the venue's site.
- **An Beal Bocht Cafe** (445 W 238th St, Riverdale). Site: anbealbochtcafe.com; **calendar at /events-programs**. Riverdale Irish cafe confirmed by the venue's own footer. The Events & Programs calendar lists weekly events including the **Open Mic w/ Eric Sullivan** every Tuesday 9pm — the venue's own page is the source of record. **open-mics.json: Open Mic w/ Eric Sullivan (Tue 9pm, free, sign up at the venue)**.
- **Under St Marks** (94 St Marks Pl, East Village). Site: frigid.nyc/. East Village theater confirmed by FRIGID New York's own About page ("an off-off-Broadway venue in the East Village"). Badslava's Tuesday 9:30pm "The Open Mic Downstairs" is run by an outside producer (@theopenmicdownstairs) — not on FRIGID's site.
- **Hotel Edison** (228 W 47th St, Times Square). Site: edisonhotelnyc.com. Times Square hotel confirmed by the venue's own header/footer; site is a hotel site with no comedy/events calendar. Badslava's "Let's Go Mental" Wed 5pm lobby mic is run by an outside producer (minacheon.com/mj/) — not on the hotel site.
- **El Barrista cafe** (2154 Third Ave, East Harlem). **No venue-owned website** (Badslava's "Venue Website" field points to the Yelp page). Wednesday 5:30pm "'mike' Drop" is producer-run via DBJ Comedy (NGL link / @dbjcomedy). No venue source.
- **Mae Mae Cafe And Plant Shop** (2417 Third Ave, Mott Haven). Site: maemaecafe.com. Mott Haven cafe confirmed by the venue's own homepage. Hours Mon–Fri 8am–3pm, Sat–Sun closed. Badslava's Wednesday 6pm "Mae Mae Mic Nites" would start after the cafe closes — the mic is likely stale or moved; held out until a venue or producer confirms.
- **Judy Z's** (1 7th Ave S, West Village). Site: judyznyc.com (BentoBox). Sports tavern; the venue's own header confirms the address (West Village corner of 7th Ave S & Carmine — site calls it "where Greenwich Village meets the West Village"; registry keeps West Village). The Wednesday 6pm "Brainstorm Open Mic" is run by an outside producer (brainstormopenmic@gmail.com) — not on the venue site.
- **Five Flies Coffee** (554 W 158th St, Washington Heights). **No venue-owned website** (Badslava lists only the venue Instagram). Wednesday open mic on Instagram only.
- **Alligator Lounge** (600 Metropolitan Ave, Williamsburg). Site: alligatorloungebrooklyn.com (Squarespace). Williamsburg bar confirmed by the venue's own header. Site mentions Karaoke/Trivia/Comedy/Bingo but the "Weekly Events" nav returns 404 in the managed browser. Badslava's Wednesday 6pm comedy mic has no calendar_url to attach.
- **One and One** (76 E 1st St, East Village). **Venue site is down** (oneandonenyc.com returns 404 in the managed browser on every path tried, including /events). Wednesday 6:15pm "Orangutan Comedy Mic" is run by outside producers (@orangutancomedy) — no venue source.
- **Caravan Of Dreams** (405 East 6th St, East Village). Site: caravanofdreams.net; **calendar at /events**. East Village vegan Mediterranean cafe confirmed by the venue's own footer ("Hidden Gem of the East Village"). Events page renders but lists no upcoming events. Badslava's Wednesday 7pm "Club of Comedy" ($3 + one drink) is run by an outside producer — not on the venue's calendar.
- **Brooklyn Beso** (370 Lewis Ave, Bedford-Stuyvesant). Site: brooklynbeso.com. Bed-Stuy Caribbean & Latin restaurant confirmed by the venue's own header/footer (Hours: Sun–Thu 11am–11pm, Fri–Sat 11am–2am; zip 11233 keeps the Bed-Stuyvesant label). Events nav page returns "There is some problem" in the browser; the monthly Wednesday 7pm "Words 2 Everything I Love" is run by an outside producer (ahveyus@gmail.com) — not on the venue's site.

Calendar URLs found this round: 2 (An Beal Bocht, Caravan of Dreams). Venue websites found: 8 (Branded, An Beal Bocht, Under St Marks / Frigid, Hotel Edison, Mae Mae, Judy Z's, Alligator, Caravan, Brooklyn Beso). Rooms with no site: 3 (El Barrista, Five Flies, One and One). Recurring shows added this round: 0. Open mics added this round: 1 (Open Mic w/ Eric Sullivan at An Beal Bocht).

22 rooms left with needs_review: true. Same rule for the next batch — only add a record when the venue's own page or a ticketed partner lists the show with a fixed cadence.

## Venue review — seventh (final) batch of 10 rooms — September 14, 2026
Last 10 rooms in file order (N&M's Pizza Bar → Balance Arts Center). Same rule as previous batches: open the venue's own page, set website/calendar_url when on https, confirm neighborhood, add a recurring.json record if the room runs a fixed weekly/monthly showcase on its own page; add an open-mics.json record for open mics on the venue's own page.

Reviewed (10 rooms; 0 duplicates removed):

- **N&M's Pizza Bar** (2048 Amsterdam Ave, Washington Heights). Site: nmspizzabar.com (listed by Badslava; DNS resolves to a Cloudflare-gated 403 so the page did not render in the managed browser). Washington Heights label kept from the address. Badslava's "Bent Over Laughing" Thu 8pm weekly open mic is producer-run via John Bent / bol.johnbent.com — not on the venue's own site. Held out of open-mics.json; needs_review cleared, website URL recorded from Badslava.
- **Mexican Mariachi Cantina** (10 Minthorne St, Staten Island — Tompkinsville). **No own website** (Badslava has no Venue Website field). Badslava's "The Shaolin Talent Show" Thu 8pm weekly open mic is producer-run via @theshaolinshow on Instagram. Held out — venue-controlled source does not exist.
- **Acoustik Garden Lounge** (1515 Atlantic Ave, Bed-Stuy). Site: acoustikgardenlounge.com (Wix). The venue footer reads "1515 Atlantic Ave, New York, New York 11213" — zip 11213 confirms Bed-Stuyvesant, so **neighborhood corrected from "Crown Heights" to "Bedford-Stuyvesant"**. Events page lists SOFAR NYC, AFROJAM Afrohouse parties and birthday events — Afrobeats/Amapiano/Soca/Reggae programming, no comedy. Badslava's Thu 9pm weekly open mic ($10 minimum purchase) is producer-run via acoustikgardenevents@gmail.com. Held out.
- **Blind Barber** (339 E 10th St, East Village). Site: blindbarber.com — the East Village location page (under VISIT > New York > East Village) confirms "339 E 10th St, New York, NY 10009". Barbershop by day (10am-7pm Sun-Sat), Backroom bar by night (7pm-3am Thu, 7pm-4am Fri/Sat). **No comedy on the venue's own page**. Badslava's Thu 9:30pm weekly open mic (sign-up 9:15, set length 5-7 min, two-drink minimum) is producer-run via @iamartur.music on Instagram.
- **Bibblebash** (1139 Jefferson Ave #1, Bushwick). **bibblebash.com does not resolve** (DNS lookup fails); Badslava lists no Venue Website field. Badslava's "Bubblebath Mic" Fri 10pm weekly open mic ($3 beers, sign-up by DM to @LaramieFlick, slotted.co/bubblebath-mic, @bibcomedy Instagram) is producer-run. Held out — venue-controlled source does not exist.
- **Dacia Gallery** (621 E 11th St, East Village). Site: http://www.daciagallery.com/ (HTTP, not HTTPS — check.js requires https so website and calendar_url were not set). **Corrected address typo from "621 East 11st" to "621 E 11th St"** per the venue's own footer. The site's Events page lists only "COMIC BOOKS & COMIC ART WANTED" — visual art gallery, not a comedy venue. Badslava's monthly Fri 5pm "Ladies Who Laugh" ($5 for 5 minutes) is producer-run via @femininelifestyleco.
- **Qahwah House - Broadway** (2869 Broadway, Morningside Heights). **No own website** for the Broadway location (Badslava has no Venue Website field; the parent Qahwah House brand has a site but the location does not). Badslava's monthly Fri 6:30pm "Morningside Comedy Open Mic" (free, buy a coffee) is producer-run via @dr.max.sheppard. Held out.
- **Ruhani Cafe** (519 Atlantic Ave, Boerum Hill). **No own website** (Badslava has no Venue Website field). Badslava's weekly Fri 7pm "Summer Fridays" open mic (1-item minimum, weather permitting) is producer-run via @summerfridaysmic on Instagram. Held out.
- **Black Cat LES** (172 Rivington St, Lower East Side). **blackcatles.com does not resolve** (Badslava lists the URL as http only; DNS lookup fails today). Badslava's weekly Sat 7pm "Comedians On The Loose" ($6 for 5-7 min, comediansontheloose.com/open-mics, @cotlcomedy / sonja@comediansontheloose.com) is producer-run. Held out — venue-controlled source does not exist.
- **Balance Arts Center** (151 W 30th St 3rd floor, Chelsea). Site: balanceartscenter.com with a working Calendar page (HTTPS). **Venue is an Alexander Technique training center, not a comedy venue** — the September 2026 calendar lists only AT Principles Level I Certification (Sep 19-20), weekly AT Group Class (Tue 7-8:30pm) and Creative Flow Class Series (Mon 8:30-10am). Space Rental is offered to outside producers. Badslava's weekly Sat 8pm "Night Cap" open mic ($5 + one-drink minimum) is producer-run via Laugh Pack Productions (thelaughpackproductions@gmail.com, Eventbrite). Held out — the room is rented out, not a venue-run showcase.

Corrections this round:
- Acoustik Garden Lounge: Crown Heights → Bedford-Stuyvesant (per the venue's own footer zip 11213).
- Dacia Gallery: address "621 East 11st" → "621 E 11th St" (Badslava typo).

Calendar URLs found this round: 2 (Acoustik Garden, Balance Arts Center). Venue websites found: 4 (N&M's from Badslava, Acoustik Garden, Blind Barber, Balance Arts Center). Rooms with no site: 4 (Mexican Mariachi Cantina, Bibblebash, Qahwah House - Broadway, Ruhani Cafe, Black Cat LES — actually 5). Dacia Gallery has an http site (not https so not recorded). Recurring shows added this round: 0. Open mics added this round: 0.

**0 rooms left with needs_review: true.** The Badslava sweep is complete. Same rule applies going forward: if Mazzie pulls a new Badslava batch and registers more venues, only add a recurring/open-mic record when the venue's own page or a ticketed partner lists the show with a fixed cadence.

Recurring intake so far (Sep 14, 2026) — 15 recurring.json records and 17 open-mics.json records across all seven batches. Producer-run mics continue to dominate the Badslava table; venue-controlled comedy calendars remain the bottleneck for adding more.

## Editorial pass on rooms and mics — September 14, 2026
Every recurring record rewritten in our voice (no press quotes, no venue marketing, no "see show page" inside a description). One record per night: Bomb Shelter is now Thursday and Saturday entries; BK Made's Comedy Tonight is Monday through Thursday entries plus a Friday and Saturday weekend show. Deadass moved to open-mics.json. Faculty Lounge's note now states the show page (Sunday) is authoritative over BCC's stale overview (Thursday). Open-mic notes that quoted venue pages rewritten. check.js fails multi-night cadences, listing phrases in descriptions, and scraped-sounding mic notes.

## Comedy In Harlem — September 14, 2026
Nick flagged the room. Read the club's own event pages: 750A St Nicholas Ave at 147th St, 21+, $18 food and drink minimum at ticketed shows, non-refundable tickets, walk-up cover above presale. Added to clubs.json; recurring: Paid by the Bell (Tue 6pm, $5), R&B Karaoke and Comedy (Mon 8pm), Third Thursdays with Smokey Suarez (monthly, $20); picks: Leonard Ouzts (Fri Sep 18, $25) and Jokes & Jranks with Justin Lamar (Sat Sep 19, 5pm, $25). Held out: Funny Thursdays and Sugar Shack Sundays (cadence not stated on their pages), Flash Feature (only one date listed). Neighborhood directory rows now carry the address.

## Reddit neighborhood leads — September 15, 2026
`npm run reddit-leads` sweeps 22 NYC and neighborhood subreddits for comedy-show posts from the last 14 days and writes candidates/reddit-leads.json with any registered venue mentioned, the weekday and time in the post, outbound links and a free flag. First run: 68 posts, 27 naming registered rooms; new rooms surfaced include Bar Bayeux (Crown Heights, free comedy) and a QED Astoria show. Rule unchanged: a Reddit post is a lead; open the venue or ticket page before anything enters the data, and register the room first.

## Daily edition — 2026-09-15
- **Reddit leads**: r/nycevents + r/williamsburg both surfaced a new-to-us room — **Kellogg's Diner**, 518 Metropolitan Ave, Williamsburg. The .com domain is parked; the show itself is ticketed on Eventbrite by outside producers Danny Metz & Jackson Colvin. Verified the address from the Eventbrite listing's venue-supplied data (zip 11211 → Williamsburg). Registered the venue in venues.json with `eventbrite_organizer` set so the feed covers it going forward. Added the show to recurring.json as "Standup Comedy After Dark at Kellogg's Diner" — every Wednesday, 11pm, doors 10:30pm, $10, no item minimum (confirmed from the Eventbrite FAQ).
- **Eventbrite leads**: 4 new picks added, all with official artwork saved to `web/assets/posters/` and recorded in POSTER-SOURCES.json:
  - `taylor-tomlinson-tries-out-new-ideas-2026-09-19-1700` and `…-1930` — two same-night workshops at Union Hall, $46.29 each.
  - `and-scene-caveat-2026-09-21` — Caveat's acting-vs-improv experiment, $18.76.
  - `good-grief-littlefield-2026-09-26` — Kat Smith's lore-heavy variety, from $10.
- **Clubs tier**: Two missing clubs registered with policies read from the rooms' own pages:
  - **St. Marks Comedy Club** (12 St Marks Pl) — added from the contact page + the club's Tally FAQ ("2-drink minimum per person"). Tixr is CAPTCHA-gated so per-show ticket prices were not read; left as "see the show page" per the clubs.json rule. Worth a recheck once Tixr can be opened in the browser.
  - **Comic Strip Live** (1568 Second Ave, UES) — policy came straight from the club's Eventbrite listing ("must be 17 or older", "two item minimum inside the show room", $25.71). Added `eventbrite_organizer` to venues.json so it shows up in `npm run eventbrite` from now on.
- **Heat**: 3 sold-out picks after running `npm run heat` — the 9/15 Richard Perez late show and both Taylor Tomlinson 9/19 workshops. Buzz notes for Tomlinson, Beth Stelling, and Jamie Wolf written to `candidates/heat-notes.md` from the last30days skill.

### Improvement today
Tightened the editorial voice in the new entries: the Kellogg's Diner recurring description leads with the room and time, not the producer name; the two Tomlinson pick descriptions are split ("Early Saturday headlining set..." vs "Second Tomlinson set of the night...") so the board doesn't read as a duplicate; the St. Marks clubs.json `verification_note` names the exact page the 2-drink minimum came from, instead of repeating the club's marketing tagline.


## Research budget rule — September 15, 2026
Nick: never run last30days across the whole roster. `npm run research-plan` ranks every performer on the board from static data and cheap signals (heat.json availability, second shows, Wikipedia, Reddit-lite, show timing), shortlists up to 10, and schedules a last30days run only when it could change a decision: show within 10 days, not already sold out, no cached result under 7 days old. Finished runs are cached with `--record "<name>" --note "<sentence>"` in candidates/research-cache.json and reused. The plan reports estimated tokens saved and the candidates ranked on schedule alone because no recent data exists.

## Theaters and the festival — September 15, 2026
Registered 20 theaters and concert halls that host touring comedy and New York Comedy Festival shows (Beacon, Town Hall, Carnegie, Kings, Brooklyn Paramount, Brooklyn Steel, Webster Hall, Gramercy, Sony Hall, Irving Plaza, Warsaw, Music Hall of Williamsburg, Bowery Ballroom, LPR, Apollo, Symphony Space, 92NY, BAM, Radio City, The Theater at MSG), kind "theater", needs_review true until the calendar URL and neighborhood are confirmed. Festival shows sit under Save the date once verified. Editorial policy and hold-out list added under editorial/.

## Theater sweep + NYCF — September 15, 2026 (cron run)
First-pass review of all 20 theater/concert-hall records: every `calendar_url` and `neighborhood` confirmed from the venue's own page or ATG/Live Nation/Ticketmaster mirror; `needs_review` cleared; `verified_at: 2026-09-15` and a short `note` describing what the calendar showed. Brooklyn Paramount was moved to `/shows` (the `/events` subpath is the same sound-check stub as Gramercy Theatre and Irving Plaza). The Theater at MSG redirects from `/the-theater-at-msg` to `/infosys-theater-at-msg` — the registry points at the live URL.

Picks added (11, all tier=special):
- Beacon Theatre: Ben Schwartz & Friends early and late shows (Sat Sep 19), Chelsea Handler: The High and Mighty Tour (Fri Sep 25), John Oliver & Seth Meyers (Sun Sep 27).
- The Town Hall: Brad Williams: The Tall Tales Tour (Sat Sep 19), Kanan Gill: Not This Again matinee + evening (Sat Oct 3), Kathy Griffin: New Face, New Tour (Fri Oct 16), Yang Mengen (youngmoon): Stand Up Comedy Special — Renegade (Thu Oct 22), Difficult People: The Movie — A Live Table Read with Julie Klausner and Billy Eichner (Tue Nov 3).
- Le Poisson Rouge: Mike Nasty Presents: NO FILTER! (Sat Sep 26, 11pm, Main Space, ticketmaster).

No picks at Carnegie Hall, Brooklyn Paramount, Brooklyn Steel, Webster Hall, Gramercy, Sony Hall, Irving Plaza, Warsaw, Music Hall of Williamsburg, Bowery Ballroom, Apollo, Symphony Space, 92NY, BAM, Radio City Music Hall, or The Theater at MSG in the next 8 weeks — each calendar is dominated by concerts, literary events, theater/dance (BAM), or the regular Weekly Amateur Night (Apollo), which we treat as a recurring showcase rather than a dated pick.

NYCF headliner picks are in a follow-up commit "NYCF: first batch" (separate from this commit).
