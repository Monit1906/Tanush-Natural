import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/db';
import { resolveReelVideoUrl, isValidVideoSource, getVideoMimeType } from '../../lib/mediaResolver';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  FolderOpen, 
  Upload, 
  Video, 
  Play, 
  Search, 
  Eye, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Heart
} from 'lucide-react';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';

const StoriesManager = () => {
  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [previewDrawerStory, setPreviewDrawerStory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTargetField, setPickerTargetField] = useState('video_url');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [currentStory, setCurrentStory] = useState({
    id: '',
    title: '',
    text: '',
    image: '',
    video_url: '',
    media_id: '',
    product_id: '',
    is_active: true,
    sort_order: 1
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [storiesData, productsData, mediaData] = await Promise.all([
        api.getStories(),
        api.getProducts(),
        api.getMedia()
      ]);
      setStories((storiesData || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      setProducts(productsData || []);
      setMediaList(mediaData || []);
    } catch (e) {
      console.error('Error loading stories manager data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleEdit = (story) => {
    const videoUrl = resolveReelVideoUrl(story, mediaList);
    setCurrentStory({ 
      ...story,
      video_url: videoUrl || story.video_url || ''
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentStory({
      id: '',
      title: 'New Story Reel',
      text: 'Everyday Ritual',
      image: 'https://placehold.co/400x600?text=Reel+Cover',
      video_url: '',
      media_id: '',
      product_id: products[0]?.id || '',
      is_active: true,
      sort_order: stories.length + 1
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mov|webm|m4v)$/i);
    setUploading(true);

    try {
      const mediaItem = await api.uploadMediaFile(file, isVideo ? 'Videos' : 'Photos');
      if (isVideo) {
        setCurrentStory(prev => ({ 
          ...prev, 
          video_url: mediaItem.url,
          media_id: mediaItem.id,
          title: (prev.title === 'New Story Reel' || !prev.title) ? file.name.replace(/\.[^/.]+$/, '') : prev.title
        }));
        showToast(`✓ Video uploaded: ${file.name}`);
      } else {
        setCurrentStory(prev => ({ ...prev, image: mediaItem.url }));
        showToast(`✓ Poster image uploaded: ${file.name}`);
      }
      loadData();
    } catch (err) {
      console.error(err);
      showToast(`Error uploading ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete reel "${title}"?`)) {
      await api.deleteStory(id);
      showToast('Reel removed');
      loadData();
      if (previewDrawerStory?.id === id) setPreviewDrawerStory(null);
    }
  };

  const handleToggleStatus = async (story) => {
    const updated = { ...story, is_active: !story.is_active };
    await api.saveStory(updated);
    showToast(`Reel ${updated.is_active ? 'Published' : 'Hidden'}`);
    loadData();
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const updated = [...stories];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    for (let i = 0; i < updated.length; i++) {
      updated[i].sort_order = i + 1;
      await api.saveStory(updated[i]);
    }
    loadData();
    showToast('Reel order updated');
  };

  const handleMoveDown = async (index) => {
    if (index === stories.length - 1) return;
    const updated = [...stories];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    for (let i = 0; i < updated.length; i++) {
      updated[i].sort_order = i + 1;
      await api.saveStory(updated[i]);
    }
    loadData();
    showToast('Reel order updated');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (uploading) {
      showToast('Please wait for the media upload to complete.');
      return;
    }
    await api.saveStory(currentStory);
    showToast(`✓ Reel "${currentStory.title}" saved!`);
    setIsEditing(false);
    loadData();
  };

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.text && s.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Stories &amp; Video Reels CMS</h2>
          <p className="text-muted">Compact manager for interactive circular stories and vertical product video reels</p>
        </div>
        <button className="btn-admin-primary" onClick={handleAddNew}>
          <Plus size={16} />
          <span>Add Story / Reel</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="media-filter-bar glass-panel" style={{ marginBottom: '16px' }}>
        <div className="search-input-wrap" style={{ maxWidth: '360px' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search reels by title..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="text-muted text-xs" style={{ marginLeft: 'auto' }}>
          {filteredStories.length} total reel(s)
        </div>
      </div>

      {/* High Density Table */}
      <div className="admin-table-card glass-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>Media</th>
              <th>Reel Title &amp; Caption</th>
              <th>Video Status</th>
              <th>Linked Product</th>
              <th style={{ width: '90px' }}>Real Likes</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Reorder</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStories.map((story, index) => {
              const linkedProd = products.find(p => p.id === story.product_id);
              const videoUrl = resolveReelVideoUrl(story, mediaList);
              const hasValidVideo = isValidVideoSource(videoUrl);
              const likesCount = typeof story.likes_count === 'number' ? story.likes_count : 0;

              return (
                <tr key={story.id || index}>
                  <td>
                    <div 
                      onClick={() => setPreviewDrawerStory(story)}
                      style={{ 
                        width: '44px', 
                        height: '58px', 
                        borderRadius: '6px', 
                        overflow: 'hidden', 
                        position: 'relative', 
                        cursor: 'pointer',
                        background: '#0F172A'
                      }}
                      title="Click to Preview"
                    >
                      {hasValidVideo ? (
                        <video src={videoUrl} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://placehold.co/100x140?text=Reel'; }} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <Play size={14} fill="#fff" color="#fff" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{story.title}</strong>
                    <div className="text-muted text-xs">{story.text || 'Everyday Routine'}</div>
                  </td>
                  <td>
                    {hasValidVideo ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', fontWeight: 600, color: '#2F855A', background: 'rgba(47, 133, 90, 0.1)', padding: '3px 8px', borderRadius: '12px' }}>
                        <CheckCircle2 size={12} /> Video Ready
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', fontWeight: 600, color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', padding: '3px 8px', borderRadius: '12px' }}>
                        <AlertTriangle size={12} /> Video Missing
                      </span>
                    )}
                  </td>
                  <td>
                    {linkedProd ? (
                      <span style={{ fontSize: '0.85rem' }}>{linkedProd.name}</span>
                    ) : (
                      <span className="text-muted text-xs">None</span>
                    )}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600, color: likesCount > 0 ? '#E53E3E' : '#718096', background: likesCount > 0 ? 'rgba(229, 62, 62, 0.08)' : 'rgba(0,0,0,0.04)', padding: '3px 8px', borderRadius: '10px' }}>
                      <Heart size={12} fill={likesCount > 0 ? '#E53E3E' : 'none'} color={likesCount > 0 ? '#E53E3E' : '#718096'} />
                      <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
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
                        disabled={index === filteredStories.length - 1} 
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
                      onClick={() => handleToggleStatus(story)}
                      className={`status-badge ${story.is_active !== false ? 'status-active' : 'status-inactive'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle status"
                    >
                      {story.is_active !== false ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button 
                        type="button"
                        className="icon-action-btn"
                        onClick={() => setPreviewDrawerStory(story)}
                        title="Preview Reel"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        type="button"
                        className="icon-action-btn"
                        onClick={() => handleEdit(story)}
                        title="Edit Reel"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        type="button"
                        className="icon-action-btn danger"
                        onClick={() => handleDelete(story.id, story.title)}
                        title="Delete Reel"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-out Compact Preview Drawer */}
      {previewDrawerStory && (
        <div className="admin-modal-overlay" onClick={() => setPreviewDrawerStory(null)}>
          <div 
            className="admin-modal-content glass-liquid-panel" 
            style={{ maxWidth: '480px', padding: '24px' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Reel Live Preview</h3>
              <button className="icon-action-btn" onClick={() => setPreviewDrawerStory(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '480px', borderRadius: '16px', overflow: 'hidden', background: '#0F172A', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              {isValidVideoSource(resolveReelVideoUrl(previewDrawerStory, mediaList)) ? (
                <video 
                  src={resolveReelVideoUrl(previewDrawerStory, mediaList)} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                >
                  <source src={resolveReelVideoUrl(previewDrawerStory, mediaList)} type={getVideoMimeType(resolveReelVideoUrl(previewDrawerStory, mediaList))} />
                </video>
              ) : (
                <img 
                  src={previewDrawerStory.image} 
                  alt={previewDrawerStory.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', color: '#fff', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{previewDrawerStory.title}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{previewDrawerStory.text}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel" style={{ maxWidth: '640px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{currentStory.id ? 'Edit Story Reel' : 'New Story Reel'}</h3>
              <button className="icon-action-btn" onClick={() => setIsEditing(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px' }}>
                {/* Media Preview & Uploader Column */}
                <div>
                  <label className="admin-form-label">Video / Poster Preview</label>
                  <div style={{ 
                    width: '100%', 
                    height: '240px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    background: '#0F172A', 
                    position: 'relative',
                    marginBottom: '10px'
                  }}>
                    {currentStory.video_url && isValidVideoSource(currentStory.video_url) ? (
                      <video src={currentStory.video_url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src={currentStory.video_url} type={getVideoMimeType(currentStory.video_url)} />
                      </video>
                    ) : (
                      <img src={currentStory.image || 'https://placehold.co/400x600?text=Poster'} alt="Poster Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {uploading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', gap: '8px' }}>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Uploading file...</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label className="btn-admin-secondary text-xs" style={{ cursor: uploading ? 'not-allowed' : 'pointer', justifyContent: 'center', padding: '6px 10px', opacity: uploading ? 0.6 : 1 }}>
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
                      <span>{uploading ? 'Uploading...' : 'Upload Video'}</span>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        disabled={uploading} 
                        accept="video/*,image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e.target.files)} 
                      />
                    </label>
                    <button 
                      type="button" 
                      className="btn-admin-secondary text-xs"
                      onClick={() => { setPickerTargetField('video_url'); setShowMediaPicker(true); }}
                      style={{ justifyContent: 'center', padding: '6px 10px' }}
                    >
                      <FolderOpen size={14} /> Video Library
                    </button>
                    <button 
                      type="button" 
                      className="btn-admin-secondary text-xs"
                      onClick={() => { setPickerTargetField('image'); setShowMediaPicker(true); }}
                      style={{ justifyContent: 'center', padding: '6px 10px' }}
                    >
                      <FolderOpen size={14} /> Poster Library
                    </button>
                  </div>
                </div>

                {/* Meta Inputs Column */}
                <div>
                  <div className="form-group mb-3">
                    <label>Reel Title *</label>
                    <input 
                      type="text" 
                      required 
                      value={currentStory.title} 
                      onChange={(e) => setCurrentStory({ ...currentStory, title: e.target.value })} 
                      placeholder="e.g. Morning Rituals"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Caption / Overlay Text</label>
                    <input 
                      type="text" 
                      value={currentStory.text} 
                      onChange={(e) => setCurrentStory({ ...currentStory, text: e.target.value })} 
                      placeholder="e.g. Morning Routine"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Video Source URL / Path</label>
                    <input 
                      type="text" 
                      value={currentStory.video_url || ''} 
                      onChange={(e) => setCurrentStory({ ...currentStory, video_url: e.target.value })} 
                      placeholder="/uploads/video-file.mp4 or https://..."
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>Associated Product (Optional)</label>
                    <select 
                      value={currentStory.product_id || ''} 
                      onChange={(e) => setCurrentStory({ ...currentStory, product_id: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', background: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      <option value="">-- No linked product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Sort Order</label>
                      <input 
                        type="number" 
                        value={currentStory.sort_order || 1} 
                        onChange={(e) => setCurrentStory({ ...currentStory, sort_order: parseInt(e.target.value) || 1 })} 
                      />
                    </div>
                    <div className="form-group flex-1" style={{ justifyContent: 'center' }}>
                      <label className="checkbox-label" style={{ marginTop: '20px' }}>
                        <input 
                          type="checkbox" 
                          checked={currentStory.is_active !== false} 
                          onChange={(e) => setCurrentStory({ ...currentStory, is_active: e.target.checked })} 
                        />
                        <span>Active / Published</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(23, 59, 47, 0.08)' }}>
                <button type="button" className="btn-admin-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={uploading}>
                  <Check size={16} /> {uploading ? 'Uploading...' : 'Save Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal 
        isOpen={showMediaPicker} 
        onClose={() => setShowMediaPicker(false)} 
        onSelect={(url, mediaItem) => {
          if (pickerTargetField === 'video_url') {
            setCurrentStory(prev => ({ 
              ...prev, 
              video_url: url,
              media_id: mediaItem?.id || prev.media_id
            }));
          } else {
            setCurrentStory(prev => ({ ...prev, [pickerTargetField]: url }));
          }
        }} 
        filterType={pickerTargetField === 'video_url' ? 'video' : 'image'}
      />
    </div>
  );
};

export default StoriesManager;

