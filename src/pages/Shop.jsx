import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SquaresFour, List, ArrowCounterClockwise } from 'phosphor-react';
import ProductCard from '../components/ProductCard/ProductCard';
import Button from '../components/Button/Button';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { ShopSkeleton } from '../components/Skeletons/Skeleton';
import { 
  SectionIllustrationSlot, 
  CategoryBotanicalBadge, 
  BotanicalWatermark 
} from '../components/Illustrations/BotanicalIllustrations';
import { api } from '../lib/db';
import ShopJourney from '../components/ShopJourney/ShopJourney';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageConfig, setPageConfig] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [prods, cats, conf, settings] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getPageConfig('shop'),
        api.getSiteSettings()
      ]);
      setProducts(prods.filter(p => p.is_active !== false));
      setCategories(cats.filter(c => c.is_active !== false));
      if (conf) setPageConfig(conf);
      if (settings) setSiteSettings(settings);
    } catch (e) {
      console.warn('Failed loading shop data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleSync = () => fetchData();
    window.addEventListener('products_updated', handleSync);
    window.addEventListener('categories_updated', handleSync);
    window.addEventListener('page_sections_updated', handleSync);
    window.addEventListener('site_settings_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('products_updated', handleSync);
      window.removeEventListener('categories_updated', handleSync);
      window.removeEventListener('page_sections_updated', handleSync);
      window.removeEventListener('site_settings_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, []);

  // Update category when URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  if (loading) return <ShopSkeleton />;

  const sections = pageConfig?.sections || [];
  const getSection = (id) => sections.find(s => s.id === id);
  const isSectionActive = (id) => {
    const sec = getSection(id);
    return sec ? sec.isActive !== false : true;
  };

  const heroSec = getSection('hero');
  const journeySec = getSection('journey');
  const promoSec = getSection('promotional');

  // Handle Category Filter
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchParams(categoryId === 'all' ? {} : { category: categoryId });
  };

  // Filter products
  let filteredProducts = products;
  if (activeCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  // Sort products
  let sortedProducts = [...filteredProducts];
  if (sortBy === 'featured') sortedProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  if (sortBy === 'best-selling') sortedProducts.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  if (sortBy === 'price-low-high') sortedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high-low') sortedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === 'newest') sortedProducts.sort((a, b) => b.id.localeCompare(a.id));

  const activeCategoryObj = categories.find(c => c.id === activeCategory);

  return (
    <div className="shop-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Section Slot */}
      <SectionIllustrationSlot 
        page="Shop" 
        section="Main" 
        defaultIllustration={activeCategory.includes('mosquito') ? 'botanical-shield' : 'neem-branch'} 
        defaultPosition="top-right" 
        defaultOpacity={5} 
      />

      {/* Shop Hero - Wide Banner */}
      {isSectionActive('hero') && (
        <InnerPageHero 
          page="shop" 
          activeCategory={activeCategory}
          title={heroSec?.content?.heading}
          subtitle={heroSec?.content?.subheading}
        />
      )}

      {/* Categories Bar with Square Frames */}
      {isSectionActive('category_bar') && (
        <section className="shop-categories-bar container">
          <h2 className="visually-hidden">Shop by Category</h2>
          <div className="categories-scroll">
            {siteSettings?.all_products_tile?.is_active !== false && (
              <div 
                className={`cat-square-frame cat-circle ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick('all')}
              >
                <div className="cat-img all-products-img">
                  <img 
                    src={siteSettings?.all_products_tile?.image || '/images/categories/all.jpg'} 
                    alt={siteSettings?.all_products_tile?.title || 'All Products'}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/images/categories/all.jpg'; }}
                  />
                </div>
                <span>{siteSettings?.all_products_tile?.title || 'All Products'}</span>
              </div>
            )}

            {categories.map(cat => (
              <div 
                key={cat.id}
                className={`cat-square-frame cat-circle ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
              >
                <div className="cat-img">
                  <img 
                    src={cat.image || '/images/categories/all.jpg'} 
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/images/categories/all.jpg'; }}
                  />
                </div>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Shop Section */}
      {isSectionActive('product_grid') && (
        <section className="shop-main container">
          {/* Active Category Botanical Context Indicator */}
          <CategoryBotanicalBadge category={activeCategory} />

          {/* Controls Bar: Results Count + Sort + Layout Mode */}
          <div className="shop-controls-bar">
            <div className="shop-controls-left">
              <span className="results-count">
                Showing <strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? 'product' : 'products'}
                {activeCategory !== 'all' && activeCategoryObj ? ` in ${activeCategoryObj.name}` : ''}
              </span>
            </div>

            <div className="shop-controls-right">
              {/* Sort Dropdown */}
              <div className="sort-control">
                <label htmlFor="shop-sort" className="visually-hidden">Sort products</label>
                <select 
                  id="shop-sort"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="best-selling">Sort: Best Selling</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Sort: Newest First</option>
                </select>
              </div>

              {/* View Mode Switcher (Grid vs List) */}
              <div className="view-mode-toggle" role="group" aria-label="Product view mode">
                <button 
                  type="button"
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <SquaresFour size={19} weight={viewMode === 'grid' ? 'fill' : 'regular'} />
                </button>

                <button 
                  type="button"
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List View"
                >
                  <List size={19} weight={viewMode === 'list' ? 'bold' : 'regular'} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Listing Area */}
          <div className="shop-products-wrapper">
            {sortedProducts.length === 0 ? (
              <div className="no-results">
                <h3>No products found</h3>
                <p>No products match your current category selection.</p>
                <Button variant="primary" onClick={() => handleCategoryClick('all')}>Show All Products</Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'products-grid' : 'products-list-layout'}>
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* From Nature to Your Home — Premium Storytelling Journey */}
      {isSectionActive('journey') && (
        <ShopJourney config={journeySec} />
      )}

      {/* Promotional Botanical Quality Strip */}
      {isSectionActive('promotional') && promoSec?.content?.heading && (
        <section className="shop-promo-strip container text-center" style={{ margin: '40px auto 20px', padding: '30px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
          {promoSec.content.badge && <span className="subtitle">{promoSec.content.badge}</span>}
          <h3 style={{ fontSize: '1.4rem', color: '#173B2F', margin: '6px 0 10px' }}>{promoSec.content.heading}</h3>
          <p style={{ maxWidth: '650px', margin: '0 auto 16px', color: '#556B5C', fontSize: '0.9rem' }}>{promoSec.content.subheading}</p>
          {promoSec.content.primaryCtaText && (
            <Button variant="secondary" to={promoSec.content.primaryCtaLink || "/why-tanush"}>
              {promoSec.content.primaryCtaText}
            </Button>
          )}
        </section>
      )}
    </div>
  );
};

export default Shop;
