#!/usr/bin/env node
// Publish cards to Instagram through the Instagram API with Instagram Login.
//   node scripts/ig-post.js --tonight [--date=YYYY-MM-DD]     carousel: cover + up to 9 pick cards, one post
//   node scripts/ig-post.js --pick <id> [--caption="..."]      single image post for one pick
//   node scripts/ig-post.js --image=URL --caption="..."        any hosted JPEG
//   --story                                                    post as a story instead of a feed post
//   --dry-run                                                  print what would be posted, call nothing
//   --refresh-token                                            extend the long-lived token by 60 days
// Env: IG_ACCESS_TOKEN, IG_USER_ID. Optional IG_TOKEN_FILE (path to write a refreshed token).
// Every publish is appended to POSTED-IG.json; a pick already posted the same day is refused.
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SITE = 'https://standupcomedynyc.com';
const API = 'https://graph.instagram.com/v23.0';
const logFile = path.join(root, 'POSTED-IG.json');

const args = { pick: [] };
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (!m) { if (args._last === 'pick') args.pick.push(a); continue; }
  if (m[1] === 'pick') { if (m[2]) args.pick.push(m[2]); args._last = 'pick'; continue; }
  args[m[1]] = m[2] ?? true; args._last = m[1];
}
const dryRun = Boolean(args['dry-run']);
const token = process.env.IG_ACCESS_TOKEN, userId = process.env.IG_USER_ID;
if (!dryRun && (!token || !userId)) { console.error('ig-post: IG_ACCESS_TOKEN and IG_USER_ID must be set'); process.exit(2); }

const nyDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const longDate = (day) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(day + 'T12:00:00-04:00'));
const picks = JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', 'picks.json'), 'utf8'));
const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : [];
const cardUrl = (id) => `${SITE}/assets/ig/${id}.jpg`;
const cardExists = (id) => fs.existsSync(path.join(root, 'web', 'assets', 'ig', id + '.jpg'));

async function api(pathname, params, method = 'POST') {
  const url = new URL(API + pathname);
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = method === 'GET' ? await fetch(url + '?' + body) : await fetch(url, { method, body });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`${pathname}: ${data.error?.message || res.status}`);
  return data;
}
async function waitReady(containerId) {
  for (let i = 0; i < 20; i++) {
    const s = await api(`/${containerId}`, { fields: 'status_code,status' }, 'GET');
    if (s.status_code === 'FINISHED') return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error(`container ${containerId} ${s.status_code}: ${s.status || ''}`);
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error(`container ${containerId} not ready after 60s`);
}
async function publish(kind, items, caption, meta) {
  if (dryRun) { console.log(`[dry-run] ${kind}\n  ${items.join('\n  ')}\n--- caption ---\n${caption}\n--- end ---`); return null; }
  let container;
  if (kind === 'carousel') {
    const children = [];
    for (const url of items) { const c = await api(`/${userId}/media`, { image_url: url, is_carousel_item: 'true' }); await waitReady(c.id); children.push(c.id); }
    container = await api(`/${userId}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption });
  } else if (kind === 'story') {
    container = await api(`/${userId}/media`, { image_url: items[0], media_type: 'STORIES' });
  } else {
    container = await api(`/${userId}/media`, { image_url: items[0], caption });
  }
  await waitReady(container.id);
  const result = await api(`/${userId}/media_publish`, { creation_id: container.id });
  const entry = { id: result.id, kind, posted_at: new Date().toISOString(), items, ...meta };
  log.push(entry); fs.writeFileSync(logFile, JSON.stringify(log, null, 1) + '\n');
  console.log(`posted ${kind} ${result.id}`);
  return result.id;
}
const alreadyToday = (pickIds, kind) => log.find((e) => e.kind === kind && e.posted_at.slice(0, 10) === new Date().toISOString().slice(0, 10) && (e.picks || []).some((p) => pickIds.includes(p)));
const hashtags = '#nyccomedy #standupnyc #comedynyc #thingstodonyc';

(async () => {
  if (args['refresh-token']) {
    const r = await fetch(`${API.replace('/v23.0', '')}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`).then((x) => x.json());
    if (r.error) throw new Error(r.error.message);
    if (process.env.IG_TOKEN_FILE) fs.writeFileSync(process.env.IG_TOKEN_FILE, r.access_token + '\n', { mode: 0o600 });
    console.log(`token refreshed; expires in ${Math.round(r.expires_in / 86400)} days${process.env.IG_TOKEN_FILE ? ', written to IG_TOKEN_FILE' : ' (not saved: set IG_TOKEN_FILE)'}`);
    return;
  }
  const day = args.date || nyDate();
  if (args.tonight) {
    const list = picks.filter((p) => p.date === day).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    if (!list.length) { console.error(`ig-post: no picks on ${day}`); process.exit(1); }
    const ids = ['tonight-' + day, ...list.slice(0, 9).map((p) => p.id)];
    const missing = ids.filter((id) => !cardExists(id));
    if (missing.length) { console.error(`ig-post: cards not rendered yet: ${missing.join(', ')} (run npm run ig-card -- --tonight, commit and push first)`); process.exit(1); }
    const kind = args.story ? 'story' : 'carousel';
    if (!dryRun && alreadyToday(list.map((p) => p.id), kind)) { console.error('ig-post: tonight already posted today'); process.exit(1); }
    const caption = args.caption || `Tonight in NYC, ${longDate(day)}:\n\n${list.map((p) => `${p.time_label.split(' · ')[0]} ${p.title} at ${p.venue}${p.sponsored ? ' (paid listing)' : ''}`).join('\n')}\n\nTickets and the full board at standupcomedynyc.com, link in bio.\n\n${hashtags}`;
    await publish(kind, args.story ? [cardUrl(ids[0])] : ids.map(cardUrl), caption, { picks: list.map((p) => p.id), date: day });
    return;
  }
  for (const id of args.pick) {
    const p = picks.find((r) => r.id === id);
    if (!p) { console.error(`ig-post: unknown pick ${id}`); process.exit(1); }
    if (!cardExists(id)) { console.error(`ig-post: card not rendered for ${id}`); process.exit(1); }
    const kind = args.story ? 'story' : 'image';
    if (!dryRun && alreadyToday([id], kind)) { console.error(`ig-post: ${id} already posted today`); process.exit(1); }
    const caption = args.caption || `${p.title}\n${longDate(p.date)} · ${p.time_label} · ${p.venue}, ${p.neighborhood}\n${p.price_label}${p.sponsored ? '\n\nPaid listing.' : ''}\n\n${p.description}\n\nTickets at standupcomedynyc.com, link in bio.\n\n${hashtags}`;
    await publish(kind, [cardUrl(id)], caption, { picks: [id], date: p.date });
  }
  if (args.image) {
    if (!args.caption && !args.story) { console.error('ig-post: --image needs --caption'); process.exit(1); }
    await publish(args.story ? 'story' : 'image', [args.image], args.caption || '', {});
  }
  if (!args.tonight && !args.pick.length && !args.image) { console.error('ig-post: nothing to do (use --tonight, --pick <id> or --image=URL)'); process.exit(2); }
})().catch((e) => { console.error('ig-post:', e.message); process.exit(1); });
