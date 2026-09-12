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
