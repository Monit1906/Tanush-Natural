-- =========================================================
-- TANUSH NATURAL — PRODUCTION SUPABASE DATABASE SCHEMA
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name text DEFAULT 'Tanush Natural & Co.',
  tagline text DEFAULT 'Rooted in Nature, Made for Everyday Living',
  logo_url text DEFAULT '/images/brand/tanush-logo.png',
  logo_media_id text DEFAULT 'brand-logo-main',
  logo_alt text DEFAULT 'Tanush Natural & Co.',
  favicon_url text DEFAULT '/images/brand/tanush-logo.png',
  use_primary_favicon boolean DEFAULT true,
  currency text DEFAULT '₹',
  phone text DEFAULT '+91 98765 43210',
  email text DEFAULT 'info@tanushnatural.com',
  whatsapp text DEFAULT '+919876543210',
  address text DEFAULT 'Ahmedabad, Gujarat, India',
  instagram text DEFAULT 'https://instagram.com/TanushNatural',
  facebook text DEFAULT 'https://facebook.com/TanushNatural',
  youtube text DEFAULT 'https://youtube.com/TanushNatural',
  seo_title text DEFAULT 'Tanush Natural — 100% Pure & Organic Living',
  seo_description text DEFAULT 'Discover thoughtful natural formulations crafted for Indian households.',
  announcement_text text DEFAULT 'Free shipping on orders above ₹499',
  announcement_link text DEFAULT '/shop',
  announcement_enabled boolean DEFAULT true,
  nav_links jsonb DEFAULT '[{"id":"1","title":"Home","path":"/","is_active":true},{"id":"2","title":"Shop","path":"/shop","is_active":true},{"id":"3","title":"Why Tanush","path":"/why-tanush","is_active":true},{"id":"4","title":"Become a Partner","path":"/become-a-partner","is_active":true},{"id":"5","title":"Contact Us","path":"/contact","is_active":true}]'::jsonb,
  page_content jsonb DEFAULT '{}'::jsonb,
  social_section jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Homepage Sections (Order & Visibility)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id text PRIMARY KEY,
  title text NOT NULL,
  is_visible boolean DEFAULT true,
  sort_order integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id text PRIMARY KEY,
  image text NOT NULL,
  mobile_image text,
  title text NOT NULL,
  subtitle text,
  badge text DEFAULT '100% Pure',
  button_text text DEFAULT 'Shop Collection',
  button_link text DEFAULT '/shop',
  secondary_button_text text DEFAULT 'Discover Tanush',
  secondary_button_link text DEFAULT '/why-tanush',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Categories
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  image text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  sku text,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  rating numeric(3,1) DEFAULT 4.8,
  review_count integer DEFAULT 24,
  stock integer DEFAULT 50,
  stock_status text DEFAULT 'In Stock',
  short_description text,
  description text,
  benefits jsonb DEFAULT '[]'::jsonb,
  ingredients text,
  how_to_use text,
  caution text,
  images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_active boolean DEFAULT true,
  tags jsonb DEFAULT '["natural", "wellness"]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Stories & Reels
CREATE TABLE IF NOT EXISTS reels (
  id text PRIMARY KEY,
  title text NOT NULL,
  text text,
  image text NOT NULL,
  video_url text,
  product_id text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text DEFAULT 'Verified Customer',
  text text NOT NULL,
  rating integer DEFAULT 5,
  photo_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Orders
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer text NOT NULL,
  email text NOT NULL,
  phone text,
  total numeric(10,2) NOT NULL,
  status text DEFAULT 'Processing',
  items_count integer DEFAULT 1,
  date timestamptz DEFAULT now()
);

-- 9. Media Library
CREATE TABLE IF NOT EXISTS media (
  id text PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  category text DEFAULT 'General',
  size text,
  is_global_logo boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  admin text DEFAULT 'admin2026',
  timestamp timestamptz DEFAULT now()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read and write for the client application
DROP POLICY IF EXISTS "Public access site_settings" ON site_settings;
CREATE POLICY "Public access site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access homepage_sections" ON homepage_sections;
CREATE POLICY "Public access homepage_sections" ON homepage_sections FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access hero_slides" ON hero_slides;
CREATE POLICY "Public access hero_slides" ON hero_slides FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access categories" ON categories;
CREATE POLICY "Public access categories" ON categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access products" ON products;
CREATE POLICY "Public access products" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access reels" ON reels;
CREATE POLICY "Public access reels" ON reels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access testimonials" ON testimonials;
CREATE POLICY "Public access testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access orders" ON orders;
CREATE POLICY "Public access orders" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access media" ON media;
CREATE POLICY "Public access media" ON media FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access audit_logs" ON audit_logs;
CREATE POLICY "Public access audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket setup (Run in Supabase SQL editor):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tanush-media', 'tanush-media', true) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Public Storage Access" ON storage.objects FOR ALL USING (bucket_id = 'tanush-media') WITH CHECK (bucket_id = 'tanush-media');
