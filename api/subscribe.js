// Vercel serverless function: POST /api/subscribe
// Same behaviour as functions/api/subscribe.js (Cloudflare Pages). Forwards a signup to the
// Listmonk public subscription API for the "Stand Up Comedy NYC" list. No secrets involved.
const LISTMONK = 'https://mail.firestick.io/api/public/subscription';
const LIST_UUID = '0b5e335c-e436-464a-a560-3697385c462b';
function send(res, status, body) { res.statusCode = status; res.setHeader('content-type', 'application/json'); res.setHeader('cache-control', 'no-store'); res.end(JSON.stringify(body)); }
function readBody(req) { return new Promise(resolve => { let data = ''; req.on('data', c => { data += c; if (data.length > 10000) req.destroy(); }); req.on('end', () => resolve(data)); req.on('error', () => resolve('')); }); }
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, {ok: false, error: 'POST only'});
  let email = '', name = '', trap = '';
  const type = String(req.headers['content-type'] || '');
  try {
    const raw = typeof req.body === 'string' ? req.body : (req.body && typeof req.body === 'object' ? null : await readBody(req));
    let b;
    if (raw === null) b = req.body;
    else if (type.includes('application/json')) b = JSON.parse(raw || '{}');
    else b = Object.fromEntries(new URLSearchParams(raw));
    email = b.email; name = b.name; trap = b.website;
  } catch { return send(res, 400, {ok: false, error: 'Could not read the form.'}); }
  email = String(email || '').trim().toLowerCase(); name = String(name || '').trim().slice(0, 80);
  if (trap) return send(res, 200, {ok: true});
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return send(res, 400, {ok: false, error: 'That email address does not look right.'});
  const upstream = await fetch(LISTMONK, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({email, name, list_uuids: [LIST_UUID]})}).catch(() => null);
  if (!upstream) return send(res, 502, {ok: false, error: 'The list service did not answer. Try again in a minute.'});
  if (upstream.ok) return send(res, 200, {ok: true});
  let msg = 'Signup failed. Try again in a minute.';
  try { const b = await upstream.json(); if (b && b.message) msg = String(b.message).slice(0, 200); } catch {}
  return send(res, upstream.status >= 500 ? 502 : 400, {ok: false, error: msg});
};
