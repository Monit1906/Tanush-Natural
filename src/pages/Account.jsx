import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Envelope, ArrowRight, ShieldCheck, CheckCircle } from 'phosphor-react';
import Button from '../components/Button/Button';
import BrandLogo from '../components/BrandLogo/BrandLogo';
import { BotanicalWatermark } from '../components/Illustrations/BotanicalIllustrations';
import './Account.css';

const Account = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerSuccess, setCustomerSuccess] = useState('');
  const navigate = useNavigate();

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (tab === 'login') {
      setCustomerSuccess('Welcome back! You are now signed into your Tanush customer account.');
    } else {
      setCustomerSuccess('Account created successfully! Welcome to the Tanush Natural community.');
    }
  };

  return (
    <div className="account-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <BotanicalWatermark illustration="neem-branch" position="top-right" opacity={0.06} size={280} />
      <div className="container account-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Customer Authentication Panel */}
        <div className="account-card glass-panel">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <BrandLogo variant="account" />
          </div>
          <div className="account-tabs">
            <button 
              className={`account-tab-btn ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setCustomerSuccess(''); }}
            >
              Sign In
            </button>
            <button 
              className={`account-tab-btn ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setCustomerSuccess(''); }}
            >
              Create Account
            </button>
          </div>

          {customerSuccess ? (
            <div className="account-success-box">
              <CheckCircle size={32} color="var(--color-primary)" weight="fill" />
              <h3>{customerSuccess}</h3>
              <p>Explore our 100% natural, handcrafted wellness formulations.</p>
              <Button variant="primary" to="/shop">Explore Collection</Button>
            </div>
          ) : (
            <form className="account-form" onSubmit={handleCustomerSubmit}>
              {tab === 'register' && (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input 
                        type="text" 
                        placeholder="Enter your name" 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Envelope size={18} className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  {tab === 'login' && (
                    <a href="#forgot" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email.'); }}>
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth size="large" className="account-submit-btn">
                {tab === 'login' ? 'Sign In to Account' : 'Create Account'}
              </Button>
            </form>
          )}

          <div className="account-divider">
            <span>OR</span>
          </div>

          {/* Discreet Admin Access Portal */}
          <div className="admin-access-box">
            <div className="admin-access-header">
              <ShieldCheck size={20} color="var(--color-accent)" />
              <span>ADMIN ACCESS</span>
            </div>
            <p className="admin-access-sub">
              Are you a website administrator managing Tanush Natural?
            </p>
            <button 
              type="button" 
              className="admin-access-btn" 
              onClick={() => navigate('/admin/login')}
            >
              <span>Go to Admin Login</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
