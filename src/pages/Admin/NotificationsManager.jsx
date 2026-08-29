import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/db';
import { 
  Bell, 
  ShoppingBag, 
  Star, 
  MessageSquare, 
  CheckCheck, 
  Filter, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Search,
  CheckCircle,
  Inbox
} from 'lucide-react';
import './AdminStyles.css';

const NotificationsManager = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'order' | 'review' | 'message'
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();

    const handleSync = () => fetchNotifs();
    window.addEventListener('notifications_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('notifications_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    fetchNotifs();
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await api.markNotificationRead(notif.id);
    }
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filtered = notifications.filter(n => {
    // Search
    const searchMatch = 
      (n.customer_name && n.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.product_name && n.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.title && n.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.preview_text && n.preview_text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!searchMatch) return false;

    // Filter Tab
    if (activeTab === 'unread') return !n.is_read;
    if (activeTab === 'order') return n.type === 'order';
    if (activeTab === 'review') return n.type === 'review';
    if (activeTab === 'message') return n.type === 'message';

    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="admin-page-container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="admin-header-actions" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: '#7A8B7C', textTransform: 'uppercase', marginBottom: '4px' }}>
            SYSTEMS
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' }}>
            <Bell size={22} color="#2F6B43" />
            Admin Notifications &amp; Activity Center
          </h2>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.84rem' }}>
            Real-time activity audit of customer orders, reviews, and inquiries across Tanush Natural.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            type="button" 
            className="btn-admin-secondary" 
            onClick={handleMarkAllRead}
            style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
          >
            <CheckCheck size={16} color="#2F6B43" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="media-filter-bar glass-liquid-panel" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '12px 18px', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '12px' }}>
        <div className="cat-filter-tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: 0 }}>
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
            { id: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length },
            { id: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
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

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7A8B7C' }} />
          <input 
            type="text" 
            placeholder="Search notification history..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '7px 12px 7px 34px', borderRadius: '8px', border: '1px solid rgba(23, 59, 47, 0.12)', background: '#FAF9F6', fontSize: '0.78rem', outline: 'none', color: '#173B2F' }}
          />
        </div>
      </div>

      {/* Notifications Container */}
      <div className="admin-table-card glass-liquid-panel" style={{ padding: 0, overflow: 'hidden', background: '#FFFFFF', border: '1px solid rgba(23, 59, 47, 0.08)', borderRadius: '14px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7A8B7C' }}>
            Loading notification activity...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#637365' }}>
            <Inbox size={42} color="#A0AEA2" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#173B2F', fontWeight: 700 }}>
              No notifications found
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem' }}>
              {notifications.length === 0 
                ? "You're all caught up! When real customers order, review, or send messages, notifications will appear here." 
                : "No activity matches the selected filter criteria."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map(notif => {
              const isUnread = !notif.is_read;
              let IconComp = ShoppingBag;
              let iconBg = 'rgba(221, 107, 32, 0.12)';
              let iconColor = '#9C4221';

              if (notif.type === 'review') {
                IconComp = Star;
                iconBg = 'rgba(214, 158, 46, 0.15)';
                iconColor = '#B7791F';
              } else if (notif.type === 'message') {
                IconComp = MessageSquare;
                iconBg = 'rgba(56, 178, 172, 0.15)';
                iconColor = '#2B6CB0';
              }

              return (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(23, 59, 47, 0.05)',
                    background: isUnread ? 'rgba(47, 107, 67, 0.04)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp size={19} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#173B2F' }}>
                          {notif.title}
                        </strong>
                        {isUnread && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2F855A', display: 'inline-block' }} />
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#7A8B7C', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#4A5B4F', lineHeight: 1.4 }}>
                        {notif.preview_text}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '16px' }}>
                    <ChevronRight size={16} color="#7A8B7C" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsManager;
