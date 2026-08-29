const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING HERO ADMIN TABS AND SOCIAL ADMIN ITEMS ===');

// 1. Check HeroManager.jsx
const heroManagerPath = path.join(__dirname, '../src/pages/Admin/HeroManager.jsx');
const heroManagerContent = fs.readFileSync(heroManagerPath, 'utf8');

const removedCategories = [
  'Category: Hair Care',
  'Category: Skin Care',
  'Category: Wellness & Elixirs',
  'Category: Home Care',
  'Category: Mosquito Protection'
];

for (const cat of removedCategories) {
  if (heroManagerContent.includes(cat)) {
    console.error(`FAIL: ${cat} is still present in HeroManager.jsx!`);
    process.exit(1);
  }
}
console.log('PASS: All 5 category entries successfully removed from HeroManager.');

// Check top row pages exist
const expectedPages = ['Home Page', 'Shop (All Products)', 'Why Tanush', 'Become a Partner', 'Contact Us'];
for (const p of expectedPages) {
  if (!heroManagerContent.includes(p)) {
    console.error(`FAIL: Expected page "${p}" missing from HeroManager.jsx!`);
    process.exit(1);
  }
}
console.log('PASS: All 5 main pages present in HeroManager.');

// Check connected inner pages resolution
if (!heroManagerContent.includes("s.page === 'shop' || s.page === 'all_inner' || s.hero_type === 'inner_banner'")) {
  console.error('FAIL: Inner pages connected status logic missing in HeroManager.jsx');
  process.exit(1);
}
console.log('PASS: Inner pages show active when shop / inner banner is active.');

// 2. Check Home.jsx social section
const homePath = path.join(__dirname, '../src/pages/Home.jsx');
const homeContent = fs.readFileSync(homePath, 'utf8');

if (homeContent.includes('for (const defItem of defaultPool) {') && homeContent.includes('items.push(defItem)')) {
  console.error('FAIL: Home.jsx still force-injects default dummy images into user items!');
  process.exit(1);
}
console.log('PASS: Home.jsx does not force-inject extra unadded dummy images.');

console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
