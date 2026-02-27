// NYC Comedy API Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const { getShows, initDB } = require('./db/database');

// Initialize database on startup
initDB();

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathName = url.pathname;

  // API Endpoints
  if (pathName.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Get shows from database
    const options = {};
    if (url.searchParams.get('today')) options.today = true;
    if (url.searchParams.get('weekend')) options.thisWeekend = true;
    if (url.searchParams.get('venue')) options.venue = url.searchParams.get('venue');
    if (url.searchParams.get('limit')) options.limit = parseInt(url.searchParams.get('limit'));
    
    const shows = getShows(options);
    
    if (pathName === '/api/shows') {
      res.end(JSON.stringify({
        success: true,
        count: shows.length,
        data: shows.map(s => ({
          id: s.id,
          venue: s.venue,
          title: s.title,
          comedians: s.comedians,
          show_date: s.show_date,
          show_time: s.show_time,
          price: s.price,
          ticket_link: s.ticket_link,
          neighborhood: s.neighborhood
        })),
        lastUpdated: new Date().toISOString()
      }, null, 2));
      return;
    }
    
    if (pathName === '/api/venues') {
      res.end(JSON.stringify({
        venues: [
          { name: 'New York Comedy Club', neighborhood: 'East Village', url: 'https://newyorkcomedyclub.com/' },
          { name: 'Comedy Cellar', neighborhood: 'Greenwich Village', url: 'https://comedycellar.com/' },
          { name: 'Gotham Comedy Club', neighborhood: 'Chelsea', url: 'https://gothamcomedyclub.com/' },
          { name: 'Broadway Comedy Club', neighborhood: 'Midtown', url: 'https://broadwaycomedyclub.com/' },
          { name: 'The Stand NYC', neighborhood: 'Gramercy', url: 'https://thestandnyc.com/' },
          { name: 'Stand Up NY', neighborhood: 'Upper West Side', url: 'https://standupny.com/' }
        ]
      }, null, 2));
      return;
    }
    
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Serve static files
  let filePath = pathName === '/' ? '/web/index.html' : pathName;
  filePath = path.join(__dirname, filePath);
  
  try {
    const content = fs.readFileSync(filePath);
    const ext = '.' + filePath.split('.').pop();
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'text/plain');
    res.end(content);
  } catch(e) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🎤 NYC Comedy API running on http://localhost:${PORT}`);
  console.log(`   GET /api/shows - All shows from database`);
  console.log(`   GET /api/shows?today=1 - Tonight's shows`);
  console.log(`   GET /api/venues - All venues`);
});
