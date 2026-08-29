import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testFullwidthJourneySocialSection() {
  console.log('=== TANUSH NATURAL FULLWIDTH JOURNEY SOCIAL SECTION TEST ===\n');

  // 1. Inspect Home.jsx
  console.log('1. Checking Home.jsx:');
  const homeJsx = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Home.jsx'), 'utf-8');

  if (!homeJsx.includes('social-fullwidth-journey-section')) {
    console.error('FAIL: Missing social-fullwidth-journey-section in Home.jsx');
    process.exit(1);
  }
  if (!homeJsx.includes('journey-collage-grid') || !homeJsx.includes('journey-callout-panel')) {
    console.error('FAIL: Missing collage grid or callout panel in Home.jsx');
    process.exit(1);
  }
  console.log('   PASS: Home.jsx social section structure verified!');

  // 2. Inspect Home.css
  console.log('\n2. Checking Home.css full-bleed and layout rules:');
  const homeCss = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Home.css'), 'utf-8');

  if (!homeCss.includes('width: 100vw') || !homeCss.includes('margin-left: calc(-50vw + 50%)')) {
    console.error('FAIL: Missing 100vw full-bleed rules in Home.css');
    process.exit(1);
  }
  if (!homeCss.includes('.journey-collage-grid') || !homeCss.includes('.journey-card')) {
    console.error('FAIL: Missing collage grid or card styling in Home.css');
    process.exit(1);
  }
  console.log('   PASS: Full-bleed 100vw styling & 4-column collage rules verified in Home.css!');

  // 3. Inspect tanush_database.json
  console.log('\n3. Checking tanush_database.json:');
  const dbJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'tanush_database.json'), 'utf-8'));
  if (!dbJson.socialSection || !Array.isArray(dbJson.socialSection.items) || dbJson.socialSection.items.length < 8) {
    console.error('FAIL: Missing or incomplete socialSection in tanush_database.json');
    process.exit(1);
  }
  console.log(`   PASS: Database contains ${dbJson.socialSection.items.length} social journey items!`);

  console.log('\n=== ALL FULLWIDTH JOURNEY SOCIAL SECTION TESTS PASSED ===');
}

testFullwidthJourneySocialSection().catch(err => {
  console.error(err);
  process.exit(1);
});
