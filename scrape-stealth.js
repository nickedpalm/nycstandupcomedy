// Full stealth scraper - Multiple NYC comedy venues
const { launchBrowser } = require('./pets-browser/scripts/browser');
const { saveShows, initDB } = require('./db/database');
const https = require('https');
const cheerio = require('cheerio');

// ============ New York Comedy Club (HTTP - works) ============
function scrapeNYCC() {
  return new Promise((resolve) => {
    console.log('🎭 Scraping New York Comedy Club...');
    
    const req = https.get('https://newyorkcomedyclub.com/', { 
      headers: { 'User-Agent': 'Mozilla/5.0' } 
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const $ = cheerio.load(data);
        const shows = [];
        
        $('script[type="application/ld+json"]').each((i, el) => {
          try {
            const json = JSON.parse($(el).html());
            const items = Array.isArray(json) ? json : [json];
            
            items.forEach(item => {
              if (item['@type'] === 'Event' || item['@type'] === 'ComedyEvent') {
                const date = new Date(item.startDate);
                shows.push({
                  venue: 'New York Comedy Club',
                  title: item.name || 'Show',
                  comedians: item.name || '',
                  description: item.description || '',
                  show_date: date.toISOString().split('T')[0],
                  show_time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                  price: item.offers?.[0]?.price ? `$${item.offers[0].price}` : 'See website',
                  ticket_link: item.url || 'https://newyorkcomedyclub.com/',
                  neighborhood: 'East Village'
                });
              }
            });
          } catch(e) {}
        });
        
        console.log(`  ✅ Found ${shows.length} shows`);
        resolve(shows);
      });
    });
    req.on('error', e => {
      console.log(`  ❌ Error: ${e.message}`);
      resolve([]);
    });
  });
}

// ============ Comedy Cellar (Stealth Browser) ============
async function scrapeComedyCellar() {
  console.log('🎭 Scraping Comedy Cellar...');
  
  const { browser, page } = await launchBrowser({
    country: 'us',
    headless: true,
    useProxy: false,
  });
  
  const shows = [];
  
  try {
    await page.goto('https://comedycellar.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    const showLinks = await page.evaluate(() => {
      const results = new Set();
      document.querySelectorAll('a[href*="showid"]').forEach(a => {
        results.add(a.href);
      });
      return Array.from(results);
    });
    
    showLinks.forEach(link => {
      const match = link.match(/showid=(\d+)/);
      if (match) {
        const date = new Date(parseInt(match[1]) * 1000);
        if (date > new Date()) {
          shows.push({
            venue: 'Comedy Cellar',
            title: 'Comedy Cellar Show',
            comedians: 'Various',
            description: '',
            show_date: date.toISOString().split('T')[0],
            show_time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            price: 'See website',
            ticket_link: link,
            neighborhood: 'Greenwich Village'
          });
        }
      }
    });
    
    console.log(`  ✅ Found ${shows.length} shows`);
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  await browser.close();
  return shows;
}

