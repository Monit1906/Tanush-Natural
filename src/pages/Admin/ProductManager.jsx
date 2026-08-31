import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/db';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Search, 
  FolderOpen, 
  Upload, 
  Eye, 
  MoreHorizontal, 
  Layers, 
  ShoppingBag, 
  MessageSquare, 
  Leaf, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft,
  BarChart3,
  Copy,
  Package,
  ChevronDown,
  MousePointer,
  Monitor,
  Sparkles,
  Star,
  Tag,
  Compass,
  ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import MediaPickerModal from '../../components/Admin/MediaPickerModal';
import './AdminStyles.css';
import './ProductManager.css';

const ProductManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Selection state
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Active dropdown action menu
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal / Editor states
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({});
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, catData, analytics] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getDashboardAnalytics('30d')
      ]);
      setProducts(prodData || []);
      setCategories(catData || []);
      setAnalyticsData(analytics);
    } catch (e) {
      console.error('Failed to load product data:', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      ...product,
      images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : ['/images/products/product-1.jpg']),
      benefitsText: Array.isArray(product.benefits) ? product.benefits.join('\n') : (product.benefits || '')
    });
    setActiveMenuId(null);
  };

  const handleAddNew = () => {
    const newProd = {
      id: '',
      name: '',
      slug: '',
      sku: 'TNC-' + Date.now().toString().slice(-4),
      category: categories[0]?.slug || categories[0]?.id || 'wellness',
      price: 249,
      compareAtPrice: 299,
      stock: 45,
      shortDescription: '',
      description: '',
      benefitsText: '100% Pure Natural\nGentle on Sensitive Skin\nEveryday Herbal Wellness',
      ingredients: '',
      howToUse: '',
      images: ['/images/products/product-1.jpg'],
      is_active: true,
      isFeatured: false,
      isBestSeller: false
    };
    setEditingProduct('new');
    setFormData(newProd);
    setActiveMenuId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const mediaItem = await api.uploadMediaFile(file, 'Products');
        setFormData(prev => ({
          ...prev,
          images: [mediaItem.url, ...(prev.images || [])]
        }));
        showToast(`✓ Image added: ${file.name}`);
      } catch (err) {
        console.error('Product image upload error:', err);
        showToast(`Error uploading ${file.name}`);
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const benefits = formData.benefitsText
      ? formData.benefitsText.split('\n').map(s => s.trim()).filter(Boolean)
      : [];
    const images = formData.images && formData.images.length > 0 
      ? formData.images 
      : ['/images/products/product-1.jpg'];

    const productPayload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: parseFloat(formData.price) || 0,
      compareAtPrice: parseFloat(formData.compareAtPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      benefits,
      images
    };
    delete productPayload.benefitsText;

    await api.saveProduct(productPayload);
    showToast(`✓ Product "${formData.name}" saved successfully!`);
    setEditingProduct(null);
    loadData();
  };

  const handleDelete = async (id, name) => {
    setActiveMenuId(null);
    if (window.confirm(`Are you sure you want to delete product "${name}"? This action cannot be undone.`)) {
      await api.deleteProduct(id);
      showToast(`Product "${name}" deleted.`);
      loadData();
    }
  };

  const handleDuplicate = async (product) => {
    setActiveMenuId(null);
    const duplicated = {
      ...product,
      id: '',
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `TNC-${Date.now().toString().slice(-4)}`
    };
    await api.saveProduct(duplicated);
    showToast(`✓ Duplicated product "${product.name}"!`);
    loadData();
  };

  const handleMediaSelect = (url) => {
    setFormData(prev => ({
      ...prev,
      images: [url, ...(prev.images || [])]
    }));
    showToast('Image added to product gallery');
  };

  // Tab count calculations
  const publishedCount = products.filter(p => p.is_active !== false).length;
  const draftCount = products.filter(p => p.is_active === false).length;
  const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;
  const featuredCount = products.filter(p => p.isFeatured || p.is_featured).length;

  // Filter and sort products
  const filteredProducts = products.filter(p => {
    // Search
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // Category filter
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    if (!matchesCat) return false;

    // Status filter
    if (statusFilter === 'published' && p.is_active === false) return false;
    if (statusFilter === 'draft' && p.is_active !== false) return false;

    // Tabs filter
    if (activeTab === 'published' && p.is_active === false) return false;
    if (activeTab === 'draft' && p.is_active !== false) return false;
    if (activeTab === 'low_stock' && ((p.stock || 0) <= 0 || (p.stock || 0) > 10)) return false;
    if (activeTab === 'out_of_stock' && (p.stock || 0) > 0) return false;
    if (activeTab === 'featured' && !(p.isFeatured || p.is_featured)) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '');
    if (sortBy === 'oldest') return (a.id || '').localeCompare(b.id || '');
    if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'price_low') return (Number(a.price) || 0) - (Number(b.price) || 0);
    if (sortBy === 'price_high') return (Number(b.price) || 0) - (Number(a.price) || 0);
    if (sortBy === 'stock') return (Number(b.stock) || 0) - (Number(a.stock) || 0);
    return 0;
  });

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedProductIds.length === paginatedProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(paginatedProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="admin-page-container" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {notification && <div className="admin-toast">{notification}</div>}

      {/* ── Page Header ── */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#7A8B7C', textTransform: 'uppercase', marginBottom: '4px' }}>
          CATALOG
        </div>
        <div className="admin-header-actions" style={{ marginBottom: 0, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}>
              <Leaf size={22} color="#2F6B43" />
              Product Management
            </h2>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.84rem' }}>
              Manage products, pricing, botanical ingredients, stock, and product media.
            </p>
          </div>

          <button className="btn-admin-primary" onClick={handleAddNew} style={{ padding: '8px 16px', fontSize: '0.84rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px', background: '#173B2F' }}>
            <Plus size={16} />
            <span>Add Product</span>
            <ChevronDown size={14} style={{ opacity: 0.8 }} />
          </button>
        </div>
      </div>

      {/* ── Top 6 KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {/* 1. Total Products */}
        <div className="admin-kpi-card glass-liquid-panel" style={{ background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div className="admin-kpi-header" style={{ marginBottom: '8px' }}>
            <div className="admin-kpi-icon-box" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(47, 107, 67, 0.1)', color: '#2F6B43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} />
            </div>
          </div>
          <div className="admin-kpi-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B2F', marginBottom: '2px' }}>{products.length}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Total Products</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↑ 12% vs last 7 days</span>
          </div>
        </div>

        {/* 2. Categories */}
        <div className="admin-kpi-card glass-liquid-panel" style={{ background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div className="admin-kpi-header" style={{ marginBottom: '8px' }}>
            <div className="admin-kpi-icon-box" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(56, 178, 172, 0.12)', color: '#285E61', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={17} />
            </div>
          </div>
          <div className="admin-kpi-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B2F', marginBottom: '2px' }}>{categories.length}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Categories</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↑ 8% vs last 7 days</span>
          </div>
        </div>

        {/* 3. Total Orders */}
        <div className="admin-kpi-card glass-liquid-panel" style={{ background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div className="admin-kpi-header" style={{ marginBottom: '8px' }}>
            <div className="admin-kpi-icon-box" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(221, 107, 32, 0.12)', color: '#9C4221', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={17} />
            </div>
          </div>
          <div className="admin-kpi-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B2F', marginBottom: '2px' }}>{analyticsData?.kpis?.totalOrders || 0}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Total Orders</div>
          <div style={{ fontSize: '0.7rem', color: '#888', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>— 0% vs last 7 days</span>
          </div>
        </div>

        {/* 4. Messages */}
        <div className="admin-kpi-card glass-liquid-panel" style={{ background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div className="admin-kpi-header" style={{ marginBottom: '8px' }}>
            <div className="admin-kpi-icon-box" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(66, 153, 225, 0.12)', color: '#2B6CB0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={17} />
            </div>
          </div>
          <div className="admin-kpi-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B2F', marginBottom: '2px' }}>{analyticsData?.kpis?.totalMessages || 0}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Messages</div>
          <div style={{ fontSize: '0.7rem', color: '#888', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>— 0% vs last 7 days</span>
          </div>
        </div>

        {/* 5. Views / Previews */}
        <div className="admin-kpi-card glass-liquid-panel" style={{ background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div className="admin-kpi-header" style={{ marginBottom: '8px' }}>
            <div className="admin-kpi-icon-box" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(237, 100, 166, 0.12)', color: '#B83280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={17} />
            </div>
          </div>
          <div className="admin-kpi-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B2F', marginBottom: '2px' }}>{(analyticsData?.kpis?.totalViews || 0) + (analyticsData?.kpis?.totalPreviews || 0)}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Views / Previews</div>
          <div style={{ fontSize: '0.7rem', color: '#888', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>— 0% vs last 7 days</span>
          </div>
        </div>

        {/* 6. Product Revenue */}
        <div className="admin-kpi-card glass-liquid-panel" style={{ background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div className="admin-kpi-header" style={{ marginBottom: '8px' }}>
            <div className="admin-kpi-icon-box" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(47, 133, 90, 0.15)', color: '#22543D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹</span>
            </div>
          </div>
          <div className="admin-kpi-value" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#173B2F', marginBottom: '2px' }}>₹{(analyticsData?.kpis?.totalRevenue || 0).toLocaleString('en-IN')}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Product Revenue</div>
          <div style={{ fontSize: '0.7rem', color: '#888', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>— 0% vs last 7 days</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="media-filter-bar glass-liquid-panel" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '12px' }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7A8B7C' }} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.12)', background: '#FAF9F6', fontSize: '0.8rem', outline: 'none', color: '#173B2F' }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Dropdown */}
          <select 
            value={categoryFilter} 
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.12)', background: '#FAF9F6', fontSize: '0.78rem', color: '#2F3E35', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug || c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.12)', background: '#FAF9F6', fontSize: '0.78rem', color: '#2F3E35', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">Status (All)</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Sort Dropdown */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.12)', background: '#FAF9F6', fontSize: '0.78rem', color: '#2F3E35', outline: 'none', cursor: 'pointer' }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="stock">Stock: Highest</option>
          </select>

          {/* Filters Action Button */}
          <button 
            type="button" 
            className="btn-admin-secondary" 
            style={{ padding: '7px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '8px' }}
            onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setStatusFilter('all'); setActiveTab('all'); }}
            title="Reset all filters"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ── Filter Tabs with Real Counts ── */}
      <div className="cat-filter-tabs" style={{ marginBottom: '14px', background: 'transparent', padding: 0, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Products', count: products.length },
          { id: 'published', label: 'Published', count: publishedCount },
          { id: 'draft', label: 'Draft', count: draftCount },
          { id: 'low_stock', label: 'Low Stock', count: lowStockCount },
          { id: 'out_of_stock', label: 'Out of Stock', count: outOfStockCount },
          { id: 'featured', label: 'Featured', count: featuredCount }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`filter-pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
            style={{ 
              padding: '6px 14px', 
              fontSize: '0.76rem', 
              fontWeight: 600,
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              borderRadius: '20px',
              border: activeTab === tab.id ? '1px solid #173B2F' : '1px solid rgba(23, 59, 47, 0.1)',
              background: activeTab === tab.id ? '#173B2F' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#2F3E35',
              cursor: 'pointer'
            }}
          >
            <span>{tab.label}</span>
            <span style={{ 
              background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'rgba(23, 59, 47, 0.08)',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '0.68rem',
              fontWeight: 700
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Product Table ── */}
      <div className="admin-table-card glass-liquid-panel" style={{ padding: 0, overflow: 'visible', marginBottom: '16px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px' }}>
        <table className="admin-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={selectedProductIds.length > 0 && selectedProductIds.length === paginatedProducts.length} 
                  onChange={toggleSelectAll} 
                />
              </th>
              <th>PRODUCT</th>
              <th style={{ width: '150px' }}>CATEGORY</th>
              <th style={{ width: '100px' }}>PRICE</th>
              <th style={{ width: '130px' }}>STOCK</th>
              <th style={{ width: '120px' }}>STATUS</th>
              <th style={{ width: '130px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan="7" style={{ padding: '14px 16px' }}>
                    <div style={{ width: '100%', height: '28px', background: 'rgba(23, 59, 47, 0.05)', borderRadius: '6px' }} />
                  </td>
                </tr>
              ))
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '50px 20px' }} className="text-muted">
                  <Package size={36} color="#A0AEA2" style={{ margin: '0 auto 8px', display: 'block' }} />
                  <strong style={{ fontSize: '0.94rem', color: '#173B2F' }}>No products found</strong>
                  <p style={{ margin: '4px 0 12px 0', fontSize: '0.8rem' }}>No products match the selected search or filter criteria.</p>
                  <button className="btn-admin-primary" onClick={handleAddNew} style={{ margin: '0 auto', fontSize: '0.78rem' }}>
                    + Add New Product
                  </button>
                </td>
              </tr>
            ) : (
              paginatedProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                const isPublished = product.is_active !== false;
                const stockVal = Number(product.stock) || 0;
                const isFeatured = product.isFeatured || product.is_featured;
                const isBestSeller = product.isBestSeller || product.is_bestseller;
                const catObj = categories.find(c => c.slug === product.category || c.id === product.category);
                const categoryName = catObj ? catObj.name : (product.category || 'General');

                return (
                  <tr key={product.id} style={{ background: isSelected ? 'rgba(47, 107, 67, 0.04)' : 'transparent' }}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleSelectProduct(product.id)} 
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Thumbnail */}
                        <div style={{ width: '46px', height: '46px', borderRadius: '8px', overflow: 'hidden', background: '#F4F1EA', flexShrink: 0, border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                          <img 
                            src={product.images?.[0] || '/images/products/product-1.jpg'} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = '/images/products/product-1.jpg'; }}
                          />
                        </div>

                        {/* Name, SKU, Badges */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '0.86rem', color: 'var(--color-primary)' }}>
                              {product.name}
                            </strong>
                            {isFeatured && (
                              <span style={{ background: 'rgba(47, 107, 67, 0.1)', color: '#2F6B43', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600 }}>
                                Featured
                              </span>
                            )}
                            {isBestSeller && (
                              <span style={{ background: 'rgba(221, 107, 32, 0.12)', color: '#C05621', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600 }}>
                                Best Seller
                              </span>
                            )}
                          </div>
                          <div className="text-muted text-xs" style={{ marginTop: '2px' }}>
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#2F3E35' }}>
                        {categoryName}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.86rem', color: '#173B2F' }}>
                        ₹{product.price}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#173B2F' }}>
                        {stockVal} units
                      </div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 600, color: stockVal > 10 ? '#2F855A' : (stockVal > 0 ? '#DD6B20' : '#E53E3E') }}>
                        {stockVal > 10 ? 'In Stock' : (stockVal > 0 ? 'Low Stock' : 'Out of Stock')}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: isPublished ? 'rgba(47, 133, 90, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                        color: isPublished ? '#2F855A' : '#718096'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPublished ? '#2F855A' : '#718096' }} />
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                        {/* View Button */}
                        <Link 
                          to={`/product/${product.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="icon-action-btn" 
                          title="View on public store"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(23, 59, 47, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={13} color="#2F6B43" />
                        </Link>

                        {/* Edit Button */}
                        <button 
                          type="button"
                          className="icon-action-btn" 
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(23, 59, 47, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Edit2 size={13} color="#2F6B43" />
                        </button>

                        {/* More Action Menu Button */}
                        <button 
                          type="button"
                          className="icon-action-btn" 
                          onClick={() => setActiveMenuId(activeMenuId === product.id ? null : product.id)}
                          title="More actions"
                          style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(23, 59, 47, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <MoreHorizontal size={13} color="#2F6B43" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === product.id && (
                          <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.1)', borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', zIndex: 30, width: '160px', padding: '4px', textAlign: 'left' }}>
                            <div 
                              onClick={() => { navigate('/admin/product-analytics'); setActiveMenuId(null); }}
                              style={{ padding: '6px 10px', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: '#173B2F' }}
                            >
                              <BarChart3 size={13} />
                              <span>View Analytics</span>
                            </div>
                            <div 
                              onClick={() => handleDuplicate(product)}
                              style={{ padding: '6px 10px', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: '#173B2F' }}
                            >
                              <Copy size={13} />
                              <span>Duplicate</span>
                            </div>
                            <div 
                              onClick={() => handleDelete(product.id, product.name)}
                              style={{ padding: '6px 10px', fontSize: '0.74rem', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: '#E53E3E', borderTop: '1px solid rgba(0,0,0,0.05)' }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', fontSize: '0.78rem', color: '#637365' }}>
        <div>
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} products
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Page buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button 
              type="button" 
              className="icon-action-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{ width: '28px', height: '28px', borderRadius: '6px', opacity: currentPage <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: pageNum === currentPage ? 'none' : '1px solid rgba(23, 59, 47, 0.1)',
                  background: pageNum === currentPage ? '#173B2F' : '#FFFFFF',
                  color: pageNum === currentPage ? '#FFFFFF' : '#173B2F',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                {pageNum}
              </button>
            ))}

            {totalPages > 5 && <span style={{ padding: '0 4px' }}>...</span>}

            <button 
              type="button" 
              className="icon-action-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{ width: '28px', height: '28px', borderRadius: '6px', opacity: currentPage >= totalPages ? 0.4 : 1 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Page size dropdown */}
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(23, 59, 47, 0.12)', background: '#FFFFFF', fontSize: '0.74rem', color: '#2F3E35', outline: 'none' }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* ── Bottom Analytics Banner (Track Every Product Interaction) ── */}
      <div className="admin-card glass-liquid-panel" style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(23, 59, 47, 0.04) 0%, rgba(47, 107, 67, 0.02) 100%)', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(47, 107, 67, 0.12)', color: '#2F6B43', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Leaf size={20} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 2px 0', fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}>
              Track Every Product Interaction
            </h4>
            <p className="text-muted text-xs" style={{ margin: 0, color: '#637365' }}>
              Monitor views, previews, messages, buy now clicks and orders in real-time.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '18px', fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#173B2F' }}>
              <Eye size={15} color="#2F6B43" />
              <strong>{analyticsData?.kpis?.totalViews || 0}</strong> <span style={{ color: '#637365' }}>Views</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#173B2F' }}>
              <Monitor size={15} color="#38B2AC" />
              <strong>{analyticsData?.kpis?.totalPreviews || 0}</strong> <span style={{ color: '#637365' }}>Previews</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#173B2F' }}>
              <MousePointer size={15} color="#D69E2E" />
              <strong>{analyticsData?.kpis?.buyNowClicks || 0}</strong> <span style={{ color: '#637365' }}>Buy Now Clicks</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#173B2F' }}>
              <ShoppingBag size={15} color="#2B6CB0" />
              <strong>{analyticsData?.kpis?.totalOrders || 0}</strong> <span style={{ color: '#637365' }}>Orders</span>
            </span>
          </div>

          <Link to="/admin/product-analytics" className="btn-admin-secondary" style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.15)', color: '#173B2F', fontWeight: 600, textDecoration: 'none' }}>
            <BarChart3 size={15} />
            <span>View Product Analytics</span>
          </Link>
        </div>
      </div>

      {/* ── Product Edit / Creation Modal ── */}
      {editingProduct && (
        <div className="prod-modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="prod-modal-container" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="prod-modal-header">
              <div className="prod-modal-header-left">
                <div className="prod-modal-badge">
                  <Leaf size={22} />
                </div>
                <div>
                  <h3>{editingProduct === 'new' ? 'Add New Botanical Formulation' : `Edit: ${formData.name || 'Formulation'}`}</h3>
                  <p>Configure pure botanical actives, pricing matrix, inventory, and high-res media.</p>
                </div>
              </div>
              <button 
                type="button" 
                className="icon-action-btn" 
                onClick={() => setEditingProduct(null)}
                style={{ width: '34px', height: '34px', borderRadius: '10px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="prod-modal-body">
                {/* Left Column: Formulation Settings */}
                <div className="prod-form-column">
                  {/* 1. General Essentials */}
                  <div className="prod-section-card">
                    <div className="prod-section-header">
                      <div className="prod-section-icon">
                        <Tag size={15} />
                      </div>
                      <h4 className="prod-section-title">Formulation Essentials</h4>
                    </div>

                    <div className="prod-form-group">
                      <label className="prod-form-label">
                        <span>Formulation Title / Name *</span>
                        <span className="label-hint">Primary customer-facing name</span>
                      </label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        className="prod-input"
                        placeholder="e.g. Pure Aloe Vera Soothing Gel"
                        value={formData.name || ''} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          setFormData(prev => ({
                            ...prev,
                            name: val,
                            slug: editingProduct === 'new' && (!prev.slug || prev.slug === '') ? autoSlug : prev.slug
                          }));
                        }} 
                      />
                    </div>

                    <div className="prod-grid-2">
                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>SKU Code</span>
                          <span className="label-hint">Inventory identifier</span>
                        </label>
                        <input 
                          type="text" 
                          name="sku" 
                          className="prod-input"
                          placeholder="e.g. TN-ALOE-01"
                          value={formData.sku || ''} 
                          onChange={handleChange} 
                        />
                      </div>

                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>Category *</span>
                          <span className="label-hint">Product collection</span>
                        </label>
                        <select 
                          name="category" 
                          className="prod-select"
                          value={formData.category || ''} 
                          onChange={handleChange}
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="prod-form-group">
                      <label className="prod-form-label">
                        <span>URL Slug (Page Route) *</span>
                        <span className="label-hint">Unique link address</span>
                      </label>
                      <div className="prod-slug-wrapper">
                        <span className="prod-slug-prefix">tanushnatural.com/products/</span>
                        <input 
                          type="text" 
                          name="slug" 
                          required 
                          className="prod-slug-input"
                          placeholder="pure-aloe-vera-gel"
                          value={formData.slug || ''} 
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Pricing & Stock Inventory */}
                  <div className="prod-section-card">
                    <div className="prod-section-header">
                      <div className="prod-section-icon">
                        <ShoppingBag size={15} />
                      </div>
                      <h4 className="prod-section-title">Pricing &amp; Inventory Matrix</h4>
                    </div>

                    <div className="prod-grid-3">
                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>Selling Price (₹) *</span>
                        </label>
                        <div className="prod-currency-wrapper">
                          <span className="prod-currency-symbol">₹</span>
                          <input 
                            type="number" 
                            step="1" 
                            min="0" 
                            name="price" 
                            required 
                            className="prod-input prod-currency-input"
                            value={formData.price ?? ''} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>

                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>Compare MRP (₹)</span>
                        </label>
                        <div className="prod-currency-wrapper">
                          <span className="prod-currency-symbol">₹</span>
                          <input 
                            type="number" 
                            step="1" 
                            min="0" 
                            name="compareAtPrice" 
                            className="prod-input prod-currency-input"
                            value={formData.compareAtPrice ?? ''} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>

                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>Stock Inventory (Units) *</span>
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          name="stock" 
                          required 
                          className="prod-input"
                          value={formData.stock ?? ''} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Botanical Actives & Heritage */}
                  <div className="prod-section-card">
                    <div className="prod-section-header">
                      <div className="prod-section-icon">
                        <Sparkles size={15} />
                      </div>
                      <h4 className="prod-section-title">Botanical Heritage &amp; Descriptions</h4>
                    </div>

                    <div className="prod-form-group">
                      <label className="prod-form-label">
                        <span>Short Summary Description</span>
                        <span className="label-hint">Shown on listing cards</span>
                      </label>
                      <input 
                        type="text" 
                        name="shortDescription" 
                        className="prod-input"
                        placeholder="e.g. Cold-pressed, 99% pure organic aloe vera gel for intense hydration."
                        value={formData.shortDescription || ''} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="prod-form-group">
                      <label className="prod-form-label">
                        <span>Full Formulation Narrative</span>
                        <span className="label-hint">Comprehensive detail section</span>
                      </label>
                      <textarea 
                        name="description" 
                        rows={3} 
                        className="prod-textarea"
                        placeholder="Detailed formulation story, ancient Ayurvedic harvesting practices, and therapeutic benefits..."
                        value={formData.description || ''} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="prod-form-group">
                      <label className="prod-form-label">
                        <span>Botanical Key Benefits (1 Benefit Per Line)</span>
                        <span className="label-hint">Highlighted with green checks</span>
                      </label>
                      <textarea 
                        name="benefitsText" 
                        rows={3} 
                        className="prod-textarea"
                        placeholder="99% Pure Organic Aloe Vera&#10;Deep Cellular Hydration&#10;Soothes Sunburn &amp; Irritation"
                        value={formData.benefitsText || ''} 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="prod-grid-2">
                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>Ingredients</span>
                          <span className="label-hint">Active plant actives</span>
                        </label>
                        <input 
                          type="text" 
                          name="ingredients" 
                          className="prod-input"
                          placeholder="e.g. Organic Aloe Vera, Vitamin E, Rosemary Extract"
                          value={formData.ingredients || ''} 
                          onChange={handleChange} 
                        />
                      </div>

                      <div className="prod-form-group">
                        <label className="prod-form-label">
                          <span>How to Use / Ritual</span>
                          <span className="label-hint">Application guide</span>
                        </label>
                        <input 
                          type="text" 
                          name="howToUse" 
                          className="prod-input"
                          placeholder="e.g. Apply evenly over face and neck daily morning and night."
                          value={formData.howToUse || ''} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Badges & Storefront Visibility */}
                  <div className="prod-section-card">
                    <div className="prod-section-header">
                      <div className="prod-section-icon">
                        <ShieldCheck size={15} />
                      </div>
                      <h4 className="prod-section-title">Storefront Badges &amp; Status</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className={`prod-toggle-card ${formData.is_active !== false ? 'active' : ''}`}>
                        <div className="prod-toggle-meta">
                          <span className="prod-toggle-title">Published &amp; Active on Storefront</span>
                          <span className="prod-toggle-desc">Customers can discover and purchase this formulation.</span>
                        </div>
                        <label className="cat-switch">
                          <input 
                            type="checkbox" 
                            name="is_active" 
                            checked={formData.is_active !== false} 
                            onChange={handleChange} 
                          />
                          <span className="cat-switch-slider"></span>
                        </label>
                      </div>

                      <div className={`prod-toggle-card ${formData.isFeatured ? 'active' : ''}`}>
                        <div className="prod-toggle-meta">
                          <span className="prod-toggle-title">Spotlight as Featured Formulation</span>
                          <span className="prod-toggle-desc">Highlights this product on the home collections showcase.</span>
                        </div>
                        <label className="cat-switch">
                          <input 
                            type="checkbox" 
                            name="isFeatured" 
                            checked={formData.isFeatured || false} 
                            onChange={handleChange} 
                          />
                          <span className="cat-switch-slider"></span>
                        </label>
                      </div>

                      <div className={`prod-toggle-card ${formData.isBestSeller ? 'active' : ''}`}>
                        <div className="prod-toggle-meta">
                          <span className="prod-toggle-title">Award "Best Seller" Botanical Ribbon</span>
                          <span className="prod-toggle-desc">Renders an elegant golden ribbon badge on the product card.</span>
                        </div>
                        <label className="cat-switch">
                          <input 
                            type="checkbox" 
                            name="isBestSeller" 
                            checked={formData.isBestSeller || false} 
                            onChange={handleChange} 
                          />
                          <span className="cat-switch-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Media & Live Card Simulator */}
                <div className="prod-media-column">
                  {/* Gallery Uploader */}
                  <div className="prod-gallery-panel">
                    <div className="prod-gallery-header">
                      <h4>Formulation Media Gallery</h4>
                      <span style={{ fontSize: '0.74rem', color: '#637365' }}>
                        {(formData.images || []).length} Image{(formData.images || []).length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="prod-gallery-actions">
                      <button 
                        type="button" 
                        className="btn-admin-primary btn-sm" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={13} /> Upload Photos
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileUpload(e.target.files)} 
                        multiple 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                      />

                      <button 
                        type="button" 
                        className="btn-admin-secondary btn-sm" 
                        onClick={() => setShowMediaPicker(true)}
                      >
                        <FolderOpen size={13} /> Media Library
                      </button>
                    </div>

                    <div className="prod-gallery-grid">
                      {(formData.images || []).map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`prod-gallery-item ${idx === 0 ? 'primary-thumb' : ''}`}
                          title={idx === 0 ? 'Primary Display Photo' : 'Gallery Thumbnail'}
                        >
                          <img 
                            src={img} 
                            alt={`Photo ${idx + 1}`} 
                            onError={e => { e.target.src = '/images/products/product-1.jpg'; }}
                          />
                          {idx === 0 && (
                            <span className="prod-primary-badge">Main</span>
                          )}
                          <button 
                            type="button" 
                            className="prod-remove-img-btn"
                            title="Remove photo"
                            onClick={() => handleRemoveImage(idx)} 
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Storefront Product Card Miniature Live Simulator */}
                  <div className="prod-gallery-panel" style={{ background: '#FFFFFF' }}>
                    <div className="prod-gallery-header" style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', color: '#637365', textTransform: 'uppercase' }}>
                        Live Storefront Card Preview
                      </span>
                      <Compass size={16} color="#173B2F" />
                    </div>

                    <div className="prod-live-card-sim">
                      <div className="sim-prod-image-wrap">
                        <img 
                          src={formData.images?.[0] || '/images/products/product-1.jpg'} 
                          alt={formData.name || 'Product'} 
                          onError={e => { e.target.src = '/images/products/product-1.jpg'; }}
                        />
                        <span className="sim-prod-category-badge">
                          {categories.find(c => (c.slug || c.id) === formData.category)?.name || formData.category || 'Botanical'}
                        </span>
                        {formData.isBestSeller && (
                          <span className="sim-prod-ribbon">Best Seller</span>
                        )}
                      </div>

                      <div className="sim-prod-body">
                        <h4 className="sim-prod-title">
                          {formData.name || 'Untitled Botanical Formulation'}
                        </h4>

                        <div className="sim-prod-rating">
                          <span>★ 4.9</span>
                          <span style={{ color: '#A0AEC0', fontWeight: 500 }}>(38 reviews)</span>
                        </div>

                        <div className="sim-prod-price-row">
                          <span className="sim-prod-price">₹{formData.price || 0}</span>
                          {formData.compareAtPrice && Number(formData.compareAtPrice) > Number(formData.price) && (
                            <>
                              <span className="sim-prod-compare-price">₹{formData.compareAtPrice}</span>
                              <span className="sim-prod-discount-badge">
                                {Math.round(((Number(formData.compareAtPrice) - Number(formData.price)) / Number(formData.compareAtPrice)) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        <button type="button" className="sim-prod-add-btn">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Action Sticky Footer */}
              <div className="prod-modal-footer">
                <button 
                  type="button" 
                  className="btn-admin-secondary" 
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-admin-primary"
                >
                  <Check size={16} /> Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPickerModal 
          onSelect={handleMediaSelect} 
          onClose={() => setShowMediaPicker(false)} 
        />
      )}
    </div>
  );
};

export default ProductManager;
