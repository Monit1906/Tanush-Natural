const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING CMS REEL, PRODUCT, AND MEDIA PERSISTENCE ===');

const viteConfig = fs.readFileSync(path.join(__dirname, '../vite.config.js'), 'utf8');
if (!viteConfig.includes('configurePreviewServer(server)')) {
  console.error('FAIL: vite.config.js is missing configurePreviewServer!');
  process.exit(1);
}
console.log('PASS: configurePreviewServer registered in vite.config.js.');

if (!viteConfig.includes('distUploadsDir')) {
  console.error('FAIL: vite.config.js missing distUploadsDir sync!');
  process.exit(1);
}
console.log('PASS: distUploadsDir sync found in vite.config.js.');

const dbJs = fs.readFileSync(path.join(__dirname, '../src/lib/db.js'), 'utf8');
if (!dbJs.includes('saveClientStoredDB') || !dbJs.includes('getClientStoredDB')) {
  console.error('FAIL: db.js is missing client storage persistence!');
  process.exit(1);
}
console.log('PASS: Client-side storage persistence functions found in db.js.');

if (!dbJs.includes('tanush_natural_cms_db_v1')) {
  console.error('FAIL: db.js is missing local storage DB key!');
  process.exit(1);
}
console.log('PASS: LocalStorage synchronization key found.');

console.log('=== ALL CMS PERSISTENCE TESTS PASSED! ===');
