const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'images');

const imagesToDownload = [
  // Products (Keep existing official product packshots as requested)
  { id: '1608248543803-ba4f8c70ae0b', path: 'products/mosquito-repellent-liquid.jpg', w: 600, h: 600 },
  { id: '1556228578-0d85b1a4d571', path: 'products/vaporizer.jpg', w: 600, h: 600 },
  { id: '1596040033229-a9821ebd058d', path: 'products/garam-masala.jpg', w: 600, h: 600 },
  { id: '1585553616435-2dc0a54e271d', path: 'products/floor-cleaner.jpg', w: 600, h: 600 },
  { id: '1585553616435-2dc0a54e271d', path: 'products/bath-cleaner.jpg', w: 600, h: 600 },
  { id: '1612817288484-6f916006741a', path: 'products/hand-wash.jpg', w: 600, h: 600 },
  { id: '1585553616435-2dc0a54e271d', path: 'products/dish-wash.jpg', w: 600, h: 600 },
  { id: '1596040033229-a9821ebd058d', path: 'products/kasturi-haldi.jpg', w: 600, h: 600 },
  { id: '1596040033229-a9821ebd058d', path: 'products/amla-powder.jpg', w: 600, h: 600 },
  { id: '1556228578-0d85b1a4d571', path: 'products/mosquito-spray.jpg', w: 600, h: 600 },
  { id: '1608248543803-ba4f8c70ae0b', path: 'products/mosquito-refill.jpg', w: 600, h: 600 },
  { id: '1608248543803-ba4f8c70ae0b', path: 'products/combo-pack.jpg', w: 600, h: 600 },
  
  // Categories (Premium Relevant Images, unique per category)
  { id: '1612817288484-6f916006741a', path: 'categories/home-care.jpg', w: 800, h: 800 },
  { id: '1556910103-1c02745aae4d', path: 'categories/mosquito-protection.jpg', w: 800, h: 800 },
  { id: '1515377905703-c4788e51af15', path: 'categories/kitchen-essentials.jpg', w: 800, h: 800 },
  { id: '1620916566398-39f1143ab7be', path: 'categories/personal-care.jpg', w: 800, h: 800 },
  { id: '1620916566398-39f1143ab7be', path: 'categories/more.jpg', w: 800, h: 800 },

  // Lifestyle / Editorial (High Resolution, Premium Natural)
  { id: '1612817159949-195b6eb9e31a', path: 'lifestyle/home-hero.jpg', w: 2400, h: 1600 },
  { id: '1596040033229-a9821ebd058d', path: 'lifestyle/brand-story.jpg', w: 1200, h: 1400 },
  { id: '1515377905703-c4788e51af15', path: 'lifestyle/promo-banner.jpg', w: 2400, h: 1000 },
  { id: '1585553616435-2dc0a54e271d', path: 'lifestyle/our-story.jpg', w: 1200, h: 1200 },
  { id: '1596040033229-a9821ebd058d', path: 'lifestyle/contact-hero.jpg', w: 2400, h: 800 },
  { id: '1585553616435-2dc0a54e271d', path: 'lifestyle/partner-hero.jpg', w: 2400, h: 800 },
  { id: '1556910103-1c02745aae4d', path: 'lifestyle/why-tanush-hero.jpg', w: 2400, h: 800 },
  { id: '1556228578-0d85b1a4d571', path: 'lifestyle/thoughtful-1.jpg', w: 800, h: 600 },
  { id: '1608248543803-ba4f8c70ae0b', path: 'lifestyle/thoughtful-2.jpg', w: 800, h: 600 },
  { id: '1612817159949-195b6eb9e31a', path: 'lifestyle/thoughtful-3.jpg', w: 800, h: 600 },
  { id: '1620916566398-39f1143ab7be', path: 'lifestyle/thoughtful-4.jpg', w: 800, h: 600 },
  { id: '1612817159949-195b6eb9e31a', path: 'lifestyle/collage-main.jpg', w: 800, h: 1200 },
  { id: '1596040033229-a9821ebd058d', path: 'lifestyle/collage-sub1.jpg', w: 600, h: 600 },
  { id: '1515377905703-c4788e51af15', path: 'lifestyle/collage-sub2.jpg', w: 600, h: 600 },

  // Social
  { id: '1612817288484-6f916006741a', path: 'social/social-1.jpg', w: 600, h: 600 },
  { id: '1556910103-1c02745aae4d', path: 'social/social-2.jpg', w: 600, h: 600 },
  { id: '1515377905703-c4788e51af15', path: 'social/social-3.jpg', w: 600, h: 600 },
  { id: '1620916566398-39f1143ab7be', path: 'social/social-4.jpg', w: 600, h: 600 },
  { id: '1620916566398-39f1143ab7be', path: 'social/social-5.jpg', w: 600, h: 600 }
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
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
};

const createDirs = () => {
  const dirs = ['products', 'categories', 'lifestyle', 'social'];
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  dirs.forEach(d => {
    const p = path.join(publicDir, d);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  });
};

const main = async () => {
  createDirs();
  console.log('Downloading ' + imagesToDownload.length + ' images...');
  for (const img of imagesToDownload) {
    const fullPath = path.join(publicDir, img.path);
    if (!fs.existsSync(fullPath)) {
      const url = `https://images.unsplash.com/photo-${img.id}?w=${img.w}&h=${img.h}&fit=crop`;
      try {
        await downloadImage(url, fullPath);
        console.log('Downloaded:', img.path);
      } catch (e) {
        console.error('Error downloading:', img.path, e.message);
      }
    } else {
      console.log('Skipping existing:', img.path);
    }
  }
  console.log('Done!');
};

main();
