import { supabase, isSupabaseConfigured } from './supabase';
import { products as defaultProducts, categories as defaultCategories } from '../data/products';
import { homepageSlides as defaultHeroSlides } from '../data/heroData';
import { DEFAULT_PAGES_CONFIG, normalizePageConfig } from './pageConfigs';

const DB_API_BASE = '/api/cms';

// BroadcastChannel for instant cross-tab & cross-window synchronization
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('tanush_cms_sync_channel')
  : null;

// LocalStorage Persistence Key
const LOCAL_STORAGE_DB_KEY = 'tanush_natural_cms_db_v1';

export const getClientStoredDB = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const saveClientStoredDB = (updater) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getClientStoredDB() || {};
    const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return null;
  }
};

// In-memory cache for ultra-fast instant UI rendering
let memoryDB = null;

// Normalization Helpers
export const normalizeProduct = (p) => {
  if (!p) return null;
  const isFeatured = p.is_featured !== undefined ? p.is_featured : (p.isFeatured !== undefined ? p.isFeatured : false);
  const isBestSeller = p.is_bestseller !== undefined ? p.is_bestseller : (p.isBestSeller !== undefined ? p.isBestSeller : false);
  const compareAtPrice = p.compare_at_price !== undefined ? p.compare_at_price : (p.compareAtPrice !== undefined ? p.compareAtPrice : 0);
  const reviewCount = p.review_count !== undefined ? p.review_count : (p.reviewCount !== undefined ? p.reviewCount : 0);
  const shortDescription = p.short_description !== undefined ? p.short_description : (p.shortDescription !== undefined ? p.shortDescription : '');
  const howToUse = p.how_to_use !== undefined ? p.how_to_use : (p.howToUse !== undefined ? p.howToUse : '');
  const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : ['/images/products/product-1.jpg']);

  return {
    ...p,
    id: String(p.id),
    slug: p.slug || String(p.id),
    price: Number(p.price) || 0,
    compare_at_price: Number(compareAtPrice) || 0,
    compareAtPrice: Number(compareAtPrice) || 0,
    rating: Number(p.rating) || 4.8,
    review_count: Number(reviewCount) || 24,
    reviewCount: Number(reviewCount) || 24,
    stock: Number(p.stock) || 50,
    short_description: shortDescription,
    shortDescription: shortDescription,
    how_to_use: howToUse,
    howToUse: howToUse,
    is_featured: Boolean(isFeatured),
    isFeatured: Boolean(isFeatured),
    is_bestseller: Boolean(isBestSeller),
    isBestSeller: Boolean(isBestSeller),
    is_active: p.is_active !== false,
    images
  };
};

export const normalizeHeroSlide = (s, idx = 0) => {
  if (!s) return null;
  const buttonText = s.button_text || s.buttonText || s.primaryCTA?.text || 'Shop Collection';
  const buttonLink = s.button_link || s.buttonLink || s.primaryCTA?.link || '/shop';
  const secondaryText = s.secondary_button_text || s.secondaryButtonText || s.secondaryCTA?.text || 'Discover Tanush';
  const secondaryLink = s.secondary_button_link || s.secondaryButtonLink || s.secondaryCTA?.link || '/why-tanush';

  const heroType = s.hero_type || s.type || (s.page === 'home' || !s.page ? 'home' : 'inner_banner');
  const page = s.page || 'home';
  const assignedPages = Array.isArray(s.assigned_pages) 
    ? s.assigned_pages 
    : (s.assigned_pages ? [s.assigned_pages] : [page]);

  return {
    ...s,
    id: String(s.id || idx + 1),
    hero_type: heroType,
    type: heroType,
    page: page,
    assigned_pages: assignedPages,
    image: s.image || '/images/hero/hero-1.jpg',
    mobile_image: s.mobile_image || s.image || '',
    media_type: s.media_type || (s.video_url || s.video ? 'video' : 'image'),
    video_url: s.video_url || s.video || '',
    poster: s.poster || s.image || '',
    image_position: s.image_position || 'center',
    overlay: s.overlay || 'none',
    status: s.status || (s.is_active !== false ? 'published' : 'draft'),
    title: s.title || '',
    subtitle: s.subtitle || s.description || '',
    description: s.description || s.subtitle || '',
    badge: s.badge || '100% Pure',
    button_text: buttonText,
    buttonText: buttonText,
    button_link: buttonLink,
    buttonLink: buttonLink,
    secondary_button_text: secondaryText,
    secondary_button_link: secondaryLink,
    primaryCTA: buttonText ? { text: buttonText, link: buttonLink } : null,
    secondaryCTA: secondaryText ? { text: secondaryText, link: secondaryLink } : null,
    sort_order: Number(s.sort_order) || (idx + 1),
    is_active: s.is_active !== false && s.status !== 'draft' && s.status !== 'disabled'
  };
};

export const normalizeCategory = (c, idx = 0) => {
  if (!c) return null;
  return {
    ...c,
    id: String(c.id || c.slug),
    slug: c.slug || String(c.id),
    name: c.name || '',
    description: c.description || '',
    image: c.image || '/images/categories/all.jpg',
    sort_order: Number(c.sort_order) || (idx + 1),
    is_active: c.is_active !== false,
    is_featured: Boolean(c.is_featured)
  };
};

export const normalizeStory = (s, idx = 0) => {
  if (!s) return null;
  const videoUrl = s.video_url || s.videoUrl || s.video || s.media_url || s.mediaUrl || '';
  const mediaId = s.media_id || s.mediaId || '';
  const productId = s.product_id || s.productId || '';
  return {
    ...s,
    id: String(s.id || 's' + (idx + 1)),
    title: s.title || '',
    text: s.text || s.title || '',
    image: s.image || '',
    video_url: typeof videoUrl === 'string' ? videoUrl.trim() : '',
    media_id: mediaId,
    product_id: productId,
    likes_count: typeof s.likes_count === 'number' ? s.likes_count : 0,
    sort_order: Number(s.sort_order) || (idx + 1),
    is_active: s.is_active !== false
  };
};

