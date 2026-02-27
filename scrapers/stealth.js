// Stealth scraper for NYC comedy venues
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const venues = [
  {
    name: 'Comedy Cellar',
    url: 'https://comedycellar.com/',
    slug: 'comedy-cellar'
  },
  {
    name: 'The Stand NYC',
    url: 'https://thestandnyc.com/',
    slug: 'the-stand-nyc'
  },
  {
    name: 'New York Comedy Club',
    url: 'https://newyorkcomedyclub.com/',
    slug: 'new-york-comedy-club'
  },
  {
    name: 'Gotham Comedy Club',
    url: 'https://gothamcomedyclub.com/',
    slug: 'gotham-comedy-club'
  }
];

async function scrapeVenue(venue) {
  console.log(`\n🎭 Scraping ${venue.name}...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set realistic viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate with longer timeout
    await page.goto(venue.url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Extract page content
    const content = await page.content();
    const title = await page.title();
    
    console.log(`  Title: ${title}`);
    console.log(`  Content length: ${content.length} chars`);
    
    // Look for show-related elements
    const showData = await page.evaluate(() => {
      const results = [];
      
      // Look for event cards, show listings, etc.
      const selectors = [
        '.event', '.show', '.performance', '.show-card', 
        '[class*="event"]', '[class*="show"]', '[class*="performance"]',
        'article', '.listing', '.schedule-item'
      ];
      
      selectors.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => {
            const text = el.innerText?.trim();
            const link = el.querySelector('a')?.href;
            if (text && text.length > 10 && link) {
              results.push({ text: text.substring(0, 200), link });
            }
          });
        } catch(e) {}
      });
      
      return results.slice(0, 20);
    });
    
    console.log(`  Found ${showData.length} potential show elements`);
    
    // Try to find any JSON-LD structured data
    const jsonLd = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const data = [];
      scripts.forEach(script => {
        try {
          const json = JSON.parse(script.innerHTML);
          if (json['@type'] === 'Event' || Array.isArray(json)) {
            data.push(json);
          }
        } catch(e) {}
      });
      return data;
    });
    
    if (jsonLd.length > 0) {
      console.log(`  Found ${jsonLd.length} JSON-LD event blocks`);
    }
    
    return {
      venue: venue.name,
      title,
      elements: showData,
      jsonLd,
      url: venue.url
    };
    
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { venue: venue.name, error: error.message };
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting stealth scraper...\n');
  
  const results = [];
  for (const venue of venues) {
    const result = await scrapeVenue(venue);
    results.push(result);
    
    // Polite delay between venues
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n\n📊 Results Summary:');
  console.log('==================');
  results.forEach(r => {
    console.log(`\n${r.venue}:`);
    if (r.error) {
      console.log(`  ❌ ${r.error}`);
    } else {
      console.log(`  ✓ ${r.title}`);
      console.log(`  📦 ${r.elements?.length || 0} elements`);
      console.log(`  📋 ${r.jsonLd?.length || 0} JSON-LD blocks`);
    }
  });
  
  return results;
}

main().catch(console.error);
