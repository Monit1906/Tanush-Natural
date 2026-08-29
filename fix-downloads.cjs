const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'images');

const imagesToDownload = [
  // 1583847268964-b28ce7f70d5d -> 1584824486509-114514a5005d
  { id: '1584824486509-114514a5005d', path: 'categories/home-care.jpg', w: 800, h: 600 },
  { id: '1584824486509-114514a5005d', path: 'lifestyle/thoughtful-1.jpg', w: 600, h: 400 },
  { id: '1584824486509-114514a5005d', path: 'social/social-1.jpg', w: 400, h: 400 },
  
  // 1518531933037-91b2f5f228cb -> 1608248593855-901ed58c1488
  { id: '1608248593855-901ed58c1488', path: 'categories/mosquito-protection.jpg', w: 800, h: 600 },
  { id: '1608248593855-901ed58c1488', path: 'lifestyle/brand-story.jpg', w: 800, h: 800 },
  { id: '1608248593855-901ed58c1488', path: 'lifestyle/collage-main.jpg', w: 600, h: 800 },
  { id: '1608248593855-901ed58c1488', path: 'social/social-4.jpg', w: 400, h: 400 },
  { id: '1608248593855-901ed58c1488', path: 'lifestyle/contact-hero.jpg', w: 1920, h: 600 },
  
  // 1505691938895-1758d7bef511 -> 1556228578-0d85b1a4d571
  { id: '1556228578-0d85b1a4d571', path: 'categories/more.jpg', w: 800, h: 600 },
  { id: '1556228578-0d85b1a4d571', path: 'lifestyle/collage-sub1.jpg', w: 400, h: 400 },
  { id: '1556228578-0d85b1a4d571', path: 'lifestyle/promo-banner.jpg', w: 1920, h: 600 },
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', (err) => { fs.unlink(filepath, () => reject(err)); });
    }).on('error', reject);
  });
};

const main = async () => {
  for (const img of imagesToDownload) {
    const fullPath = path.join(publicDir, img.path);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath); // remove empty file
    const url = `https://images.unsplash.com/photo-${img.id}?w=${img.w}&h=${img.h}&fit=crop`;
    try {
      await downloadImage(url, fullPath);
      console.log('Downloaded:', img.path);
    } catch (e) {
      console.error('Error downloading:', img.path, e.message);
    }
  }
};
main();
