#!/usr/bin/env node
// Bar-show leads from neighborhood subreddits: promoters posting their own comedy nights.
// Reads the last 14 days from NYC and neighborhood subs via the same read-only Reddit app as
// scripts/reddit.js, keeps posts that look like a comedy show announcement, matches the text against
// the venue registry, and writes candidates/reddit-leads.json. Leads, never sources. `npm run reddit-leads`.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const UA = 'standupcomedynyc-leads/1.0 (read-only; info@standupcomedynyc.com)';
const SUBS = ['nycevents', 'NYCComedy', 'williamsburg', 'lowereastside', 'Bushwick', 'astoria', 'Brooklyn', 'nyc', 'AskNYC', 'parkslope', 'greenpoint', 'Harlem', 'crownheights', 'bedstuy', 'ridgewood', 'LongIslandCity', 'eastvillage', 'Queens', 'bronx', 'StatenIsland', 'FortGreene', 'Gowanus'];
const out = path.join(root, 'candidates', 'reddit-leads.json');
const venues = JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', 'venues.json'), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function token() {
  const id = process.env.REDDIT_CLIENT_ID, secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) { console.error('reddit-leads: REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET not set'); process.exit(2); }
  const r = await fetch('https://www.reddit.com/api/v1/access_token', { method: 'POST', headers: { 'User-Agent': UA, 'Authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  if (!r.ok) throw new Error(`token HTTP ${r.status}`); return (await r.json()).access_token;
}
const looksLikeShow = (p) => /\b(comedy|comedian|stand-?up|open mic|showcase)\b/i.test(p.title + ' ' + (p.selftext || '')) && !/\b(looking for|recommend|where (can|should)|any (good|suggestions)|best comedy clubs?\??|question)\b/i.test(p.title);
(async () => {
  const t = await token(); const since = Date.now() / 1000 - 14 * 86400; const seen = new Map();
  for (const sub of SUBS) {
    const url = new URL(`https://oauth.reddit.com/r/${sub}/search`); url.search = new URLSearchParams({ q: 'comedy OR "stand up" OR "open mic"', restrict_sr: 'true', sort: 'new', t: 'month', limit: 50 });
    let r = await fetch(url, { headers: { 'User-Agent': UA, 'Authorization': 'Bearer ' + t } });
    if (r.status === 429) { await sleep(3000); r = await fetch(url, { headers: { 'User-Agent': UA, 'Authorization': 'Bearer ' + t } }); }
    if (!r.ok) { console.error(`  r/${sub}: HTTP ${r.status}`); await sleep(700); continue; }
    for (const c of (await r.json()).data?.children || []) { const p = c.data; if (p.created_utc >= since && looksLikeShow(p) && !seen.has(p.id)) seen.set(p.id, p); }
    await sleep(700);
  }
  const previous = fs.existsSync(out) ? new Set(JSON.parse(fs.readFileSync(out, 'utf8')).leads.map((l) => l.id)) : new Set();
  const leads = [...seen.values()].map((p) => {
    const text = (p.title + ' ' + (p.selftext || '')).replace(/\s+/g, ' ');
    const matched = venues.filter((v) => new RegExp('\\b' + v.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s*\(.*\)/, '') + '\\b', 'i').test(text)).map((v) => v.name);
    const when = (text.match(/\b(mon|tues|wednes|thurs|fri|satur|sun)day\b[^.!\n]{0,40}/i) || [])[0] || null;
    const timeHit = (text.match(/\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i) || [])[0] || null;
    const links = [...new Set((p.selftext || '').match(/https?:\/\/[^\s)\]]+/g) || [])].filter((u) => !/reddit\.com|redd\.it/.test(u)).slice(0, 3);
    return { id: p.id, date: new Date(p.created_utc * 1000).toISOString().slice(0, 10), subreddit: p.subreddit, title: p.title, score: p.score, comments: p.num_comments, url: 'https://www.reddit.com' + p.permalink, venues_mentioned: matched, when_mentioned: when, time_mentioned: timeHit, links, free: /\bfree\b/i.test(text), new_since_last_run: !previous.has(p.id), excerpt: (p.selftext || '').replace(/\s+/g, ' ').slice(0, 280) };
  }).sort((a, b) => b.date.localeCompare(a.date));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ retrieved_at: new Date().toISOString(), note: 'Promoter posts from NYC neighborhood subreddits, last 14 days. Leads only: open the linked page or the venue site before anything enters the data; register the venue first.', subreddits: SUBS, leads }, null, 1) + '\n');
  const fresh = leads.filter((l) => l.new_since_last_run);
  console.log(`reddit-leads: ${leads.length} show posts in 14 days across ${SUBS.length} subs, ${fresh.length} new, ${leads.filter((l) => l.venues_mentioned.length).length} mention a registered room`);
  fresh.slice(0, 15).forEach((l) => console.log(`  + ${l.date} r/${l.subreddit}: ${l.title.slice(0, 80)}${l.venues_mentioned.length ? ' [' + l.venues_mentioned.join(', ') + ']' : ''}${l.free ? ' (free)' : ''}`));
})().catch((e) => { console.error('reddit-leads:', e.message); process.exit(1); });
