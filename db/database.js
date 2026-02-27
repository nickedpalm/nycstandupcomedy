const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'shows.db');
const db = new Database(dbPath);

// Initialize database schema
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venue TEXT NOT NULL,
      title TEXT,
      comedians TEXT,
      show_date TEXT,
      show_time TEXT,
      price TEXT,
      ticket_link TEXT,
      description TEXT,
      neighborhood TEXT,
      show_type TEXT DEFAULT 'show',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS venues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      address TEXT,
      neighborhood TEXT,
      url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_shows_date ON shows(show_date);
    CREATE INDEX IF NOT EXISTS idx_shows_venue ON shows(venue);
  `);
  
  console.log('Database initialized');
}

function saveShows(shows) {
  const insert = db.prepare(`
    INSERT INTO shows (venue, title, comedians, show_date, show_time, price, ticket_link, description, neighborhood)
    VALUES (@venue, @title, @comedians, @show_date, @show_time, @price, @ticket_link, @description, @neighborhood)
  `);
  
  const insertMany = db.transaction((shows) => {
    for (const show of shows) {
      insert.run(show);
    }
  });
  
  insertMany(shows);
  console.log(`Saved ${shows.length} shows to database`);
}

function getShows(options = {}) {
  let query = 'SELECT * FROM shows WHERE 1=1';
  const params = {};
  
  if (options.venue) {
    query += ' AND venue = @venue';
    params.venue = options.venue;
  }
  
  if (options.neighborhood) {
    query += ' AND neighborhood = @neighborhood';
    params.neighborhood = options.neighborhood;
  }
  
  if (options.date) {
    query += ' AND show_date = @date';
    params.date = options.date;
  }
  
  if (options.today) {
    query += " AND show_date = date('now')";
  }
  
  if (options.thisWeekend) {
    query += " AND show_date >= date('now') AND show_date <= date('now', '+7 days')";
  }
  
  query += ' ORDER BY show_date ASC, show_time ASC';
  
  if (options.limit) {
    query += ' LIMIT @limit';
    params.limit = options.limit;
  }
  
  return db.prepare(query).all(params);
}

function clearOldShows(daysOld = 7) {
  const result = db.prepare(`DELETE FROM shows WHERE created_at < datetime("now", "-${daysOld} days")`).run();
  console.log(`Cleared ${result.changes} old shows`);
}

module.exports = { db, initDB, saveShows, getShows, clearOldShows };
