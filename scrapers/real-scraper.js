// Real scraper for NYC Comedy venues
// Uses HTTP + Cheerio to extract JSON-LD structured data

const https = require('https');
const cheerio = require('cheerio');

const venues = [
  {
    name: 'New York Comedy Club',
    url: 'https://newyorkcomedyclub.com/',
    neighborhood: 'East Village'
  },
  {
    name: 'Comedy Cellar',
    url: 'https://comedycellar.com/',
    neighborhood: 'Greenwich Village'
  },
  {
    name: 'Gotham Comedy Club',
    url: 'https://gothamcomedyclub.com/',
    neighborhood: 'Chelsea'
  },
  {
    name: 'Stand Up NY',
    url: 'https://standupny.com/',
    neighborhood: 'Upper West Side'
  },
  {
    name: 'The Stand NYC',
    url: 'https://thestandnyc.com/',
    neighborhood: 'Gramercy'
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
        'Accept': 'text/html',
      },
      timeout: 15000
    };

    const req = https.request(options, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve(fetchPage(res.headers.location));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Timeout')));
    req.end();
  });
}

function parseShows(html, venue) {
  const $ = cheerio.load(html);
  const shows = [];
  
  // Look for JSON-LD structured data
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      const items = Array.isArray(json) ? json : [json];
      
      items.forEach(item => {
        // Handle Event or ComedyEvent types
        if (item['@type'] === 'Event' || item['@type'] === 'ComedyEvent') {
          const show = {
            venue: venue.name,
            title: item.name || 'Untitled Show',
            show_date: null,
            show_time: null,
            price: null,
            ticket_link: item.url || venue.url,
            description: item.description || '',
            comedians: extractComedians(item.name),
            neighborhood: venue.neighborhood,
            scrapedAt: new Date().toISOString()
          };
          
          // Parse date
          if (item.startDate) {
            const date = new Date(item.startDate);
            show.show_date = date.toISOString().split('T')[0];
            show.show_time = date.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            });
          }
          
          // Try to find price
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            show.price = offers.price ? `$${offers.price}` : (offers.lowPrice ? `$${offers.lowPrice}` : null);
          }
          
          shows.push(show);
        }
      });
    } catch (e) {
      // Not valid JSON, skip
    }
  });
  
  return shows;
}

function extractComedians(title) {
  if (!title) return '';
  
  // Try to extract comedian names from title
  // Titles often look like: "Name1, Name2, Name3 ft: Name4"
  let cleaned = title
    .replace(/\s+ft[:\s]+/gi, ', ')
    .replace(/\s+featuring\s+/gi, ', ')
    .replace(/\s+presents?\s+/gi, ', ');
  
  return cleaned;
}

async function scrapeVenue(venue) {
  console.log(`\n🎭 Scraping ${venue.name}...`);
  
  try {
    const { status, data } = await fetchPage(venue.url);
    
    if (status !== 200 || data.length < 5000) {
      console.log(`  ⚠️ Blocked or empty (status: ${status}, length: ${data.length})`);
      return [];
    }
    
    // Check for blocking
    if (data.includes('captcha') || data.includes('challenge') || data.includes('cloudflare')) {
      console.log(`  ⚠️ Blocked by bot protection`);
      return [];
    }
    
    const shows = parseShows(data, venue);
    console.log(`  ✅ Found ${shows.length} shows`);
    
    return shows;
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return [];
  }
}

async function scrapeAll() {
  console.log('🚀 Starting NYC Comedy scraper...\n');
  
  const allShows = [];
  
  for (const venue of venues) {
    const shows = await scrapeVenue(venue);
    allShows.push(...shows);
    
    // Polite delay
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`\n\n📊 Total: ${allShows.length} shows found`);
  
  return allShows;
}

// Run if called directly
if (require.main === module) {
  scrapeAll().then(shows => {
    console.log('\n🎉 Scraping complete!');
    console.log(JSON.stringify(shows.slice(0, 3), null, 2));
  }).catch(console.error);
}

module.exports = { scrapeAll, scrapeVenue, fetchPage };
