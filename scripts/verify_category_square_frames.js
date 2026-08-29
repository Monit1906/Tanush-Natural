import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testCategorySquareFrames() {
  console.log('=== TANUSH NATURAL CATEGORY SQUARE FRAMES TEST ===\n');

  // 1. Inspect Shop.jsx
  console.log('1. Checking Shop.jsx:');
  const shopJsx = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Shop.jsx'), 'utf-8');
  if (!shopJsx.includes('cat-square-frame')) {
    console.error('FAIL: Missing cat-square-frame in Shop.jsx');
    process.exit(1);
  }
  console.log('   PASS: Shop.jsx category cards configured with square frames!');

  // 2. Inspect Shop.css
  console.log('\n2. Checking Shop.css:');
  const shopCss = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Shop.css'), 'utf-8');
  if (!shopCss.includes('.cat-square-frame .cat-img') || !shopCss.includes('border-radius: 18px')) {
    console.error('FAIL: Missing square frame styling with soft rounded corners in Shop.css');
    process.exit(1);
  }
  console.log('   PASS: Square frame radius (18px) and botanical styling verified in Shop.css!');

  console.log('\n=== ALL CATEGORY SQUARE FRAME TESTS PASSED ===');
}

testCategorySquareFrames().catch(err => {
  console.error(err);
  process.exit(1);
});
