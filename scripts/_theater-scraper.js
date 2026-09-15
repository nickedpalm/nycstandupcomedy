#!/usr/bin/env node
// Scrape a venue's calendar page and dump visible text + show links. Used for one-off
// venue review; output goes to /tmp so we can read it back. Not a cron task.
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const url = process.argv[2];
const out = process.argv[3] || '/tmp/theater-scrape.html';
const wait = parseInt(process.argv[4] || '4000', 10);
if (!url) {
  console.error('usage: node scripts/_theater-scraper.js <url> [out.html] [wait_ms]');
  process.exit(2);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.AGENT_BROWSER_EXECUTABLE_PATH,
    headless: true,
  });
  const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(wait);
    const html = await page.content();
    const text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(out, JSON.stringify({ url, text, html }, null, 0));
    console.log(`Wrote ${out} (text length ${text.length})`);
  } catch (e) {
    console.error('SCRAPE_ERROR', e.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();