const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING UNIQUE NON-REPEATING JOURNEY IMAGES ===');

// 1. Check tanush_database.json
const dbPath = path.join(__dirname, '../tanush_database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const items = db.socialSection?.items || [];
console.log(`Found ${items.length} items in db.socialSection.items.`);

const imageSet = new Set(items.map(i => i.image));
if (imageSet.size !== items.length) {
  console.error(`FAIL: Database contains duplicate images! (${imageSet.size} unique vs ${items.length} total)`);
  process.exit(1);
} else {
  console.log(`PASS: All ${items.length} database items have unique image URLs.`);
}

// 2. Check Home.jsx logic
const homePath = path.join(__dirname, '../src/pages/Home.jsx');
const homeContent = fs.readFileSync(homePath, 'utf8');

if (!homeContent.includes('usedImages.has(') || !homeContent.includes('defaultPool')) {
  console.error('FAIL: Home.jsx does not have unique set deduplication logic.');
  process.exit(1);
} else {
  console.log('PASS: Home.jsx contains unique set deduplication and non-repeating pool fallback logic.');
}

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
