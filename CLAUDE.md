# StandUpComedyNYC — Claude and Mazzie entry point

Canonical GitHub repository: https://github.com/nickedpalm/standupcomedynyc
Canonical checkout on the VPS and inside Mazzie: `/home/nick/standupcomedynyc`

This is the current project. Work here. The previous Hermes `workspace/site` path is a compatibility symlink to this same checkout. The old September 11 `drafts/skint-20260911/site` and `/home/nick/nycstandupcomedy` are historical copies; do not copy them over this repository.

## Working state at migration, September 13, 2026

- Branch `main`, HEAD `594a084e3b0e798ab2969ade1fb7ab8f078f895b` (Cellar pass 2).
- Pre-existing uncommitted edits: `web/data/clubs.json` and `web/data/picks.json`. Preserve them. Both were hash-verified unchanged during migration.
- Project rename changes are limited to README.md, package.json, package-lock.json, this entry point and handoff. They are recorded separately from the uncommitted event edits. The rename did not push commits or publish a website build.
- Read the current `DRAFT-NOTES.md`, `QA-NOTES.md`, `RECURRING-INTAKE.md` and implementation before continuing; these supersede the original five/fourteen-event design handoffs.

## Product and build

Keep the existing static HTML/CSS/JavaScript architecture and current Cellar-inspired neighborhood bulletin-board design. Nick wants The Skint-style curation and a useful email audience, not an IMDb-for-comedy database or Drupal rebuild. Use verified sources, accurate dates and prices, original blurbs and credited artwork.

`npm run build` copies web/ plus robots.txt and sitemap.xml into dist/. Read package.json for the current commands. Do not use the inherited failing npm test placeholder as a meaningful test suite. Check source/data, build and relevant behavior for each change. Keep secret files and private Gmail evidence out of Git and web/.

## Access and deployment

Mazzie runs in Docker `hermes-comedy`; the canonical checkout is bind-mounted at the same absolute path. Her existing profile stays at `/opt/data/profiles/comedy`. Host Git uses Nick's existing SSH configuration; container Git uses Mazzie's existing repository-scoped key. No key was copied by the rename.

Cloudflare Pages project/domain remain `standupcomedynyc` / `standupcomedynyc.com`. A host deployment checkout remains `/home/nick/hermes-comedy/deploy/site`; its origin now uses the canonical GitHub name. Deployment script: `/home/nick/hermes-comedy/deploy-site.sh`. Its cron comment is not proof a scheduler is installed. Do not assume every main push is live: the September 12 Git-triggered deployment fetched 594a084 but failed during submodule setup: `fatal: No url found for submodule path 'pets-browser' in .gitmodules`. Canonical production was 6cc0739 when audited. This predates the rename; repairing the gitlink is separate work. Check current deployment status before reporting publication.

Treat pushing main as a possible public deployment and use Nick's applicable authorization. No container or deployment secrets belong in documentation. Preserve current signup/provider configuration; don't overwrite it with earlier handoff assumptions.

## Agent context and backups

Current profile context lives under `/opt/data/profiles/comedy/workspace/`; on host this is `/home/nick/hermes-comedy/data/profiles/comedy/workspace/`. Use absolute paths for context outside this repository because `../` no longer points to the profile workspace.

Project-migration backup: `/home/nick/hermes-comedy/migration-backups/20260913-project-rename/`. It contains the pre-move checkout, config and existing data diff. Historical documents describe earlier state; current files and verified runtime evidence take precedence.

## Hosting rename verification

GitHub repository ID remains 1168860506 after renaming to nickedpalm/standupcomedynyc. Cloudflare Pages retains this same repository ID and still displays the old repo_name. A source-name PATCH returned success but did not persist the display-name change. No project or domain was replaced and canonical deployment ID remained 79e24767-27e9-4859-bb94-04048b1fdb56. Review the existing Git integration in Cloudflare if its name does not refresh; do not treat the successful PATCH as proof it changed. Its prior build failure is the pets-browser gitlink issue above.

GitHub also reports a successful Vercel deployment for 594a084 under the existing nycstandupcomedy Vercel project. That hosting project/URL was not renamed by this repository/folder migration.
