import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/db';
import { isMediaVideo } from '../../lib/mediaResolver';
import { X, Search, Check, Upload, Image as ImageIcon, Video, FileUp, Play, Loader2 } from 'lucide-react';
import '../../pages/Admin/AdminStyles.css';

const MediaPickerModal = ({ isOpen, onClose, onSelect, filterType = 'all' }) => {
  const [mediaList, setMediaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    const data = await api.getMedia();
    setMediaList(data || []);
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/i);
        const newItem = await api.uploadMediaFile(file, isVideo ? 'Videos' : 'Photos');
        onSelect(newItem.url, newItem);
        onClose();
        return;
      }
    } catch (e) {
      console.error('Media picker upload error:', e);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  if (!isOpen) return null;

  const filtered = mediaList.filter(m => {
    // Type filtering
    if (filterType === 'video' && !isVideoAsset(m)) return false;
    if (filterType === 'image' && isVideoAsset(m)) return false;

    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'all' || m.category.toLowerCase() === selectedCat.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content glass-liquid-panel" style={{ maxWidth: '840px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid rgba(23, 59, 47, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {filterType === 'video' ? <Video size={20} color="var(--color-primary)" /> : <ImageIcon size={20} color="var(--color-primary)" />}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.25rem' }}>
              {filterType === 'video' ? 'Select Video Asset' : (filterType === 'image' ? 'Select Image Asset' : 'Select Media Asset')}
            </h3>
          </div>
          <button className="icon-action-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}><X size={18} /></button>
        </div>

        {/* Direct Drag & Drop Zone */}
        <div 
          className={`media-dropzone glass-panel ${isDragging ? 'drag-active' : ''}`}
          style={{ padding: '20px', marginBottom: '16px' }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp size={28} color="var(--color-primary)" />
          <div className="dropzone-text">
            <strong style={{ fontSize: '0.9rem' }}>{uploading ? 'Uploading media...' : 'Drop file from your computer here'}</strong>
            <span style={{ fontSize: '0.75rem' }}>or click to browse your files</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept={filterType === 'video' ? 'video/*' : (filterType === 'image' ? 'image/*' : '*/*')}
            onChange={(e) => handleFiles(e.target.files)} 
          />
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ flex: 1, minWidth: '200px' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search library..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="cat-filter-tabs">
            {['all', 'Hero Banners', 'Photos', 'Videos', 'General'].map(cat => (
              <button 
                key={cat} 
                className={`filter-pill ${selectedCat.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

        </div>

        {/* Media Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '14px', 
          overflowY: 'auto', 
          maxHeight: '360px',
          padding: '4px'
        }}>
          {filtered.map(item => (
            <div 
              key={item.id} 
              className="admin-media-card glass-panel" 
              style={{ cursor: 'pointer', border: '1px solid rgba(23, 59, 47, 0.12)', transition: 'all 0.2s ease' }}
              onClick={() => { onSelect(item.url, item); onClose(); }}
            >
              <div style={{ height: '110px', background: '#0F172A', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {isVideoAsset(item) ? (
                  <>
                    <video src={item.url} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: '#fff' }}>
                      <div style={{ background: 'rgba(23, 59, 47, 0.85)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={14} fill="#fff" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={e => { e.target.src = 'https://placehold.co/200x200?text=Media'; }}
                  />
                )}
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-primary)' }}>{item.name}</div>
                <span className="text-muted text-xs">{item.category}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              No media found. Upload a file above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
