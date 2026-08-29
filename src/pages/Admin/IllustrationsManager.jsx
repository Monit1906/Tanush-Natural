import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { 
  BOTANICAL_ILLUSTRATIONS_CATALOG, 
  BotanicalIllustration,
  getBotanicalIllustration
} from '../../components/Illustrations/BotanicalIllustrations';
import { 
  Sparkles, 
  Layers, 
  Sliders, 
  Check, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Copy, 
  Info, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Maximize2,
  Filter
} from 'lucide-react';
import './AdminStyles.css';

const CATEGORIES = [
  'ALL',
  'BOTANICAL',
  'NATURAL FARMING',
  'INGREDIENTS',
  'MOSQUITO PROTECTION',
  'VAPORIZER',
  'REPELLENT SPRAY',
  'INDIAN HOME',
  'MONSOON'
];

const PAGES = ['Home', 'Shop', 'ProductDetail', 'WhyTanush', 'BecomePartner', 'Contact'];

const POSITIONS = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'center-watermark', label: 'Center Watermark' },
  { value: 'inline', label: 'Inline Section' }
];

const IllustrationsManager = () => {
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'assignments'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIllustration, setSelectedIllustration] = useState(BOTANICAL_ILLUSTRATIONS_CATALOG[0]);
  
  // Interactive Studio Settings
  const [previewScale, setPreviewScale] = useState(100); // 50 - 200
  const [previewOpacity, setPreviewOpacity] = useState(100); // 5 - 100
  const [previewBg, setPreviewBg] = useState('#FAF8F5'); // '#FAF8F5' | '#FFFFFF' | '#173B2F' | '#1A1A1A'
  const [previewColor, setPreviewColor] = useState('#173B2F'); // '#173B2F' | '#D4AF37' | '#608066' | '#FFFFFF'

  // Section Assignments
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(null);

  // New assignment modal / form
  const [newAssignment, setNewAssignment] = useState({
    id: '',
    page: 'Home',
    section: 'Why Tanush Section',
    illustrationId: 'tulsi-sprig',
    position: 'top-right',
    opacity: 12,
    scale: 100,
    desktopVisible: true,
    mobileVisible: false,
    isActive: true
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getIllustrationSettings();
      if (data && Array.isArray(data.assignments)) {
        setAssignments(data.assignments);
      }
    } catch (e) {
      console.error('Failed to load illustration settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const filteredIllustrations = selectedCategory === 'ALL'
    ? BOTANICAL_ILLUSTRATIONS_CATALOG
    : BOTANICAL_ILLUSTRATIONS_CATALOG.filter(item => item.category === selectedCategory);

  const handleSaveAssignments = async (updatedList) => {
    setAssignments(updatedList);
    await api.saveIllustrationSettings({ assignments: updatedList });
    showToast('✓ Illustration Section Assignments updated!');
  };

  const handleToggleActive = async (id) => {
    const updated = assignments.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    await handleSaveAssignments(updated);
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Remove this illustration section assignment?')) {
      const updated = assignments.filter(a => a.id !== id);
      await handleSaveAssignments(updated);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    const item = {
      ...newAssignment,
      id: newAssignment.id || 'assign-' + Date.now()
    };
    const updated = [...assignments, item];
    await handleSaveAssignments(updated);
    setNewAssignment({
      id: '',
      page: 'Home',
      section: 'Why Tanush Section',
      illustrationId: selectedIllustration.id || 'tulsi-sprig',
      position: 'top-right',
      opacity: 12,
      scale: 100,
      desktopVisible: true,
      mobileVisible: false,
      isActive: true
    });
    setEditingAssignment(null);
  };

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      {/* Header */}
      <div className="admin-header-actions">
        <div>
          <h2>Botanical Illustration &amp; Natural Storytelling System</h2>
          <p className="text-muted">
            Handcrafted line art for Natural Farming, Botanical Cultivation &amp; Safe Mosquito Protection
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn-admin-secondary ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
            style={activeTab === 'library' ? { background: '#173B2F', color: '#FFF' } : {}}
          >
            <Sparkles size={16} /> Illustration Library
          </button>
          <button 
            className={`btn-admin-secondary ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
            style={activeTab === 'assignments' ? { background: '#173B2F', color: '#FFF' } : {}}
          >
            <Layers size={16} /> Section Assignments ({assignments.length})
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Main Illustration Catalog */}
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '30px',
                    border: '1px solid rgba(23, 59, 47, 0.15)',
                    background: selectedCategory === cat ? '#173B2F' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : '#173B2F',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Vectors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filteredIllustrations.map(item => {
                const isSelected = selectedIllustration.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIllustration(item)}
                    style={{
                      background: '#FFFFFF',
                      border: isSelected ? '2px solid #173B2F' : '1px solid rgba(23, 59, 47, 0.1)',
                      borderRadius: '14px',
                      padding: '20px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      boxShadow: isSelected ? '0 6px 20px rgba(23, 59, 47, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '10px', 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        color: '#6B7C73', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        background: 'rgba(23, 59, 47, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {item.category}
                    </span>

                    <div style={{ margin: '20px 0 14px 0', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BotanicalIllustration id={item.id} size={80} color="#173B2F" />
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#173B2F', margin: '0 0 4px 0' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: '#6B7C73', margin: 0, lineHeight: 1.35 }}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Inspector & Preview Panel */}
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#173B2F', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} /> Studio Live Inspector
            </h3>

            {/* Interactive Preview Canvas */}
            <div 
              style={{ 
                background: previewBg, 
                borderRadius: '12px', 
                height: '200px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(23, 59, 47, 0.1)',
                marginBottom: '18px',
                transition: 'background 0.3s ease',
                overflow: 'hidden'
              }}
            >
              <div style={{ transform: `scale(${previewScale / 100})`, opacity: previewOpacity / 100, transition: 'all 0.2s ease' }}>
                <BotanicalIllustration id={selectedIllustration.id} size={110} color={previewColor} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#173B2F' }}>{selectedIllustration.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7C73' }}>ID: <code>{selectedIllustration.id}</code></div>
            </div>

            {/* Scale Slider */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                <span>Scale</span>
                <span>{previewScale}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="200" 
                value={previewScale} 
                onChange={e => setPreviewScale(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Opacity Slider */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                <span>Watermark Opacity</span>
                <span>{previewOpacity}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="100" 
                value={previewOpacity} 
                onChange={e => setPreviewOpacity(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Canvas Background Selector */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#173B2F', marginBottom: '6px', display: 'block' }}>Canvas Background</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { bg: '#FAF8F5', label: 'Cream' },
                  { bg: '#FFFFFF', label: 'White' },
                  { bg: '#173B2F', label: 'Forest' },
                  { bg: '#121212', label: 'Dark' }
                ].map(b => (
                  <button
                    key={b.bg}
                    type="button"
                    onClick={() => {
                      setPreviewBg(b.bg);
                      if (b.bg === '#173B2F' || b.bg === '#121212') setPreviewColor('#FAF8F5');
                      else setPreviewColor('#173B2F');
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      fontSize: '0.72rem',
                      borderRadius: '6px',
                      border: previewBg === b.bg ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.15)',
                      background: b.bg,
                      color: (b.bg === '#173B2F' || b.bg === '#121212') ? '#FFF' : '#000',
                      cursor: 'pointer'
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn-admin-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setNewAssignment(prev => ({
                  ...prev,
                  illustrationId: selectedIllustration.id,
                  scale: previewScale,
                  opacity: previewOpacity
                }));
                setActiveTab('assignments');
                setEditingAssignment('new');
              }}
            >
              <Plus size={16} /> Assign to Page Section
            </button>
          </div>
        </div>
      ) : (
        /* Section Assignments Tab */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#173B2F' }}>
                Section Watermarks &amp; Corner Accents
              </h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.84rem' }}>
                Subtly enhance specific pages without interfering with product photography or readability.
              </p>
            </div>
            <button 
              className="btn-admin-primary"
              onClick={() => setEditingAssignment('new')}
            >
              <Plus size={16} /> Add Section Assignment
            </button>
          </div>

          {/* New Assignment Modal / Card */}
          {editingAssignment && (
            <div className="admin-form-card glass-panel" style={{ marginBottom: '24px' }}>
              <div className="form-header">
                <h3>Assign Botanical Illustration</h3>
                <button className="btn-admin-secondary" onClick={() => setEditingAssignment(null)}>Cancel</button>
              </div>

              <form onSubmit={handleAddAssignment} className="admin-form">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Target Page *</label>
                    <select 
                      value={newAssignment.page} 
                      onChange={e => setNewAssignment({ ...newAssignment, page: e.target.value })}
                    >
                      {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Section Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={newAssignment.section}
                      onChange={e => setNewAssignment({ ...newAssignment, section: e.target.value })}
                      placeholder="e.g. Why Tanush Section / Mosquito Banner"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Selected Artwork *</label>
                    <select 
                      value={newAssignment.illustrationId} 
                      onChange={e => setNewAssignment({ ...newAssignment, illustrationId: e.target.value })}
                    >
                      {BOTANICAL_ILLUSTRATIONS_CATALOG.map(item => (
                        <option key={item.id} value={item.id}>{item.name} ({item.category})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label>Position *</label>
                    <select 
                      value={newAssignment.position} 
                      onChange={e => setNewAssignment({ ...newAssignment, position: e.target.value })}
                    >
                      {POSITIONS.map(pos => <option key={pos.value} value={pos.value}>{pos.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Watermark Opacity ({newAssignment.opacity}%)</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="40" 
                      value={newAssignment.opacity} 
                      onChange={e => setNewAssignment({ ...newAssignment, opacity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>Scale ({newAssignment.scale}%)</label>
                    <input 
                      type="range" 
                      min="60" 
                      max="180" 
                      value={newAssignment.scale} 
                      onChange={e => setNewAssignment({ ...newAssignment, scale: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ marginTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newAssignment.desktopVisible}
                      onChange={e => setNewAssignment({ ...newAssignment, desktopVisible: e.target.checked })}
                    />
                    <span>Visible on Desktop</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newAssignment.mobileVisible}
                      onChange={e => setNewAssignment({ ...newAssignment, mobileVisible: e.target.checked })}
                    />
                    <span>Visible on Mobile</span>
                  </label>
                </div>

                <div className="form-actions" style={{ marginTop: '20px' }}>
                  <button type="submit" className="btn-admin-primary">
                    <Check size={16} /> Save Assignment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table of Active Section Assignments */}
          <div className="admin-table-container glass-panel">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Artwork</th>
                  <th>Target Page</th>
                  <th>Section</th>
                  <th>Position</th>
                  <th>Opacity</th>
                  <th>Device Visibility</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const ill = getBotanicalIllustration(a.illustrationId);
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', background: 'rgba(23, 59, 47, 0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BotanicalIllustration id={a.illustrationId} size={30} color="#173B2F" />
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.84rem' }}>{ill.name}</strong>
                            <div style={{ fontSize: '0.72rem', color: '#6B7C73' }}>{ill.category}</div>
                          </div>
                        </div>
                      </td>
                      <td><code>/{a.page}</code></td>
                      <td>{a.section}</td>
                      <td><span style={{ textTransform: 'capitalize' }}>{a.position.replace('-', ' ')}</span></td>
                      <td>{a.opacity}%</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.78rem' }}>
                          {a.desktopVisible ? <span title="Desktop Enabled" style={{ color: '#2F6B43' }}><Monitor size={16} /></span> : <span style={{ opacity: 0.3 }}><Monitor size={16} /></span>}
                          {a.mobileVisible ? <span title="Mobile Enabled" style={{ color: '#2F6B43' }}><Smartphone size={16} /></span> : <span style={{ opacity: 0.3 }}><Smartphone size={16} /></span>}
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleToggleActive(a.id)}
                          style={{
                            border: 'none',
                            background: a.isActive ? '#EBF4EC' : '#F5F5F5',
                            color: a.isActive ? '#2F6B43' : '#888888',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {a.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleDeleteAssignment(a.id)}
                          title="Delete assignment"
                          style={{ color: '#C53030' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IllustrationsManager;