// ============ Gotham Comedy Club (Stealth Browser) ============
async function scrapeGotham() {
  console.log('🎭 Scraping Gotham Comedy Club...');
  
  const { browser, page } = await launchBrowser({
    country: 'us',
    headless: true,
    useProxy: false,
  });
  
  const shows = [];
  
  try {
    await page.goto('https://gothamcomedyclub.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    // Get event links with dates
    const events = await page.evaluate(() => {
      const results = [];
      
      // Find event links
      document.querySelectorAll('a[href*="/event/"]').forEach(a => {
        const href = a.href;
        const text = a.innerText?.trim() || '';
        
        // Get parent element for date context
        let dateText = '';
        let parent = a.parentElement;
        for (let i = 0; i < 3 && parent; i++) {
          const prev = parent.previousElementSibling;
          if (prev) dateText = prev.innerText?.trim() || '';
          parent = prev;
        }
        
        if (href && text.length > 3 && text.length < 80) {
          results.push({ text, href, dateText });
        }
      });
      
      return results.slice(0, 30);
    });
    
    // Parse dates from text
    events.forEach(e => {
      // Extract date from text
      const dateMatch = e.dateText.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
      const timeMatch = e.text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      
      if (dateMatch || e.dateText.includes('February') || e.dateText.includes('March')) {
        // Parse the date
        const monthMap = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 };
        
        let showDate = new Date();
        const monthMatch = e.dateText.match(/(\w+)/);
        if (monthMatch && monthMap[monthMatch[1]] !== undefined) {
          showDate.setMonth(monthMap[monthMatch[1]]);
        }
        
        const dayMatch = e.dateText.match(/(\d{1,2})/);
        if (dayMatch) {
          showDate.setDate(parseInt(dayMatch[1]));
        }
        
        showDate.setHours(timeMatch ? (timeMatch[1].includes('PM') && !timeMatch[1].includes('12') ? 12 : 0) : 20);
        
        if (timeMatch) {
          const [time, period] = timeMatch[1].split(' ');
          let [hours, minutes] = time.split(':');
          hours = parseInt(hours);
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          showDate.setHours(hours, parseInt(minutes));
        }
        
        if (showDate > new Date()) {
          shows.push({
            venue: 'Gotham Comedy Club',
            title: e.text.substring(0, 60) || 'Gotham All Stars',
            comedians: 'Various Headliners',
            description: '',
            show_date: showDate.toISOString().split('T')[0],
            show_time: showDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            price: 'See website',
            ticket_link: e.href,
            neighborhood: 'Chelsea'
          });
        }
      }
    });
    
    console.log(`  ✅ Found ${shows.length} shows`);
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  await browser.close();
  return shows;
}

// ============ Stand Up NY (Stealth Browser) ============
async function scrapeStandUpNY() {
  console.log('🎭 Scraping Stand Up NY...');
  
  const { browser, page } = await launchBrowser({
    country: 'us',
    headless: true,
    useProxy: false,
  });
  
  const shows = [];
  
  try {
    await page.goto('https://standupny.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    // Get show info from the page
    const events = await page.evaluate(() => {
      const results = [];
      
      // Look for event-related content
      const lines = document.body.innerText.split('\n');
      
      // Find lines with dates and times
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match dates like "Fri Feb 27" or "Saturday Feb 28"
        const dateMatch = line.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/i);
        const timeMatch = lines[i + 1]?.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
        
        if (dateMatch && timeMatch) {
          const day = dateMatch[3];
          const month = dateMatch[2];
          const time = timeMatch[1];
          
          // Get show title from nearby text
          let title = 'Stand Up NY Show';
          for (let j = i + 2; j < Math.min(i + 10, lines.length); j++) {
            const nextLine = lines[j].trim();
            if (nextLine.length > 3 && nextLine.length < 60 && !nextLine.match(/\d/) && !nextLine.includes('over')) {
              title = nextLine;
              break;
            }
          }
          
          results.push({ title, date: `${month} ${day}`, time });
        }
      }
      
      return results.slice(0, 15);
    });
    
    // Parse dates
    const monthMap = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    
    events.forEach(e => {
      const dateMatch = e.date.match(/(\w+)\s+(\d+)/);
      const timeMatch = e.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      
      if (dateMatch && timeMatch) {
        const showDate = new Date();
        showDate.setMonth(monthMap[dateMatch[1]]);
        showDate.setDate(parseInt(dateMatch[2]));
        
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const period = timeMatch[3];
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        showDate.setHours(hours, minutes);
        
        if (showDate > new Date()) {
          shows.push({
            venue: 'Stand Up NY',
            title: e.title.substring(0, 60),
            comedians: 'Various',
            description: '',
            show_date: showDate.toISOString().split('T')[0],
            show_time: showDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            price: 'See website',
            ticket_link: 'https://standupny.com/',
            neighborhood: 'Upper West Side'
          });
        }
      }
    });
    
    console.log(`  ✅ Found ${shows.length} shows`);
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  await browser.close();
  return shows;
}

// ============ The Stand NYC (Stealth Browser) ============
async function scrapeTheStand() {
  console.log('🎭 Scraping The Stand NYC...');
  
  const { browser, page } = await launchBrowser({
    country: 'us',
    headless: true,
    useProxy: false,
  });
  
  const shows = [];
  
  try {
    // Use main page which has the shows
    await page.goto('https://thestandnyc.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    
    // Scroll to load more
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(2000);
    
    // Get show links
    const events = await page.evaluate(() => {
      const results = [];
      
      document.querySelectorAll('a[href*="/shows/show/"]').forEach(a => {
        const href = a.href;
        const text = a.innerText?.trim() || '';
        
        // Get date from nearby elements
        let dateText = '';
        let parent = a.parentElement;
        for (let i = 0; i < 10; i++) {
          if (!parent) break;
          const prev = parent.previousElementSibling;
          if (prev) {
            const txt = prev.innerText?.trim() || '';
            if (txt.match(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/)) {
              dateText = txt;
              break;
            }
          }
          parent = prev;
        }
        
        if (href && text.length > 2 && text.length < 80) {
          results.push({ text, href, dateText });
        }
      });
      
      return [...new Map(results.map(r => [r.href, r])).values()];
    });
    
    // Parse dates
    events.forEach(e => {
      const dateMatch = e.dateText.match(/(MON|TUE|WED|THU|FRI|SAT|SUN)\s+\|\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d+)/i);
      const timeMatch = e.text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      
      if (dateMatch) {
        const showDate = new Date();
        const monthMap = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
        
        showDate.setMonth(monthMap[dateMatch[2].toUpperCase()]);
        showDate.setDate(parseInt(dateMatch[3]));
        showDate.setHours(20, 0, 0, 0);
        
        if (timeMatch) {
          const [time, period] = timeMatch[1].split(' ');
          let [hours, minutes] = time.split(':');
          hours = parseInt(hours);
          if (period === 'PM' && hours !== 12) hours += 12;
          showDate.setHours(hours, parseInt(minutes));
        }
        
        if (showDate > new Date()) {
          shows.push({
            venue: 'The Stand NYC',
            title: e.text.substring(0, 60),
            comedians: 'Various Headliners',
            description: '',
            show_date: showDate.toISOString().split('T')[0],
            show_time: showDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            price: 'See website',
            ticket_link: e.href,
            neighborhood: 'Gramercy'
          });
        }
      }
    });
    
    console.log(`  ✅ Found ${shows.length} shows`);
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  await browser.close();
  return shows;
}

// ============ Broadway Comedy Club (Stealth Browser) ============
async function scrapeBroadway() {
  console.log('🎭 Scraping Broadway Comedy Club...');
  
  const { browser, page } = await launchBrowser({
    country: 'us',
    headless: true,
    useProxy: false,
  });
  
  const shows = [];
  
  try {
    await page.goto('https://www.broadwaycomedyclub.com/shows', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    const events = await page.evaluate(() => {
      const results = [];
      
      document.querySelectorAll('a[href*="/shows/"], a[href*="/event/"]').forEach(a => {
        const href = a.href;
        const text = a.innerText?.trim() || '';
        
        if (href && text.length > 5 && text.length < 80) {
          results.push({ text, href });
        }
      });
      
      return [...new Map(results.map(r => [r.href, r])).values()];
    });
    
    events.forEach(e => {
      if (e.href.includes('show') || e.href.includes('event')) {
        shows.push({
          venue: 'Broadway Comedy Club',
          title: e.text.substring(0, 60) || 'Broadway Show',
          comedians: 'Various',
          description: '',
          show_date: '2026-03-01',
          show_time: '8:00 PM',
          price: 'See website',
          ticket_link: e.href,
          neighborhood: 'Midtown'
        });
      }
    });
    
    console.log(`  ✅ Found ${shows.length} shows`);
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  await browser.close();
  return shows;
}

// ============ Main ============
async function scrapeAll() {
  console.log('🚀 Starting full scrape...\n');
  
  initDB();
  
  // Scrape all venues
  const [nyccShows, ccShows, gothamShows, standupnyShows, standShows, broadwayShows] = await Promise.all([
    scrapeNYCC(),
    scrapeComedyCellar(),
    scrapeGotham(),
    scrapeStandUpNY(),
    scrapeTheStand(),
    scrapeBroadway()
  ]);
  
  const allShows = [...nyccShows, ...ccShows, ...gothamShows, ...standupnyShows, ...standShows, ...broadwayShows];
  
  // Save to database
  if (allShows.length > 0) {
    const { db } = require('./db/database');
    db.exec('DELETE FROM shows');
    saveShows(allShows);
    console.log(`\n💾 Saved ${allShows.length} shows to database`);
  }
  
  return allShows;
}

// Run
scrapeAll().then(shows => {
  console.log(`\n✅ Complete! Total shows: ${shows.length}`);
  console.log('By venue:');
  const byVenue = {};
  shows.forEach(s => {
    byVenue[s.venue] = (byVenue[s.venue] || 0) + 1;
  });
  Object.entries(byVenue).forEach(([v, count]) => console.log(`  - ${v}: ${count}`));
}).catch(console.error);
