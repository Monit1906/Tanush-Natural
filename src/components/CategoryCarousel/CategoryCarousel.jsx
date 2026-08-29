import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, CaretRight, ArrowRight, Leaf, Drop, Sparkle, Heart, FlowerLotus, ShieldCheck } from 'phosphor-react';
import './CategoryCarousel.css';

// Helper to assign a fitting botanical icon per category if not provided by CMS
const getCategoryIcon = (category) => {
  const name = (category?.name || category?.slug || '').toLowerCase();
  if (name.includes('hair') || name.includes('oil') || name.includes('liquid')) {
    return <Drop size={22} weight="light" />;
  }
  if (name.includes('skin') || name.includes('face') || name.includes('glow') || name.includes('care')) {
    return <Sparkle size={22} weight="light" />;
  }
  if (name.includes('well') || name.includes('health') || name.includes('immunity') || name.includes('elixir')) {
    return <FlowerLotus size={22} weight="light" />;
  }
  if (name.includes('mosquito') || name.includes('protect') || name.includes('safe')) {
    return <ShieldCheck size={22} weight="light" />;
  }
  return <Leaf size={22} weight="light" />;
};

// Subtle background tints for cards based on category type
const getCategoryCardStyle = (category, index) => {
  const name = (category?.name || '').toLowerCase();
  if (name.includes('hair')) return { badgeBg: '#EBF4EC', badgeColor: '#2F6B43', accentColor: '#E6EFE7' };
  if (name.includes('skin')) return { badgeBg: '#FCF3E4', badgeColor: '#8C673B', accentColor: '#FAF4E8' };
  if (name.includes('well')) return { badgeBg: '#F7EBEB', badgeColor: '#823F45', accentColor: '#F8EEED' };
  if (name.includes('home')) return { badgeBg: '#E9F1F0', badgeColor: '#2D5B57', accentColor: '#E8F1EF' };
  
  // Default subtle cycling palette
  const palettes = [
    { badgeBg: '#EBF4EC', badgeColor: '#2F6B43', accentColor: '#FAF8F5' },
    { badgeBg: '#FCF3E4', badgeColor: '#8C673B', accentColor: '#FAF8F5' },
    { badgeBg: '#F7EBEB', badgeColor: '#823F45', accentColor: '#FAF8F5' }
  ];
  return palettes[index % palettes.length];
};

const CategoryCard = ({ category, index }) => {
  const [imgSrc, setImgSrc] = useState(category.image || '/images/categories/personal-care.jpg');
  const [imgError, setImgError] = useState(false);
  const cardStyle = getCategoryCardStyle(category, index);

  const fallbackImage = '/images/categories/personal-care.jpg';

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(fallbackImage);
    }
  };

  const categoryLink = `/shop?category=${encodeURIComponent(category.slug || category.id || '')}`;

  return (
    <div className="premium-category-card">
      <Link to={categoryLink} className="category-card-inner">
        {/* Top Image Stage */}
        <div className="category-card-media">
          <img
            src={imgSrc}
            alt={category.name || 'Category'}
            loading="lazy"
            onError={handleImageError}
            className="category-card-img"
          />
        </div>

        {/* Floating Overlapping Icon Badge */}
        <div 
          className="category-card-icon-badge" 
          style={{ background: cardStyle.badgeBg, color: cardStyle.badgeColor }}
          aria-hidden="true"
        >
          {getCategoryIcon(category)}
        </div>

        {/* Bottom Information Content */}
        <div className="category-card-body">
          <h3 className="category-card-title">{category.name}</h3>
          
          <p className="category-card-desc">
            {category.description || 'Thoughtfully crafted natural formulations for everyday wellness.'}
          </p>

          <div className="category-card-action">
            <span className="category-explore-btn">
              Explore <ArrowRight size={15} weight="bold" className="explore-arrow" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CategoryCarousel = ({ categories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef(null);

  // Responsive items count
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 640) {
        setVisibleCount(1);
      } else if (window.innerWidth <= 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const activeCategories = categories.filter(c => c.is_active !== false);
  const totalItems = activeCategories.length;

  if (totalItems === 0) {
    return (
      <div className="category-empty-state">
        <p>No categories available right now.</p>
      </div>
    );
  }

  const maxIndex = Math.max(0, totalItems - visibleCount);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    const target = Math.min(index, maxIndex);
    setCurrentIndex(target);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };

  // Calculate pages for dots
  const totalPages = Math.max(1, maxIndex + 1);

  return (
    <div 
      className="category-carousel-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrow Left */}
      {totalItems > visibleCount && (
        <button
          className="category-nav-btn prev"
          onClick={handlePrev}
          aria-label="Previous categories"
        >
          <CaretLeft size={18} weight="bold" />
        </button>
      )}

      {/* Cards Viewport Window */}
      <div className="category-track-viewport">
        <div 
          className="category-cards-track"
          style={{
            transform: `translateX(-${(currentIndex * (100 / visibleCount))}%)`
          }}
        >
          {activeCategories.map((cat, idx) => (
            <div 
              key={cat.id || cat.slug || idx} 
              className="category-track-slide"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <CategoryCard category={cat} index={idx} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrow Right */}
      {totalItems > visibleCount && (
        <button
          className="category-nav-btn next"
          onClick={handleNext}
          aria-label="Next categories"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      )}

      {/* Pagination Dots Below */}
      {totalPages > 1 && (
        <div className="category-pagination-dots" role="tablist">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`category-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to category slide ${idx + 1}`}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;
