import React, { useState, useEffect, useRef } from 'react';
import { CaretLeft, CaretRight, Leaf, Heart, ShieldCheck, CheckCircle, ArrowRight } from 'phosphor-react';
import Button from '../Button/Button';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './HeroSlider.css';

gsap.registerPlugin(useGSAP);

const AUTOPLAY_DURATION = 6000; // ms

const HeroSlider = ({ slides, variant = 'home' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [progressKey, setProgressKey] = useState(0); // re-triggers progress animation
  const container = useRef();
  const cursorLight = useRef();

  // Autoplay
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const interval = setInterval(() => {
      setPreviousSlide(currentSlide);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setProgressKey((k) => k + 1);
    }, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [isHovered, slides.length, currentSlide]);

  const nextSlide = () => {
    setPreviousSlide(currentSlide);
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    setProgressKey((k) => k + 1);
  };

  const prevSlide = () => {
    setPreviousSlide(currentSlide);
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    setProgressKey((k) => k + 1);
  };

  const goToSlide = (idx) => {
    if (idx === currentSlide) return;
    setPreviousSlide(currentSlide);
    setCurrentSlide(idx);
    setProgressKey((k) => k + 1);
  };

  // GSAP Slide Transitions
  useGSAP(() => {
    if (!container.current) return;
    const isFirstLoad = currentSlide === previousSlide;

    if (!isFirstLoad) {
      const oldSlide = container.current.querySelectorAll('.hero-slide')[previousSlide];
      if (oldSlide) {
        gsap.to(oldSlide, { opacity: 0, scale: 1.03, duration: 0.75, ease: 'power2.inOut' });
      }
    }

    const newSlide = container.current.querySelectorAll('.hero-slide')[currentSlide];
    if (newSlide) {
      gsap.fromTo(newSlide,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
      );

      // Staggered text reveal
      const textEls = newSlide.querySelectorAll('.hero-eyebrow-pill, .hero-title, .hero-subtitle, .hero-actions');
      gsap.fromTo(textEls,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out', delay: 0.15 }
      );
    }
  }, { dependencies: [currentSlide], scope: container });

  // Subtle mouse parallax on the bg image
  useGSAP(() => {
    const handleMouseMove = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const xPos = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to('.hero-bg-image', { x: xPos * 10, y: yPos * 6, duration: 2, ease: 'power2.out' });
      gsap.to('.hero-left-column', { x: xPos * -3, y: yPos * -2, duration: 1.8, ease: 'power2.out' });
      if (cursorLight.current) {
        gsap.to(cursorLight.current, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out', opacity: 0.12 });
      }
    };
    const handleMouseLeave = () => {
      gsap.to('.hero-bg-image, .hero-left-column', { x: 0, y: 0, duration: 1.5, ease: 'power2.out' });
      if (cursorLight.current) gsap.to(cursorLight.current, { opacity: 0, duration: 0.4 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: container });

  // Swipe handlers
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide();
    if (touchStart - touchEnd < -75) prevSlide();
  };

  const defaultFallbackSlide = {
    id: 'default-hero',
    image: '/uploads/1787815112494-ChatGPT_Image_Aug_27__2026_at_12_48_16_PM.png',
    mobile_image: '/images/hero/hero-1.jpg',
    title: 'Tanush Natural',
    subtitle: 'Pure Ayurvedic Herbal Formulation',
    badge: '100% Natural Product',
    button_text: 'Shop Collection',
    button_link: '/shop'
  };

  const displaySlides = (slides && slides.length > 0) ? slides : [defaultFallbackSlide];

  return (
    <div
      className={`hero-slider-container variant-${variant}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={container}
    >
      {/* Cursor glow */}
      <div className="cursor-light" ref={cursorLight} />

      {/* Slides — full bleed */}
      <div className="hero-slider">
        {displaySlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              className={`hero-slide ${isActive ? 'active' : ''}`}
            >
              {/* Full-bleed background image */}
              <div className="hero-bg-media">
                {slide.video || slide.video_url ? (
                  <video
                    src={slide.video || slide.video_url}
                    poster={slide.poster || slide.image}
                    autoPlay muted loop playsInline
                    className="hero-bg-image"
                  />
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.title || 'Tanush Natural'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="hero-bg-image"
                    style={{ objectPosition: slide.objectPosition || 'center' }}
                  />
                )}
              </div>

              {/* Dark gradient overlay for text legibility */}
              <div className="hero-bg-overlay" />

              {/* Content */}
              <div className="container hero-slide-inner">
                <div className="hero-left-column">
                  {/* Eyebrow */}
                  <div className="section-eyebrow on-dark">
                    <Leaf size={14} weight="light" className="section-eyebrow-icon" />
                    <span className="section-eyebrow-text">{slide.badge || 'NEW SEASON'}</span>
                  </div>

                  {/* Two-tone headline — first words white, last word in mint */}
                  <h1 className="section-title on-dark hero-title-override">
                    {(() => {
                      const words = (slide.title || '').split(' ');
                      if (words.length <= 1) return slide.title;
                      // Last word gets the accent color via <span>
                      const last = words.pop();
                      return <>{words.join(' ')} <span>{last}</span></>;
                    })()}
                  </h1>

                  {/* Accent dash */}
                  <div className="section-accent-line on-dark" />

                  {/* Caption / subtitle */}
                  {(slide.description || slide.subtitle) && (
                    <p className="section-caption on-dark hero-caption-override">
                      {slide.description || slide.subtitle}
                    </p>
                  )}

                  {/* CTAs */}
                  <div className="hero-actions">
                    {(slide.primaryCTA?.text || slide.button_text || slide.buttonText) && (
                      <Button
                        variant="primary"
                        to={slide.primaryCTA?.link || slide.button_link || slide.buttonLink || '/shop'}
                        size="large"
                        className="hero-cta-primary"
                      >
                        <span>{slide.primaryCTA?.text || slide.button_text || slide.buttonText || 'Explore Products'}</span>
                        <ArrowRight size={16} weight="bold" className="cta-arrow-icon" />
                      </Button>
                    )}

                    {(slide.secondaryCTA?.text || slide.secondary_button_text || slide.secondaryButtonText) && (
                      <Button
                        variant="secondary"
                        to={slide.secondaryCTA?.link || slide.secondary_button_link || slide.secondaryButtonLink || '/why-tanush'}
                        size="large"
                        className="hero-cta-secondary"
                      >
                        <span>{slide.secondaryCTA?.text || slide.secondary_button_text || slide.secondaryButtonText || 'Discover Tanush'}</span>
                        <ArrowRight size={16} weight="bold" className="cta-arrow-icon" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Arrows */}
      {slides.length > 1 && variant === 'home' && (
        <>
          <button className="slider-nav-arrow prev" onClick={prevSlide} aria-label="Previous slide">
            <CaretLeft size={20} weight="bold" />
          </button>
          <button className="slider-nav-arrow next" onClick={nextSlide} aria-label="Next slide">
            <CaretRight size={20} weight="bold" />
          </button>
        </>
      )}

      {/* Progress Line Bar — replaces dots */}
      {slides.length > 1 && variant === 'home' && (
        <div className="hero-progress-bar-container">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-progress-segment ${idx === currentSlide ? 'active' : idx < currentSlide ? 'done' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className="hero-progress-fill"
                key={`${idx}-${progressKey}`}
              />
            </button>
          ))}
        </div>
      )}
      {/* ── Trust Bar — liquid glass, floats at bottom of hero ── */}
      {variant === 'home' && (
        <div className="hero-trust-bar">
          <div className="hero-trust-inner">
            <div className="hero-trust-item">
              <Leaf size={20} weight="light" className="hero-trust-icon" />
              <div className="hero-trust-text">
                <h4>100% NATURAL</h4>
                <p>Thoughtfully selected ingredients</p>
              </div>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <Heart size={20} weight="light" className="hero-trust-icon" />
              <div className="hero-trust-text">
                <h4>MADE WITH CARE</h4>
                <p>Created for everyday wellness</p>
              </div>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <ShieldCheck size={20} weight="light" className="hero-trust-icon" />
              <div className="hero-trust-text">
                <h4>QUALITY FIRST</h4>
                <p>Crafted with attention to detail</p>
              </div>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <CheckCircle size={20} weight="light" className="hero-trust-icon" />
              <div className="hero-trust-text">
                <h4>MADE IN INDIA</h4>
                <p>Proudly created for Indian homes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {slides.length > 1 && variant !== 'home' && (
        <div className="container hero-navigation-container">
          <div className="hero-navigation glass-control">
            <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
              <CaretLeft size={20} weight="bold" />
            </button>
            <div className="slider-progress-text">
              <span className="progress-current">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="progress-separator"> / </span>
              <span className="progress-total">{String(slides.length).padStart(2, '0')}</span>
            </div>
            <div className="slider-progress-bar-thin">
              <div className="progress-bar-fill-thin" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
            </div>
            <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
