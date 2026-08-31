import React, { useState, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Plus, 
  Trash, 
  ShoppingBag, 
  ArrowRight, 
  Sparkle, 
  ShieldCheck, 
  Truck, 
  LockSimple,
  CheckCircle
} from 'phosphor-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo/BrandLogo';
import { BotanicalShield } from '../Illustrations/BotanicalIllustrations';
import { api } from '../../lib/db';
import './CartDrawer.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartSubtotal, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);

  // Free shipping threshold in ₹
  const FREE_SHIPPING_THRESHOLD = 499;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Load complementary products for upsell
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const prods = await api.getProducts();
        if (prods && prods.length > 0) {
          // Filter out items already in cart
          const inCartIds = new Set(cartItems.map(item => item.id));
          const available = prods.filter(p => !inCartIds.has(p.id) && p.is_active !== false);
          setRecommendations(available.slice(0, 2));
        }
      } catch (e) {
        console.warn('Failed loading cart recommendations:', e);
      }
    };

    if (isCartOpen) {
      loadRecommendations();
    }
  }, [isCartOpen, cartItems]);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title-wrap">
            <BrandLogo variant="cart" />
            <h2>
              Your Cart
              {cartItems.length > 0 && (
                <span className="cart-count-badge">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </h2>
          </div>
          <button 
            type="button" 
            className="close-cart-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Dynamic Free Shipping Threshold Meter */}
        {cartItems.length > 0 && (
          <div className="cart-shipping-meter">
            <div className="shipping-meter-text">
              <Truck size={17} color="#173B2F" weight="fill" />
              {amountNeeded > 0 ? (
                <span>
                  Add <strong>₹{amountNeeded}</strong> more for <strong>FREE Express Shipping</strong>!
                </span>
              ) : (
                <span style={{ color: '#2F6B43' }}>
                  🎉 <strong>Free Express Shipping</strong> unlocked!
                </span>
              )}
            </div>
            <div className="shipping-progress-track">
              <div 
                className="shipping-progress-fill" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        )}

        {/* Scrollable Cart Body */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon-wrap">
                <ShoppingBag size={36} weight="light" />
              </div>
              <h3>Your basket is empty</h3>
              <p>Discover our range of 100% natural and pure botanical living formulations.</p>
              <Link 
                to="/shop" 
                className="checkout-btn" 
                style={{ marginTop: '8px', maxWidth: '220px' }}
                onClick={() => setIsCartOpen(false)}
              >
                START SHOPPING <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          ) : (
            <>
              {/* Product list */}
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-image">
                    <img 
                      src={Array.isArray(item.images) ? item.images[0] : (item.images || item.image || '/images/products/product-1.jpg')} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "/images/products/product-1.jpg";
                      }}
                    />
                  </div>

                  <div className="cart-item-details">
                    <div>
                      <div className="cart-item-details-top">
                        <Link to={`/product/${item.slug || item.id}`} onClick={() => setIsCartOpen(false)}>
                          <h4>{item.name}</h4>
                        </Link>
                      </div>

                      <div className="cart-item-price-wrap">
                        <span className="cart-item-price">₹{item.price}</span>
                        {item.compareAtPrice && Number(item.compareAtPrice) > Number(item.price) && (
                          <span className="cart-item-compare-price">₹{item.compareAtPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="cart-qty-pill">
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} weight="bold" />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} weight="bold" />
                        </button>
                      </div>

                      <button 
                        type="button" 
                        className="remove-item-btn" 
                        onClick={() => removeFromCart(item.id)}
                        title="Remove formulation"
                        aria-label="Remove item"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Complementary Botanical Add-on recommendations */}
              {recommendations.length > 0 && (
                <div className="cart-upsell-section">
                  <div className="cart-upsell-header">
                    <Sparkle size={14} color="#B48228" weight="fill" />
                    <span>Pairs Well With Your Order</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {recommendations.map(rec => (
                      <div key={rec.id} className="cart-upsell-item">
                        <div className="cart-upsell-info">
                          <div className="cart-upsell-thumb">
                            <img 
                              src={Array.isArray(rec.images) ? rec.images[0] : (rec.images || rec.image || '/images/products/product-1.jpg')} 
                              alt={rec.name} 
                              onError={e => { e.target.src = '/images/products/product-1.jpg'; }}
                            />
                          </div>
                          <div className="cart-upsell-meta">
                            <h5>{rec.name}</h5>
                            <span>₹{rec.price}</span>
                          </div>
                        </div>

                        <button 
                          type="button" 
                          className="cart-upsell-add-btn"
                          onClick={() => addToCart(rec, 1)}
                        >
                          <Plus size={12} weight="bold" /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="subtotal-amount">₹{cartSubtotal}</span>
            </div>
            <p className="cart-shipping-note">
              {amountNeeded === 0 
                ? '✓ Free Express Shipping applied at checkout.' 
                : 'Shipping & taxes calculated at next step.'}
            </p>

            <Link 
              to="/checkout" 
              className="checkout-btn"
              onClick={() => setIsCartOpen(false)}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={17} weight="bold" />
            </Link>

            {/* Botanical Trust Badges */}
            <div className="cart-trust-badges">
              <div className="cart-trust-item">
                <BotanicalShield size={14} color="#2F6B43" />
                <span>100% Pure Botanical</span>
              </div>
              <span>•</span>
              <div className="cart-trust-item">
                <LockSimple size={14} color="#2F6B43" weight="bold" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
