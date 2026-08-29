import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testAdminNavGrouping() {
  console.log('=== TANUSH NATURAL ADMIN NAV GROUPING TEST ===\n');

  // 1. Inspect AdminLayout.jsx
  console.log('1. Checking AdminLayout.jsx:');
  const layoutJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Admin', 'AdminLayout.jsx'), 'utf-8');

  // WEBSITE SECTIONS should be removed
  if (layoutJsx.includes('WEBSITE SECTIONS')) {
    console.error('FAIL: WEBSITE SECTIONS label should be removed');
    process.exit(1);
  }
  console.log('   PASS: WEBSITE SECTIONS header removed!');

  // Hero and Partnerships should be in CONTENT & STORIES
  const contentSection = layoutJsx.split('COMMERCE')[0];
  if (!contentSection.includes('/admin/hero') || !contentSection.includes('/admin/sections/partnerships')) {
    console.error('FAIL: Hero Slider or Partnerships links missing before COMMERCE section');
    process.exit(1);
  }
  console.log('   PASS: Hero Slider & Banners and Partnerships Section moved to CONTENT & STORIES!');

  console.log('\n=== ALL ADMIN NAV GROUPING TESTS PASSED ===');
}

testAdminNavGrouping().catch(err => {
  console.error(err);
  process.exit(1);
});
