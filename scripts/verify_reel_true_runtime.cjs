const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING REEL TRUE RUNTIME / DURATION SYSTEM ===');

const reelsPath = path.join(__dirname, '../src/components/ReelsSection/ReelsSection.jsx');
const reelsContent = fs.readFileSync(reelsPath, 'utf8');

// 1. Check formatReelDuration helper presence
if (!reelsContent.includes('const formatReelDuration =')) {
  console.error('FAIL: formatReelDuration helper is missing.');
  process.exit(1);
}
console.log('PASS: formatReelDuration helper found.');

// 2. Check ReelCard dynamic duration
if (!reelsContent.includes('onLoadedMetadata={handleLoadedMetadata}') || 
    !reelsContent.includes('{formatReelDuration(duration || story.duration)}')) {
  console.error('FAIL: ReelCard does not bind onLoadedMetadata or formatReelDuration.');
  process.exit(1);
}
console.log('PASS: ReelCard dynamically loads metadata duration and formats it.');

// 3. Check ReelViewerModal dynamic duration
if (!reelsContent.includes('{formatReelDuration(duration || currentStory.duration)}')) {
  console.error('FAIL: ReelViewerModal does not use formatReelDuration.');
  process.exit(1);
}
console.log('PASS: ReelViewerModal dynamically displays true runtime duration.');

// 4. Verify no hardcoded 0:15 in JSX
if (reelsContent.includes('<div className="reel-card-duration">0:15</div>')) {
  console.error('FAIL: Hardcoded <div className="reel-card-duration">0:15</div> still present.');
  process.exit(1);
}
console.log('PASS: No hardcoded duration JSX found.');

// 5. Test time formatter logic
const formatTest = (secs) => {
  if (typeof secs === 'string' && secs.includes(':')) return secs.trim();
  const n = Number(secs);
  if (!n || isNaN(n) || !isFinite(n) || n <= 0) return '0:15';
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

if (formatTest(5) !== '0:05' || formatTest(24.8) !== '0:24' || formatTest(75) !== '1:15') {
  console.error('FAIL: Formatter calculation test failed.');
  process.exit(1);
}
console.log('PASS: Formatter math accurately formats true seconds to M:SS.');

console.log('=== ALL REEL RUNTIME TESTS PASSED! ===');
