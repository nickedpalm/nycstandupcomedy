#!/usr/bin/env node
// Inbound-only Instagram direct messages for @standupcomedynyc.
//
//   node scripts/ig-messages.js --list [--days=7]            conversations whose last message is from someone else
//   node scripts/ig-messages.js --send <user_id> --text "..." reply to a person who wrote to us (logged to IG-REPLIES.json)
//   --json   print the list as JSON
//
// Instagram only lets a business reply within 24 hours of the person's last message, and
// message requests from strangers may not appear until accepted in the app. Never starts a
// conversation: --send refuses a user id that has not written to us in the last 24 hours.
// Env: IG_ACCESS_TOKEN, IG_USER_ID (scope instagram_business_manage_messages).
'use strict';
require('./env.js')(['IG_ACCESS_TOKEN', 'IG_USER_ID']);
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const logFile = path.join(root, 'IG-REPLIES.json');
const API = 'https://graph.instagram.com/v23.0';
const args = { _: [] };
for (const a of process.argv.slice(2)) { const m = a.match(/^--([a-z-]+)(?:=(.*))?$/); if (m) args[m[1]] = m[2] ?? true; else args._.push(a); }
const token = process.env.IG_ACCESS_TOKEN, userId = process.env.IG_USER_ID;
if (!token || !userId) { console.error('ig-messages: IG_ACCESS_TOKEN and IG_USER_ID must be set'); process.exit(2); }
const MAX_REPLY = 500;

async function api(pathname, params = {}, method = 'GET') {
  const url = new URL(API + pathname);
  if (method === 'GET') { const q = new URLSearchParams({ ...params, access_token: token }); const res = await fetch(url + '?' + q); const data = await res.json(); if (!res.ok || data.error) throw new Error(`${pathname}: ${data.error?.message || res.status}`); return data; }
  const res = await fetch(url + '?' + new URLSearchParams({ access_token: token }), { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(params) });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`${pathname}: ${data.error?.message || res.status}`);
  return data;
}
const readLog = () => { try { return JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch { return []; } };

async function inbox(days) {
  const since = Date.now() - days * 864e5;
  const convs = (await api(`/${userId}/conversations`, { platform: 'instagram', fields: 'id,updated_time,participants,messages.limit(10){id,from,message,created_time}', limit: 25 })).data || [];
  const out = [];
  for (const c of convs) {
    if (Date.parse(c.updated_time) < since) continue;
    const other = (c.participants?.data || []).find((p) => String(p.id) !== String(userId)) || {};
    const msgs = (c.messages?.data || []).slice().sort((a, b) => Date.parse(a.created_time) - Date.parse(b.created_time));
    const last = msgs[msgs.length - 1];
    if (!last) continue;
    const theirs = String(last.from?.id) !== String(userId);
    out.push({ conversation_id: c.id, user_id: other.id, username: other.username || '', last_from_them: theirs, last_at: last.created_time, within_24h: theirs && Date.now() - Date.parse(last.created_time) < 24 * 3600e3, thread: msgs.map((m) => `${String(m.from?.id) === String(userId) ? 'us' : '@' + (other.username || other.id)}: ${m.message || '[attachment]'}`) });
  }
  return out;
}

(async () => {
  if (args.send || args._[0]) {
    const to = String(args.send === true ? args._[0] : args.send);
    const text = String(args.text || '').trim();
    if (!/^\d+$/.test(to)) { console.error('ig-messages: --send needs a numeric user id from --list'); process.exit(2); }
    if (!text) { console.error('ig-messages: --text is required'); process.exit(2); }
    if (text.length > MAX_REPLY) { console.error(`ig-messages: keep it under ${MAX_REPLY} characters`); process.exit(2); }
    if (/https?:\/\//i.test(text) && !/standupcomedynyc\.com/i.test(text)) { console.error('ig-messages: only our own domain may appear in a reply'); process.exit(2); }
    const open = await inbox(2);
    const conv = open.find((c) => String(c.user_id) === to);
    if (!conv || !conv.last_from_them) { console.error('ig-messages: that person has not written to us recently; we never start conversations'); process.exit(1); }
    if (!conv.within_24h) { console.error('ig-messages: their last message is older than 24 hours; Instagram will not accept a reply'); process.exit(1); }
    const log = readLog();
    const today = new Date().toISOString().slice(0, 10);
    if (log.filter((e) => e.kind === 'dm' && e.replied_at.slice(0, 10) === today).length >= 20) { console.error('ig-messages: 20 messages today already; stop and tell Nick'); process.exit(1); }
    const r = await api(`/${userId}/messages`, { recipient: { id: to }, message: { text } }, 'POST');
    log.push({ kind: 'dm', user_id: to, username: conv.username, message_id: r.message_id || r.id || null, text, replied_at: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(log, null, 1) + '\n');
    console.log(`ig-messages: sent to @${conv.username || to}`);
    return;
  }
  const days = Number(args.days || 7);
  const all = await inbox(days);
  const open = all.filter((c) => c.last_from_them);
  if (args.json) { console.log(JSON.stringify({ conversations: all.length, open }, null, 1)); return; }
  console.log(`ig-messages: ${all.length} conversation(s) in the last ${days} day(s), ${open.length} waiting on us`);
  for (const c of open) { console.log(`- @${c.username || c.user_id} (user ${c.user_id}, ${c.within_24h ? 'reply window open' : 'reply window closed'}):`); c.thread.slice(-4).forEach((l) => console.log(`    ${l}`)); }
})().catch((e) => { console.error('ig-messages:', e.message); process.exit(1); });
