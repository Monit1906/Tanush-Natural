import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/db';
import { 
  Plus, Edit2, Trash2, Eye, Search, X, Check, Save, Upload, FolderOpen, 
  ArrowUp, ArrowDown, Image as ImageIcon, Globe, Type, Sliders, ShieldCheck, 
  Monitor, Tablet, Smartphone, Calendar, Info, Leaf, CheckCircle, AlertTriangle, Layout, LayoutGrid
} from 'lucide-react';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';

const AVAILABLE_PAGES = [
  { id: 'home', name: 'Home Page', type: 'home' },
  { id: 'shop', name: 'Shop (All Products)', type: 'inner' },
  { id: 'why-tanush', name: 'Why Tanush', type: 'inner' },
  { id: 'become-a-partner', name: 'Become a Partner', type: 'inner' },
  { id: 'contact', name: 'Contact Us', type: 'inner' },
  { id: 'all_inner', name: 'Global Inner Pages (Fallback)', type: 'inner' }
];

const HeroManager = () => {
  const [slides, setSlides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'home' | 'inner'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('desktop'); // 'desktop' | 'mobile'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState({
    id: '',
    title: '',
    hero_type: 'home', // 'home' | 'inner_banner'
    page: 'home',
    assigned_pages: ['home'],
    image: '',
    mobile_image: '',
    media_type: 'image', // 'image' | 'video'
    video_url: '',
    poster: '',
    image_position: 'center',
    overlay: 'none',
    parallax: false,
    subtitle: '',
    description: '',
    badge: '100% Pure',
    button_text: 'Shop Collection',
    button_link: '/shop',
    secondary_button_text: 'Discover Tanush',
    secondary_button_link: '/why-tanush',
    status: 'published',
    start_date: '',
    end_date: '',
    sort_order: 1,
    is_active: true
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const loadSlides = async () => {
    setLoading(true);
    const data = await api.getHeroSlides();
    setSlides(data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
    setLoading(false);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleEdit = (slide) => {
    const isInner = slide.hero_type === 'inner_banner' || (slide.page && slide.page !== 'home');
    setCurrentSlide({ 
      ...slide,
      hero_type: isInner ? 'inner_banner' : 'home',
      page: slide.page || (isInner ? 'shop' : 'home'),
      assigned_pages: Array.isArray(slide.assigned_pages) ? slide.assigned_pages : [slide.page || 'home'],
      image: slide.image || '/images/hero/hero-1.jpg',
      mobile_image: slide.mobile_image || '',
      media_type: slide.media_type || 'image',
      image_position: slide.image_position || 'center',
      overlay: slide.overlay || 'none',
      parallax: Boolean(slide.parallax),
      status: slide.status || (slide.is_active !== false ? 'published' : 'draft'),
      start_date: slide.start_date || '',
      end_date: slide.end_date || '',
      button_text: slide.button_text || slide.buttonText || 'Shop Collection',
      button_link: slide.button_link || slide.buttonLink || '/shop',
      secondary_button_text: slide.secondary_button_text || slide.secondaryButtonText || 'Discover Tanush',
      secondary_button_link: slide.secondary_button_link || slide.secondaryButtonLink || '/why-tanush'
    });
    setIsDrawerOpen(true);
  };

  const handleAddHomeHero = () => {
    setCurrentSlide({
      id: '',
      title: 'Tanush Natural',
      hero_type: 'home',
      page: 'home',
      assigned_pages: ['home'],
      subtitle: 'Pure Ayurvedic Herbal Formulation',
      description: 'Pure Ayurvedic Herbal Formulation',
      image: '/images/hero/hero-1.jpg',
      mobile_image: '',
      media_type: 'image',
      video_url: '',
      poster: '',
      image_position: 'center',
      overlay: 'none',
      parallax: false,
      badge: '100% Natural Product',
      button_text: 'Shop Collection',
      button_link: '/shop',
      secondary_button_text: 'Discover Tanush',
      secondary_button_link: '/why-tanush',
      status: 'published',
      start_date: '',
      end_date: '',
      sort_order: slides.filter(s => s.page === 'home' || s.hero_type === 'home').length + 1,
      is_active: true
    });
    setIsDrawerOpen(true);
  };

  const handleCreatePageHero = () => {
    setCurrentSlide({
      id: '',
      title: 'Shop Page Banner',
      hero_type: 'inner_banner',
      page: 'shop',
      assigned_pages: ['shop'],
      subtitle: '',
      description: '',
      image: '/images/lifestyle/thoughtful-3.jpg',
      mobile_image: '',
      media_type: 'image',
      video_url: '',
      poster: '',
      image_position: 'center',
      overlay: 'none',
      parallax: false,
      badge: '',
      button_text: '',
      button_link: '',
      secondary_button_text: '',
      secondary_button_link: '',
      status: 'published',
      start_date: '',
      end_date: '',
      sort_order: slides.length + 1,
      is_active: true
    });
    setIsDrawerOpen(true);
  };

  const handleFileUpload = async (files, isMobile = false) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const mediaItem = await api.uploadMediaFile(file, 'Hero Banners');
      if (isMobile) {
        setCurrentSlide(prev => ({ ...prev, mobile_image: mediaItem.url }));
        showToast(`✓ Uploaded mobile banner: ${file.name}`);
      } else {
        setCurrentSlide(prev => ({ ...prev, image: mediaItem.url }));
        showToast(`✓ Uploaded desktop banner: ${file.name}`);
      }
    } catch (e) {
      console.error(e);
      showToast(`Error uploading ${file.name}`);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete hero "${title || id}"?`)) {
      await api.deleteHeroSlide(id);
      showToast(`Hero deleted`);
      loadSlides();
    }
  };

  const handleToggleStatus = async (slide) => {
    const updated = { 
      ...slide, 
      is_active: slide.is_active === false,
      status: slide.is_active === false ? 'published' : 'draft'
    };
    await api.saveHeroSlide(updated);
    loadSlides();
    showToast(`Hero status updated`);
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    for (let i = 0; i < updated.length; i++) {
      updated[i].sort_order = i + 1;
      await api.saveHeroSlide(updated[i]);
    }
    loadSlides();
    showToast('Order updated');
  };

  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    for (let i = 0; i < updated.length; i++) {
      updated[i].sort_order = i + 1;
      await api.saveHeroSlide(updated[i]);
    }
    loadSlides();
    showToast('Order updated');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await api.saveHeroSlide(currentSlide);
    showToast(`✓ Hero "${currentSlide.title || currentSlide.page}" saved & published!`);
    setIsDrawerOpen(false);
    loadSlides();
  };

  // Filter slides
  const filteredSlides = slides.filter(slide => {
    const matchesSearch = 
      (slide.title && slide.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (slide.page && slide.page.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    const isInner = slide.hero_type === 'inner_banner' || (slide.page && slide.page !== 'home');
    if (activeTab === 'home') return !isInner;
    if (activeTab === 'inner') return isInner;
    return true;
  });

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Header Actions */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Multi-Page Hero CMS</h2>
          <p className="text-muted">
            Manage interactive Home Hero slides and full-width 1920 × 600 visual banners for inner pages
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-admin-secondary" onClick={handleAddHomeHero}>
            <Layout size={16} />
            <span>+ Add Home Slide</span>
          </button>
          <button className="btn-admin-primary" onClick={handleCreatePageHero}>
            <Plus size={16} />
            <span>+ Create Page Hero (1920×600)</span>
          </button>
        </div>
      </div>

      {/* Page Hero Coverage Matrix / Checklist */}
      <div className="admin-card glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)' }}>
          📍 Page Hero Assignment Status
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {AVAILABLE_PAGES.filter(p => p.id !== 'all_inner').map(pageItem => {
            const isInner = pageItem.type === 'inner';
            const assignedHero = slides.find(s => 
              (s.page === pageItem.id || 
               s.assigned_pages?.includes(pageItem.id) ||
               (isInner && (s.page === 'shop' || s.page === 'all_inner' || s.hero_type === 'inner_banner' || s.assigned_pages?.includes('shop')))) && 
              s.is_active !== false && 
              s.status !== 'draft'
            );
            return (
              <div 
                key={pageItem.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: assignedHero ? 'rgba(47, 133, 90, 0.08)' : 'rgba(23, 59, 47, 0.03)',
                  border: `1px solid ${assignedHero ? 'rgba(47, 133, 90, 0.25)' : 'rgba(23, 59, 47, 0.08)'}`,
                  borderRadius: '8px',
                  fontSize: '0.8rem'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{pageItem.name}</span>
                {assignedHero ? (
                  <span style={{ color: '#2F855A', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                    <CheckCircle size={13} /> Active
                  </span>
                ) : (
                  <span style={{ color: '#C5A869', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <AlertTriangle size={13} /> Default
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="media-filter-bar glass-panel" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            type="button" 
            className={`btn-admin-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Heroes ({slides.length})
          </button>
          <button 
            type="button" 
            className={`btn-admin-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home Hero Slides ({slides.filter(s => s.page === 'home' || s.hero_type === 'home').length})
          </button>
          <button 
            type="button" 
            className={`btn-admin-tab ${activeTab === 'inner' ? 'active' : ''}`}
            onClick={() => setActiveTab('inner')}
          >
            Inner Page Banners 1920×600 ({slides.filter(s => (s.page && s.page !== 'home') || s.hero_type === 'inner_banner').length})
          </button>
        </div>

        <div className="search-input-wrap" style={{ maxWidth: '300px' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title or page..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Hero Table */}
      <div className="admin-table-card glass-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Banner</th>
              <th>Hero Name / Details</th>
              <th style={{ width: '150px' }}>Type & Page</th>
              <th style={{ width: '130px' }}>Dimensions</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Reorder</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlides.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }} className="text-muted">
                  No hero configurations found.
                </td>
              </tr>
            ) : (
              filteredSlides.map((slide, index) => {
                const isInner = slide.hero_type === 'inner_banner' || (slide.page && slide.page !== 'home');
                const pageLabel = AVAILABLE_PAGES.find(p => p.id === slide.page)?.name || slide.page || 'Home';
                
                return (
                  <tr key={slide.id || index}>
                    <td>
                      <div 
                        onClick={() => handleEdit(slide)}
                        style={{ 
                          width: '76px', 
                          height: isInner ? '28px' : '44px', 
                          borderRadius: '6px', 
                          overflow: 'hidden', 
                          position: 'relative', 
                          cursor: 'pointer',
                          background: '#EAE6DD',
                          border: '1px solid rgba(23, 59, 47, 0.1)'
                        }}
                        title="Click to Edit Hero"
                      >
                        <img 
                          src={slide.image} 
                          alt={slide.title || 'Hero Banner'} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={e => { e.target.src = 'https://placehold.co/120x80?text=Hero'; }} 
                        />
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        {slide.title || (isInner ? `${pageLabel} Banner` : 'Home Slide')}
                      </strong>
                      {isInner ? (
                        <div className="text-muted text-xs" style={{ color: '#2F6B43' }}>
                          ✓ Pure 1920 × 600 Visual Banner (No Text Overlay)
                        </div>
                      ) : (
                        <div className="text-muted text-xs">
                          {slide.subtitle || slide.description || 'Editorial content slide with CTAs'}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge" style={{ 
                        background: isInner ? 'rgba(47, 133, 90, 0.12)' : 'rgba(23, 59, 47, 0.08)', 
                        color: isInner ? '#1F6B43' : 'var(--color-primary)', 
                        padding: '3px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.72rem', 
                        fontWeight: 600 
                      }}>
                        {isInner ? 'Inner Banner' : 'Home Hero'}
                      </span>
                      <div className="text-muted text-xs" style={{ marginTop: '3px', fontWeight: 500 }}>
                        📍 {pageLabel}
                      </div>
                    </td>
                    <td>
                      <span className="text-muted text-xs" style={{ fontFamily: 'monospace' }}>
                        {isInner ? '1920 × 600' : 'Full Layout'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button 
                          type="button" 
                          className="icon-action-btn" 
                          disabled={index === 0} 
                          onClick={() => handleMoveUp(index)}
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          type="button" 
                          className="icon-action-btn" 
                          disabled={index === filteredSlides.length - 1} 
                          onClick={() => handleMoveDown(index)}
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <button 
                        type="button"
                        onClick={() => handleToggleStatus(slide)}
                        className={`status-badge ${slide.is_active !== false && slide.status !== 'draft' ? 'status-active' : 'status-inactive'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle status"
                      >
                        {slide.is_active !== false && slide.status !== 'draft' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          type="button"
                          className="icon-action-btn"
                          onClick={() => handleEdit(slide)}
                          title="Edit Hero"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          type="button"
                          className="icon-action-btn danger"
                          onClick={() => handleDelete(slide.id, slide.title)}
                          title="Delete Hero"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          THREE-COLUMN EDIT HERO MODAL (MATCHING VISUAL REFERENCE IMAGE)
          ==================================================================== */}
      {isDrawerOpen && (
        <div className="edit-hero-modal-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="edit-hero-modal-container" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="edit-hero-header">
              <div>
                <h3 className="edit-hero-header-title">
                  <Leaf size={20} color="#2F6B43" />
                  Edit Hero
                </h3>
                <p className="edit-hero-header-sub">
                  Manage the hero section content and settings for your page.
                </p>
              </div>
              <button className="icon-action-btn" onClick={() => setIsDrawerOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body with 3 Columns & Live Preview */}
            <form onSubmit={handleSave} className="edit-hero-body">
              {/* Hero Type Selection */}
              <div className="edit-hero-type-section">
                <label className="edit-hero-type-label">Hero Type</label>
                <div className="edit-hero-type-grid">
                  {/* Type A: Home Hero */}
                  <div 
                    className={`edit-hero-type-card ${currentSlide.hero_type === 'home' ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(prev => ({ 
                      ...prev, 
                      hero_type: 'home', 
                      page: 'home',
                      assigned_pages: ['home']
                    }))}
                  >
                    <div className="edit-hero-type-radio">
                      {currentSlide.hero_type === 'home' && <div className="edit-hero-type-radio-inner" />}
                    </div>
                    <div className="edit-hero-type-icon-box">
                      <Monitor size={20} />
                    </div>
                    <div className="edit-hero-type-info">
                      <strong>Type A: Home Hero</strong>
                      <span>Content, CTAs &amp; Product Stage</span>
                    </div>
                  </div>

                  {/* Type B: Inner Banner */}
                  <div 
                    className={`edit-hero-type-card ${currentSlide.hero_type === 'inner_banner' ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(prev => ({ 
                      ...prev, 
                      hero_type: 'inner_banner', 
                      page: prev.page === 'home' ? 'shop' : prev.page,
                      assigned_pages: [prev.page === 'home' ? 'shop' : prev.page]
                    }))}
                  >
                    <div className="edit-hero-type-radio">
                      {currentSlide.hero_type === 'inner_banner' && <div className="edit-hero-type-radio-inner" />}
                    </div>
                    <div className="edit-hero-type-icon-box">
                      <ImageIcon size={20} />
                    </div>
                    <div className="edit-hero-type-info">
                      <strong>Type B: Inner Banner (No Text)</strong>
                      <span>1920 × 600 Media Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three-Column Settings Grid */}
              <div className="edit-hero-three-cols">
                {/* ── COLUMN 1: Page / Route & Content ── */}
                <div className="edit-hero-column">
                  {/* Card 1: Page / Route */}
                  <div className="edit-hero-card">
                    <h4 className="edit-hero-card-title">
                      <Globe size={16} /> 1. Page / Route
                    </h4>
                    <div className="edit-hero-field">
                      <label className="edit-hero-label">Assigned Page / Route *</label>
                      <select 
                        className="edit-hero-select"
                        value={currentSlide.page}
                        onChange={(e) => {
                          const selectedPage = e.target.value;
                          setCurrentSlide(prev => ({ 
                            ...prev, 
                            page: selectedPage,
                            assigned_pages: [selectedPage],
                            hero_type: selectedPage === 'home' ? 'home' : 'inner_banner'
                          }));
                        }}
                      >
                        {AVAILABLE_PAGES.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <p className="edit-hero-help">
                        Select the page where this hero will be displayed.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Content (Shown for Home, hidden for Inner Banner) */}
                  <div className="edit-hero-card">
                    <h4 className="edit-hero-card-title">
                      <Type size={16} /> 2. Content
                    </h4>
                    
                    {currentSlide.hero_type === 'home' ? (
                      <>
                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Main Headline / Title *</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            required 
                            placeholder="e.g. Tanush Natural"
                            value={currentSlide.title} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })} 
                          />
                        </div>

                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Badge / Eyebrow Text</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            placeholder="e.g. 100% Natural Product"
                            value={currentSlide.badge || ''} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, badge: e.target.value })} 
                          />
                        </div>

                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Subtitle / Description</label>
                          <textarea 
                            className="edit-hero-textarea"
                            rows={3} 
                            placeholder="e.g. Pure Ayurvedic Herbal Formulation"
                            value={currentSlide.subtitle || currentSlide.description || ''} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value, description: e.target.value })} 
                          />
                        </div>

                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Primary CTA Text</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            placeholder="e.g. Shop Collection"
                            value={currentSlide.button_text || currentSlide.buttonText || ''} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, button_text: e.target.value, buttonText: e.target.value })} 
                          />
                        </div>

                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Primary CTA Link</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            placeholder="/shop"
                            value={currentSlide.button_link || currentSlide.buttonLink || ''} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, button_link: e.target.value, buttonLink: e.target.value })} 
                          />
                        </div>

                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Secondary CTA Text</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            placeholder="e.g. Discover Tanush"
                            value={currentSlide.secondary_button_text || ''} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, secondary_button_text: e.target.value })} 
                          />
                        </div>

                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Secondary CTA Link</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            placeholder="/why-tanush"
                            value={currentSlide.secondary_button_link || ''} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, secondary_button_link: e.target.value })} 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="edit-hero-field">
                          <label className="edit-hero-label">Internal Hero Name</label>
                          <input 
                            type="text" 
                            className="edit-hero-input"
                            placeholder="e.g. Shop Page Banner"
                            value={currentSlide.title} 
                            onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })} 
                          />
                        </div>
                        <p className="edit-hero-help" style={{ color: '#2F6B43', background: 'rgba(47, 107, 67, 0.06)', padding: '10px', borderRadius: '8px' }}>
                          ✓ <strong>Inner Page Banner Mode:</strong> Headings, subtitles, and CTA buttons are omitted from the banner layout for a clean 1920 × 600 aesthetic.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* ── COLUMN 2: Media ── */}
                <div className="edit-hero-column">
                  <div className="edit-hero-card">
                    <h4 className="edit-hero-card-title">
                      <ImageIcon size={16} /> 3. Media
                    </h4>

                    <div className="edit-hero-field">
                      <label className="edit-hero-label">Media Type</label>
                      <select 
                        className="edit-hero-select"
                        value={currentSlide.media_type || 'image'}
                        onChange={(e) => setCurrentSlide({ ...currentSlide, media_type: e.target.value })}
                      >
                        <option value="image">Static Image</option>
                        <option value="video">Video Loop</option>
                      </select>
                    </div>

                    {/* Desktop Banner Media */}
                    <div className="edit-hero-field">
                      <label className="edit-hero-label">
                        Desktop Banner Media (1920 × 600) *
                      </label>
                      <div className="edit-hero-media-preview-box desktop-ratio">
                        <img 
                          src={currentSlide.image || '/images/lifestyle/thoughtful-3.jpg'} 
                          alt="Desktop Hero" 
                          className="edit-hero-media-img"
                          style={{ objectPosition: currentSlide.image_position || 'center' }}
                        />
                        <button 
                          type="button" 
                          className="edit-hero-delete-media-btn"
                          onClick={() => setCurrentSlide(prev => ({ ...prev, image: '' }))}
                          title="Remove image"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="edit-hero-media-actions">
                        <label className="btn-media-action">
                          <Upload size={14} />
                          <span>Change Desktop Image</span>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*,video/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => handleFileUpload(e.target.files, false)} 
                          />
                        </label>
                        <button 
                          type="button" 
                          className="btn-media-action"
                          onClick={() => {
                            setMediaPickerTarget('desktop');
                            setShowMediaPicker(true);
                          }}
                        >
                          <FolderOpen size={14} />
                          <span>Choose from Media Library</span>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Banner Media */}
                    <div className="edit-hero-field">
                      <label className="edit-hero-label">
                        Mobile Banner Media (Optional)
                      </label>
                      <div className="edit-hero-help" style={{ marginBottom: '6px' }}>
                        (Recommended: 1080 × 900)
                      </div>
                      <div className="edit-hero-media-preview-box mobile-ratio">
                        <img 
                          src={currentSlide.mobile_image || currentSlide.image || '/images/lifestyle/thoughtful-3.jpg'} 
                          alt="Mobile Hero" 
                          className="edit-hero-media-img"
                        />
                        {currentSlide.mobile_image && (
                          <button 
                            type="button" 
                            className="edit-hero-delete-media-btn"
                            onClick={() => setCurrentSlide(prev => ({ ...prev, mobile_image: '' }))}
                            title="Remove mobile image"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="edit-hero-media-actions">
                        <label className="btn-media-action">
                          <Upload size={14} />
                          <span>Change Mobile Image</span>
                          <input 
                            type="file" 
                            ref={mobileFileInputRef} 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => handleFileUpload(e.target.files, true)} 
                          />
                        </label>
                        <button 
                          type="button" 
                          className="btn-media-action"
                          onClick={() => {
                            setMediaPickerTarget('mobile');
                            setShowMediaPicker(true);
                          }}
                        >
                          <FolderOpen size={14} />
                          <span>Choose from Media Library</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── COLUMN 3: Display Settings & Status ── */}
                <div className="edit-hero-column">
                  {/* Card 4: Display Settings */}
                  <div className="edit-hero-card">
                    <h4 className="edit-hero-card-title">
                      <Sliders size={16} /> 4. Display Settings
                    </h4>

                    <div className="edit-hero-field">
                      <label className="edit-hero-label">Image Focus Position</label>
                      <select 
                        className="edit-hero-select"
                        value={currentSlide.image_position || 'center'}
                        onChange={(e) => setCurrentSlide({ ...currentSlide, image_position: e.target.value })}
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div className="edit-hero-field">
                      <label className="edit-hero-label">Overlay Shading</label>
                      <select 
                        className="edit-hero-select"
                        value={currentSlide.overlay || 'none'}
                        onChange={(e) => setCurrentSlide({ ...currentSlide, overlay: e.target.value })}
                      >
                        <option value="none">None (Natural Photography)</option>
                        <option value="subtle">Subtle Soft Shading</option>
                      </select>
                    </div>

                    <div className="edit-hero-toggle-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38493B' }}>Enable Parallax Effect</span>
                        <Info size={13} color="#728274" />
                      </div>
                      <label className="edit-hero-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={Boolean(currentSlide.parallax)}
                          onChange={e => setCurrentSlide({ ...currentSlide, parallax: e.target.checked })}
                        />
                        <span className="edit-hero-toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  {/* Card 5: Status & Visibility */}
                  <div className="edit-hero-card">
                    <h4 className="edit-hero-card-title">
                      <ShieldCheck size={16} /> 5. Status &amp; Visibility
                    </h4>

                    <div className="edit-hero-field">
                      <label className="edit-hero-label">Publishing Status</label>
                      <select 
                        className="edit-hero-select"
                        value={currentSlide.status || 'published'}
                        onChange={(e) => setCurrentSlide({ ...currentSlide, status: e.target.value })}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Admin Only)</option>
                      </select>
                    </div>

                    <div className="edit-hero-toggle-row" style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38493B' }}>Active on public page</span>
                      <label className="edit-hero-toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={currentSlide.is_active !== false && currentSlide.status !== 'draft'}
                          onChange={e => setCurrentSlide({ 
                            ...currentSlide, 
                            is_active: e.target.checked,
                            status: e.target.checked ? 'published' : 'draft'
                          })}
                        />
                        <span className="edit-hero-toggle-slider"></span>
                      </label>
                    </div>

                    {/* Schedule */}
                    <div className="edit-hero-field">
                      <label className="edit-hero-label">Schedule (Optional)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#637365', marginBottom: '2px', display: 'block' }}>Start Date</label>
                          <input 
                            type="date" 
                            className="edit-hero-input"
                            value={currentSlide.start_date || ''}
                            onChange={(e) => setCurrentSlide({ ...currentSlide, start_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#637365', marginBottom: '2px', display: 'block' }}>End Date</label>
                          <input 
                            type="date" 
                            className="edit-hero-input"
                            value={currentSlide.end_date || ''}
                            onChange={(e) => setCurrentSlide({ ...currentSlide, end_date: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── FULL WIDTH LIVE PREVIEW ── */}
              <div className="edit-hero-live-preview-card">
                <div className="edit-hero-preview-header">
                  <div>
                    <h4 className="edit-hero-card-title" style={{ margin: 0 }}>
                      <Eye size={16} /> Live Preview
                    </h4>
                    <p className="edit-hero-help" style={{ margin: '2px 0 0 0' }}>
                      This is how your hero will appear on the selected page.
                    </p>
                  </div>

                  <div className="edit-hero-device-pills">
                    <button 
                      type="button" 
                      className={`btn-device-pill ${previewDevice === 'desktop' ? 'active' : ''}`}
                      onClick={() => setPreviewDevice('desktop')}
                      title="Desktop View (1920x600)"
                    >
                      <Monitor size={15} />
                    </button>
                    <button 
                      type="button" 
                      className={`btn-device-pill ${previewDevice === 'tablet' ? 'active' : ''}`}
                      onClick={() => setPreviewDevice('tablet')}
                      title="Tablet View"
                    >
                      <Tablet size={15} />
                    </button>
                    <button 
                      type="button" 
                      className={`btn-device-pill ${previewDevice === 'mobile' ? 'active' : ''}`}
                      onClick={() => setPreviewDevice('mobile')}
                      title="Mobile View"
                    >
                      <Smartphone size={15} />
                    </button>
                  </div>
                </div>

                <div className={`edit-hero-preview-stage ${previewDevice}-mode`}>
                  {currentSlide.hero_type === 'inner_banner' ? (
                    /* Type B: Inner Banner Pure Visual Preview */
                    <img 
                      src={(previewDevice === 'mobile' && currentSlide.mobile_image) ? currentSlide.mobile_image : (currentSlide.image || '/images/lifestyle/thoughtful-3.jpg')} 
                      alt="Banner Preview"
                      className="preview-inner-banner-img"
                      style={{ objectPosition: currentSlide.image_position || 'center' }}
                    />
                  ) : (
                    /* Type A: Home Hero Interactive Content Preview */
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img 
                        src={(previewDevice === 'mobile' && currentSlide.mobile_image) ? currentSlide.mobile_image : (currentSlide.image || '/images/hero/hero-1.jpg')} 
                        alt="Home Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: currentSlide.image_position || 'center' }}
                      />
                      <div className="preview-home-content-overlay">
                        <div style={{ maxWidth: previewDevice === 'mobile' ? '100%' : '440px' }}>
                          {currentSlide.badge && (
                            <span style={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              backdropFilter: 'blur(8px)', 
                              color: '#fff', 
                              padding: '3px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.68rem', 
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em'
                            }}>
                              {currentSlide.badge}
                            </span>
                          )}
                          <h2 style={{ 
                            fontSize: previewDevice === 'mobile' ? '1.2rem' : '1.8rem', 
                            margin: '8px 0 4px 0', 
                            fontFamily: 'var(--font-serif)', 
                            color: '#fff',
                            lineHeight: 1.15
                          }}>
                            {currentSlide.title || 'Tanush Natural'}
                          </h2>
                          <p style={{ 
                            opacity: 0.85, 
                            fontSize: previewDevice === 'mobile' ? '0.75rem' : '0.82rem', 
                            margin: '0 0 14px 0', 
                            lineHeight: 1.35 
                          }}>
                            {currentSlide.subtitle || currentSlide.description || 'Pure Ayurvedic Herbal Formulation'}
                          </p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {currentSlide.button_text && (
                              <button className="btn-admin-primary" style={{ padding: '5px 12px', fontSize: '0.75rem' }}>
                                {currentSlide.button_text} &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky / Bottom Footer */}
              <div className="edit-hero-footer">
                <button type="button" className="btn-admin-secondary" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  <Save size={16} /> Save Hero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={showMediaPicker}
        filterType="image"
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => {
          if (mediaPickerTarget === 'mobile') {
            setCurrentSlide(prev => ({ ...prev, mobile_image: url }));
          } else {
            setCurrentSlide(prev => ({ ...prev, image: url }));
          }
        }}
      />
    </div>
  );
};

export default HeroManager;
