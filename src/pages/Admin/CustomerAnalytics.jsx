import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  ShoppingBag, 
  MessageSquare, 
  Eye, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle,
  Download
} from 'lucide-react';
import './AdminStyles.css';

const CustomerAnalytics = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [timeframe, setTimeframe] = useState('30d');
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
  }, [timeframe]);

  const totalCustomers = customers.length;
  const customersWithOrders = customers.filter(c => orders.some(o => o.customer_id === c.id || o.customer_email === c.email)).length;
  const customersWithMessages = customers.filter(c => messages.some(m => m.customer_id === c.id || m.customer_email === c.email)).length;
  const customersWithViews = customers.filter(c => events.some(e => (e.customer_id === c.id || e.customer_name === c.name) && e.type === 'view')).length;
  const customersWithPreviews = customers.filter(c => events.some(e => (e.customer_id === c.id || e.customer_name === c.name) && e.type === 'preview')).length;
  const repeatBuyers = customers.filter(c => orders.filter(o => o.customer_id === c.id).length > 1).length;
  const returningCustomerRate = totalCustomers > 0 ? ((repeatBuyers / totalCustomers) * 100).toFixed(1) : '0.0';

  // Customer activity breakdown
  const viewCount = events.filter(e => e.type === 'view').length;
  const previewCount = events.filter(e => e.type === 'preview').length;
  const messageCount = messages.length;
  const orderCount = orders.length;
  const totalInteractions = viewCount + previewCount + messageCount + orderCount;

  // Monthly customer registration trend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const registrationsByMonth = months.map(m => {
    return {
      month: m,
      count: customers.filter(c => {
        const date = new Date(c.created_at);
        const monthName = date.toLocaleString('default', { month: 'short' });
        return monthName === m;
      }).length
    };
  });

  return (
    <div className="admin-page-container">
      {/* Header & Date Selector */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Customer Analytics &amp; Retention</h2>
          <p className="text-muted">
            Holistic insights into patron acquisition, engagement frequency, and purchase conversions
          </p>
        </div>

        <div className="cat-filter-tabs">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '3m', label: '3 Months' },
            { id: 'year', label: 'This Year' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${timeframe === tab.id ? 'active' : ''}`}
              onClick={() => setTimeframe(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">TOTAL PATRONS</span>
          <div className="admin-kpi-value">{totalCustomers}</div>
          <div className="admin-kpi-subtext">All-time profiles</div>
        </div>

        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">BUYERS WITH ORDERS</span>
          <div className="admin-kpi-value">{customersWithOrders}</div>
          <div className="admin-kpi-subtext">{(customersWithOrders / Math.max(1, totalCustomers) * 100).toFixed(0)}% conversion</div>
        </div>

        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">INQUIRING PATRONS</span>
          <div className="admin-kpi-value">{customersWithMessages}</div>
          <div className="admin-kpi-subtext">Consulted with brand</div>
        </div>

        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">CATALOG EXPLORERS</span>
          <div className="admin-kpi-value">{customersWithViews}</div>
          <div className="admin-kpi-subtext">Active product viewers</div>
        </div>

        <div className="admin-kpi-card glass-liquid-panel">
          <span className="admin-kpi-label">REPEAT BUYER RATE</span>
          <div className="admin-kpi-value">{returningCustomerRate}%</div>
          <div className="admin-kpi-subtext">Multiple orders</div>
        </div>
      </div>

      {/* Two Columns: Monthly Growth & Activity Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Customer Growth This Year */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
            Customer Growth — This Year (2026)
          </h3>
          <p className="text-muted text-xs" style={{ margin: '0 0 16px 0' }}>
            Monthly acquisition of registered customer profiles
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '10px 0', borderBottom: '1px solid rgba(23, 59, 47, 0.1)' }}>
            {registrationsByMonth.map(item => (
              <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.count > 0 ? 'var(--color-primary)' : '#aaa' }}>
                  {item.count}
                </span>
                <div style={{
                  width: '28px',
                  height: `${Math.max(8, item.count * 40)}px`,
                  background: item.count > 0 ? 'linear-gradient(to top, #173B2F, #2F6B43)' : 'rgba(23, 59, 47, 0.06)',
                  borderRadius: '6px'
                }}></div>
                <span style={{ fontSize: '0.72rem', color: '#637365' }}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Activity Breakdown */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
            Customer Activity Breakdown
          </h3>
          <p className="text-muted text-xs" style={{ margin: '0 0 16px 0' }}>
            Distribution of touchpoints across {totalInteractions} total logged events
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Product Views</span>
                <span>{viewCount} events</span>
              </div>
              <div style={{ height: '7px', background: '#F4F1EA', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(viewCount / Math.max(1, totalInteractions)) * 100}%`, height: '100%', background: '#2F6B43' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Quick Previews</span>
                <span>{previewCount} events</span>
              </div>
              <div style={{ height: '7px', background: '#F4F1EA', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(previewCount / Math.max(1, totalInteractions)) * 100}%`, height: '100%', background: '#38B2AC' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Inquiries &amp; Messages</span>
                <span>{messageCount} events</span>
              </div>
              <div style={{ height: '7px', background: '#F4F1EA', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(messageCount / Math.max(1, totalInteractions)) * 100}%`, height: '100%', background: '#D69E2E' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Orders Placed</span>
                <span>{orderCount} events</span>
              </div>
              <div style={{ height: '7px', background: '#F4F1EA', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(orderCount / Math.max(1, totalInteractions)) * 100}%`, height: '100%', background: '#DD6B20' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Engagement Leaderboard */}
      <div className="admin-table-card glass-liquid-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
          Most Engaged Customers
        </h3>
        <p className="text-muted text-xs" style={{ margin: '0 0 16px 0' }}>
          Customers ranked by cumulative interactions across products, inquiries, and orders
        </p>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th style={{ textAlign: 'center' }}>Views</th>
              <th style={{ textAlign: 'center' }}>Previews</th>
              <th style={{ textAlign: 'center' }}>Messages</th>
              <th style={{ textAlign: 'center' }}>Orders</th>
              <th style={{ textAlign: 'right' }}>Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => {
              const custOrders = orders.filter(o => o.customer_id === c.id);
              const custMessages = messages.filter(m => m.customer_id === c.id);
              const custEvents = events.filter(e => e.customer_id === c.id);
              const views = custEvents.filter(e => e.type === 'view').length;
              const previews = custEvents.filter(e => e.type === 'preview').length;
              const totalSpend = custOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

              return (
                <tr key={c.id}>
                  <td>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--color-primary)' }}>{c.name}</strong>
                    <div className="text-muted text-xs">{c.city ? `${c.city}, ${c.state}` : 'India'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{c.email}</div>
                    <div className="text-muted text-xs">{c.phone}</div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{views}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{previews}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#975A16' }}>{custMessages.length}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{custOrders.length}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#173B2F' }}>
                    ₹{totalSpend.toLocaleString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
