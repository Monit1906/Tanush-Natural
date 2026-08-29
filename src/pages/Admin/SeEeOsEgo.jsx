import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { 
  SearchCheck, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  ArrowDown, 
  Users, 
  Package, 
  Eye, 
  MessageSquare, 
  ShoppingBag, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  ChevronRight,
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';

import './AdminStyles.css';

const SeEeOsEgo = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const [custs, prods, ords, msgs, evts] = await Promise.all([
        api.getCustomers(),
        api.getProducts(),
        api.getOrders(),
        api.getMessages(),
        api.getAnalyticsEvents()
      ]);
      setCustomers(custs);
      setProducts(prods);
      setOrders(ords);
      setMessages(msgs);
      setEvents(evts);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Compute funnel counts
  const totalViews = events.filter(e => e.type === 'view').length;
  const totalPreviews = events.filter(e => e.type === 'preview').length;
  const totalMessages = messages.length;
  const totalBuyNow = events.filter(e => e.type === 'buy_now').length;
  const totalOrders = orders.length;

  const previewConversion = totalViews > 0 ? ((totalPreviews / totalViews) * 100).toFixed(0) : '0';
  const messageConversion = totalPreviews > 0 ? ((totalMessages / totalPreviews) * 100).toFixed(0) : '0';
  const buyNowConversion = totalMessages > 0 ? ((totalBuyNow / totalMessages) * 100).toFixed(0) : (totalViews > 0 ? ((totalBuyNow / totalViews) * 100).toFixed(0) : '0');
  const orderConversion = totalBuyNow > 0 ? ((totalOrders / totalBuyNow) * 100).toFixed(0) : (totalViews > 0 ? ((totalOrders / totalViews) * 100).toFixed(0) : '0');

  // Build Traceable Matrix (Customer -> Product -> Actions)
  const matrixData = [];
  customers.forEach(cust => {
    const custEvents = events.filter(e => e.customer_id === cust.id || e.customer_name === cust.name);
    const custMessages = messages.filter(m => m.customer_id === cust.id || m.customer_email === cust.email);
    const custOrders = orders.filter(o => o.customer_id === cust.id || o.customer_email === cust.email);

    // Group by product
    const productIds = new Set([
      ...custEvents.map(e => String(e.product_id)),
      ...custMessages.map(m => String(m.product_id)),
      ...custOrders.flatMap(o => (o.items || []).map(i => String(i.product_id)))
    ]);

    productIds.forEach(prodId => {
      if (!prodId || prodId === 'undefined') return;
      const product = products.find(p => String(p.id) === String(prodId));
      if (!product) return;

      const hasViewed = custEvents.some(e => String(e.product_id) === String(prodId) && e.type === 'view');
      const hasPreviewed = custEvents.some(e => String(e.product_id) === String(prodId) && e.type === 'preview');
      const hasMessaged = custMessages.some(m => String(m.product_id) === String(prodId));
      const hasBuyNow = custEvents.some(e => String(e.product_id) === String(prodId) && e.type === 'buy_now');
      const hasOrdered = custOrders.some(o => (o.items || []).some(i => String(i.product_id) === String(prodId)));

      const prodEvents = custEvents.filter(e => String(e.product_id) === String(prodId));
      const lastEvent = prodEvents[0] || { timestamp: cust.last_active || cust.created_at };

      matrixData.push({
        id: `${cust.id}-${prodId}`,
        customer: cust,
        product,
        hasViewed,
        hasPreviewed,
        hasMessaged,
        hasBuyNow,
        hasOrdered,
        lastActivity: lastEvent.timestamp
      });
    });
  });

  const filteredMatrix = matrixData.filter(item => {
    const matchesSearch = 
      item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCustomerId && item.customer.id !== selectedCustomerId) return false;
    if (selectedProductId && item.product.id !== selectedProductId) return false;
    if (activityFilter === 'view' && !item.hasViewed) return false;
    if (activityFilter === 'preview' && !item.hasPreviewed) return false;
    if (activityFilter === 'message' && !item.hasMessaged) return false;
    if (activityFilter === 'buy_now' && !item.hasBuyNow) return false;
    if (activityFilter === 'order' && !item.hasOrdered) return false;
    return true;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <SearchCheck size={24} color="#2F6B43" />
            <h2 style={{ margin: 0 }}>SEO &amp; Search Intelligence</h2>
          </div>
          <p className="text-muted" style={{ margin: 0 }}>
            Customer Discovery &bull; Product Engagement &bull; Search Index &bull; Conversion Tracking
          </p>
        </div>
      </div>

      {/* Top Intelligence KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">TOTAL PATRONS</span>
          <div className="admin-kpi-value">{customers.length}</div>
          <div className="admin-kpi-subtext">Registered graph nodes</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">CATALOG NODES</span>
          <div className="admin-kpi-value">{products.length}</div>
          <div className="admin-kpi-subtext">Active formulas</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">CONSULTATIONS</span>
          <div className="admin-kpi-value">{messages.length}</div>
          <div className="admin-kpi-subtext">Direct inquiries</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">BUY NOW CLICKS</span>
          <div className="admin-kpi-value">{totalBuyNow}</div>
          <div className="admin-kpi-subtext">Intent actions</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">CONVERSIONS</span>
          <div className="admin-kpi-value">{orders.length}</div>
          <div className="admin-kpi-subtext">Completed purchases</div>
        </div>
      </div>

      {/* Visual Customer Journey Funnel */}
      <div className="admin-card glass-liquid-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
          Visual Customer &amp; Commerce Journey Funnel
        </h3>
        <p className="text-muted text-xs" style={{ margin: '0 0 20px 0' }}>
          Conversion trajectory: Discovery &rarr; Preview &rarr; Consultation &rarr; Buy Now Intent &rarr; Order Completed
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          {/* Stage 1: VIEW */}
          <div style={{ flex: '1 1 140px', padding: '14px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(23, 59, 47, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#637365', marginBottom: '4px' }}>
              1. PRODUCT VIEW
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {totalViews}
            </div>
            <div className="text-muted text-xs">Page Explores</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#2F6B43' }}>
            <ArrowRight size={16} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>{previewConversion}%</span>
          </div>

          {/* Stage 2: PREVIEW */}
          <div style={{ flex: '1 1 140px', padding: '14px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(56, 178, 172, 0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#285E61', marginBottom: '4px' }}>
              2. QUICK PREVIEW
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#285E61' }}>
              {totalPreviews}
            </div>
            <div className="text-muted text-xs">Quick-Look</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#D69E2E' }}>
            <ArrowRight size={16} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>{messageConversion}%</span>
          </div>

          {/* Stage 3: MESSAGE */}
          <div style={{ flex: '1 1 140px', padding: '14px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(214, 158, 46, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#975A16', marginBottom: '4px' }}>
              3. INQUIRY
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#975A16' }}>
              {totalMessages}
            </div>
            <div className="text-muted text-xs">Consultations</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#3182CE' }}>
            <ArrowRight size={16} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>{buyNowConversion}%</span>
          </div>

          {/* Stage 4: BUY NOW CLICK */}
          <div style={{ flex: '1 1 140px', padding: '14px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(49, 130, 206, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#2B6CB0', marginBottom: '4px' }}>
              4. BUY NOW CLICK
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2B6CB0' }}>
              {totalBuyNow}
            </div>
            <div className="text-muted text-xs">Intent Actions</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#DD6B20' }}>
            <ArrowRight size={16} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>{orderConversion}%</span>
          </div>

          {/* Stage 5: ORDER */}
          <div style={{ flex: '1 1 140px', padding: '14px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(221, 107, 32, 0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#9C4221', marginBottom: '4px' }}>
              5. COMPLETED ORDER
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9C4221' }}>
              {totalOrders}
            </div>
            <div className="text-muted text-xs">Purchases</div>
          </div>
        </div>
      </div>

      {/* Customer -> Product Traceability Matrix */}
      <div className="admin-table-card glass-liquid-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 2px 0' }}>
              Traceable Relationship Matrix (Customer &harr; Product)
            </h3>
            <p className="text-muted text-xs" style={{ margin: 0 }}>
              End-to-end audit mapping of which patron interacted with which herbal formulation
            </p>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="cat-filter-tabs">
              {['all', 'view', 'preview', 'message', 'buy_now', 'order'].map(filter => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-pill ${activityFilter === filter ? 'active' : ''}`}
                  onClick={() => setActivityFilter(filter)}
                  style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                >
                  {filter.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            <div className="search-input-wrap" style={{ maxWidth: '240px' }}>
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter customer or product..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                style={{ fontSize: '0.78rem', padding: '6px 8px 6px 28px' }}
              />
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product Interacted</th>
              <th>Category</th>
              <th style={{ textAlign: 'center', width: '70px' }}>Viewed</th>
              <th style={{ textAlign: 'center', width: '70px' }}>Previewed</th>
              <th style={{ textAlign: 'center', width: '70px' }}>Messaged</th>
              <th style={{ textAlign: 'center', width: '70px' }}>Buy Now</th>
              <th style={{ textAlign: 'center', width: '70px' }}>Ordered</th>
              <th style={{ textAlign: 'right', width: '120px' }}>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatrix.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }} className="text-muted">
                  No interaction relationships found in database yet.
                </td>
              </tr>
            ) : (
              filteredMatrix.map(row => (
                <tr key={row.id}>
                  <td>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--color-primary)' }}>
                      {row.customer.name}
                    </strong>
                    <div className="text-muted text-xs">{row.customer.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={row.product.images?.[0] || '/images/products/product-1.jpg'} 
                        alt={row.product.name} 
                        style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} 
                      />
                      <strong style={{ fontSize: '0.82rem', color: '#2F3E35' }}>
                        {row.product.name}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(23, 59, 47, 0.08)', color: 'var(--color-primary)', fontSize: '0.7rem' }}>
                      {row.product.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.hasViewed ? <span style={{ color: '#2F6B43', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.hasPreviewed ? <span style={{ color: '#285E61', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.hasMessaged ? <span style={{ color: '#975A16', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.hasBuyNow ? <span style={{ color: '#2B6CB0', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.hasOrdered ? <span style={{ color: '#9C4221', fontWeight: 'bold' }}>✓</span> : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ textAlign: 'right' }} className="text-muted text-xs">
                    {new Date(row.lastActivity).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeEeOsEgo;
