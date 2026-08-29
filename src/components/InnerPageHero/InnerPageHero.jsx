import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../lib/db';
import './InnerPageHero.css';

const InnerPageHero = ({ page = 'shop', activeCategory = null, hero: customHero = null, className = '' }) => {
  const [slides, setSlides] = useState(customHero ? [customHero] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!customHero);
  const [imageErrorMap, setImageErrorMap] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (customHero) {
      setSlides([customHero]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchHeroSlides = async () => {
      try {
        const data = await api.getPageHeroSlides(page, activeCategory);
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          } else {
            const fallback = await api.getPageHero(page, activeCategory);
            setSlides(fallback ? [fallback] : []);
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn('Error fetching inner page hero slides:', err);
      }
    };

    fetchHeroSlides();

    const handleSync = () => {
      fetchHeroSlides();
    };

    window.addEventListener('hero_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('hero_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, [page, activeCategory, customHero]);

  // Auto-advance slider if more than 1 slide exists
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused, currentIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const fallbackImage = '/uploads/1787986263964-Hero_Slider_01.png';
  const currentSlide = slides[currentIndex] || slides[0] || {};
  const displayImage = imageErrorMap[currentIndex] ? fallbackImage : (currentSlide?.image || fallbackImage);
  const mobileImage = currentSlide?.mobile_image;
  const isVideo = currentSlide?.media_type === 'video' && Boolean(currentSlide?.video_url);
  const objectPosition = currentSlide?.image_position || 'center';
  const overlay = currentSlide?.overlay || 'none';

  return (
    <div 
      className={`inner-page-hero-container ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="inner-page-hero-banner">
        {/* Subtle optional overlay */}
        {overlay === 'subtle' && <div className="inner-hero-subtle-overlay" aria-hidden="true" />}

        {/* Media rendering - strictly visual 1920x600 layout */}
        {isVideo ? (
          <video
            key={`video-${currentIndex}`}
            src={currentSlide.video_url}
            poster={currentSlide.poster || displayImage}
            autoPlay
            muted
            loop
            playsInline
            className="inner-hero-media"
            style={{ objectPosition }}
          />
        ) : (
          <picture key={`pic-${currentIndex}`} className="inner-hero-picture">
            {mobileImage && (
              <source media="(max-width: 768px)" srcSet={mobileImage} />
            )}
            <img
              src={displayImage}
              alt={currentSlide.title || 'Tanush Natural'}
              loading="eager"
              onError={() => setImageErrorMap(prev => ({ ...prev, [currentIndex]: true }))}
              className="inner-hero-media"
              style={{ objectPosition }}
            />
          </picture>
        )}

        {/* Multi-Slide Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button 
              className="inner-hero-nav-arrow inner-hero-nav-prev" 
              onClick={handlePrev} 
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button 
              className="inner-hero-nav-arrow inner-hero-nav-next" 
              onClick={handleNext} 
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>

            {/* Pagination Dots */}
            <div className="inner-hero-dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`inner-hero-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InnerPageHero;
