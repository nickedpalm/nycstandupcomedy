// Test pets-browser for scraping Comedy Cellar
const { launchBrowser } = require('./pets-browser/scripts/browser');

async function scrape() {
  console.log('🚀 Launching stealth browser...');
  
  try {
    const { browser, page } = await launchBrowser({
      country: 'us',
      mobile: false,
      headless: true,
      useProxy: false,  // Try without proxy first
    });
    
    console.log('📍 Navigating to Comedy Cellar...');
    await page.goto('https://comedycellar.com/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Look for show elements
    const shows = await page.evaluate(() => {
      const results = [];
      const selectors = ['.event', '.show', '.performance', 'a[href*="ticket"]', '[class*="show"]'];
      
      selectors.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => {
            const text = el.innerText?.trim();
            if (text && text.length > 5 && text.length < 200) {
              results.push(text.substring(0, 100));
            }
          });
        } catch(e) {}
      });
      
      return [...new Set(results)].slice(0, 20);
    });
    
    console.log('🎭 Found elements:', shows.length);
    shows.forEach(s => console.log('  -', s));
    
    await browser.close();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

scrape();
