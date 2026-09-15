# Editorial policy

Set by Nick, September 15, 2026. Applies to picks, recurring shows, open mics, clubs, Instagram and the newsletter.

## What we promote
Shows worth going out for, chosen by us. A listing is an endorsement. We are not a complete calendar and never claim to be.

## What we do not promote
- Acts whose material is bigoted: racist, homophobic, transphobic, misogynist, or contemptuous of a group of people for who they are.
- Performers or producers whose public conduct is bigoted in the same way, on stage or off.
- Anyone on the hold-out list below, which Nick maintains case by case. Political judgments about a person, including on Israel and Palestine, are made by Nick by name, not by a keyword or an assumption.

## How the rule is applied
- Mazzie checks every new pick, room and performer against `editorial/holdouts.json`. `npm test` fails if a held-out name appears in any listing.
- Anything borderline is not published; it goes to Nick with a link and one sentence on why, and waits.
- A held-out act does not disqualify a venue. The room stays in the registry; that show is left out.
- We do not write about why someone is held out. We simply do not list them.

## Hold-out list
`editorial/holdouts.json`: name, reason (short, for Nick and Mazzie only), added date. Not published anywhere.
