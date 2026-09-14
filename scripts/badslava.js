#!/usr/bin/env node
// Pull Badslava's New York open-mic table into candidates/badslava-ny.json for review.
// Badslava is crowd-sourced ("call before you haul"): nothing here goes to open-mics.json
// until someone opens the venue's own page. Run with `npm run badslava`.
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const URL_ = 'https://www.badslava.com/new-york-open-mics.php';
const out = path.join(root, 'candidates', 'badslava-ny.json');
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

(async () => {
  const res = await fetch(URL_, { headers });
  if (!res.ok) { console.error(`badslava: HTTP ${res.status}`); process.exit(1); }
  const html = await res.text();
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
  const entries = [];
  let date = null, weekday = null;
  for (const row of rows) {
    const head = row.match(/<th[^>]*>\s*([A-Za-z]+)\s+(\d{2})\/(\d{2})\/(\d{2})\s*<\/th>/);
    if (head) { weekday = WEEKDAYS.indexOf(head[1]); date = `20${head[4]}-${head[2]}-${head[3]}`; continue; }
    const m = row.match(/<td>\s*([^<]+?)\s*<\/td>\s*<td>\s*<a[^>]*href="([^"]+)"[^>]*>\s*<b>([\s\S]*?)<\/b>\s*(?:<br\s*\/?>)?([\s\S]*?)<\/a>/);
    if (!m || !date) continue;
    const id = (m[2].match(/id=(\d+)/) || [])[1] || null;
    entries.push({ badslava_id: id, date, weekday, time: decode(m[1]), venue: decode(m[3]), address: decode(m[4]), details_url: m[2].startsWith('http') ? m[2] : 'https://badslava.com/' + m[2].replace(/^\//, '') });
  }
  if (!entries.length) { console.error('badslava: parsed 0 rows; the page layout may have changed'); process.exit(1); }

  // Distinct recurring mics: venue + weekday + time, with the dates seen.
  const recurring = new Map();
  for (const e of entries) {
    const key = `${e.venue}|${e.weekday}|${e.time}`;
    const r = recurring.get(key) || { venue: e.venue, address: e.address, weekday: e.weekday, weekday_name: WEEKDAYS[e.weekday], time: e.time, details_url: e.details_url, dates: [] };
    r.dates.push(e.date); recurring.set(key, r);
  }
  const known = JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', 'open-mics.json'), 'utf8'));
  const knownVenues = new Set(known.map((r) => r.venue.toLowerCase()));
  const venues = JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', 'venues.json'), 'utf8')).map((v) => v.name.toLowerCase());
  const list = [...recurring.values()].map((r) => ({ ...r, dates: r.dates.sort(), in_open_mics: knownVenues.has(r.venue.toLowerCase()), venue_registered: venues.includes(r.venue.toLowerCase()) })).sort((a, b) => a.weekday - b.weekday || a.time.localeCompare(b.time));

  const previous = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : null;
  const prevKeys = new Set((previous?.recurring || []).map((r) => `${r.venue}|${r.weekday}|${r.time}`));
  const added = list.filter((r) => !prevKeys.has(`${r.venue}|${r.weekday}|${r.time}`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ source: URL_, retrieved_at: new Date().toISOString(), note: 'Crowd-sourced listing. Verify against the venue before adding to web/data/open-mics.json.', dated_rows: entries.length, recurring: list }, null, 1) + '\n');
  console.log(`badslava: ${entries.length} dated rows, ${list.length} distinct mics (${list.filter((r) => r.in_open_mics).length} venues already listed), ${previous ? added.length + ' new since last pull' : 'first pull'}`);
  if (previous && added.length) added.slice(0, 15).forEach((r) => console.log(`  + ${r.weekday_name} ${r.time} ${r.venue} (${r.address})`));
})().catch((e) => { console.error('badslava:', e.message); process.exit(1); });
