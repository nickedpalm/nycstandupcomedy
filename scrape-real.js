// Working scraper - extracts real show data from venues
const https = require('https');
const cheerio = require('cheerio');
const { saveShows, initDB } = require('./db/database');

const venues = [
  {
    name: 'New York Comedy Club',
    url: 'https://newyorkcomedyclub.com/',
    neighborhood: 'East Village'
  }
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy());
    req.end();
  });
}

function parseShows(html, venue) {
  const $ = cheerio.load(html);
  const shows = [];
  
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      const items = Array.isArray(json) ? json : [json];
      
      items.forEach(item => {
        if (item['@type'] === 'Event' || item['@type'] === 'ComedyEvent') {
          const show = {
            venue: venue.name,
            title: item.name || 'Untitled',
            show_date: null,
            show_time: null,
            price: null,
            ticket_link: item.url || venue.url,
            description: item.description || '',
            comedians: item.name || '',
            neighborhood: venue.neighborhood
          };
          
          if (item.startDate) {
            const date = new Date(item.startDate);
            show.show_date = date.toISOString().split('T')[0];
            show.show_time = date.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
          }
          
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            show.price = offers.price ? `$${offers.price}` : (offers.lowPrice ? `$${offers.lowPrice}` : 'See website');
          }
          
          shows.push(show);
        }
      });
    } catch (e) {}
  });
  
  return shows;
}

async function scrapeAll() {
  console.log('🎭 Starting scraper...\n');
  
  // Initialize DB
  initDB();
  
  const allShows = [];
  
  for (const venue of venues) {
    console.log(`Scraping ${venue.name}...`);
    
    try {
      const { status, data } = await fetchPage(venue.url);
      
      if (status !== 200 || data.length < 5000) {
        console.log(`  ⚠️ Failed (status: ${status})`);
        continue;
      }
      
      if (data.includes('captcha') || data.includes('challenge')) {
        console.log(`  ⚠️ Blocked by bot protection`);
        continue;
      }
      
      const shows = parseShows(data, venue);
      console.log(`  ✅ Found ${shows.length} shows`);
      
      allShows.push(...shows);
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // Delay between venues
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Save to database
  if (allShows.length > 0) {
    // Clear old data first
    const { db } = require('./db/database');
    db.exec('DELETE FROM shows');
    saveShows(allShows);
    console.log(`\n💾 Saved ${allShows.length} shows to database`);
  }
  
  return allShows;
}

// Run
scrapeAll().then(shows => {
  console.log(`\n✅ Scraping complete! Total shows: ${shows.length}`);
  shows.slice(0, 5).forEach(s => {
    console.log(`  - ${s.show_date} ${s.show_time} | ${s.title.substring(0, 40)}`);
  });
}).catch(console.error);
