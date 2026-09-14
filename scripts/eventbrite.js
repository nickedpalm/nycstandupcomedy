#!/usr/bin/env node
// Pull upcoming events from the Eventbrite organizer pages of registered rooms into
// candidates/eventbrite.json. Only rooms with `eventbrite_organizer` in web/data/venues.json are
// read, so every candidate is already matched to a registered venue. Run with `npm run eventbrite`.
// Candidates are leads for the editor; nothing here goes to picks.json without opening the page.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'candidates', 'eventbrite.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const headers = { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const venues = JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', 'venues.json'), 'utf8')).filter((v) => v.eventbrite_organizer);
const picks = JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', 'picks.json'), 'utf8'));
const known = new Set(picks.map((p) => (p.ticket_url || p.source_url || '').replace(/\?.*$/, '')));
const knownIds = new Set(picks.flatMap((p) => [p.ticket_url, p.source_url].filter(Boolean).map((u) => (u.match(/tickets-(\d+)|wfea_eb_id=(\d+)/) || []).slice(1).find(Boolean)).filter(Boolean)));
const nyDate = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
const nyTime = (iso) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)).toLowerCase().replace(':00', '').replace(' ', '');

async function get(url) { const r = await fetch(url, { headers }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text(); }
function ld(html) {
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);
  const flat = blocks.flatMap((b) => (Array.isArray(b) ? b : [b]));
  return flat.find((b) => b['@type'] === 'Event' || (Array.isArray(b['@type']) && b['@type'].includes('Event')));
}
(async () => {
  const previous = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : { events: [] };
  const prevUrls = new Set(previous.events.map((e) => e.url));
  const events = []; const errors = [];
  for (const v of venues) {
    let html;
    try { html = await get(v.eventbrite_organizer); } catch (e) { errors.push(`${v.name}: ${e.message}`); continue; }
    const links = [...new Set([...html.matchAll(/https:\/\/www\.eventbrite\.com\/e\/[a-z0-9-]+-tickets-\d+/g)].map((m) => m[0]))];
    for (const url of links.slice(0, 25)) {
      await sleep(400);
      let page; try { page = await get(url); } catch (e) { errors.push(`${url}: ${e.message}`); continue; }
      const ev = ld(page); if (!ev || !ev.startDate) continue;
      if (/cancel+ed/i.test(ev.name || '')) continue;
      const loc = ev.location || {}; const addr = loc.address || {};
      const offers = [].concat(ev.offers || []); const prices = offers.map((o) => Number(o.lowPrice ?? o.price)).filter((n) => Number.isFinite(n));
      const start = new Date(ev.startDate); if (Number.isNaN(start) || start.getTime() < Date.now()) continue;
      const og = (page.match(/<meta property="og:image" content="([^"]+)"/) || [])[1] || null;
      const image = ev.image ? (Array.isArray(ev.image) ? ev.image[0] : ev.image) : (og ? decodeURIComponent((og.match(/url=([^&]+)/) || [])[1] || '') : null);
      events.push({ venue: v.name, neighborhood: v.neighborhood, organizer: v.eventbrite_organizer, title: ev.name, date: nyDate(ev.startDate), time: nyTime(ev.startDate), starts_at: ev.startDate, ends_at: ev.endDate || null, location_name: loc.name || null, location_address: [addr.streetAddress, addr.addressLocality].filter(Boolean).join(', ') || null, price_from: prices.length ? Math.min(...prices) : null, url, image: image || null, description: (ev.description || '').replace(/\s+/g, ' ').trim().slice(0, 300), venue_name_matches: !loc.name || new RegExp(v.name.split(' ')[0], 'i').test(loc.name), already_a_pick: known.has(url) || knownIds.has((url.match(/tickets-(\d+)/) || [])[1]), seen_before: prevUrls.has(url) });
    }
  }
  events.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ retrieved_at: new Date().toISOString(), note: 'Leads from Eventbrite organizer pages of registered rooms. Open the event page before adding a pick; artwork needs a POSTER-SOURCES record.', organizers: venues.map((v) => ({ venue: v.name, organizer: v.eventbrite_organizer })), events, errors }, null, 1) + '\n');
  const fresh = events.filter((e) => !e.seen_before && !e.already_a_pick);
  console.log(`eventbrite: ${events.length} upcoming events from ${venues.length} organizers, ${events.filter((e) => e.already_a_pick).length} already picks, ${fresh.length} new leads${errors.length ? `, ${errors.length} errors` : ''}`);
  fresh.slice(0, 20).forEach((e) => console.log(`  + ${e.date} ${e.time} ${e.title} @ ${e.venue}${e.price_from !== null ? ' $' + e.price_from : ''}`));
  events.filter((e) => !e.venue_name_matches).forEach((e) => console.log(`  ? ${e.title}: listed at "${e.location_name}", not ${e.venue}`));
})().catch((e) => { console.error('eventbrite:', e.message); process.exit(1); });
