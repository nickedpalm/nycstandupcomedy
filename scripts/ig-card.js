#!/usr/bin/env node
// Render Instagram cards (1080x1350 JPEG) for picks, in the site's bulletin-board style.
//   node scripts/ig-card.js --tonight [--date=YYYY-MM-DD]   cover card + one card per pick that day
//   node scripts/ig-card.js --weekend [--date=YYYY-MM-DD]   cover card + one card per pick Fri-Sun
//   node scripts/ig-card.js --pick <id> [--pick <id> ...]  cards for specific picks
//   --out=DIR (default web/assets/ig)  --json (print a manifest instead of prose)
//   --photo  photo-first template: official artwork full-bleed with a highlighted headline (credit in the caption)
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
const venuesByName = new Map(JSON.parse(fs.readFileSync(path.join(web, 'data', 'venues.json'), 'utf8')).map((v) => [v.name, v]));
const hoodOf = (p) => venuesByName.get(p.venue)?.neighborhood || p.neighborhood || '';

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
body{background:#2a1208 url(${dataUrl(path.join(web, 'assets/club-brick.png'), 'image/png')}) center/640px repeat;position:relative;font-family:Oswald,Impact,sans-serif;color:#2a1b13}
body:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,#0000 25%,#000000b0 100%)}
.wrap{position:relative;height:100%;display:flex;flex-direction:column;padding:54px 54px 44px}
.paper{flex:1;background:#f3e6c8 linear-gradient(168deg,#f9eed6,#e8d5ab 62%,#dfc99a);border:3px solid #c6b088;box-shadow:14px 18px 36px #0d0402d0;transform:rotate(-1.2deg);padding:56px 58px 48px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.paper:before{content:'';position:absolute;top:-22px;left:50%;width:190px;height:52px;margin-left:-95px;background:#e9dcb5a8;transform:rotate(-3deg)}
.brand{font:700 30px/1 Oswald;letter-spacing:.14em;text-transform:uppercase;color:#b3261e}
.brand span{color:#3a1d0e}
.kicker{display:inline-block;margin:26px 0 0;background:linear-gradient(#f0a12d,#c9731a);color:#2a1408;font:500 44px/1 Oswald;text-transform:uppercase;letter-spacing:.12em;padding:16px 26px 14px;transform:rotate(-1.5deg);box-shadow:4px 5px 0 #5a2a0a}
.title{margin-top:34px;font:700 var(--ts,150px)/.92 Oswald;text-transform:uppercase;letter-spacing:-.01em;color:#2a1408;word-wrap:break-word}
.where{margin-top:40px;font:500 64px/1.05 Oswald;text-transform:uppercase;letter-spacing:.02em;color:#b3261e}
.big-time{margin-top:auto;padding-top:20px;font:700 210px/.9 Oswald;color:#e3d2ac;letter-spacing:-.02em;text-transform:uppercase}
.where small{display:block;margin-top:14px;font:400 34px/1.3 Arial,sans-serif;text-transform:none;letter-spacing:0;color:#4a382b}
.stamp{position:absolute;right:52px;bottom:190px;transform:rotate(-8deg);border:6px solid #b3261e;color:#b3261e;font:700 54px/1 Oswald;text-transform:uppercase;letter-spacing:.08em;padding:12px 18px;opacity:.9}
.stamp.paid{border-color:#3a1d0e;color:#3a1d0e}
.foot{margin-top:26px;display:flex;justify-content:space-between;align-items:baseline}
.foot .url{font:44px/1 Marker;color:#f6c343;text-shadow:2px 3px 0 #2a1208}
.foot .note{font:26px/1.2 Oswald;text-transform:uppercase;letter-spacing:.1em;color:#e0cfae}
.list{margin-top:26px;display:flex;flex-direction:column;justify-content:space-evenly;flex:1}
.row{padding:14px 0;border-bottom:4px dotted #b9a882}
.row:last-child{border-bottom:0}
.row .n{font:700 var(--rs,72px)/.95 Oswald;text-transform:uppercase;color:#2a1408}
.row .v{margin-top:10px;font:500 40px/1.2 Oswald;text-transform:uppercase;letter-spacing:.06em;color:#b3261e}
.art{margin:24px 0 0;height:440px;background:#efe5cd;border:2px solid #c6b088;display:flex;align-items:center;justify-content:center}
.art img{max-height:100%;max-width:100%;object-fit:contain}
/* photo-first template (Time Out / Don't Tell pattern) */
.photo{position:absolute;inset:0;background-size:cover;background-position:center 30%}
.photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#000000a6 0%,#00000040 16%,#0000 30%,#0000 42%,#000000e6 100%)}
.pw{position:relative;height:100%;display:flex;flex-direction:column;padding:48px 56px 56px;color:#fff}
.lock{align-self:center;font:700 34px/1 Oswald;letter-spacing:.16em;text-transform:uppercase;color:#f6c343;text-shadow:0 2px 6px #000c}
.lock span{color:#fff}
.hl{margin-top:auto;font:700 var(--hs,84px)/1.32 Oswald;text-transform:uppercase;letter-spacing:.005em}
.hl i{font-style:normal;background:#b3261e;color:#fff;padding:4px 20px 8px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.hl i.gold{background:#f6c343;color:#2a1408;font-size:.52em;letter-spacing:.12em;padding:10px 18px;position:relative;top:-.35em}
.dek{margin-top:18px;font:400 34px/1.35 Arial,sans-serif;color:#f1e8ce;text-shadow:0 2px 6px #000c;max-width:26ch}
.pill{margin-top:28px;display:inline-block;align-self:flex-start;border:3px solid #fff;color:#fff;font:700 24px/1 Oswald;letter-spacing:.14em;text-transform:uppercase;padding:14px 24px;border-radius:40px;text-shadow:none}
.tag2{position:absolute;top:120px;right:56px;background:#b3261e;color:#fff;font:700 30px/1 Oswald;letter-spacing:.12em;text-transform:uppercase;padding:14px 20px;transform:rotate(3deg)}
.tag2.gold{background:#f6c343;color:#2a1408}
.credit2{position:absolute;left:56px;bottom:22px;font:20px/1 Arial,sans-serif;color:#d9c9a5;text-shadow:0 1px 4px #000}
</style>`;

const titleSize = (t) => t.length > 60 ? 88 : t.length > 40 ? 104 : t.length > 24 ? 128 : t.length > 14 ? 150 : 176;
const rowSize = (n, maxLen) => n <= 2 ? (maxLen > 30 ? 84 : 110) : n <= 3 ? (maxLen > 30 ? 72 : 96) : n <= 4 ? (maxLen > 30 ? 58 : 76) : (maxLen > 30 ? 48 : 60);
const sub = (p) => { const m = String(p.description || '').match(/^[^.!?]{12,90}[.!?]/); return m ? m[0] : ''; };

function pickCard(p) {
  const art = p.poster && reusable.has(p.poster.src) ? `<div class="art"><img src="${dataUrl(path.join(web, p.poster.src.replace(/^\//, '')), 'image/' + p.poster.src.split('.').pop().replace('jpg', 'jpeg'))}"></div>` : '';
  const stamp = p.demand === 'sold_out' ? '<div class="stamp">Sold out</div>' : p.demand === 'going_fast' ? '<div class="stamp">Going fast</div>' : p.sponsored ? '<div class="stamp paid">Paid listing</div>' : '';
  const tonight = p.date === nyDate();
  return `${base}<div class="wrap"><div class="paper" style="--ts:${titleSize(p.title)}px">${stamp}<div class="brand">Stand Up <span>Comedy NYC</span></div>
<div class="kicker">${tonight ? 'Tonight' : esc(shortDate(p.date))} · ${esc(p.time_label.split(' · ')[0])}</div>
<h1 class="title">${esc(p.title)}</h1>${art}
<p class="where">${esc(p.venue)}<br>${esc(hoodOf(p))}<small>${/see (the )?(ticket|listing|show) page|see listing/i.test(p.price_label || '') ? esc(sub(p) || '') : esc(p.price_label) + (sub(p) ? ' — ' + esc(sub(p)) : '')}</small></p><div class="big-time">${esc(p.time_label.split(' · ')[0])}</div></div>
<div class="foot"><span class="url">standupcomedynyc.com</span><span class="note">Link in bio</span></div></div>`;
}

const hlSize = (t) => t.length > 48 ? 66 : t.length > 32 ? 76 : t.length > 20 ? 92 : 108;
function photoCard(p) {
  const src = path.join(web, p.poster.src.replace(/^\//, ''));
  const bg = dataUrl(src, 'image/' + p.poster.src.split('.').pop().replace('jpg', 'jpeg'));
  const tag = p.demand === 'sold_out' ? '<div class="tag2">Sold out</div>' : p.demand === 'going_fast' ? '<div class="tag2 gold">Going fast</div>' : p.sponsored ? '<div class="tag2 gold">Paid listing</div>' : '';
  const when = (p.date === nyDate() ? 'Tonight' : shortDate(p.date)) + ' · ' + p.time_label.split(' · ')[0];
  return `${base}<div class="photo" style="background-image:url(${bg})"></div><div class="pw"><div class="lock">Stand Up <span>Comedy NYC</span></div>${tag}
<div class="hl" style="--hs:${hlSize(p.title)}px"><i class="gold">${esc(when)}</i><br><i>${esc(p.title)}</i></div>
<p class="dek">${esc(p.venue)}, ${esc(hoodOf(p))}. ${esc(sub(p) || p.price_label)}</p>
<div class="pill">Tickets · link in bio</div><div class="credit2">${esc(p.poster.credit || '')}</div></div>`;
}
function photoCover(label, day, list) {
  const hero = [...list].filter((p) => p.poster).sort((a, b) => (Number(b.poster.width) * Number(b.poster.height)) - (Number(a.poster.width) * Number(a.poster.height)) || (Number(b.poster.height) >= Number(b.poster.width) ? 1 : 0) - (Number(a.poster.height) >= Number(a.poster.width) ? 1 : 0))[0];
  if (!hero) return coverCard(label, day, list);
  const bg = dataUrl(path.join(web, hero.poster.src.replace(/^\//, '')), 'image/' + hero.poster.src.split('.').pop().replace('jpg', 'jpeg'));
  const n = list.length; const names = list.slice(0, 4).map((p) => p.title.split(':')[0]).join(' · ') + (n > 4 ? ` · +${n - 4}` : '');
  const head = label === 'Tonight' ? `${n} show${n === 1 ? '' : 's'} worth leaving the house for tonight` : `${n} show${n === 1 ? '' : 's'} worth the train this weekend`;
  return `${base}<div class="photo" style="background-image:url(${bg})"></div><div class="pw"><div class="lock">Stand Up <span>Comedy NYC</span></div>
<div class="hl" style="--hs:${hlSize(head)}px"><i class="gold">${esc(shortDate(day))}</i><br><i>${esc(head)}</i></div>
<p class="dek">${esc(names)}</p><div class="pill">Swipe for the picks</div><div class="credit2">${esc(hero.poster.credit || '')}</div></div>`;
}
function coverCard(label, day, list) {
  const n = Math.min(list.length, 5); const maxLen = Math.max(...list.slice(0, n).map((p) => p.title.length));
  const rows = list.slice(0, n).map((p) => `<div class="row"><div class="n" style="--rs:${rowSize(n, maxLen)}px">${esc(p.title)}</div><div class="v">${esc(p.time_label.split(' · ')[0])} · ${esc(p.venue)}${p.demand === 'sold_out' ? ' · sold out' : ''}${p.sponsored ? ' · paid' : ''}</div></div>`).join('');
  const more = list.length > n ? `<div class="row"><div class="v">+ ${list.length - n} more on the site</div></div>` : '';
  return `${base}<div class="wrap"><div class="paper"><div class="brand">Stand Up <span>Comedy NYC</span></div>
<div class="kicker">${esc(label)} · ${esc(shortDate(day))}</div><div class="list">${rows}${more}</div></div>
<div class="foot"><span class="url">standupcomedynyc.com</span><span class="note">Link in bio</span></div></div>`;
}

(async () => {
  const day = args.date || nyDate();
  const jobs = [];
  if (args.tonight) {
    const list = picks.filter((p) => p.date === day).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    if (!list.length) { console.error(`ig-card: no picks on ${day}`); process.exit(1); }
    jobs.push({ kind: 'cover', id: 'tonight-' + day, html: (args.photo ? photoCover : coverCard)('Tonight', day, list), picks: list.map((p) => p.id) });
    list.forEach((p) => jobs.push({ kind: 'pick', id: p.id, html: (args.photo && p.poster) ? photoCard(p) : pickCard(p), picks: [p.id] }));
  }
  if (args.weekend) {
    const days = weekendDays(day);
    const list = picks.filter((p) => days.includes(p.date) && p.date >= day).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    if (!list.length) { console.error('ig-card: no weekend picks'); process.exit(1); }
    jobs.push({ kind: 'cover', id: 'weekend-' + days[0], html: (args.photo ? photoCover : coverCard)('This weekend', days[0], list), picks: list.map((p) => p.id) });
    list.forEach((p) => jobs.push({ kind: 'pick', id: p.id, html: (args.photo && p.poster) ? photoCard(p) : pickCard(p), picks: [p.id] }));
  }
  for (const id of args.pick) {
    const p = picks.find((r) => r.id === id);
    if (!p) { console.error(`ig-card: unknown pick ${id}`); process.exit(1); }
    jobs.push({ kind: 'pick', id: p.id, html: (args.photo && p.poster) ? photoCard(p) : pickCard(p), picks: [p.id] });
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
