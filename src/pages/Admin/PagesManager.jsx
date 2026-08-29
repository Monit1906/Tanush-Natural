import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import { Check, FileText, HelpCircle, Users, Shield, Plus, Trash2 } from 'lucide-react';
import './AdminStyles.css';

const PagesManager = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [content, setContent] = useState({
    our_story_headline: 'Rooted in Nature, Crafted for Modern Living',
    our_story_body: 'Tanush Natural began with a simple belief: everyday living essentials should be as pure, honest, and thoughtful as nature itself.',
    why_natural_1_title: '100% Herbal Extracts',
    why_natural_1_desc: 'Carefully sourced botanical ingredients free from harsh synthetic chemicals.',
    why_natural_2_title: 'Handcrafted Quality',
    why_natural_2_desc: 'Small-batch attention to detail ensuring supreme potency and freshness.',
    partner_headline: 'Grow With Tanush Natural',
    partner_desc: 'Join our expanding network of retail, distribution, and wellness partners across India.',
    shipping_policy: 'Orders are dispatched within 24-48 hours. Free standard delivery applies to orders above ₹499 across all Indian pin codes.',
    returns_policy: 'We offer an easy 7-day return and replacement policy for any damaged or defective items.'
  });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      const settings = await api.getSiteSettings();
      if (settings?.page_content) {
        setContent(prev => ({ ...prev, ...settings.page_content }));
      }
    };
    loadContent();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const current = await api.getSiteSettings();
    await api.saveSiteSettings({
      ...current,
      page_content: content
    });
    showToast('✓ Custom page contents saved successfully!');
  };

  return (
    <div className="admin-page-container">
      {notification && <div className="admin-toast">{notification}</div>}

      <div className="admin-header-actions">
        <div>
          <h2>Pages & Content CMS</h2>
          <p className="text-muted">Edit narrative copy, brand philosophy, partner programs, and customer policy disclosures</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="media-filter-bar glass-panel" style={{ marginBottom: '24px' }}>
        <div className="cat-filter-tabs">
          <button 
            type="button"
            className={`filter-pill ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            BRAND STORY & ABOUT
          </button>
          <button 
            type="button"
            className={`filter-pill ${activeTab === 'partner' ? 'active' : ''}`}
            onClick={() => setActiveTab('partner')}
          >
            PARTNER PROGRAM
          </button>
          <button 
            type="button"
            className={`filter-pill ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            SHIPPING & RETURNS
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-form">
        {activeTab === 'story' && (
          <div className="admin-form-card glass-panel">
            <div className="form-section-title">
              <FileText size={20} color="var(--color-primary)" />
              <h3>Our Story & Philosophy</h3>
            </div>

            <div className="form-group">
              <label>Story Headline</label>
              <input 
                type="text" 
                value={content.our_story_headline || ''} 
                onChange={(e) => setContent({ ...content, our_story_headline: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>Story Narrative</label>
              <textarea 
                rows={5} 
                value={content.our_story_body || ''} 
                onChange={(e) => setContent({ ...content, our_story_body: e.target.value })} 
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Pillar 1 Title</label>
                <input 
                  type="text" 
                  value={content.why_natural_1_title || ''} 
                  onChange={(e) => setContent({ ...content, why_natural_1_title: e.target.value })} 
                />
                <textarea 
                  rows={2} 
                  value={content.why_natural_1_desc || ''} 
                  onChange={(e) => setContent({ ...content, why_natural_1_desc: e.target.value })} 
                  style={{ marginTop: '8px' }}
                />
              </div>
              <div className="form-group flex-1">
                <label>Pillar 2 Title</label>
                <input 
                  type="text" 
                  value={content.why_natural_2_title || ''} 
                  onChange={(e) => setContent({ ...content, why_natural_2_title: e.target.value })} 
                />
                <textarea 
                  rows={2} 
                  value={content.why_natural_2_desc || ''} 
                  onChange={(e) => setContent({ ...content, why_natural_2_desc: e.target.value })} 
                  style={{ marginTop: '8px' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partner' && (
          <div className="admin-form-card glass-panel">
            <div className="form-section-title">
              <Users size={20} color="var(--color-primary)" />
              <h3>Partner & B2B Inquiries Page</h3>
            </div>

            <div className="form-group">
              <label>Partner Page Headline</label>
              <input 
                type="text" 
                value={content.partner_headline || ''} 
                onChange={(e) => setContent({ ...content, partner_headline: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>Partner Description & Terms</label>
              <textarea 
                rows={4} 
                value={content.partner_desc || ''} 
                onChange={(e) => setContent({ ...content, partner_desc: e.target.value })} 
              />
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="admin-form-card glass-panel">
            <div className="form-section-title">
              <Shield size={20} color="var(--color-primary)" />
              <h3>Customer Policies</h3>
            </div>

            <div className="form-group">
              <label>Shipping & Delivery Policy</label>
              <textarea 
                rows={4} 
                value={content.shipping_policy || ''} 
                onChange={(e) => setContent({ ...content, shipping_policy: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>Returns & Refunds Policy</label>
              <textarea 
                rows={4} 
                value={content.returns_policy || ''} 
                onChange={(e) => setContent({ ...content, returns_policy: e.target.value })} 
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn-admin-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
          <Check size={18} /> Save Page Contents
        </button>
      </form>
    </div>
  );
};

export default PagesManager;
