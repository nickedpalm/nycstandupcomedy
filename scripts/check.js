#!/usr/bin/env node
// Data and source checks for standupcomedynyc.com. Run with `npm run check`.
// Fails (exit 1) on the first class of problem that would ship a broken or misleading page.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const web = path.join(root, 'web');
const problems = [];
const warnings = [];
const fail = (msg) => problems.push(msg);
const warn = (msg) => warnings.push(msg);

const readJson = (name) => {
  const file = path.join(web, 'data', name);
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(data)) fail(`${name}: top level must be an array`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    fail(`${name}: ${err.message}`);
    return [];
  }
};

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const isoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
const https = (u) => typeof u === 'string' && /^https:\/\/\S+$/.test(u);

function checkCommon(name, rows, required, tiers) {
  const ids = new Set();
  rows.forEach((row, i) => {
    const label = `${name}[${i}] ${row.id || row.title || row.name || ''}`.trim();
    for (const key of required) {
      if (row[key] === undefined || row[key] === null || row[key] === '') fail(`${label}: missing ${key}`);
    }
    if (row.id) {
      if (ids.has(row.id)) fail(`${label}: duplicate id`);
      ids.add(row.id);
      if (!/^[a-z0-9-]+$/.test(row.id)) fail(`${label}: id must be lowercase letters, digits and hyphens`);
    }
    if (tiers && !tiers.includes(row.tier)) fail(`${label}: tier must be one of ${tiers.join(', ')}`);
    if (row.source_url !== undefined && !https(row.source_url)) fail(`${label}: source_url must be https`);
    if (row.ticket_url !== undefined && row.ticket_url !== null && !https(row.ticket_url)) fail(`${label}: ticket_url must be https`);
    if (row.calendar_url !== undefined && !https(row.calendar_url)) fail(`${label}: calendar_url must be https`);
    if (row.verified_at !== undefined && !isoDate.test(row.verified_at)) fail(`${label}: verified_at must be YYYY-MM-DD`);
    if ('price_amount' in row && row.price_amount !== null && typeof row.price_amount !== 'number') fail(`${label}: price_amount must be a number or null`);
  });
}

// picks.json: dated one-off shows shown on the home board.
const picks = readJson('picks.json');
checkCommon('picks', picks, ['id', 'title', 'date', 'starts_at', 'ends_at', 'time_label', 'venue', 'neighborhood', 'price_label', 'source_url', 'verified_at', 'description', 'tier'], ['featured', 'special']);
picks.forEach((row, i) => {
  const label = `picks[${i}] ${row.id}`;
  if (!isoDate.test(row.date || '')) fail(`${label}: date must be YYYY-MM-DD`);
  if (!isoDateTime.test(row.starts_at || '')) fail(`${label}: starts_at must be an ISO datetime with offset`);
  if (!isoDateTime.test(row.ends_at || '')) fail(`${label}: ends_at must be an ISO datetime with offset`);
  if (row.starts_at && row.date && !row.starts_at.startsWith(row.date)) fail(`${label}: starts_at does not fall on date`);
  if (row.starts_at && row.ends_at && row.ends_at <= row.starts_at) fail(`${label}: ends_at must be after starts_at`);
  if (row.poster) {
    const src = typeof row.poster === 'string' ? row.poster : row.poster.src;
    if (!src) fail(`${label}: poster needs a src`);
    else if (!fs.existsSync(path.join(web, src.replace(/^\//, '')))) fail(`${label}: poster file missing: ${src}`);
    if (typeof row.poster === 'object' && (!row.poster.credit || !row.poster.alt)) fail(`${label}: poster needs credit and alt`);
  }
});
const featured = picks.filter((r) => r.tier === 'featured').length;
if (featured > 3) fail(`picks: ${featured} featured entries; the board shows at most 3`);

// recurring.json: weekly and monthly bar shows.
checkCommon('recurring', readJson('recurring.json'), ['id', 'title', 'venue', 'neighborhood', 'weekday', 'cadence', 'time_label', 'price_label', 'source_url', 'verified_at', 'tier'], ['recurring']);

// open-mics.json
checkCommon('open-mics', readJson('open-mics.json'), ['id', 'title', 'venue', 'neighborhood', 'weekday', 'cadence', 'cost_label', 'signup', 'source_url', 'verified_at', 'tier'], ['open-mic']);

// clubs.json
checkCommon('clubs', readJson('clubs.json'), ['id', 'name', 'neighborhood', 'address', 'calendar_url', 'source_url', 'verified_at', 'tier'], ['club']);

// Poster sources must resolve to files.
try {
  const posters = JSON.parse(fs.readFileSync(path.join(root, 'POSTER-SOURCES.json'), 'utf8'));
  const knownIds = new Set(picks.map((r) => r.id));
  posters.forEach((p) => {
    if (!p.src || !fs.existsSync(path.join(web, String(p.src).replace(/^\//, '')))) fail(`POSTER-SOURCES.json: missing file ${p.src}`);
    if (!https(p.source_url)) fail(`POSTER-SOURCES.json ${p.src}: source_url must be https`);
    if (!p.credit) fail(`POSTER-SOURCES.json ${p.src}: missing credit`);
    if (p.event_id && !knownIds.has(p.event_id)) warn(`POSTER-SOURCES.json ${p.src}: event ${p.event_id} is no longer in picks.json; artwork can be retired`);
  });
} catch (err) {
  fail(`POSTER-SOURCES.json: ${err.message}`);
}

// Every page in the sitemap must exist in web/, and every HTML page must be in the sitemap.
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>https:\/\/standupcomedynyc\.com\/([^<]*)<\/loc>/g)].map((m) => m[1] || 'index.html');
locs.forEach((p) => { if (!fs.existsSync(path.join(web, p))) fail(`sitemap.xml: ${p} does not exist in web/`); });
fs.readdirSync(web).filter((f) => f.endsWith('.html')).forEach((f) => {
  if (!locs.includes(f)) fail(`sitemap.xml: web/${f} is not listed`);
});

// JavaScript syntax for browser scripts and the Pages function.
const jsFiles = [
  ...fs.readdirSync(web).filter((f) => f.endsWith('.js')).map((f) => path.join(web, f)),
  path.join(root, 'functions', 'api', 'subscribe.js'),
];
jsFiles.forEach((file) => {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); }
  catch (err) { fail(`${path.relative(root, file)}: syntax error\n${err.stderr}`); }
});

if (warnings.length) console.warn(`check: ${warnings.length} warning(s)\n- ${warnings.join('\n- ')}`);
if (problems.length) {
  console.error(`check: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`check: ok (${picks.length} picks, sitemap ${locs.length} pages, ${jsFiles.length} scripts)`);
