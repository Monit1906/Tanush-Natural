import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, Eye, EyeOff, Search, Save, X, 
  Upload, Image as ImageIcon, ArrowUp, ArrowDown, Sparkles, Check,
  LayoutGrid, List, RefreshCw, CheckCircle, Sliders, ExternalLink, Leaf,
  FileUp, Link as LinkIcon, AlertCircle
} from 'lucide-react';
import { api } from '../../lib/db';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import { AdminSkeleton } from '../../components/Skeletons/Skeleton';
import './AdminStyles.css';
import './JourneyManager.css';

// Curated high-resolution botanical photography presets from Mac 03 Posters & brand library
const BOTANICAL_PRESETS = [
  { url: '/images/posters/posters-01.png', title: 'Pure Herbal Mosquito Protection' },
  { url: '/images/posters/posters-02.png', title: 'Everyday Natural Living Ritual' },
  { url: '/images/posters/posters-03.png', title: 'Artisanal Botanical Formulation' },
  { url: '/images/posters/posters-04.png', title: 'Eco-Mindful Daily Wellness' },
  { url: '/images/posters/posters-05.png', title: 'Fresh Botanical Harvest' },
  { url: '/images/posters/posters-06.png', title: 'Pure Essential Oil Distillation' },
  { url: '/images/posters/posters-07.png', title: 'Chemical-Free Household Care' },
  { url: '/images/posters/posters-08.png', title: 'Indian Botanical Heritage' },
  { url: '/images/posters/posters-09.png', title: 'Mindful Daily Sanctuary' },
  { url: '/images/posters/posters-10.png', title: 'Authentic Botanical Alchemy' },
  { url: '/images/posters/posters-11.png', title: 'Herbal Relief & Gentle Care' },
  { url: '/images/posters/posters-12.png', title: 'Rooted in Nature Formulations' },
  { url: '/images/posters/posters-13.png', title: 'Pure Origin Botanical Blends' },
  { url: '/images/lifestyle/collage-main.jpg', title: 'Fresh Botanical Harvest (Neem & Tulsi)' },
  { url: '/images/social/social-1.jpg', title: 'Hand-Crushed Herbal Mortar Ritual' },
  { url: '/images/social/social-2.jpg', title: 'Pure Plant Oil Filtering & Extraction' },
  { url: '/images/lifestyle/thoughtful-3.jpg', title: 'Brass Cauldron Botanical Formulation' },
  { url: '/images/lifestyle/thoughtful-4.jpg', title: 'Artisanal Batch Handcrafting' },
  { url: '/images/lifestyle/thoughtful-1.jpg', title: 'Ayurvedic Botanical Alchemy' },
  { url: '/images/lifestyle/thoughtful-2.jpg', title: 'Mindful Daily Wellness Ritual' },
  { url: '/images/social/social-3.jpg', title: 'Handcrafted Botanical Elixirs' }
];

