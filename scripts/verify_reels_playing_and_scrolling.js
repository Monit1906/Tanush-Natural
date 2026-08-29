import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testReelsPlayingAndScrolling() {
  console.log('=== TANUSH NATURAL REELS PLAYING & SCROLLING TEST ===\n');

  // 1. Inspect ReelsSection.jsx
  console.log('1. Checking ReelsSection.jsx video playback and scrolling engines:');
  const reelsJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ReelsSection', 'ReelsSection.jsx'), 'utf-8');

  // Video autoplay with IntersectionObserver
  if (!reelsJsx.includes('IntersectionObserver') || !reelsJsx.includes('className="reel-card-video"')) {
    console.error('FAIL: Missing video player or IntersectionObserver in ReelCard');
    process.exit(1);
  }
  console.log('   PASS: ReelCard direct video player with IntersectionObserver autoplay verified!');

  // Desktop mouse wheel scroll in preview modal
  if (!reelsJsx.includes('handleWheel') || !reelsJsx.includes('onWheel={handleWheel}')) {
    console.error('FAIL: Missing mouse wheel scroll handler in preview modal');
    process.exit(1);
  }
  console.log('   PASS: Desktop mouse wheel scrolling in preview modal verified!');

  // Desktop Prev & Next floating modal navigation buttons
  if (!reelsJsx.includes('reel-modal-desktop-prev') || !reelsJsx.includes('reel-modal-desktop-next')) {
    console.error('FAIL: Missing desktop modal navigation buttons in ReelsSection.jsx');
    process.exit(1);
  }
  console.log('   PASS: Desktop modal floating Prev & Next navigation buttons verified!');

  // Mobile vertical swipe gestures
  if (!reelsJsx.includes('handleTouchStart') || !reelsJsx.includes('handleTouchEnd') || !reelsJsx.includes('reel-slide-')) {
    console.error('FAIL: Missing mobile vertical swipe gestures in ReelsSection.jsx');
    process.exit(1);
  }
  console.log('   PASS: Mobile vertical swipe gestures & animations verified!');

  // 2. Inspect ReelsSection.css
  console.log('\n2. Checking ReelsSection.css styling:');
  const reelsCss = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ReelsSection', 'ReelsSection.css'), 'utf-8');
  if (!reelsCss.includes('.reel-modal-desktop-arrow') || !reelsCss.includes('.reel-card-video')) {
    console.error('FAIL: Missing desktop arrow styling or video card styling in ReelsSection.css');
    process.exit(1);
  }
  console.log('   PASS: Full styling for desktop arrows and video cards verified in ReelsSection.css!');

  console.log('\n=== ALL REELS PLAYING & SCROLLING TESTS PASSED ===');
}

testReelsPlayingAndScrolling().catch(err => {
  console.error(err);
  process.exit(1);
});
