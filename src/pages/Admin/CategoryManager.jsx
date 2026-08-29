import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/db';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff, FolderOpen, Upload } from 'lucide-react';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState({
    id: '',
    name: '',
    slug: '',
    image: '',
    description: '',
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    const data = await api.getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleEdit = (category) => {
    setCurrentCategory({ ...category });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentCategory({
      id: '',
      name: '',
      slug: '',
      image: '/images/categories/all.jpg',
      description: '',
      is_active: true
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const mediaItem = await api.uploadMediaFile(file, 'Categories');
      setCurrentCategory(prev => ({ ...prev, image: mediaItem.url }));
      showToast(`✓ Image loaded: ${file.name}`);
    } catch (err) {
      console.error(err);
      showToast(`Error uploading ${file.name}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"? Products in this category will become uncategorized.`)) {
      await api.deleteCategory(id);
      showToast(`Category "${name}" deleted`);
      loadCategories();
    }
  };

  const handleToggleStatus = async (cat) => {
    await api.saveCategory({ ...cat, is_active: !cat.is_active });
    showToast(`Category "${cat.name}" is now ${!cat.is_active ? 'Active' : 'Hidden'}`);
    loadCategories();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const slug = currentCategory.slug || currentCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await api.saveCategory({ ...currentCategory, slug });
    showToast(`✓ Category "${currentCategory.name}" saved successfully`);
    setIsEditing(false);
    loadCategories();
  };

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Category Management</h2>
          <p className="text-muted">Create, edit, and organize product categories on Tanush Natural</p>
        </div>
        <button className="btn-admin-primary" onClick={handleAddNew}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isEditing ? (
        <div className="admin-form-card glass-panel">
          <div className="form-header">
            <h3>{currentCategory.id ? 'Edit Category' : 'Create New Category'}</h3>
            <button className="btn-admin-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Category Name *</label>
                <input 
                  type="text" 
                  required 
                  value={currentCategory.name} 
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} 
                />
              </div>
              <div className="form-group flex-1">
                <label>Category Slug</label>
                <input 
                  type="text" 
                  placeholder="e.g. skin-care"
                  value={currentCategory.slug} 
                  onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })} 
                />
              </div>
            </div>

            {/* Visual Image Uploader */}
            <div className="form-group">
              <label>Category Cover Image</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(23, 59, 47, 0.15)', background: '#f5f5f5' }}>
                  <img 
                    src={currentCategory.image || '/images/categories/all.jpg'} 
                    alt="Category preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://placehold.co/100x100?text=Cat'; }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-admin-secondary btn-sm" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} /> Upload the data
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="*/*"
                    onChange={(e) => handleFileUpload(e.target.files)} 
                  />

                  <button 
                    type="button" 
                    className="btn-admin-secondary btn-sm" 
                    onClick={() => setShowMediaPicker(true)}
                  >
                    <FolderOpen size={14} /> Choose from Library
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows={3} 
                value={currentCategory.description} 
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={currentCategory.is_active} 
                  onChange={(e) => setCurrentCategory({ ...currentCategory, is_active: e.target.checked })} 
                />
                <span>Active & Visible on Public Website</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-admin-primary">
                <Check size={18} /> Save Category
              </button>
            </div>
          </form>

          <MediaPickerModal 
            isOpen={showMediaPicker} 
            filterType="image"
            onClose={() => setShowMediaPicker(false)} 
            onSelect={(url) => setCurrentCategory({ ...currentCategory, image: url })} 
          />
        </div>
      ) : (
        <div className="admin-table-card glass-panel">
          {loading ? (
            <div className="admin-loading">Loading categories...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ width: '60px' }}>
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="cat-table-thumb"
                        onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Cat'; }}
                      />
                    </td>
                    <td>
                      <strong>{cat.name}</strong>
                    </td>
                    <td><code>{cat.id || cat.slug}</code></td>
                    <td>
                      <span className={`status-badge ${cat.is_active !== false ? 'status-active' : 'status-draft'}`}>
                        {cat.is_active !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="icon-action-btn" 
                        title={cat.is_active !== false ? 'Hide' : 'Show'}
                        onClick={() => handleToggleStatus(cat)}
                      >
                        {cat.is_active !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button className="icon-action-btn" onClick={() => handleEdit(cat)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-action-btn danger" onClick={() => handleDelete(cat.id, cat.name)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
