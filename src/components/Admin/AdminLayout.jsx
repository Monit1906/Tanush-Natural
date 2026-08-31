import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api, applyFavicon } from '../../lib/db';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  LogOut, 
  Settings, 
  Video, 
  MessageSquareQuote, 
  ShoppingBag, 
  Users,
  BarChart3,
  TrendingUp,
  SearchCheck,
  History, 
  FolderOpen,
  Sparkles,
  ExternalLink,
  Search,
  Bell,
  Star,
  MessageSquare,
  CheckCheck,
  ChevronDown,
  User,
  Clock,
  Handshake,
  Sliders,
  Palette,
  Feather
} from 'lucide-react';

import BrandLogo from '../BrandLogo/BrandLogo';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState(null);

  // Real Notifications State
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  const fetchNotifs = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (e) {
      console.error('Failed loading notifications:', e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    const fetchBrand = async () => {
      const data = await api.getSiteSettings();
      if (data) {
        setSiteSettings(data);
        const fav = data.use_primary_favicon !== false ? (data.logo_url || data.favicon_url) : (data.favicon_url || data.logo_url);
        applyFavicon(fav || '/images/brand/tanush-logo.png', data.brand_name || 'Tanush Natural & Co.', 'Admin Control Panel');
      }
    };
    fetchBrand();
    fetchNotifs();

    const handleSettingsUpdate = (e) => {
      if (e.detail) {
        setSiteSettings(e.detail);
        const fav = e.detail.use_primary_favicon !== false ? (e.detail.logo_url || e.detail.favicon_url) : (e.detail.favicon_url || e.detail.logo_url);
        applyFavicon(fav || '/images/brand/tanush-logo.png', e.detail.brand_name || 'Tanush Natural & Co.', 'Admin Control Panel');
      }
    };

    const handleNotifsUpdate = () => fetchNotifs();

    window.addEventListener('site_settings_updated', handleSettingsUpdate);
    window.addEventListener('notifications_updated', handleNotifsUpdate);
    window.addEventListener('cms_data_updated', handleNotifsUpdate);

    return () => {
      window.removeEventListener('site_settings_updated', handleSettingsUpdate);
      window.removeEventListener('notifications_updated', handleNotifsUpdate);
      window.removeEventListener('cms_data_updated', handleNotifsUpdate);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.admin-notif-wrap') && !e.target.closest('.admin-profile-wrap')) {
        setShowNotifDropdown(false);
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await api.markAllNotificationsRead();
    fetchNotifs();
  };

  const handleNotifClick = async (notif) => {
    if (!notif.is_read) {
      await api.markNotificationRead(notif.id);
    }
    setShowNotifDropdown(false);
    if (notif.target_route) {
      navigate(notif.target_route);
    }
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group notifications into Today, Yesterday, Earlier
  const groupNotifs = () => {
    const today = [];
    const yesterday = [];
    const earlier = [];

    const now = new Date();
    const todayStr = now.toDateString();
    
    const yest = new Date();
    yest.setDate(now.getDate() - 1);
    const yestStr = yest.toDateString();

    notifications.forEach(item => {
      const itemDateStr = new Date(item.created_at || Date.now()).toDateString();
      if (itemDateStr === todayStr) {
        today.push(item);
      } else if (itemDateStr === yestStr) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { today, yesterday, earlier };
  };

  const { today, yesterday, earlier } = groupNotifs();

  return (
    <div className="admin-layout">
      {/* Background ambient lighting */}
      <div className="admin-ambient-glow glow-1"></div>
      <div className="admin-ambient-glow glow-2"></div>

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand-title">
            <BrandLogo variant="admin-sidebar" />
          </div>
          <Link to="/" className="view-site-link" target="_blank" rel="noopener noreferrer" title="View Public Website">
            <ExternalLink size={14} />
          </Link>
        </div>

        <nav className="admin-nav">
          {/* OVERVIEW */}
          <div className="admin-nav-section-label">OVERVIEW</div>
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>

          {/* WEBSITE BUILDER */}
          <div className="admin-nav-section-label">WEBSITE BUILDER</div>
          <NavLink to="/admin/pages" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <LayoutDashboard size={17} />
            <span>Website Pages</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>

          {/* CATALOG */}
          <div className="admin-nav-section-label">CATALOG</div>
          <NavLink to="/admin/products" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Package size={17} />
            <span>Products</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Layers size={17} />
            <span>Categories</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>

          {/* CONTENT & STORIES */}
          <div className="admin-nav-section-label">CONTENT & STORIES</div>
          <NavLink to="/admin/hero" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Sliders size={17} />
            <span>Hero Slider &amp; Banners</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/stories" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Video size={17} />
            <span>Reels & Stories</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/sections/partnerships" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Handshake size={17} />
            <span>Partnerships Section</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/journey" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Sparkles size={17} />
            <span>Journey & Social Wall</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/testimonials" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <MessageSquareQuote size={17} />
            <span>Testimonials</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/media" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <FolderOpen size={17} />
            <span>Media Library</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>

          {/* COMMERCE */}
          <div className="admin-nav-section-label">COMMERCE</div>
          <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <ShoppingBag size={17} />
            <span>Orders</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/customers" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Users size={17} />
            <span>Customers</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>

          {/* ANALYTICS */}
          <div className="admin-nav-section-label">ANALYTICS</div>
          <NavLink to="/admin/product-analytics" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <BarChart3 size={17} />
            <span>Product Analytics</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/customer-analytics" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <TrendingUp size={17} />
            <span>Customer Analytics</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>

          {/* SYSTEMS */}
          <div className="admin-nav-section-label">SYSTEMS</div>
          <NavLink to="/admin/se-ee-os-ego" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <SearchCheck size={17} />
            <span>SEOego</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>

          <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <Settings size={17} />
            <span>Settings & SEO</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
          <NavLink to="/admin/audit" className={({isActive}) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
            <History size={17} />
            <span>Audit Trail</span>
            <span className="admin-nav-arrow">›</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout} title="Sign Out of Admin Panel">
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        <header className="admin-topbar glass-liquid-panel" style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between', borderBottom: '1px solid rgba(23, 59, 47, 0.06)', background: '#FFFFFF', zIndex: 100 }}>
          {/* Search bar with ⌘K */}
          <div style={{ position: 'relative', width: '380px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7A8B7C' }} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              style={{ width: '100%', padding: '8px 45px 8px 36px', borderRadius: '10px', border: '1px solid rgba(23, 59, 47, 0.1)', background: '#FAF9F6', fontSize: '0.82rem', color: '#173B2F', outline: 'none' }}
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.68rem', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.15)', padding: '2px 5px', borderRadius: '4px', color: '#7A8B7C', fontWeight: 600 }}>
              ⌘K
            </span>
          </div>

          {/* Right Action Icons & User Info */}
          <div className="admin-topbar-controls">
            
            {/* Notification Bell & Dropdown */}
            <div className="admin-notif-wrap" style={{ position: 'relative' }}>
              <button 
                type="button"
                className={`admin-topbar-bell-btn ${showNotifDropdown ? 'active' : ''}`}
                title="Notifications" 
                onClick={() => { setShowNotifDropdown(prev => !prev); setShowProfileDropdown(false); }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="admin-bell-badge">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Liquid Glass Notification Dropdown */}
              {showNotifDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '380px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1.5px solid rgba(23, 59, 47, 0.12)',
                  borderRadius: '16px',
                  boxShadow: '0 16px 40px rgba(23, 59, 47, 0.14)',
                  zIndex: 200,
                  overflow: 'hidden'
                }}>
                  {/* Dropdown Header */}
                  <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(23, 59, 47, 0.08)', background: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#173B2F' }}>Notifications</strong>
                      {unreadCount > 0 && (
                        <span style={{ background: 'rgba(47, 107, 67, 0.12)', color: '#2F6B43', padding: '1px 7px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700 }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        type="button" 
                        onClick={handleMarkAllRead}
                        style={{ background: 'none', border: 'none', color: '#2F6B43', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Dropdown Body */}
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {loadingNotifs ? (
                      <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.78rem', color: '#7A8B7C' }}>
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '36px 20px', textAlign: 'center', color: '#637365' }}>
                        <Bell size={28} color="#A0AEA2" style={{ margin: '0 auto 8px', display: 'block' }} />
                        <strong style={{ fontSize: '0.86rem', color: '#173B2F', display: 'block' }}>No new notifications</strong>
                        <span style={{ fontSize: '0.76rem' }}>You're all caught up! Real orders, reviews, and customer messages will appear here.</span>
                      </div>
                    ) : (
                      <>
                        {/* TODAY GROUP */}
                        {today.length > 0 && (
                          <div>
                            <div style={{ padding: '6px 18px', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.06em', color: '#7A8B7C', background: '#FAF9F5', borderBottom: '1px solid rgba(23, 59, 47, 0.04)' }}>
                              TODAY
                            </div>
                            {today.map(n => renderNotifItem(n, handleNotifClick, formatTimeAgo))}
                          </div>
                        )}

                        {/* YESTERDAY GROUP */}
                        {yesterday.length > 0 && (
                          <div>
                            <div style={{ padding: '6px 18px', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.06em', color: '#7A8B7C', background: '#FAF9F5', borderBottom: '1px solid rgba(23, 59, 47, 0.04)' }}>
                              YESTERDAY
                            </div>
                            {yesterday.map(n => renderNotifItem(n, handleNotifClick, formatTimeAgo))}
                          </div>
                        )}

                        {/* EARLIER GROUP */}
                        {earlier.length > 0 && (
                          <div>
                            <div style={{ padding: '6px 18px', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.06em', color: '#7A8B7C', background: '#FAF9F5', borderBottom: '1px solid rgba(23, 59, 47, 0.04)' }}>
                              EARLIER
                            </div>
                            {earlier.map(n => renderNotifItem(n, handleNotifClick, formatTimeAgo))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(23, 59, 47, 0.08)', background: '#FFFFFF', textAlign: 'center' }}>
                    <Link 
                      to="/admin/notifications" 
                      onClick={() => setShowNotifDropdown(false)}
                      style={{ fontSize: '0.76rem', fontWeight: 600, color: '#173B2F', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>View all notifications</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="admin-topbar-divider"></div>

            {/* Luxury Profile Capsule Pill */}
            <div className="admin-profile-wrap" style={{ position: 'relative' }}>
              <div 
                className={`admin-profile-pill ${showProfileDropdown ? 'active' : ''}`}
                onClick={() => { setShowProfileDropdown(prev => !prev); setShowNotifDropdown(false); }}
                title="Account Settings & Profile"
              >
                <div className="admin-avatar-wrap">
                  <img 
                    src="/images/admin-avatar.png" 
                    alt="Tanush Admin" 
                    className="admin-avatar-img"
                    onError={(e) => { e.target.src = '/favicon.png'; }}
                  />
                  <div className="admin-online-dot" title="Active Now"></div>
                </div>
                <div className="admin-user-meta">
                  <div className="admin-user-name">
                    <span>admin2026</span>
                    <ChevronDown size={13} className="admin-chevron-icon" />
                  </div>
                  <span className="admin-user-role">Administrator</span>
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="admin-dropdown-menu">
                  <div className="admin-dropdown-header">
                    <span className="header-name">Tanush Natural &amp; Co.</span>
                    <span className="header-status">
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }}></span>
                      Verified Master Admin
                    </span>
                  </div>
                  
                  <div 
                    className="admin-dropdown-item"
                    onClick={() => { navigate('/admin/settings'); setShowProfileDropdown(false); }}
                  >
                    <Settings size={15} color="#173B2F" />
                    <span>Settings &amp; SEO</span>
                  </div>

                  <div 
                    className="admin-dropdown-item"
                    onClick={() => { navigate('/admin/audit'); setShowProfileDropdown(false); }}
                  >
                    <History size={15} color="#173B2F" />
                    <span>Security Audit Trail</span>
                  </div>

                  <a 
                    href="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setShowProfileDropdown(false)}
                    className="admin-dropdown-item"
                  >
                    <ExternalLink size={15} color="#173B2F" />
                    <span>View Public Store</span>
                  </a>

                  <div 
                    className="admin-dropdown-item danger"
                    onClick={() => { handleLogout(); setShowProfileDropdown(false); }}
                    style={{ borderTop: '1px solid rgba(23, 59, 47, 0.08)', marginTop: '4px', paddingTop: '8px' }}
                  >
                    <LogOut size={15} color="#C53030" />
                    <span>Sign Out</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>
        
        <div className="admin-content" style={{ padding: '24px 28px', background: '#F8F7F2', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Helper renderer for notification dropdown item
const renderNotifItem = (n, onClick, formatTimeAgo) => {
  const isUnread = !n.is_read;
  let IconComponent = ShoppingBag;
  let bg = 'rgba(221, 107, 32, 0.12)';
  let color = '#9C4221';

  if (n.type === 'review') {
    IconComponent = Star;
    bg = 'rgba(214, 158, 46, 0.15)';
    color = '#B7791F';
  } else if (n.type === 'message') {
    IconComponent = MessageSquare;
    bg = 'rgba(56, 178, 172, 0.15)';
    color = '#2B6CB0';
  }

  return (
    <div
      key={n.id}
      onClick={() => onClick(n)}
      style={{
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        borderBottom: '1px solid rgba(23, 59, 47, 0.05)',
        background: isUnread ? 'rgba(47, 107, 67, 0.04)' : '#FFFFFF',
        cursor: 'pointer',
        transition: 'background 0.15s ease'
      }}
    >
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
        <IconComponent size={15} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
          <strong style={{ fontSize: '0.78rem', color: '#173B2F' }}>
            {n.title}
          </strong>
          <span style={{ fontSize: '0.68rem', color: '#7A8B7C', flexShrink: 0 }}>
            {formatTimeAgo(n.created_at)}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.74rem', color: '#4A5B4F', lineHeight: 1.35 }}>
          {n.preview_text}
        </p>
      </div>

      {isUnread && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2F855A', marginTop: '6px', flexShrink: 0 }} />
      )}
    </div>
  );
};

export default AdminLayout;
