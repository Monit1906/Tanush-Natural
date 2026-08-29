import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { DEFAULT_PAGES_CONFIG, normalizePageConfig } from '../../lib/pageConfigs';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import { 
  Layout, 
  Sliders, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Edit3, 
  Image as ImageIcon, 
  Type, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  FolderOpen,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  EyeOff
} from 'lucide-react';
import './AdminStyles.css';
import './PagesManager.css';

const PAGES_LIST = [
  { id: 'home', name: 'Home', badge: '10 Sections' },
  { id: 'shop', name: 'Shop', badge: '4 Sections' },
  { id: 'why-tanush', name: 'Why Tanush', badge: '6 Sections' },
  { id: 'become-a-partner', name: 'Become a Partner', badge: '6 Sections' },
  { id: 'contact', name: 'Contact Us', badge: '4 Sections' },
  { id: 'product-detail', name: 'Product Detail', badge: '4 Sections' }
];

const PagesManager = () => {
  const [allConfigs, setAllConfigs] = useState(DEFAULT_PAGES_CONFIG);
  const [selectedPageId, setSelectedPageId] = useState('home');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  
  // Section Edit Drawer/Modal State
  const [editingSection, setEditingSection] = useState(null);
  const [editTab, setEditTab] = useState('content'); // 'content' | 'media' | 'layout' | 'visibility'
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('desktopImage'); // 'desktopImage' | 'mobileImage'
  
  // Page Settings Modal
  const [isEditingPageMeta, setIsEditingPageMeta] = useState(false);
  const [pageMeta, setPageMeta] = useState({
    seoTitle: '',
    seoDescription: '',
    isActive: true
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadAllConfigs = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPageConfigs();
      if (data && typeof data === 'object') {
        setAllConfigs(data);
      }
    } catch (e) {
      console.error('Failed loading page configs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const activePageConfig = normalizePageConfig(
    selectedPageId, 
    allConfigs[selectedPageId] || DEFAULT_PAGES_CONFIG[selectedPageId]
  );

  const handlePageSelect = (pageId) => {
    setSelectedPageId(pageId);
    setEditingSection(null);
    setIsEditingPageMeta(false);
  };

  const handleSavePageConfig = async (updatedPage) => {
    const newAll = {
      ...allConfigs,
      [selectedPageId]: updatedPage
    };
    setAllConfigs(newAll);
    await api.savePageConfig(selectedPageId, updatedPage);
    showToast(`✓ Saved "${updatedPage.name}" page configuration!`);
  };

  const handleMoveSection = async (index, direction) => {
    const targetIdx = index + direction;
    const sections = [...activePageConfig.sections];
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIdx];
    sections[targetIdx] = temp;

    // re-index orders
    sections.forEach((sec, idx) => {
      sec.order = idx;
    });

    const updated = {
      ...activePageConfig,
      sections
    };
    await handleSavePageConfig(updated);
  };

  const handleToggleSectionActive = async (sectionId) => {
    const sections = activePageConfig.sections.map(s => 
      s.id === sectionId ? { ...s, isActive: !s.isActive } : s
    );
    const updated = { ...activePageConfig, sections };
    await handleSavePageConfig(updated);
  };

  const handleOpenEditSection = (sec) => {
    setEditingSection(JSON.parse(JSON.stringify(sec)));
    setEditTab('content');
  };

  const handleSaveEditedSection = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    const sections = activePageConfig.sections.map(s => 
      s.id === editingSection.id ? editingSection : s
    );
    const updated = { ...activePageConfig, sections };
    await handleSavePageConfig(updated);
    setEditingSection(null);
  };

  const handleSavePageMeta = async (e) => {
    e.preventDefault();
    const updated = {
      ...activePageConfig,
      seoTitle: pageMeta.seoTitle,
      seoDescription: pageMeta.seoDescription,
      isActive: pageMeta.isActive
    };
    await handleSavePageConfig(updated);
    setIsEditingPageMeta(false);
  };

  const openMediaPickerFor = (targetField) => {
    setMediaPickerTarget(targetField);
    setShowMediaPicker(true);
  };

  const handleMediaSelect = (url) => {
    if (editingSection) {
      setEditingSection(prev => ({
        ...prev,
        media: {
          ...(prev.media || {}),
          [mediaPickerTarget]: url
        }
      }));
    }
    setShowMediaPicker(false);
  };

  return (
    <div className="pages-studio-container">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Soothing Header Hero Banner */}
      <div className="pages-studio-header">
        <div>
          <h2>Page-Wise &amp; Section-Wise Website Studio</h2>
          <p>
            Seamlessly orchestrate every public page. Manage section sequence, headlines, media imagery, device visibility, and layouts with real-time site synchronization.
          </p>
        </div>
        <button 
          className="pages-meta-btn"
          onClick={() => {
            setPageMeta({
              seoTitle: activePageConfig.seoTitle || '',
              seoDescription: activePageConfig.seoDescription || '',
              isActive: activePageConfig.isActive !== false
            });
            setIsEditingPageMeta(true);
          }}
        >
          <Globe size={16} /> Page Settings &amp; SEO
        </button>
      </div>

      {/* Page Navigation Selector Tabs */}
      <div className="pages-nav-pills-bar">
        {PAGES_LIST.map(p => {
          const isSelected = selectedPageId === p.id;
          return (
            <button
              key={p.id}
              className={`page-nav-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handlePageSelect(p.id)}
            >
              <Layout size={16} />
              <span>{p.name}</span>
              <span className="page-badge-counter">
                {p.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Page Meta Modal */}
      {isEditingPageMeta && (
        <div className="admin-form-card glass-panel" style={{ border: '2px solid #173B2F', borderRadius: '18px' }}>
          <div className="form-header">
            <h3>Page Settings — {activePageConfig.name}</h3>
            <button className="btn-admin-secondary btn-sm" onClick={() => setIsEditingPageMeta(false)}>
              <X size={16} /> Close
            </button>
          </div>
          <form onSubmit={handleSavePageMeta} className="admin-form">
            <div className="form-group-clean">
              <label>Page SEO Title</label>
              <input 
                type="text" 
                value={pageMeta.seoTitle} 
                onChange={e => setPageMeta({ ...pageMeta, seoTitle: e.target.value })} 
              />
            </div>
            <div className="form-group-clean">
              <label>Page Meta Description</label>
              <textarea 
                rows={2} 
                value={pageMeta.seoDescription} 
                onChange={e => setPageMeta({ ...pageMeta, seoDescription: e.target.value })} 
              />
            </div>
            <div className="form-group-clean">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={pageMeta.isActive} 
                  onChange={e => setPageMeta({ ...pageMeta, isActive: e.target.checked })} 
                />
                <span>Page is Active and Accessible to Public Visitors</span>
              </label>
            </div>
            <div className="form-actions" style={{ marginTop: '12px' }}>
              <button type="submit" className="btn-admin-primary">
                <Check size={16} /> Save Page Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Enhanced Interactive Section Canvas */}
      <div className="sections-canvas-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#173B2F', fontWeight: 700 }}>
              {activePageConfig.name} Layout Canvas ({activePageConfig.sections?.length || 0} Sections)
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#6B7C73' }}>
              Sections render in the exact physical order from top to bottom. Click Edit to customize content, images, and device visibility.
            </p>
          </div>
        </div>

        {activePageConfig.sections?.map((sec, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === activePageConfig.sections.length - 1;
          const isSecActive = sec.isActive !== false;

          return (
            <div 
              key={sec.id} 
              className={`section-canvas-card ${!isSecActive ? 'disabled' : ''}`}
            >
              {/* Left Sequence & Info */}
              <div className="section-card-left">
                <div className="section-order-control">
                  <button
                    type="button"
                    className="order-arrow-btn"
                    disabled={isFirst}
                    onClick={() => handleMoveSection(idx, -1)}
                    title="Move Section Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  
                  <div className="order-num-badge">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>

                  <button
                    type="button"
                    className="order-arrow-btn"
                    disabled={isLast}
                    onClick={() => handleMoveSection(idx, 1)}
                    title="Move Section Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="section-info-block">
                  <div className="section-name-row">
                    <h4 className="section-title-text">{sec.name}</h4>
                    <span className="section-type-pill">{sec.type}</span>
                  </div>
                  <p className="section-heading-snippet">
                    {sec.content?.heading || sec.content?.title ? (
                      `"${sec.content?.heading || sec.content?.title}"`
                    ) : (
                      <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Standard Dynamic Feed Section</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Device Badges & Action Controls */}
              <div className="section-card-right">
                {/* Device Badges */}
                <div className="section-device-strip">
                  <span className={`device-icon-tag ${sec.visibility?.desktop === false ? 'dimmed' : ''}`} title="Desktop">
                    <Monitor size={15} />
                  </span>
                  <span className={`device-icon-tag ${sec.visibility?.tablet === false ? 'dimmed' : ''}`} title="Tablet">
                    <Tablet size={15} />
                  </span>
                  <span className={`device-icon-tag ${sec.visibility?.mobile === false ? 'dimmed' : ''}`} title="Mobile">
                    <Smartphone size={15} />
                  </span>
                </div>

                {/* Status Toggle Switch */}
                <label className="status-toggle-switch" title={isSecActive ? "Section is Visible" : "Section is Hidden"}>
                  <input 
                    type="checkbox"
                    checked={isSecActive}
                    onChange={() => handleToggleSectionActive(sec.id)}
                  />
                  <span className="toggle-track">
                    <span className="toggle-thumb"></span>
                  </span>
                  <span className="toggle-label-text">
                    {isSecActive ? 'Active' : 'Off'}
                  </span>
                </label>

                {/* Edit Button */}
                <button
                  type="button"
                  className="section-edit-btn"
                  onClick={() => handleOpenEditSection(sec)}
                >
                  <Edit3 size={14} /> Edit Section
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-End Slide-In Studio Inspector Drawer */}
      {editingSection && (
        <div 
          className="drawer-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingSection(null); }}
        >
          <div className="drawer-panel">
            {/* Drawer Header */}
            <div style={{ padding: '24px 28px', background: '#FFFFFF', borderBottom: '1px solid rgba(23, 59, 47, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#6B7C73', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activePageConfig.name} → Section Studio
                </span>
                <h3 style={{ margin: '3px 0 0', fontSize: '1.25rem', color: '#173B2F', fontWeight: 700 }}>
                  {editingSection.name}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingSection(null)}
                style={{ border: 'none', background: 'rgba(23, 59, 47, 0.06)', cursor: 'pointer', padding: '8px', borderRadius: '10px', color: '#173B2F' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* LIVE VISUAL PREVIEW STAGE */}
            <div className="studio-live-preview-stage">
              <div className="live-preview-header">
                <span className="live-preview-tag">
                  <Sparkles size={13} color="#D4AF37" /> Live Studio Preview
                </span>
                <span style={{ fontSize: '0.72rem', color: '#6B7C73' }}>
                  Theme: {editingSection.layout?.bgColor || '#FAF8F5'}
                </span>
              </div>
              
              <div 
                className="live-preview-canvas-box"
                style={{
                  backgroundColor: editingSection.layout?.bgColor || '#FAF8F5',
                  color: editingSection.layout?.bgColor === '#173B2F' ? '#FFFFFF' : '#173B2F',
                  textAlign: editingSection.layout?.align || 'center'
                }}
              >
                {editingSection.content?.badge && (
                  <span className="preview-badge-pill">{editingSection.content.badge}</span>
                )}

                <h4 className="preview-heading-text">
                  {editingSection.content?.heading || editingSection.content?.title || editingSection.name}
                </h4>

                {(editingSection.content?.subheading || editingSection.content?.subtitle) && (
                  <p className="preview-subheading-text">
                    {editingSection.content?.subheading || editingSection.content?.subtitle}
                  </p>
                )}

                {editingSection.content?.description && (
                  <p className="preview-desc-text">
                    {editingSection.content.description}
                  </p>
                )}

                {(editingSection.content?.primaryCtaText || editingSection.content?.secondaryCtaText) && (
                  <div className="preview-buttons-row">
                    {editingSection.content?.primaryCtaText && (
                      <span className="preview-btn-primary">
                        {editingSection.content.primaryCtaText}
                      </span>
                    )}
                    {editingSection.content?.secondaryCtaText && (
                      <span className="preview-btn-secondary">
                        {editingSection.content.secondaryCtaText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Tabs — Luxury Segmented Pill Control */}
            <div className="drawer-tabs-wrapper">
              <div className="drawer-tabs-bar">
                {[
                  { id: 'content', label: 'Content & Copy', icon: Type },
                  { id: 'media', label: 'Media & Imagery', icon: ImageIcon },
                  { id: 'layout', label: 'Theme & Style', icon: Sliders },
                  { id: 'visibility', label: 'Visibility', icon: Eye }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = editTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`drawer-tab-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setEditTab(tab.id)}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleSaveEditedSection} className="drawer-form-body">
              {/* TAB 1: CONTENT */}
              {editTab === 'content' && (
                <div className="form-card-section">
                  <div className="form-group-clean">
                    <label>Badge / Eyebrow Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 100% BOTANICAL & NATURAL"
                      value={editingSection.content?.badge || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, badge: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Main Headline / Heading</label>
                    <input 
                      type="text" 
                      placeholder="Section headline"
                      value={editingSection.content?.heading || editingSection.content?.title || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, heading: e.target.value, title: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Subheading / Tagline</label>
                    <input 
                      type="text" 
                      placeholder="Brief supporting line"
                      value={editingSection.content?.subheading || editingSection.content?.subtitle || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, subheading: e.target.value, subtitle: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>Body Description / Narrative</label>
                    <textarea 
                      rows={4} 
                      placeholder="Enter detailed copy or storyline..."
                      value={editingSection.content?.description || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, description: e.target.value }
                      })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="form-group-clean" style={{ flex: 1 }}>
                      <label>Primary CTA Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. EXPLORE PRODUCTS"
                        value={editingSection.content?.primaryCtaText || ''} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, primaryCtaText: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group-clean" style={{ flex: 1 }}>
                      <label>Primary CTA Link</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /shop"
                        value={editingSection.content?.primaryCtaLink || ''} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, primaryCtaLink: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="form-group-clean" style={{ flex: 1 }}>
                      <label>Secondary CTA Text</label>
                      <input 
                        type="text" 
                        placeholder="e.g. OUR STORY"
                        value={editingSection.content?.secondaryCtaText || ''} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, secondaryCtaText: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group-clean" style={{ flex: 1 }}>
                      <label>Secondary CTA Link</label>
                      <input 
                        type="text" 
                        placeholder="e.g. /why-tanush"
                        value={editingSection.content?.secondaryCtaLink || ''} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, secondaryCtaLink: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  {/* Context Specific Contact / Partner Details */}
                  {(selectedPageId === 'contact' || selectedPageId === 'become-a-partner') && (
                    <div style={{ marginTop: '10px', padding: '16px', background: '#FAF8F5', borderRadius: '12px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#173B2F', fontWeight: 700 }}>Direct WhatsApp &amp; Routing</h4>
                      <div className="form-group-clean">
                        <label>WhatsApp Number</label>
                        <input 
                          type="text" 
                          placeholder="+919428231144"
                          value={editingSection.content?.whatsapp || editingSection.content?.whatsappNumber || ''} 
                          onChange={e => setEditingSection({
                            ...editingSection,
                            content: { ...editingSection.content, whatsapp: e.target.value, whatsappNumber: e.target.value }
                          })}
                        />
                      </div>
                      {selectedPageId === 'contact' && (
                        <>
                          <div className="form-group-clean" style={{ marginTop: '10px' }}>
                            <label>Customer Support Phone</label>
                            <input 
                              type="text" 
                              value={editingSection.content?.phone || ''} 
                              onChange={e => setEditingSection({
                                ...editingSection,
                                content: { ...editingSection.content, phone: e.target.value }
                              })}
                            />
                          </div>
                          <div className="form-group-clean" style={{ marginTop: '10px' }}>
                            <label>Support Email Address</label>
                            <input 
                              type="email" 
                              value={editingSection.content?.email || ''} 
                              onChange={e => setEditingSection({
                                ...editingSection,
                                content: { ...editingSection.content, email: e.target.value }
                              })}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MEDIA */}
              {editTab === 'media' && (
                <div className="form-card-section">
                  <div className="form-group-clean">
                    <label>Desktop Image / Main Banner</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={editingSection.media?.desktopImage || ''} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          media: { ...editingSection.media, desktopImage: e.target.value }
                        })}
                        placeholder="/images/hero/hero-1.jpg"
                      />
                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm"
                        onClick={() => openMediaPickerFor('desktopImage')}
                        style={{ whiteSpace: 'nowrap', padding: '10px 14px' }}
                      >
                        <FolderOpen size={14} /> Choose
                      </button>
                    </div>
                  </div>

                  {editingSection.media?.desktopImage && (
                    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '140px', background: '#EAEAEA', border: '1px solid rgba(23, 59, 47, 0.1)' }}>
                      <img 
                        src={editingSection.media.desktopImage} 
                        alt="Desktop Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  )}

                  <div className="form-group-clean">
                    <label>Mobile Banner Image (Optional)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={editingSection.media?.mobileImage || ''} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          media: { ...editingSection.media, mobileImage: e.target.value }
                        })}
                        placeholder="Leave blank to use desktop image"
                      />
                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm"
                        onClick={() => openMediaPickerFor('mobileImage')}
                        style={{ whiteSpace: 'nowrap', padding: '10px 14px' }}
                      >
                        <FolderOpen size={14} /> Choose
                      </button>
                    </div>
                  </div>

                  <div className="form-group-clean">
                    <label>Background Video URL (Optional MP4 stream)</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={editingSection.media?.videoUrl || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        media: { ...editingSection.media, videoUrl: e.target.value }
                      })}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: LAYOUT & STYLE */}
              {editTab === 'layout' && (
                <div className="form-card-section">
                  <div className="form-group-clean">
                    <label>Background Theme</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {[
                        { label: 'Ivory Cream', val: '#FAF8F5' },
                        { label: 'Clean White', val: '#FFFFFF' },
                        { label: 'Deep Forest', val: '#173B2F' },
                        { label: 'Soft Sage', val: '#EBF4EC' }
                      ].map(bg => (
                        <button
                          key={bg.val}
                          type="button"
                          onClick={() => setEditingSection({
                            ...editingSection,
                            layout: { ...editingSection.layout, bgColor: bg.val }
                          })}
                          style={{
                            padding: '12px 8px',
                            borderRadius: '10px',
                            background: bg.val,
                            color: bg.val === '#173B2F' ? '#FFFFFF' : '#173B2F',
                            border: editingSection.layout?.bgColor === bg.val ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.12)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group-clean">
                    <label>Content Text Alignment</label>
                    <select
                      value={editingSection.layout?.align || 'center'}
                      onChange={e => setEditingSection({
                        ...editingSection,
                        layout: { ...editingSection.layout, align: e.target.value }
                      })}
                    >
                      <option value="left">Left Aligned</option>
                      <option value="center">Centered</option>
                      <option value="right">Right Aligned</option>
                    </select>
                  </div>

                  <div className="form-group-clean">
                    <label>Section Vertical Spacing</label>
                    <select
                      value={editingSection.layout?.spacing || 'normal'}
                      onChange={e => setEditingSection({
                        ...editingSection,
                        layout: { ...editingSection.layout, spacing: e.target.value }
                      })}
                    >
                      <option value="compact">Compact (Padding 30px)</option>
                      <option value="normal">Normal (Padding 60px)</option>
                      <option value="spacious">Spacious (Padding 100px)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 4: VISIBILITY */}
              {editTab === 'visibility' && (
                <div className="form-card-section">
                  <div className="form-group-clean">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', background: '#FAF8F5', borderRadius: '12px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                      <input 
                        type="checkbox" 
                        checked={editingSection.isActive !== false} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          isActive: e.target.checked
                        })}
                      />
                      <div>
                        <strong>Section Active on Live Website</strong>
                        <div style={{ fontSize: '0.74rem', color: '#6B7C73' }}>Uncheck to temporarily hide without losing any configured content.</div>
                      </div>
                    </label>
                  </div>

                  <div style={{ marginTop: '8px', padding: '16px', background: '#FAF8F5', borderRadius: '12px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '0.86rem', color: '#173B2F', fontWeight: 700 }}>Device Breakpoint Display</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingSection.visibility?.desktop !== false}
                          onChange={e => setEditingSection({
                            ...editingSection,
                            visibility: { ...editingSection.visibility, desktop: e.target.checked }
                          })}
                        />
                        <Monitor size={16} color="#2F6B43" />
                        <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Visible on Desktop Screens</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingSection.visibility?.tablet !== false}
                          onChange={e => setEditingSection({
                            ...editingSection,
                            visibility: { ...editingSection.visibility, tablet: e.target.checked }
                          })}
                        />
                        <Tablet size={16} color="#2F6B43" />
                        <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Visible on Tablets &amp; iPads</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingSection.visibility?.mobile !== false}
                          onChange={e => setEditingSection({
                            ...editingSection,
                            visibility: { ...editingSection.visibility, mobile: e.target.checked }
                          })}
                        />
                        <Smartphone size={16} color="#2F6B43" />
                        <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Visible on Mobile Smartphones</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Drawer Sticky Save Bar */}
              <div className="drawer-sticky-footer">
                <button type="button" className="btn-admin-secondary" onClick={() => setEditingSection(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  <Check size={16} /> Save Section Changes
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
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default PagesManager;
