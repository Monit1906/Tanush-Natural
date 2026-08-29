import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'phosphor-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from '../Button/Button';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const isWished = isInWishlist(product.id);

  if (viewMode === 'list') {
    return (
      <div className="product-card product-card-list-view">
        <Link to={`/product/${product.slug}`} className="product-card-link-list">
          <div className="product-image-container-list">
            {product.isBestSeller && (
              <div className="badge best-seller-badge">BEST SELLER</div>
            )}
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="product-image" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/400x500/EDF1EE/1A3E2F?text=Product";
              }}
            />
          </div>

          <div className="product-info-list">
            <div className="product-meta-top">
              <span className="product-category-tag">{product.category || 'Botanical Care'}</span>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      weight="fill" 
                      color={i < Math.floor(product.rating || 5) ? "#D4AF37" : "#E2DFD8"} 
                    />
                  ))}
                </div>
                <span className="review-count">({product.reviewCount || 24})</span>
              </div>
            </div>

            <h3 className="product-name-list">{product.name}</h3>
            <p className="product-description-list">{product.description || product.short_description || "Pure Ayurvedic botanical formulation for daily care."}</p>
            
            {product.benefits && product.benefits.length > 0 && (
              <div className="product-benefits-tags">
                {product.benefits.slice(0, 3).map((b, idx) => (
                  <span key={idx} className="benefit-tag">✓ {b}</span>
                ))}
              </div>
            )}
          </div>

          <div className="product-actions-column-list">
            <div className="price-container-list">
              <span className="current-price">₹{product.price}</span>
              {product.compareAtPrice > product.price && (
                <span className="original-price">₹{product.compareAtPrice}</span>
              )}
            </div>

            <span className="stock-status-tag">In Stock &bull; Ready to Ship</span>

            <div className="list-buttons-group">
              <button 
                type="button"
                className="btn-list-add-cart"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={17} />
                <span>ADD TO CART</span>
              </button>

              <button 
                type="button"
                className={`btn-list-wishlist ${isWished ? 'active' : ''}`}
                onClick={handleWishlist}
                title={isWished ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} weight={isWished ? 'fill' : 'regular'} />
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="product-image-container">
          {product.isBestSeller && (
            <div className="badge best-seller-badge glass-control" style={{background: 'rgba(255,255,255,0.7)', padding: '4px 12px', fontSize: '0.65rem'}}>BEST SELLER</div>
          )}
          
          <div className="product-image-wrapper">
             <img src={product.images[0]} alt={product.name} className="product-image" 
               onError={(e) => {
                 e.target.onerror = null; 
                 e.target.src = "https://placehold.co/400x500/EDF1EE/1A3E2F?text=Product";
               }}
              />
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <p className="product-description">{product.description || "Thoughtfully made everyday essential."}</p>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  weight="fill" 
                  color={i < Math.floor(product.rating) ? "#D4AF37" : "#E2DFD8"} 
                />
              ))}
            </div>
            <span className="review-count">({product.reviewCount})</span>
          </div>
          
          <div className="product-price-row">
            <div className="price-container">
              <span className="current-price">₹{product.price}</span>
              {product.compareAtPrice > product.price && (
                <span className="original-price">₹{product.compareAtPrice}</span>
              )}
            </div>
            <div className="product-actions">
              <button 
                className="action-icon-btn"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingCart size={20} />
              </button>
              <button 
                className={`action-icon-btn ${isWished ? 'active' : ''}`}
                onClick={handleWishlist}
                aria-label="Add to wishlist"
              >
                <Heart size={20} weight={isWished ? 'fill' : 'regular'} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
