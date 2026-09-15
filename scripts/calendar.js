#!/usr/bin/env node
// Content calendar, generated from the data: six weeks ahead, week by week. Writes
// candidates/content-calendar.md (for the editor) and, with --out=DIR, DIR/calendar.html (an unlinked
// page in the site's style for Nick). Run by `npm run build` and `npm run calendar`.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = (process.argv.find((a) => a.startsWith('--out=')) || '').slice(6);
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const picks = readJson(path.join(root, 'web', 'data', 'picks.json'), []).filter((p) => Date.parse(p.ends_at) > Date.now()).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
const venues = new Map(readJson(path.join(root, 'web', 'data', 'venues.json'), []).map((v) => [v.name, v]));
const leads = readJson(path.join(root, 'candidates', 'eventbrite.json'), { events: [] }).events || [];
const heat = new Map((readJson(path.join(root, 'candidates', 'heat.json'), { picks: [] }).picks || []).map((h) => [h.id, h]));
const plan = readJson(path.join(root, 'candidates', 'research-plan.json'), null);
const dayMs = 86400000; const today = new Date(); const iso = (d) => d.toISOString().slice(0, 10);
const fmt = (d) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric' }).format(new Date(d + 'T12:00:00-04:00'));
const dow = (d) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short' }).format(new Date(d + 'T12:00:00-04:00'));
const weeks = [];
for (let w = 0; w < 6; w++) {
  const start = iso(new Date(today.getTime() + w * 7 * dayMs)), end = iso(new Date(today.getTime() + (w * 7 + 6) * dayMs));
  const rows = picks.filter((p) => p.date >= start && p.date <= end);
  const wleads = leads.filter((l) => l.date >= start && l.date <= end && !l.already_a_pick);
  const flags = [];
  if (rows.length < 8) flags.push(`only ${rows.length} pick${rows.length === 1 ? '' : 's'}; target 8`);
  const noArt = rows.filter((p) => !p.poster); if (noArt.length) flags.push(`${noArt.length} without artwork`);
  const boroughs = new Set(rows.map((p) => venues.get(p.venue)?.borough).filter(Boolean)); if (rows.length && !boroughs.has('Brooklyn')) flags.push('nothing in Brooklyn'); if (rows.length && !boroughs.has('Manhattan')) flags.push('nothing in Manhattan');
  const friSat = rows.filter((p) => ['Fri', 'Sat'].includes(dow(p.date))).length; if (rows.length && friSat < 2) flags.push('weekend is thin');
  if (wleads.length) flags.push(`${wleads.length} Eventbrite lead${wleads.length === 1 ? '' : 's'} not yet reviewed`);
  weeks.push({ w, start, end, rows, leads: wleads, flags });
}
const md = [];
md.push(`# Content calendar — generated ${iso(today)}`, '', 'Six weeks ahead from the board. Regenerated on every build; edit the data, not this file.', '');
md.push('## Standing slots', '', '- Every day 3pm: Tonight carousel for Instagram (hand-off until the API token exists).', '- Mondays 13:00 UTC: Heard around town draft.', '- Nightly 09:15 UTC: rotation and demand tags. Morning 11:00 UTC: edition (picks for the horizon, leads, research plan).', '- Sponsored shelf slots: 4 max, paid first. Open slots this week: ' + (4 - picks.filter((p) => p.sponsored && p.date <= weeks[0].end).length) + '.', '');
if (plan) md.push('## Research plan today', '', `Ranked ${plan.performers_considered}; run ${plan.run.length}, reuse ${plan.reuse.length}, skip ${plan.skip.length}; ~${plan.estimated_tokens_saved.toLocaleString()} tokens saved.` + (plan.no_recent_data.length ? ` No recent data: ${plan.no_recent_data.join(', ')}.` : ''), '');
for (const wk of weeks) {
  md.push(`## Week ${wk.w + 1}: ${fmt(wk.start)} to ${fmt(wk.end)} — ${wk.rows.length} pick${wk.rows.length === 1 ? '' : 's'}${wk.flags.length ? ' — ' + wk.flags.join(' · ') : ''}`, '');
  for (const p of wk.rows) { const h = heat.get(p.id); md.push(`- ${dow(p.date)} ${fmt(p.date)} ${p.time_label} — **${p.title}** at ${p.venue}${p.poster ? '' : ' · NO ARTWORK'}${p.demand === 'sold_out' ? ' · SOLD OUT' : p.demand === 'going_fast' ? ' · going fast' : ''}${h && h.heat >= 20 ? ` · heat ${h.heat}` : ''}${p.featured ? ' · featured' : ''}${p.sponsored ? ' · PAID' : ''}`); }
  if (wk.leads.length) { md.push('', '  Leads to review:'); wk.leads.slice(0, 8).forEach((l) => md.push(`  - ${dow(l.date)} ${fmt(l.date)} ${l.time} — ${l.title} at ${l.venue}${l.price_from !== null ? ' · from $' + l.price_from : ''}${l.image ? ' · has artwork' : ''}`)); }
  md.push('');
}
fs.mkdirSync(path.join(root, 'candidates'), { recursive: true });
fs.writeFileSync(path.join(root, 'candidates', 'content-calendar.md'), md.join('\n') + '\n');
if (out) {
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Content calendar — Stand Up Comedy NYC</title><meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="/editorial.css"><style>.cal{background:#f3e6c8;border:1px solid #c6b088;padding:22px 26px;margin:18px 0;box-shadow:5px 8px 16px #0d0402}.cal h2{font:500 22px/1.2 Oswald,Impact,'Arial Narrow',sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#3a1d0e;margin:0 0 6px}.cal .flags{font:700 12px/1.5 'Courier New',monospace;color:#b3261e;margin:0 0 10px}.cal ul{list-style:none;margin:0;padding:0}.cal li{padding:6px 0;border-top:1px dotted #cabc9b;font:15px/1.4 Arial,sans-serif}.cal li b{font-family:Georgia,serif}.tag{display:inline-block;margin-left:8px;padding:1px 6px;font:700 11px/1.4 'Courier New',monospace;letter-spacing:.06em;text-transform:uppercase;background:#3a1d0e;color:#f6e4c3}.tag.warn{background:#c9731a;color:#2a1408}.tag.hot{background:#b3261e;color:#fff3dc}.lead{color:#6b5a48;font-style:italic}</style></head><body class="editorial"><div class="edition"><header class="masthead"><div class="header-row"><a class="wordmark" href="/" aria-label="Stand Up Comedy NYC home"><span>STAND UP</span><span>COMEDY <em>NYC</em></span></a><div class="header-bill"><span>CONTENT CALENDAR</span><strong>Six weeks ahead. Internal, not linked.</strong></div></div></header><div class="layout"><main id="picks"><div class="intro-poster"><p class="eyebrow">Generated ${esc(iso(today))}</p><h1 class="issue-title">The next six weeks.</h1><p class="intro">Built from the same data as the board on every deploy. Flags are gaps to fill: thin weeks, missing artwork, unreviewed leads.</p></div>
${plan ? `<p class="status">Research plan today: ranked ${plan.performers_considered}, run ${plan.run.length}, reuse ${plan.reuse.length}, skip ${plan.skip.length}, about ${plan.estimated_tokens_saved.toLocaleString()} tokens saved.</p>` : ''}
${weeks.map((wk) => `<section class="cal"><h2>Week ${wk.w + 1} · ${esc(fmt(wk.start))} to ${esc(fmt(wk.end))} · ${wk.rows.length} pick${wk.rows.length === 1 ? '' : 's'}</h2>${wk.flags.length ? `<p class="flags">${esc(wk.flags.join(' · '))}</p>` : ''}<ul>${wk.rows.map((p) => { const h = heat.get(p.id); return `<li>${esc(dow(p.date))} ${esc(fmt(p.date))} · ${esc(p.time_label)} · <b>${esc(p.title)}</b> · ${esc(p.venue)}${p.poster ? '' : '<span class="tag warn">no artwork</span>'}${p.demand === 'sold_out' ? '<span class="tag">sold out</span>' : p.demand === 'going_fast' ? '<span class="tag warn">going fast</span>' : ''}${h && h.heat >= 20 ? `<span class="tag hot">heat ${h.heat}</span>` : ''}${p.sponsored ? '<span class="tag">paid</span>' : ''}</li>`; }).join('')}${wk.leads.slice(0, 8).map((l) => `<li class="lead">Lead · ${esc(dow(l.date))} ${esc(fmt(l.date))} ${esc(l.time)} · ${esc(l.title)} · ${esc(l.venue)}${l.price_from !== null ? ' · from $' + l.price_from : ''}</li>`).join('')}</ul></section>`).join('\n')}
</main></div></div></body></html>`;
  fs.writeFileSync(path.join(out, 'calendar.html'), html);
}
console.log(`calendar: ${weeks.map((w) => w.rows.length).join('/')} picks over six weeks; flags: ${weeks.filter((w) => w.flags.length).length} weeks need attention`);