// Dispatch real-time update event across windows and current document
const dispatchSyncEvent = (eventName, detail) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    window.dispatchEvent(new CustomEvent('cms_data_updated', { detail: { eventName, detail } }));
    if (syncChannel) {
      syncChannel.postMessage({ eventName, detail, timestamp: Date.now() });
    }
  }
};

// Listen to BroadcastChannel messages from other browser tabs / windows
if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { eventName, detail } = event.data || {};
    if (eventName && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
      window.dispatchEvent(new CustomEvent('cms_data_updated', { detail }));
    }
  };
}

// Apply dynamic favicon to document head across public website & admin panel
export const applyFavicon = (url, brandName, tagline) => {
  if (typeof document === 'undefined') return;
  const targetUrl = url || '/images/brand/tanush-logo.png';

  // 1. Update or create standard icon links
  const iconTypes = [
    { rel: 'icon', type: 'image/png' },
    { rel: 'shortcut icon', type: 'image/png' },
    { rel: 'apple-touch-icon', type: 'image/png' }
  ];

  iconTypes.forEach(({ rel, type }) => {
    let link = document.querySelector(`link[rel='${rel}']`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (type) link.type = type;
      document.head.appendChild(link);
    }
    link.href = targetUrl;
  });

  // 2. Synchronize any other icon links
  const allIconLinks = document.querySelectorAll("link[rel*='icon']");
  allIconLinks.forEach((l) => {
    l.href = targetUrl;
  });

  // 3. Remove "Untitled" from document title
  if (document.title === 'Untitled' || !document.title) {
    const titleText = brandName 
      ? `${brandName}${tagline ? ` — ${tagline}` : ''}`
      : 'Tanush Natural & Co. — Pure Botanical Formulations';
    document.title = titleText;
  }
};

