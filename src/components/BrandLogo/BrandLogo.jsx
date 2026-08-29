import React from 'react';
import { useBrand } from '../../context/BrandContext';
import './BrandLogo.css';

const BrandLogo = ({ variant = 'header', className = '', showText = false, customAlt }) => {
  const { logoUrl, logoAlt, brandName } = useBrand();

  const altText = customAlt || logoAlt || brandName || 'Tanush Natural';

  return (
    <div className={`global-brand-logo-wrap logo-variant-${variant} ${className}`}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={altText} 
          className={`global-brand-logo-img img-${variant}`} 
          onError={(e) => {
            e.target.src = '/images/brand/tanush-logo.png';
          }}
        />
      ) : (
        <div className="global-logo-fallback">
          <div className="logo-main">TANUSH</div>
          <div className="logo-sub">NATURAL</div>
        </div>
      )}
      {showText && (
        <span className="global-logo-label">{brandName}</span>
      )}
    </div>
  );
};

export default BrandLogo;
