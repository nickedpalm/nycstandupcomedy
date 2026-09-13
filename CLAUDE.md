# StandUpComedyNYC — Claude and Mazzie entry point

Repository: https://github.com/nickedpalm/standupcomedynyc
Canonical checkout on the VPS and inside Mazzie's container: `/home/nick/standupcomedynyc`

Read README.md first: it describes the layout, data files, checks and publishing. This file holds only what an agent needs beyond that.

## Working rules

- Keep the static HTML/CSS/JavaScript architecture and the Cellar-inspired neighborhood bulletin-board design. Nick wants The Skint-style curation and a useful email audience, not a comedy database or a CMS.
- Verified sources, accurate dates and prices, original blurbs, credited artwork. Open the source page before writing `verified_at`.
- Run `npm test` before every commit. Do not commit if it fails.
- Editorial working notes go at the bottom of DRAFT-NOTES.md (site changes), RECURRING-INTAKE.md (recurring rooms and open mics) or POSTER-INTAKE.md (artwork). Mazzie's daily job reads RECURRING-INTAKE.md by path, so keep these files at the repository root.
- Keep secrets, private Gmail evidence and container configuration out of Git and out of `web/`.

## Publishing

Pushing `main` publishes to standupcomedynyc.com through Cloudflare's Git integration. Treat every push to `main` as a public deployment and use Nick's applicable authorization. After pushing, verify the live site by hash (see README) before reporting publication.

The older host script `/home/nick/hermes-comedy/deploy-site.sh` deploys with wrangler from a separate checkout. It is not scheduled and is a manual fallback only.

## Agents and access

- Mazzie runs in Docker `hermes-comedy` with this checkout bind-mounted at the same path. Her profile is `/opt/data/profiles/comedy`; her workspace notes live under `/opt/data/profiles/comedy/workspace/` (host path `/home/nick/hermes-comedy/data/profiles/comedy/workspace/`). Use absolute paths for anything outside this repository.
- Host Git uses Nick's SSH configuration; container Git uses Mazzie's repository-scoped key. Run Git in the container as the `hermes` user.
- Cloudflare credentials are on the host only. Do not assume Nick lacks account access because the container does.

## History

The repository was reorganized on September 13, 2026. The tag `pre-reorg-20260913` holds the last state with the legacy scraper, SQLite database, Node server, Vercel config and a broken `pets-browser` gitlink that had been failing Cloudflare builds. The old `nycstandupcomedy` names for the GitHub repository, host folder and Vercel project are historical; a Vercel project still exists but is not the canonical host. A migration backup lives at `/home/nick/hermes-comedy/migration-backups/20260913-project-rename/`.
