import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testShopNoFilterAndViewSwitcher() {
  console.log('=== TANUSH NATURAL SHOP VIEW SWITCHER & NO FILTER TEST ===\n');

  // 1. Inspect Shop.jsx
  console.log('1. Checking Shop.jsx:');
  const shopJsx = fs.readFileSync(path.join(rootDir, 'src', 'pages', 'Shop.jsx'), 'utf-8');

  // No sidebar
  if (shopJsx.includes('shop-sidebar') || shopJsx.includes('isMobileFilterOpen')) {
    console.error('FAIL: Sidebar filter section should be removed from Shop.jsx');
    process.exit(1);
  }
  console.log('   PASS: Sidebar filter section removed from Shop.jsx!');

  // Category icons
  if (!shopJsx.includes('cat-square-frame') || !shopJsx.includes('handleCategoryClick')) {
    console.error('FAIL: Missing category square icon filtering in Shop.jsx');
    process.exit(1);
  }
  console.log('   PASS: Category square icon selection verified in Shop.jsx!');

  // View Mode Switcher
  if (!shopJsx.includes('view-mode-toggle') || !shopJsx.includes('SquaresFour') || !shopJsx.includes('viewMode')) {
    console.error('FAIL: Missing viewMode switcher in Shop.jsx');
    process.exit(1);
  }
  console.log('   PASS: Grid and List view switcher verified in Shop.jsx!');

  // 2. Inspect ProductCard.jsx & ProductCard.css
  console.log('\n2. Checking ProductCard.jsx and ProductCard.css for List View:');
  const cardJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ProductCard', 'ProductCard.jsx'), 'utf-8');
  const cardCss = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ProductCard', 'ProductCard.css'), 'utf-8');

  if (!cardJsx.includes('product-card-list-view') || !cardCss.includes('.product-card-list-view')) {
    console.error('FAIL: Missing list view component/styling in ProductCard');
    process.exit(1);
  }
  console.log('   PASS: List view horizontal layout verified in ProductCard!');

  console.log('\n=== ALL SHOP NO FILTER & VIEW SWITCHER TESTS PASSED ===');
}

testShopNoFilterAndViewSwitcher().catch(err => {
  console.error(err);
  process.exit(1);
});
