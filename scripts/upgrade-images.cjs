const fs = require('fs');
const path = require('path');
const https = require('https');

const imageMap = [
  // Home Hero
  { file: 'hero/home/home-hero-01.jpg', query: 'botanical skincare natural light' },
  { file: 'hero/home/home-hero-02.jpg', query: 'organic wellness lifestyle' },
  { file: 'hero/home/home-hero-03.jpg', query: 'natural herbal ingredients' },
  { file: 'hero/home/home-hero-04.jpg', query: 'premium spa natural light' },
  { file: 'hero/home/home-hero-05.jpg', query: 'green leaves texture natural' },
  { file: 'hero/home/home-hero-06.jpg', query: 'clean beauty organic' },

  // Other Heroes
  { file: 'hero/shop/shop-hero.jpg', query: 'apothecary natural remedies' },
  { file: 'hero/shop/shop-hero-01.jpg', query: 'natural beauty products flat lay' },
  { file: 'hero/shop/shop-hero-02.jpg', query: 'essential oils organic' },
  { file: 'hero/shop/shop-hero-03.jpg', query: 'mortar pestle herbs' },
  { file: 'hero/partner/partner-hero.jpg', query: 'organic farm business' },
  { file: 'hero/partner/partner-01.jpg', query: 'natural store interior' },
  { file: 'hero/partner/partner-02.jpg', query: 'herbal wellness business' },
  { file: 'hero/partner/partner-03.jpg', query: 'sustainable business lifestyle' },
  { file: 'hero/contact/contact-hero.jpg', query: 'calm minimalistic natural interior' },
  { file: 'hero/contact/contact-01.jpg', query: 'modern natural office' },
  { file: 'hero/contact/contact-02.jpg', query: 'customer service wellness' },
  { file: 'hero/contact/contact-03.jpg', query: 'botanical minimalist desk' },
  { file: 'hero/why-tanush/why-tanush-hero.jpg', query: 'harvesting herbs natural light' },
  { file: 'hero/why-tanush/why-tanush-01.jpg', query: 'sustainable farming' },
  { file: 'hero/why-tanush/why-tanush-02.jpg', query: 'organic nature' },
  { file: 'hero/why-tanush/why-tanush-03.jpg', query: 'pure natural ingredients' },

  // Categories
  { file: 'categories/home-care.jpg', query: 'natural sustainable home cleaning eucalyptus' },
  { file: 'categories/kitchen-essentials.jpg', query: 'organic spices turmeric natural kitchen' },
  { file: 'categories/mosquito-protection.jpg', query: 'citronella lemongrass natural herbs' },
  { file: 'categories/personal-care.jpg', query: 'premium organic soap natural skincare' },
  { file: 'categories/more.jpg', query: 'assorted natural botanical ingredients' },

  // Lifestyle / Editorial
  { file: 'lifestyle/brand-story.jpg', query: 'traditional herbal medicine preparation' },
  { file: 'lifestyle/our-story.jpg', query: 'mortar pestle herbs natural light' },
  { file: 'lifestyle/thoughtful-1.jpg', query: 'macro green leaf dew' },
  { file: 'lifestyle/thoughtful-2.jpg', query: 'herbal formulation natural' },
  { file: 'lifestyle/thoughtful-3.jpg', query: 'quality inspection natural products' },
  { file: 'lifestyle/thoughtful-4.jpg', query: 'calm morning routine natural light' },
  { file: 'lifestyle/collage-main.jpg', query: 'holistic wellbeing natural' },
  { file: 'lifestyle/collage-sub1.jpg', query: 'botanical tea natural light' },
  { file: 'lifestyle/collage-sub2.jpg', query: 'essential oils wood' },
  { file: 'lifestyle/home-hero.jpg', query: 'premium wellness advertising' },
  { file: 'lifestyle/contact-hero.jpg', query: 'calm interior plants' },
  { file: 'lifestyle/partner-hero.jpg', query: 'natural retail store' },
  { file: 'lifestyle/promo-banner.jpg', query: 'luxury organic beauty flat lay' },
  { file: 'lifestyle/why-tanush-hero.jpg', query: 'green natural landscape' },

  // Social
  { file: 'social/social-1.jpg', query: 'healthy lifestyle calm' },
  { file: 'social/social-2.jpg', query: 'natural living interior' },
  { file: 'social/social-3.jpg', query: 'botanical flat lay' },
  { file: 'social/social-4.jpg', query: 'organic wellness aesthetic' },
  { file: 'social/social-5.jpg', query: 'sustainable lifestyle' }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
};

const getUnsplashUrl = (query) => {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    
    https.get(searchUrl, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            const rawUrl = json.results[0].urls.raw;
            const optimizedUrl = `${rawUrl}&w=1600&fit=max&q=80&fm=jpg`;
            resolve(optimizedUrl);
          } else {
            reject(new Error(`No results for ${query}`));
          }
        } catch (e) {
          reject(new Error(`JSON Parse Error: ${e.message} - Body: ${data.substring(0,100)}`));
        }
      });
    }).on('error', reject);
  });
};

async function main() {
  const publicDir = path.join(__dirname, '..', 'public', 'images');
  
  for (const item of imageMap) {
    const filepath = path.join(publicDir, item.file);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      console.log(`Searching for: ${item.query}`);
      const imgUrl = await getUnsplashUrl(item.query);
      console.log(`Downloading to: ${item.file}`);
      await downloadImage(imgUrl, filepath);
      console.log(`✅ Success: ${item.file}`);
      
      // Delay to avoid hitting rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Failed: ${item.file} - ${err.message}`);
    }
  }
}

main();
