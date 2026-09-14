#!/usr/bin/env node
// Cache-busting: rewrite references to /editorial.css and /*.js in the built HTML to include
// a short content hash (?v=abc123), so browsers pick up new styles and scripts on the next page
// load even though the assets are served with a long cache lifetime. Runs in `npm run build`.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dist = path.resolve(process.argv.find((a) => a.startsWith('--dir='))?.slice(6) || 'dist');
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const assets = new Map();
for (const f of fs.readdirSync(dist)) if (/\.(css|js)$/.test(f)) assets.set('/' + f, hash(path.join(dist, f)));
let pages = 0;
for (const f of fs.readdirSync(dist)) {
  if (!f.endsWith('.html')) continue;
  const file = path.join(dist, f); let html = fs.readFileSync(file, 'utf8'); const before = html;
  for (const [ref, v] of assets) html = html.replace(new RegExp(`(href|src)="${ref.replace('.', '\\.')}"`, 'g'), `$1="${ref}?v=${v}"`);
  if (html !== before) { fs.writeFileSync(file, html); pages++; }
}
console.log(`stamp: ${assets.size} assets versioned across ${pages} pages`);
