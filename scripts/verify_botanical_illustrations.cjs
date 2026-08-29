const fs = require('fs');
const path = require('path');

console.log('Testing Botanical Illustration System...');

// Check BotanicalIllustrations.jsx
const illJsx = fs.readFileSync(path.join(__dirname, '../src/components/Illustrations/BotanicalIllustrations.jsx'), 'utf8');

const requiredIllustrations = [
  'NeemBranch',
  'MoringaFrond',
  'TulsiSprig',
  'CitronellaCluster',
  'LemongrassStalk',
  'EucalyptusSprig',
  'WildTurmeric',
  'AmlaCluster',
  'FarmerInField',
  'PlantingHands',
  'HarvestBasket',
  'MosquitoVaporizerArt',
  'MosquitoSprayArt',
  'BotanicalShield',
  'ModernIndianHome',
  'MonsoonRainLeaves',
  'FarmToHomeJourney',
  'ProductUsageFlow',
  'BotanicalWatermark'
];

for (const exp of requiredIllustrations) {
  if (!illJsx.includes(`export const ${exp}`) && !illJsx.includes(`function ${exp}`)) {
    console.error(`FAIL: Missing export: ${exp}`);
    process.exit(1);
  }
}

console.log(`✓ All ${requiredIllustrations.length} botanical illustrations & components verified.`);

// Check Admin IllustrationsManager
const adminIll = fs.readFileSync(path.join(__dirname, '../src/pages/Admin/IllustrationsManager.jsx'), 'utf8');
if (!adminIll.includes('BOTANICAL_ILLUSTRATIONS_CATALOG')) {
  console.error('FAIL: IllustrationsManager missing catalog reference');
  process.exit(1);
}
console.log('✓ Admin IllustrationsManager verified.');

// Check App.jsx routes
const appJsx = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8');
if (!appJsx.includes('path="illustrations"')) {
  console.error('FAIL: App.jsx missing /admin/illustrations route');
  process.exit(1);
}
console.log('✓ App.jsx /admin/illustrations route verified.');

// Check AdminLayout.jsx links
const layoutJsx = fs.readFileSync(path.join(__dirname, '../src/components/Admin/AdminLayout.jsx'), 'utf8');
if (!layoutJsx.includes('/admin/illustrations')) {
  console.error('FAIL: AdminLayout missing /admin/illustrations link');
  process.exit(1);
}
console.log('✓ AdminLayout /admin/illustrations link verified.');

console.log('ALL BOTANICAL ILLUSTRATION INTEGRATION CHECKS PASSED.');
