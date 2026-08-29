import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../lib/db';
import { 
  Save, 
  Eye, 
  Upload, 
  FolderOpen, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Sliders, 
  Layers, 
  Monitor, 
  Smartphone, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { AdminSkeleton } from '../../components/Skeletons/Skeleton';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';

const DEFAULT_FORM_DATA = {
  id: 'partnership-section',
  section_label: '06 — PARTNERSHIPS',
  title: 'GROW WITH TANUSH',
  description: 'Bring Tanush Natural products to more homes across India. We are looking for retailers and distributors who share our vision.',
  button_text: 'BECOME A PARTNER →',
  button_link: '/become-a-partner',
  background_image: '/images/lifestyle/partner-forest-bg.jpg',
  background_media_id: '',
  overlay_opacity: 60,
  image_position: 'center',
  image_fit: 'cover',
  is_visible: true
};

const PartnershipSectionManager = () => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [initialData, setInitialData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [imageMeta, setImageMeta] = useState({ name: 'partner-forest-bg.jpg', size: '721 KB', dimensions: '1920 × 1080' });
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  // Load existing data from CMS API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPartnershipSection();
      if (data && typeof data === 'object') {
        const merged = { ...DEFAULT_FORM_DATA, ...data };
        setFormData(merged);
        setInitialData(merged);

        // Derive image metadata
        if (merged.background_image) {
          const parts = merged.background_image.split('/');
          const filename = parts[parts.length - 1] || 'background-image.jpg';
          setImageMeta(prev => ({
            ...prev,
            name: filename.replace(/^\d+-/, '')
          }));
        }
      }
    } catch (err) {
      console.error('Error loading partnership section:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Unsaved changes browser prompt
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Image Upload Handler
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Image file validation
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    setUploading(true);
    try {
      const mediaItem = await api.uploadMediaFile(file, 'Photos');
      if (mediaItem && mediaItem.url) {
        setFormData(prev => ({
          ...prev,
          background_image: mediaItem.url,
          background_media_id: mediaItem.id || ''
        }));
        setImageMeta({
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          dimensions: '1920 × 1080'
        });
        showToast(`✓ Background image uploaded: ${file.name}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Unable to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Media Library Selection Handler
  const handleMediaSelect = (url, mediaItem) => {
    setFormData(prev => ({
      ...prev,
      background_image: url,
      background_media_id: mediaItem?.id || ''
    }));
    setImageMeta({
      name: mediaItem?.name || url.split('/').pop() || 'media-asset.jpg',
      size: mediaItem?.size || '540 KB',
      dimensions: '1920 × 1080'
    });
    showToast('✓ Image selected from Media Library');
  };

  // Remove background image
  const handleRemoveImage = () => {
    if (window.confirm('Remove custom background image and use default botanical background?')) {
      setFormData(prev => ({
        ...prev,
        background_image: '',
        background_media_id: ''
      }));
      showToast('Background image reset to default.');
    }
  };

  // Save changes to backend
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const savedResult = await api.savePartnershipSection(formData);
      if (savedResult) {
        setInitialData(formData);
        showToast('✓ Changes saved successfully');
      } else {
        showToast('Unable to save changes.');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const scrollToPreview = () => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return <AdminSkeleton />;
  }

  const overlayAlpha = (Number(formData.overlay_opacity || 60) / 100);
  const activeBg = formData.background_image || '/images/lifestyle/partner-forest-bg.jpg';

  return (
    <div className="admin-page-container partnership-cms-container">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Top Header Row with Actions */}
      <div className="admin-header-actions" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
            Edit Partnerships Section
          </h2>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.88rem' }}>
            Customize the &ldquo;Grow With Tanush&rdquo; section displayed on the website.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDirty && (
            <span style={{ fontSize: '0.78rem', color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}>
              ● Unsaved changes
            </span>
          )}

          <button 
            type="button" 
            className="btn-admin-secondary" 
            onClick={scrollToPreview}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={15} />
            <span>Preview Section</span>
          </button>

          <button 
            type="button" 
            className="btn-admin-primary" 
            onClick={handleSave}
            disabled={saving || uploading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '135px', justifyContent: 'center' }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column CMS Layout */}
      <div className="partnership-cms-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1.15fr) minmax(400px, 1fr)', gap: '28px', alignItems: 'start' }}>
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: EDITING CONTROLS                                 */}
        {/* ============================================================ */}
        <div className="partnership-editor-col" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* 1. CONTENT SETTINGS */}
          <div className="admin-form-card glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid rgba(23, 59, 47, 0.06)' }}>
              <Layers size={18} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Content Settings
              </h3>
            </div>

            <div className="form-group mb-3">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                Section Label
              </label>
              <input 
                type="text" 
                value={formData.section_label || ''} 
                onChange={(e) => handleFieldChange('section_label', e.target.value)}
                placeholder="e.g. 06 — PARTNERSHIPS"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.88rem' }}
              />
            </div>

            <div className="form-group mb-3">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                Main Title
              </label>
              <input 
                type="text" 
                value={formData.title || ''} 
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. GROW WITH TANUSH"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.88rem' }}
              />
            </div>

            <div className="form-group mb-3">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                Description
              </label>
              <textarea 
                rows={3}
                value={formData.description || ''} 
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Brief description explaining the partner program..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.88rem', lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                  Button Text
                </label>
                <input 
                  type="text" 
                  value={formData.button_text || ''} 
                  onChange={(e) => handleFieldChange('button_text', e.target.value)}
                  placeholder="e.g. BECOME A PARTNER →"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.88rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                  Button Link
                </label>
                <input 
                  type="text" 
                  value={formData.button_link || ''} 
                  onChange={(e) => handleFieldChange('button_link', e.target.value)}
                  placeholder="e.g. /become-a-partner"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          </div>

          {/* 2. BACKGROUND SETTINGS */}
          <div className="admin-form-card glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid rgba(23, 59, 47, 0.06)' }}>
              <ImageIcon size={18} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Background Settings
              </h3>
            </div>

            {/* Current Background Preview Card */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '8px', display: 'block' }}>
                Background Image
              </label>

              <div style={{ 
                border: '1px solid rgba(23, 59, 47, 0.12)', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                background: '#FAF9F6',
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: '16px',
                padding: '12px',
                alignItems: 'center'
              }}>
                <div style={{ width: '160px', height: '100px', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: '#09150E' }}>
                  <img 
                    src={activeBg} 
                    alt="Partnership Background" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/images/lifestyle/partner-forest-bg.jpg'; }}
                  />
                  {uploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', wordBreak: 'break-all' }}>
                    {imageMeta.name || 'partner-forest-bg.jpg'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#718096' }}>
                    {imageMeta.dimensions} • {imageMeta.size}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <label 
                      className="btn-admin-secondary text-xs" 
                      style={{ cursor: uploading ? 'not-allowed' : 'pointer', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem' }}
                    >
                      <Upload size={13} /> Upload Image
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/jpeg,image/png,image/webp" 
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e.target.files)}
                        disabled={uploading}
                      />
                    </label>

                    <button 
                      type="button" 
                      className="btn-admin-secondary text-xs"
                      onClick={() => setShowMediaPicker(true)}
                      style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem' }}
                    >
                      <FolderOpen size={13} /> Media Library
                    </button>

                    {formData.background_image && (
                      <button 
                        type="button" 
                        className="icon-action-btn danger" 
                        onClick={handleRemoveImage}
                        title="Remove custom image"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Intensity Slider */}
            <div className="form-group mb-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', margin: 0 }}>
                  Overlay Dark Tint
                </label>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(23, 59, 47, 0.08)', padding: '2px 8px', borderRadius: '12px' }}>
                  Dark {formData.overlay_opacity ?? 60}%
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={formData.overlay_opacity ?? 60} 
                onChange={(e) => handleFieldChange('overlay_opacity', parseInt(e.target.value, 10))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#A0AEC0', marginTop: '4px' }}>
                <span>0% (Transparent)</span>
                <span>50% (Recommended)</span>
                <span>100% (Solid Dark)</span>
              </div>
            </div>

            {/* Image Positioning & Fit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                  Image Position
                </label>
                <select 
                  value={formData.image_position || 'center'} 
                  onChange={(e) => handleFieldChange('image_position', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.85rem' }}
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D3748', marginBottom: '6px', display: 'block' }}>
                  Image Fit
                </label>
                <select 
                  value={formData.image_fit || 'cover'} 
                  onChange={(e) => handleFieldChange('image_fit', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#FAF9F6', fontSize: '0.85rem' }}
                >
                  <option value="cover">Cover (Aspect Preserved)</option>
                  <option value="contain">Contain</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. SECTION VISIBILITY */}
          <div className="admin-form-card glass-panel" style={{ padding: '20px 24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  Section Visibility
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#718096' }}>
                  Enable or disable this section on the public website.
                </p>
              </div>

              <label className="switch-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.is_visible !== false}
                  onChange={(e) => handleFieldChange('is_visible', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: formData.is_visible !== false ? '#2F855A' : '#A0AEC0' }}>
                  {formData.is_visible !== false ? 'SHOW (ON)' : 'HIDDEN (OFF)'}
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: LIVE PREVIEW                                   */}
        {/* ============================================================ */}
        <div ref={previewRef} className="partnership-preview-col" style={{ position: 'sticky', top: '24px' }}>
          <div className="admin-preview-wrapper glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)' }}>
            
            {/* Preview Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(23, 59, 47, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: formData.is_visible !== false ? '#2F855A' : '#D97706', display: 'inline-block' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  LIVE PREVIEW
                </span>
              </div>

              {/* Device Viewport Selector */}
              <div style={{ display: 'flex', gap: '4px', background: '#FAF9F6', padding: '3px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                <button 
                  type="button" 
                  onClick={() => setPreviewDevice('desktop')}
                  title="Desktop Viewport Preview"
                  style={{ 
                    border: 'none', 
                    background: previewDevice === 'desktop' ? '#FFFFFF' : 'transparent', 
                    color: previewDevice === 'desktop' ? 'var(--color-primary)' : '#718096',
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    boxShadow: previewDevice === 'desktop' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Monitor size={13} />
                  <span>Desktop</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setPreviewDevice('mobile')}
                  title="Mobile Viewport Preview"
                  style={{ 
                    border: 'none', 
                    background: previewDevice === 'mobile' ? '#FFFFFF' : 'transparent', 
                    color: previewDevice === 'mobile' ? 'var(--color-primary)' : '#718096',
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    boxShadow: previewDevice === 'mobile' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <Smartphone size={13} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Rendered Live Preview Stage */}
            <div 
              style={{ 
                width: previewDevice === 'mobile' ? '320px' : '100%', 
                margin: previewDevice === 'mobile' ? '0 auto' : '0',
                transition: 'all 0.3s ease',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              {/* Public Section Hidden Banner (if disabled) */}
              {formData.is_visible === false && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: 'rgba(217, 119, 6, 0.92)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                  <AlertCircle size={12} />
                  <span>Hidden on Public Website</span>
                </div>
              )}

              {/* Exact Simulated Partnership Section */}
              <div 
                style={{
                  position: 'relative',
                  backgroundImage: `url("${activeBg}")`,
                  backgroundSize: formData.image_fit || 'cover',
                  backgroundPosition: formData.image_position || 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#0C1C14',
                  padding: previewDevice === 'mobile' ? '36px 16px' : '48px 36px',
                  minHeight: previewDevice === 'mobile' ? '380px' : '360px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* Dynamic Atmospheric Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, rgba(8, 20, 14, ${overlayAlpha}) 0%, rgba(10, 26, 18, ${Math.max(0.15, overlayAlpha * 0.85)}) 50%, rgba(6, 16, 11, ${Math.min(0.98, overlayAlpha * 1.15)}) 100%)`,
                    zIndex: 1
                  }}
                />

                {/* Glass Content Card */}
                <div 
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    background: 'rgba(14, 32, 23, 0.68)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '18px',
                    padding: previewDevice === 'mobile' ? '24px 18px' : '32px 36px',
                    width: '100%',
                    maxWidth: '480px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    letterSpacing: '0.14em', 
                    textTransform: 'uppercase', 
                    color: '#B4C5B0', 
                    marginBottom: '10px' 
                  }}>
                    {formData.section_label || '06 — PARTNERSHIPS'}
                  </span>

                  <h3 style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: previewDevice === 'mobile' ? '1.55rem' : '1.9rem', 
                    fontWeight: 400, 
                    color: '#FAF8F5', 
                    lineHeight: 1.18, 
                    margin: '0 0 12px 0' 
                  }}>
                    {formData.title || 'GROW WITH TANUSH'}
                  </h3>

                  <p style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: previewDevice === 'mobile' ? '0.82rem' : '0.86rem', 
                    lineHeight: 1.55, 
                    color: 'rgba(250, 248, 245, 0.88)', 
                    marginBottom: '20px' 
                  }}>
                    {formData.description || 'Bring Tanush Natural products to more homes across India. We are looking for retailers and distributors who share our vision.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#FAF8F5',
                        color: '#173B2F',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        borderRadius: '30px',
                        padding: '10px 20px',
                        fontSize: '0.76rem',
                        border: '1px solid rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <span>{formData.button_text || 'BECOME A PARTNER →'}</span>
                    </div>
                  </div>
                </div>

                {/* Subtle Botanical Watermark */}
                {previewDevice === 'desktop' && (
                  <div style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1, opacity: 0.4 }}>
                    <Leaf size={160} weight="thin" color="rgba(255,255,255,0.06)" />
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.74rem', color: '#718096', textAlign: 'center' }}>
              ✦ Live preview reacts instantly to all changes. Click <strong>Save Changes</strong> to publish to website.
            </div>

          </div>
        </div>

      </div>

      {/* Existing Shared Media Picker Modal */}
      <MediaPickerModal 
        isOpen={showMediaPicker} 
        onClose={() => setShowMediaPicker(false)} 
        onSelect={handleMediaSelect}
        filterType="image"
      />
    </div>
  );
};

export default PartnershipSectionManager;
