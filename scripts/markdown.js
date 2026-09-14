#!/usr/bin/env node
// Generate the Markdown edition of the site from the JSON data, for agents and AI crawlers.
// Writes index.md, this-week.md, rooms.md, open-mics.md, clubs.md, neighborhoods.md and llms.txt
// into --out (default dist). Run by `npm run build` after the static copy.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const SITE = 'https://standupcomedynyc.com';
const out = path.resolve(root, (process.argv.find((a) => a.startsWith('--out=')) || '--out=dist').slice(6));
const data = (f) => JSON.parse(fs.readFileSync(path.join(root, 'web', 'data', f), 'utf8'));
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const nyToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const longDate = (d) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(d + 'T12:00:00-04:00'));
const venues = new Map(data('venues.json').map((v) => [v.name, v]));
const hood = (r) => venues.get(r.venue)?.neighborhood || r.neighborhood || '';
const picks = data('picks.json').filter((p) => Date.parse(p.ends_at) > Date.now()).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
const rooms = data('recurring.json'), mics = data('open-mics.json'), clubs = data('clubs.json');
const head = (title, blurb) => `# ${title}\n\n${blurb}\n\nGenerated ${nyToday} from the same data as the website. Times are New York local. Every listing links to the page we verified it against.\n\n`;
const pickLine = (p) => `- **${p.time_label}** — [${p.title}](${p.ticket_url || p.source_url}) at ${p.venue}, ${hood(p)}. ${p.price_label}.${p.sponsored ? ' Paid listing.' : ''} ${p.description}`;
const byDay = (list) => { let s = '', day = ''; for (const p of list) { if (p.date !== day) { day = p.date; s += `\n## ${longDate(day)}\n\n`; } s += pickLine(p) + '\n'; } return s; };
const byNight = (list, line) => { let s = ''; for (let d = 0; d < 7; d++) { const rows = list.filter((r) => Number(r.weekday) === d); if (!rows.length) continue; s += `\n## ${WEEKDAYS[d]}\n\n` + rows.map(line).join('\n') + '\n'; } return s; };
const files = {
  'index.md': head('Stand Up Comedy NYC', `A curated, dated shortlist of NYC stand-up shows worth going out for, plus the bars and rooms with weekly shows, open mics by night, and the Manhattan clubs. ${picks.length} upcoming picks.`) +
    `Sections: [This week](${SITE}/this-week.md) · [Weekly and monthly rooms](${SITE}/rooms.md) · [Open mics](${SITE}/open-mics.md) · [Clubs](${SITE}/clubs.md) · [Neighborhoods](${SITE}/neighborhoods.md)\n\nData as JSON: [picks](${SITE}/data/picks.json), [recurring](${SITE}/data/recurring.json), [open mics](${SITE}/data/open-mics.json), [clubs](${SITE}/data/clubs.json), [venues](${SITE}/data/venues.json).\n` + byDay(picks.slice(0, 40)),
  'this-week.md': head('This week', 'Every upcoming pick on the board, by day.') + byDay(picks),
  'rooms.md': head('Weekly and monthly rooms', 'Bar shows and showcases that run every week or month. Same room, new lineup.') + byNight(rooms, (r) => `- **${r.time_label}** — [${r.title}](${r.source_url}) at ${r.venue}, ${hood(r)}. ${r.price_label}. ${r.description}`),
  'open-mics.md': head('Open mics', 'Stand-up open mics by night: where, when, what it costs, how sign-up works.') + byNight(mics, (m) => `- **${m.time_label || m.cadence}** — [${m.title}](${m.source_url}) at ${m.venue}, ${hood(m)}. ${m.cost_label}. Sign-up: ${m.signup}.${m.set_length ? ' Sets: ' + m.set_length + '.' : ''}${m.notes ? ' ' + m.notes : ''}`),
  'clubs.md': head('Clubs', 'The Manhattan comedy clubs, with what it costs to get in and the house rules.') + clubs.map((c) => `## ${c.name}\n\n${c.address} (${c.neighborhood}). ${c.price_label || ''}${c.minimum ? ' Minimum: ' + c.minimum + '.' : ''}${c.age ? ' Age: ' + c.age + '.' : ''}${c.reservations ? ' ' + c.reservations : ''}\n\n${c.character || ''}\n\n[Calendar](${c.calendar_url}) · [Policies](${c.source_url})\n`).join('\n'),
  'neighborhoods.md': head('Neighborhoods', 'Every venue we track, by borough and neighborhood.') + ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].map((b) => { const vs = [...venues.values()].filter((v) => v.borough === b).sort((a, c) => a.neighborhood.localeCompare(c.neighborhood) || a.name.localeCompare(c.name)); return vs.length ? `\n## ${b}\n\n` + vs.map((v) => `- **${v.neighborhood}** — ${v.calendar_url ? `[${v.name}](${v.calendar_url})` : v.website ? `[${v.name}](${v.website})` : v.name}, ${v.address}`).join('\n') + '\n' : ''; }).join(''),
  'llms.txt': `# Stand Up Comedy NYC\n\n> A curated, dated shortlist of NYC stand-up shows worth going out for, plus weekly bar shows, open mics by night and the Manhattan clubs. Independent editorial picks; any paid placement is labeled. Updated daily.\n\nEvery listing carries the venue or ticket page it was verified against and the date it was checked. Times are New York local.\n\n## Editions in Markdown\n\n- [Home and this week's picks](${SITE}/index.md)\n- [This week, every pick by day](${SITE}/this-week.md)\n- [Weekly and monthly rooms](${SITE}/rooms.md)\n- [Open mics by night](${SITE}/open-mics.md)\n- [Clubs and house rules](${SITE}/clubs.md)\n- [Venues by neighborhood](${SITE}/neighborhoods.md)\n\n## Data (JSON)\n\n- [Picks](${SITE}/data/picks.json): dated shows, each with starts_at, ends_at, venue, neighborhood, price and source_url\n- [Recurring rooms](${SITE}/data/recurring.json)\n- [Open mics](${SITE}/data/open-mics.json)\n- [Clubs](${SITE}/data/clubs.json)\n- [Venues](${SITE}/data/venues.json): every room with address, neighborhood and borough\n- [API catalog](${SITE}/.well-known/api-catalog)\n\n## Optional\n\n- [Newsletter](${SITE}/subscribe.html): a short weekly email with the picks\n`,
};
fs.mkdirSync(out, { recursive: true });
for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(out, name), body);
console.log(`markdown: ${Object.keys(files).length} files -> ${path.relative(root, out) || '.'} (${picks.length} picks, ${rooms.length} rooms, ${mics.length} mics, ${clubs.length} clubs)`);
