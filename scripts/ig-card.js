#!/usr/bin/env node
// Render Instagram cards (1080x1350 JPEG) for picks, in the site's bulletin-board style.
//   node scripts/ig-card.js --tonight [--date=YYYY-MM-DD]   cover card + one card per pick that day
//   node scripts/ig-card.js --weekend [--date=YYYY-MM-DD]   cover card + one card per pick Fri-Sun
//   node scripts/ig-card.js --pick <id> [--pick <id> ...]  cards for specific picks
//   --out=DIR (default web/assets/ig)  --json (print a manifest instead of prose)
// Cards are text-only by default. Artwork is included only when the pick's poster
// record has reuse: "granted" in POSTER-SOURCES.json.
// Needs a Chromium headless shell: set IG_BROWSER to the binary, or it is found under
// PLAYWRIGHT_BROWSERS_PATH / ~/.cache/ms-playwright.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { chromium } = require('playwright-core');

const root = path.join(__dirname, '..');
const web = path.join(root, 'web');
const SITE = 'https://standupcomedynyc.com';
const W = 1080, H = 1350;

const args = { pick: [] };
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (!m) { if (args._last === 'pick') args.pick.push(a); continue; }
  if (m[1] === 'pick') { if (m[2]) args.pick.push(m[2]); args._last = 'pick'; continue; }
  args[m[1]] = m[2] ?? true; args._last = m[1];
}
const outDir = path.resolve(root, args.out || 'web/assets/ig');

function findBrowser() {
  if (process.env.IG_BROWSER && fs.existsSync(process.env.IG_BROWSER)) return process.env.IG_BROWSER;
  const bases = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(os.homedir(), '.cache', 'ms-playwright')].filter(Boolean);
  const rel = ['chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-linux/headless_shell', 'chrome-linux/chrome'];
  for (const base of bases) {
    if (!fs.existsSync(base)) continue;
    const dirs = fs.readdirSync(base).filter((d) => d.startsWith('chromium')).sort().reverse();
    for (const d of dirs) for (const r of rel) { const p = path.join(base, d, r); if (fs.existsSync(p)) return p; }
  }
  throw new Error('No Chromium headless shell found. Set IG_BROWSER=/path/to/chrome-headless-shell');
}

const nyDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const longDate = (day) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(day + 'T12:00:00-04:00'));
const shortDate = (day) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(day + 'T12:00:00-04:00')).toUpperCase();
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dataUrl = (p, type) => `data:${type};base64,` + fs.readFileSync(p).toString('base64');

const picks = JSON.parse(fs.readFileSync(path.join(web, 'data', 'picks.json'), 'utf8'));
const posters = JSON.parse(fs.readFileSync(path.join(root, 'POSTER-SOURCES.json'), 'utf8'));
const reusable = new Set(posters.filter((p) => p.reuse === 'granted').map((p) => p.src));

function weekendDays(day) {
  const d = new Date(day + 'T12:00:00Z'); const wd = d.getUTCDay();
  const fri = new Date(d); fri.setUTCDate(d.getUTCDate() + (wd === 0 ? -2 : wd === 6 ? -1 : 5 - wd));
  return [0, 1, 2].map((i) => { const x = new Date(fri); x.setUTCDate(fri.getUTCDate() + i); return x.toISOString().slice(0, 10); });
}