// Logging helper
const logAction = async (action, entity, entity_id = '') => {
  const logItem = {
    id: 'log-' + Date.now(),
    action,
    entity,
    entity_id: String(entity_id),
    admin: 'admin2026',
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(`${DB_API_BASE}/audit_logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logItem)
    });
  } catch (e) {}

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('audit_logs').insert([logItem]);
    } catch (e) {}
  }
};

// Main API Export
export const api = {
  // --- Products ---
  getProducts: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const norm = data.map(normalizeProduct);
          saveClientStoredDB(db => ({ ...db, products: norm }));
          return norm;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const norm = data.map(normalizeProduct);
          saveClientStoredDB(db => ({ ...db, products: norm }));
          return norm;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.products) && localDB.products.length > 0) {
      return localDB.products.map(normalizeProduct);
    }

    const initial = (defaultProducts || []).map(normalizeProduct);
    saveClientStoredDB(db => ({ ...db, products: initial }));
    return initial;
  },

  getProductBySlug: async (slug) => {
    const products = await api.getProducts();
    return products.find(p => p.slug === slug || p.id === slug) || null;
  },

  saveProduct: async (productData) => {
    const p = { ...productData };
    if (!p.id) {
      p.id = 'p' + Date.now();
      p.created_at = new Date().toISOString();
    }
    p.updated_at = new Date().toISOString();
    const normalized = normalizeProduct(p);

    saveClientStoredDB(db => {
      const list = Array.isArray(db.products) ? [...db.products] : [];
      const idx = list.findIndex(item => String(item.id) === String(normalized.id));
      if (idx >= 0) list[idx] = normalized;
      else list.unshift(normalized);
      return { ...db, products: list };
    });

    try {
      await fetch(`${DB_API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').upsert(normalized);
      } catch (e) {}
    }

    logAction(`Updated product "${normalized.name}"`, 'Product', normalized.id);
    dispatchSyncEvent('products_updated', normalized);
    return normalized;
  },

  deleteProduct: async (id) => {
    saveClientStoredDB(db => {
      const list = Array.isArray(db.products) ? [...db.products] : [];
      return { ...db, products: list.filter(item => String(item.id) !== String(id)) };
    });

    try {
      await fetch(`${DB_API_BASE}/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {}
    }

    logAction(`Deleted product ID ${id}`, 'Product', id);
    dispatchSyncEvent('products_updated', { deletedId: id });
    return true;
  },

  // --- Categories ---
  getCategories: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const norm = data.map(normalizeCategory);
          saveClientStoredDB(db => ({ ...db, categories: norm }));
          return norm;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const norm = data.map(normalizeCategory);
          saveClientStoredDB(db => ({ ...db, categories: norm }));
          return norm;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.categories) && localDB.categories.length > 0) {
      return localDB.categories.map(normalizeCategory);
    }

    const initial = (defaultCategories || []).map(normalizeCategory);
    saveClientStoredDB(db => ({ ...db, categories: initial }));
    return initial;
  },

  saveCategory: async (categoryData) => {
    const c = { ...categoryData };
    if (!c.id) {
      c.id = (c.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      c.slug = c.id;
    }
    const normalized = normalizeCategory(c);

    saveClientStoredDB(db => {
      const list = Array.isArray(db.categories) ? [...db.categories] : [];
      const idx = list.findIndex(item => String(item.id) === String(normalized.id));
      if (idx >= 0) list[idx] = normalized;
      else list.push(normalized);
      return { ...db, categories: list };
    });

    try {
      await fetch(`${DB_API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').upsert(normalized);
      } catch (e) {}
    }

    logAction(`Saved category "${normalized.name}"`, 'Category', normalized.id);
    dispatchSyncEvent('categories_updated', normalized);
    return normalized;
  },

  deleteCategory: async (id) => {
    saveClientStoredDB(db => {
      const list = Array.isArray(db.categories) ? [...db.categories] : [];
      return { ...db, categories: list.filter(item => String(item.id) !== String(id)) };
    });

    try {
      await fetch(`${DB_API_BASE}/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (e) {}
    }

    logAction(`Deleted category ID ${id}`, 'Category', id);
    dispatchSyncEvent('categories_updated', { deletedId: id });
    return true;
  },

  // --- Homepage Sections ---
  getHomepageSections: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/homepage_sections`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveClientStoredDB(db => ({ ...db, homepageSections: data }));
          return data;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('homepage_sections').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          saveClientStoredDB(db => ({ ...db, homepageSections: data }));
          return data;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.homepageSections) && localDB.homepageSections.length > 0) {
      return localDB.homepageSections;
    }

    return [];
  },

  updateHomepageSections: async (sections) => {
    saveClientStoredDB(db => ({ ...db, homepageSections: sections }));

    try {
      await fetch(`${DB_API_BASE}/homepage_sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('homepage_sections').upsert(sections);
      } catch (e) {}
    }

    logAction('Updated homepage sections ordering', 'Homepage');
    dispatchSyncEvent('homepage_sections_updated', sections);
    return sections;
  },

  // --- Hero Slides ---
  getHeroSlides: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/hero`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const norm = data.map(normalizeHeroSlide);
          saveClientStoredDB(db => ({ ...db, heroSlides: norm }));
          return norm;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const norm = data.map(normalizeHeroSlide);
          saveClientStoredDB(db => ({ ...db, heroSlides: norm }));
          return norm;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.heroSlides) && localDB.heroSlides.length > 0) {
      return localDB.heroSlides.map(normalizeHeroSlide);
    }

    const initial = (defaultHeroSlides || []).map(normalizeHeroSlide);
    saveClientStoredDB(db => ({ ...db, heroSlides: initial }));
    return initial;
  },

  saveHeroSlide: async (slideData) => {
    const s = { ...slideData };
    if (!s.id) {
      s.id = 'hero-' + Date.now();
      s.created_at = new Date().toISOString();
    }
    s.updated_at = new Date().toISOString();
    const normalized = normalizeHeroSlide(s);

    saveClientStoredDB(db => {
      const list = Array.isArray(db.heroSlides) ? [...db.heroSlides] : [];
      const idx = list.findIndex(item => String(item.id) === String(normalized.id));
      if (idx >= 0) list[idx] = normalized;
      else list.unshift(normalized);
      return { ...db, heroSlides: list };
    });

    try {
      await fetch(`${DB_API_BASE}/hero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('hero_slides').upsert(normalized);
      } catch (e) {}
    }

    logAction(`Saved hero slide "${normalized.title || normalized.id}"`, 'Hero', normalized.id);
    dispatchSyncEvent('hero_slides_updated', normalized);
    return normalized;
  },

  deleteHeroSlide: async (id) => {
    saveClientStoredDB(db => {
      const list = Array.isArray(db.heroSlides) ? [...db.heroSlides] : [];
      return { ...db, heroSlides: list.filter(item => String(item.id) !== String(id)) };
    });

    try {
      await fetch(`${DB_API_BASE}/hero?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('hero_slides').delete().eq('id', id);
      } catch (e) {}
    }

    logAction(`Deleted hero slide ID ${id}`, 'Hero', id);
    dispatchSyncEvent('hero_slides_updated', { deletedId: id });
    return true;
  },

  // Get Hero configured for a specific page route with fallback hierarchy
  getPageHero: async (pageKey, categoryKey = null) => {
    const allHeroes = await api.getHeroSlides();
    const activeHeroes = allHeroes.filter(h => h.is_active !== false && h.status !== 'draft');

    // 1. Check specific Category Hero if categoryKey is provided (e.g. 'hair-care')
    if (categoryKey && categoryKey !== 'all') {
      const catHero = activeHeroes.find(h => 
        h.page === categoryKey || 
        h.assigned_pages?.includes(categoryKey)
      );
      if (catHero) return catHero;
    }

    // 2. Check Page-Specific Hero (e.g. 'shop', 'why-tanush', 'become-a-partner', 'contact')
    const pageHero = activeHeroes.find(h => 
      h.page === pageKey || 
      h.assigned_pages?.includes(pageKey)
    );
    if (pageHero) return pageHero;

    // 3. Check Shared Inner Page Hero (e.g. from shop / inner_banner / all_inner)
    const sharedInnerHero = activeHeroes.find(h => 
      h.hero_type === 'inner_banner' || 
      h.page === 'shop' ||
      h.page === 'all_inner' || 
      h.assigned_pages?.includes('all_inner') ||
      h.assigned_pages?.includes('shop')
    );
    if (sharedInnerHero) return sharedInnerHero;

    // 4. Default graceful fallback banner
    return {
      image: '/uploads/1787986263964-Hero_Slider_01.png',
      image_position: 'center',
      overlay: 'none',
      hero_type: 'inner_banner',
      page: pageKey
    };
  },

  // Get all active Hero Slides for inner page slider (connected across Shop, Why Tanush, Partner, Contact)
  getPageHeroSlides: async (pageKey, categoryKey = null) => {
    const allHeroes = await api.getHeroSlides();
    const activeHeroes = allHeroes.filter(h => h.is_active !== false && h.status !== 'draft');

    // 1. Check Category specific
    if (categoryKey && categoryKey !== 'all') {
      const catHeroes = activeHeroes.filter(h => 
        h.page === categoryKey || 
        h.assigned_pages?.includes(categoryKey)
      );
      if (catHeroes.length > 0) return catHeroes;
    }

    // 2. Check Page specific
    const pageHeroes = activeHeroes.filter(h => 
      h.page === pageKey || 
      h.assigned_pages?.includes(pageKey)
    );
    if (pageHeroes.length > 0) return pageHeroes;

    // 3. Fallback to all connected inner page banners (Shop, Why Tanush, Partner, Contact)
    const innerBanners = activeHeroes.filter(h => 
      h.hero_type === 'inner_banner' || 
      h.page === 'shop' || 
      h.page === 'all_inner' ||
      h.assigned_pages?.includes('shop') ||
      h.assigned_pages?.includes('all_inner')
    );
    if (innerBanners.length > 0) return innerBanners;

    const singleHero = await api.getPageHero(pageKey, categoryKey);
    return singleHero ? [singleHero] : [];
  },

  // --- Stories / Reels ---
  getStories: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/stories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const norm = data.map(normalizeStory);
          saveClientStoredDB(db => ({ ...db, stories: norm }));
          return norm;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('reels').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const norm = data.map(normalizeStory);
          saveClientStoredDB(db => ({ ...db, stories: norm }));
          return norm;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.stories) && localDB.stories.length > 0) {
      return localDB.stories.map(normalizeStory);
    }

    return [];
  },

  saveStory: async (storyData) => {
    const s = { ...storyData };
    if (!s.id) {
      s.id = 's' + Date.now();
    }
    const normalized = normalizeStory(s);

    saveClientStoredDB(db => {
      const list = Array.isArray(db.stories) ? [...db.stories] : [];
      const idx = list.findIndex(item => String(item.id) === String(normalized.id));
      if (idx >= 0) list[idx] = normalized;
      else list.push(normalized);
      return { ...db, stories: list };
    });

    try {
      await fetch(`${DB_API_BASE}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('reels').upsert(normalized);
      } catch (e) {}
    }

    logAction(`Saved reel "${normalized.title}"`, 'Reel', normalized.id);
    dispatchSyncEvent('stories_updated', normalized);
    return normalized;
  },

  deleteStory: async (id) => {
    saveClientStoredDB(db => {
      const list = Array.isArray(db.stories) ? [...db.stories] : [];
      return { ...db, stories: list.filter(item => String(item.id) !== String(id)) };
    });

    try {
      await fetch(`${DB_API_BASE}/stories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('reels').delete().eq('id', id);
      } catch (e) {}
    }

    logAction(`Deleted reel ID ${id}`, 'Reel', id);
    dispatchSyncEvent('stories_updated', { deletedId: id });
    return true;
  },

  // --- Reel Likes (Real-Time Atomic Likes) ---
  getClientId: () => {
    if (typeof window === 'undefined') return 'server_client';
    try {
      let cid = localStorage.getItem('tanush_client_id');
      if (!cid) {
        cid = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('tanush_client_id', cid);
      }
      return cid;
    } catch (e) {
      return 'client_fallback_' + Date.now();
    }
  },

  getReelLikes: async (reelId, clientId) => {
    const cid = clientId || api.getClientId();
    try {
      const res = await fetch(`${DB_API_BASE}/reels/likes?reel_id=${encodeURIComponent(reelId)}&client_id=${encodeURIComponent(cid)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return { reel_id: reelId, likes_count: 0, liked: false };
  },

  toggleReelLike: async (reelId, clientId) => {
    const cid = clientId || api.getClientId();
    try {
      const res = await fetch(`${DB_API_BASE}/reels/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reel_id: reelId, client_id: cid })
      });
      if (res.ok) {
        const result = await res.json();
        dispatchSyncEvent('reel_like_updated', result);
        return result;
      }
    } catch (e) {
      console.warn('Error toggling reel like:', e);
    }
    return null;
  },

  // --- Testimonials ---
  getTestimonials: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/testimonials`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveClientStoredDB(db => ({ ...db, testimonials: data }));
          return data;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          saveClientStoredDB(db => ({ ...db, testimonials: data }));
          return data;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.testimonials) && localDB.testimonials.length > 0) {
      return localDB.testimonials;
    }

    return [];
  },

  saveTestimonial: async (testimonialData) => {
    const t = { ...testimonialData };
    if (!t.id) t.id = 't' + Date.now();

    saveClientStoredDB(db => {
      const list = Array.isArray(db.testimonials) ? [...db.testimonials] : [];
      const idx = list.findIndex(item => String(item.id) === String(t.id));
      if (idx >= 0) list[idx] = t;
      else list.push(t);
      return { ...db, testimonials: list };
    });

    try {
      await fetch(`${DB_API_BASE}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('testimonials').upsert(t);
      } catch (e) {}
    }

    logAction(`Saved testimonial from "${t.name}"`, 'Testimonial', t.id);
    dispatchSyncEvent('testimonials_updated', t);
    return t;
  },

  deleteTestimonial: async (id) => {
    saveClientStoredDB(db => {
      const list = Array.isArray(db.testimonials) ? [...db.testimonials] : [];
      return { ...db, testimonials: list.filter(item => String(item.id) !== String(id)) };
    });

    try {
      await fetch(`${DB_API_BASE}/testimonials?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (e) {}
    }

    logAction(`Deleted testimonial ID ${id}`, 'Testimonial', id);
    dispatchSyncEvent('testimonials_updated', { deletedId: id });
    return true;
  },

  // --- Site Settings ---
  getSiteSettings: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          saveClientStoredDB(db => ({ ...db, settings: data }));
          return data;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
        if (!error && data) {
          saveClientStoredDB(db => ({ ...db, settings: data }));
          return data;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && localDB.settings) {
      return localDB.settings;
    }

    return null;
  },

  saveSiteSettings: async (settings) => {
    saveClientStoredDB(db => ({ ...db, settings }));

    try {
      await fetch(`${DB_API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('site_settings').upsert({ id: 1, ...settings });
      } catch (e) {}
    }

    if (settings.favicon_url || settings.logo_url) {
      applyFavicon(settings.favicon_url || settings.logo_url);
    }

    logAction('Updated site settings & brand identity', 'Settings');
    dispatchSyncEvent('site_settings_updated', settings);
    return settings;
  },

  // --- Social / Journey Section ---
  getSocialSection: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/social-section`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          saveClientStoredDB(db => ({ ...db, socialSection: data }));
          return data;
        }
      }
    } catch (e) {}

    const localDB = getClientStoredDB();
    if (localDB?.socialSection) {
      return localDB.socialSection;
    }

    const settings = await api.getSiteSettings();
    if (settings?.socialSection) {
      return settings.socialSection;
    }

    return null;
  },

  saveSocialSection: async (socialData) => {
    try {
      await fetch(`${DB_API_BASE}/social-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialData)
      });
    } catch (e) {}

    saveClientStoredDB(db => ({ ...db, socialSection: socialData }));
    const settings = (await api.getSiteSettings()) || {};
    settings.socialSection = socialData;
    await api.saveSiteSettings(settings);
    dispatchSyncEvent('social_section_updated', socialData);
    return socialData;
  },

  // --- Partnership Section (Website Sections CMS) ---
  getPartnershipSection: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/partnership-section`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          saveClientStoredDB(db => ({ ...db, partnershipSection: data }));
          return data;
        }
      }
    } catch (e) {}

    const localDB = getClientStoredDB();
    if (localDB && localDB.partnershipSection) {
      return localDB.partnershipSection;
    }

    const defaultSection = {
      id: 'partnership-section',
      section_label: '06 — PARTNERSHIPS',
      title: 'GROW WITH TANUSH',
      description: 'Bring Tanush Natural products to more homes across India. We are looking for retailers and distributors who share our vision.',
      button_text: 'BECOME A PARTNER →',
      button_link: '/become-a-partner',
      background_image: '/images/lifestyle/partner-forest-bg.jpg',
      background_media_id: '',
      overlay_opacity: 60,
      image_position: 'center',
      image_fit: 'cover',
      is_visible: true,
      updated_at: new Date().toISOString()
    };
    return defaultSection;
  },

  savePartnershipSection: async (partnershipData) => {
    const payload = {
      ...partnershipData,
      id: 'partnership-section',
      updated_at: new Date().toISOString()
    };

    saveClientStoredDB(db => ({ ...db, partnershipSection: payload }));

    try {
      await fetch(`${DB_API_BASE}/partnership-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Error saving partnership section to CMS API:', e);
    }

    logAction('Updated Partnership Section', 'Website Sections', 'partnership-section');
    dispatchSyncEvent('partnership_section_updated', payload);
    return payload;
  },

  // --- Botanical Illustration System CMS ---
  getIllustrationSettings: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/illustrations_settings`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          saveClientStoredDB(db => ({ ...db, illustrationSettings: data }));
          return data;
        }
      }
    } catch (e) {}

    const localDB = getClientStoredDB();
    if (localDB && localDB.illustrationSettings) {
      return localDB.illustrationSettings;
    }

    const defaultIllustrationSettings = {
      assignments: [
        {
          id: 'assign-1',
          page: 'Home',
          section: 'Why Tanush Section',
          illustrationId: 'neem-branch',
          position: 'top-right',
          opacity: 6,
          scale: 90,
          desktopVisible: true,
          mobileVisible: false,
          isActive: true
        },
        {
          id: 'assign-2',
          page: 'Home',
          section: 'Mosquito Protection Cards',
          illustrationId: 'botanical-shield',
          position: 'center-watermark',
          opacity: 10,
          scale: 100,
          desktopVisible: true,
          mobileVisible: true,
          isActive: true
        },
        {
          id: 'assign-3',
          page: 'WhyTanush',
          section: 'Our Story & Farm Section',
          illustrationId: 'farmer-in-field',
          position: 'bottom-right',
          opacity: 15,
          scale: 110,
          desktopVisible: true,
          mobileVisible: false,
          isActive: true
        },
        {
          id: 'assign-4',
          page: 'BecomePartner',
          section: 'Partnership Banner',
          illustrationId: 'harvest-basket',
          position: 'bottom-left',
          opacity: 12,
          scale: 100,
          desktopVisible: true,
          mobileVisible: false,
          isActive: true
        }
      ],
      updated_at: new Date().toISOString()
    };

    return defaultIllustrationSettings;
  },

  saveIllustrationSettings: async (settings) => {
    const payload = {
      ...settings,
      updated_at: new Date().toISOString()
    };

    saveClientStoredDB(db => ({ ...db, illustrationSettings: payload }));

    try {
      await fetch(`${DB_API_BASE}/illustrations_settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}

    logAction('Updated Botanical Illustration Settings', 'Illustrations');
    dispatchSyncEvent('illustration_settings_updated', payload);
    return payload;
  },

  // --- Page-Wise & Section-Wise Website Control System ---
  getPageConfig: async (pageId) => {
    try {
      const res = await fetch(`${DB_API_BASE}/pages_config`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && data[pageId]) {
          saveClientStoredDB(db => ({ ...db, pageConfigs: data }));
          return normalizePageConfig(pageId, data[pageId]);
        }
      }
    } catch (e) {}

    const localDB = getClientStoredDB();
    if (localDB?.pageConfigs && localDB.pageConfigs[pageId]) {
      return normalizePageConfig(pageId, localDB.pageConfigs[pageId]);
    }

    return normalizePageConfig(pageId, DEFAULT_PAGES_CONFIG[pageId]);
  },

  savePageConfig: async (pageId, config) => {
    const normalized = normalizePageConfig(pageId, config);
    const localDB = getClientStoredDB() || {};
    const existingConfigs = localDB.pageConfigs || { ...DEFAULT_PAGES_CONFIG };
    const updatedConfigs = {
      ...existingConfigs,
      [pageId]: normalized
    };

    saveClientStoredDB(db => ({ ...db, pageConfigs: updatedConfigs }));

    try {
      await fetch(`${DB_API_BASE}/pages_config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfigs)
      });
    } catch (e) {}

    logAction(`Updated ${normalized.name} Page Sections`, 'Pages & Content', pageId);
    dispatchSyncEvent('page_sections_updated', { pageId, config: normalized });
    return normalized;
  },

  getAllPageConfigs: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/pages_config`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          const merged = { ...DEFAULT_PAGES_CONFIG, ...data };
          saveClientStoredDB(db => ({ ...db, pageConfigs: merged }));
          return merged;
        }
      }
    } catch (e) {}

    const localDB = getClientStoredDB();
    if (localDB?.pageConfigs) {
      return { ...DEFAULT_PAGES_CONFIG, ...localDB.pageConfigs };
    }

    return DEFAULT_PAGES_CONFIG;
  },

  saveAllPageConfigs: async (configs) => {
    saveClientStoredDB(db => ({ ...db, pageConfigs: configs }));
    try {
      await fetch(`${DB_API_BASE}/pages_config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configs)
      });
    } catch (e) {}

    logAction('Updated Website Pages Configuration', 'Pages & Content');
    dispatchSyncEvent('page_sections_updated', { all: true, configs });
    return configs;
  },

  // --- Media Library ---
  getMedia: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/media`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveClientStoredDB(db => ({ ...db, media: data }));
          return data;
        }
      }
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          saveClientStoredDB(db => ({ ...db, media: data }));
          return data;
        }
      } catch (e) {}
    }

    const localDB = getClientStoredDB();
    if (localDB && Array.isArray(localDB.media) && localDB.media.length > 0) {
      return localDB.media;
    }

    return [];
  },

  addMedia: async (mediaItem) => {
    const m = {
      ...mediaItem,
      id: mediaItem.id || 'media-' + Date.now(),
      created_at: new Date().toISOString()
    };

    saveClientStoredDB(db => {
      const list = Array.isArray(db.media) ? [...db.media] : [];
      const idx = list.findIndex(item => String(item.id) === String(m.id));
      if (idx >= 0) list[idx] = m;
      else list.unshift(m);
      return { ...db, media: list };
    });

    try {
      await fetch(`${DB_API_BASE}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('media').upsert(m);
      } catch (e) {}
    }

    logAction(`Added media asset "${m.name}"`, 'Media', m.id);
    dispatchSyncEvent('media_updated', m);
    return m;
  },

  deleteMedia: async (id) => {
    saveClientStoredDB(db => {
      const list = Array.isArray(db.media) ? [...db.media] : [];
      return { ...db, media: list.filter(item => String(item.id) !== String(id)) };
    });

    try {
      await fetch(`${DB_API_BASE}/media?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('media').delete().eq('id', id);
      } catch (e) {}
    }

    logAction(`Deleted media asset ID ${id}`, 'Media', id);
    dispatchSyncEvent('media_updated', { deletedId: id });
    return true;
  },

  uploadMediaFile: async (file, category = 'General') => {
    try {
      // 1. Direct binary streaming upload (supports any file size with zero memory overhead)
      const res = await fetch(`${DB_API_BASE}/upload-binary`, {
        method: 'POST',
        headers: {
          'x-filename': encodeURIComponent(file.name),
          'x-mimetype': file.type || 'video/mp4',
          'x-category': encodeURIComponent(category)
        },
        body: file
      });

      if (res.ok) {
        const uploadResult = await res.json();
        const mediaItem = await api.addMedia({
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: uploadResult.url,
          category,
          size: uploadResult.size,
          mime_type: file.type || uploadResult.mimeType || 'video/mp4'
        });
        return mediaItem;
      }
    } catch (err) {
      console.warn('Direct binary upload attempt failed, falling back to JSON upload:', err);
    }

    // 2. Base64 JSON fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        try {
          const res = await fetch(`${DB_API_BASE}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              base64Data,
              mimeType: file.type
            })
          });

          if (res.ok) {
            const uploadResult = await res.json();
            const mediaItem = await api.addMedia({
              name: file.name.replace(/\.[^/.]+$/, ''),
              url: uploadResult.url,
              category,
              size: uploadResult.size,
              mime_type: file.type || uploadResult.mimeType
            });
            resolve(mediaItem);
            return;
          }
        } catch (err) {
          console.warn('Server upload error, fallback to data url:', err);
        }

        // Fallback
        const fallbackItem = await api.addMedia({
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: base64Data,
          category,
          size: `${Math.round(file.size / 1024)} KB`,
          mime_type: file.type
        });
        resolve(fallbackItem);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // --- Orders ---
  getOrders: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    const db = await loadLocalDB();
    return db?.orders || [];
  },

  saveOrder: async (order) => {
    const o = { 
      ...order, 
      id: order.id || 'ORD-' + Math.floor(1000 + Math.random() * 9000), 
      created_at: order.created_at || new Date().toISOString() 
    };
    try {
      await fetch(`${DB_API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(o)
      });
    } catch (e) {}

    // Auto-create Admin Notification for real completed orders
    await api.createNotification({
      type: 'order',
      title: '🛍 New Order',
      customer_name: o.customer_name || o.customerName || 'Customer',
      order_id: o.id,
      amount: o.total || o.amount || 0,
      product_name: o.items?.[0]?.name || 'Botanical Formulation',
      preview_text: `${o.customer_name || o.customerName || 'Customer'} ordered ${o.items?.[0]?.name || 'Botanical Formulation'} — ₹${o.total || o.amount || 0}`,
      target_route: '/admin/orders'
    });

    logAction(`Created order #${o.id}`, 'Order', o.id);
    return o;
  },

  // --- Customers ---
  getCustomers: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/customers`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    const db = await loadLocalDB();
    return db?.customers || [];
  },

  getCustomerById: async (id) => {
    const customers = await api.getCustomers();
    return customers.find(c => String(c.id) === String(id)) || null;
  },

  saveCustomer: async (customer) => {
    const c = { 
      ...customer, 
      id: customer.id || `cust-${Date.now()}`,
      created_at: customer.created_at || new Date().toISOString(),
      last_active: new Date().toISOString()
    };
    try {
      await fetch(`${DB_API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c)
      });
    } catch (e) {}
    logAction(`Updated customer ${c.name}`, 'Customer', c.id);
    return c;
  },

  // --- Messages / Inquiries ---
  getMessages: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    const db = await loadLocalDB();
    return db?.messages || [];
  },

  saveMessage: async (msg) => {
    const m = { 
      ...msg, 
      id: msg.id || `msg-${Date.now()}`,
      created_at: msg.created_at || new Date().toISOString()
    };
    try {
      await fetch(`${DB_API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
      });
    } catch (e) {}

    // Auto-create Admin Notification for customer messages
    await api.createNotification({
      type: 'message',
      title: '💬 New Customer Message',
      customer_name: m.customer_name || 'Customer',
      message_id: m.id,
      preview_text: m.message ? `${m.message.slice(0, 80)}${m.message.length > 80 ? '...' : ''}` : 'Sent a customer inquiry',
      target_route: '/admin/customers'
    });

    logAction(`Inquiry from ${m.customer_name || 'Visitor'}`, 'Message', m.id);
    return m;
  },

  // --- Admin Notifications ---
  getNotifications: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/notifications`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('tanush_admin_notifications');
        if (local) return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  },

  createNotification: async (notifData) => {
    const notifications = await api.getNotifications();
    
    // Duplicate notification protection
    if (notifData.order_id && notifications.some(n => String(n.order_id) === String(notifData.order_id))) {
      return notifications.find(n => String(n.order_id) === String(notifData.order_id));
    }
    if (notifData.review_id && notifications.some(n => String(n.review_id) === String(notifData.review_id))) {
      return notifications.find(n => String(n.review_id) === String(notifData.review_id));
    }
    if (notifData.message_id && notifications.some(n => String(n.message_id) === String(notifData.message_id))) {
      return notifications.find(n => String(n.message_id) === String(notifData.message_id));
    }

    const newNotif = {
      id: notifData.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: notifData.type || 'order',
      title: notifData.title || 'New Activity',
      customer_name: notifData.customer_name || 'Customer',
      product_name: notifData.product_name || '',
      product_id: notifData.product_id || '',
      order_id: notifData.order_id || '',
      review_id: notifData.review_id || '',
      message_id: notifData.message_id || '',
      amount: notifData.amount !== undefined ? notifData.amount : null,
      rating: notifData.rating || null,
      preview_text: notifData.preview_text || '',
      target_route: notifData.target_route || '/admin/dashboard',
      created_at: notifData.created_at || new Date().toISOString(),
      is_read: false,
      read_at: null
    };

    const updated = [newNotif, ...notifications];

    try {
      await fetch(`${DB_API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif)
      });
    } catch (e) {}

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tanush_admin_notifications', JSON.stringify(updated));
      } catch (e) {}
    }

    dispatchSyncEvent('notifications_updated', updated);
    return newNotif;
  },

  markNotificationRead: async (id) => {
    const notifications = await api.getNotifications();
    const updated = notifications.map(n => {
      if (String(n.id) === String(id)) {
        return { ...n, is_read: true, read_at: new Date().toISOString() };
      }
      return n;
    });

    try {
      await fetch(`${DB_API_BASE}/notifications/read?id=${encodeURIComponent(id)}`, {
        method: 'POST'
      });
    } catch (e) {}

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tanush_admin_notifications', JSON.stringify(updated));
      } catch (e) {}
    }

    dispatchSyncEvent('notifications_updated', updated);
    return updated;
  },

  markAllNotificationsRead: async () => {
    const notifications = await api.getNotifications();
    const updated = notifications.map(n => ({
      ...n,
      is_read: true,
      read_at: n.read_at || new Date().toISOString()
    }));

    try {
      await fetch(`${DB_API_BASE}/notifications/read_all`, {
        method: 'POST'
      });
    } catch (e) {}

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tanush_admin_notifications', JSON.stringify(updated));
      } catch (e) {}
    }

    dispatchSyncEvent('notifications_updated', updated);
    return updated;
  },

  saveReview: async (reviewData) => {
    const rev = {
      ...reviewData,
      id: reviewData.id || `rev-${Date.now()}`,
      created_at: reviewData.created_at || new Date().toISOString(),
      status: reviewData.status || 'Published'
    };
    try {
      await fetch(`${DB_API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rev)
      });
    } catch (e) {}

    // Auto-create notification for new product review
    await api.createNotification({
      type: 'review',
      title: '⭐ New Product Review',
      customer_name: rev.customer_name || 'Verified Buyer',
      product_name: rev.product_name || 'Botanical Formulation',
      product_id: rev.product_id || '',
      review_id: rev.id,
      rating: rev.rating || 5,
      preview_text: rev.text ? `"${rev.text.slice(0, 75)}${rev.text.length > 75 ? '...' : ''}"` : 'Submitted a product review',
      target_route: '/admin/products'
    });

    logAction(`New review for ${rev.product_name || 'Product'}`, 'Review', rev.id);
    return rev;
  },

  // --- Analytics Events ---
  getAnalyticsEvents: async (filter = {}) => {
    try {
      const res = await fetch(`${DB_API_BASE}/analytics_events`);
      if (res.ok) {
        let events = await res.json();
        if (Array.isArray(events)) {
          if (filter.type && filter.type !== 'all') {
            events = events.filter(e => e.type === filter.type);
          }
          if (filter.product_id) {
            events = events.filter(e => String(e.product_id) === String(filter.product_id));
          }
          if (filter.customer_id) {
            events = events.filter(e => String(e.customer_id) === String(filter.customer_id));
          }
          return events;
        }
      }
    } catch (e) {}
    const db = await loadLocalDB();
    return db?.analytics_events || [];
  },

  logAnalyticsEvent: async (event) => {
    const ev = {
      ...event,
      id: event.id || `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: event.timestamp || new Date().toISOString()
    };
    try {
      await fetch(`${DB_API_BASE}/analytics_events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ev)
      });
    } catch (e) {}
    return ev;
  },

  // --- Aggregated Analytics Engine ---
  getDashboardAnalytics: async (timeframe = '30d') => {
    const [products, categories, customers, orders, messages, events] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
      api.getCustomers(),
      api.getOrders(),
      api.getMessages(),
      api.getAnalyticsEvents()
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const viewsCount = events.filter(e => e.type === 'view').length;
    const previewsCount = events.filter(e => e.type === 'preview').length;
    const buyNowCount = events.filter(e => e.type === 'buy_now').length;
    const totalViewsAndPreviews = viewsCount + previewsCount;

    // Top Performing Products ranked by total engagement
    const productStats = products.map(prod => {
      const prodViews = events.filter(e => e.type === 'view' && String(e.product_id) === String(prod.id)).length;
      const prodPreviews = events.filter(e => e.type === 'preview' && String(e.product_id) === String(prod.id)).length;
      const prodBuyNow = events.filter(e => e.type === 'buy_now' && String(e.product_id) === String(prod.id)).length;
      const prodMessages = messages.filter(m => String(m.product_id) === String(prod.id)).length;
      
      let prodOrders = 0;
      let prodRevenue = 0;
      orders.forEach(o => {
        (o.items || []).forEach(item => {
          if (String(item.product_id) === String(prod.id)) {
            prodOrders += (Number(item.quantity) || 1);
            prodRevenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
          }
        });
      });

      const totalInteractions = prodViews + prodPreviews + prodMessages + prodBuyNow + prodOrders;
      const conversionRate = (prodViews + prodPreviews) > 0 
        ? ((prodOrders / (prodViews + prodPreviews)) * 100).toFixed(1) 
        : (prodOrders > 0 ? '100.0' : '0.0');

      return {
        ...prod,
        views: prodViews,
        previews: prodPreviews,
        buyNow: prodBuyNow,
        viewsAndPreviews: prodViews + prodPreviews,
        messages: prodMessages,
        orders: prodOrders,
        revenue: prodRevenue,
        conversionRate: `${conversionRate}%`,
        totalInteractions
      };
    }).sort((a, b) => b.totalInteractions - a.totalInteractions);

    // 7-day timeline series (Aug 21 - Aug 27)
    const days = ['Aug 21', 'Aug 22', 'Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27'];
    const dailySeries = days.map((day, idx) => {
      const dayEvents = events.filter(e => {
        if (!e.timestamp) return false;
        const d = new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return d === day;
      });
      const dayOrders = orders.filter(o => {
        if (!o.created_at) return false;
        const d = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return d === day;
      });
      const dayMessages = messages.filter(m => {
        if (!m.created_at) return false;
        const d = new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return d === day;
      });

      return {
        date: day,
        messages: dayMessages.length,
        orders: dayOrders.length,
        views: dayEvents.filter(e => e.type === 'view' || e.type === 'preview').length
      };
    });

    // Channel breakdown
    const channelStats = [
      { name: 'Website', count: viewsCount + buyNowCount, trend: '+0%' },
      { name: 'Instagram', count: 0, trend: '+0%' },
      { name: 'WhatsApp', count: buyNowCount + messages.length, trend: '+0%' },
      { name: 'Other Sources', count: 0, trend: '+0%' }
    ];

    // Yearly customer growth
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const yearlyGrowth = months.map(m => {
      const newCust = customers.filter(c => {
        if (!c.created_at) return false;
        return new Date(c.created_at).toLocaleDateString('en-US', { month: 'short' }) === m;
      }).length;
      return { month: m, newCustomers: newCust, returningCustomers: 0 };
    });

    return {
      kpis: {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalCustomers: customers.length,
        totalMessages: messages.length,
        totalViews: viewsCount,
        totalPreviews: previewsCount,
        buyNowClicks: buyNowCount,
        totalViewsAndPreviews,
        totalOrders: orders.length,
        totalRevenue
      },
      topProducts: productStats,
      dailySeries,
      channelStats,
      yearlyGrowth,
      recentEvents: events.slice(0, 10),
      customers,
      orders,
      messages
    };
  },


  // --- Audit Logs ---
  getAuditLogs: async () => {
    try {
      const res = await fetch(`${DB_API_BASE}/audit_logs`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return [];
  }
};

