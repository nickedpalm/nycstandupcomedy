// Continuous scheduler that runs the scraper daily
// Usage: node run-scheduler.js
// Runs in background, checks every hour if it's time to scrape

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRAPER_PATH = path.join(__dirname, 'scrape-stealth.js');
const LOG_PATH = path.join(__dirname, 'logs');
const LAST_RUN_PATH = path.join(__dirname, '.last-run');

// Create logs directory
if (!fs.existsSync(LOG_PATH)) {
  fs.mkdirSync(LOG_PATH);
}

const CONFIG = {
  // Run at 6 AM daily
  hour: 6,
  minute: 0,
  checkIntervalMs: 60 * 60 * 1000 // Check every hour
};

function log(message) {
  const timestamp = new Date().toISOString();
  const msg = `[${timestamp}] ${message}`;
  console.log(msg);
  
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOG_PATH, `scraper-${today}.log`);
  fs.appendFileSync(logFile, msg + '\n');
}

function shouldRunToday() {
  const now = new Date();
  const lastRun = fs.existsSync(LAST_RUN_PATH) 
    ? fs.readFileSync(LAST_RUN_PATH, 'utf8').trim() 
    : null;
  
  // Never run or different day
  if (!lastRun) return true;
  
  const lastDate = new Date(lastRun).toDateString();
  const today = now.toDateString();
  
  return lastDate !== today;
}

function updateLastRun() {
  fs.writeFileSync(LAST_RUN_PATH, new Date().toISOString());
}

function runScraper() {
  log('🚀 Starting daily scrape...');
  
  const startTime = Date.now();
  const today = new Date().toISOString().split('T')[0];
  
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
    
    if (code === 0) {
      // Extract show count
      const match = stdout.match(/Total: (\d+) shows/);
      const shows = match ? match[1] : '?';
      
      log(`✅ Scrape complete: ${shows} shows in ${duration}s`);
    } else {
      log(`❌ Scrape failed: code ${code}`);
      if (stderr) log(`   Error: ${stderr.substring(0, 200)}`);
    }
    
    updateLastRun();
  });
}

function checkAndRun() {
  const now = new Date();
  
  // Check if it's time to run (6 AM)
  if (now.getHours() === CONFIG.hour && now.getMinutes() < 30) {
    if (shouldRunToday()) {
      log('⏰ Time to scrape!');
      runScraper();
    } else {
      log('⏭️ Already ran today');
    }
  } else {
    log(`💤 Waiting... (next run: ${CONFIG.hour}:00)`);
  }
}

// Main loop
log('📅 NYC Comedy Daily Scraper started');
log(`⏰ Scheduled for ${CONFIG.hour}:00 daily`);
log(`🔄 Checking every ${CONFIG.checkIntervalMs / 60000} minutes`);

// Initial check
checkAndRun();

// Set up interval
setInterval(checkAndRun, CONFIG.checkIntervalMs);

// Also keep the server running if needed
log('💡 Run `node server.js` in another terminal for the API');
