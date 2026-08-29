import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, FacebookLogo, WhatsappLogo, Phone, EnvelopeSimple, MapPin, ArrowRight } from 'phosphor-react';
import { api } from '../../lib/db';
import BrandLogo from '../BrandLogo/BrandLogo';
import './Footer.css';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState({
    logo_url: '',
    phone: '+91 94282 31144',
    email: 'hello@tanushnatural.com',
    address: 'Bhavnagar, Gujarat, India',
    instagram: 'https://instagram.com/TanushNatural',
    whatsapp: '+919428231144'
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  useEffect(() => {
    const loadFooterData = async () => {
      const [cats, siteData] = await Promise.all([
        api.getCategories(),
        api.getSiteSettings()
      ]);
      if (cats && cats.length > 0) {
        setCategories(cats.filter(c => c.is_active !== false));
      }
      if (siteData) {
        setSettings(prev => ({ ...prev, ...siteData }));
      }
    };
    loadFooterData();

    const handleSettingsUpdate = (e) => {
      if (e.detail) {
        setSettings(prev => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('site_settings_updated', handleSettingsUpdate);
    window.addEventListener('categories_updated', loadFooterData);
    window.addEventListener('cms_data_updated', loadFooterData);

    return () => {
      window.removeEventListener('site_settings_updated', handleSettingsUpdate);
      window.removeEventListener('categories_updated', loadFooterData);
      window.removeEventListener('cms_data_updated', loadFooterData);
    };
  }, []);

  return (
    <footer className="footer-container">
      <div className="container">
        <div className="footer-top">
          
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Tanush Natural Home">
              <BrandLogo variant="footer" />
            </Link>
            <p className="footer-desc">
              Nature-inspired products<br/>for modern everyday living.
            </p>
            <div className="newsletter-form">
               <p className="newsletter-label">Subscribe for updates &amp; offers</p>
               {subscribed ? (
                 <div className="newsletter-success-msg">
                   ✓ Thank you for subscribing!
                 </div>
               ) : (
                 <form className="newsletter-input-group" onSubmit={handleSubscribe}>
                   <input 
                     type="email" 
                     placeholder="Email address" 
                     aria-label="Email address" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required 
                   />
                   <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                     <ArrowRight size={15} weight="bold" />
                   </button>
                 </form>
               )}
            </div>
            <div className="social-icons">
              <a href={settings.instagram || "https://instagram.com/TanushNatural"} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramLogo size={24} /></a>
              <a href={settings.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookLogo size={24} /></a>
              <a href={`https://wa.me/${(settings.whatsapp || '919428231144').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsappLogo size={24} /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>SHOP</h4>
              <ul>
                <li><Link to="/shop">All Products</Link></li>
                {categories.slice(0, 5).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/shop?category=${cat.id}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>ABOUT</h4>
              <ul>
                <li><Link to="/why-tanush">Why Tanush</Link></li>
                <li><Link to="/why-tanush#our-story">Our Story</Link></li>
                <li><Link to="/become-a-partner">Become a Partner</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>HELP</h4>
              <ul>
                <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                <li><Link to="/returns">Returns & Refunds</Link></li>
                <li><Link to="/contact#faq">FAQs</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div className="footer-col contact-col">
              <h4>CONTACT</h4>
              <ul>
                <li>
                  <Phone size={20} />
                  <span>{settings.phone || '+91 94282 31144'}</span>
                </li>
                <li>
                  <EnvelopeSimple size={20} />
                  <span>{settings.email || 'hello@tanushnatural.com'}</span>
                </li>
                <li>
                  <MapPin size={20} />
                  <span>{settings.address || 'Bhavnagar, Gujarat, India'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} Tanush Natural. All Rights Reserved.
          </div>
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🇮🇳</span>
              Made in India
            </div>
            <div className="trust-item">
              <span className="trust-icon">🐰</span>
              Cruelty Free
            </div>
            <div className="trust-item">
              <span className="trust-icon">🌱</span>
              Eco Friendly
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
