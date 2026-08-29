import React from 'react';
import './Skeleton.css';

/**
 * 1. HOME PAGE SKELETON
 */
export const HomeSkeleton = () => (
  <div className="skel-home-page" aria-busy="true" aria-label="Loading homepage content">
    {/* Hero Section Shimmer */}
    <div className="skel-elem skel-home-hero">
      <div className="skel-home-hero-card">
        <div className="skel-elem skel-pill" style={{ width: '120px', height: '26px' }} />
        <div className="skel-elem skel-text-title" style={{ width: '85%', height: '42px' }} />
        <div className="skel-elem skel-text" style={{ width: '70%', height: '16px' }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <div className="skel-elem skel-btn" style={{ width: '150px' }} />
          <div className="skel-elem skel-btn" style={{ width: '150px' }} />
        </div>
      </div>
    </div>

    {/* Trust Features Strip */}
    <div className="skel-trust-strip">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skel-elem skel-trust-item" />
      ))}
    </div>

    {/* Category Pills Strip */}
    <div className="skel-categories-strip">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skel-elem skel-pill" style={{ width: `${90 + (i % 3) * 20}px` }} />
      ))}
    </div>

    {/* Featured Products Showcase */}
    <div className="skel-featured-section">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div className="skel-elem skel-pill" style={{ width: '100px', height: '22px' }} />
        <div className="skel-elem skel-text-title" style={{ width: '320px', height: '32px' }} />
        <div className="skel-elem skel-text" style={{ width: '220px', height: '14px' }} />
      </div>
      <div className="skel-grid-4">
        {[1, 2, 3, 4].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * 2. SHOP PAGE SKELETON
 */
export const ShopSkeleton = () => (
  <div className="skel-shop-page" aria-busy="true" aria-label="Loading shop collection">
    {/* Inner Page Hero 1920x600 Shimmer */}
    <div className="skel-elem skel-inner-hero" />

    {/* Toolbar / Actions Bar */}
    <div className="skel-shop-toolbar-wrap">
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="skel-elem skel-pill" style={{ width: '110px' }} />
        <div className="skel-elem skel-pill" style={{ width: '40px' }} />
        <div className="skel-elem skel-pill" style={{ width: '40px' }} />
      </div>
      <div className="skel-elem skel-pill" style={{ width: '220px' }} />
    </div>

    {/* Category Filter Pills */}
    <div className="skel-shop-categories-wrap">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="skel-elem skel-pill" style={{ width: `${110 + (i % 3) * 25}px`, flexShrink: 0 }} />
      ))}
    </div>

    {/* Product Grid */}
    <div className="skel-shop-grid">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * 3. PRODUCT DETAIL SKELETON
 */
export const ProductDetailSkeleton = () => (
  <div className="skel-product-detail" aria-busy="true" aria-label="Loading product details">
    {/* Breadcrumbs */}
    <div className="skel-elem skel-text" style={{ width: '240px', height: '16px' }} />

    {/* Main 2-Column Product Showcase */}
    <div className="skel-product-detail-layout">
      {/* Left Gallery */}
      <div className="skel-product-gallery">
        <div className="skel-elem skel-main-image" />
        <div className="skel-thumbnail-row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skel-elem skel-thumbnail" />
          ))}
        </div>
      </div>

      {/* Right Product Information */}
      <div className="skel-product-info">
        <div className="skel-elem skel-pill" style={{ width: '90px', height: '22px' }} />
        <div className="skel-elem skel-text-title" style={{ width: '85%', height: '36px' }} />
        
        {/* Rating Stars & Count */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="skel-elem" style={{ width: '100px', height: '18px', borderRadius: '4px' }} />
          <div className="skel-elem skel-text" style={{ width: '80px', height: '14px', marginBottom: 0 }} />
        </div>

        {/* Price Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '10px 0' }}>
          <div className="skel-elem" style={{ width: '110px', height: '34px', borderRadius: '6px' }} />
          <div className="skel-elem" style={{ width: '70px', height: '22px', borderRadius: '4px' }} />
        </div>

        {/* Short Description */}
        <div className="skel-elem skel-text" style={{ width: '100%', height: '16px' }} />
        <div className="skel-elem skel-text" style={{ width: '90%', height: '16px' }} />

        {/* Size / Volume Selectors */}
        <div style={{ display: 'flex', gap: '10px', margin: '12px 0' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skel-elem skel-pill" style={{ width: '80px' }} />
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
          <div className="skel-elem skel-btn" style={{ flex: 1 }} />
          <div className="skel-elem skel-btn" style={{ flex: 1 }} />
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skel-elem" style={{ width: '100%', height: '48px', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * 4. GENERIC / CONTENT PAGE SKELETON (Why Tanush, Partner, Contact, Account)
 */
export const GenericPageSkeleton = () => (
  <div className="skel-generic-page" aria-busy="true" aria-label="Loading page content">
    {/* Header Hero */}
    <div className="skel-elem skel-inner-hero" />

    <div className="skel-generic-container">
      {/* Content Cards */}
      <div className="skel-content-card">
        <div className="skel-elem skel-text-title" style={{ width: '40%' }} />
        <div className="skel-elem skel-text" style={{ width: '95%' }} />
        <div className="skel-elem skel-text" style={{ width: '85%' }} />
        <div className="skel-elem skel-text" style={{ width: '65%' }} />
      </div>

      <div className="skel-grid-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skel-content-card">
            <div className="skel-elem skel-circle" style={{ width: '48px', height: '48px' }} />
            <div className="skel-elem skel-text-title" style={{ width: '70%', height: '22px' }} />
            <div className="skel-elem skel-text" style={{ width: '90%' }} />
            <div className="skel-elem skel-text" style={{ width: '75%' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * 5. ADMIN MANAGER SKELETON
 */
export const AdminSkeleton = () => (
  <div className="skel-admin-view" aria-busy="true" aria-label="Loading admin manager">
    {/* Admin Top Header */}
    <div className="skel-admin-header">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="skel-elem skel-text-title" style={{ width: '220px', height: '28px', marginBottom: 0 }} />
        <div className="skel-elem skel-text" style={{ width: '320px', height: '14px', marginBottom: 0 }} />
      </div>
      <div className="skel-elem skel-btn" style={{ width: '160px' }} />
    </div>

    {/* Admin Assignment Matrix / Metrics */}
    <div className="skel-admin-matrix">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skel-elem" style={{ height: '44px', borderRadius: '8px' }} />
      ))}
    </div>

    {/* Admin Table / Card Grid */}
    <div className="skel-admin-table">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
        <div className="skel-elem skel-pill" style={{ width: '240px' }} />
        <div className="skel-elem skel-pill" style={{ width: '120px' }} />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skel-elem" style={{ height: '64px', borderRadius: '8px', margin: '4px 0' }} />
      ))}
    </div>
  </div>
);

/**
 * 6. SINGLE PRODUCT CARD SKELETON
 */
export const ProductCardSkeleton = () => (
  <div className="skel-product-card">
    <div className="skel-elem skel-product-img" />
    <div className="skel-elem skel-text" style={{ width: '35%', height: '12px' }} />
    <div className="skel-elem skel-text" style={{ width: '80%', height: '16px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
      <div className="skel-elem skel-text" style={{ width: '40%', height: '18px', marginBottom: 0 }} />
      <div className="skel-elem skel-pill" style={{ width: '80px', height: '32px' }} />
    </div>
  </div>
);

export default {
  HomeSkeleton,
  ShopSkeleton,
  ProductDetailSkeleton,
  GenericPageSkeleton,
  AdminSkeleton,
  ProductCardSkeleton
};
