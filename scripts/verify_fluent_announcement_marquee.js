import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testFluentAnnouncementMarquee() {
  console.log('=== TANUSH NATURAL FLUENT ANNOUNCEMENT MARQUEE TEST ===\n');

  // 1. Inspect AnnouncementMarquee.jsx
  console.log('1. Checking AnnouncementMarquee.jsx:');
  const marqueeJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'AnnouncementMarquee', 'AnnouncementMarquee.jsx'), 'utf-8');

  if (!marqueeJsx.includes('fullList') || !marqueeJsx.includes('marquee-content-set')) {
    console.error('FAIL: Missing multiplied message set in AnnouncementMarquee.jsx');
    process.exit(1);
  }
  console.log('   PASS: Multiplied seamless message set verified in AnnouncementMarquee.jsx!');

  // 2. Inspect AnnouncementMarquee.css
  console.log('\n2. Checking AnnouncementMarquee.css:');
  const marqueeCss = fs.readFileSync(path.join(rootDir, 'src', 'components', 'AnnouncementMarquee', 'AnnouncementMarquee.css'), 'utf-8');

  if (!marqueeCss.includes('scroll-fluent-marquee') || !marqueeCss.includes('translate3d(-50%, 0, 0)')) {
    console.error('FAIL: Missing seamless translate3d keyframe in AnnouncementMarquee.css');
    process.exit(1);
  }
  console.log('   PASS: GPU-accelerated seamless translate3d infinite animation verified in AnnouncementMarquee.css!');

  console.log('\n=== ALL FLUENT ANNOUNCEMENT MARQUEE TESTS PASSED ===');
}

testFluentAnnouncementMarquee().catch(err => {
  console.error(err);
  process.exit(1);
});
