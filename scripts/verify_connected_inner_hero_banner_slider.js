import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testConnectedInnerHeroBannerSlider() {
  console.log('=== TANUSH NATURAL CONNECTED INNER HERO BANNER TEST ===\n');

  // 1. Inspect db.js getPageHero & getPageHeroSlides
  console.log('1. Checking db.js inner hero banner resolution:');
  const dbJs = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'db.js'), 'utf-8');

  if (!dbJs.includes('getPageHeroSlides') || !dbJs.includes('hero_type === \'inner_banner\'')) {
    console.error('FAIL: Missing getPageHeroSlides or inner_banner fallback in db.js');
    process.exit(1);
  }
  console.log('   PASS: Shared inner hero banner slider resolution verified in db.js!');

  // 2. Inspect inner pages: Shop, WhyTanush, BecomePartner, Contact
  console.log('\n2. Checking inner pages use InnerPageHero:');
  const pages = ['Shop.jsx', 'WhyTanush.jsx', 'BecomePartner.jsx', 'Contact.jsx'];
  for (const p of pages) {
    const content = fs.readFileSync(path.join(rootDir, 'src', 'pages', p), 'utf-8');
    if (!content.includes('InnerPageHero')) {
      console.error(`FAIL: ${p} does not include InnerPageHero`);
      process.exit(1);
    }
    console.log(`   PASS: ${p} correctly uses InnerPageHero!`);
  }

  // 3. Inspect InnerPageHero.jsx & InnerPageHero.css
  console.log('\n3. Checking InnerPageHero multi-slide slider & styles:');
  const heroJsx = fs.readFileSync(path.join(rootDir, 'src', 'components', 'InnerPageHero', 'InnerPageHero.jsx'), 'utf-8');
  const heroCss = fs.readFileSync(path.join(rootDir, 'src', 'components', 'InnerPageHero', 'InnerPageHero.css'), 'utf-8');

  if (!heroJsx.includes('getPageHeroSlides') || !heroJsx.includes('inner-hero-nav-arrow') || !heroJsx.includes('inner-hero-dots')) {
    console.error('FAIL: Missing slider controls in InnerPageHero.jsx');
    process.exit(1);
  }
  if (!heroCss.includes('.inner-hero-nav-arrow') || !heroCss.includes('.inner-hero-dots')) {
    console.error('FAIL: Missing slider controls styling in InnerPageHero.css');
    process.exit(1);
  }
  console.log('   PASS: Multi-slide slider controls and styles verified!');

  console.log('\n=== ALL CONNECTED INNER HERO BANNER TESTS PASSED ===');
}

testConnectedInnerHeroBannerSlider().catch(err => {
  console.error(err);
  process.exit(1);
});
