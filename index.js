// NYC Stand Up Comedy - Main Entry Point
// Phase 1: Infrastructure & Demo Data

const { initDB, saveShows, getShows } = require('./db/database');

// Sample data to demonstrate the system (real scraping needs headless browser)
const sampleShows = [
  {
    venue: 'Comedy Cellar',
    title: 'Mark Normand',
    comedians: 'Mark Normand',
    show_date: '2026-02-27',
    show_time: '8:00 PM',
    price: '$25',
    ticket_link: 'https://comedycellar.com/',
    description: 'One of the best working comedians in NYC',
    neighborhood: 'Greenwich Village'
  },
  {
    venue: 'Comedy Cellar',
    title: 'Carolines Comedy Night',
    comedians: 'Various',
    show_date: '2026-02-27',
    show_time: '10:00 PM',
    price: '$30',
    ticket_link: 'https://comedycellar.com/',
    description: 'Late night comedy',
    neighborhood: 'Greenwich Village'
  },
  {
    venue: 'The Stand NYC',
    title: 'Triangle: A Comedy Showcase',
    comedians: 'Nate Jones, Katie Hannan, Alex Ptacek',
    show_date: '2026-02-27',
    show_time: '7:30 PM',
    price: '$20',
    ticket_link: 'https://thestandnyc.com/',
    description: 'Weekly comedy showcase',
    neighborhood: 'Gramercy'
  },
  {
    venue: 'New York Comedy Club',
    title: 'Puppet Regret',
    comedians: 'James',
    show_date: '2026-02-28',
    show_time: '8:00 PM',
    price: '$18',
    ticket_link: 'https://newyorkcomedyclub.com/',
    description: 'Comedy show',
    neighborhood: 'East Village'
  },
  {
    venue: 'Gotham Comedy Club',
    title: 'All Stars',
    comedians: 'Various Headliners',
    show_date: '2026-02-28',
    show_time: '8:00 PM',
    price: '$35',
    ticket_link: 'https://gothamcomedyclub.com/',
    description: 'Gotham All Stars',
    neighborhood: 'Chelsea'
  },
  {
    venue: 'Stand Up NY',
    title: 'Open Mic Night',
    comedians: 'Sign Up to Perform',
    show_date: '2026-03-01',
    show_time: '9:00 PM',
    price: 'Free',
    ticket_link: 'https://standupny.com/',
    description: 'Weekly open mic',
    neighborhood: 'Upper West Side'
  },
  {
    venue: 'Broadway Comedy Club',
    title: 'Broadway Showcase',
    comedians: 'Various',
    show_date: '2026-02-27',
    show_time: '9:30 PM',
    price: '$25',
    ticket_link: 'https://broadwaycomedyclub.com/',
    description: 'Broadway Comedy Club Weekly Show',
    neighborhood: 'Midtown'
  }
];

async function main() {
  console.log('🎤 NYC Stand Up Comedy Scraper\n');
  
  // Initialize database
  initDB();
  
  // Clear old data and save new sample data
  const { db } = require('./db/database');
  db.exec('DELETE FROM shows');
  saveShows(sampleShows);
  
  // Test queries
  console.log('\n📅 Tonight\'s Shows:');
  const tonight = getShows({ today: true });
  tonight.forEach(s => {
    console.log(`  ${s.show_time} - ${s.venue}: ${s.title} (${s.price})`);
  });
  
  console.log('\n📅 This Weekend:');
  const weekend = getShows({ thisWeekend: true, limit: 10 });
  weekend.forEach(s => {
    console.log(`  ${s.show_date} ${s.show_time} - ${s.venue}: ${s.title}`);
  });
  
  console.log('\n✅ Database ready with', getShows({}).length, 'shows');
}

main().catch(console.error);
