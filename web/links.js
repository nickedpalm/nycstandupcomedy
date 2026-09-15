// Link-in-bio page. Tonight's picks come from picks.json; everything else from data/links.json.
const nyDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const today = nyDate();
const tomorrow = nyDate(new Date(Date.now() + 864e5));
const element = (tag, text, className) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; };
function safeURL(value) { try { const u = new URL(value, location.origin); return ['https:', 'http:'].includes(u.protocol) ? u : null; } catch { return null; } }
// Outbound links carry UTM tags so ticket pages and analytics can see the bio page working.
function tagged(url) { const u = safeURL(url); if (!u) return null; if (u.origin !== location.origin && !u.searchParams.has('utm_source')) { u.searchParams.set('utm_source', 'instagram'); u.searchParams.set('utm_medium', 'bio'); u.searchParams.set('utm_campaign', 'links'); } return u.href; }
const dayLabel = (day) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(day + 'T12:00:00-04:00'));

function pickButton(p) {
  const href = tagged(p.ticket_url) || '/#show-' + p.id;
  const a = element('a', undefined, 'link-btn link-pick' + (p.sponsored ? ' sponsored' : ''));
  a.href = href; if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  const top = element('span', undefined, 'link-meta');
  top.append(element('b', p.time_label.split(' · ')[0]), element('span', ' · ' + p.venue + ', ' + p.neighborhood));
  if (p.demand === 'sold_out') top.append(element('i', 'Sold out', 'demand-tag sold-out')); else if (p.demand === 'going_fast') top.append(element('i', 'Going fast', 'demand-tag'));
  if (p.sponsored) top.append(element('i', 'Paid listing', 'paid-tag'));
  a.append(top, element('strong', p.title, 'link-label'));
  return a;
}
function linkButton(l) {
  const href = tagged(l.url); if (!href) return null;
  const a = element('a', undefined, 'link-btn' + (l.pinned ? ' pinned' : ''));
  a.href = href; if (l.kind === 'external') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  a.append(element('strong', l.label, 'link-label'));
  if (l.note) a.append(element('span', l.note, 'link-note'));
  return a;
}
function inWindow(l) { return (!l.starts || l.starts <= today) && (!l.ends || l.ends >= today); }

(async () => {
  const [picks, data] = await Promise.all([
    fetch('/data/picks.json').then((r) => r.json()).catch(() => []),
    fetch('/data/links.json').then((r) => r.json()).catch(() => ({ links: [] })),
  ]);
  if (data.handle) document.querySelector('#links-handle').textContent = data.handle;
  if (data.tagline) document.querySelector('#links-tagline').textContent = data.tagline;

  const tonightList = document.querySelector('#links-tonight-list');
  const heading = document.querySelector('#links-tonight-heading');
  const byTime = (a, b) => a.starts_at.localeCompare(b.starts_at);
  let list = picks.filter((p) => p.date === today).sort(byTime);
  if (!list.length) { list = picks.filter((p) => p.date === tomorrow).sort(byTime); heading.textContent = list.length ? 'Tomorrow, ' + dayLabel(tomorrow) : 'Tonight'; }
  else heading.textContent = 'Tonight, ' + dayLabel(today);
  tonightList.replaceChildren();
  if (!list.length) tonightList.append(element('p', 'Nothing on the board tonight. The next picks are on the site.', 'links-empty'));
  else {
    list.slice(0, 5).forEach((p) => tonightList.append(pickButton(p)));
    if (list.length > 5) { const more = element('a', `All ${list.length} picks tonight →`, 'link-more'); more.href = '/'; tonightList.append(more); }
  }

  const container = document.querySelector('#links-list');
  const links = (data.links || []).filter(inWindow).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  links.forEach((l) => { const b = linkButton(l); if (b) container.append(b); });
  if (data.updated) { const foot = document.querySelector('#links-foot'); foot.append(element('span', ' · updated ' + dayLabel(data.updated).replace(/^\w+, /, ''), 'links-updated')); }
})();