const base = `
<style>
@font-face{font-family:Oswald;src:url(${dataUrl(path.join(web, 'assets/fonts/Oswald.ttf'), 'font/ttf')});font-weight:200 700}
@font-face{font-family:Marker;src:url(${dataUrl(path.join(web, 'assets/fonts/PermanentMarker.ttf'), 'font/ttf')})}
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:#2a1208 url(${dataUrl(path.join(web, 'assets/club-brick.png'), 'image/png')}) center/540px repeat;position:relative;font-family:Georgia,serif;color:#2a1b13}
body:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#00000000 30%,#0000008c 100%)}
.wrap{position:relative;padding:64px 64px 56px;height:100%;display:flex;flex-direction:column}
.wordmark{font:700 44px/1 Oswald;letter-spacing:.02em;text-transform:uppercase;color:#f6c343;text-shadow:3px 3px 0 #b3261e,5px 5px 0 #2a1208}
.wordmark span{color:#fff3dc}
.bar{margin:34px -12px 0;background:linear-gradient(#d3352a,#a51d15);color:#fff3dc;font:500 46px/1.15 Oswald;text-transform:uppercase;letter-spacing:.09em;text-align:center;padding:16px 24px;text-shadow:2px 2px 0 #5a0d08;clip-path:polygon(0 8%,2% 0,30% 5%,55% 0,80% 6%,98% 0,100% 10%,100% 92%,97% 100%,70% 95%,45% 100%,20% 94%,3% 100%,0 90%)}
.bar.gold{background:linear-gradient(#f0a12d,#c9731a);color:#2a1408;text-shadow:1px 1px 0 #fbe0a6}
.paper{margin-top:36px;flex:1;background:#f3e6c8 linear-gradient(170deg,#f8edd3,#e7d4aa 60%,#e0cc9f);border:2px solid #c6b088;box-shadow:10px 14px 30px #0d0402c0;padding:52px 56px;transform:rotate(-.6deg);display:flex;flex-direction:column;gap:22px;position:relative}
.paper:before{content:'';position:absolute;top:-22px;left:50%;width:150px;height:44px;margin-left:-75px;background:#e9dcb590;transform:rotate(-2deg)}
.time{font:700 34px/1.2 'Courier New',monospace;color:#b3261e;letter-spacing:.02em}
.title{font:500 var(--ts,92px)/1 Oswald;text-transform:uppercase;letter-spacing:.005em;color:#3a1d0e}
.desc{font:44px/1.35 Georgia,serif;color:#2a1b13;max-width:24ch;margin-top:10px}
.meta{margin-top:auto;font:30px/1.5 Arial,sans-serif;color:#4a382b}
.meta b{color:#b3261e;font-weight:700}
.tag{display:inline-block;background:#3a1d0e;color:#f6e4c3;font:700 22px/1 'Courier New',monospace;letter-spacing:.1em;text-transform:uppercase;padding:10px 14px}
.tag.paid{background:#c9731a;color:#2a1408}
.foot{margin-top:34px;display:flex;justify-content:space-between;align-items:baseline;color:#f6e4c3}
.foot .url{font:38px/1 Marker;color:#f6c343}
.foot .note{font:24px/1.3 Arial,sans-serif;color:#e0cfae}
.list{display:flex;flex-direction:column;gap:0}
.row{display:grid;grid-template-columns:170px 1fr;gap:20px;padding:22px 0;border-bottom:2px dashed #b9a882;align-items:baseline}
.row:last-child{border-bottom:0}
.row .t{font:700 30px/1.2 'Courier New',monospace;color:#b3261e}
.row .n{font:500 44px/1.05 Oswald;text-transform:uppercase;color:#3a1d0e}
.row .v{font:26px/1.4 Arial,sans-serif;color:#4a382b;margin-top:6px}
.art{margin:-10px 0 4px;height:520px;display:flex;align-items:center;justify-content:center;background:#efe5cd;border:1px solid #c6b088}
.art img{max-height:100%;max-width:100%;object-fit:contain}
.credit{font:20px/1.3 Arial,sans-serif;color:#6b5a48}
</style>`;

const titleSize = (t) => t.length > 64 ? 64 : t.length > 44 ? 78 : t.length > 28 ? 96 : t.length > 16 ? 116 : 136;

