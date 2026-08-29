import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testReelsPipeline() {
  console.log('=== TANUSH NATURAL REELS LIKES & LAYOUT PIPELINE TEST ===\n');

  // 1. Check all reels in database have zero fake likes initially
  const dbPath = path.join(rootDir, 'tanush_database.json');
  const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  console.log('1. Database Fake Likes Reset Verification:');
  const stories = dbContent.stories || [];
  console.log(`   Found ${stories.length} total stories/reels in DB.`);
  for (const s of stories) {
    if (s.likes_count !== 0) {
      console.error(`   FAIL: Story "${s.title}" has non-zero fake likes: ${s.likes_count}`);
      process.exit(1);
    }
  }
  console.log('   PASS: All existing reels have likes_count initialized to 0!');

  // 2. Test Atomic Real-Time Like & Shared Multi-Customer Toggle via API
  console.log('\n2. Real-Time Shared Atomic Like API Test:');
  const targetReelId = stories[0].id;
  console.log(`   Testing reel: "${stories[0].title}" (ID: ${targetReelId})`);

  try {
    // Client A Likes
    const resA = await fetch('http://localhost:5174/api/cms/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reel_id: targetReelId, client_id: 'test_client_A' })
    });
    const dataA = await resA.json();
    console.log(`   Client A likes -> Liked: ${dataA.liked}, Total Likes: ${dataA.likes_count}`);
    if (!dataA.liked || dataA.likes_count !== 1) {
      console.error('   FAIL: Client A like expected count = 1');
      process.exit(1);
    }

    // Client B Likes (Shared Count increments to 2)
    const resB = await fetch('http://localhost:5174/api/cms/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reel_id: targetReelId, client_id: 'test_client_B' })
    });
    const dataB = await resB.json();
    console.log(`   Client B likes -> Liked: ${dataB.liked}, Total Likes: ${dataB.likes_count}`);
    if (!dataB.liked || dataB.likes_count !== 2) {
      console.error('   FAIL: Client B like expected count = 2');
      process.exit(1);
    }

    // Client C Likes (Shared Count increments to 3)
    const resC = await fetch('http://localhost:5174/api/cms/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reel_id: targetReelId, client_id: 'test_client_C' })
    });
    const dataC = await resC.json();
    console.log(`   Client C likes -> Liked: ${dataC.liked}, Total Likes: ${dataC.likes_count}`);
    if (!dataC.liked || dataC.likes_count !== 3) {
      console.error('   FAIL: Client C like expected count = 3');
      process.exit(1);
    }

    // Client A Unlikes (Toggles back, count decrements to 2)
    const resA2 = await fetch('http://localhost:5174/api/cms/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reel_id: targetReelId, client_id: 'test_client_A' })
    });
    const dataA2 = await resA2.json();
    console.log(`   Client A unlikes -> Liked: ${dataA2.liked}, Total Likes: ${dataA2.likes_count}`);
    if (dataA2.liked || dataA2.likes_count !== 2) {
      console.error('   FAIL: Client A unlike expected count = 2');
      process.exit(1);
    }

    // Clean up test likes so database stays pristine at 0
    await fetch('http://localhost:5174/api/cms/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reel_id: targetReelId, client_id: 'test_client_B' })
    });
    await fetch('http://localhost:5174/api/cms/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reel_id: targetReelId, client_id: 'test_client_C' })
    });

    const finalCheck = await fetch(`http://localhost:5174/api/cms/reels/likes?reel_id=${targetReelId}&client_id=test_client_A`);
    const finalData = await finalCheck.json();
    console.log(`   Cleaned up test likes -> Current count: ${finalData.likes_count}`);
    console.log('   PASS: Shared multi-customer real-time atomic likes verified successfully!');
  } catch (err) {
    console.error('   Error during API test:', err.message);
    process.exit(1);
  }

  // 3. Inspect CSS layout for zero black side bars
  console.log('\n3. CSS Layout & Zero Black Side Bar Inspection:');
  const cssPath = path.join(rootDir, 'src', 'components', 'ReelsSection', 'ReelsSection.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  if (!cssContent.includes('aspect-ratio: 9 / 16')) {
    console.error('FAIL: Missing aspect-ratio: 9 / 16 in ReelsSection.css');
    process.exit(1);
  }
  if (!cssContent.includes('reel-video-ambient-backdrop')) {
    console.error('FAIL: Missing ambient backdrop style in ReelsSection.css');
    process.exit(1);
  }
  console.log('   PASS: Vertical 9:16 aspect ratio & ambient backdrop verified in CSS!');

  console.log('\n=== ALL REELS PIPELINE TESTS COMPLETED SUCCESSFULLY ===');
}

testReelsPipeline().catch(e => {
  console.error(e);
  process.exit(1);
});
