import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Eye, EyeOff, Search, Save, X, 
  Upload, Image as ImageIcon, ArrowUp, ArrowDown, Sparkles, Check
} from 'lucide-react';
import { api } from '../../lib/db';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import { AdminSkeleton } from '../../components/Skeletons/Skeleton';

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
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Drawer / Editor state
  const [editingItem, setEditingItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditingSectionTexts, setIsEditingSectionTexts] = useState(false);

  // Media Picker state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await api.getSocialSection();
    if (data) {
      setSectionData({
        eyebrow: data.eyebrow || '07 — SOCIAL',
        heading: data.heading || 'FOLLOW THE TANUSH JOURNEY',
        subtitle: data.subtitle || "Everyday inspiration, natural living and what's new at Tanush.",
        callout_title: data.callout_title || 'Rooted in nature,\nmade for you.',
        hashtag: data.hashtag || '#TanushNatural',
        instagram_link: data.instagram_link || 'https://instagram.com/TanushNatural',
        items: data.items || []
      });
    }
    setLoading(false);
  };

  const handleSaveSection = async (updatedData = sectionData) => {
    try {
      await api.saveSocialSection(updatedData);
      showToast('Follow the Journey gallery saved and published!');
    } catch (err) {
      console.error(err);
      showToast('Error saving data');
    }
  };

  const handleAddNew = () => {
    setEditingItem({
      id: 'j' + Date.now(),
      image: '/images/social/social-1.jpg',
      title: 'New Journey Moment',
      is_active: true
    });
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsDrawerOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title || 'this image'}" from the Journey drift wall?`)) {
      const updatedItems = sectionData.items.filter(i => i.id !== id);
      const updated = { ...sectionData, items: updatedItems };
      setSectionData(updated);
      handleSaveSection(updated);
      showToast('Image removed from Journey gallery');
    }
  };

  const handleToggleStatus = (item) => {
    const updatedItems = sectionData.items.map(i => 
      i.id === item.id ? { ...i, is_active: !i.is_active } : i
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

  // Direct Computer Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      await api.addMedia({
        name: file.name,
        url: dataUrl,
        category: 'Social Journey',
        size: `${Math.round(file.size / 1024)} KB`
      });

      setEditingItem(prev => ({ ...prev, image: dataUrl }));
      showToast(`Uploaded and assigned ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const filteredItems = (sectionData.items || []).filter(item => 
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Follow the Tanush Journey CMS</h2>
          <p className="text-muted">Compact manager for homepage interactive drift wall photo gallery</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-admin-secondary" 
            onClick={() => setIsEditingSectionTexts(!isEditingSectionTexts)}
          >
            <Sparkles size={16} />
            <span>{isEditingSectionTexts ? 'Hide Header Settings' : 'Header & Texts'}</span>
          </button>
          <button className="btn-admin-primary" onClick={handleAddNew}>
            <Plus size={16} />
            <span>Add Journey Image</span>
          </button>
        </div>
      </div>

      {/* Collapsible Section Texts Card */}
      {isEditingSectionTexts && (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--color-primary)' }}>Section Titles & Hashtag Settings</h3>
            <button 
              className="btn-admin-primary" 
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={() => {
                handleSaveSection();
                setIsEditingSectionTexts(false);
              }}
            >
              <Save size={14} /> Save Header
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Eyebrow Tag</label>
              <input 
                type="text" 
                className="admin-input" 
                value={sectionData.eyebrow}
                onChange={e => setSectionData({ ...sectionData, eyebrow: e.target.value })}
                placeholder="07 — SOCIAL"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Main Heading</label>
              <input 
                type="text" 
                className="admin-input" 
                value={sectionData.heading}
                onChange={e => setSectionData({ ...sectionData, heading: e.target.value })}
                placeholder="FOLLOW THE TANUSH JOURNEY"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Callout Title</label>
              <input 
                type="text" 
                className="admin-input" 
                value={sectionData.callout_title}
                onChange={e => setSectionData({ ...sectionData, callout_title: e.target.value })}
                placeholder="Rooted in nature, made for you."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Hashtag Text</label>
              <input 
                type="text" 
                className="admin-input" 
                value={sectionData.hashtag}
                onChange={e => setSectionData({ ...sectionData, hashtag: e.target.value })}
                placeholder="#TanushNatural"
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="admin-form-label">Subtitle Description</label>
              <input 
                type="text" 
                className="admin-input" 
                value={sectionData.subtitle}
                onChange={e => setSectionData({ ...sectionData, subtitle: e.target.value })}
                placeholder="Everyday inspiration, natural living and what's new at Tanush."
              />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar & Filter Bar */}
      <div className="media-filter-bar glass-panel" style={{ marginBottom: '16px' }}>
        <div className="search-input-wrap" style={{ maxWidth: '360px' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search journey cards by title..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="text-muted text-xs" style={{ marginLeft: 'auto' }}>
          {filteredItems.length} total image(s)
        </div>
      </div>

      {/* Compact High-Density Table */}
      <div className="admin-table-card glass-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Preview</th>
              <th>Photo Caption & Title</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Sort / Move</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <div 
                    onClick={() => setPreviewItem(item)}
                    style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      position: 'relative', 
                      cursor: 'pointer',
                      background: '#F0EFEA'
                    }}
                    title="Click to Preview"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={e => { e.target.src = '/images/social/social-1.jpg'; }} 
                    />
                  </div>
                </td>
                <td>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{item.title || 'Untitled Moment'}</strong>
                  <div className="text-muted text-xs">Card #{index + 1} &bull; Drift Tile</div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      disabled={index === sectionData.items.length - 1}
                      onClick={() => handleMove(index, 1)}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <button 
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`status-badge ${item.is_active !== false ? 'status-active' : 'status-inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    title="Click to toggle visibility"
                  >
                    {item.is_active !== false ? 'Published' : 'Hidden'}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      onClick={() => setPreviewItem(item)}
                      title="Preview"
                    >
                      <Eye size={15} />
                    </button>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      onClick={() => handleEdit(item)}
                      title="Edit Image"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button 
                      type="button"
                      className="icon-action-btn danger"
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete Image"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out Edit Drawer */}
      {isDrawerOpen && editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel" style={{ maxWidth: '520px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Edit Journey Photo Card</h3>
              <button className="icon-action-btn" onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDrawerItem}>
              {/* Photo Preview & Source Selector */}
              <div className="admin-form-group">
                <label className="admin-form-label">Photo Asset</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', background: '#F0EFEA' }}>
                    <img src={editingItem.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label className="btn-admin-secondary" style={{ cursor: 'pointer', justifyContent: 'center' }}>
                      <Upload size={15} />
                      <span>Upload the data</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                    <button 
                      type="button" 
                      className="btn-admin-secondary" 
                      onClick={() => setShowMediaPicker(true)}
                      style={{ justifyContent: 'center' }}
                    >
                      <ImageIcon size={15} />
                      <span>Choose from Library</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Title / Caption Input */}
              <div className="admin-form-group">
                <label className="admin-form-label">Caption / Title</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={editingItem.title || ''} 
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Natural Living"
                  required
                />
              </div>

              {/* Visibility Toggle */}
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input 
                  type="checkbox" 
                  id="journey_active" 
                  checked={editingItem.is_active !== false} 
                  onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="journey_active" style={{ fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer' }}>
                  Published and visible on Drift Wall
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn-admin-secondary" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  <Save size={16} /> Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="admin-modal-overlay" onClick={() => setPreviewItem(null)}>
          <div className="admin-modal-content glass-panel" style={{ maxWidth: '440px', padding: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong style={{ fontSize: '0.95rem' }}>{previewItem.title}</strong>
              <button className="icon-action-btn" onClick={() => setPreviewItem(null)}>
                <X size={16} />
              </button>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', maxHeight: '480px' }}>
              <img src={previewItem.image} alt={previewItem.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
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
