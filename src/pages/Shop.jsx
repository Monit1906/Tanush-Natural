import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SquaresFour, List, ArrowCounterClockwise } from 'phosphor-react';
import ProductCard from '../components/ProductCard/ProductCard';
import Button from '../components/Button/Button';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { ShopSkeleton } from '../components/Skeletons/Skeleton';
import { api } from '../lib/db';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const prods = await api.getProducts();
    const cats = await api.getCategories();
    setProducts(prods.filter(p => p.is_active !== false));
    setCategories(cats.filter(c => c.is_active !== false));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const handleSync = () => fetchData();
    window.addEventListener('products_updated', handleSync);
    window.addEventListener('categories_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('products_updated', handleSync);
      window.removeEventListener('categories_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, []);

  // Update category when URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  if (loading) return <ShopSkeleton />;

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
    <div className="shop-page">
      {/* Shop Hero - Wide Banner */}
      <InnerPageHero page="shop" activeCategory={activeCategory} />

      {/* Categories Bar with Square Frames */}
      <section className="shop-categories-bar container">
        <h2 className="visually-hidden">Shop by Category</h2>
        <div className="categories-scroll">
          <div 
            className={`cat-square-frame cat-circle ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            <div className="cat-img all-products-img">
              <img src="/images/categories/more.jpg" alt="All Products" />
            </div>
            <span>All Products</span>
          </div>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className={`cat-square-frame cat-circle ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div className="cat-img">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = "/images/categories/personal-care.jpg"; }}
                />
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Full-Width Shop Content (No Sidebar Filter Column) */}
      <section className="shop-main container">
        {/* Controls Bar: Results, Active Filter Tag, Sort Dropdown & View Mode Switcher */}
        <div className="shop-controls-bar">
          <div className="shop-controls-left">
            <span className="results-count">Showing {sortedProducts.length} results</span>
            {activeCategory !== 'all' && (
              <div className="active-category-pill">
                <span>Filter: {activeCategoryObj?.name || activeCategory}</span>
                <button 
                  type="button" 
                  onClick={() => handleCategoryClick('all')} 
                  title="Clear Category Filter"
                  aria-label="Clear Filter"
                >
                  <ArrowCounterClockwise size={13} />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>

          <div className="shop-controls-right">
            {/* Sort Control */}
            <div className="sort-control">
              <label htmlFor="shop-sort-select">Sort by:</label>
              <select 
                id="shop-sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
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
    </div>
  );
};

export default Shop;
