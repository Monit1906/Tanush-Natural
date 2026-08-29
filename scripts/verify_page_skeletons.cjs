const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING PAGE SKELETON LOADERS SYSTEM ===');

// 1. Check Skeleton.jsx and Skeleton.css
const skelPath = path.join(__dirname, '../src/components/Skeletons/Skeleton.jsx');
const skelCssPath = path.join(__dirname, '../src/components/Skeletons/Skeleton.css');

if (!fs.existsSync(skelPath) || !fs.existsSync(skelCssPath)) {
  console.error('FAIL: Skeleton.jsx or Skeleton.css is missing!');
  process.exit(1);
}
console.log('PASS: Skeleton component and CSS files exist.');

const skelContent = fs.readFileSync(skelPath, 'utf8');
const requiredSkeletons = [
  'HomeSkeleton',
  'ShopSkeleton',
  'ProductDetailSkeleton',
  'GenericPageSkeleton',
  'AdminSkeleton',
  'ProductCardSkeleton'
];

for (const name of requiredSkeletons) {
  if (!skelContent.includes(`export const ${name}`)) {
    console.error(`FAIL: Missing ${name} in Skeleton.jsx!`);
    process.exit(1);
  }
}
console.log('PASS: All tailored page skeletons are exported.');

// 2. Check Home.jsx
const homeContent = fs.readFileSync(path.join(__dirname, '../src/pages/Home.jsx'), 'utf8');
if (!homeContent.includes('<HomeSkeleton />')) {
  console.error('FAIL: Home.jsx does not render HomeSkeleton!');
  process.exit(1);
}
console.log('PASS: Home.jsx renders HomeSkeleton during loading.');

// 3. Check Shop.jsx
const shopContent = fs.readFileSync(path.join(__dirname, '../src/pages/Shop.jsx'), 'utf8');
if (!shopContent.includes('<ShopSkeleton />')) {
  console.error('FAIL: Shop.jsx does not render ShopSkeleton!');
  process.exit(1);
}
console.log('PASS: Shop.jsx renders ShopSkeleton during loading.');

// 4. Check ProductDetail.jsx
const pdContent = fs.readFileSync(path.join(__dirname, '../src/pages/ProductDetail.jsx'), 'utf8');
if (!pdContent.includes('<ProductDetailSkeleton />')) {
  console.error('FAIL: ProductDetail.jsx does not render ProductDetailSkeleton!');
  process.exit(1);
}
console.log('PASS: ProductDetail.jsx renders ProductDetailSkeleton during loading.');

// 5. Check AdminRoute.jsx
const adminRouteContent = fs.readFileSync(path.join(__dirname, '../src/components/Admin/AdminRoute.jsx'), 'utf8');
if (!adminRouteContent.includes('<AdminSkeleton />')) {
  console.error('FAIL: AdminRoute.jsx does not render AdminSkeleton!');
  process.exit(1);
}
console.log('PASS: AdminRoute.jsx renders AdminSkeleton during loading.');

console.log('=== ALL SKELETON SYSTEM TESTS PASSED SUCCESSFULLY! ===');
