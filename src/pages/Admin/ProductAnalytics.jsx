import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Package, 
  Layers, 
  Eye, 
  MessageSquare, 
  ShoppingBag, 
  TrendingUp, 
  ChevronRight, 
  X, 
  Clock, 
  Users, 
  DollarSign, 
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import './AdminStyles.css';

const ProductAnalytics = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [prods, cats, evts, msgs, ords] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getAnalyticsEvents(),
        api.getMessages(),
        api.getOrders()
      ]);
      setProducts(prods);
      setCategories(cats);
      setEvents(evts);
      setMessages(msgs);
      setOrders(ords);
      setLoading(false);
    };
    loadData();
  }, [timeframe]);

  // Aggregate product performance metrics
  const enrichedProducts = products.map(prod => {
    const prodEvents = events.filter(e => String(e.product_id) === String(prod.id));
    const prodViews = prodEvents.filter(e => e.type === 'view').length;
    const prodPreviews = prodEvents.filter(e => e.type === 'preview').length;
    const prodBuyNow = prodEvents.filter(e => e.type === 'buy_now').length;
    const prodMessages = messages.filter(m => String(m.product_id) === String(prod.id));
    
    let prodOrders = 0;
    let prodRevenue = 0;
    const relevantOrders = [];
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        if (String(item.product_id) === String(prod.id)) {
          prodOrders += (Number(item.quantity) || 1);
          prodRevenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
          relevantOrders.push({ ...o, quantity: item.quantity, itemPrice: item.price });
        }
      });
    });

    const totalEngagement = prodViews + prodPreviews + prodMessages.length + prodBuyNow + prodOrders;
    const conversionRate = (prodViews + prodPreviews) > 0 
      ? ((prodOrders / (prodViews + prodPreviews)) * 100).toFixed(1) 
      : (prodOrders > 0 ? '100.0' : '0.0');

    return {
      ...prod,
      views: prodViews,
      previews: prodPreviews,
      buyNow: prodBuyNow,
      viewsAndPreviews: prodViews + prodPreviews,
      messages: prodMessages.length,
      messageList: prodMessages,
      orders: prodOrders,
      orderList: relevantOrders,
      revenue: prodRevenue,
      conversionRate: `${conversionRate}%`,
      totalEngagement,
      events: prodEvents
    };
  });

  const filteredProducts = enrichedProducts.filter(p => {
    const matchesSearch = 
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.totalEngagement - a.totalEngagement);

  const totalViews = enrichedProducts.reduce((sum, p) => sum + p.views, 0);
  const totalPreviews = enrichedProducts.reduce((sum, p) => sum + p.previews, 0);
  const totalBuyNow = enrichedProducts.reduce((sum, p) => sum + p.buyNow, 0);
  const totalMessages = enrichedProducts.reduce((sum, p) => sum + p.messages, 0);
  const totalOrders = enrichedProducts.reduce((sum, p) => sum + p.orders, 0);
  const totalRevenue = enrichedProducts.reduce((sum, p) => sum + p.revenue, 0);


  const exportCSV = () => {
    const headers = ['Product Name', 'SKU', 'Category', 'Price', 'Views', 'Previews', 'Messages', 'Orders', 'Revenue', 'Conversion Rate'];
    const rows = filteredProducts.map(p => [
      `"${p.name}"`,
      p.sku || '',
      p.category,
      p.price,
      p.views,
      p.previews,
      p.messages,
      p.orders,
      p.revenue,
      p.conversionRate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tanush_product_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page-container">
      {/* Header & Controls */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Product Analytics &amp; Performance</h2>
          <p className="text-muted">
            Track customer views, preview modals, inquiries, purchases, and conversion funnels per product
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-admin-secondary" onClick={exportCSV}>
            <Download size={15} />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">TOTAL VIEWS</span>
          <div className="admin-kpi-value">{totalViews}</div>
          <div className="admin-kpi-subtext">Product page visits</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">PREVIEWS</span>
          <div className="admin-kpi-value">{totalPreviews}</div>
          <div className="admin-kpi-subtext">Quick-view opens</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">INQUIRIES</span>
          <div className="admin-kpi-value">{totalMessages}</div>
          <div className="admin-kpi-subtext">Customer messages</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">BUY NOW CLICKS</span>
          <div className="admin-kpi-value">{totalBuyNow}</div>
          <div className="admin-kpi-subtext">Intent actions</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">UNITS ORDERED</span>
          <div className="admin-kpi-value">{totalOrders}</div>
          <div className="admin-kpi-subtext">Completed items</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">TOTAL REVENUE</span>
          <div className="admin-kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="admin-kpi-subtext">Sales volume</div>
        </div>
      </div>

      {/* Filters & Category Pills */}
      <div className="media-filter-bar glass-liquid-panel" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="cat-filter-tabs">
          <button
            type="button"
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            ALL CATEGORIES
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`filter-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="search-input-wrap" style={{ maxWidth: '280px' }}>
          <Search size={15} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search product or SKU..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Product Analytics Table */}
      <div className="admin-table-card glass-liquid-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Product</th>
              <th>Product Details</th>
              <th style={{ width: '110px' }}>Category</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Price</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Views / Previews</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Messages</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Buy Now</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Orders</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Conversion</th>
              <th style={{ width: '100px', textAlign: 'right' }}>Revenue</th>
              <th style={{ width: '50px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '40px' }} className="text-muted">
                  No product analytics found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(p)}>
                  <td>
                    <div style={{ width: '42px', height: '42px', borderRadius: '6px', overflow: 'hidden', background: '#F4F1EA' }}>
                      <img 
                        src={p.images?.[0] || '/images/products/product-1.jpg'} 
                        alt={p.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--color-primary)' }}>{p.name}</strong>
                    <div className="text-muted text-xs">SKU: {p.sku || 'N/A'}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(23, 59, 47, 0.08)', color: 'var(--color-primary)', fontSize: '0.72rem' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>
                    ₹{p.price}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{p.views}</span> / <span className="text-muted">{p.previews}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#975A16' }}>
                    {p.messages}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#2B6CB0' }}>
                    {p.buyNow}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {p.orders}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge" style={{ background: 'rgba(47, 107, 67, 0.1)', color: '#2F6B43', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {p.conversionRate}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#173B2F' }}>
                    ₹{p.revenue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-action-btn" title="View Product Analysis">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Individual Product Deep-Dive Modal */}
      {selectedProduct && (
        <div className="edit-hero-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="edit-hero-modal-container" style={{ maxWidth: '880px' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="edit-hero-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#F4F1EA', flexShrink: 0 }}>
                  <img 
                    src={selectedProduct.images?.[0] || '/images/products/product-1.jpg'} 
                    alt={selectedProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div>
                  <h3 className="edit-hero-header-title" style={{ margin: 0 }}>
                    {selectedProduct.name}
                  </h3>
                  <p className="edit-hero-header-sub" style={{ margin: 0 }}>
                    Category: {selectedProduct.category} • SKU: {selectedProduct.sku || 'N/A'} • Price: ₹{selectedProduct.price}
                  </p>
                </div>
              </div>
              <button className="icon-action-btn" onClick={() => setSelectedProduct(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="edit-hero-body">
              {/* Product KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedProduct.views}</div>
                  <div className="text-muted text-xs">Total Views</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#285E61' }}>{selectedProduct.previews}</div>
                  <div className="text-muted text-xs">Quick Previews</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#975A16' }}>{selectedProduct.messages}</div>
                  <div className="text-muted text-xs">Inquiries</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedProduct.orders}</div>
                  <div className="text-muted text-xs">Units Sold</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#173B2F' }}>₹{selectedProduct.revenue}</div>
                  <div className="text-muted text-xs">Revenue</div>
                </div>
              </div>

              {/* Customer Activity On This Product */}
              <div className="edit-hero-card">
                <h4 className="edit-hero-card-title">
                  <Users size={16} /> Customer Activity on this Product
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedProduct.events.length === 0 ? (
                    <p className="text-muted text-xs">No specific customer events logged for this product yet.</p>
                  ) : (
                    selectedProduct.events.map((evt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(23, 59, 47, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="badge" style={{
                            background: evt.type === 'order' ? 'rgba(221, 107, 32, 0.12)' : (evt.type === 'message' ? 'rgba(214, 158, 46, 0.12)' : 'rgba(47, 107, 67, 0.1)'),
                            color: evt.type === 'order' ? '#9C4221' : (evt.type === 'message' ? '#975A16' : '#2F6B43'),
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {evt.type}
                          </span>
                          <div>
                            <strong style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>{evt.customer_name}</strong>
                            <div className="text-muted text-xs">{evt.details}</div>
                          </div>
                        </div>
                        <div className="text-muted text-xs">
                          {new Date(evt.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Inquiries & Customer Messages on This Product */}
              <div className="edit-hero-card">
                <h4 className="edit-hero-card-title">
                  <MessageSquare size={16} /> Customer Inquiries &amp; Messages
                </h4>
                {selectedProduct.messageList.length === 0 ? (
                  <p className="text-muted text-xs">No messages received for this product.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedProduct.messageList.map(msg => (
                      <div key={msg.id} style={{ padding: '10px 14px', background: '#FAF8F4', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>{msg.customer_name}</strong>
                          <span className="text-muted text-xs">{new Date(msg.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#2F3E35', margin: 0 }}>"{msg.message}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="edit-hero-footer">
              <button className="btn-admin-primary" onClick={() => setSelectedProduct(null)}>
                Close Product Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalytics;
