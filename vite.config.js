import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function cmsServerPlugin() {
  const dbFilePath = path.resolve(process.cwd(), 'tanush_database.json');
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
  const distUploadsDir = path.resolve(process.cwd(), 'dist/uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Load or initialize DB
  const getDB = () => {
    try {
      if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[CMS Server] Failed to read database file:', e);
    }
    return null;
  };

  const saveDB = (data) => {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('[CMS Server] Failed to write database file:', e);
      return false;
    }
  };

  const cmsMiddleware = async (req, res, next) => {
    if (!req.url.startsWith('/api/cms')) {
      return next();
    }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // Helper to parse JSON body
        const readBody = () => new Promise((resolve) => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch (e) {
              resolve({});
            }
          });
        });

        const db = getDB();

        // 1. GET /api/cms/db -> returns full DB
        if (pathname === '/api/cms/db' && req.method === 'GET') {
          return res.end(JSON.stringify(db || {}));
        }

        // 2. POST /api/cms/db -> updates full DB
        if (pathname === '/api/cms/db' && req.method === 'POST') {
          const body = await readBody();
          saveDB(body);
          return res.end(JSON.stringify({ success: true }));
        }

        // 3a. POST /api/cms/upload-binary -> Direct streaming binary upload for videos and large media
        if (pathname === '/api/cms/upload-binary' && req.method === 'POST') {
          const rawFilename = req.headers['x-filename'] ? decodeURIComponent(req.headers['x-filename']) : 'upload.mp4';
          const mimeType = req.headers['x-mimetype'] || 'application/octet-stream';
          const cleanName = `${Date.now()}-${rawFilename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = path.join(uploadsDir, cleanName);
          
          const fileStream = fs.createWriteStream(filePath);
          let totalBytes = 0;

          req.on('data', (chunk) => {
            totalBytes += chunk.length;
          });

          req.pipe(fileStream);

          fileStream.on('finish', () => {
            if (fs.existsSync(distUploadsDir)) {
              try {
                fs.copyFileSync(filePath, path.join(distUploadsDir, cleanName));
              } catch (e) {}
            }
            const publicUrl = `/uploads/${cleanName}`;
            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: true,
              url: publicUrl,
              name: rawFilename.replace(/\.[^/.]+$/, ''),
              size: `${Math.round(totalBytes / 1024)} KB`,
              mimeType
            }));
          });

          fileStream.on('error', (err) => {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          });
          return;
        }

        // 3b. POST /api/cms/upload -> accepts base64 file data and writes to disk
        if (pathname === '/api/cms/upload' && req.method === 'POST') {
          const body = await readBody();
          const { filename, base64Data, mimeType } = body;
          if (!base64Data) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing base64Data' }));
          }

          const cleanName = `${Date.now()}-${(filename || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = path.join(uploadsDir, cleanName);
          const dataBuffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64');
          fs.writeFileSync(filePath, dataBuffer);

          if (fs.existsSync(distUploadsDir)) {
            try {
              fs.writeFileSync(path.join(distUploadsDir, cleanName), dataBuffer);
            } catch (e) {}
          }

          const publicUrl = `/uploads/${cleanName}`;
          return res.end(JSON.stringify({
            success: true,
            url: publicUrl,
            name: filename || cleanName,
            size: `${Math.round(dataBuffer.length / 1024)} KB`,
            mimeType
          }));
        }

        // 4. Hero Slides endpoints
        if (pathname === '/api/cms/hero') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.heroSlides || []));
          }
          if (req.method === 'POST') {
            const slide = await readBody();
            const slides = db?.heroSlides || [];
            const index = slides.findIndex(s => String(s.id) === String(slide.id));
            if (index >= 0) {
              slides[index] = slide;
            } else {
              slides.push(slide);
            }
            db.heroSlides = slides;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: slide }));
          }
          if (req.method === 'DELETE') {
            const id = url.searchParams.get('id');
            if (db?.heroSlides) {
              db.heroSlides = db.heroSlides.filter(s => String(s.id) !== String(id));
              saveDB(db);
            }
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 5. Products endpoints
        if (pathname === '/api/cms/products') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.products || []));
          }
          if (req.method === 'POST') {
            const product = await readBody();
            const products = db?.products || [];
            const index = products.findIndex(p => String(p.id) === String(product.id));
            if (index >= 0) {
              products[index] = product;
            } else {
              products.unshift(product);
            }
            db.products = products;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: product }));
          }
          if (req.method === 'DELETE') {
            const id = url.searchParams.get('id');
            if (db?.products) {
              db.products = db.products.filter(p => String(p.id) !== String(id));
              saveDB(db);
            }
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 6. Categories endpoints
        if (pathname === '/api/cms/categories') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.categories || []));
          }
          if (req.method === 'POST') {
            const cat = await readBody();
            const cats = db?.categories || [];
            const index = cats.findIndex(c => String(c.id) === String(cat.id));
            if (index >= 0) {
              cats[index] = cat;
            } else {
              cats.push(cat);
            }
            db.categories = cats;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: cat }));
          }
          if (req.method === 'DELETE') {
            const id = url.searchParams.get('id');
            if (db?.categories) {
              db.categories = db.categories.filter(c => String(c.id) !== String(id));
              saveDB(db);
            }
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 7. Stories / Reels endpoints
        if (pathname === '/api/cms/stories') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.stories || []));
          }
          if (req.method === 'POST') {
            const story = await readBody();
            const stories = db?.stories || [];
            const index = stories.findIndex(s => String(s.id) === String(story.id));
            if (index >= 0) {
              stories[index] = story;
            } else {
              stories.push(story);
            }
            db.stories = stories;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: story }));
          }
          if (req.method === 'DELETE') {
            const id = url.searchParams.get('id');
            if (db?.stories) {
              db.stories = db.stories.filter(s => String(s.id) !== String(id));
              saveDB(db);
            }
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 7b. Reel Likes Endpoints (Real-time atomic like/unlike system)
        if (pathname === '/api/cms/reels/likes' && req.method === 'GET') {
          const reelId = url.searchParams.get('reel_id');
          const clientId = url.searchParams.get('client_id');
          const allLikes = db?.reel_likes || [];

          if (reelId) {
            const reelLikes = allLikes.filter(l => String(l.reel_id) === String(reelId));
            const hasLiked = clientId ? reelLikes.some(l => String(l.client_id) === String(clientId)) : false;
            return res.end(JSON.stringify({
              reel_id: reelId,
              likes_count: reelLikes.length,
              liked: hasLiked
            }));
          }

          // Return map of all reel likes
          const countsMap = {};
          allLikes.forEach(l => {
            countsMap[l.reel_id] = (countsMap[l.reel_id] || 0) + 1;
          });
          return res.end(JSON.stringify({ likes_map: countsMap }));
        }

        if (pathname === '/api/cms/reels/like' && req.method === 'POST') {
          const body = await readBody();
          const { reel_id, client_id } = body;

          if (!reel_id || !client_id) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing reel_id or client_id' }));
          }

          if (!Array.isArray(db.reel_likes)) {
            db.reel_likes = [];
          }

          const existingIndex = db.reel_likes.findIndex(
            l => String(l.reel_id) === String(reel_id) && String(l.client_id) === String(client_id)
          );

          let isLiked = false;
          if (existingIndex >= 0) {
            // Unlike
            db.reel_likes.splice(existingIndex, 1);
            isLiked = false;
          } else {
            // Like
            db.reel_likes.push({
              id: `rl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              reel_id: String(reel_id),
              client_id: String(client_id),
              created_at: new Date().toISOString()
            });
            isLiked = true;
          }

          // Compute exact atomic count
          const totalCount = db.reel_likes.filter(l => String(l.reel_id) === String(reel_id)).length;

          // Update story record in db.stories
          if (Array.isArray(db.stories)) {
            const story = db.stories.find(s => String(s.id) === String(reel_id));
            if (story) {
              story.likes_count = totalCount;
            }
          }

          saveDB(db);

          return res.end(JSON.stringify({
            success: true,
            reel_id,
            liked: isLiked,
            likes_count: totalCount
          }));
        }

        // 8. Site Settings endpoints
        if (pathname === '/api/cms/settings') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.siteSettings || {}));
          }
          if (req.method === 'POST') {
            const settings = await readBody();
            db.siteSettings = settings;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: settings }));
          }
        }

        // 9. Homepage Sections
        if (pathname === '/api/cms/homepage_sections') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.homepageSections || []));
          }
          if (req.method === 'POST') {
            const sections = await readBody();
            db.homepageSections = sections;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: sections }));
          }
        }

        // 9a. Pages & Section-Wise Control System
        if (pathname === '/api/cms/pages_config') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.pageConfigs || {}));
          }
          if (req.method === 'POST') {
            const pageConfigs = await readBody();
            db.pageConfigs = pageConfigs;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: pageConfigs }));
          }
        }

        // 9b. Partnership Section
        if (pathname === '/api/cms/partnership-section' || pathname === '/api/cms/sections/partnerships') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.partnershipSection || null));
          }
          if (req.method === 'POST') {
            const partnershipData = await readBody();
            db.partnershipSection = partnershipData;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: partnershipData }));
          }
        }

        // 10. Testimonials
        if (pathname === '/api/cms/testimonials') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.testimonials || []));
          }
          if (req.method === 'POST') {
            const testimonial = await readBody();
            const items = db?.testimonials || [];
            const index = items.findIndex(t => String(t.id) === String(testimonial.id));
            if (index >= 0) {
              items[index] = testimonial;
            } else {
              items.push(testimonial);
            }
            db.testimonials = items;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: testimonial }));
          }
          if (req.method === 'DELETE') {
            const id = url.searchParams.get('id');
            if (db?.testimonials) {
              db.testimonials = db.testimonials.filter(t => String(t.id) !== String(id));
              saveDB(db);
            }
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 11. Media Library
        if (pathname === '/api/cms/media') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.media || []));
          }
          if (req.method === 'POST') {
            const mediaItem = await readBody();
            const mediaList = db?.media || [];
            const index = mediaList.findIndex(m => String(m.id) === String(mediaItem.id));
            if (index >= 0) {
              mediaList[index] = mediaItem;
            } else {
              mediaList.unshift(mediaItem);
            }
            db.media = mediaList;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: mediaItem }));
          }
          if (req.method === 'DELETE') {
            const id = url.searchParams.get('id');
            if (db?.media) {
              db.media = db.media.filter(m => String(m.id) !== String(id));
              saveDB(db);
            }
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 12. Audit Logs
        if (pathname === '/api/cms/audit_logs') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.auditLogs || []));
          }
          if (req.method === 'POST') {
            const log = await readBody();
            const logs = db?.auditLogs || [];
            logs.unshift(log);
            db.auditLogs = logs.slice(0, 100);
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: log }));
          }
        }

        // 13. Customers
        if (pathname === '/api/cms/customers') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.customers || []));
          }
          if (req.method === 'POST') {
            const customer = await readBody();
            const customers = db?.customers || [];
            const index = customers.findIndex(c => String(c.id) === String(customer.id));
            if (index >= 0) {
              customers[index] = customer;
            } else {
              customers.unshift(customer);
            }
            db.customers = customers;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: customer }));
          }
        }

        // 14. Orders
        if (pathname === '/api/cms/orders') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.orders || []));
          }
          if (req.method === 'POST') {
            const order = await readBody();
            const orders = db?.orders || [];
            const index = orders.findIndex(o => String(o.id) === String(order.id));
            if (index >= 0) {
              orders[index] = order;
            } else {
              orders.unshift(order);
            }
            db.orders = orders;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: order }));
          }
        }

        // 15. Messages / Inquiries
        if (pathname === '/api/cms/messages') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.messages || []));
          }
          if (req.method === 'POST') {
            const message = await readBody();
            const messages = db?.messages || [];
            const index = messages.findIndex(m => String(m.id) === String(message.id));
            if (index >= 0) {
              messages[index] = message;
            } else {
              messages.unshift(message);
            }
            db.messages = messages;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: message }));
          }
        }

        // 16. Analytics Events
        if (pathname === '/api/cms/analytics_events') {
          if (req.method === 'GET') {
            return res.end(JSON.stringify(db?.analytics_events || []));
          }
          if (req.method === 'POST') {
            const event = await readBody();
            const events = db?.analytics_events || [];
            events.unshift({
              ...event,
              id: event.id || `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              timestamp: event.timestamp || new Date().toISOString()
            });
            db.analytics_events = events;
            saveDB(db);
            return res.end(JSON.stringify({ success: true, data: event }));
          }
        }

        // Default 404 for unknown api endpoint
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Endpoint not found' }));
      };

      return {
        name: 'tanush-cms-server',
        configureServer(server) {
          server.middlewares.use(cmsMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use(cmsMiddleware);
        }
      };
    }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cmsServerPlugin()],
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000', 10),
    allowedHosts: true
  },
  server: {
    host: '0.0.0.0'
  }
});
