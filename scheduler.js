// Daily scraper scheduler
// Run with: node scheduler.js
// Or add to crontab: 0 6 * * * cd /home/node/workspace/nycstandupcomedy && node scheduler.js >> /var/log/scraper.log 2>&1

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRAPER_PATH = path.join(__dirname, 'scrape-stealth.js');
const LOG_PATH = path.join(__dirname, 'scraper.log');
const LAST_RUN_PATH = path.join(__dirname, '.last-run');

// Check if we should run (once per day)
function shouldRun() {
  try {
    if (!fs.existsSync(LAST_RUN_PATH)) return true;
    
    const lastRun = fs.readFileSync(LAST_RUN_PATH, 'utf8').trim();
    const lastDate = new Date(lastRun);
    const now = new Date();
    
    // Run if it's a different day
    return lastDate.toDateString() !== now.toDateString();
  } catch(e) {
    return true;
  }
}

// Update last run time
function updateLastRun() {
  fs.writeFileSync(LAST_RUN_PATH, new Date().toISOString());
}

// Run the scraper
function runScraper() {
  console.log(`[${new Date().toISOString()}] Starting daily scrape...`);
  
  const startTime = Date.now();
  
  const proc = spawn('node', [SCRAPER_PATH], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  let stdout = '';
  let stderr = '';
  
  proc.stdout.on('data', (data) => {
    stdout += data.toString();
  });
  
  proc.stderr.on('data', (data) => {
    stderr += data.toString();
  });
  
  proc.on('close', (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const timestamp = new Date().toISOString();
    
    if (code === 0) {
      console.log(`[${timestamp}] ✅ Scrape complete in ${duration}s`);
      
      // Extract show count
      const match = stdout.match(/Total: (\d+) shows/);
      if (match) {
        console.log(`[${timestamp}] 📊 ${match[1]} shows scraped`);
      }
      
      // Log to file
      fs.appendFileSync(LOG_PATH, `[${timestamp}] SUCCESS: ${duration}s\n`);
    } else {
      console.log(`[${timestamp}] ❌ Scrape failed with code ${code}`);
      fs.appendFileSync(LOG_PATH, `[${timestamp}] FAILED: code ${code}\n${stderr}\n`);
    }
    
    updateLastRun();
  });
}

// Main
console.log('📅 Daily scraper scheduler');
console.log('Checking if should run...');

if (shouldRun()) {
  console.log('✅ Running scraper...');
  runScraper();
} else {
  console.log('⏭️  Already ran today. Skipping.');
  console.log('To force run, delete .last-run file');
}
