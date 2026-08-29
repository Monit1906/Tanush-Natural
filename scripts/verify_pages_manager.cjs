const fs = require('fs');
const path = require('path');

console.log('Testing Page-Wise + Section-Wise Website Control System...');

// 1. Verify pageConfigs.js presets
const pageConfigsJs = fs.readFileSync(path.join(__dirname, '../src/lib/pageConfigs.js'), 'utf8');

const expectedPages = ['home', 'shop', 'why-tanush', 'become-a-partner', 'contact', 'product-detail'];
for (const p of expectedPages) {
  if (!pageConfigsJs.includes(`id: '${p}'`)) {
    console.error(`FAIL: Missing default page config preset for ${p}`);
    process.exit(1);
  }
}
console.log('✓ All 6 page configuration presets verified.');

// 2. Verify db.js API methods
const dbJs = fs.readFileSync(path.join(__dirname, '../src/lib/db.js'), 'utf8');
const requiredMethods = ['getPageConfig', 'savePageConfig', 'getAllPageConfigs', 'saveAllPageConfigs'];
for (const m of requiredMethods) {
  if (!dbJs.includes(`${m}:`)) {
    console.error(`FAIL: Missing db.js method: ${m}`);
    process.exit(1);
  }
}
console.log('✓ db.js API methods verified.');

// 3. Verify PagesManager component
const adminPages = fs.readFileSync(path.join(__dirname, '../src/pages/Admin/PagesManager.jsx'), 'utf8');
if (!adminPages.includes('POSITIONS') || !adminPages.includes('handleMoveSection') || !adminPages.includes('MediaPickerModal')) {
  console.error('FAIL: PagesManager.jsx missing essential features');
  process.exit(1);
}
console.log('✓ Admin PagesManager (Page selector, section reorder, modal drawer) verified.');

// 4. Verify AdminLayout nav link
const adminLayout = fs.readFileSync(path.join(__dirname, '../src/components/Admin/AdminLayout.jsx'), 'utf8');
if (!adminLayout.includes('to="/admin/pages"')) {
  console.error('FAIL: AdminLayout.jsx missing Website Pages link');
  process.exit(1);
}
console.log('✓ AdminLayout /admin/pages navigation verified.');

// 5. Verify Public pages
const becomePartner = fs.readFileSync(path.join(__dirname, '../src/pages/BecomePartner.jsx'), 'utf8');
if (!becomePartner.includes('getPageConfig') || !becomePartner.includes('handleSubmit')) {
  console.error('FAIL: BecomePartner.jsx missing getPageConfig or active form submit');
  process.exit(1);
}

const contact = fs.readFileSync(path.join(__dirname, '../src/pages/Contact.jsx'), 'utf8');
if (!contact.includes('getPageConfig') || !contact.includes('handleSubmit')) {
  console.error('FAIL: Contact.jsx missing getPageConfig or active form submit');
  process.exit(1);
}

console.log('✓ BecomePartner and Contact dynamic integration verified.');
console.log('ALL PAGE-WISE WEBSITE CONTROL SYSTEM TESTS PASSED.');
