import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, User, ArrowLeft } from 'phosphor-react';
import BrandLogo from '../../components/BrandLogo/BrandLogo';
import { api, applyFavicon } from '../../lib/db';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Tanush Natural — Admin Access';
    api.getSiteSettings().then(settings => {
      if (settings) {
        const fav = settings.use_primary_favicon !== false ? (settings.logo_url || settings.favicon_url) : (settings.favicon_url || settings.logo_url);
        applyFavicon(fav || '/images/brand/tanush-logo.png', 'Tanush Natural', 'Admin Access');
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please verify your username and password.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card glass-panel">
        <div className="admin-login-brand">
          <div style={{ marginBottom: '16px' }}>
            <BrandLogo variant="admin-login" />
          </div>
          <h2>Tanush Natural CMS</h2>
          <p className="text-muted text-sm">Protected Management & Content Control Center</p>
        </div>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Admin ID / Email</label>
            <div className="login-input-wrap">
              <User size={18} className="login-icon" />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter Admin ID or Email"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Security Password</label>
            <div className="login-input-wrap">
              <Lock size={18} className="login-icon" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter Password"
                required 
              />
            </div>
          </div>

          <button type="submit" className="admin-login-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="back-to-store-link">
            <ArrowLeft size={16} /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
