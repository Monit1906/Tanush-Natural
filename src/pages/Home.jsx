import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, CheckCircle, Heart, CaretLeft, CaretRight, Star } from 'phosphor-react';
import Button from '../components/Button/Button';
import AnimatedSectionHeading from '../components/AnimatedSectionHeading/AnimatedSectionHeading';
import DepthCarousel from '../components/DepthCarousel/DepthCarousel';
import CategoryCarousel from '../components/CategoryCarousel/CategoryCarousel';
import DriftWall from '../components/DriftWall/DriftWall';
import ReelsSection from '../components/ReelsSection/ReelsSection';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import { HomeSkeleton } from '../components/Skeletons/Skeleton';
import { FarmToHomeJourney, BotanicalWatermark, SectionIllustrationSlot } from '../components/Illustrations/BotanicalIllustrations';
import { api } from '../lib/db';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Home.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RevealSection = ({ children, className = '', delay = '' }) => {
  const revealRef = useScrollReveal();
  return (
    <div ref={revealRef} className={`reveal-up ${delay} ${className}`}>
      {children}
    </div>
  );
};

const Home = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    heroSlides: [],
    sections: [],
    stories: [],
    testimonials: [],
    socialSection: null
  });
  const [loading, setLoading] = useState(true);
  const mainRef = useRef();

  const loadData = async () => {
    const [prods, cats, slides, sects, storiesData, testimonialsData, socialData, partnershipData, pageConf] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
      api.getHeroSlides(),
      api.getHomepageSections(),
      api.getStories(),
      api.getTestimonials(),
      api.getSocialSection(),
      api.getPartnershipSection(),
      api.getPageConfig('home')
    ]);
    setData({
      products: prods.filter(p => p.is_active !== false),
      categories: cats.filter(c => c.is_active !== false),
      heroSlides: slides.filter(s => s.is_active !== false),
      sections: sects,
      stories: storiesData.filter(s => s.is_active !== false),
      testimonials: testimonialsData.filter(t => t.is_active !== false),
      socialSection: socialData,
      partnershipSection: partnershipData,
      pageConfig: pageConf
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleSync = () => {
      loadData();
    };

    const handleSocialUpdate = (e) => {
      if (e.detail) {
        setData(prev => ({ ...prev, socialSection: e.detail }));
      }
    };

    const handlePartnershipUpdate = (e) => {
      if (e.detail) {
        setData(prev => ({ ...prev, partnershipSection: e.detail }));
      }
    };

    window.addEventListener('social_section_updated', handleSocialUpdate);
    window.addEventListener('partnership_section_updated', handlePartnershipUpdate);
    window.addEventListener('hero_updated', handleSync);
    window.addEventListener('products_updated', handleSync);
    window.addEventListener('categories_updated', handleSync);
    window.addEventListener('homepage_sections_updated', handleSync);
    window.addEventListener('page_sections_updated', handleSync);
    window.addEventListener('stories_updated', handleSync);
    window.addEventListener('testimonials_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('social_section_updated', handleSocialUpdate);
      window.removeEventListener('partnership_section_updated', handlePartnershipUpdate);
      window.removeEventListener('hero_updated', handleSync);
      window.removeEventListener('products_updated', handleSync);
      window.removeEventListener('categories_updated', handleSync);
      window.removeEventListener('homepage_sections_updated', handleSync);
      window.removeEventListener('page_sections_updated', handleSync);
      window.removeEventListener('stories_updated', handleSync);
      window.removeEventListener('testimonials_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, []);

  useGSAP(() => {
    if (loading) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const whyItems = gsap.utils.toArray('.benefit-stacked-item');
    if (whyItems.length > 0) {
      whyItems.forEach((item) => {
        gsap.fromTo(item, 
          { opacity: 0.3, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: item,
              start: 'top 60%',
              end: 'bottom 40%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      });
    }
  }, { scope: mainRef, dependencies: [loading] });

  if (loading) return <HomeSkeleton />;

  const isVisible = (id) => {
    if (data.pageConfig?.sections) {
      const sec = data.pageConfig.sections.find(s => s.id === id || (s.id === 'benefits' && id === 'trust') || (s.id === 'stories' && id === 'reels') || (s.id === 'farming' && id === 'why_tanush') || (s.id === 'community' && id === 'social'));
      if (sec) return sec.isActive !== false;
    }
    const sec = data.sections.find(s => s.id === id);
    return sec ? sec.is_visible !== false : true;
  };

  const getSortedSections = () => {
    if (data.pageConfig?.sections && data.pageConfig.sections.length > 0) {
      const activeSecs = data.pageConfig.sections
        .filter(s => s.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const idMap = {
        'hero': 'hero',
        'benefits': 'trust',
        'categories': 'categories',
        'products': 'farming',
        'farming': 'why_tanush',
        'farm_to_home': 'why_tanush',
        'stories': 'reels',
        'testimonials': 'testimonials',
        'community': 'social',
        'partner': 'partner'
      };

      const result = [];
      for (const s of activeSecs) {
        const mapped = idMap[s.id] || s.id;
        if (!result.includes(mapped)) {
          result.push(mapped);
        }
      }
      return result;
    }

    if (!data.sections || data.sections.length === 0) {
      return ['hero', 'trust', 'categories', 'reels', 'why_tanush', 'testimonials', 'partner', 'social'];
    }
    const sorted = [...data.sections].filter(s => s.id !== 'featured_products' && s.id !== 'final_cta').sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return sorted.map(s => s.id);
  };
  const layoutOrder = getSortedSections();

  // Define sections mapping
  const renderSection = (id) => {
    if (!isVisible(id)) return null;

    switch (id) {
      case 'hero':
        return (
          <HeroSlider 
            key="hero" 
            slides={data.heroSlides} 
            variant="home" 
          />
        );


      case 'categories':
        return (
          <section key="categories" className="category-premium-section section-padding home-section-first" style={{ position: 'relative' }}>
            <SectionIllustrationSlot page="Home" section="Categories" defaultIllustration="citronella-cluster" defaultPosition="top-right" defaultOpacity={5} />
            <div className="premium-bg-elements">
              <div className="premium-shape shape-blob-1"></div>
              <div className="premium-shape shape-blob-2"></div>
              <div className="premium-dots-pattern"></div>
              <div className="premium-botanical-shadow">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M 10 10 C 50 10 90 50 90 90 C 90 130 50 170 10 170 C 10 130 50 90 10 90 C -30 90 10 10 10 10 Z" />
                </svg>
              </div>
              <Leaf size={48} weight="thin" color="#6B7C67" className="premium-botanical-line" />
            </div>

            <div className="container category-premium-container">
              <div className="category-premium-content">
                <RevealSection>
                  <div className="premium-eyebrow-container">
                    <Leaf size={16} weight="light" className="premium-eyebrow-icon" />
                    <span className="premium-eyebrow-text">EXPLORE OUR RANGE</span>
                  </div>
                  <h2 className="premium-title">Shop by <span>Category</span></h2>
                  <div className="premium-accent-line"></div>
                  <p className="premium-subtitle">FIND WHAT FITS YOUR EVERYDAY</p>
                  
                  <Link to="/shop" className="premium-pill-cta">
                    Explore All Categories <ArrowRight size={16} />
                  </Link>
                </RevealSection>
              </div>
              
              <div className="category-premium-carousel-wrapper">
                <CategoryCarousel categories={data.categories} />
              </div>
            </div>
          </section>
        );



      case 'reels':
        return (
          <ReelsSection 
            key="reels" 
            storiesData={data.stories} 
            productsData={data.products} 
          />
        );

      case 'why_tanush':
        return (
          <section key="why_tanush" className="why-tanush-section bg-sage section-padding mt-4xl" style={{ position: 'relative', overflow: 'hidden' }}>
            <SectionIllustrationSlot page="Home" section="Why Tanush" defaultIllustration="neem-branch" defaultPosition="top-right" defaultOpacity={6} />
            <div className="container relative z-10">
              <div className="why-tanush-split">
                <RevealSection className="why-tanush-heading glass-panel p-2xl">
                  <div className="section-eyebrow">
                    <Leaf size={14} weight="light" className="section-eyebrow-icon" />
                    <span className="section-eyebrow-text">THE DIFFERENCE</span>
                  </div>
                  <h2 className="section-title">
                    Why Tanush <span>Natural?</span>
                  </h2>
                  <div className="section-accent-line" />
                  <p className="section-caption">Rooted in nature. Made for you.</p>
                </RevealSection>

                <div className="benefits-stacked-list">
                  <RevealSection delay="delay-100" className="benefit-stacked-item">
                    <span className="benefit-number">01</span>
                    <div className="benefit-content">
                      <h3>THOUGHTFULLY SOURCED</h3>
                      <p>We look to nature for thoughtful ingredients and everyday solutions.</p>
                    </div>
                  </RevealSection>

                  <RevealSection delay="delay-200" className="benefit-stacked-item">
                    <span className="benefit-number">02</span>
                    <div className="benefit-content">
                      <h3>QUALITY YOU CAN TRUST</h3>
                      <p>We focus on consistency, care and dependable quality in every batch.</p>
                    </div>
                  </RevealSection>

                  <RevealSection delay="delay-300" className="benefit-stacked-item">
                    <span className="benefit-number">03</span>
                    <div className="benefit-content">
                      <h3>MADE FOR EVERYDAY LIFE</h3>
                      <p>Our products are designed around real household needs and routines.</p>
                    </div>
                  </RevealSection>
                  
                  <RevealSection delay="delay-400" className="benefit-stacked-item">
                    <span className="benefit-number">04</span>
                    <div className="benefit-content">
                      <h3>NATURAL APPROACH</h3>
                      <p>Gentle on your home, tough on the problems you need to solve.</p>
                    </div>
                  </RevealSection>
                </div>
              </div>

              {/* Farm-to-Home Visual Storytelling */}
              <div style={{ marginTop: '48px' }}>
                <FarmToHomeJourney />
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        const displayTestimonials = data.testimonials.length > 0 ? data.testimonials : [
          { name: 'Neha S.', role: 'Verified Customer', text: 'Beautiful quality and something I genuinely enjoy using at home. It has completely changed my routine.', rating: 5 },
          { name: 'Rahul M.', role: 'Customer', text: 'Effective, natural and perfect for my family. Tanush has become our go-to.', rating: 5 },
          { name: 'Pooja D.', role: 'Verified Buyer', text: 'Love the freshness and purity in every product. Highly recommended!', rating: 5 }
        ];
        return (
          <section key="testimonials" className="testimonials-section section-padding">
            <div className="testimonials-bg" style={{ backgroundImage: "url('/images/lifestyle/brand-story.jpg')", filter: "blur(40px)", opacity: 0.2, position: "absolute", inset: 0, zIndex: -1 }}></div>
            <div className="container" style={{ position: "relative" }}>
              <RevealSection>
                <div className="section-header-editorial" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                  <div>
                    <div className="section-eyebrow">
                      <Leaf size={14} weight="light" className="section-eyebrow-icon" />
                      <span className="section-eyebrow-text">COMMUNITY</span>
                    </div>
                    <h2 className="section-title">Loved by Our <span>Community</span></h2>
                  </div>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <button className="glass-control" style={{width: '40px', height: '40px'}} aria-label="Previous">
                      <CaretLeft size={20} />
                    </button>
                    <button className="glass-control" style={{width: '40px', height: '40px'}} aria-label="Next">
                      <CaretRight size={20} />
                    </button>
                  </div>
                </div>
              </RevealSection>
              
              <div className="testimonial-editorial-grid mt-2xl">
                {displayTestimonials.slice(0, 1).map((t, idx) => (
                  <RevealSection key={t.id || idx} delay="delay-100" className="testimonial-card featured-testimonial glass-panel">
                    <div className="stars">
                      {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={16} weight="fill" color="var(--color-gold)" />)}
                    </div>
                    <p className="quote">"{t.text}"</p>
                    <div className="author-info">
                      <span className="author-name">{t.name}</span>
                      <span className="verified-badge glass-control">{t.role || 'Verified Customer'}</span>
                    </div>
                  </RevealSection>
                ))}

                <div className="supporting-testimonials">
                  {displayTestimonials.slice(1, 3).map((t, idx) => (
                    <RevealSection key={t.id || idx} delay={`delay-${(idx + 2) * 100}`} className="testimonial-card glass-panel">
                      <div className="stars">
                        {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} weight="fill" color="var(--color-gold)" />)}
                      </div>
                      <p className="quote small-quote">"{t.text}"</p>
                      <div className="author-info">
                        <span className="author-name">{t.name}</span>
                      </div>
                    </RevealSection>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'partner': {
        const partnerData = data.partnershipSection || {};
        if (partnerData.is_visible === false) return null;

        const bgImage = partnerData.background_image || '/images/lifestyle/partner-forest-bg.jpg';
        const bgPos = partnerData.image_position || 'center';
        const overlayPct = typeof partnerData.overlay_opacity === 'number' ? partnerData.overlay_opacity : 60;
        const overlayAlpha = (overlayPct / 100);

        return (
          <section 
            key="partner" 
            className="partner-editorial-section section-padding"
            style={{
              backgroundImage: bgImage ? `url("${bgImage}")` : 'none',
              backgroundPosition: bgPos,
              backgroundSize: partnerData.image_fit || 'cover'
            }}
          >
            {/* Atmospheric Background Image Overlay */}
            <div 
              className="partner-bg-overlay" 
              style={{
                background: `linear-gradient(180deg, rgba(8, 20, 14, ${overlayAlpha}) 0%, rgba(10, 26, 18, ${Math.max(0.15, overlayAlpha * 0.85)}) 50%, rgba(6, 16, 11, ${Math.min(0.98, overlayAlpha * 1.15)}) 100%)`
              }}
            />

            <div className="container relative z-10">
              <div className="partner-editorial-inner">
                <RevealSection delay="delay-100" className="partner-glass-panel">
                  <span className="partner-eyebrow">
                    {partnerData.section_label || '06 — PARTNERSHIPS'}
                  </span>
                  <h2 className="partner-heading">
                    {partnerData.title || 'GROW WITH TANUSH'}
                  </h2>
                  <p className="partner-description">
                    {partnerData.description || 'Bring Tanush Natural products to more homes across India. We are looking for retailers and distributors who share our vision.'}
                  </p>
                  
                  <div className="partner-actions-flex">
                    <Button variant="secondary" className="btn-partner-primary" to={partnerData.button_link || '/become-a-partner'}>
                      {partnerData.button_text || 'BECOME A PARTNER →'}
                    </Button>
                  </div>
                </RevealSection>

                <RevealSection delay="delay-200" className="partner-botanical">
                  <Leaf size={280} weight="thin" color="rgba(255,255,255,0.06)" />
                </RevealSection>
              </div>
            </div>
          </section>
        );
      }

      case 'social': {
        const defaultPool = [
          { id: 'def-1', image: '/images/social/social-1.jpg', title: 'Nourishing Texture' },
          { id: 'def-2', image: '/images/social/social-2.jpg', title: 'Pure Botanical Care' },
          { id: 'def-3', image: '/images/social/social-3.jpg', title: 'Handcrafted Bottle Ritual' },
          { id: 'def-4', image: '/images/lifestyle/brand-story.jpg', title: 'Herbal Ingredients Flatlay' },
          { id: 'def-5', image: '/images/lifestyle/thoughtful-1.jpg', title: 'Nourishing Cream Display' },
          { id: 'def-6', image: '/images/lifestyle/thoughtful-2.jpg', title: 'Soothing Touch Routine' },
          { id: 'def-7', image: '/images/lifestyle/collage-sub2.jpg', title: 'Herb Drops & Elixirs' },
          { id: 'def-8', image: '/images/lifestyle/collage-main.jpg', title: 'Natural Routine Moments' },
          { id: 'def-9', image: '/images/lifestyle/thoughtful-4.jpg', title: 'Botanical Kitchen Routine' },
          { id: 'def-10', image: '/images/lifestyle/thoughtful-3.jpg', title: 'Pure Herbal Formulations' },
          { id: 'def-11', image: '/images/lifestyle/collage-sub1.jpg', title: 'Gentle Skin Wellness' }
        ];

        const rawItems = (data.socialSection?.items && data.socialSection.items.length > 0)
          ? data.socialSection.items.filter(i => i.is_active !== false)
          : [];

        // Only display items configured in Admin Panel. If none configured yet, use default pool.
        const items = rawItems.length > 0 ? rawItems : defaultPool;

        // Distribute available items adaptively across up to 4 columns
        const numCols = Math.min(items.length, 4);
        const columnCards = Array.from({ length: Math.max(1, numCols) }, () => []);
        items.forEach((item, index) => {
          columnCards[index % Math.max(1, numCols)].push(item);
        });

        const getCardClass = (colIdx, itemIdx, totalInCol) => {
          if (totalInCol === 1) return 'journey-card-portrait-lg';
          if (itemIdx === 0) return 'journey-card-landscape';
          if (itemIdx === 1) return colIdx === 1 ? 'journey-card-portrait-center' : 'journey-card-portrait-lg';
          return 'journey-card-square';
        };

        return (
          <section key="social" className="social-fullwidth-journey-section">
            {/* Atmospheric Background Watermark Motifs */}
            <div className="journey-bg-leaf-left" aria-hidden="true">
              <Leaf size={380} weight="thin" color="rgba(138, 155, 131, 0.08)" />
            </div>
            <div className="journey-bg-leaf-right" aria-hidden="true">
              <Leaf size={460} weight="thin" color="rgba(79, 96, 79, 0.06)" />
            </div>

            <div className="journey-section-inner">
              {/* TOP CENTER HEADER */}
              <div className="journey-header-center">
                <div className="journey-eyebrow">
                  <span>{data.socialSection?.eyebrow || '07 — SOCIAL'}</span>
                </div>
                <div className="journey-leaf-icon">
                  <Leaf size={20} weight="light" color="#2F6B43" />
                </div>
                <h2 className="journey-main-heading">
                  FOLLOW THE <span className="journey-highlight-text">TANUSH</span> JOURNEY
                </h2>
                <p className="journey-subheading">
                  {data.socialSection?.subtitle || "Everyday inspiration, natural living and what's new at Tanush."}
                </p>
              </div>

              {/* MAIN CONTENT GRID (LEFT CALLOUT + RIGHT ADAPTIVE 4-COLUMN STAGGERED COLLAGE) */}
              <div className="journey-body-layout">
                {/* LEFT EDITORIAL CALLOUT */}
                <div className="journey-callout-panel">
                  <div className="journey-callout-icon">
                    <Leaf size={24} weight="light" color="#2F6B43" />
                  </div>
                  <h3 className="journey-callout-title">
                    Rooted in<br />nature,<br /><span className="journey-callout-italic">made for you.</span>
                  </h3>
                  <p className="journey-callout-hashtag">
                    Share your moments<br />with <strong>{data.socialSection?.hashtag || '#TanushNatural'}</strong>
                  </p>
                </div>

                {/* RIGHT EDITORIAL PHOTO COLLAGE (ONLY ADMIN IMAGES) */}
                <div 
                  className="journey-collage-grid"
                  style={{
                    gridTemplateColumns: `repeat(${Math.max(1, numCols)}, 1fr)`
                  }}
                >
                  {columnCards.map((colItems, colIdx) => (
                    <div key={colIdx} className={`journey-col journey-col-${colIdx + 1}`}>
                      {colItems.map((item, itemIdx) => (
                        <div 
                          key={item.id || itemIdx} 
                          className={`journey-card ${getCardClass(colIdx, itemIdx, colItems.length)}`}
                        >
                          <img src={item.image} alt={item.title || 'Journey'} loading="lazy" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM CENTER SOCIAL LINK */}
              <div className="journey-cta-bottom">
                <a 
                  href={data.socialSection?.instagram_link || "https://instagram.com/TanushNatural"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="journey-social-link"
                >
                  Follow {data.socialSection?.hashtag?.replace('#', '@') || '@TanushNatural'} &rarr;
                </a>
              </div>
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="home-page" ref={mainRef}>
      {layoutOrder.map(id => renderSection(id))}
    </div>
  );
};

export default Home;
