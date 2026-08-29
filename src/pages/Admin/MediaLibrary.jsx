import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/db';
import { isMediaVideo, getVideoMimeType } from '../../lib/mediaResolver';
import { 
  Upload, 
  Trash2, 
  Search, 
  X, 
  FolderOpen, 
  Video, 
  FileUp, 
  Play, 
  LayoutGrid, 
  List, 
  Copy, 
  CheckCircle, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import './AdminStyles.css';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [products, setProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedMediaDetail, setSelectedMediaDetail] = useState(null);
  const [notification, setNotification] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const loadAll = async () => {
    const [mediaData, prods, slides, settings] = await Promise.all([
      api.getMedia(),
      api.getProducts(),
      api.getHeroSlides(),
      api.getSiteSettings()
    ]);
    setMedia(mediaData);
    setProducts(prods);
    setHeroSlides(slides);
    setSiteSettings(settings);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const isGlobalLogoAsset = (item) => {
    if (!item) return false;
    return (
      item.is_global_logo === true ||
      item.id === siteSettings?.logo_media_id ||
      item.url === siteSettings?.logo_url ||
      item.url === '/images/brand/tanush-logo.png'
    );
  };

  const isVideoAsset = (item) => {
    return isMediaVideo(item);
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/i);
        const category = isVideo ? 'Videos' : 'Photos';
        await api.uploadMediaFile(file, category);
        showToast(`✓ Uploaded "${file.name}" to Media Library`);
      } catch (err) {
        console.error('Media upload error:', err);
        showToast(`Error uploading "${file.name}"`);
      }
    }
    loadAll();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    showToast('✓ Storage URL copied to clipboard!');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDelete = async (id, name) => {
    const target = media.find(m => m.id === id);
    if (isGlobalLogoAsset(target)) {
      alert(`⚠️ DELETE PROTECTED:\n\nThis image is currently used as the active Global Tanush Natural Logo.\n\nPlease upload or select a new logo in Settings → Brand Identity before deleting this asset.`);
      return;
    }

    const refs = findReferences(target?.url || '');
    const warningMsg = refs.length > 0
      ? `This media is attached to:\n• ${refs.join('\n• ')}\n\nDelete "${name}" from Media Library?`
      : `Delete "${name}" from Media Library?`;

    if (window.confirm(warningMsg)) {
      await api.deleteMedia(id);
      showToast('Media removed from library');
      setSelectedMediaDetail(null);
      loadAll();
    }
  };

  const findReferences = (url) => {
    if (!url) return [];
    const references = [];
    if (url === siteSettings?.logo_url || url === '/images/brand/tanush-logo.png') {
      references.push('Global Brand Logo');
    }
    products.forEach(p => {
      if (Array.isArray(p.images) && p.images.includes(url)) {
        references.push(`Product: ${p.name}`);
      }
    });
    heroSlides.forEach(s => {
      if (s.image === url) {
        references.push(`Hero Slide: ${s.title}`);
      }
    });
    return references;
  };

  const filtered = media.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || m.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Media Library</h2>
          <p className="text-muted">High-density asset browser for brand media, product imagery, and video reels</p>
        </div>
        <button className="btn-admin-primary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} /> Upload the data
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          multiple 
          accept="*/*"
          onChange={(e) => handleFiles(e.target.files)} 
        />
      </div>

      {/* Compact Direct Drag & Drop Strip */}
      <div 
        className={`media-dropzone glass-panel ${isDragging ? 'drag-active' : ''}`}
        style={{ padding: '16px 20px', marginBottom: '16px', borderRadius: '12px' }}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileUp size={24} color="var(--color-primary)" />
        <div className="dropzone-text" style={{ flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <strong style={{ fontSize: '0.88rem' }}>Drag & Drop files here</strong>
          <span style={{ fontSize: '0.8rem', color: '#718096' }}>or click to browse from computer</span>
        </div>
      </div>

      {/* Media Toolbar */}
      <div className="media-filter-bar glass-panel" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div className="search-input-wrap" style={{ maxWidth: '320px', flex: '1 1 200px' }}>
          <Search size={15} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search media..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="cat-filter-tabs">
          {['all', 'Hero Banners', 'Photos', 'Videos', 'General'].map(cat => (
            <button 
              key={cat} 
              className={`filter-pill ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', background: 'rgba(23, 59, 47, 0.06)', padding: '3px', borderRadius: '8px' }}>
          <button 
            type="button" 
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            style={{ 
              border: 'none', 
              background: viewMode === 'grid' ? '#fff' : 'transparent', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <LayoutGrid size={15} />
          </button>
          <button 
            type="button" 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
            style={{ 
              border: 'none', 
              background: viewMode === 'list' ? '#fff' : 'transparent', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Grid View (Compact 4-6 Column Responsive) */}
      {viewMode === 'grid' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '12px' 
        }}>
          {filtered.map(item => {
            const isLogo = isGlobalLogoAsset(item);
            const isVid = isVideoAsset(item);
            return (
              <div 
                key={item.id} 
                className="admin-media-card glass-panel" 
                onClick={() => setSelectedMediaDetail(item)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: isLogo ? '2px solid var(--color-primary)' : '1px solid rgba(23, 59, 47, 0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ height: '120px', position: 'relative', background: '#0F172A', overflow: 'hidden' }}>
                  {isVid ? (
                    <>
                      <video src={item.url} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                        <div style={{ background: 'rgba(23, 59, 47, 0.85)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={13} fill="#fff" color="#fff" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: isLogo ? 'contain' : 'cover', padding: isLogo ? '8px' : 0, background: isLogo ? '#FAF7EE' : 'transparent' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Media'; }}
                    />
                  )}
                  <span style={{ 
                    position: 'absolute', 
                    top: '6px', 
                    left: '6px', 
                    fontSize: '0.65rem', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    background: 'rgba(0,0,0,0.6)', 
                    color: '#fff', 
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {isLogo ? 'LOGO' : (isVid ? 'VIDEO' : 'IMAGE')}
                  </span>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-primary)' }} title={item.name}>
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#718096', marginTop: '3px' }}>
                    <span>{item.size || '320 KB'}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="admin-table-card glass-panel" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Asset</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Usage</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isLogo = isGlobalLogoAsset(item);
                const isVid = isVideoAsset(item);
                const refs = findReferences(item.url);
                return (
                  <tr key={item.id} onClick={() => setSelectedMediaDetail(item)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isVid ? <Play size={14} color="#fff" /> : <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--color-primary)' }}>{item.name}</strong>
                      {isLogo && <span className="status-badge status-active" style={{ marginLeft: '8px', fontSize: '0.68rem' }}>Global Logo</span>}
                    </td>
                    <td><span className="text-muted text-xs">{isVid ? 'Video' : 'Image'}</span></td>
                    <td><span className="text-muted text-xs">{item.size || '420 KB'}</span></td>
                    <td>
                      <span className="text-muted text-xs">
                        {refs.length > 0 ? refs[0] : 'Unused'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <button 
                        type="button" 
                        className="icon-action-btn"
                        onClick={() => handleCopyUrl(item.url)}
                        title="Copy URL"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="icon-action-btn danger"
                        onClick={() => handleDelete(item.id, item.name)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Liquid Glass Right-Side Drawer */}
      {selectedMediaDetail && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMediaDetail(null)}>
          <div 
            className="admin-modal-content glass-liquid-panel" 
            style={{ 
              maxWidth: '460px', 
              marginLeft: 'auto', 
              height: '100vh', 
              maxHeight: '100vh', 
              borderRadius: '24px 0 0 24px', 
              margin: '0 0 0 auto',
              overflowY: 'auto',
              padding: '24px'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(23, 59, 47, 0.08)' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary)' }}>Media Details</h3>
              <button className="icon-action-btn" onClick={() => setSelectedMediaDetail(null)}><X size={18} /></button>
            </div>

            {/* Preview Box */}
            <div style={{ height: '220px', background: '#0F172A', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isVideoAsset(selectedMediaDetail) ? (
                <video src={selectedMediaDetail.url} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <img src={selectedMediaDetail.url} alt={selectedMediaDetail.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#718096', textTransform: 'uppercase' }}>File Name</div>
              <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{selectedMediaDetail.name}</strong>
              <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '2px' }}>
                {isVideoAsset(selectedMediaDetail) ? 'Video Asset' : 'Image Asset'} • {selectedMediaDetail.size || '380 KB'}
              </div>
            </div>

            {/* Copyable URL */}
            <div className="form-group mb-4">
              <label style={{ fontSize: '0.75rem' }}>Public Storage URL</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={selectedMediaDetail.url} 
                  style={{ background: '#F8FAFC', fontSize: '0.8rem', padding: '8px 10px' }} 
                />
                <button 
                  type="button" 
                  className="btn-admin-secondary btn-sm" 
                  onClick={() => handleCopyUrl(selectedMediaDetail.url)}
                >
                  {copiedUrl ? <CheckCircle size={14} color="#38A169" /> : <Copy size={14} />}
                  {copiedUrl ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Usage Tracking */}
            <div className="form-group mb-4">
              <label style={{ fontSize: '0.75rem' }}>Asset Usage in CMS</label>
              {isGlobalLogoAsset(selectedMediaDetail) ? (
                <div style={{ background: 'rgba(56, 161, 105, 0.08)', border: '1px solid rgba(56, 161, 105, 0.25)', padding: '12px', borderRadius: '10px', fontSize: '0.82rem', color: '#22543D' }}>
                  <strong>🌟 Global Brand Logo:</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, lineHeight: '1.5' }}>
                    <li>Public Desktop & Mobile Navbar</li>
                    <li>Public Footer</li>
                    <li>Admin Sidebar & Topbar</li>
                    <li>Admin Login Screen</li>
                    <li>Browser Tab Favicon</li>
                  </ul>
                </div>
              ) : (() => {
                const refs = findReferences(selectedMediaDetail.url);
                return refs.length > 0 ? (
                  <div style={{ background: 'rgba(23, 59, 47, 0.05)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <strong>Attached to:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      {refs.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                ) : (
                  <div className="text-muted text-xs">Not currently attached to any active product or hero slide.</div>
                );
              })()}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(23, 59, 47, 0.08)' }}>
              <button className="btn-admin-danger btn-sm" onClick={() => handleDelete(selectedMediaDetail.id, selectedMediaDetail.name)}>
                <Trash2 size={14} /> Delete Asset
              </button>
              <button className="btn-admin-primary btn-sm" onClick={() => setSelectedMediaDetail(null)}>
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
