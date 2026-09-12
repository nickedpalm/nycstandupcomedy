# Browser QA of the skint-20260911 review draft — 2026-09-11

Method: scratch copy of this draft built with `npm run build`, served on a temporary local port, driven with headless Chromium (Playwright) at 1280x900 and 390x844. All five routes plus `?area=Park%20Slope` and a bogus `?area=` value. Filters, Save, reload persistence, empty states and keyboard focus exercised. Nothing in the draft was modified.

## Passed
- No horizontal overflow on any route at either width.
- No console errors or warnings, no failed requests, no 4xx/5xx.
- All 10 home images load after scroll; lazy loading works; every image has alt text.
- Pinned flyers keep their proportions (object-fit: contain, letterboxed).
- Result counter reads "14 upcoming shows · 4 neighborhoods"; Park Slope filter shows Union Hall shows only.
- Save toggles to "Saved ✓", aria-pressed updates, `comedy-saved` persists across reload; Saved filter lists the saved pick.
- Empty states render for Saved (none) and Tonight (no Sept 11 shows) with the intended copy.
- Keyboard focus is visible (3px outline). One h1 per page; mobile header/nav wrap cleanly.

## Findings
1. Pluralization: Saved filter with one pick reads "1 upcoming show · 1 neighborhoods" (`picks.js` line 26).
2. Union Hall / Bell House art is 2160x1080 landscape; at the 80px listing thumbnail it is a 78x39 sliver with black bars and unreadable (Emil Wakim, Steve Martin Presents, Rachel Kaly, Richard Perez). Skip thumbnails for landscape art, or give it a wider thumb.
3. Tap targets: top nav links 18px tall on mobile; "Tickets & details" / "Flyer source" / "Save" 15px tall. Pad the hit area to ~40px.
4. Known and still present: `noscript` fallback in index.html names Sept 12–13 events and will go stale.
5. Nick's review note (2026-09-11): the whole layout "feels pretty cramped". See SPACING-PROPOSAL section below once measured.

## Spacing proposal (2026-09-11, after Nick said the page feels cramped)
Where the tightness comes from: day groups only 23px apart; listing rows welded together with a 1px rule and 18px padding; 15px gaps on the pinned shelf; sidebar boxes stacked 24px apart with 20px padding; description lines running the full column width.
`SPACING-PROPOSAL.css` is an append-only override tried on a scratch build (not applied to `site/`). It separates rows into cards with 14px between them, 26/28px row padding, 40px between day groups, 26px shelf gap, 30px sidebar gap, 96px thumbs, longer line-height and a 62ch measure on blurbs, and 40px-tall nav hit areas on mobile. Verified: no horizontal overflow at 1280 or 390; page grows ~20% taller. Do not widen `.edition` beyond 1120/28px, that produces a 6px horizontal overflow from the rotated header pieces.
