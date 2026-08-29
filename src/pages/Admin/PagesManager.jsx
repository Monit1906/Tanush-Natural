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
  X
} from 'lucide-react';
import './AdminStyles.css';

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
  const [mediaPickerTarget, setMediaPickerTarget] = useState('desktopImage'); // 'desktopImage' | 'mobileImage' | 'bgImage'
  
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
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Header */}
      <div className="admin-header-actions">
        <div>
          <h2>Page-Wise &amp; Section-Wise Website Control Studio</h2>
          <p className="text-muted">
            Configure every page, manage section order, edit content, media &amp; layouts
          </p>
        </div>
        <button 
          className="btn-admin-secondary"
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
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {PAGES_LIST.map(p => {
          const isSelected = selectedPageId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handlePageSelect(p.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #173B2F' : '1px solid rgba(23, 59, 47, 0.12)',
                background: isSelected ? '#173B2F' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#173B2F',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 6px 18px rgba(23, 59, 47, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Layout size={16} />
              <span>{p.name}</span>
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '2px 6px', 
                borderRadius: '6px', 
                background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(23, 59, 47, 0.08)',
                color: isSelected ? '#FFFFFF' : '#556B5C'
              }}>
                {p.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Page Meta Modal */}
      {isEditingPageMeta && (
        <div className="admin-form-card glass-panel" style={{ marginBottom: '24px', border: '2px solid #173B2F' }}>
          <div className="form-header">
            <h3>Page Settings — {activePageConfig.name}</h3>
            <button className="btn-admin-secondary btn-sm" onClick={() => setIsEditingPageMeta(false)}>
              <X size={16} /> Close
            </button>
          </div>
          <form onSubmit={handleSavePageMeta} className="admin-form">
            <div className="form-group">
              <label>Page SEO Title</label>
              <input 
                type="text" 
                value={pageMeta.seoTitle} 
                onChange={e => setPageMeta({ ...pageMeta, seoTitle: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Page Meta Description</label>
              <textarea 
                rows={2} 
                value={pageMeta.seoDescription} 
                onChange={e => setPageMeta({ ...pageMeta, seoDescription: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={pageMeta.isActive} 
                  onChange={e => setPageMeta({ ...pageMeta, isActive: e.target.checked })} 
                />
                <span>Page is Active and Accessible</span>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-admin-primary">
                <Check size={16} /> Save Page Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section List for Active Page */}
      <div className="admin-table-container glass-panel">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(23, 59, 47, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#173B2F' }}>
              {activePageConfig.name} Sections ({activePageConfig.sections?.length || 0})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6B7C73' }}>
              Sections render in the exact sequence shown below. Reorder or click Edit to modify content, images &amp; layouts.
            </p>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Order</th>
              <th>Section Name</th>
              <th>Type</th>
              <th>Heading Preview</th>
              <th>Devices</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activePageConfig.sections?.map((sec, idx) => {
              return (
                <tr key={sec.id} style={{ opacity: sec.isActive ? 1 : 0.6 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 800, color: '#173B2F', width: '20px' }}>0{idx + 1}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, -1)}
                          style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.2 : 0.8 }}
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === activePageConfig.sections.length - 1}
                          onClick={() => handleMoveSection(idx, 1)}
                          style={{ border: 'none', background: 'none', cursor: idx === activePageConfig.sections.length - 1 ? 'default' : 'pointer', opacity: idx === activePageConfig.sections.length - 1 ? 0.2 : 0.8 }}
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{sec.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#6B7C73' }}>ID: <code>{sec.id}</code></div>
                  </td>
                  <td><span className="badge-tag">{sec.type}</span></td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sec.content?.heading || sec.content?.title || <span style={{ color: '#999' }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', color: '#556B5C' }}>
                      {sec.visibility?.desktop !== false ? <Monitor size={15} color="#2F6B43" title="Desktop Visible" /> : <Monitor size={15} style={{ opacity: 0.3 }} />}
                      {sec.visibility?.tablet !== false ? <Tablet size={15} color="#2F6B43" title="Tablet Visible" /> : <Tablet size={15} style={{ opacity: 0.3 }} />}
                      {sec.visibility?.mobile !== false ? <Smartphone size={15} color="#2F6B43" title="Mobile Visible" /> : <Smartphone size={15} style={{ opacity: 0.3 }} />}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleSectionActive(sec.id)}
                      style={{
                        border: 'none',
                        background: sec.isActive ? '#EBF4EC' : '#F5F5F5',
                        color: sec.isActive ? '#2F6B43' : '#888888',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {sec.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-admin-secondary btn-sm"
                      onClick={() => handleOpenEditSection(sec)}
                      style={{ padding: '6px 12px' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Section Drawer / Modal */}
      {editingSection && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditingSection(null); }}
        >
          <div 
            style={{
              width: '640px',
              maxWidth: '90vw',
              background: '#FAF8F5',
              height: '100%',
              overflowY: 'auto',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '20px 24px', background: '#FFFFFF', borderBottom: '1px solid rgba(23, 59, 47, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7C73', textTransform: 'uppercase' }}>
                  {activePageConfig.name} → Section
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.2rem', color: '#173B2F' }}>
                  {editingSection.name}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingSection(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', background: '#FFFFFF', borderBottom: '1px solid rgba(23, 59, 47, 0.08)', padding: '0 20px' }}>
              {[
                { id: 'content', label: 'Content', icon: Type },
                { id: 'media', label: 'Media & Images', icon: ImageIcon },
                { id: 'layout', label: 'Layout & Style', icon: Sliders },
                { id: 'visibility', label: 'Visibility', icon: Eye }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = editTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditTab(tab.id)}
                    style={{
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      borderBottom: isActive ? '3px solid #173B2F' : '3px solid transparent',
                      color: isActive ? '#173B2F' : '#6B7C73',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleSaveEditedSection} style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* TAB 1: CONTENT */}
              {editTab === 'content' && (
                <div>
                  <div className="form-group">
                    <label>Badge / Tagline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 100% BOTANICAL & SAFE"
                      value={editingSection.content?.badge || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, badge: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Heading / Title</label>
                    <input 
                      type="text" 
                      value={editingSection.content?.heading || editingSection.content?.title || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, heading: e.target.value, title: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Subheading / Subtitle</label>
                    <input 
                      type="text" 
                      value={editingSection.content?.subheading || editingSection.content?.subtitle || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, subheading: e.target.value, subtitle: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description / Storyline</label>
                    <textarea 
                      rows={4} 
                      value={editingSection.content?.description || ''} 
                      onChange={e => setEditingSection({
                        ...editingSection,
                        content: { ...editingSection.content, description: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
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
                    <div className="form-group flex-1">
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

                  <div className="form-row">
                    <div className="form-group flex-1">
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
                    <div className="form-group flex-1">
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

                  {/* Context Specific Contact / Partner Details */}
                  {(selectedPageId === 'contact' || selectedPageId === 'become-a-partner') && (
                    <div style={{ marginTop: '16px', padding: '16px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid rgba(23, 59, 47, 0.1)' }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#173B2F' }}>Contact &amp; WhatsApp Direct Integration</h4>
                      <div className="form-group">
                        <label>WhatsApp Contact Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +919428231144"
                          value={editingSection.content?.whatsapp || editingSection.content?.whatsappNumber || ''} 
                          onChange={e => setEditingSection({
                            ...editingSection,
                            content: { ...editingSection.content, whatsapp: e.target.value, whatsappNumber: e.target.value }
                          })}
                        />
                      </div>
                      {selectedPageId === 'contact' && (
                        <>
                          <div className="form-group">
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
                          <div className="form-group">
                            <label>Support Email</label>
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
                <div>
                  <div className="form-group">
                    <label>Desktop Image / Banner</label>
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
                      >
                        <FolderOpen size={14} /> Choose
                      </button>
                    </div>
                  </div>

                  {editingSection.media?.desktopImage && (
                    <div style={{ marginBottom: '16px', borderRadius: '10px', overflow: 'hidden', height: '140px', background: '#EAEAEA' }}>
                      <img 
                        src={editingSection.media.desktopImage} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Mobile Image (Optional)</label>
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
                      >
                        <FolderOpen size={14} /> Choose
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Background Video URL (Optional MP4)</label>
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
                <div>
                  <div className="form-group">
                    <label>Background Color / Theme</label>
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
                            padding: '10px 6px',
                            borderRadius: '8px',
                            background: bg.val,
                            color: bg.val === '#173B2F' ? '#FFFFFF' : '#173B2F',
                            border: editingSection.layout?.bgColor === bg.val ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.1)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Content Alignment</label>
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

                  <div className="form-group">
                    <label>Section Spacing</label>
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
                <div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#FFFFFF', borderRadius: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={editingSection.isActive !== false} 
                        onChange={e => setEditingSection({
                          ...editingSection,
                          isActive: e.target.checked
                        })}
                      />
                      <div>
                        <strong>Section is Active on Public Website</strong>
                        <div style={{ fontSize: '0.74rem', color: '#6B7C73' }}>Uncheck to disable without losing your configuration.</div>
                      </div>
                    </label>
                  </div>

                  <div style={{ marginTop: '16px', padding: '16px', background: '#FFFFFF', borderRadius: '10px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#173B2F' }}>Device Breakpoint Display</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingSection.visibility?.desktop !== false}
                          onChange={e => setEditingSection({
                            ...editingSection,
                            visibility: { ...editingSection.visibility, desktop: e.target.checked }
                          })}
                        />
                        <span>Visible on Desktop Monitors</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingSection.visibility?.tablet !== false}
                          onChange={e => setEditingSection({
                            ...editingSection,
                            visibility: { ...editingSection.visibility, tablet: e.target.checked }
                          })}
                        />
                        <span>Visible on Tablets &amp; iPads</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editingSection.visibility?.mobile !== false}
                          onChange={e => setEditingSection({
                            ...editingSection,
                            visibility: { ...editingSection.visibility, mobile: e.target.checked }
                          })}
                        />
                        <span>Visible on Mobile Smartphones</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Drawer Footer Actions */}
              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(23, 59, 47, 0.1)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
