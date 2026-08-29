import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { Check, Eye, EyeOff, ArrowUp, ArrowDown, LayoutTemplate, Save } from 'lucide-react';
import { AdminSkeleton } from '../../components/Skeletons/Skeleton';
import './AdminStyles.css';

const HomepageManager = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getHomepageSections();
    const filtered = (data || []).filter(s => s.id !== 'featured_products');
    setSections(filtered.sort((a, b) => a.sort_order - b.sort_order));
    setLoading(false);
  };

  const handleToggle = (id) => {
    setSections(sections.map(s => s.id === id ? { ...s, is_visible: !s.is_visible } : s));
  };

  const handleMove = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // reassign sort_orders
    const reordered = newSections.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
    setSections(reordered);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    await api.updateHomepageSections(sections);
    setSaving(false);
    showToast('✓ Homepage layout and section ordering saved!');
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Homepage Sections Builder</h2>
          <p className="text-muted">Compact manager for ordering and toggling visibility of homepage modules</p>
        </div>
        <button className="btn-admin-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save & Publish Layout'}</span>
        </button>
      </div>

      {/* Compact High-Density Table */}
      <div className="admin-table-card glass-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>Order</th>
              <th>Section Name & Description</th>
              <th>Section Key</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Reorder</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '100px', textAlign: 'right' }}>Visibility</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, index) => (
              <tr key={section.id}>
                <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>
                  #{index + 1}
                </td>
                <td>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary)' }}>{section.title}</strong>
                  <div className="text-muted text-xs">Section module for public home page</div>
                </td>
                <td>
                  <code style={{ fontSize: '0.78rem', background: 'rgba(0,0,0,0.04)', padding: '3px 8px', borderRadius: '4px' }}>
                    {section.id}
                  </code>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      disabled={index === 0} 
                      onClick={() => moveUp(index)}
                      title="Move Section Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      disabled={index === sections.length - 1} 
                      onClick={() => moveDown(index)}
                      title="Move Section Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <button 
                    type="button"
                    onClick={() => toggleVisibility(index)}
                    className={`status-badge ${section.is_visible ? 'status-active' : 'status-inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    title="Click to toggle status"
                  >
                    {section.is_visible ? 'Published' : 'Hidden'}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    type="button"
                    className={`icon-action-btn ${section.is_visible ? '' : 'text-muted'}`}
                    onClick={() => toggleVisibility(index)}
                    title={section.is_visible ? 'Hide Section' : 'Show Section'}
                  >
                    {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomepageManager;
