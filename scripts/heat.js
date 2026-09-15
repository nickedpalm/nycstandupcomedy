#!/usr/bin/env node
// Heat: a transparent demand score for every upcoming pick, from signals we can actually read.
//   - ticket availability from the Eventbrite page's structured data (SoldOut / LimitedAvailability / InStock)
//   - a second show of the same title at the same room on the same day (our picks + candidates/eventbrite.json)
//   - Wikipedia pageviews for the performer, last 30 days vs the 30 before (touring names only)
//   - how many rooms list the performer this month (picks + Eventbrite leads)
//   - Reddit mentions in the last 30 days when REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET are set (scripts/reddit.js)
// Writes candidates/heat.json (for the editor) and sets `demand` on picks.json: "sold_out", "going_fast" or null,
// with demand_checked. Only availability and a second show drive the reader-facing tag. Run with `npm run heat`.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const { buzz } = require('./reddit.js');
const UA = 'standupcomedynyc.com heat check (info@standupcomedynyc.com) Mozilla/5.0';
const headers = { 'User-Agent': UA, 'Accept': 'text/html,application/json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const picksFile = path.join(root, 'web', 'data', 'picks.json');
const picks = JSON.parse(fs.readFileSync(picksFile, 'utf8'));
const leads = fs.existsSync(path.join(root, 'candidates', 'eventbrite.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'candidates', 'eventbrite.json'), 'utf8')).events : [];
const today = new Date().toISOString().slice(0, 10);
const norm = (s) => String(s || '').toLowerCase().replace(/[’']/g, "'").replace(/\s*[:–—-].*$/, '').replace(/\b(live|presents.*|headlines.*|in the round|special taping|tries out new ideas)\b.*/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const ebId = (u) => ((String(u || '').match(/tickets-(\d+)|wfea_eb_id=(\d+)/) || []).slice(1).find(Boolean)) || null;
const performer = (title) => { const t = String(title || ''); const m = t.match(/^([A-Z][a-z]+(?: [A-Z][a-zA-Z'’.-]+){1,2})(?::| Live| Presents| Headlines|$)/); return m ? m[1] : null; };

async function availability(url) {
  if (!/eventbrite\.com\/e\//.test(url || '')) return null;
  try {
    const html = await (await fetch(url, { headers })).text();
    for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
      let j; try { j = JSON.parse(m[1]); } catch { continue; }
      for (const x of (Array.isArray(j) ? j : [j])) {
        if (x['@type'] !== 'Event') continue;
        const offers = [].concat(x.offers || []);
        const a = offers.map((o) => String(o.availability || '').replace(/.*\//, '')).filter(Boolean);
        if (a.includes('SoldOut') && a.every((v) => v === 'SoldOut')) return 'SoldOut';
        if (a.includes('LimitedAvailability')) return 'LimitedAvailability';
        if (a.includes('SoldOut')) return 'LimitedAvailability';
        if (a.includes('InStock')) return 'InStock';
      }
    }
  } catch {}
  return null;
}
async function wikipedia(name) {
  if (!name) return null;
  try {
    const q = new URL('https://en.wikipedia.org/w/api.php'); q.search = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: name + ' comedian', gsrlimit: 3, prop: 'description', format: 'json' });
    const r = await (await fetch(q, { headers })).json();
    const pages = Object.values(r.query?.pages || {});
    const page = pages.find((p) => p.title.toLowerCase().replace(/ \(.*\)/, '') === name.toLowerCase() && /comedian|comic|comedy|actor|writer|host/i.test(p.description || ''));
    if (!page) return null;
    const day = (d) => d.toISOString().slice(0, 10).replace(/-/g, '');
    const end = new Date(Date.now() - 86400000), mid = new Date(Date.now() - 31 * 86400000), start = new Date(Date.now() - 61 * 86400000);
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(page.title.replace(/ /g, '_'))}/daily/${day(start)}/${day(end)}`;
    const v = await (await fetch(url, { headers })).json();
    const items = v.items || []; const recent = items.filter((i) => i.timestamp >= day(mid) + '00').reduce((s, i) => s + i.views, 0); const prior = items.filter((i) => i.timestamp < day(mid) + '00').reduce((s, i) => s + i.views, 0);
    return { title: page.title, views_30d: recent, views_prior_30d: prior, change: prior ? Math.round(((recent - prior) / prior) * 100) : null };
  } catch { return null; }
}

(async () => {
  const upcoming = picks.filter((p) => Date.parse(p.ends_at) > Date.now());
  const out = []; const wikiCache = new Map();
  for (const p of upcoming) {
    const reasons = []; let score = 0;
    const avail = await availability(p.ticket_url || p.source_url); await sleep(300);
    if (avail === 'SoldOut') { score += 100; reasons.push('sold out on the ticket page'); }
    else if (avail === 'LimitedAvailability') { score += 70; reasons.push('ticket page says limited availability'); }
    else if (avail === 'InStock') reasons.push('tickets available');
    const key = norm(p.title);
    const sameDay = [...picks.filter((q) => q.id !== p.id && q.venue === p.venue && q.date === p.date && norm(q.title) === key), ...leads.filter((l) => l.venue === p.venue && l.date === p.date && norm(l.title) === key && ebId(l.url) !== ebId(p.ticket_url || p.source_url) && !picks.some((q) => ebId(q.ticket_url || q.source_url) === ebId(l.url)))];
    if (sameDay.length) { score += 25; reasons.push('a second show the same night at the same room'); }
    const name = performer(p.title);
    const bookings = name ? [...picks.filter((q) => norm(q.title).includes(name.toLowerCase())), ...leads.filter((l) => norm(l.title).includes(name.toLowerCase()))].length : 0;
    if (bookings >= 3) { score += 10; reasons.push(`${bookings} listings this month`); }
    let wiki = null;
    if (name) { if (!wikiCache.has(name)) { wikiCache.set(name, await wikipedia(name)); await sleep(300); } wiki = wikiCache.get(name); }
    if (wiki) { const perDay = wiki.views_30d / 30; if (perDay >= 1000) { score += 20; reasons.push(`Wikipedia: ${Math.round(perDay)} views a day`); } else if (perDay >= 200) { score += 10; reasons.push(`Wikipedia: ${Math.round(perDay)} views a day`); } if (wiki.change !== null && wiki.change >= 50) { score += 15; reasons.push(`Wikipedia views up ${wiki.change}% over the prior month`); } }
    let reddit = null;
    if (name && process.env.REDDIT_CLIENT_ID) { try { reddit = await buzz(name); await sleep(1100); } catch (e) { reddit = { error: e.message }; } }
    if (reddit && reddit.posts_30d) { const pts = Math.min(25, reddit.posts_30d * 5 + Math.floor(reddit.upvotes / 50)); score += pts; reasons.push(`Reddit: ${reddit.posts_30d} post${reddit.posts_30d === 1 ? '' : 's'} in 30 days, ${reddit.upvotes} upvotes${reddit.top ? ` (top: r/${reddit.top.subreddit})` : ''}`); }
    const demand = avail === 'SoldOut' ? 'sold_out' : (avail === 'LimitedAvailability' || sameDay.length) ? 'going_fast' : null;
    p.demand = demand; p.demand_checked = today;
    out.push({ id: p.id, title: p.title, venue: p.venue, date: p.date, heat: Math.min(100, score), demand, availability: avail, second_show: sameDay.length > 0, performer: name, wikipedia: wiki, reddit, reasons });
  }
  for (const p of picks) if (!upcoming.includes(p)) { delete p.demand; delete p.demand_checked; }
  out.sort((a, b) => b.heat - a.heat);
  fs.mkdirSync(path.join(root, 'candidates'), { recursive: true });
  fs.writeFileSync(path.join(root, 'candidates', 'heat.json'), JSON.stringify({ generated_at: new Date().toISOString(), note: 'Demand signals for the editor. Only availability and second shows set the public demand tag.', picks: out }, null, 1) + '\n');
  fs.writeFileSync(picksFile, JSON.stringify(picks, null, 1) + '\n');
  console.log(`heat: ${out.length} upcoming picks scored; ${out.filter((o) => o.demand === 'sold_out').length} sold out, ${out.filter((o) => o.demand === 'going_fast').length} going fast`);
  out.filter((o) => o.heat > 0).slice(0, 12).forEach((o) => console.log(`  ${String(o.heat).padStart(3)}  ${o.date} ${o.title} @ ${o.venue}: ${o.reasons.join('; ')}`));
})().catch((e) => { console.error('heat:', e.message); process.exit(1); });