function pickCard(p) {
  const art = p.poster && reusable.has(p.poster.src) ? `<div class="art"><img src="${dataUrl(path.join(web, p.poster.src.replace(/^\//, '')), 'image/' + p.poster.src.split('.').pop().replace('jpg', 'jpeg'))}"></div><p class="credit">${esc(p.poster.credit)}</p>` : '';
  const tag = p.sponsored ? '<span class="tag paid">Paid listing</span>' : p.featured ? '<span class="tag">Editor’s pick</span>' : '';
  return `${base}<div class="wrap"><div class="wordmark">Stand Up <span>Comedy NYC</span></div>
<div class="bar ${p.date === nyDate() ? 'gold' : ''}">${p.date === nyDate() ? 'Tonight · ' : ''}${esc(shortDate(p.date))}</div>
<div class="paper" style="--ts:${titleSize(p.title)}px">${art}<div class="time">${esc(p.time_label)} ${tag}</div><h1 class="title">${esc(p.title)}</h1>
<p class="desc">${esc(p.description)}</p><p class="meta">${esc(p.venue)} · ${esc(p.neighborhood)}<br><b>${esc(p.price_label)}</b></p></div>
<div class="foot"><span class="url">standupcomedynyc.com</span><span class="note">Tickets and the full board on the site</span></div></div>`;
}

function coverCard(label, day, list) {
  const rows = list.slice(0, 6).map((p) => `<div class="row"><div class="t">${esc(p.time_label.split(' · ')[0])}</div><div><div class="n" style="font-size:${p.title.length > 40 ? 34 : 44}px">${esc(p.title)}</div><div class="v">${esc(p.venue)} · ${esc(p.neighborhood)}${p.sponsored ? ' · Paid listing' : ''}</div></div></div>`).join('');
  const more = list.length > 6 ? `<p class="meta">+ ${list.length - 6} more on the site</p>` : '';
  return `${base}<div class="wrap"><div class="wordmark">Stand Up <span>Comedy NYC</span></div>
<div class="bar gold">${esc(label)}</div><div class="paper"><div class="time">${esc(longDate(day))}</div><div class="list">${rows}</div>${more}</div>
<div class="foot"><span class="url">standupcomedynyc.com</span><span class="note">Link in bio for tickets</span></div></div>`;
}

(async () => {
  const day = args.date || nyDate();
  const jobs = [];
  if (args.tonight) {
    const list = picks.filter((p) => p.date === day).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    if (!list.length) { console.error(`ig-card: no picks on ${day}`); process.exit(1); }
    jobs.push({ kind: 'cover', id: 'tonight-' + day, html: coverCard('Tonight', day, list), picks: list.map((p) => p.id) });
    list.forEach((p) => jobs.push({ kind: 'pick', id: p.id, html: pickCard(p), picks: [p.id] }));
  }
  if (args.weekend) {
    const days = weekendDays(day);
    const list = picks.filter((p) => days.includes(p.date) && p.date >= day).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    if (!list.length) { console.error('ig-card: no weekend picks'); process.exit(1); }
    jobs.push({ kind: 'cover', id: 'weekend-' + days[0], html: coverCard('This weekend', days[0], list), picks: list.map((p) => p.id) });
    list.forEach((p) => jobs.push({ kind: 'pick', id: p.id, html: pickCard(p), picks: [p.id] }));
  }
  for (const id of args.pick) {
    const p = picks.find((r) => r.id === id);
    if (!p) { console.error(`ig-card: unknown pick ${id}`); process.exit(1); }
    jobs.push({ kind: 'pick', id: p.id, html: pickCard(p), picks: [p.id] });
  }
  if (!jobs.length) { console.error('ig-card: nothing to do (use --tonight, --weekend or --pick <id>)'); process.exit(2); }

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: findBrowser() });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const manifest = [];
  for (const job of jobs) {
    await page.setContent(job.html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, job.id + '.jpg');
    await page.screenshot({ path: file, type: 'jpeg', quality: 90 });
    const rel = path.relative(web, file).split(path.sep).join('/');
    manifest.push({ kind: job.kind, id: job.id, file: path.relative(root, file), url: rel.startsWith('..') ? null : `${SITE}/${rel}`, picks: job.picks });
  }
  await browser.close();
  if (args.json) console.log(JSON.stringify(manifest, null, 1));
  else manifest.forEach((m) => console.log(`${m.kind.padEnd(5)} ${m.file}`));
})().catch((e) => { console.error('ig-card:', e.message); process.exit(1); });
