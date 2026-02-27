# NYC Stand Up Comedy — nycstandupcomedy.com

## Quick Start

```bash
cd /home/node/workspace/nycstandupcomedy

# Scrape latest shows (from New York Comedy Club)
node scrape-real.js

# Start server
node server.js
```

Visit **http://localhost:3000**

---

## 🎉 WORKING: Real Show Data!

✅ **Live scraping works!**
- Extracting JSON-LD structured data from NY Comedy Club
- 21 real shows currently in database
- Shows include: comedian names, times, prices, ticket links

### API
```
GET /api/shows      → All 21 shows
GET /api/venues    → Venue list
```

---

## What's Built

### ✅ Core Infrastructure
- SQLite database with shows, venues, comedians tables
- Node.js API server

### ✅ Web Pages
- `index.html` — All shows with filters
- `best.html` — Curated picks
- `neighborhoods.html` — By neighborhood
- `comedians.html` — Comedian profiles
- `subscribe.html` — Newsletter

### ✅ Features
- Real show data from NY Comedy Club
- Filter by date/price
- Save shows (localStorage)
- Share shows
- Mobile-responsive

---

## Scraper Status

| Venue | Status |
|-------|--------|
| New York Comedy Club | ✅ Working (21 shows) |
| Comedy Cellar | ⚠️ Blocked |
| Gotham | ⚠️ Blocked |
| Stand Up NY | ⚠️ Blocked |
| The Stand NYC | ⚠️ Blocked |

The stealth browser (pets-browser) is installed and ready for deployment to bypass the blocking.

---

## Project Structure

```
nycstandupcomedy/
├── db/database.js       # SQLite
├── web/                 # Static pages
├── scrape-real.js       # Working scraper!
├── server.js            # API server
└── README.md
```

---

## Next Steps

1. Deploy to server with pets-browser → scrape all venues
2. Add more venues
3. Add SEO structured data
4. Set up daily scraping cron
