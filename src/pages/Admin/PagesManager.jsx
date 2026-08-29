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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Video,
  Phone,
  Mail,
  CheckCircle,
  Link2
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

const THEME_PRESETS = [
  { id: '#FAF8F5', label: 'Ivory Cream', color: '#FAF8F5', textColor: '#173B2F', border: '#DCD6CB' },
  { id: '#FFFFFF', label: 'Clean White', color: '#FFFFFF', textColor: '#173B2F', border: '#E2E8F0' },
  { id: '#173B2F', label: 'Deep Forest', color: '#173B2F', textColor: '#FFFFFF', border: '#255444' },
  { id: '#EBF4EC', label: 'Soft Sage', color: '#EBF4EC', textColor: '#173B2F', border: '#C7DEC9' }
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
              {/* TAB 1: CONTENT & COPY */}
              {editTab === 'content' && (
                <>
                  {/* Card A: Core Messaging */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <Type size={15} color="#2F6B43" /> Typography &amp; Headlines
                    </h4>

                    <div className="form-group-clean">
                      <label>
                        <span>Badge / Eyebrow Text</span>
                        <span className="form-label-hint">Pill tag shown above title</span>
                      </label>
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
                      <label>
                        <span>Main Headline / Heading</span>
                        <span className="form-label-hint">Primary section title</span>
                      </label>
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
                      <label>
                        <span>Subheading / Tagline</span>
                        <span className="form-label-hint">Supporting sentence</span>
                      </label>
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
                      <label>
                        <span>Body Description / Narrative</span>
                        <span className="form-label-hint">Full story or paragraph</span>
                      </label>
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
                  </div>

                  {/* Card B: Call-To-Action Buttons */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <Link2 size={15} color="#2F6B43" /> Action Buttons &amp; Navigation Links
                    </h4>

                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div className="form-group-clean" style={{ flex: 1 }}>
                        <label>Primary Button Text</label>
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
                        <label>Primary Button Link</label>
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

                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div className="form-group-clean" style={{ flex: 1 }}>
                        <label>Secondary Button Text</label>
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
                        <label>Secondary Button Link</label>
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
                  </div>

                  {/* Context Specific Contact / Partner Details */}
                  {(selectedPageId === 'contact' || selectedPageId === 'become-a-partner') && (
                    <div className="form-card-section">
                      <h4 className="form-card-title">
                        <Phone size={15} color="#2F6B43" /> Direct WhatsApp &amp; Routing
                      </h4>

                      <div className="form-group-clean">
                        <label>WhatsApp Contact Number</label>
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
                          <div className="form-group-clean">
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
                          <div className="form-group-clean">
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
                </>
              )}

              {/* TAB 2: MEDIA & IMAGERY */}
              {editTab === 'media' && (
                <>
                  {/* Desktop Banner */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <ImageIcon size={15} color="#2F6B43" /> Desktop Image &amp; Banner Stage
                    </h4>

                    <div className="form-group-clean">
                      <label>
                        <span>Image Source URL</span>
                        <span className="form-label-hint">Standard / High-res Banner</span>
                      </label>
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
                          className="media-action-pill-btn"
                          onClick={() => openMediaPickerFor('desktopImage')}
                        >
                          <FolderOpen size={15} /> Choose Media
                        </button>
                      </div>
                    </div>

                    {editingSection.media?.desktopImage && (
                      <div className="media-preview-container">
                        <img 
                          src={editingSection.media.desktopImage} 
                          alt="Desktop Banner Preview" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Mobile Banner & Video */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <Smartphone size={15} color="#2F6B43" /> Mobile Optimization &amp; Video URL
                    </h4>

                    <div className="form-group-clean">
                      <label>
                        <span>Mobile Specific Banner (Optional)</span>
                        <span className="form-label-hint">Portrait crop for smartphones</span>
                      </label>
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
                          className="media-action-pill-btn"
                          onClick={() => openMediaPickerFor('mobileImage')}
                        >
                          <FolderOpen size={15} /> Choose Media
                        </button>
                      </div>
                    </div>

                    <div className="form-group-clean">
                      <label>
                        <span>Background Video URL (Optional MP4 stream)</span>
                        <span className="form-label-hint">Direct MP4 or CDN URL</span>
                      </label>
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
                </>
              )}

              {/* TAB 3: THEME & STYLE */}
              {editTab === 'layout' && (
                <>
                  {/* Theme Swatch Grid */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <Sliders size={15} color="#2F6B43" /> Background Theme Palette
                    </h4>
                    
                    <div className="theme-swatch-grid">
                      {THEME_PRESETS.map(bg => {
                        const isSelected = (editingSection.layout?.bgColor || '#FAF8F5') === bg.id;
                        return (
                          <div
                            key={bg.id}
                            className={`theme-swatch-tile ${isSelected ? 'active' : ''}`}
                            onClick={() => setEditingSection({
                              ...editingSection,
                              layout: { ...editingSection.layout, bgColor: bg.id }
                            })}
                            style={{
                              background: bg.color,
                              color: bg.textColor,
                              border: `2px solid ${bg.border}`
                            }}
                          >
                            <span 
                              className="theme-circle-dot" 
                              style={{ background: bg.color, borderColor: bg.border }} 
                            />
                            <span className="theme-tile-label">{bg.label}</span>
                            {isSelected && (
                              <CheckCircle size={14} color={bg.id === '#173B2F' ? '#D4AF37' : '#2F6B43'} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content Alignment & Spacing */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <Layout size={15} color="#2F6B43" /> Alignment &amp; Vertical Canvas Spacing
                    </h4>

                    <div className="form-group-clean">
                      <label>Content Alignment</label>
                      <div className="segmented-button-row">
                        {[
                          { val: 'left', label: 'Left Aligned', icon: AlignLeft },
                          { val: 'center', label: 'Centered', icon: AlignCenter },
                          { val: 'right', label: 'Right Aligned', icon: AlignRight }
                        ].map(alignItem => {
                          const Icon = alignItem.icon;
                          const isAlignSelected = (editingSection.layout?.align || 'center') === alignItem.val;
                          return (
                            <button
                              key={alignItem.val}
                              type="button"
                              className={`segmented-btn-item ${isAlignSelected ? 'active' : ''}`}
                              onClick={() => setEditingSection({
                                ...editingSection,
                                layout: { ...editingSection.layout, align: alignItem.val }
                              })}
                            >
                              <Icon size={14} />
                              <span>{alignItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group-clean">
                      <label>Section Vertical Spacing (Padding)</label>
                      <div className="segmented-button-row">
                        {[
                          { val: 'compact', label: 'Compact (30px)' },
                          { val: 'normal', label: 'Balanced (60px)' },
                          { val: 'spacious', label: 'Spacious (100px)' }
                        ].map(spaceItem => {
                          const isSpaceSelected = (editingSection.layout?.spacing || 'normal') === spaceItem.val;
                          return (
                            <button
                              key={spaceItem.val}
                              type="button"
                              className={`segmented-btn-item ${isSpaceSelected ? 'active' : ''}`}
                              onClick={() => setEditingSection({
                                ...editingSection,
                                layout: { ...editingSection.layout, spacing: spaceItem.val }
                              })}
                            >
                              <span>{spaceItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 4: VISIBILITY & DEVICES */}
              {editTab === 'visibility' && (
                <>
                  {/* Master Active Status */}
                  <div className="visibility-main-card">
                    <div className="visibility-card-info">
                      <h4 className="visibility-card-title">
                        {editingSection.isActive !== false ? '🟢 Section is Active on Website' : '⚪ Section is Currently Hidden'}
                      </h4>
                      <p className="visibility-card-desc">
                        Toggle this switch to show or hide the section from visitors without deleting any configured copy or media assets.
                      </p>
                    </div>

                    <label className="status-toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={editingSection.isActive !== false} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          isActive: e.target.checked
                        })}
                      />
                      <span className="toggle-track">
                        <span className="toggle-thumb"></span>
                      </span>
                    </label>
                  </div>

                  {/* Device Breakpoint Tiles */}
                  <div className="form-card-section">
                    <h4 className="form-card-title">
                      <Eye size={15} color="#2F6B43" /> Responsive Device Breakpoint Display
                    </h4>

                    <div className="device-tiles-grid">
                      {/* Desktop */}
                      <div className="device-tile-card">
                        <div className="device-tile-left">
                          <div className="device-icon-box">
                            <Monitor size={17} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#173B2F' }}>Desktop Monitors &amp; Laptops</div>
                            <div style={{ fontSize: '0.74rem', color: '#7A8B7C' }}>Visible on screens &gt; 1024px</div>
                          </div>
                        </div>
                        <label className="status-toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={editingSection.visibility?.desktop !== false}
                            onChange={e => setEditingSection({
                              ...editingSection,
                              visibility: { ...editingSection.visibility, desktop: e.target.checked }
                            })}
                          />
                          <span className="toggle-track">
                            <span className="toggle-thumb"></span>
                          </span>
                        </label>
                      </div>

                      {/* Tablet */}
                      <div className="device-tile-card">
                        <div className="device-tile-left">
                          <div className="device-icon-box">
                            <Tablet size={17} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#173B2F' }}>Tablets &amp; iPads</div>
                            <div style={{ fontSize: '0.74rem', color: '#7A8B7C' }}>Visible on 768px – 1024px</div>
                          </div>
                        </div>
                        <label className="status-toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={editingSection.visibility?.tablet !== false}
                            onChange={e => setEditingSection({
                              ...editingSection,
                              visibility: { ...editingSection.visibility, tablet: e.target.checked }
                            })}
                          />
                          <span className="toggle-track">
                            <span className="toggle-thumb"></span>
                          </span>
                        </label>
                      </div>

                      {/* Mobile */}
                      <div className="device-tile-card">
                        <div className="device-tile-left">
                          <div className="device-icon-box">
                            <Smartphone size={17} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#173B2F' }}>Mobile Smartphones</div>
                            <div style={{ fontSize: '0.74rem', color: '#7A8B7C' }}>Visible on screens &lt; 768px</div>
                          </div>
                        </div>
                        <label className="status-toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={editingSection.visibility?.mobile !== false}
                            onChange={e => setEditingSection({
                              ...editingSection,
                              visibility: { ...editingSection.visibility, mobile: e.target.checked }
                            })}
                          />
                          <span className="toggle-track">
                            <span className="toggle-thumb"></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
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
