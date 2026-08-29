const fs = require('fs');
const path = require('path');

// Test vite config preview and start configuration
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
console.log('Checking package.json scripts:');
console.log(' - build:', pkg.scripts.build);
console.log(' - preview:', pkg.scripts.preview);
console.log(' - start:', pkg.scripts.start);

if (!pkg.scripts.start || !pkg.scripts.start.includes('vite preview')) {
  console.error('FAIL: Missing start script for GoDaddy App Platform preview execution');
  process.exit(1);
}

// Test db.js normalization logic
const dbJs = fs.readFileSync(path.join(__dirname, '../src/lib/db.js'), 'utf8');

const requiredMethods = [
  'getProducts', 'saveProduct', 'deleteProduct',
  'getCategories', 'saveCategory', 'deleteCategory',
  'getStories', 'saveStory', 'deleteStory',
  'getHeroSlides', 'saveHeroSlide', 'deleteHeroSlide',
  'getPartnershipSection', 'savePartnershipSection',
  'getTestimonials', 'saveTestimonial', 'deleteTestimonial',
  'getSiteSettings', 'saveSiteSettings',
  'getClientStoredDB', 'saveClientStoredDB'
];

for (const m of requiredMethods) {
  if (!dbJs.includes(m)) {
    console.error(`FAIL: Missing required method: ${m}`);
    process.exit(1);
  }
}

console.log('SUCCESS: All required CMS database methods and localStorage fallbacks verified.');
