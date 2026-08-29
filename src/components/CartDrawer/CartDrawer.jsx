import React from 'react';
import { X, Minus, Plus, Trash } from 'phosphor-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import BrandLogo from '../BrandLogo/BrandLogo';
import { BotanicalShield } from '../Illustrations/BotanicalIllustrations';
import './CartDrawer.css';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BrandLogo variant="cart" />
            <h2 style={{ margin: 0 }}>Your Cart ({cartItems.length})</h2>
          </div>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is currently empty.</p>
              <Button variant="primary" onClick={() => setIsCartOpen(false)} to="/shop">
                CONTINUE SHOPPING
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.images[0]} alt={item.name} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://placehold.co/100x120/EDF1EE/1A3E2F?text=Img";
                    }}
                  />
                </div>
                <div className="cart-item-details">
                  <Link to={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                    <h4>{item.name}</h4>
                  </Link>
                  <div className="cart-item-price">₹{item.price}</div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="subtotal-amount">₹{cartSubtotal}</span>
            </div>
            <p className="cart-shipping-note">Shipping and taxes calculated at checkout.</p>
            <Button variant="primary" fullWidth size="large">
              PROCEED TO CHECKOUT
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.72rem', color: '#6B7C73', fontWeight: 600 }}>
              <BotanicalShield size={16} color="#2F6B43" />
              <span>100% Botanical Actives • Chemical-Conscious Formulation</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
