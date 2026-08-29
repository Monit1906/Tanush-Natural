import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MagnifyingGlass, User, ShoppingCart, List, X, Heart } from 'phosphor-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../lib/db';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import AnnouncementMarquee from '../AnnouncementMarquee/AnnouncementMarquee';
import BrandLogo from '../BrandLogo/BrandLogo';
import './Header.css';

const defaultLinks = [
  { id: '1', title: 'Home', path: '/', is_active: true },
  { id: '2', title: 'Shop', path: '/shop', is_active: true },
  { id: '3', title: 'Why Tanush', path: '/why-tanush', is_active: true },
  { id: '4', title: 'Become a Partner', path: '/become-a-partner', is_active: true },
  { id: '5', title: 'Contact Us', path: '/contact', is_active: true }
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState(defaultLinks);
  const { cartCount, setIsCartOpen } = useCart();

  const loadNav = async () => {
    const settings = await api.getSiteSettings();
    if (settings?.nav_links && Array.isArray(settings.nav_links) && settings.nav_links.length > 0) {
      setNavLinks(settings.nav_links.filter(l => l.is_active !== false));
    }
  };

  useEffect(() => {
    loadNav();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('site_settings_updated', loadNav);
    window.addEventListener('cms_data_updated', loadNav);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('site_settings_updated', loadNav);
      window.removeEventListener('cms_data_updated', loadNav);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`site-unified-header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Top Announcement Strip */}
        <div className="unified-announcement-strip">
          <AnnouncementMarquee />
        </div>

        {/* Main Navbar Row */}
        <div className="unified-nav-row">
          <div className="container header-inner">
            <div className="header-left">
              <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
              </button>
              <Link to="/" className="brand-logo" aria-label="Tanush Natural Home">
                <BrandLogo variant="header" />
              </Link>
            </div>

            <nav className={`desktop-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {navLinks.map((link) => (
                <NavLink 
                  key={link.id || link.path}
                  to={link.path} 
                  className={({isActive}) => isActive ? "nav-link active" : "nav-link"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </NavLink>
              ))}
              <NavLink 
                to="/account" 
                className={({isActive}) => isActive ? "nav-link active mobile-only-link" : "nav-link mobile-only-link"} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </NavLink>
            </nav>

            <div className="header-right">
              <nav className="header-actions">
                <button className="action-btn-wrapper" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
                  <MagnifyingGlass size={20} className="action-icon" />
                </button>
                <Link to="/account" className="action-btn-wrapper desktop-only" aria-label="Account">
                  <User size={20} className="action-icon" />
                </Link>
                <Link to="/wishlist" className="action-btn-wrapper" aria-label="Wishlist">
                  <Heart size={20} className="action-icon" />
                </Link>
                <button className="action-btn-wrapper cart-btn" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
                  <ShoppingCart size={20} className="action-icon" />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
              </nav>
            </div>
          </div>
        </div>

        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </header>

      {/* Mobile Menu Backdrop */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    </>
  );
};

export default Header;
