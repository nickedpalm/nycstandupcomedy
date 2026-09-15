#!/usr/bin/env node
// Rotate expired picks off the board into the monthly archive. Run with `npm run rotate`.
//   --now=2026-09-20T12:00:00Z   pretend it is another time (for testing)
//   --dry-run                     report what would move without writing
// A pick is expired once its ends_at has passed. Expired picks are appended to
// web/data/archive/YYYY-MM.json (by show date), their poster files move to
// web/assets/posters/archive/ unless a remaining pick still uses them, and the
// matching POSTER-SOURCES.json records are updated in place with archived: true.
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const web = path.join(root, 'web');
const picksFile = path.join(web, 'data', 'picks.json');
const postersFile = path.join(root, 'POSTER-SOURCES.json');
const archiveDir = path.join(web, 'data', 'archive');
const posterArchiveDir = path.join(web, 'assets', 'posters', 'archive');

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const dryRun = Boolean(args['dry-run']);
const now = args.now ? Date.parse(args.now) : Date.now();
if (Number.isNaN(now)) { console.error('rotate: --now must be an ISO datetime'); process.exit(2); }

const write = (file, data) => { if (!dryRun) fs.writeFileSync(file, JSON.stringify(data, null, 1) + '\n'); };

// Link-in-bio entries with an end date drop off once it passes.
{
  const linksFile = path.join(web, 'data', 'links.json');
  const linksData = JSON.parse(fs.readFileSync(linksFile, 'utf8'));
  const todayNY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(now));
  const gone = (linksData.links || []).filter((l) => l.ends && l.ends < todayNY);
  if (gone.length) {
    linksData.links = linksData.links.filter((l) => !gone.includes(l));
    write(linksFile, linksData);
    console.log(`rotate: dropped ${gone.length} ended link(s) from links.json: ${gone.map((l) => l.id).join(', ')}`);
  }
}

const picks = JSON.parse(fs.readFileSync(picksFile, 'utf8'));
const expired = picks.filter((p) => Date.parse(p.ends_at) <= now);
const kept = picks.filter((p) => Date.parse(p.ends_at) > now);
if (!expired.length) { console.log(`rotate: nothing expired (${kept.length} picks upcoming)`); process.exit(0); }

const stillUsed = new Set(kept.filter((p) => p.poster).map((p) => p.poster.src));
const posters = JSON.parse(fs.readFileSync(postersFile, 'utf8'));
const moved = [];

if (!dryRun) { fs.mkdirSync(archiveDir, { recursive: true }); fs.mkdirSync(posterArchiveDir, { recursive: true }); }

const byMonth = new Map();
for (const pick of expired) {
  const record = { ...pick, archived_at: new Date(now).toISOString().slice(0, 10) };
  if (pick.poster && !stillUsed.has(pick.poster.src)) {
    const name = path.basename(pick.poster.src);
    const from = path.join(web, pick.poster.src.replace(/^\//, ''));
    const to = path.join(posterArchiveDir, name);
    if (fs.existsSync(from)) { if (!dryRun) fs.renameSync(from, to); moved.push(name); }
    record.poster = { ...pick.poster, src: '/assets/posters/archive/' + name };
    for (const entry of posters) {
      if (entry.src === pick.poster.src) { entry.src = record.poster.src; entry.archived = true; }
    }
  }
  const month = pick.date.slice(0, 7);
  if (!byMonth.has(month)) byMonth.set(month, []);
  byMonth.get(month).push(record);
}

for (const [month, records] of byMonth) {
  const file = path.join(archiveDir, month + '.json');
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const ids = new Set(existing.map((r) => r.id));
  const merged = existing.concat(records.filter((r) => !ids.has(r.id))).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  write(file, merged);
  console.log(`${dryRun ? '[dry-run] ' : ''}archive/${month}.json: +${records.length} (${merged.length} total)`);
}
// Drop Instagram cards for picks that just expired; cover cards older than today go too.
const igDir = path.join(web, 'assets', 'ig');
if (fs.existsSync(igDir)) {
  const gone = new Set(expired.map((p) => p.id + '.jpg'));
  const todayStr = new Date(now).toISOString().slice(0, 10);
  for (const f of fs.readdirSync(igDir)) {
    const cover = f.match(/^(tonight|weekend)-(\d{4}-\d{2}-\d{2})\.jpg$/);
    if (gone.has(f) || (cover && cover[2] < todayStr)) { if (!dryRun) fs.unlinkSync(path.join(igDir, f)); console.log(`${dryRun ? '[dry-run] ' : ''}removed card ${f}`); }
  }
}
write(picksFile, kept);
write(postersFile, posters);
console.log(`${dryRun ? '[dry-run] ' : ''}rotate: ${expired.length} expired -> archive, ${kept.length} upcoming, ${moved.length} poster(s) moved`);
expired.forEach((p) => console.log(`  - ${p.date} ${p.title} (${p.venue})`));
