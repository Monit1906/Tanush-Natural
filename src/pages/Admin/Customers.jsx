import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { 
  Users, 
  Search, 
  ShoppingBag, 
  MessageSquare, 
  Eye, 
  Calendar, 
  ChevronRight, 
  X, 
  UserCheck, 
  Clock, 
  Package, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin,
  TrendingUp,
  Download
} from 'lucide-react';
import './AdminStyles.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const [custs, ords, msgs, evts] = await Promise.all([
        api.getCustomers(),
        api.getOrders(),
        api.getMessages(),
        api.getAnalyticsEvents()
      ]);
      setCustomers(custs);
      setOrders(ords);
      setMessages(msgs);
      setEvents(evts);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Compute enriched customer data
  const enrichedCustomers = customers.map(c => {
    const custOrders = orders.filter(o => o.customer_id === c.id || o.customer_email === c.email);
    const custMessages = messages.filter(m => m.customer_id === c.id || m.customer_email === c.email);
    const custEvents = events.filter(e => e.customer_id === c.id || e.customer_name === c.name);
    const custViews = custEvents.filter(e => e.type === 'view').length;
    const custPreviews = custEvents.filter(e => e.type === 'preview').length;
    const totalSpend = custOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return {
      ...c,
      orderCount: custOrders.length,
      orders: custOrders,
      messageCount: custMessages.length,
      messages: custMessages,
      viewCount: custViews,
      previewCount: custPreviews,
      totalSpend,
      events: custEvents
    };
  });

  const filteredCustomers = enrichedCustomers.filter(c => {
    const matchesSearch = 
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (statusFilter === 'orders') return c.orderCount > 0;
    if (statusFilter === 'messages') return c.messageCount > 0;
    if (statusFilter === 'active') return c.status === 'active';
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Orders', 'Total Spend', 'Messages', 'Views', 'Status'];
    const rows = filteredCustomers.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      c.orderCount,
      c.totalSpend,
      c.messageCount,
      c.viewCount,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tanush_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Customers Management</h2>
          <p className="text-muted">
            Directory of registered patrons, purchase history, inquiries, and product engagement
          </p>
        </div>
        <div>
          <button className="btn-admin-secondary" onClick={exportCSV}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Customer Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">TOTAL PATRONS</span>
          <div className="admin-kpi-value">{customers.length}</div>
          <div className="admin-kpi-subtext">Registered profiles</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">WITH ORDERS</span>
          <div className="admin-kpi-value">{enrichedCustomers.filter(c => c.orderCount > 0).length}</div>
          <div className="admin-kpi-subtext">Verified buyers</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">MESSAGED</span>
          <div className="admin-kpi-value">{enrichedCustomers.filter(c => c.messageCount > 0).length}</div>
          <div className="admin-kpi-subtext">Inquired about products</div>
        </div>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">ACTIVE VIEWERS</span>
          <div className="admin-kpi-value">{enrichedCustomers.filter(c => c.viewCount > 0).length}</div>
          <div className="admin-kpi-subtext">Explored catalog</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="media-filter-bar glass-liquid-panel" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="cat-filter-tabs">
          {[
            { id: 'all', label: `ALL (${enrichedCustomers.length})` },
            { id: 'orders', label: `WITH ORDERS (${enrichedCustomers.filter(c => c.orderCount > 0).length})` },
            { id: 'messages', label: `MESSAGED (${enrichedCustomers.filter(c => c.messageCount > 0).length})` },
            { id: 'active', label: `ACTIVE (${enrichedCustomers.filter(c => c.status === 'active').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="search-input-wrap" style={{ maxWidth: '280px' }}>
          <Search size={15} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="admin-table-card glass-liquid-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th>Location</th>
              <th style={{ textAlign: 'center' }}>Orders</th>
              <th style={{ textAlign: 'center' }}>Messages</th>
              <th style={{ textAlign: 'center' }}>Views / Previews</th>
              <th style={{ textAlign: 'right' }}>Total Spend</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Profile</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }} className="text-muted">
                  No customers found matching search filters.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>
                  <td>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--color-primary)' }}>{c.name}</strong>
                    <div className="text-muted text-xs">Joined {new Date(c.created_at).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#2F3E35' }}>{c.email}</div>
                    <div className="text-muted text-xs">{c.phone}</div>
                  </td>
                  <td>
                    <span className="text-muted text-xs">
                      {c.city ? `${c.city}, ${c.state}` : 'India'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: c.orderCount > 0 ? 'var(--color-primary)' : '#888' }}>
                    {c.orderCount}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: c.messageCount > 0 ? '#975A16' : '#888' }}>
                    {c.messageCount}
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600 }}>{c.viewCount}</span> / <span className="text-muted">{c.previewCount}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#173B2F' }}>
                    ₹{c.totalSpend.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-action-btn" title="View Detailed Profile">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Modal / Drawer */}
      {selectedCustomer && (
        <div className="edit-hero-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="edit-hero-modal-container" style={{ maxWidth: '840px' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="edit-hero-header">
              <div>
                <h3 className="edit-hero-header-title">
                  <UserCheck size={22} color="#2F6B43" />
                  {selectedCustomer.name}
                </h3>
                <p className="edit-hero-header-sub">
                  Customer Profile &amp; Complete Product Interaction History
                </p>
              </div>
              <button className="icon-action-btn" onClick={() => setSelectedCustomer(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="edit-hero-body">
              {/* Identity & Contact Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#2F6B43" />
                  <span style={{ fontSize: '0.84rem' }}>{selectedCustomer.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#2F6B43" />
                  <span style={{ fontSize: '0.84rem' }}>{selectedCustomer.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#2F6B43" />
                  <span style={{ fontSize: '0.84rem' }}>{selectedCustomer.city || 'India'}, {selectedCustomer.state}</span>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedCustomer.orderCount}</div>
                  <div className="text-muted text-xs">Total Orders</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#173B2F' }}>₹{selectedCustomer.totalSpend}</div>
                  <div className="text-muted text-xs">Total Spend</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#975A16' }}>{selectedCustomer.messageCount}</div>
                  <div className="text-muted text-xs">Messages</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2F6B43' }}>{selectedCustomer.viewCount}</div>
                  <div className="text-muted text-xs">Views</div>
                </div>
                <div style={{ padding: '12px', background: '#FFFFFF', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#285E61' }}>{selectedCustomer.previewCount}</div>
                  <div className="text-muted text-xs">Previews</div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="edit-hero-card">
                <h4 className="edit-hero-card-title">
                  <Clock size={16} /> Activity Timeline
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedCustomer.events.length === 0 ? (
                    <p className="text-muted text-xs">No activity recorded for this customer.</p>
                  ) : (
                    selectedCustomer.events.map((evt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(23, 59, 47, 0.05)' }}>
                        <span className="badge" style={{
                          background: evt.type === 'order' ? 'rgba(221, 107, 32, 0.12)' : (evt.type === 'message' ? 'rgba(214, 158, 46, 0.12)' : 'rgba(47, 107, 67, 0.1)'),
                          color: evt.type === 'order' ? '#9C4221' : (evt.type === 'message' ? '#975A16' : '#2F6B43'),
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {evt.type}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                            {evt.product_name}
                          </div>
                          <div className="text-muted text-xs">{evt.details}</div>
                        </div>
                        <div className="text-muted text-xs">
                          {new Date(evt.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order History */}
              <div className="edit-hero-card">
                <h4 className="edit-hero-card-title">
                  <ShoppingBag size={16} /> Order History
                </h4>
                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-muted text-xs">No orders placed yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedCustomer.orders.map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#FAF8F4', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.08)' }}>
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>{o.id}</strong>
                          <div className="text-muted text-xs">
                            {(o.items || []).map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#173B2F', fontSize: '0.86rem' }}>₹{o.total}</div>
                          <span className="badge" style={{ background: 'rgba(47, 133, 90, 0.1)', color: '#2F855A', fontSize: '0.7rem' }}>
                            {o.status || 'Delivered'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="edit-hero-footer">
              <button className="btn-admin-primary" onClick={() => setSelectedCustomer(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
