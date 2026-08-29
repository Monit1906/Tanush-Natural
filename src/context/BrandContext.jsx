import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, applyFavicon } from '../lib/db';

const BrandContext = createContext(null);

export const BrandProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    logoUrl: '/images/brand/tanush-logo.png',
    logoAlt: 'Tanush Natural & Co.',
    logoMediaId: 'brand-logo-main',
    faviconUrl: '/images/brand/tanush-logo.png',
    usePrimaryAsFavicon: true,
    brandName: 'Tanush Natural & Co.',
    tagline: 'Rooted in Nature, Made for Everyday Living'
  });

  const loadBranding = async () => {
    const settings = await api.getSiteSettings();
    if (settings) {
      const activeLogo = settings.logo_url || '/images/brand/tanush-logo.png';
      const activeFavicon = settings.use_primary_favicon !== false 
        ? activeLogo 
        : (settings.favicon_url || activeLogo);

      setBranding({
        logoUrl: activeLogo,
        logoAlt: settings.logo_alt || 'Tanush Natural & Co.',
        logoMediaId: settings.logo_media_id || 'brand-logo-main',
        faviconUrl: activeFavicon,
        usePrimaryAsFavicon: settings.use_primary_favicon !== false,
        brandName: settings.brand_name || 'Tanush Natural & Co.',
        tagline: settings.tagline || 'Rooted in Nature, Made for Everyday Living'
      });

      applyFavicon(activeFavicon, settings.brand_name || 'Tanush Natural & Co.', settings.tagline);
    }
  };

  useEffect(() => {
    loadBranding();

    const handleSettingsUpdate = (e) => {
      if (e.detail) {
        const s = e.detail;
        const activeLogo = s.logo_url || '/images/brand/tanush-logo.png';
        const activeFavicon = s.use_primary_favicon !== false 
          ? activeLogo 
          : (s.favicon_url || activeLogo);

        setBranding(prev => ({
          ...prev,
          logoUrl: activeLogo,
          logoAlt: s.logo_alt || 'Tanush Natural & Co.',
          logoMediaId: s.logo_media_id || 'brand-logo-main',
          faviconUrl: activeFavicon,
          usePrimaryAsFavicon: s.use_primary_favicon !== false,
          brandName: s.brand_name || 'Tanush Natural & Co.',
          tagline: s.tagline || 'Rooted in Nature, Made for Everyday Living'
        }));

        applyFavicon(activeFavicon, s.brand_name || 'Tanush Natural & Co.', s.tagline);
      }
    };

    window.addEventListener('site_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('site_settings_updated', handleSettingsUpdate);
  }, []);

  return (
    <BrandContext.Provider value={{ ...branding, refreshBranding: loadBranding }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    return {
      logoUrl: '/images/brand/tanush-logo.png',
      logoAlt: 'Tanush Natural & Co.',
      faviconUrl: '/images/brand/tanush-logo.png',
      brandName: 'Tanush Natural & Co.',
      tagline: 'Rooted in Nature, Made for Everyday Living'
    };
  }
  return context;
};
