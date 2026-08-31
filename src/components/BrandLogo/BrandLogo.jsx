import React from 'react';
import { useBrand } from '../../context/BrandContext';
import './BrandLogo.css';

const BrandLogo = ({ 
  variant = 'header', 
  className = '', 
  showText = true, 
  hideText = false,
  customAlt,
  customTitle,
  customSubtitle
}) => {
  const { logoUrl, logoAlt, brandName, brandTitle, brandSubtitle } = useBrand();

  const altText = customAlt || logoAlt || brandName || 'Tanush Natural & Co.';
  const title = customTitle || brandTitle || 'TANUSH';
  const subtitle = customSubtitle || brandSubtitle || 'NATURAL & CO.';
  const shouldShowText = showText && !hideText;

  return (
    <div className={`global-brand-logo-wrap logo-variant-${variant} ${className}`}>
      <div className={`global-brand-logo-mark mark-${variant}`}>
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={altText} 
            className={`global-brand-logo-img img-${variant}`} 
            onError={(e) => {
              e.target.src = '/uploads/1787985113737-Round_LOGO.png';
            }}
          />
        ) : (
          <div className="global-logo-fallback-circle">
            <span className="logo-initial">T</span>
          </div>
        )}
      </div>

      {shouldShowText && (
        <div className={`global-brand-text-block text-${variant}`}>
          <span className="brand-text-title">{title}</span>
          <span className="brand-text-subtitle">{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;

