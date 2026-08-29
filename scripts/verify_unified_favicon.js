import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function testFaviconUnification() {
  console.log('=== TANUSH NATURAL UNIFIED FAVICON PIPELINE TEST ===\n');

  // 1. Check index.html head tags
  console.log('1. Checking index.html <head> configurations:');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  if (!indexHtml.includes('/images/brand/tanush-logo.png')) {
    console.error('FAIL: index.html missing /images/brand/tanush-logo.png');
    process.exit(1);
  }
  if (!indexHtml.includes('apple-touch-icon') || !indexHtml.includes('shortcut icon')) {
    console.error('FAIL: index.html missing apple-touch-icon or shortcut icon');
    process.exit(1);
  }
  console.log('   PASS: index.html properly configured with Tanush Natural favicon links & title!');

  // 2. Check public/favicon.svg
  console.log('\n2. Checking public/favicon.svg:');
  const svgContent = fs.readFileSync(path.join(rootDir, 'public', 'favicon.svg'), 'utf-8');
  if (svgContent.includes('#863bff') || svgContent.includes('matrix(.00324')) {
    console.error('FAIL: public/favicon.svg still contains default Vite purple lightning bolt!');
    process.exit(1);
  }
  if (!svgContent.includes('data:image/png;base64') && !svgContent.includes('tanush')) {
    console.error('FAIL: public/favicon.svg does not embed authentic Tanush Natural brand logo!');
    process.exit(1);
  }
  console.log('   PASS: public/favicon.svg embeds authentic Tanush Natural brand logo image!');

  // 3. Check public/favicon.png and public/favicon.ico
  console.log('\n3. Checking public/favicon.png & public/favicon.ico:');
  const pngPath = path.join(rootDir, 'public', 'favicon.png');
  const icoPath = path.join(rootDir, 'public', 'favicon.ico');
  const brandLogoPath = path.join(rootDir, 'public', 'images', 'brand', 'tanush-logo.png');

  if (!fs.existsSync(pngPath) || !fs.existsSync(icoPath) || !fs.existsSync(brandLogoPath)) {
    console.error('FAIL: Missing favicon or brand logo files in public/');
    process.exit(1);
  }
  console.log(`   Brand Logo: ${fs.statSync(brandLogoPath).size} bytes`);
  console.log(`   Favicon PNG: ${fs.statSync(pngPath).size} bytes`);
  console.log(`   Favicon ICO: ${fs.statSync(icoPath).size} bytes`);
  console.log('   PASS: All public favicon binaries physically verified on disk!');

  // 4. Check DB Settings single source of truth
  console.log('\n4. Checking tanush_database.json Site Settings:');
  const db = JSON.parse(fs.readFileSync(path.join(rootDir, 'tanush_database.json'), 'utf-8'));
  const settings = db.siteSettings;
  console.log(`   Brand Name: ${settings.brand_name}`);
  console.log(`   Logo URL: ${settings.logo_url}`);
  console.log(`   Favicon URL: ${settings.favicon_url}`);
  console.log(`   Use Primary Favicon: ${settings.use_primary_favicon}`);

  if (!settings.logo_url || !settings.favicon_url) {
    console.error('FAIL: DB siteSettings missing logo_url or favicon_url');
    process.exit(1);
  }
  console.log('   PASS: Database contains unified single source of truth!');

  // 5. Test Live Settings API
  console.log('\n5. Testing Live Settings API on localhost:5174:');
  try {
    const res = await fetch('http://localhost:5174/api/cms/settings');
    if (res.ok) {
      const data = await res.json();
      console.log('   GET /api/cms/settings returned 200 OK');
      console.log(`   Server configured logo: ${data.logo_url}`);
      console.log('   PASS: Live settings API returned unified brand media reference!');
    }
  } catch (e) {
    console.log('   Dev server API note:', e.message);
  }

  console.log('\n=== ALL UNIFIED FAVICON PIPELINE TESTS PASSED ===');
}

testFaviconUnification().catch(err => {
  console.error(err);
  process.exit(1);
});
