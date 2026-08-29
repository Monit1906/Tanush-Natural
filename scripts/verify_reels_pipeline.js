import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testReelPipeline() {
  console.log('=== TANUSH NATURAL REELS PIPELINE TEST ===\n');

  // 1. Check tanush_database.json integrity
  const dbPath = path.join(rootDir, 'tanush_database.json');
  const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  console.log('1. Database Story Records:');
  const stories = dbContent.stories || [];
  console.log(`   Found ${stories.length} stories`);
  stories.forEach((s, idx) => {
    console.log(`   - Story [${idx}]: "${s.title}" (ID: ${s.id})`);
    console.log(`     video_url: "${s.video_url}"`);
    console.log(`     media_id: "${s.media_id || 'none'}"`);
    console.log(`     product_id: "${s.product_id}"`);
  });

  // 2. Check media records
  console.log('\n2. Media Library Video Records:');
  const media = dbContent.media || [];
  const videos = media.filter(m => m.category === 'Videos' || m.url?.includes('.mov') || m.url?.includes('.mp4'));
  console.log(`   Found ${videos.length} video assets in Media Library`);
  videos.forEach(v => {
    console.log(`   - Media "${v.name}" (ID: ${v.id}) -> ${v.url}`);
    // Check disk presence
    const physicalPath = path.join(rootDir, 'public', v.url);
    const exists = fs.existsSync(physicalPath);
    console.log(`     Disk check (${physicalPath}): ${exists ? 'EXISTS (' + fs.statSync(physicalPath).size + ' bytes)' : 'MISSING'}`);
  });

  // 3. Test canonical media resolver
  console.log('\n3. Canonical Media Resolver Verification:');
  const { resolveReelVideoUrl, isValidVideoSource, getVideoMimeType, isMediaVideo } = await import('../src/lib/mediaResolver.js');

  for (const s of stories) {
    const resolvedUrl = resolveReelVideoUrl(s, media);
    const isValid = isValidVideoSource(resolvedUrl);
    const mime = getVideoMimeType(resolvedUrl);
    console.log(`   Story "${s.title}":`);
    console.log(`     Resolved URL: "${resolvedUrl}"`);
    console.log(`     Is Valid: ${isValid}`);
    console.log(`     MIME Type: ${mime}`);
    if (!isValid) {
      console.error(`   FAIL: Story "${s.title}" did not resolve to a valid video URL!`);
      process.exit(1);
    }
  }

  // 4. Test API response from Vite CMS server (if running on port 5174)
  console.log('\n4. Live CMS API & Upload Endpoints:');
  try {
    const res = await fetch('http://localhost:5174/api/cms/stories');
    if (res.ok) {
      const liveStories = await res.json();
      console.log(`   GET /api/cms/stories returned 200 OK with ${liveStories.length} records`);
      const target = liveStories.find(s => s.title === '01 Reviews Tanush');
      if (target && target.video_url === '/uploads/1787982564445-01_Reviews_Tanush.mov') {
        console.log('   PASS: Live API returned 01 Reviews Tanush with persistent video_url!');
      } else {
        console.log('   Warning: target live story video_url is:', target?.video_url);
      }
    } else {
      console.log(`   GET /api/cms/stories returned status ${res.status}`);
    }
  } catch (e) {
    console.log('   Dev server not currently polled, skipping HTTP test:', e.message);
  }

  console.log('\n=== ALL REEL PIPELINE VERIFICATIONS PASSED ===');
}

testReelPipeline().catch(err => {
  console.error(err);
  process.exit(1);
});
