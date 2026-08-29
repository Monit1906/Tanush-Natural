import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { Plus, Edit2, Trash2, Search, X, Check, Save, Star, MessageSquareQuote } from 'lucide-react';
import './AdminStyles.css';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    id: '',
    name: '',
    role: 'Verified Customer',
    text: '',
    rating: 5,
    sort_order: 1,
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await api.getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleEdit = (t) => {
    setCurrentTestimonial({ ...t });
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setCurrentTestimonial({
      id: '',
      name: '',
      role: 'Verified Customer',
      text: '',
      rating: 5,
      sort_order: testimonials.length + 1,
      is_active: true
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      await api.deleteTestimonial(id);
      showToast('Testimonial removed');
      loadData();
    }
  };

  const handleToggleStatus = async (t) => {
    const updated = { ...t, is_active: t.is_active === false };
    await api.saveTestimonial(updated);
    loadData();
    showToast(`Testimonial visibility updated`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await api.saveTestimonial(currentTestimonial);
    showToast(`✓ Review from "${currentTestimonial.name}" saved!`);
    setIsDrawerOpen(false);
    loadData();
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.text && t.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Testimonials CMS</h2>
          <p className="text-muted">Compact manager for verified customer reviews and ratings</p>
        </div>
        <button className="btn-admin-primary" onClick={handleAddNew}>
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="media-filter-bar glass-panel" style={{ marginBottom: '16px' }}>
        <div className="search-input-wrap" style={{ maxWidth: '360px' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search reviews by customer or text..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="text-muted text-xs" style={{ marginLeft: 'auto' }}>
          {filteredTestimonials.length} total testimonial(s)
        </div>
      </div>

      {/* Compact Table Card */}
      <div className="admin-table-card glass-panel" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer & Role</th>
              <th>Review Text</th>
              <th style={{ width: '110px' }}>Rating</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.map((t) => (
              <tr key={t.id}>
                <td>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>{t.name}</strong>
                  <div className="text-muted text-xs">{t.role || 'Verified Customer'}</div>
                </td>
                <td>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-main)', maxWidth: '480px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{t.text}"
                  </p>
                </td>
                <td>
                  <div style={{ display: 'flex', color: '#EAB308', gap: '2px' }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="#EAB308" />
                    ))}
                  </div>
                </td>
                <td>
                  <button 
                    type="button"
                    onClick={() => handleToggleStatus(t)}
                    className={`status-badge ${t.is_active !== false ? 'status-active' : 'status-inactive'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                    title="Click to toggle visibility"
                  >
                    {t.is_active !== false ? 'Published' : 'Hidden'}
                  </button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button 
                      type="button"
                      className="icon-action-btn"
                      onClick={() => handleEdit(t)}
                      title="Edit Testimonial"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button 
                      type="button"
                      className="icon-action-btn danger"
                      onClick={() => handleDelete(t.id, t.name)}
                      title="Delete Testimonial"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Drawer Modal */}
      {isDrawerOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel" style={{ maxWidth: '520px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button className="icon-action-btn" onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Customer Name *</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    required 
                    value={currentTestimonial.name} 
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Customer Role / Tag</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    value={currentTestimonial.role} 
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })} 
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Review Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCurrentTestimonial({ ...currentTestimonial, rating: star })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Star 
                        size={22} 
                        fill={star <= (currentTestimonial.rating || 5) ? '#EAB308' : 'none'} 
                        color="#EAB308" 
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '8px' }}>
                    {currentTestimonial.rating || 5} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Review Quote *</label>
                <textarea 
                  className="admin-textarea"
                  rows={4} 
                  required 
                  value={currentTestimonial.text} 
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, text: e.target.value })} 
                  placeholder="What did the customer say about Tanush Natural products?"
                />
              </div>

              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input 
                  type="checkbox" 
                  id="testi_active" 
                  checked={currentTestimonial.is_active !== false} 
                  onChange={e => setCurrentTestimonial({ ...currentTestimonial, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="testi_active" style={{ fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer' }}>
                  Published and visible in Testimonial Strip
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn-admin-secondary" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  <Save size={16} /> Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
