import React, { useState, useEffect, useRef } from 'react';
import { api, applyFavicon } from '../../lib/db';
import { Check, Globe, Share2, ShieldCheck, Upload, FolderOpen, Copy, Image as ImageIcon, Sparkles, CheckCircle, Info } from 'lucide-react';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    brand_name: 'Tanush Natural & Co.',
    brand_title: 'TANUSH',
    brand_subtitle: 'NATURAL & CO.',
    tagline: 'Rooted in Nature, Made for Everyday Living',
    logo_url: '/uploads/1787985113737-Round_LOGO.png',
    logo_media_id: 'brand-logo-main',
    logo_alt: 'Tanush Natural & Co.',
    favicon_url: '/uploads/1787985113737-Round_LOGO.png',
    use_primary_favicon: true,
    currency: '₹',
    email: 'info@tanushnatural.com',
    phone: '+91 98765 43210',
    address: 'Ahmedabad, Gujarat, India',
    instagram: 'https://instagram.com/TanushNatural',
    whatsapp: '+919876543210',
    seo_title: 'Tanush Natural — 100% Pure & Organic Living',
    seo_description: 'Discover thoughtful natural formulations crafted for Indian households.'
  });
  const [notification, setNotification] = useState('');
  const [copiedLogoUrl, setCopiedLogoUrl] = useState(false);
  const [showLogoPicker, setShowLogoPicker] = useState(false);
  const [showFaviconPicker, setShowFaviconPicker] = useState(false);
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await api.getSiteSettings();
      if (data) setSettings(prev => ({ ...prev, ...data }));
    };
    loadSettings();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleCopyLogoUrl = () => {
    if (settings.logo_url) {
      navigator.clipboard.writeText(settings.logo_url);
      setCopiedLogoUrl(true);
      showToast('✓ Logo URL copied to clipboard!');
      setTimeout(() => setCopiedLogoUrl(false), 2000);
    }
  };

  const handleLogoUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const mediaItem = await api.uploadMediaFile(file, 'General');
      const updated = {
        ...settings,
        logo_url: mediaItem.url,
        logo_media_id: mediaItem.id,
        favicon_url: settings.use_primary_favicon ? mediaItem.url : settings.favicon_url
      };
      setSettings(updated);
      await api.saveSiteSettings(updated);
      if (settings.use_primary_favicon) {
        applyFavicon(mediaItem.url);
      }
      showToast(`✓ Global logo updated: ${file.name}`);
    } catch (err) {
      console.error(err);
      showToast(`Error uploading logo: ${file.name}`);
    }
  };

  const handleFaviconUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const mediaItem = await api.uploadMediaFile(file, 'General');
      const updated = {
        ...settings,
        favicon_url: mediaItem.url,
        use_primary_favicon: false
      };
      setSettings(updated);
      await api.saveSiteSettings(updated);
      applyFavicon(mediaItem.url);
      showToast(`✓ Custom favicon updated: ${file.name}`);
    } catch (err) {
      console.error(err);
      showToast(`Error uploading favicon: ${file.name}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await api.saveSiteSettings(settings);
    const activeFav = settings.use_primary_favicon !== false 
      ? (settings.logo_url || '/uploads/1787985113737-Round_LOGO.png')
      : (settings.favicon_url || settings.logo_url || '/uploads/1787985113737-Round_LOGO.png');
    applyFavicon(activeFav, settings.brand_name || 'Tanush Natural & Co.', settings.tagline);
    showToast('✓ Brand Identity, Logo, Favicon & Website settings saved everywhere!');
  };

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Brand Identity, Logo & SEO</h2>
          <p className="text-muted">Single authoritative source of truth for the Tanush Natural logo, typography, and brand metadata across website & admin panel.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-form">
        {/* Brand Identity & Logo Master Control */}
        <div className="admin-form-card glass-panel mb-4">
          <div className="form-section-title">
            <Globe size={20} color="var(--color-primary)" />
            <h3>Primary Website Logo & Identity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Current Logo & Typography Live Preview Card */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.85)', 
              borderRadius: '16px', 
              padding: '20px', 
              border: '1px solid rgba(23, 59, 47, 0.12)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '12px' }}>
                LIVE LOGO &amp; TEXT PREVIEW
              </div>

              {/* Light Mode Preview */}
              <div style={{ 
                borderRadius: '12px', 
                background: '#FAF8F5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px dashed rgba(23, 59, 47, 0.2)',
                marginBottom: '10px',
                padding: '16px',
                gap: '12px'
              }}>
                <img 
                  src={settings.logo_url || '/uploads/1787985113737-Round_LOGO.png'} 
                  alt={settings.logo_alt || 'Logo'} 
                  style={{ height: '52px', width: '52px', objectFit: 'contain', borderRadius: '50%', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                  <span style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '0.04em', color: '#173B2F', textTransform: 'uppercase' }}>
                    {settings.brand_title || 'TANUSH'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.05em', color: '#173B2F', textTransform: 'uppercase', marginTop: '2px' }}>
                    {settings.brand_subtitle || 'NATURAL & CO.'}
                  </span>
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div style={{ 
                borderRadius: '12px', 
                background: '#112219', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px',
                padding: '16px',
                gap: '12px'
              }}>
                <img 
                  src={settings.logo_url || '/uploads/1787985113737-Round_LOGO.png'} 
                  alt={settings.logo_alt || 'Logo'} 
                  style={{ height: '48px', width: '48px', objectFit: 'contain', borderRadius: '50%' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                  <span style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF', textTransform: 'uppercase' }}>
                    {settings.brand_title || 'TANUSH'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.05em', color: '#E2E8F0', textTransform: 'uppercase', marginTop: '2px' }}>
                    {settings.brand_subtitle || 'NATURAL & CO.'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  type="button" 
                  className="btn-admin-primary btn-sm flex-1" 
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload size={14} /> Upload Logo
                </button>
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  style={{ display: 'none' }} 
                  accept="*/*"
                  onChange={(e) => handleLogoUpload(e.target.files)} 
                />

                <button 
                  type="button" 
                  className="btn-admin-secondary btn-sm" 
                  onClick={() => setShowLogoPicker(true)}
                >
                  <FolderOpen size={14} /> From Library
                </button>
              </div>

              <div style={{ background: 'rgba(23, 59, 47, 0.04)', borderRadius: '10px', padding: '12px', fontSize: '0.8rem', color: '#4A5568' }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                  Used Globally In:
                </strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                  <li>Public Desktop & Mobile Navbar</li>
                  <li>Public Footer</li>
                  <li>Admin Sidebar & Top Navigation</li>
                  <li>Admin Login Screen</li>
                  <li>Customer Account & Cart Drawer</li>
                  <li>Browser Tab Favicon</li>
                </ul>
              </div>
            </div>

            {/* Logo Attributes & Favicon Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Brand Header Title (Line 1)</label>
                  <input 
                    type="text" 
                    value={settings.brand_title || ''} 
                    onChange={(e) => setSettings({ ...settings, brand_title: e.target.value })} 
                    placeholder="TANUSH"
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Brand Header Subtitle (Line 2)</label>
                  <input 
                    type="text" 
                    value={settings.brand_subtitle || ''} 
                    onChange={(e) => setSettings({ ...settings, brand_subtitle: e.target.value })} 
                    placeholder="NATURAL & CO."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Full Brand Name</label>
                <input 
                  type="text" 
                  value={settings.brand_name || ''} 
                  onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} 
                  placeholder="Tanush Natural & Co."
                />
              </div>

              <div className="form-group">
                <label>Logo Alt Text</label>
                <input 
                  type="text" 
                  value={settings.logo_alt || ''} 
                  onChange={(e) => setSettings({ ...settings, logo_alt: e.target.value })} 
                  placeholder="Tanush Natural & Co."
                />
              </div>

              <div className="form-group">
                <label>Logo Asset Storage URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={settings.logo_url || '/uploads/1787985113737-Round_LOGO.png'} 
                    style={{ background: '#F8FAFC', fontSize: '0.82rem' }} 
                  />
                  <button 
                    type="button" 
                    className="btn-admin-secondary btn-sm" 
                    onClick={handleCopyLogoUrl}
                  >
                    {copiedLogoUrl ? <CheckCircle size={14} color="#38A169" /> : <Copy size={14} />}
                    {copiedLogoUrl ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Favicon Mode Selection */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.7)', 
                borderRadius: '14px', 
                padding: '16px', 
                border: '1px solid rgba(23, 59, 47, 0.1)' 
              }}>
                <label style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '10px' }}>
                  Browser Favicon
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label className="checkbox-label" style={{ cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="favicon_mode" 
                      checked={settings.use_primary_favicon !== false} 
                      onChange={() => {
                        const updated = {
                          ...settings,
                          use_primary_favicon: true,
                          favicon_url: settings.logo_url
                        };
                        setSettings(updated);
                        applyFavicon(settings.logo_url);
                      }} 
                    />
                    <span><strong>Use Primary Logo</strong> (Follows logo automatically)</span>
                  </label>

                  <label className="checkbox-label" style={{ cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="favicon_mode" 
                      checked={settings.use_primary_favicon === false} 
                      onChange={() => setSettings({ ...settings, use_primary_favicon: false })} 
                    />
                    <span><strong>Choose Separate Favicon</strong></span>
                  </label>

                  {settings.use_primary_favicon === false && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center' }}>
                      <img 
                        src={settings.favicon_url || settings.logo_url} 
                        alt="Favicon preview" 
                        style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', background: '#fff', border: '1px solid #ccc' }} 
                      />
                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm" 
                        onClick={() => faviconInputRef.current?.click()}
                      >
                        <Upload size={14} /> Upload Custom
                      </button>
                      <input 
                        type="file" 
                        ref={faviconInputRef} 
                        style={{ display: 'none' }} 
                        accept="*/*"
                        onChange={(e) => handleFaviconUpload(e.target.files)} 
                      />
                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm" 
                        onClick={() => setShowFaviconPicker(true)}
                      >
                        <FolderOpen size={14} /> Library
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Currency Symbol</label>
              <input 
                type="text" 
                value={settings.currency || '₹'} 
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })} 
              />
            </div>
            <div className="form-group flex-1">
              <label>Brand Tagline</label>
              <input 
                type="text" 
                value={settings.tagline || ''} 
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Support Email</label>
              <input 
                type="email" 
                value={settings.email || ''} 
                onChange={(e) => setSettings({ ...settings, email: e.target.value })} 
              />
            </div>
            <div className="form-group flex-1">
              <label>Support Phone</label>
              <input 
                type="text" 
                value={settings.phone || ''} 
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Store Physical Address</label>
            <input 
              type="text" 
              value={settings.address || ''} 
              onChange={(e) => setSettings({ ...settings, address: e.target.value })} 
            />
          </div>
        </div>

        {/* SEO */}
        <div className="admin-form-card glass-panel mb-4">
          <div className="form-section-title">
            <ShieldCheck size={20} color="var(--color-primary)" />
            <h3>Search Engine Optimization (SEO)</h3>
          </div>
          <div className="form-group">
            <label>Default Page Title (Title Tag)</label>
            <input 
              type="text" 
              value={settings.seo_title || ''} 
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Default Meta Description</label>
            <textarea 
              rows={3} 
              value={settings.seo_description || ''} 
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })} 
            />
          </div>
        </div>

        {/* Social */}
        <div className="admin-form-card glass-panel mb-4">
          <div className="form-section-title">
            <Share2 size={20} color="var(--color-primary)" />
            <h3>Social Media & Ordering Channels</h3>
          </div>
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Instagram URL</label>
              <input 
                type="text" 
                value={settings.instagram || ''} 
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} 
              />
            </div>
            <div className="form-group flex-1">
              <label>WhatsApp Number for Orders</label>
              <input 
                type="text" 
                value={settings.whatsapp || ''} 
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} 
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-admin-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
          <Check size={18} /> Save Brand Identity & Settings
        </button>
      </form>

      <MediaPickerModal 
        isOpen={showLogoPicker} 
        filterType="image"
        onClose={() => setShowLogoPicker(false)} 
        onSelect={async (url) => {
          const updated = {
            ...settings,
            logo_url: url,
            favicon_url: settings.use_primary_favicon ? url : settings.favicon_url
          };
          setSettings(updated);
          await api.saveSiteSettings(updated);
          if (settings.use_primary_favicon) {
            applyFavicon(url);
          }
          showToast('✓ Global logo updated from Media Library!');
        }} 
      />

      <MediaPickerModal 
        isOpen={showFaviconPicker} 
        filterType="image"
        onClose={() => setShowFaviconPicker(false)} 
        onSelect={async (url) => {
          const updated = {
            ...settings,
            favicon_url: url,
            use_primary_favicon: false
          };
          setSettings(updated);
          await api.saveSiteSettings(updated);
          applyFavicon(url);
          showToast('✓ Custom favicon updated from Media Library!');
        }} 
      />
    </div>
  );
};

export default SettingsManager;
