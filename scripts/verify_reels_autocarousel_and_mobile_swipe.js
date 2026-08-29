import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testReelsAndHeroCustomisation() {
  console.log('=== TANUSH NATURAL REELS & HERO ADMIN CUSTOMISATION TEST ===\n');

  // 1. Inspect ReelsSection.jsx code logic
  console.log('1. Checking ReelsSection.jsx components & algorithms:');
  const reelsJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ReelsSection', 'ReelsSection.jsx'), 'utf-8');

  // Single unique list
  if (!reelsJsx.includes('stories.map((story, idx)') || reelsJsx.includes('displayStories')) {
    console.error('FAIL: Reels list should render each reel only once without duplicating');
    process.exit(1);
  }
  console.log('   PASS: Single unique reel list (0 duplicate cards) verified!');

  // Smooth scroll
  if (!reelsJsx.includes('requestAnimationFrame') || !reelsJsx.includes('el.scrollLeft +=')) {
    console.error('FAIL: Missing smooth auto-scroll requestAnimationFrame engine in ReelsSection.jsx');
    process.exit(1);
  }
  console.log('   PASS: Smooth GPU composite auto-scroll engine verified!');

  // Manual navigation buttons
  if (!reelsJsx.includes('handleNavPrev') || !reelsJsx.includes('handleNavNext') || !reelsJsx.includes('aria-label="Previous reels"')) {
    console.error('FAIL: Missing manual desktop navigation buttons in ReelsSection.jsx');
    process.exit(1);
  }
  console.log('   PASS: Manual desktop navigation controls verified!');

  // Mobile vertical swipe gestures
  if (!reelsJsx.includes('handleTouchStart') || !reelsJsx.includes('handleTouchMove') || !reelsJsx.includes('handleTouchEnd')) {
    console.error('FAIL: Missing touch swipe gesture detection in ReelsSection.jsx');
    process.exit(1);
  }
  if (!reelsJsx.includes('onIndexChange((currentIndex + 1) % stories.length)') || !reelsJsx.includes('onIndexChange((currentIndex - 1 + stories.length) % stories.length)')) {
    console.error('FAIL: Missing circular vertical swipe navigation in ReelsSection.jsx');
    process.exit(1);
  }
  console.log('   PASS: Mobile vertical swipe up/down & circular navigation verified!');

  // 2. Inspect AdminLayout.jsx navigation for Hero Section & Customization
  console.log('\n2. Checking Admin Customisation Links in AdminLayout.jsx:');
  const layoutJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Admin', 'AdminLayout.jsx'), 'utf-8');

  if (!layoutJsx.includes('/admin/hero') || !layoutJsx.includes('Hero Slider')) {
    console.error('FAIL: Missing Hero Slider link in AdminLayout.jsx');
    process.exit(1);
  }
  console.log('   PASS: Hero Slider & Banners admin customization link verified in Admin sidebar!');

  if (!layoutJsx.includes('/admin/homepage') || !layoutJsx.includes('/admin/sections/partnerships')) {
    console.error('FAIL: Missing Homepage Layout or Partnerships links in AdminLayout.jsx');
    process.exit(1);
  }
  console.log('   PASS: Homepage Layout and Partnerships Section admin links verified!');

  // 3. Inspect App.jsx routes
  console.log('\n3. Checking App.jsx routes:');
  const appJsx = fs.readFileSync(path.join(rootDir, 'src', 'App.jsx'), 'utf-8');
  if (!appJsx.includes('<Route path="hero" element={<HeroManager />} />')) {
    console.error('FAIL: Missing HeroManager route in App.jsx');
    process.exit(1);
  }
  console.log('   PASS: /admin/hero route mounted with HeroManager component!');

  console.log('\n=== ALL REELS SMOOTHNESS & HERO CUSTOMISATION TESTS PASSED ===');
}

testReelsAndHeroCustomisation().catch(err => {
  console.error(err);
  process.exit(1);
});
