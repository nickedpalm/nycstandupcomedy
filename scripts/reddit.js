#!/usr/bin/env node
// Reddit buzz for performers and shows, read-only, via the app-only OAuth flow.
// Env: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET (a "script" app; no username or password needed for public reads).
// Used by scripts/heat.js when the keys exist; can also run alone:  node scripts/reddit.js "Beth Stelling"
'use strict';
const UA = 'standupcomedynyc-heat/1.0 (read-only editorial demand check; info@standupcomedynyc.com)';
const SUBS = ['NYCComedy', 'Standup', 'AskNYC', 'nyc', 'Brooklyn', 'comedy'];
let tokenCache = null;

async function token() {
  const id = process.env.REDDIT_CLIENT_ID, secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.value;
  const r = await fetch('https://www.reddit.com/api/v1/access_token', { method: 'POST', headers: { 'User-Agent': UA, 'Authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  if (!r.ok) throw new Error(`reddit token: HTTP ${r.status}`);
  const j = await r.json(); tokenCache = { value: j.access_token, expires: Date.now() + (j.expires_in - 60) * 1000 };
  return tokenCache.value;
}

// Mentions of an exact phrase in the last 30 days across the comedy and NYC subreddits.
async function buzz(phrase) {
  const t = await token(); if (!t) return null;
  const since = Date.now() / 1000 - 30 * 86400;
  const url = new URL('https://oauth.reddit.com/search'); url.search = new URLSearchParams({ q: `"${phrase}"`, sort: 'new', t: 'month', limit: 50, restrict_sr: 'false', type: 'link' });
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Authorization': 'Bearer ' + t } });
  if (r.status === 429) { await new Promise((x) => setTimeout(x, 2000)); return buzz(phrase); }
  if (!r.ok) throw new Error(`reddit search: HTTP ${r.status}`);
  const posts = ((await r.json()).data?.children || []).map((c) => c.data).filter((p) => p.created_utc >= since);
  const relevant = posts.filter((p) => SUBS.some((s) => s.toLowerCase() === String(p.subreddit).toLowerCase()) || /comed|standup|stand-up/i.test(p.title + ' ' + (p.selftext || '')));
  const top = relevant.sort((a, b) => b.score - a.score)[0];
  return { phrase, posts_30d: relevant.length, upvotes: relevant.reduce((s, p) => s + Math.max(0, p.score), 0), comments: relevant.reduce((s, p) => s + (p.num_comments || 0), 0), subreddits: [...new Set(relevant.map((p) => p.subreddit))].slice(0, 5), top: top ? { title: top.title, subreddit: top.subreddit, score: top.score, url: 'https://www.reddit.com' + top.permalink } : null };
}

module.exports = { buzz };
if (require.main === module) {
  const phrase = process.argv.slice(2).join(' ');
  if (!phrase) { console.error('usage: node scripts/reddit.js "<performer or show>"'); process.exit(2); }
  buzz(phrase).then((b) => { if (!b) { console.log('reddit: REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET not set'); return; } console.log(JSON.stringify(b, null, 1)); }).catch((e) => { console.error('reddit:', e.message); process.exit(1); });
}
