import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/db';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  FolderOpen, 
  Upload, 
  ArrowLeft, 
  Layers, 
  Sparkles, 
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  PackageCheck,
  Settings2
} from 'lucide-react';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';
import './CategoryManager.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAllProducts, setIsEditingAllProducts] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState('category'); // 'category' | 'allProducts'
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const allProductsFileInputRef = useRef(null);
  
  // Custom Category State
  const [currentCategory, setCurrentCategory] = useState({
    id: '',
    name: '',
    slug: '',
    image: '',
    description: '',
    is_active: true,
    sort_order: 1,
    is_featured: false
  });

  // "All Products" Special Tile State
  const [allProductsTile, setAllProductsTile] = useState({
    title: 'All Products',
    image: '/images/categories/all.jpg',
    is_active: true,
    description: 'Explore entire Tanush Natural botanical living collection'
  });
  
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, settings] = await Promise.all([
        api.getCategories(),
        api.getSiteSettings()
      ]);
      setCategories(cats || []);
      if (settings) {
        setSiteSettings(settings);
        if (settings.all_products_tile) {
          setAllProductsTile(settings.all_products_tile);
        }
      }
    } catch (e) {
      console.error('Failed loading categories & settings:', e);
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

  const handleEdit = (category) => {
    setCurrentCategory({
      id: category.id || '',
      name: category.name || '',
      slug: category.slug || '',
      image: category.image || '/images/categories/all.jpg',
      description: category.description || '',
      is_active: category.is_active !== false,
      sort_order: category.sort_order || 1,
      is_featured: category.is_featured || false
    });
    setIsEditingAllProducts(false);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentCategory({
      id: '',
      name: '',
      slug: '',
      image: '/images/categories/all.jpg',
      description: '',
      is_active: true,
      sort_order: (categories.length || 0) + 1,
      is_featured: false
    });
    setIsEditingAllProducts(false);
    setIsEditing(true);
  };

  const handleEditAllProducts = () => {
    setIsEditing(false);
    setIsEditingAllProducts(true);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    const generatedSlug = newName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setCurrentCategory(prev => ({
      ...prev,
      name: newName,
      slug: !prev.id || prev.slug === '' ? generatedSlug : prev.slug
    }));
  };

  const handleFileUpload = async (files, target = 'category') => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const mediaItem = await api.uploadMediaFile(file, 'Categories');
      if (target === 'allProducts') {
        setAllProductsTile(prev => ({ ...prev, image: mediaItem.url }));
        showToast(`✓ "All Products" cover image loaded: ${file.name}`);
      } else {
        setCurrentCategory(prev => ({ ...prev, image: mediaItem.url }));
        showToast(`✓ Category image loaded: ${file.name}`);
      }
    } catch (err) {
      console.error(err);
      showToast(`Error uploading ${file.name}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"? Products in this category will become uncategorized.`)) {
      await api.deleteCategory(id);
      showToast(`✓ Category "${name}" deleted`);
      loadData();
    }
  };

  const handleToggleStatus = async (cat) => {
    const updated = { ...cat, is_active: !cat.is_active };
    await api.saveCategory(updated);
    showToast(`✓ Category "${cat.name}" is now ${!cat.is_active ? 'Active' : 'Hidden'}`);
    loadData();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) {
      showToast('Please provide a category name.');
      return;
    }

    setSaving(true);
    try {
      const slug = currentCategory.slug.trim() || currentCategory.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const id = currentCategory.id || slug;
      
      const payload = {
        ...currentCategory,
        id,
        slug
      };

      await api.saveCategory(payload);
      showToast(`✓ Category "${currentCategory.name}" saved successfully!`);
      setIsEditing(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Save All Products Special Tile
  const handleSaveAllProducts = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedSettings = {
        ...(siteSettings || {}),
        all_products_tile: allProductsTile
      };
      await api.saveSiteSettings(updatedSettings);
      setSiteSettings(updatedSettings);
      showToast('✓ "All Products" tile customization saved globally!');
      setIsEditingAllProducts(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving All Products tile.');
    } finally {
      setSaving(false);
    }
  };

  // KPIs
  const activeCount = categories.filter(c => c.is_active !== false).length;
  const featuredCount = categories.filter(c => c.is_featured).length;

  return (
    <div className="admin-page-container category-manager-container">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Main Page Header */}
      <div className="admin-header-actions">
        <div>
          <h2>Category &amp; Collection Management</h2>
          <p className="text-muted">Create, edit, and organize product category cards &amp; the global "All Products" showcase tile.</p>
        </div>
        {!isEditing && !isEditingAllProducts && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-admin-secondary" onClick={handleEditAllProducts}>
              <Settings2 size={16} /> Edit "All Products" Tile
            </button>
            <button className="btn-admin-primary" onClick={handleAddNew}>
              <Plus size={16} /> Create Category
            </button>
          </div>
        )}
      </div>

      {/* Statistics Bar (Visible when browsing table) */}
      {!isEditing && !isEditingAllProducts && (
        <>
          <div className="category-stats-grid">
            <div className="category-stat-card">
              <div className="category-stat-icon">
                <Layers size={22} />
              </div>
              <div className="category-stat-info">
                <h4>Total Categories</h4>
                <div className="stat-number">{categories.length}</div>
              </div>
            </div>

            <div className="category-stat-card">
              <div className="category-stat-icon green">
                <CheckCircle2 size={22} />
              </div>
              <div className="category-stat-info">
                <h4>Active in Storefront</h4>
                <div className="stat-number">{activeCount}</div>
              </div>
            </div>

            <div className="category-stat-card">
              <div className="category-stat-icon gold">
                <Sparkles size={22} />
              </div>
              <div className="category-stat-info">
                <h4>Home Featured</h4>
                <div className="stat-number">{featuredCount}</div>
              </div>
            </div>
          </div>

          {/* Dedicated "All Products" Squircle Card Customizer Banner */}
          <div className="all-products-customizer-banner">
            <div className="all-products-info-side">
              <span className="all-products-badge">
                <PackageCheck size={14} /> Global Storefront Root Collection
              </span>
              <h3>"All Products" Category Tile</h3>
              <p>
                Controls the primary filter tile on the public <code>/shop</code> category carousel. Customize the cover image, title typography, and visibility.
              </p>
              <button 
                type="button" 
                className="btn-admin-primary btn-sm"
                onClick={handleEditAllProducts}
              >
                <Edit2 size={14} /> Customize "All Products" Card
              </button>
            </div>

            <div className="all-products-card-preview-side">
              <div className="admin-squircle-preview">
                <div className="admin-squircle-frame">
                  <img 
                    src={allProductsTile.image || '/images/categories/all.jpg'} 
                    alt={allProductsTile.title} 
                    onError={e => { e.target.src = '/images/categories/all.jpg'; }}
                  />
                </div>
                <span className="admin-squircle-label">{allProductsTile.title || 'ALL PRODUCTS'}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Screen 1: "All Products" Customizer Modal / View */}
      {isEditingAllProducts && (
        <div className="category-editor-card">
          <div className="category-editor-header">
            <div className="category-editor-title-wrap">
              <div className="category-editor-badge" style={{ background: '#173B2F' }}>
                <PackageCheck size={20} />
              </div>
              <div>
                <h3>Customize "All Products" Category Tile</h3>
                <p>Edit the global catalog showcase card displayed across the shop page.</p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-admin-secondary btn-sm" 
              onClick={() => setIsEditingAllProducts(false)}
            >
              <ArrowLeft size={14} /> Back to Overview
            </button>
          </div>

          <form onSubmit={handleSaveAllProducts}>
            <div className="category-editor-body">
              {/* Left Form */}
              <div className="editor-form-col">
                <div className="cat-form-group">
                  <label className="cat-form-label">
                    <span>Card Display Title *</span>
                    <span className="label-hint">Shown below the rounded tile</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="cat-input-text"
                    value={allProductsTile.title} 
                    onChange={(e) => setAllProductsTile({ ...allProductsTile, title: e.target.value })} 
                    placeholder="ALL PRODUCTS"
                  />
                </div>

                <div className="cat-form-group">
                  <label className="cat-form-label">
                    <span>Description / Subtitle</span>
                    <span className="label-hint">Optional SEO or tooltip notes</span>
                  </label>
                  <textarea 
                    rows={2} 
                    className="cat-textarea"
                    value={allProductsTile.description || ''} 
                    onChange={(e) => setAllProductsTile({ ...allProductsTile, description: e.target.value })} 
                    placeholder="Explore our complete range of 100% natural, ayurvedic living essentials..."
                  />
                </div>

                <div className={`cat-toggle-card ${allProductsTile.is_active ? 'active' : ''}`}>
                  <div className="cat-toggle-meta">
                    <span className="toggle-title">Show "All Products" Tile in Shop Filter Bar</span>
                    <span className="toggle-desc">When disabled, customers will browse specific categories only.</span>
                  </div>
                  <label className="cat-switch">
                    <input 
                      type="checkbox" 
                      checked={allProductsTile.is_active} 
                      onChange={(e) => setAllProductsTile({ ...allProductsTile, is_active: e.target.checked })} 
                    />
                    <span className="cat-switch-slider"></span>
                  </label>
                </div>
              </div>

              {/* Right Media & Squircle Preview */}
              <div className="editor-media-col">
                <div className="cat-preview-panel">
                  <div className="cat-preview-header">
                    <span>Cover Artwork</span>
                    <ImageIcon size={16} />
                  </div>

                  <div className="cat-media-uploader-box">
                    <div className="cat-image-frame">
                      <img 
                        src={allProductsTile.image || '/images/categories/all.jpg'} 
                        alt="Preview" 
                        onError={e => { e.target.src = '/images/categories/all.jpg'; }}
                      />
                    </div>

                    <div className="cat-upload-actions">
                      <button 
                        type="button" 
                        className="btn-admin-primary btn-sm" 
                        onClick={() => allProductsFileInputRef.current?.click()}
                      >
                        <Upload size={13} /> Upload Image
                      </button>
                      <input 
                        type="file" 
                        ref={allProductsFileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'allProducts')} 
                      />

                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm" 
                        onClick={() => {
                          setMediaPickerTarget('allProducts');
                          setShowMediaPicker(true);
                        }}
                      >
                        <FolderOpen size={13} /> From Library
                      </button>
                    </div>
                  </div>

                  <div className="cat-preview-header" style={{ marginTop: '20px' }}>
                    <span>Storefront Live Squircle Simulator</span>
                    <Compass size={16} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                    <div className="admin-squircle-preview" style={{ width: '100%', maxWidth: '220px' }}>
                      <div className="admin-squircle-frame">
                        <img 
                          src={allProductsTile.image || '/images/categories/all.jpg'} 
                          alt={allProductsTile.title} 
                        />
                      </div>
                      <span className="admin-squircle-label">{allProductsTile.title || 'ALL PRODUCTS'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="category-editor-footer">
              <button 
                type="button" 
                className="btn-admin-secondary" 
                onClick={() => setIsEditingAllProducts(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-admin-primary"
                disabled={saving}
              >
                <Check size={16} /> {saving ? 'Saving...' : 'Save "All Products" Tile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Screen 2: Custom Category Create / Edit Form */}
      {isEditing && (
        <div className="category-editor-card">
          <div className="category-editor-header">
            <div className="category-editor-title-wrap">
              <div className="category-editor-badge">
                <Layers size={20} />
              </div>
              <div>
                <h3>{currentCategory.id ? `Edit: ${currentCategory.name || 'Category'}` : 'Create New Category'}</h3>
                <p>Configure category title, URL route, cover artwork, and storefront presentation.</p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-admin-secondary btn-sm" 
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft size={14} /> Back to Overview
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="category-editor-body">
              {/* Left Column: Form Details */}
              <div className="editor-form-col">
                <div className="cat-form-group">
                  <label className="cat-form-label">
                    <span>Category Display Name *</span>
                    <span className="label-hint">Shown on headers & navigation</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="cat-input-text"
                    placeholder="e.g. Mosquito Spray & Vaporisers"
                    value={currentCategory.name} 
                    onChange={handleNameChange} 
                  />
                </div>

                <div className="cat-form-group">
                  <label className="cat-form-label">
                    <span>Category URL Slug *</span>
                    <span className="label-hint">Direct page link parameter</span>
                  </label>
                  <div className="cat-slug-wrapper">
                    <span className="cat-slug-prefix">tanushnatural.com/shop?category=</span>
                    <input 
                      type="text" 
                      required
                      className="cat-slug-input"
                      placeholder="e.g. mosquito-spray"
                      value={currentCategory.slug} 
                      onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })} 
                    />
                  </div>
                </div>

                <div className="cat-form-group">
                  <label className="cat-form-label">
                    <span>Botanical Description (SEO & Story)</span>
                    <span className="label-hint">Optional subtitle summary</span>
                  </label>
                  <textarea 
                    rows={3} 
                    className="cat-textarea"
                    placeholder="Natural repellent formulations and herbal diffusers engineered with 100% plant-based actives..."
                    value={currentCategory.description} 
                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })} 
                  />
                </div>

                <div className="cat-form-group">
                  <label className="cat-form-label">
                    <span>Display Sequence (Sort Order)</span>
                    <span className="label-hint">Lower numbers display first</span>
                  </label>
                  <input 
                    type="number" 
                    className="cat-input-text"
                    style={{ maxWidth: '140px' }}
                    min="1"
                    value={currentCategory.sort_order || 1} 
                    onChange={(e) => setCurrentCategory({ ...currentCategory, sort_order: parseInt(e.target.value, 10) || 1 })} 
                  />
                </div>

                {/* Status Toggles */}
                <div className={`cat-toggle-card ${currentCategory.is_active ? 'active' : ''}`}>
                  <div className="cat-toggle-meta">
                    <span className="toggle-title">Active & Visible in Storefront</span>
                    <span className="toggle-desc">When enabled, customers can discover and browse this category in shop filters.</span>
                  </div>
                  <label className="cat-switch">
                    <input 
                      type="checkbox" 
                      checked={currentCategory.is_active} 
                      onChange={(e) => setCurrentCategory({ ...currentCategory, is_active: e.target.checked })} 
                    />
                    <span className="cat-switch-slider"></span>
                  </label>
                </div>

                <div className={`cat-toggle-card ${currentCategory.is_featured ? 'active' : ''}`}>
                  <div className="cat-toggle-meta">
                    <span className="toggle-title">Feature on Homepage Carousel</span>
                    <span className="toggle-desc">Spotlight this collection on the public homepage category banner track.</span>
                  </div>
                  <label className="cat-switch">
                    <input 
                      type="checkbox" 
                      checked={currentCategory.is_featured} 
                      onChange={(e) => setCurrentCategory({ ...currentCategory, is_featured: e.target.checked })} 
                    />
                    <span className="cat-switch-slider"></span>
                  </label>
                </div>
              </div>

              {/* Right Column: Cover Media & Live Squircle Simulator */}
              <div className="editor-media-col">
                <div className="cat-preview-panel">
                  <div className="cat-preview-header">
                    <span>Category Cover Artwork</span>
                    <ImageIcon size={16} />
                  </div>

                  <div className="cat-media-uploader-box">
                    <div className="cat-image-frame">
                      <img 
                        src={currentCategory.image || '/images/categories/all.jpg'} 
                        alt="Category preview" 
                        onError={e => { e.target.src = 'https://placehold.co/300x300?text=Category+Image'; }}
                      />
                    </div>

                    <div className="cat-upload-actions">
                      <button 
                        type="button" 
                        className="btn-admin-primary btn-sm" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={13} /> Upload Image
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'category')} 
                      />

                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm" 
                        onClick={() => {
                          setMediaPickerTarget('category');
                          setShowMediaPicker(true);
                        }}
                      >
                        <FolderOpen size={13} /> From Library
                      </button>
                    </div>
                  </div>

                  {/* Customer Storefront Squircle Simulation */}
                  <div className="cat-preview-header" style={{ marginTop: '20px' }}>
                    <span>Storefront Squircle Live Simulation</span>
                    <Compass size={16} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                    <div className="admin-squircle-preview" style={{ width: '100%', maxWidth: '220px' }}>
                      <div className="admin-squircle-frame">
                        <img 
                          src={currentCategory.image || '/images/categories/all.jpg'} 
                          alt={currentCategory.name || 'Category'} 
                          onError={e => { e.target.src = '/images/categories/all.jpg'; }}
                        />
                      </div>
                      <span className="admin-squircle-label">{currentCategory.name || 'UNTITLED'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="category-editor-footer">
              <button 
                type="button" 
                className="btn-admin-secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-admin-primary"
                disabled={saving}
              >
                <Check size={16} /> {saving ? 'Saving Category...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table View */}
      {!isEditing && !isEditingAllProducts && (
        <div className="admin-table-card glass-panel">
          {loading ? (
            <div className="admin-loading" style={{ padding: '40px', textAlign: 'center', color: '#637365' }}>
              Loading categories...
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '64px' }}>Artwork</th>
                  <th>Category Title &amp; Details</th>
                  <th>Route Slug</th>
                  <th style={{ textAlign: 'center' }}>Home Featured</th>
                  <th>Visibility</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Pinned "All Products" Row */}
                <tr style={{ background: 'rgba(23, 59, 47, 0.02)' }}>
                  <td>
                    <div className="cat-table-thumb-wrap" style={{ border: '1.5px solid #173B2F' }}>
                      <img 
                        src={allProductsTile.image || '/images/categories/all.jpg'} 
                        alt={allProductsTile.title} 
                      />
                    </div>
                  </td>
                  <td className="cat-name-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{allProductsTile.title || 'All Products'}</strong>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', color: '#173B2F', background: 'rgba(23, 59, 47, 0.08)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        Global Root Tile
                      </span>
                    </div>
                    <div className="cat-desc-preview">{allProductsTile.description || 'Global storefront all-products filter'}</div>
                  </td>
                  <td>
                    <span className="cat-slug-badge">/shop?category=all</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#637365' }}>Shop Filter Bar</span>
                  </td>
                  <td>
                    <span className={`status-pill ${allProductsTile.is_active !== false ? 'active' : 'draft'}`}>
                      {allProductsTile.is_active !== false ? '● Active' : '○ Hidden'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button 
                        className="icon-action-btn" 
                        title="Customize All Products Tile"
                        onClick={handleEditAllProducts}
                      >
                        <Edit2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Custom Categories Rows */}
                {categories.map((cat) => (
                  <tr key={cat.id || cat.slug}>
                    <td>
                      <div className="cat-table-thumb-wrap">
                        <img 
                          src={cat.image || '/images/categories/all.jpg'} 
                          alt={cat.name} 
                          onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Cat'; }}
                        />
                      </div>
                    </td>
                    <td className="cat-name-cell">
                      <strong>{cat.name}</strong>
                      {cat.description && (
                        <div className="cat-desc-preview">{cat.description}</div>
                      )}
                    </td>
                    <td>
                      <span className="cat-slug-badge">/{cat.slug || cat.id}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {cat.is_featured ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: '#B48228', background: 'rgba(180, 130, 40, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                          <Sparkles size={12} /> Featured
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${cat.is_active !== false ? 'active' : 'draft'}`}>
                        {cat.is_active !== false ? '● Active' : '○ Hidden'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          className="icon-action-btn" 
                          title={cat.is_active !== false ? 'Hide from Storefront' : 'Show in Storefront'}
                          onClick={() => handleToggleStatus(cat)}
                        >
                          {cat.is_active !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button 
                          className="icon-action-btn" 
                          title="Edit Category"
                          onClick={() => handleEdit(cat)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="icon-action-btn danger" 
                          title="Delete Category"
                          onClick={() => handleDelete(cat.id, cat.name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={showMediaPicker} 
        filterType="image"
        onClose={() => setShowMediaPicker(false)} 
        onSelect={(url) => {
          if (mediaPickerTarget === 'allProducts') {
            setAllProductsTile(prev => ({ ...prev, image: url }));
          } else {
            setCurrentCategory(prev => ({ ...prev, image: url }));
          }
        }} 
      />
    </div>
  );
};

export default CategoryManager;
