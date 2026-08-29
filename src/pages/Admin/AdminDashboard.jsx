import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/db';
import { 
  Package, 
  Layers, 
  Users, 
  MessageSquare, 
  Eye, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  BarChart2,
  CheckCircle2,
  SearchCheck,
  Globe, 

  Camera, 
  Share2, 
  Leaf, 
  DollarSign,
  Info,
  SlidersHorizontal,
  X
} from 'lucide-react';
import './AdminStyles.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30d');
  const [channelTimeframe, setChannelTimeframe] = useState('week');
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retractable / Toggleable chart series states
  const [visibleSeries, setVisibleSeries] = useState({
    messages: true,
    orders: true,
    views: true
  });

  // Interactive Hover states for chart tooltips
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.getDashboardAnalytics(timeframe);
        setData(res);
      } catch (e) {
        console.error('Failed to load dashboard analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [timeframe]);

  if (loading || !data) {
    return (
      <div className="admin-page-container" style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 600 }}>
          Loading Tanush Commerce &amp; Analytics...
        </div>
      </div>
    );
  }

  const { kpis, topProducts, dailySeries, channelStats, yearlyGrowth, recentEvents, customers, orders, messages } = data;

  const toggleSeries = (key) => {
    setVisibleSeries(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Dynamic Chart Points Calculation
  const maxDataVal = Math.max(
    ...dailySeries.map(d => Math.max(d.messages, d.orders, d.views, 10)),
    400
  );

  const getYCoord = (val) => {
    // Map val (0 to maxDataVal) to SVG Y (140 to 20)
    const ratio = Math.min(1, Math.max(0, val / maxDataVal));
    return 140 - (ratio * 120);
  };

  const xCoords = [40, 110, 180, 250, 320, 400, 480];

  // Generate dynamic spline / path string
  const generatePath = (dataKey) => {
    const pts = dailySeries.map((item, idx) => ({
      x: xCoords[idx] || (40 + idx * 70),
      y: getYCoord(item[dataKey] || 0)
    }));

    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const xMid = (pts[i].x + pts[i + 1].x) / 2;
      const yMid = (pts[i].y + pts[i + 1].y) / 2;
      const cpX1 = (xMid + pts[i].x) / 2;
      const cpX2 = (xMid + pts[i + 1].x) / 2;
      path += ` Q ${pts[i].x + 35} ${pts[i].y}, ${xMid} ${yMid} T ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return path;
  };

  const totalInteractions = kpis.totalViewsAndPreviews + kpis.totalMessages + kpis.totalOrders;
  const messagesShare = totalInteractions > 0 ? Math.round((kpis.totalMessages / totalInteractions) * 100) : 0;
  const ordersShare = totalInteractions > 0 ? Math.round((kpis.totalOrders / totalInteractions) * 100) : 0;
  const viewsShare = totalInteractions > 0 ? Math.round((kpis.totalViewsAndPreviews / totalInteractions) * 100) : 0;

  return (
    <div className="admin-page-container" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header & Date Filter */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={22} color="#2F6B43" />
            Dashboard Overview
          </h2>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.84rem' }}>
            Welcome back, Administrator! Here's what's happening with your store today.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="cat-filter-tabs" style={{ background: '#FFFFFF', padding: '3px 6px', borderRadius: '10px', border: '1px solid rgba(23, 59, 47, 0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'year', label: 'This Year' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill ${timeframe === tab.id ? 'active' : ''}`}
                onClick={() => setTimeframe(tab.id)}
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top 6 KPI Cards in a Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {/* 1. Total Products */}
        <div className="admin-kpi-card glass-liquid-panel">
          <div className="admin-kpi-header">
            <div className="admin-kpi-icon-box" style={{ background: 'rgba(47, 107, 67, 0.1)', color: '#2F6B43' }}>
              <Package size={17} />
            </div>
          </div>
          <div className="admin-kpi-value">{kpis.totalProducts}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', marginBottom: '4px' }}>Total Products</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↗ 12% vs last 7 days</span>
          </div>
        </div>

        {/* 2. Categories */}
        <div className="admin-kpi-card glass-liquid-panel">
          <div className="admin-kpi-header">
            <div className="admin-kpi-icon-box" style={{ background: 'rgba(56, 178, 172, 0.12)', color: '#285E61' }}>
              <Layers size={17} />
            </div>
          </div>
          <div className="admin-kpi-value">{kpis.totalCategories}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', marginBottom: '4px' }}>Categories</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↗ 8% vs last 7 days</span>
          </div>
        </div>

        {/* 3. Total Customers */}
        <div className="admin-kpi-card glass-liquid-panel">
          <div className="admin-kpi-header">
            <div className="admin-kpi-icon-box" style={{ background: 'rgba(214, 158, 46, 0.12)', color: '#975A16' }}>
              <Users size={17} />
            </div>
          </div>
          <div className="admin-kpi-value">{kpis.totalCustomers.toLocaleString()}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', marginBottom: '4px' }}>Total Customers</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↗ 16% vs last 7 days</span>
          </div>
        </div>

        {/* 4. Messages Received */}
        <div className="admin-kpi-card glass-liquid-panel">
          <div className="admin-kpi-header">
            <div className="admin-kpi-icon-box" style={{ background: 'rgba(66, 153, 225, 0.12)', color: '#2B6CB0' }}>
              <MessageSquare size={17} />
            </div>
          </div>
          <div className="admin-kpi-value">{kpis.totalMessages.toLocaleString()}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', marginBottom: '4px' }}>Messages Received</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↗ 23% vs last 7 days</span>
          </div>
        </div>

        {/* 5. Total Orders */}
        <div className="admin-kpi-card glass-liquid-panel">
          <div className="admin-kpi-header">
            <div className="admin-kpi-icon-box" style={{ background: 'rgba(221, 107, 32, 0.12)', color: '#9C4221' }}>
              <ShoppingBag size={17} />
            </div>
          </div>
          <div className="admin-kpi-value">{kpis.totalOrders.toLocaleString()}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', marginBottom: '4px' }}>Total Orders</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↗ 18% vs last 7 days</span>
          </div>
        </div>

        {/* 6. Total Revenue */}
        <div className="admin-kpi-card glass-liquid-panel">
          <div className="admin-kpi-header">
            <div className="admin-kpi-icon-box" style={{ background: 'rgba(47, 133, 90, 0.15)', color: '#22543D' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹</span>
            </div>
          </div>
          <div className="admin-kpi-value">₹{kpis.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="admin-kpi-label" style={{ color: '#4A5B4F', marginBottom: '4px' }}>Total Revenue</div>
          <div style={{ fontSize: '0.7rem', color: '#2F855A', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            <span>↗ 22% vs last 7 days</span>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Product Engagement Overview (2/3) + Top Performing Products (1/3) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.85fr 1.15fr', gap: '16px', marginBottom: '20px' }}>
        {/* Left: Product Engagement Overview */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#2F6B43" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                Product Engagement Overview
              </h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#7A8B7C' }}>
              (Click legend pills below to retract / toggle series)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px', alignItems: 'center' }}>
            {/* Smooth Retractable SVG Line Chart */}
            <div>
              {/* Interactive Legend with Retractable Toggle Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                <button
                  type="button"
                  onClick={() => toggleSeries('messages')}
                  style={{
                    background: visibleSeries.messages ? 'rgba(23, 59, 47, 0.08)' : '#F4F1EA',
                    border: `1px solid ${visibleSeries.messages ? '#173B2F' : 'rgba(0,0,0,0.1)'}`,
                    opacity: visibleSeries.messages ? 1 : 0.45,
                    borderRadius: '6px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    color: '#173B2F',
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to show/hide Messages curve"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#173B2F' }} />
                  <span>Messages {visibleSeries.messages ? '✓' : '—'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSeries('orders')}
                  style={{
                    background: visibleSeries.orders ? 'rgba(214, 158, 46, 0.12)' : '#F4F1EA',
                    border: `1px solid ${visibleSeries.orders ? '#D69E2E' : 'rgba(0,0,0,0.1)'}`,
                    opacity: visibleSeries.orders ? 1 : 0.45,
                    borderRadius: '6px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    color: '#975A16',
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to show/hide Orders curve"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D69E2E' }} />
                  <span>Orders {visibleSeries.orders ? '✓' : '—'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSeries('views')}
                  style={{
                    background: visibleSeries.views ? 'rgba(56, 178, 172, 0.12)' : '#F4F1EA',
                    border: `1px solid ${visibleSeries.views ? '#38B2AC' : 'rgba(0,0,0,0.1)'}`,
                    opacity: visibleSeries.views ? 1 : 0.45,
                    borderRadius: '6px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    color: '#285E61',
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to show/hide Views curve"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38B2AC' }} />
                  <span>Views / Previews {visibleSeries.views ? '✓' : '—'}</span>
                </button>
              </div>

              {/* Chart SVG with Hover Tooltip */}
              <div style={{ height: '170px', width: '100%', position: 'relative' }}>
                <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="490" y2="20" stroke="rgba(23, 59, 47, 0.06)" strokeDasharray="3 3" />
                  <text x="5" y="24" fontSize="9" fill="#999">{maxDataVal}</text>
                  
                  <line x1="30" y1="60" x2="490" y2="60" stroke="rgba(23, 59, 47, 0.06)" strokeDasharray="3 3" />
                  <text x="5" y="64" fontSize="9" fill="#999">{Math.round(maxDataVal * 0.75)}</text>

                  <line x1="30" y1="100" x2="490" y2="100" stroke="rgba(23, 59, 47, 0.06)" strokeDasharray="3 3" />
                  <text x="5" y="104" fontSize="9" fill="#999">{Math.round(maxDataVal * 0.5)}</text>

                  <line x1="30" y1="140" x2="490" y2="140" stroke="rgba(23, 59, 47, 0.06)" strokeDasharray="3 3" />
                  <text x="5" y="144" fontSize="9" fill="#999">0</text>

                  {/* Messages Wave (Green) */}
                  {visibleSeries.messages && (
                    <g>
                      <path 
                        d={generatePath('messages')} 
                        fill="none" 
                        stroke="#173B2F" 
                        strokeWidth="2.5" 
                        strokeDasharray="4 4"
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      {dailySeries.map((item, idx) => (
                        <circle 
                          key={`msg-${idx}`}
                          cx={xCoords[idx]} 
                          cy={getYCoord(item.messages)} 
                          r={hoveredPoint?.idx === idx ? 6 : 4} 
                          fill="#173B2F"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          onMouseEnter={() => setHoveredPoint({ idx, item, x: xCoords[idx], y: getYCoord(item.messages) })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </g>
                  )}

                  {/* Orders Wave (Gold) */}
                  {visibleSeries.orders && (
                    <g>
                      <path 
                        d={generatePath('orders')} 
                        fill="none" 
                        stroke="#D69E2E" 
                        strokeWidth="2.5" 
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      {dailySeries.map((item, idx) => (
                        <circle 
                          key={`ord-${idx}`}
                          cx={xCoords[idx]} 
                          cy={getYCoord(item.orders)} 
                          r={hoveredPoint?.idx === idx ? 6 : 4} 
                          fill="#D69E2E" 
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          onMouseEnter={() => setHoveredPoint({ idx, item, x: xCoords[idx], y: getYCoord(item.orders) })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </g>
                  )}

                  {/* Views Wave (Teal) */}
                  {visibleSeries.views && (
                    <g>
                      <path 
                        d={generatePath('views')} 
                        fill="none" 
                        stroke="#38B2AC" 
                        strokeWidth="2.5" 
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      {dailySeries.map((item, idx) => (
                        <circle 
                          key={`view-${idx}`}
                          cx={xCoords[idx]} 
                          cy={getYCoord(item.views)} 
                          r={hoveredPoint?.idx === idx ? 6 : 4} 
                          fill="#38B2AC" 
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          onMouseEnter={() => setHoveredPoint({ idx, item, x: xCoords[idx], y: getYCoord(item.views) })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </g>
                  )}
                </svg>

                {/* Floating Interactive Tooltip */}
                {hoveredPoint && (
                  <div style={{
                    position: 'absolute',
                    left: `${Math.min(380, Math.max(20, (hoveredPoint.x / 500) * 100))}%`,
                    top: `${Math.max(0, (hoveredPoint.y / 160) * 100 - 45)}%`,
                    transform: 'translate(-50%, -100%)',
                    background: '#173B2F',
                    color: '#FFFFFF',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px' }}>
                      {hoveredPoint.item.date}
                    </div>
                    <div>Messages: <strong>{hoveredPoint.item.messages}</strong></div>
                    <div>Orders: <strong>{hoveredPoint.item.orders}</strong></div>
                    <div>Views / Previews: <strong>{hoveredPoint.item.views}</strong></div>
                  </div>
                )}

                {/* X Axis Dates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '30px', fontSize: '0.68rem', color: '#7A8B7C', marginTop: '4px' }}>
                  {dailySeries.map(d => (
                    <span key={d.date}>{d.date}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Mini KPI Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div 
                style={{ padding: '10px 12px', background: 'rgba(23, 59, 47, 0.04)', borderRadius: '10px', border: '1px solid rgba(23, 59, 47, 0.08)', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onClick={() => toggleSeries('messages')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MessageSquare size={14} color="#173B2F" />
                  <span style={{ fontSize: '0.68rem', color: '#2F855A', fontWeight: 600 }}>↗ 23%</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#173B2F', margin: '2px 0 0 0' }}>
                  {kpis.totalMessages.toLocaleString()}
                </div>
                <div className="text-muted text-xs">Total Messages</div>
              </div>

              <div 
                style={{ padding: '10px 12px', background: 'rgba(221, 107, 32, 0.05)', borderRadius: '10px', border: '1px solid rgba(221, 107, 32, 0.1)', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onClick={() => toggleSeries('orders')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ShoppingBag size={14} color="#9C4221" />
                  <span style={{ fontSize: '0.68rem', color: '#2F855A', fontWeight: 600 }}>↗ 18%</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#173B2F', margin: '2px 0 0 0' }}>
                  {kpis.totalOrders.toLocaleString()}
                </div>
                <div className="text-muted text-xs">Total Orders</div>
              </div>

              <div 
                style={{ padding: '10px 12px', background: 'rgba(56, 178, 172, 0.05)', borderRadius: '10px', border: '1px solid rgba(56, 178, 172, 0.1)', cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onClick={() => toggleSeries('views')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Eye size={14} color="#285E61" />
                  <span style={{ fontSize: '0.68rem', color: '#2F855A', fontWeight: 600 }}>↗ 31%</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#173B2F', margin: '2px 0 0 0' }}>
                  {kpis.totalViewsAndPreviews.toLocaleString()}
                </div>
                <div className="text-muted text-xs">Total Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Performing Products */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color="#2F6B43" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                Top Performing Products
              </h3>
            </div>
            <Link to="/admin/product-analytics" className="btn-admin-secondary" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#7A8B7C', fontSize: '0.8rem' }}>
                No product activity recorded yet.
              </div>
            ) : (
              topProducts.slice(0, 5).map(prod => (
                <div 
                  key={prod.id} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(23, 59, 47, 0.05)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                  onClick={() => navigate('/admin/product-analytics')}
                  title="Click to view deep product analytics"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={prod.images?.[0] || '/images/products/product-1.jpg'} 
                      alt={prod.name} 
                      style={{ width: '34px', height: '34px', borderRadius: '6px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>{prod.name}</div>
                      <div className="text-muted text-xs">{prod.category}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', textAlign: 'right', fontSize: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#173B2F' }}>{prod.messages}</div>
                      <div style={{ fontSize: '0.66rem', color: '#888' }}>Messages</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#173B2F' }}>{prod.orders}</div>
                      <div style={{ fontSize: '0.66rem', color: '#888' }}>Orders</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#173B2F' }}>{prod.views}</div>
                      <div style={{ fontSize: '0.66rem', color: '#888' }}>Views</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: 4 Analytical Cards in a Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {/* Card 1: Customer Interaction Summary (Interactive Donut) */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '18px' }}>
          <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 12px 0' }}>
            Customer Interaction Summary
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Donut circle representation */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `conic-gradient(#173B2F 0% ${messagesShare}%, #D69E2E ${messagesShare}% ${messagesShare + ordersShare}%, #38B2AC ${messagesShare + ordersShare}% 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ fontSize: '0.86rem', color: 'var(--color-primary)' }}>{totalInteractions.toLocaleString()}</strong>
                <span style={{ fontSize: '0.6rem', color: '#888' }}>Total</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => toggleSeries('messages')}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#173B2F' }} />
                <span>Messages ({messagesShare}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => toggleSeries('orders')}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D69E2E' }} />
                <span>Orders ({ordersShare}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => toggleSeries('views')}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38B2AC' }} />
                <span>Views ({viewsShare}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Engagement by Channel (Interactive Selector) */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '18px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Engagement by Channel
            </h4>
            <div style={{ position: 'relative' }}>
              <button 
                type="button"
                onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                style={{ fontSize: '0.68rem', color: '#637365', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.1)', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
              >
                {channelTimeframe === 'today' ? 'Today' : (channelTimeframe === 'week' ? 'This Week' : 'This Month')} ▾
              </button>

              {isChannelDropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.1)', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 20, padding: '4px' }}>
                  {['today', 'week', 'month'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => { setChannelTimeframe(opt); setIsChannelDropdownOpen(false); }}
                      style={{ padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '4px', background: channelTimeframe === opt ? 'rgba(23, 59, 47, 0.08)' : 'transparent' }}
                    >
                      {opt === 'today' ? 'Today' : (opt === 'week' ? 'This Week' : 'This Month')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={13} color="#2F6B43" />
                <span style={{ fontWeight: 600 }}>Website</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong>{kpis.totalViewsAndPreviews}</strong>
                <span style={{ color: '#2F855A', fontSize: '0.68rem' }}>↗ 28%</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={13} color="#E1306C" />
                <span style={{ fontWeight: 600 }}>Instagram</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong>0</strong>
                <span style={{ color: '#2F855A', fontSize: '0.68rem' }}>↗ 18%</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={13} color="#25D366" />
                <span style={{ fontWeight: 600 }}>WhatsApp</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong>{kpis.buyNowClicks + kpis.totalMessages}</strong>
                <span style={{ color: '#2F855A', fontSize: '0.68rem' }}>↗ 32%</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={13} color="#718096" />
                <span style={{ fontWeight: 600 }}>Other Sources</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong>0</strong>
                <span style={{ color: '#2F855A', fontSize: '0.68rem' }}>↗ 12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Customers Trend (This Year with Interactive Bars) */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Customers Trend (This Year)
            </h4>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.66rem', color: '#637365', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '6px', height: '6px', background: '#173B2F' }} /> New Customers
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '6px', height: '6px', background: '#D69E2E' }} /> Returning
            </span>
          </div>

          {/* Interactive Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '85px', paddingTop: '4px', position: 'relative' }}>
            {yearlyGrowth.map(item => (
              <div 
                key={item.month} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredBar(item)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div style={{
                  width: '12px',
                  height: `${Math.max(6, (item.newCustomers || 0) * 15 + 18)}px`,
                  background: hoveredBar?.month === item.month ? '#2F6B43' : '#173B2F',
                  borderRadius: '2px 2px 0 0',
                  transition: 'background 0.15s ease'
                }} />
                <span style={{ fontSize: '0.62rem', color: '#888' }}>{item.month}</span>
              </div>
            ))}

            {hoveredBar && (
              <div style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#173B2F',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                {hoveredBar.month}: {hoveredBar.newCustomers} new patrons
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Recent Customer Activity (Interactive Links) */}
        <div className="admin-card glass-liquid-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              Recent Customer Activity
            </h4>
            <Link to="/admin/customers" style={{ fontSize: '0.68rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {recentEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#7A8B7C', fontSize: '0.75rem' }}>
                No customer activity yet.
              </div>
            ) : (
              recentEvents.slice(0, 4).map(evt => (
                <div 
                  key={evt.id} 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', borderBottom: '1px solid rgba(23, 59, 47, 0.04)', paddingBottom: '4px', cursor: 'pointer' }}
                  onClick={() => navigate('/admin/customers')}
                  title="Click to view Customer Profile"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EAE6DD', color: '#173B2F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.68rem' }}>
                      {evt.customer_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-primary)' }}>{evt.customer_name || 'Visitor'}</strong>
                      <span className="text-muted" style={{ fontSize: '0.66rem' }}>{evt.details || `${evt.type} ${evt.product_name || ''}`}</span>
                    </div>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Banner: Grow Naturally with Tanush ── */}
      <div className="admin-card glass-liquid-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(23, 59, 47, 0.05) 0%, rgba(47, 107, 67, 0.02) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Leaf size={22} color="#2F6B43" />
          <div>
            <h4 style={{ margin: '0 0 2px 0', fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Grow Naturally with Tanush 🌿
            </h4>
            <p className="text-muted text-xs" style={{ margin: 0 }}>
              Keep engaging with your customers and build a healthier tomorrow.
            </p>
          </div>
        </div>

        <button className="btn-admin-primary" onClick={() => navigate('/admin/se-ee-os-ego')}>
          <span>View Full Analytics</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
