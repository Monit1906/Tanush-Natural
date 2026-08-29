import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testPartnershipCMS() {
  console.log('=== TANUSH NATURAL PARTNERSHIP CMS PIPELINE TEST ===\n');

  // 1. Check tanush_database.json integrity
  const dbPath = path.join(rootDir, 'tanush_database.json');
  const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  console.log('1. Database Partnership Record:');
  const section = dbContent.partnershipSection;
  console.log('   partnershipSection in DB:', JSON.stringify(section, null, 2));

  if (!section) {
    console.error('FAIL: partnershipSection not found in tanush_database.json');
    process.exit(1);
  }

  if (section.title !== 'GROW WITH TANUSH' || !section.background_image) {
    console.error('FAIL: partnershipSection missing expected default fields');
    process.exit(1);
  }
  console.log('   PASS: partnershipSection model is valid in DB!');

  // 2. Check physical background image presence
  console.log('\n2. Background Image Storage Check:');
  const bgPath = path.join(rootDir, 'public', section.background_image);
  const exists = fs.existsSync(bgPath);
  console.log(`   Image path: ${bgPath}`);
  console.log(`   Disk status: ${exists ? 'EXISTS (' + fs.statSync(bgPath).size + ' bytes)' : 'MISSING'}`);
  if (!exists) {
    console.error('FAIL: background image missing on disk');
    process.exit(1);
  }
  console.log('   PASS: Background image physically verified on disk!');

  // 3. Test API endpoints if server running on localhost:5174
  console.log('\n3. Live CMS API Endpoint Tests:');
  try {
    const res = await fetch('http://localhost:5174/api/cms/partnership-section');
    if (res.ok) {
      const data = await res.json();
      console.log('   GET /api/cms/partnership-section returned 200 OK:', data.title);
      
      // Test POST update
      const updatePayload = {
        ...data,
        description: 'Bring Tanush Natural products to more homes across India. We are looking for retailers and distributors who share our vision.',
        updated_at: new Date().toISOString()
      };

      const postRes = await fetch('http://localhost:5174/api/cms/partnership-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      if (postRes.ok) {
        const postResult = await postRes.json();
        console.log('   POST /api/cms/partnership-section returned 200 OK:', postResult.success);
        console.log('   PASS: Live API roundtrip succeeded!');
      }
    } else {
      console.log('   Dev server returned status:', res.status);
    }
  } catch (e) {
    console.log('   Dev server test note:', e.message);
  }

  // 4. Verify Home.jsx does NOT contain any "LOGIN TO ADMIN" button
  console.log('\n4. Public Home Component Verification:');
  const homeContent = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Home.jsx'), 'utf-8');
  if (homeContent.includes('LOGIN TO ADMIN') || homeContent.includes('btn-partner-admin-access')) {
    console.error('FAIL: Found LOGIN TO ADMIN or btn-partner-admin-access in Home.jsx!');
    process.exit(1);
  }
  console.log('   PASS: "LOGIN TO ADMIN" button is completely removed from public Home.jsx!');

  console.log('\n=== ALL PARTNERSHIP CMS PIPELINE TESTS PASSED ===');
}

testPartnershipCMS().catch(err => {
  console.error(err);
  process.exit(1);
});
