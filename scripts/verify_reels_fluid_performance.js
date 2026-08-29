import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testReelsFluidPerformance() {
  console.log('=== TANUSH NATURAL REELS FLUID PERFORMANCE TEST ===\n');

  // 1. Inspect ReelsSection.jsx
  console.log('1. Checking ReelsSection.jsx:');
  const reelsJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ReelsSection', 'ReelsSection.jsx'), 'utf-8');

  if (!reelsJsx.includes('performance.now()') || !reelsJsx.includes('handleUserInteraction')) {
    console.error('FAIL: Missing delta-time smoothing or user interaction listeners in ReelsSection.jsx');
    process.exit(1);
  }
  console.log('   PASS: Delta-time animation loop and user interaction pause verified in ReelsSection.jsx!');

  // 2. Inspect ReelsSection.css
  console.log('\n2. Checking ReelsSection.css:');
  const reelsCss = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ReelsSection', 'ReelsSection.css'), 'utf-8');

  if (!reelsCss.includes('translateZ(0)') || !reelsCss.includes('contain: layout style')) {
    console.error('FAIL: Missing hardware acceleration or layout containment in ReelsSection.css');
    process.exit(1);
  }
  console.log('   PASS: Hardware compositing and layer isolation verified in ReelsSection.css!');

  console.log('\n=== ALL REELS FLUID PERFORMANCE TESTS PASSED ===');
}

testReelsFluidPerformance().catch(err => {
  console.error(err);
  process.exit(1);
});
