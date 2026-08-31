import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { api } from '../../lib/db';
import { resolveReelVideoUrl, resolveReelPosterUrl, isValidVideoSource, getVideoMimeType } from '../../lib/mediaResolver';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  Share2, 
  ShoppingBag, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp,
  X, 
  Copy, 
  Leaf, 
  MessageCircle,
  RotateCw,
  AlertCircle
} from 'lucide-react';
import './ReelsSection.css';

const ReelsSection = ({ storiesData = [], productsData = [] }) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fullscreen Modal State
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Smooth Auto-Scroll & Viewport Refs
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isVisibleRef = useRef(true);
  const resumeTimerRef = useRef(null);

  const CARD_WIDTH = 220;
  const CARD_GAP = 18;
  const CARD_PITCH = CARD_WIDTH + CARD_GAP; // 238px

  const initData = useCallback(async () => {
    let st = storiesData;
    let pr = productsData;

    try {
      const [fetchedStories, fetchedProducts, fetchedMedia] = await Promise.all([
        (!st || st.length === 0) ? api.getStories() : Promise.resolve(st),
        (!pr || pr.length === 0) ? api.getProducts() : Promise.resolve(pr),
        api.getMedia()
      ]);

      const activeStories = (fetchedStories || []).filter(s => s.is_active !== false);
      setStories(activeStories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      setProducts(fetchedProducts || []);
      setMediaList(fetchedMedia || []);
    } catch (e) {
      console.warn('Error loading reels data:', e);
    } finally {
      setLoading(false);
    }
  }, [storiesData, productsData]);

  useEffect(() => {
    initData();

    const handleSync = () => initData();
    window.addEventListener('stories_updated', handleSync);
    window.addEventListener('media_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('stories_updated', handleSync);
      window.removeEventListener('media_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, [initData]);

  // Buttery-smooth hardware-accelerated auto-scroll (Single unique list, zero lag)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || stories.length === 0) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // IntersectionObserver to pause auto-scroll when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Pause on any native user interaction
    const handleUserInteraction = () => {
      isPausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        isPausedRef.current = false;
      }, 3500);
    };

    el.addEventListener('wheel', handleUserInteraction, { passive: true });
    el.addEventListener('touchstart', handleUserInteraction, { passive: true });
    el.addEventListener('scroll', handleUserInteraction, { passive: true });

    let scrollDirection = 1; // 1: scrolling right, -1: scrolling left
    let animId = null;
    let lastTime = performance.now();

    const step = (now) => {
      const delta = Math.min((now - lastTime) / 16.666, 2);
      lastTime = now;

      if (el && !isPausedRef.current && !isDraggingRef.current && isVisibleRef.current && activeModalIndex === null) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 10) {
          el.scrollLeft += 0.55 * scrollDirection * delta;

          if (el.scrollLeft >= maxScroll - 2) {
            scrollDirection = -1;
          } else if (el.scrollLeft <= 2) {
            scrollDirection = 1;
          }
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      el.removeEventListener('wheel', handleUserInteraction);
      el.removeEventListener('touchstart', handleUserInteraction);
      el.removeEventListener('scroll', handleUserInteraction);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [stories.length, activeModalIndex]);

  // Hover Pause & Resume
  const dragDistRef = useRef(0);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      isPausedRef.current = false;
    }
  };

  // Mouse / Touch Dragging
  const handleMouseDown = (e) => {
    const el = viewportRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    dragDistRef.current = 0;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleMouseMove = (e) => {
    const el = viewportRef.current;
    if (!isDraggingRef.current || !el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    dragDistRef.current += Math.abs(x - startXRef.current);
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      resumeTimerRef.current = setTimeout(() => {
        isPausedRef.current = false;
        dragDistRef.current = 0;
      }, 2500);
    }
  };

  // Manual Arrow Navigation (Left / Right)
  const handleNavPrev = () => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: -CARD_PITCH * 2, behavior: 'smooth' });
    }
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 3000);
  };

  const handleNavNext = () => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: CARD_PITCH * 2, behavior: 'smooth' });
    }
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 3000);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const openReelModal = (index) => {
    if (dragDistRef.current > 8) return;
    setActiveModalIndex(index);
    const story = stories[index];
    if (story) {
      api.logAnalyticsEvent({
        type: 'reel_view',
        details: `Viewed reel: ${story.title || story.text}`,
        product_id: story.product_id || ''
      }).catch(() => {});
    }
  };

  const closeReelModal = () => {
    setActiveModalIndex(null);
  };

  if (loading) return null;
  if (stories.length === 0) return null;

  return (
    <section className="reels-section-wrapper" ref={containerRef}>
      {/* 1. Header Container */}
      <div className="container">
        <div className="reels-header-row">
          <div className="reels-header-left">
            <div className="reels-eyebrow">
              <Leaf size={14} color="#2F6B43" />
              <span>REELS &amp; STORIES</span>
            </div>
            <h2 className="reels-main-title">
              Tanush in <span>Motion</span>
            </h2>
            <p className="reels-subheading">
              Botanical care, everyday moments, and the stories behind Tanush Natural.
            </p>
          </div>

          <button 
            type="button" 
            className="reels-btn-view-all" 
            onClick={() => navigate('/admin/stories')}
            title="Manage or view all stories in Admin"
          >
            <span>View All Reels</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Full-Width Horizontal Single Unique Carousel Strip */}
      <div className="reels-fullwidth-strip">
        {/* Left Floating Arrow Button */}
        <button 
          type="button" 
          className="reels-floating-arrow-btn reels-floating-arrow-left" 
          onClick={handleNavPrev}
          aria-label="Previous reels"
          title="Previous reels"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Carousel Viewport (Hardware-Accelerated Smooth Composite Scrolling) */}
        <div 
          className="reels-carousel-viewport"
          ref={viewportRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="reels-carousel-continuous-track">
            {stories.map((story, idx) => {
              const assocProduct = products.find(p => String(p.id) === String(story.product_id)) || products[0];
              const videoSrc = resolveReelVideoUrl(story, mediaList);

              return (
                <ReelCard
                  key={story.id || idx}
                  story={story}
                  product={assocProduct}
                  videoSrc={videoSrc}
                  onClick={() => openReelModal(idx)}
                />
              );
            })}
          </div>
        </div>

        {/* Right Floating Arrow Button */}
        <button 
          type="button" 
          className="reels-floating-arrow-btn reels-floating-arrow-right" 
          onClick={handleNavNext}
          aria-label="Next reels"
          title="Next reels"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Toast Notice Banner */}
      {toastMessage && <div className="reel-toast-notice">{toastMessage}</div>}

      {/* Full-Screen Reel Viewer Modal with Mobile Vertical Swipe Up/Down & Desktop Wheel Scroll */}
      {activeModalIndex !== null && (
        <ReelViewerModal
          stories={stories}
          products={products}
          mediaList={mediaList}
          currentIndex={activeModalIndex}
          onIndexChange={(newIdx) => setActiveModalIndex(newIdx)}
          onClose={closeReelModal}
          addToCart={addToCart}
          setIsCartOpen={setIsCartOpen}
          toggleWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
          showToast={showToast}
          navigate={navigate}
        />
      )}
    </section>
  );
};

