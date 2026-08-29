const fs = require('fs');
const path = require('path');

console.log('Testing Extended Botanical Illustration & Storytelling System...');

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
  'AloeVeraRosette',
  'BhringrajFlora',
  'HibiscusBlossom',
  'FarmerInField',
  'PlantingHands',
  'SeedSowing',
  'SproutingSeedling',
  'HarvestBasket',
  'RootsAndSoil',
  'MosquitoVaporizerArt',
  'VaporizerRefillCartridge',
  'MosquitoSprayArt',
  'BotanicalShield',
  'ModernIndianHome',
  'OutdoorGardenSanctuary',
  'MonsoonRainLeaves',
  'AyurvedicMortarPestle',
  'MadeInIndiaInsignia',
  'EmptyCartBasket',
  'FarmToHomeJourney',
  'ProductUsageFlow',
  'BotanicalWatermark',
  'CategoryBotanicalBadge',
  'FooterBotanicalStrip',
  'SectionIllustrationSlot'
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
if (!adminIll.includes('handleFileUpload') || !adminIll.includes('handleMoveOrder')) {
  console.error('FAIL: IllustrationsManager missing upload or move order feature');
  process.exit(1);
}
console.log('✓ Admin IllustrationsManager (Upload, Library, Multi-order Reorder) verified.');

// Check App.jsx routes
const appJsx = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8');
if (!appJsx.includes('path="illustrations"')) {
  console.error('FAIL: App.jsx missing /admin/illustrations route');
  process.exit(1);
}
console.log('✓ App.jsx /admin/illustrations route verified.');

// Check ProductDetail.jsx ingredients parsing
const pdJsx = fs.readFileSync(path.join(__dirname, '../src/pages/ProductDetail.jsx'), 'utf8');
if (!pdJsx.includes('NeemBranch') || !pdJsx.includes('CitronellaCluster')) {
  console.error('FAIL: ProductDetail missing botanical ingredients mapping');
  process.exit(1);
}
console.log('✓ ProductDetail dynamic ingredient badges verified.');

console.log('ALL BOTANICAL ILLUSTRATION INTEGRATION CHECKS PASSED.');
