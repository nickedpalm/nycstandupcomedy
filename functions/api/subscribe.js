// Cloudflare Pages Function: POST /api/subscribe
// Forwards a signup to the Listmonk public subscription API for the
// "Stand-Up Comedy NYC" list. No secrets: the public endpoint only adds to public lists.
const LISTMONK = 'https://mail.firestick.io/api/public/subscription';
const LIST_UUID = '0b5e335c-e436-464a-a560-3697385c462b';
const json = (status, body) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json', 'cache-control': 'no-store'}});
export async function onRequestPost({request}) {
  let email = '', name = '', trap = '';
  const type = request.headers.get('content-type') || '';
  try {
    if (type.includes('application/json')) { const b = await request.json(); email = b.email; name = b.name; trap = b.website; }
    else { const f = await request.formData(); email = f.get('email'); name = f.get('name'); trap = f.get('website'); }
  } catch { return json(400, {ok: false, error: 'Could not read the form.'}); }
  email = String(email || '').trim().toLowerCase(); name = String(name || '').trim().slice(0, 80);
  if (trap) return json(200, {ok: true}); // honeypot filled: pretend success, add nothing
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return json(400, {ok: false, error: 'That email address does not look right.'});
  const upstream = await fetch(LISTMONK, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({email, name, list_uuids: [LIST_UUID]})}).catch(() => null);
  if (!upstream) return json(502, {ok: false, error: 'The list service did not answer. Try again in a minute.'});
  if (upstream.ok) return json(200, {ok: true});
  let msg = 'Signup failed. Try again in a minute.';
  try { const b = await upstream.json(); if (b && b.message) msg = String(b.message).slice(0, 200); } catch {}
  return json(upstream.status >= 500 ? 502 : 400, {ok: false, error: msg});
}
export function onRequestGet() { return json(405, {ok: false, error: 'POST only'}); }