// ============================================================
// HELPER: FORMAT REEL DURATION (TRUE RUNTIME)
// ============================================================
const formatReelDuration = (secs) => {
  if (typeof secs === 'string' && secs.includes(':')) return secs.trim();
  const n = Number(secs);
  if (!n || isNaN(n) || !isFinite(n) || n <= 0) return '0:15';
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// ============================================================
// SINGLE REEL CARD (PORTRAIT 9:16 - SMOOTH AUTOPLAY PREVIEW)
// ============================================================
const ReelCard = ({ story, product, videoSrc, onClick }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const posterUrl = resolveReelPosterUrl(story);
  const [duration, setDuration] = useState(() => {
    if (typeof story.duration === 'number' && story.duration > 0) return story.duration;
    if (typeof story.duration === 'string' && story.duration.trim()) return story.duration.trim();
    return null;
  });
  const hasValidVideo = isValidVideoSource(videoSrc);

  const handleLoadedMetadata = (e) => {
    const dur = e.target.duration;
    if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
      setDuration(dur);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasValidVideo || videoError) return;

    // Detect duration if metadata is already cached / available
    if (video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }

    // Use IntersectionObserver to autoplay visible reels smoothly without lag
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            const p = video.play();
            if (p !== undefined) p.catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasValidVideo, videoError, videoSrc]);

  return (
    <div 
      ref={cardRef}
      className="reel-card-item"
      onClick={onClick}
    >
      {/* Real Playing Video with High Quality Poster Fallback */}
      {hasValidVideo && !videoError ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterUrl}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setVideoError(true)}
          className="reel-card-video"
        >
          <source src={videoSrc} type={getVideoMimeType(videoSrc)} />
        </video>
      ) : (
        <img 
          src={posterUrl} 
          alt={story.title || 'Reel'} 
          className="reel-card-fallback-img"
          loading="lazy"
        />
      )}

      <div className="reel-card-gradient" />

      {/* Top Badges */}
      <div className="reel-card-badge-top">
        <div className="reel-card-play-tag">
          <Play size={10} fill="#FFFFFF" />
          <span>REEL</span>
        </div>
        <div className="reel-card-duration">
          {formatReelDuration(duration || story.duration)}
        </div>
      </div>

      {/* Hover Audio Indicator */}
      {hasValidVideo && (
        <div className="reel-card-audio-indicator">
          <Volume2 size={12} />
          <span>Tap to Watch</span>
        </div>
      )}

      {/* Bottom Product Info Tag */}
      <div className="reel-card-bottom-info">
        <h3 className="reel-card-title">{story.title || story.text}</h3>
        {product && (
          <div className="reel-card-product-pill">
            <img 
              src={(product.images && product.images[0]) || story.image} 
              alt={product.name}
              className="reel-card-product-img"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100/EDF1EE/1A3E2F?text=Item"; }}
            />
            <div className="reel-card-product-meta">
              <span className="reel-card-product-name">{product.name}</span>
              <span className="reel-card-product-price">₹{product.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// FULL-SCREEN REEL VIEWER MODAL (WITH MOBILE VERTICAL SWIPE)
// ============================================================
const ReelViewerModal = ({
  stories,
  products,
  mediaList = [],
  currentIndex,
  onIndexChange,
  onClose,
  addToCart,
  setIsCartOpen,
  toggleWishlist,
  isInWishlist,
  showToast,
  navigate
}) => {
  const currentStory = stories[currentIndex] || {};
  const currentProduct = products.find(p => String(p.id) === String(currentStory.product_id)) || products[0];
  const videoSrc = resolveReelVideoUrl(currentStory, mediaList);
  const hasValidVideo = isValidVideoSource(videoSrc);

  const posterUrl = resolveReelPosterUrl(currentStory);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const hasLoggedPlay = useRef(false);

  // Mobile Touch Swipe Up/Down Gesture Engine
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchDeltaY = useRef(0);
  const isSwiping = useRef(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [slideDirection, setSlideDirection] = useState(null);

  // Like Reel State (Persistent & Shared Real-Time)
  const [likes, setLikes] = useState({ 
    count: typeof currentStory.likes_count === 'number' ? currentStory.likes_count : 0, 
    liked: false 
  });
  const [likeLoading, setLikeLoading] = useState(false);

  const formatLikesText = (count) => {
    const n = typeof count === 'number' ? count : 0;
    if (n === 1) return '1 Like';
    return `${n} Likes`;
  };

  const loadAndPlayVideo = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    hasLoggedPlay.current = false;

    if (videoRef.current && hasValidVideo) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            if (videoRef.current && !videoRef.current.muted) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      setIsLoading(false);
    }
  }, [hasValidVideo]);

  useEffect(() => {
    let isMounted = true;

    const fetchLikes = async () => {
      if (!currentStory.id) return;
      try {
        const data = await api.getReelLikes(currentStory.id);
        if (isMounted && data) {
          setLikes({
            count: typeof data.likes_count === 'number' ? data.likes_count : 0,
            liked: Boolean(data.liked)
          });
        }
      } catch (e) {
        if (isMounted) {
          setLikes({ count: currentStory.likes_count || 0, liked: false });
        }
      }
    };

    fetchLikes();
    loadAndPlayVideo();

    const handleLikeEvent = (e) => {
      if (e.detail && String(e.detail.reel_id) === String(currentStory.id)) {
        setLikes(prev => ({
          count: typeof e.detail.likes_count === 'number' ? e.detail.likes_count : prev.count,
          liked: typeof e.detail.liked === 'boolean' ? e.detail.liked : prev.liked
        }));
      }
    };

    window.addEventListener('reel_like_updated', handleLikeEvent);

    return () => {
      isMounted = false;
      window.removeEventListener('reel_like_updated', handleLikeEvent);
      if (videoRef.current) videoRef.current.pause();
    };
  }, [currentIndex, currentStory.id, currentStory.likes_count, loadAndPlayVideo]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        onIndexChange((currentIndex + 1) % stories.length);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        onIndexChange((currentIndex - 1 + stories.length) % stories.length);
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, stories.length]);

  // Touch Gestures
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchDeltaY.current = 0;
    isSwiping.current = true;
    setSlideDirection(null);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current || !e.touches || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const dy = currentY - touchStartY.current;
    const dx = currentX - touchStartX.current;

    if (Math.abs(dy) > Math.abs(dx)) {
      touchDeltaY.current = dy;
      setDragOffsetY(dy * 0.35);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const dy = touchDeltaY.current;
    setDragOffsetY(0);

    const swipeThreshold = 45;
    if (dy < -swipeThreshold) {
      setSlideDirection('up');
      setTimeout(() => {
        onIndexChange((currentIndex + 1) % stories.length);
        setSlideDirection(null);
      }, 180);
    } else if (dy > swipeThreshold) {
      setSlideDirection('down');
      setTimeout(() => {
        onIndexChange((currentIndex - 1 + stories.length) % stories.length);
        setSlideDirection(null);
      }, 180);
    }
    touchDeltaY.current = 0;
  };

  const togglePlayPause = () => {
    if (!videoRef.current || !hasValidVideo || hasError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleVideoPlaying = () => {
    setIsLoading(false);
    setIsPlaying(true);
    setHasError(false);

    if (!hasLoggedPlay.current && currentStory) {
      hasLoggedPlay.current = true;
      api.logAnalyticsEvent({
        type: 'reel_play',
        details: `Played reel: ${currentStory.title || currentStory.text}`,
        product_id: currentStory.product_id || ''
      }).catch(() => {});
    }
  };

  const handleToggleLike = async () => {
    if (likeLoading || !currentStory.id) return;
    setLikeLoading(true);

    const prevLiked = likes.liked;
    const prevCount = likes.count;

    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);
    setLikes({ count: nextCount, liked: nextLiked });

    try {
      const result = await api.toggleReelLike(currentStory.id);
      if (result && result.success) {
        setLikes({
          count: typeof result.likes_count === 'number' ? result.likes_count : nextCount,
          liked: Boolean(result.liked)
        });
      } else {
        setLikes({ count: prevCount, liked: prevLiked });
        showToast('Unable to update like. Please try again.');
      }
    } catch (e) {
      setLikes({ count: prevCount, liked: prevLiked });
      showToast('Unable to update like. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddToCartClick = () => {
    if (currentProduct) {
      addToCart(currentProduct, 1);
      setIsCartOpen(true);
      showToast(`✓ Added ${currentProduct.name} to cart!`);
    }
  };

  const handleCopyReelLink = () => {
    const url = `${window.location.origin}/product/${currentProduct?.slug || ''}?reel=${currentStory.id}`;
    navigator.clipboard.writeText(url);
    showToast('✓ Reel link copied to clipboard!');
    setShowShareMenu(false);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const lastWheelTime = useRef(0);
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 450) return;
    if (Math.abs(e.deltaY) > 25) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        setSlideDirection('up');
        setTimeout(() => {
          onIndexChange((currentIndex + 1) % stories.length);
          setSlideDirection(null);
        }, 160);
      } else {
        setSlideDirection('down');
        setTimeout(() => {
          onIndexChange((currentIndex - 1 + stories.length) % stories.length);
          setSlideDirection(null);
        }, 160);
      }
    }
  };

  const isWished = currentProduct ? isInWishlist(currentProduct.id) : false;

  return (
    <div className="reel-modal-backdrop" onClick={onClose} onWheel={handleWheel}>
      <button type="button" className="reel-modal-close-btn" onClick={onClose} aria-label="Close Reel">
        <X size={24} />
      </button>

      {/* Desktop Previous Reel Button */}
      <button 
        type="button" 
        className="reel-modal-desktop-arrow reel-modal-desktop-prev" 
        onClick={(e) => {
          e.stopPropagation();
          setSlideDirection('down');
          setTimeout(() => {
            onIndexChange((currentIndex - 1 + stories.length) % stories.length);
            setSlideDirection(null);
          }, 160);
        }}
        aria-label="Previous Reel"
        title="Previous Reel"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Desktop Next Reel Button */}
      <button 
        type="button" 
        className="reel-modal-desktop-arrow reel-modal-desktop-next" 
        onClick={(e) => {
          e.stopPropagation();
          setSlideDirection('up');
          setTimeout(() => {
            onIndexChange((currentIndex + 1) % stories.length);
            setSlideDirection(null);
          }, 160);
        }}
        aria-label="Next Reel"
        title="Next Reel"
      >
        <ChevronRight size={24} />
      </button>

      <div className="reel-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* VIDEO PLAYER STAGE */}
        <div 
          className={`reel-modal-video-stage ${slideDirection ? `reel-slide-${slideDirection}` : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: slideDirection === 'up'
              ? 'translate3d(0, -100%, 0)'
              : slideDirection === 'down'
              ? 'translate3d(0, 100%, 0)'
              : dragOffsetY
              ? `translate3d(0, ${dragOffsetY}px, 0)`
              : 'translate3d(0, 0, 0)',
            transition: isSwiping.current ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Ambient Blurred Video Poster Layer */}
          <img 
            src={posterUrl} 
            alt="Ambience" 
            className="reel-video-ambient-backdrop" 
          />

          {hasValidVideo && !hasError ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterUrl}
              loop
              autoPlay
              playsInline
              muted={isMuted}
              onLoadedMetadata={(e) => {
                const dur = e.target.duration;
                if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
                  setDuration(dur);
                }
              }}
              onTimeUpdate={handleTimeUpdate}
              onPlaying={handleVideoPlaying}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              onClick={togglePlayPause}
              className="reel-modal-video-el"
            >
              <source src={videoSrc} type={getVideoMimeType(videoSrc)} />
            </video>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <img 
                src={posterUrl} 
                alt={currentStory.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="reel-video-error-overlay">
                <AlertCircle size={32} color="#E2A955" />
                <p>
                  {hasError ? 'Unable to play this reel video file.' : 'No video asset attached to this reel.'}
                </p>
                {hasError && (
                  <button type="button" className="reel-video-retry-btn" onClick={loadAndPlayVideo}>
                    <RotateCw size={14} /> Retry Playback
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Top Badges */}
          <div className="reel-stage-badge-top">
            <div className="reel-card-play-tag">
              <Play size={10} fill="#FFFFFF" />
              <span>REEL</span>
            </div>
            <div className="reel-card-duration">
              {formatReelDuration(duration || currentStory.duration)}
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && hasValidVideo && !hasError && (
            <div className="reel-video-loading-overlay">
              <div className="reel-video-spinner" />
              <span>Loading reel...</span>
            </div>
          )}

          {/* Floating Vertical Social Actions (Mobile & Phone Mode) */}
          <div className="reel-floating-social-stack">
            <button 
              type="button" 
              className={`reel-floating-action-circle ${likes.liked ? 'liked' : ''}`}
              onClick={handleToggleLike}
              disabled={likeLoading}
              title={likes.liked ? 'Unlike Reel' : 'Like Reel'}
            >
              <Heart size={20} fill={likes.liked ? '#FC8181' : 'none'} color={likes.liked ? '#FC8181' : '#FFFFFF'} />
              <span className="reel-action-count-badge">{likes.count}</span>
            </button>

            <button 
              type="button" 
              className="reel-floating-action-circle"
              onClick={() => setShowShareMenu(prev => !prev)}
              title="Share Reel"
            >
              <Share2 size={18} color="#FFFFFF" />
              <span className="reel-action-label-small">Share</span>
            </button>

            <button 
              type="button" 
              className="reel-floating-action-circle"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX size={18} color="#FFFFFF" /> : <Volume2 size={18} color="#FFFFFF" />}
              <span className="reel-action-label-small">{isMuted ? 'Muted' : 'Sound'}</span>
            </button>
          </div>

          {/* Mobile Overlay Product & Action Card on Stage Bottom */}
          <div className="reel-stage-mobile-overlay">
            <div className="reel-stage-mobile-title-wrap">
              <h3 className="reel-stage-mobile-title">{currentStory.title || currentStory.text}</h3>
              <p className="reel-stage-mobile-sub">Tanush Botanical Routine</p>
            </div>

            {currentProduct && (
              <div className="reel-stage-mobile-product-pill">
                <img 
                  src={(currentProduct.images && currentProduct.images[0]) || currentStory.image} 
                  alt={currentProduct.name}
                  className="reel-stage-mobile-product-thumb"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100/EDF1EE/1A3E2F?text=Item"; }}
                />
                <div className="reel-stage-mobile-product-info">
                  <span className="reel-stage-mobile-product-name">{currentProduct.name}</span>
                  <span className="reel-stage-mobile-product-price">₹{currentProduct.price}</span>
                </div>
              </div>
            )}

            {currentProduct && (
              <button type="button" className="reel-stage-mobile-btn-cart" onClick={handleAddToCartClick}>
                <ShoppingBag size={16} />
                <span>ADD TO CART</span>
              </button>
            )}

            <div className="reel-stage-mobile-swipe-hint">
              <ChevronUp size={14} />
              <span>Swipe up for next &bull; Swipe down for previous</span>
            </div>
          </div>

          {/* Circular Navigation Arrows */}
          <button 
            type="button" 
            className="reel-nav-btn reel-nav-prev" 
            onClick={() => onIndexChange((currentIndex - 1 + stories.length) % stories.length)}
            aria-label="Previous reel"
            title="Previous Reel"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            type="button" 
            className="reel-nav-btn reel-nav-next" 
            onClick={() => onIndexChange((currentIndex + 1) % stories.length)}
            aria-label="Next reel"
            title="Next Reel"
          >
            <ChevronRight size={24} />
          </button>

          {/* Video Control Bar */}
          <div className="reel-video-controls-bar">
            <div className="reel-progress-wrap" onClick={handleSeek}>
              <div 
                className="reel-progress-fill" 
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <div className="reel-controls-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button" 
                  className="reel-control-btn" 
                  onClick={togglePlayPause} 
                  disabled={!hasValidVideo || hasError}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button 
                  type="button" 
                  className="reel-control-btn" 
                  onClick={toggleMute}
                  disabled={!hasValidVideo || hasError}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{isMuted ? 'Mute' : 'Unmute'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT & SOCIAL PANEL (DESKTOP RIGHT) */}
        <div className="reel-modal-info-panel">
          <div>
            <div className="reel-info-header">
              <div className="reel-info-eyebrow">FEATURED REEL</div>
              <h2 className="reel-info-title">{currentStory.title || currentStory.text}</h2>
              <p className="reel-info-caption">
                Botanical routine &amp; everyday care formulation by Tanush Natural.
              </p>
            </div>

            {/* Social Reaction Bar */}
            <div className="reel-social-actions-bar">
              <button 
                type="button" 
                className={`reel-action-btn-pill ${likes.liked ? 'liked' : ''}`}
                onClick={handleToggleLike}
                disabled={likeLoading}
                title={likes.liked ? 'Unlike Reel' : 'Like Reel'}
              >
                <Heart size={16} fill={likes.liked ? '#FC8181' : 'none'} color={likes.liked ? '#FC8181' : '#FFFFFF'} />
                <span>{formatLikesText(likes.count)}</span>
              </button>

              <button 
                type="button" 
                className="reel-action-btn-pill"
                onClick={() => setShowShareMenu(prev => !prev)}
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>

            {/* Share Popover Menu */}
            {showShareMenu && (
              <div className="reel-share-popover">
                <div className="reel-share-option" onClick={handleCopyReelLink}>
                  <Copy size={15} />
                  <span>Copy Reel Link</span>
                </div>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this reel for ${currentProduct?.name || 'Tanush Natural'}: ${window.location.origin}/product/${currentProduct?.slug || ''}`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="reel-share-option"
                  onClick={() => setShowShareMenu(false)}
                >
                  <MessageCircle size={15} color="#25D366" />
                  <span>Share via WhatsApp</span>
                </a>
              </div>
            )}

            {/* Product Card Box */}
            {currentProduct && (
              <div className="reel-product-card-box">
                <div className="reel-product-card-top">
                  <img 
                    src={(currentProduct.images && currentProduct.images[0]) || currentStory.image} 
                    alt={currentProduct.name}
                    className="reel-product-card-thumb"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100/EDF1EE/1A3E2F?text=Item"; }}
                  />
                  <div className="reel-product-card-details">
                    <h3 className="reel-product-card-title">{currentProduct.name}</h3>
                    <div className="reel-product-card-price-row">
                      <span className="reel-product-card-price">₹{currentProduct.price}</span>
                      {currentProduct.compare_at_price > currentProduct.price && (
                        <span className="reel-product-card-compare">₹{currentProduct.compare_at_price}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="reel-product-actions-grid">
                  <button type="button" className="reel-btn-cart" onClick={handleAddToCartClick}>
                    <ShoppingBag size={16} />
                    <span>ADD TO CART</span>
                  </button>

                  <button 
                    type="button" 
                    className="reel-btn-wishlist"
                    onClick={() => {
                      toggleWishlist(currentProduct);
                      showToast(isWished ? 'Removed from Wishlist' : 'Saved to Wishlist!');
                    }}
                  >
                    <Heart size={16} fill={isWished ? '#FC8181' : 'none'} color={isWished ? '#FC8181' : '#FFFFFF'} />
                    <span>{isWished ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <a 
                    href={`/product/${currentProduct.slug}`} 
                    className="reel-btn-view-product"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      navigate(`/product/${currentProduct.slug}`);
                    }}
                  >
                    View Product Details →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsSection;