const JourneyManager = () => {
  const [sectionData, setSectionData] = useState({
    eyebrow: '07 — SOCIAL',
    heading: 'FOLLOW THE TANUSH JOURNEY',
    subtitle: "Everyday inspiration, natural living and what's new at Tanush.",
    callout_title: 'Rooted in nature,\nmade for you.',
    hashtag: '#TanushNatural',
    instagram_link: 'https://instagram.com/TanushNatural',
    items: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Drawer / Editor state
  const [editingItem, setEditingItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditingSectionTexts, setIsEditingSectionTexts] = useState(false);

  // Media Picker state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getSocialSection();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setSectionData({
          eyebrow: data.eyebrow || '07 — SOCIAL',
          heading: data.heading || 'FOLLOW THE TANUSH JOURNEY',
          subtitle: data.subtitle || "Everyday inspiration, natural living and what's new at Tanush.",
          callout_title: data.callout_title || 'Rooted in nature,\nmade for you.',
          hashtag: data.hashtag || '#TanushNatural',
          instagram_link: data.instagram_link || 'https://instagram.com/TanushNatural',
          items: data.items
        });
      } else {
        // Populate default 8 unique cards if empty
        const initialItems = BOTANICAL_PRESETS.slice(0, 8).map((preset, idx) => ({
          id: `j-${Date.now()}-${idx}`,
          image: preset.url,
          title: preset.title,
          is_active: true
        }));

        const defaultData = {
          eyebrow: '07 — SOCIAL',
          heading: 'FOLLOW THE TANUSH JOURNEY',
          subtitle: "Everyday inspiration, natural living and what's new at Tanush.",
          callout_title: 'Rooted in nature,\nmade for you.',
          hashtag: '#TanushNatural',
          instagram_link: 'https://instagram.com/TanushNatural',
          items: initialItems
        };
        setSectionData(defaultData);
        await api.saveSocialSection(defaultData);
      }
    } catch (e) {
      console.error('Failed to load social section:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (updatedData = sectionData) => {
    try {
      await api.saveSocialSection(updatedData);
      showToast('Follow the Journey gallery saved & published to storefront!');
    } catch (err) {
      console.error(err);
      showToast('Error saving journey data');
    }
  };

  const handleAddNew = () => {
    // Pick the next preset not already in items
    const usedImages = (sectionData.items || []).map(i => i.image);
    const unusedPreset = BOTANICAL_PRESETS.find(p => !usedImages.includes(p.url)) || BOTANICAL_PRESETS[0];

    setEditingItem({
      id: 'j' + Date.now(),
      image: unusedPreset.url,
      title: unusedPreset.title,
      is_active: true
    });
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsDrawerOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title || 'this photo card'}" from the Journey gallery?`)) {
      const updatedItems = sectionData.items.filter(i => i.id !== id);
      const updated = { ...sectionData, items: updatedItems };
      setSectionData(updated);
      handleSaveSection(updated);
      showToast('Photo card removed');
    }
  };

  const handleToggleStatus = (item) => {
    const updatedItems = sectionData.items.map(i => 
      i.id === item.id ? { ...i, is_active: i.is_active === false ? true : false } : i
    );
    const updated = { ...sectionData, items: updatedItems };
    setSectionData(updated);
    handleSaveSection(updated);
  };

  const handleSaveDrawerItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    let updatedItems;
    const exists = sectionData.items.some(i => i.id === editingItem.id);
    if (exists) {
      updatedItems = sectionData.items.map(i => i.id === editingItem.id ? editingItem : i);
    } else {
      updatedItems = [...sectionData.items, editingItem];
    }

    const updated = { ...sectionData, items: updatedItems };
    setSectionData(updated);
    handleSaveSection(updated);
    setIsDrawerOpen(false);
    setEditingItem(null);
  };

  const handleMove = (index, direction) => {
    const newItems = [...sectionData.items];
    const target = index + direction;
    if (target < 0 || target >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[target];
    newItems[target] = temp;
    const updated = { ...sectionData, items: newItems };
    setSectionData(updated);
    handleSaveSection(updated);
  };

  // Direct Computer Upload using api.uploadMediaFile
  const handleUploadFile = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const mediaItem = await api.uploadMediaFile(file, 'Social Journey');
      if (mediaItem && mediaItem.url) {
        setEditingItem(prev => ({ 
          ...prev, 
          image: mediaItem.url,
          title: (!prev.title || prev.title === 'New Journey Moment' || prev.title.startsWith('Fresh Botanical')) 
            ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') 
            : prev.title
        }));
        showToast(`Uploaded "${file.name}" successfully!`);
      }
    } catch (err) {
      console.error('File upload failed:', err);
      showToast('Upload failed, please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const filteredItems = (sectionData.items || []).filter(item => 
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="journey-manager-wrapper">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Hero Header Banner */}
      <div className="journey-manager-hero">
        <div className="journey-hero-text">
          <div className="journey-hero-pill">
            <Sparkles size={14} color="#D4AF37" />
            <span>HOMEPAGE SECTION 07</span>
          </div>
          <h2>Follow the Tanush Journey Studio</h2>
          <p>
            Curate high-definition botanical storytelling moments, photography assets, editorial layout, and Instagram link.
          </p>
        </div>
        <div className="journey-header-btn-group">
          <button 
            className="journey-action-btn-secondary" 
            onClick={() => setIsEditingSectionTexts(!isEditingSectionTexts)}
          >
            <Sliders size={16} />
            <span>{isEditingSectionTexts ? 'Hide Header Settings' : 'Header Copy & Hashtag'}</span>
          </button>
          <button 
            className="journey-action-btn-primary" 
            onClick={handleAddNew}
          >
            <Plus size={16} />
            <span>+ Add Photo Card</span>
          </button>
        </div>
      </div>

      {/* Collapsible Section Header & Copy Settings */}
      {isEditingSectionTexts && (
        <div className="journey-settings-panel">
          <div className="journey-settings-header">
            <h3 className="journey-settings-title">
              <Leaf size={18} color="#2F6B43" /> Section Headlines &amp; Social Links
            </h3>
            <button 
              type="button"
              className="journey-action-btn-primary small" 
              onClick={() => {
                handleSaveSection();
                setIsEditingSectionTexts(false);
              }}
            >
              <Save size={15} /> Save Settings
            </button>
          </div>

          <div className="journey-settings-grid">
            <div className="journey-form-field">
              <label>Eyebrow Tag <span className="hint">Pill label above title</span></label>
              <input 
                type="text" 
                className="journey-input-text" 
                value={sectionData.eyebrow}
                onChange={e => setSectionData({ ...sectionData, eyebrow: e.target.value })}
                placeholder="07 — SOCIAL"
              />
            </div>

            <div className="journey-form-field">
              <label>Main Heading <span className="hint">Large display title</span></label>
              <input 
                type="text" 
                className="journey-input-text" 
                value={sectionData.heading}
                onChange={e => setSectionData({ ...sectionData, heading: e.target.value })}
                placeholder="FOLLOW THE TANUSH JOURNEY"
              />
            </div>

            <div className="journey-form-field">
              <label>Callout Title <span className="hint">Left panel slogan</span></label>
              <input 
                type="text" 
                className="journey-input-text" 
                value={sectionData.callout_title}
                onChange={e => setSectionData({ ...sectionData, callout_title: e.target.value })}
                placeholder="Rooted in nature,\nmade for you."
              />
            </div>

            <div className="journey-form-field">
              <label>Hashtag Tagline <span className="hint">e.g. #TanushNatural</span></label>
              <input 
                type="text" 
                className="journey-input-text" 
                value={sectionData.hashtag}
                onChange={e => setSectionData({ ...sectionData, hashtag: e.target.value })}
                placeholder="#TanushNatural"
              />
            </div>

            <div className="journey-form-field full-width">
              <label>Subtitle Description <span className="hint">Supporting sentence below headline</span></label>
              <input 
                type="text" 
                className="journey-input-text" 
                value={sectionData.subtitle}
                onChange={e => setSectionData({ ...sectionData, subtitle: e.target.value })}
                placeholder="Everyday inspiration, natural living and what's new at Tanush."
              />
            </div>

            <div className="journey-form-field full-width">
              <label>Instagram URL <span className="hint">Follow link destination</span></label>
              <input 
                type="text" 
                className="journey-input-text" 
                value={sectionData.instagram_link}
                onChange={e => setSectionData({ ...sectionData, instagram_link: e.target.value })}
                placeholder="https://instagram.com/TanushNatural"
              />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar & Filter Bar */}
      <div className="journey-toolbar">
        <div className="journey-search-box">
          <Search size={16} color="#6B7C73" className="journey-search-icon" />
          <input 
            type="text" 
            placeholder="Search photo cards by title or caption..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="journey-toolbar-right">
          <span className="journey-count-pill">
            {filteredItems.length} active card(s)
          </span>

          <div className="journey-view-switcher">
            <button 
              type="button"
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} /> Grid
            </button>
            <button 
              type="button"
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              <List size={14} /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="journey-cards-grid">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="journey-admin-card">
              <div className="journey-admin-card-media" onClick={() => setPreviewItem(item)}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  onError={(e) => {
                    e.target.src = '/images/lifestyle/collage-main.jpg';
                  }}
                />
                <span className="journey-admin-card-badge">
                  #{index + 1}
                </span>
                <span className={`journey-admin-card-status ${item.is_active !== false ? 'active' : 'hidden'}`}>
                  {item.is_active !== false ? '● Live' : '○ Hidden'}
                </span>
              </div>

              <div className="journey-admin-card-body">
                <h4 className="journey-admin-card-title">{item.title || 'Untitled Moment'}</h4>

                <div className="journey-admin-card-actions">
                  <div className="journey-move-btn-group">
                    <button 
                      type="button"
                      className="journey-icon-btn"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      title="Move Left / Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button"
                      className="journey-icon-btn"
                      disabled={index === sectionData.items.length - 1}
                      onClick={() => handleMove(index, 1)}
                      title="Move Right / Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button 
                      type="button"
                      className="journey-icon-btn"
                      onClick={() => handleToggleStatus(item)}
                      title={item.is_active !== false ? 'Hide from homepage' : 'Publish to homepage'}
                    >
                      {item.is_active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>

                  <div className="journey-card-edit-btns">
                    <button 
                      type="button"
                      className="journey-icon-btn edit"
                      onClick={() => handleEdit(item)}
                      title="Edit Image & Caption"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      type="button"
                      className="journey-icon-btn danger"
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete card"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="journey-table-card">
          <table className="admin-table journey-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Preview</th>
                <th>Photo Caption &amp; Story Title</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Sequence</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <div 
                      className="journey-table-thumb"
                      onClick={() => setPreviewItem(item)}
                    >
                      <img 
                        src={item.image} 
                        alt="" 
                        onError={(e) => { e.target.src = '/images/lifestyle/collage-main.jpg'; }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="journey-table-title">{item.title}</div>
                    <div className="journey-table-path">{item.image}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="journey-table-seq-btns">
                      <button 
                        type="button"
                        className="journey-icon-btn" 
                        disabled={index === 0}
                        onClick={() => handleMove(index, -1)}
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button 
                        type="button"
                        className="journey-icon-btn" 
                        disabled={index === sectionData.items.length - 1}
                        onClick={() => handleMove(index, 1)}
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`journey-status-pill-btn ${item.is_active !== false ? 'published' : 'hidden'}`}
                    >
                      {item.is_active !== false ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="journey-table-action-btns">
                      <button 
                        type="button"
                        className="journey-icon-btn"
                        onClick={() => setPreviewItem(item)}
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        type="button"
                        className="journey-icon-btn edit"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        type="button"
                        className="journey-icon-btn danger"
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          LUXURY TWO-COLUMN EDIT PHOTO CARD MODAL DIALOG
          ============================================================ */}
      {isDrawerOpen && editingItem && (
        <div className="admin-modal-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div 
            className="admin-modal-content glass-liquid-panel" 
            style={{ 
              maxWidth: '720px', 
              width: '92%', 
              maxHeight: '90vh', 
              padding: '0', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: '20px', 
              overflow: 'hidden',
              background: '#FCFAF6',
              border: '1.5px solid rgba(23, 59, 47, 0.12)',
              boxShadow: '0 24px 60px rgba(15, 23, 19, 0.35)',
              position: 'relative'
            }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 26px 16px', borderBottom: '1px solid rgba(23, 59, 47, 0.08)', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.15)', color: '#173B2F', padding: '3px 10px', borderRadius: '12px', fontSize: '0.70rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.04em' }}>
                  <Sparkles size={12} color="#D4AF37" /> PHOTO CARD CURATION
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#173B2F', fontWeight: 700 }}>Edit Journey Photo Card</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.80rem', color: '#637365' }}>Configure photo visual, storytelling caption, and drift wall visibility.</p>
              </div>
              <button 
                type="button" 
                className="icon-action-btn" 
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Two-Column Grid */}
            <form onSubmit={handleSaveDrawerItem} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px 26px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '22px', alignItems: 'start' }}>
                  
                  {/* Left Column: Image Preview & Upload Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#173B2F' }}>Photo Visual</label>
                      <span style={{ fontSize: '0.72rem', color: '#637365' }}>JPG, PNG, WebP</span>
                    </div>

                    <div 
                      style={{ 
                        width: '100%', 
                        height: '210px', 
                        borderRadius: '14px', 
                        overflow: 'hidden', 
                        background: '#F0EFEA', 
                        border: isDragging ? '2px dashed #2F6B43' : '2px solid rgba(23, 59, 47, 0.15)',
                        position: 'relative',
                        boxShadow: '0 4px 16px rgba(23, 59, 47, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                    >
                      <img 
                        src={editingItem.image} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.src = '/images/lifestyle/collage-main.jpg'; }}
                      />
                      {uploading ? (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(23, 59, 47, 0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.78rem', gap: '6px', backdropFilter: 'blur(4px)' }}>
                          <RefreshCw size={22} className="animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(23, 59, 47, 0.88)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                          Live Preview
                        </span>
                      )}
                    </div>

                    {/* Action Triggers */}
                    <label className="btn-admin-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 14px', fontSize: '0.84rem', cursor: 'pointer', textAlign: 'center' }}>
                      <Upload size={15} />
                      <span>{uploading ? 'Uploading...' : 'Upload from Device'}</span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={handleFileInputChange} 
                        disabled={uploading}
                      />
                    </label>

                    <button 
                      type="button" 
                      className="btn-admin-secondary" 
                      style={{ width: '100%', justifyContent: 'center', padding: '9px 14px', fontSize: '0.82rem' }}
                      onClick={() => setShowMediaPicker(true)}
                      disabled={uploading}
                    >
                      <ImageIcon size={15} />
                      <span>Choose Media Library</span>
                    </button>
                  </div>

                  {/* Right Column: Form Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Caption / Storytelling Title */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#173B2F' }}>Caption / Storytelling Title</label>
                        <span style={{ fontSize: '0.74rem', color: '#637365' }}>Hover text on drift wall</span>
                      </div>
                      <input 
                        type="text" 
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #DCD6CB', fontSize: '0.88rem', background: '#FFFFFF', color: '#173B2F', outline: 'none', transition: 'all 0.2s ease' }}
                        value={editingItem.title || ''} 
                        onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                        placeholder="e.g. Handcrafted Botanical Elixirs"
                        required
                      />
                    </div>

                    {/* Presets Select */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#173B2F' }}>Botanical Presets</label>
                        <span style={{ fontSize: '0.74rem', color: '#637365' }}>Tanush photography library</span>
                      </div>
                      <select 
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #DCD6CB', fontSize: '0.84rem', background: '#FFFFFF', color: '#173B2F', outline: 'none' }}
                        value={editingItem.image}
                        onChange={e => {
                          const selected = BOTANICAL_PRESETS.find(p => p.url === e.target.value);
                          setEditingItem({
                            ...editingItem,
                            image: e.target.value,
                            title: selected ? selected.title : editingItem.title
                          });
                        }}
                      >
                        {BOTANICAL_PRESETS.map((preset, pIdx) => (
                          <option key={pIdx} value={preset.url}>
                            {preset.title} ({preset.url})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Direct Image Path */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#173B2F' }}>Image Path / URL</label>
                        <span style={{ fontSize: '0.74rem', color: '#637365' }}>Direct asset path</span>
                      </div>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <LinkIcon size={15} color="#637365" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
                        <input 
                          type="text" 
                          style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '12px', border: '1.5px solid #DCD6CB', fontSize: '0.82rem', background: '#FFFFFF', color: '#173B2F', fontFamily: 'monospace', outline: 'none' }}
                          value={editingItem.image || ''} 
                          onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                          placeholder="/uploads/... or /images/..."
                          required
                        />
                      </div>
                    </div>

                    {/* Visibility Switch Card */}
                    <div 
                      style={{ 
                        background: editingItem.is_active !== false ? 'rgba(47, 107, 67, 0.08)' : '#FFFFFF', 
                        border: `1.5px solid ${editingItem.is_active !== false ? 'rgba(47, 107, 67, 0.35)' : 'rgba(23, 59, 47, 0.12)'}`,
                        borderRadius: '14px', 
                        padding: '14px 16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        marginTop: '2px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(23, 59, 47, 0.03)'
                      }}
                      onClick={() => setEditingItem({ ...editingItem, is_active: editingItem.is_active === false ? true : false })}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#173B2F' }}>Homepage Drift Wall</span>
                          <span style={{ 
                            fontSize: '0.70rem', 
                            fontWeight: 800, 
                            padding: '2px 8px', 
                            borderRadius: '10px',
                            background: editingItem.is_active !== false ? '#2F6B43' : '#6B7280',
                            color: '#FFFFFF'
                          }}>
                            {editingItem.is_active !== false ? '● Live' : '○ Hidden'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.76rem', color: '#637365', marginTop: '3px', display: 'block' }}>
                          {editingItem.is_active !== false ? 'Visible to visitors on live storefront collage' : 'Saved in library, hidden from visitors'}
                        </span>
                      </div>

                      <div style={{
                        width: '46px',
                        height: '26px',
                        borderRadius: '20px',
                        background: editingItem.is_active !== false ? '#2F6B43' : '#D1D5DB',
                        position: 'relative',
                        transition: 'background 0.25s ease',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          position: 'absolute',
                          top: '3px',
                          left: editingItem.is_active !== false ? '23px' : '3px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {editingItem.is_active !== false && <Check size={12} color="#2F6B43" />}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 26px', background: '#FFFFFF', borderTop: '1px solid rgba(23, 59, 47, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn-admin-secondary" 
                  style={{ padding: '9px 20px', fontSize: '0.86rem' }}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-admin-primary" 
                  style={{ padding: '9px 24px', fontSize: '0.86rem', background: '#173B2F' }}
                  disabled={uploading}
                >
                  <Save size={15} />
                  <span>Save &amp; Publish Photo Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Resolution Preview Modal */}
      {previewItem && (
        <div className="admin-modal-overlay" onClick={() => setPreviewItem(null)}>
          <div 
            className="admin-modal-content glass-liquid-panel" 
            style={{ maxWidth: '540px', width: '90%', padding: '0', borderRadius: '20px', overflow: 'hidden', background: '#FCFAF6' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(23, 59, 47, 0.08)', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#173B2F', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{previewItem.title}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#637365' }}>{previewItem.image}</p>
              </div>
              <button 
                type="button"
                className="icon-action-btn" 
                style={{ width: '34px', height: '34px', borderRadius: '50%' }}
                onClick={() => setPreviewItem(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', background: '#FAF8F5' }}>
              <div style={{ width: '100%', height: '360px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', background: '#FFFFFF' }}>
                <img 
                  src={previewItem.image} 
                  alt={previewItem.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/images/lifestyle/collage-main.jpg'; }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => {
          setEditingItem(prev => ({ ...prev, image: url }));
          setShowMediaPicker(false);
        }}
      />
    </div>
  );
};

export default JourneyManager;
