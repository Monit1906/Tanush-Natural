import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { Check, Plus, Trash2, Edit2, Globe, Compass, ExternalLink, Sliders } from 'lucide-react';
import './AdminStyles.css';

const NavigationManager = () => {
  const [settings, setSettings] = useState({
    announcement_text: '🌿 Nature-inspired products for everyday living • Free Shipping on orders above ₹499',
    announcement_enabled: true,
    nav_links: [
      { id: '1', title: 'Home', path: '/', is_active: true },
      { id: '2', title: 'Shop', path: '/shop', is_active: true },
      { id: '3', title: 'Why Tanush', path: '/why-tanush', is_active: true },
      { id: '4', title: 'Become a Partner', path: '/become-a-partner', is_active: true },
      { id: '5', title: 'Contact Us', path: '/contact', is_active: true }
    ]
  });
  const [notification, setNotification] = useState('');
  const [newLink, setNewLink] = useState({ title: '', path: '' });

  useEffect(() => {
    const loadSettings = async () => {
      const data = await api.getSiteSettings();
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          nav_links: data.nav_links || prev.nav_links
        }));
      }
    };
    loadSettings();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.path) return;
    const updated = [
      ...(settings.nav_links || []),
      { id: 'nav-' + Date.now(), title: newLink.title, path: newLink.path, is_active: true }
    ];
    setSettings(prev => ({ ...prev, nav_links: updated }));
    setNewLink({ title: '', path: '' });
    showToast(`Added navigation item "${newLink.title}"`);
  };

  const handleDeleteLink = (id) => {
    const updated = (settings.nav_links || []).filter(l => l.id !== id);
    setSettings(prev => ({ ...prev, nav_links: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await api.saveSiteSettings(settings);
    showToast('✓ Navigation bar & Announcement parameters saved!');
  };

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Navigation & Header CMS</h2>
          <p className="text-muted">Manage global header menu items, announcement marquee banner, and quick action destinations</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-form">
        {/* Announcement Bar */}
        <div className="admin-form-card glass-panel">
          <div className="form-section-title">
            <Sliders size={20} color="var(--color-primary)" />
            <h3>Top Announcement Marquee Banner</h3>
          </div>

          <div className="form-group mb-4">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={settings.announcement_enabled !== false} 
                onChange={(e) => setSettings({ ...settings, announcement_enabled: e.target.checked })} 
              />
              <span>Enable Floating Announcement Marquee on Live Website</span>
            </label>
          </div>

          <div className="form-group">
            <label>Announcement Headline Text</label>
            <input 
              type="text" 
              value={settings.announcement_text || ''} 
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })} 
              placeholder="e.g. Free delivery on orders above ₹499"
            />
          </div>
        </div>

        {/* Navigation Menu Items */}
        <div className="admin-form-card glass-panel">
          <div className="form-section-title">
            <Compass size={20} color="var(--color-primary)" />
            <h3>Main Header Menu Links</h3>
          </div>

          <div className="admin-table-card" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Destination Path</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(settings.nav_links || []).map((link) => (
                  <tr key={link.id}>
                    <td><strong>{link.title}</strong></td>
                    <td><code>{link.path}</code></td>
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="icon-action-btn danger" 
                        onClick={() => handleDeleteLink(link.id)}
                        title="Remove Link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Add Link */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(23, 59, 47, 0.08)' }}>
            <div className="form-group flex-1">
              <label>Menu Label</label>
              <input 
                type="text" 
                placeholder="e.g. Seasonal Offers" 
                value={newLink.title} 
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} 
              />
            </div>
            <div className="form-group flex-1">
              <label>Destination Route</label>
              <input 
                type="text" 
                placeholder="e.g. /shop?category=wellness" 
                value={newLink.path} 
                onChange={(e) => setNewLink({ ...newLink, path: e.target.value })} 
              />
            </div>
            <button 
              type="button" 
              className="btn-admin-secondary" 
              onClick={handleAddLink}
              style={{ marginBottom: '2px' }}
            >
              <Plus size={16} /> Add Link
            </button>
          </div>
        </div>

        <button type="submit" className="btn-admin-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
          <Check size={18} /> Save Header & Navigation
        </button>
      </form>
    </div>
  );
};

export default NavigationManager;
