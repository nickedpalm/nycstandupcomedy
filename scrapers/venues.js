const axios = require('axios');
const cheerio = require('cheerio');

const venues = [
  {
    name: 'Comedy Cellar',
    url: 'https://comedycellar.com/',
    neighborhood: 'Greenwich Village'
  },
  {
    name: 'The Stand NYC',
    url: 'https://thestandnyc.com/',
    neighborhood: 'Gramercy'
  },
  {
    name: 'New York Comedy Club',
    url: 'https://newyorkcomedyclub.com/',
    neighborhood: 'East Village'
  },
  {
    name: 'Gotham Comedy Club',
    url: 'https://gothamcomedyclub.com/',
    neighborhood: 'Chelsea'
  },
  {
    name: 'Broadway Comedy Club',
    url: 'https://broadwaycomedyclub.com/',
    neighborhood: 'Midtown'
  },
  {
    name: 'Stand Up NY',
    url: 'https://standupny.com/',
    neighborhood: 'Upper West Side'
  }
];

async function scrapeVenue(venue) {
  console.log(`Scraping ${venue.name}...`);
  try {
    const response = await axios.get(venue.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Basic extraction - will need customization per venue
    const shows = [];
    
    // Look for common show patterns
    $('a[href*="ticket"], a[href*="book"], .event, .show, .performance').each((i, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href');
      if (title && title.length > 3 && link) {
        shows.push({
          venue: venue.name,
          title: title.substring(0, 200),
          link: link.startsWith('http') ? link : venue.url + link,
          neighborhood: venue.neighborhood,
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`  Found ${shows.length} potential show links`);
    return shows;
  } catch (error) {
    console.error(`  Error scraping ${venue.name}: ${error.message}`);
    return [];
  }
}

async function scrapeAllVenues() {
  const allShows = [];
  
  for (const venue of venues) {
    const shows = await scrapeVenue(venue);
    allShows.push(...shows);
  }
  
  return allShows;
}

// Run if called directly
if (require.main === module) {
  scrapeAllVenues().then(shows => {
    console.log(`\nTotal shows found: ${shows.length}`);
    console.log(JSON.stringify(shows.slice(0, 5), null, 2));
  });
}

module.exports = { scrapeAllVenues, scrapeVenue, venues };
