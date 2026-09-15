#!/usr/bin/env node
// Inbound-only Instagram comment handling for @standupcomedynyc.
//
//   node scripts/ig-comments.js --list [--days=7]        comments on our recent posts that we have not answered
//   node scripts/ig-comments.js --reply <comment_id> --text "..."   post one reply (logged to IG-REPLIES.json)
//   --json   print the list as JSON (default: readable)
//
// Never likes, follows, DMs or comments on anyone else's posts: only replies under our own media.
// Env: IG_ACCESS_TOKEN, IG_USER_ID (scope instagram_business_manage_comments).
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
if (!token || !userId) { console.error('ig-comments: IG_ACCESS_TOKEN and IG_USER_ID must be set'); process.exit(2); }
const MAX_REPLY = 300;

async function api(pathname, params = {}, method = 'GET') {
  const url = new URL(API + pathname);
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = method === 'GET' ? await fetch(url + '?' + body) : await fetch(url, { method, body });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`${pathname}: ${data.error?.message || res.status}`);
  return data;
}
const readLog = () => { try { return JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch { return []; } };

(async () => {
  if (args.reply || args._[0]) {
    const commentId = String(args.reply === true ? args._[0] : args.reply);
    const text = String(args.text || '').trim();
    if (!/^\d+$/.test(commentId)) { console.error('ig-comments: --reply needs a numeric comment id'); process.exit(2); }
    if (!text) { console.error('ig-comments: --text is required'); process.exit(2); }
    if (text.length > MAX_REPLY) { console.error(`ig-comments: reply is ${text.length} chars; keep it under ${MAX_REPLY}`); process.exit(2); }
    if (/https?:\/\//i.test(text) && !/standupcomedynyc\.com/i.test(text)) { console.error('ig-comments: only our own domain may appear in a reply'); process.exit(2); }
    const log = readLog();
    if (log.some((e) => e.comment_id === commentId)) { console.error(`ig-comments: already replied to ${commentId}`); process.exit(1); }
    const today = new Date().toISOString().slice(0, 10);
    if (log.filter((e) => e.replied_at.slice(0, 10) === today).length >= 20) { console.error('ig-comments: 20 replies today already; stop and tell Nick'); process.exit(1); }
    const r = await api(`/${commentId}/replies`, { message: text }, 'POST');
    log.push({ comment_id: commentId, reply_id: r.id, text, replied_at: new Date().toISOString() });
    fs.writeFileSync(logFile, JSON.stringify(log, null, 1) + '\n');
    console.log(`ig-comments: replied ${r.id} to ${commentId}`);
    return;
  }

  const days = Number(args.days || 7);
  const since = Date.now() - days * 864e5;
  const media = (await api(`/${userId}/media`, { fields: 'id,caption,permalink,timestamp,media_type', limit: 25 })).data || [];
  const recent = media.filter((m) => Date.parse(m.timestamp) >= since);
  const log = readLog();
  const answered = new Set(log.map((e) => e.comment_id));
  const out = [];
  for (const m of recent) {
    const comments = (await api(`/${m.id}/comments`, { fields: 'id,text,username,timestamp,from,replies{id,text,from,timestamp},hidden', limit: 50 })).data || [];
    for (const c of comments) {
      if (c.hidden) continue;
      if (String(c.from?.id) === String(userId)) continue;
      const ours = (c.replies?.data || []).some((r) => String(r.from?.id) === String(userId));
      out.push({ media_id: m.id, permalink: m.permalink, post: String(m.caption || '').split('\n')[0].slice(0, 80), comment_id: c.id, username: c.username || c.from?.username || '', text: c.text, at: c.timestamp, answered: ours || answered.has(c.id) });
    }
  }
  const open = out.filter((c) => !c.answered);
  if (args.json) { console.log(JSON.stringify({ checked_posts: recent.length, comments: out.length, open }, null, 1)); return; }
  console.log(`ig-comments: ${recent.length} post(s) in the last ${days} day(s), ${out.length} comment(s), ${open.length} unanswered`);
  for (const c of open) console.log(`- [${c.comment_id}] @${c.username} on "${c.post}" (${c.at.slice(0, 16)}): ${c.text}`);
})().catch((e) => { console.error('ig-comments:', e.message); process.exit(1); });
