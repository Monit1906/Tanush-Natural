import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testNewsletterMailButton() {
  console.log('=== TANUSH NATURAL NEWSLETTER MAIL BUTTON TEST ===\n');

  // 1. Inspect Footer.jsx
  console.log('1. Checking Footer.jsx:');
  const footerJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Footer', 'Footer.jsx'), 'utf-8');
  if (!footerJsx.includes('newsletter-submit-btn') || !footerJsx.includes('ArrowRight')) {
    console.error('FAIL: Missing newsletter-submit-btn or ArrowRight icon in Footer.jsx');
    process.exit(1);
  }
  console.log('   PASS: Footer.jsx newsletter form & submit button structure verified!');

  // 2. Inspect Footer.css
  console.log('\n2. Checking Footer.css:');
  const footerCss = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Footer', 'Footer.css'), 'utf-8');
  if (!footerCss.includes('.newsletter-submit-btn') || !footerCss.includes('border-radius: 50%') || !footerCss.includes('background: #173B2F')) {
    console.error('FAIL: Missing circular dark green button styling in Footer.css');
    process.exit(1);
  }
  if (!footerCss.includes('border-radius: 30px')) {
    console.error('FAIL: Missing rounded pill input container styling in Footer.css');
    process.exit(1);
  }
  console.log('   PASS: Circular dark green button and sleek pill container verified in Footer.css!');

  console.log('\n=== ALL NEWSLETTER MAIL BUTTON TESTS PASSED ===');
}

testNewsletterMailButton().catch(err => {
  console.error(err);
  process.exit(1);
});
