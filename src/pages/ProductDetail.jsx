import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, WhatsappLogo, CheckCircle, Leaf, ShieldCheck, Heart } from 'phosphor-react';
import { api } from '../lib/db';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/Button/Button';
import ProductCard from '../components/ProductCard/ProductCard';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import { ProductDetailSkeleton } from '../components/Skeletons/Skeleton';
import { 
  ProductUsageFlow, 
  BotanicalWatermark, 
  SectionIllustrationSlot,
  TulsiSprig, 
  CitronellaCluster, 
  LemongrassStalk, 
  NeemBranch, 
  EucalyptusSprig, 
  WildTurmeric, 
  AmlaCluster,
  MoringaFrond,
  AloeVeraRosette,
  BhringrajFlora,
  HibiscusBlossom
} from '../components/Illustrations/BotanicalIllustrations';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const fetchData = async () => {
    const [p, settings] = await Promise.all([
      api.getProductBySlug(slug),
      api.getSiteSettings()
    ]);

    if (!p) {
      navigate('/404');
      return;
    }
    
    const allProducts = await api.getProducts();
    const related = allProducts.filter(item => item.category === p.category && item.id !== p.id && item.is_active !== false).slice(0, 4);
    
    setProduct(p);
    setRelatedProducts(related);
    setSiteSettings(settings);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);

    // Track product view (deduplicated per session)
    if (slug) {
      const sessionKey = `viewed_prod_${slug}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, 'true');
        api.getProductBySlug(slug).then(p => {
          if (p) {
            api.logAnalyticsEvent({
              type: 'view',
              product_id: p.id,
              product_name: p.name,
              category: p.category,
              details: 'Viewed product page'
            });
          }
        }).catch(() => {});
      }
    }

    const handleSync = () => fetchData();
    window.addEventListener('products_updated', handleSync);
    window.addEventListener('site_settings_updated', handleSync);

    return () => {
      window.removeEventListener('products_updated', handleSync);
      window.removeEventListener('site_settings_updated', handleSync);
    };
  }, [slug, navigate]);


  if (loading) return <ProductDetailSkeleton />;
  if (!product) return null;

  const isWished = isInWishlist(product.id);
  const images = (product.images && product.images.length > 0) ? product.images : ['/images/products/product-1.jpg'];
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const comparePrice = product.compareAtPrice || product.compare_at_price || 0;
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || product.review_count || 24;
  const stockStatus = product.stockStatus || product.stock_status || 'In Stock';
  const shortDesc = product.shortDescription || product.short_description || '';
  const fullDesc = product.description || '';
  const ingredients = product.ingredients || 'Natural herbal extracts, botanical oils, and organic binders.';
  const howToUse = product.howToUse || product.how_to_use || 'Use daily as directed on packaging for best results.';
  const caution = product.caution || 'For external use only. Store in a cool and dry place away from direct sunlight.';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    api.logAnalyticsEvent({
      type: 'add_to_cart',
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      details: `Added ${quantity} item(s) to cart`
    }).catch(() => {});
  };

  const handleBuyNowClick = () => {
    api.logAnalyticsEvent({
      type: 'buy_now',
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      details: 'Clicked Buy Now / WhatsApp order CTA'
    }).catch(() => {});
  };

  const whatsappNumber = (siteSettings?.whatsapp || '919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%2C%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}%20(Qty%3A%20${quantity})%20from%20Tanush%20Natural.`;


    const isMosquitoProd = (product.category || '').includes('mosquito') || (product.slug || '').includes('mosquito') || (product.slug || '').includes('vaporizer');

  return (
    <div className="product-detail-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Watermark */}
      <BotanicalWatermark 
        illustration={isMosquitoProd ? "botanical-shield" : "neem-branch"} 
        position="top-right" 
        opacity={0.05} 
        size={280} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> / 
          <span onClick={() => navigate('/shop')}>Shop</span> / 
          <span className="current">{product.name}</span>
        </div>

        <div className="product-main-area">
          {/* Images Section */}
          <div className="product-gallery">
            <div className="thumbnail-list">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} 
                     onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100/EDF1EE/1A3E2F?text=Thumb"; }}
                  />
                </div>
              ))}
            </div>
            <div className="main-image">
              <button className={`wishlist-btn-large glass-control ${isWished ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
                <Heart size={24} weight={isWished ? 'fill' : 'regular'} />
              </button>
              <img src={images[activeImage] || images[0]} alt={product.name} 
                 onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/EDF1EE/1A3E2F?text=Product+Image"; }}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="product-info-panel">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="rating-wrap">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} weight="fill" color={i < Math.floor(rating) ? "#D4AF37" : "#E2DFD8"} />
                  ))}
                </div>
                <span>{rating} ({reviewCount} Reviews)</span>
              </div>
              <div className="stock-badge">{stockStatus}</div>
            </div>

            {shortDesc && <p className="product-short-desc">{shortDesc}</p>}

            {benefits.length > 0 && (
              <div className="product-benefits">
                {benefits.map((benefit, idx) => (
                  <div className="benefit-item" key={idx}>
                    {idx % 2 === 0 ? <Leaf size={20} color="var(--color-primary)" /> : <ShieldCheck size={20} color="var(--color-primary)" />}
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="product-price-section">
              <span className="price">₹{product.price}</span>
              {comparePrice > product.price && (
                <>
                  <span className="compare-price">₹{comparePrice}</span>
                  <span className="discount-tag">Save ₹{comparePrice - product.price}</span>
                </>
              )}
              <div className="tax-note">Inclusive of all taxes</div>
            </div>

            <div className="add-to-cart-section">
              <div className="quantity-wrap">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <Button variant="primary" size="large" fullWidth onClick={handleAddToCart}>
                ADD TO CART
              </Button>
            </div>

            <div className="whatsapp-cta">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }} onClick={handleBuyNowClick}>
                <Button variant="outline" size="large" fullWidth>
                  <WhatsappLogo size={20} color="#25D366" /> ORDER VIA WHATSAPP
                </Button>
              </a>
            </div>

            <div className="shipping-info">
              <div className="info-row"><CheckCircle size={18} /> Free shipping on orders above ₹499</div>
              <div className="info-row"><CheckCircle size={18} /> Cash on delivery available across India</div>
            </div>
          </div>
        </div>

        {/* Botanical Usage & Preparation Step Flow */}
        <ProductUsageFlow product={product} />

        {/* Detailed Tabs */}
        <div className="product-details-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Key Ingredients
            </button>
            <button 
              className={`tab-btn ${activeTab === 'howToUse' ? 'active' : ''}`}
              onClick={() => setActiveTab('howToUse')}
            >
              How to Use
            </button>
            <button 
              className={`tab-btn ${activeTab === 'caution' ? 'active' : ''}`}
              onClick={() => setActiveTab('caution')}
            >
              Care &amp; Caution
            </button>
          </div>

          <div className="tab-content glass-panel">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <p>{fullDesc || shortDesc || 'Thoughtfully formulated using pure herbal and botanical extracts. Designed for everyday family wellness and maximum efficacy without synthetic additives.'}</p>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="tab-pane">
                <p style={{ marginBottom: '16px' }}>{ingredients}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {ingredients.toLowerCase().includes('neem') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <NeemBranch size={18} color="#173B2F" />
                      <span>Pure Neem</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('citronella') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <CitronellaCluster size={18} color="#173B2F" />
                      <span>Java Citronella</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('lemongrass') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <LemongrassStalk size={18} color="#173B2F" />
                      <span>Lemongrass</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('eucalyptus') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <EucalyptusSprig size={18} color="#173B2F" />
                      <span>Eucalyptus</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('tulsi') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <TulsiSprig size={18} color="#173B2F" />
                      <span>Holy Basil (Tulsi)</span>
                    </div>
                  )}
                  {(ingredients.toLowerCase().includes('turmeric') || ingredients.toLowerCase().includes('haldi')) && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <WildTurmeric size={18} color="#173B2F" />
                      <span>Kasturi Haldi</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('amla') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <AmlaCluster size={18} color="#173B2F" />
                      <span>Wild Amla</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('moringa') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <MoringaFrond size={18} color="#173B2F" />
                      <span>Moringa Leaf</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('bhringraj') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <BhringrajFlora size={18} color="#173B2F" />
                      <span>Bhringraj</span>
                    </div>
                  )}
                  {ingredients.toLowerCase().includes('aloe') && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(23, 59, 47, 0.06)', border: '1px solid rgba(23, 59, 47, 0.12)', fontSize: '0.78rem', fontWeight: 600, color: '#173B2F' }}>
                      <AloeVeraRosette size={18} color="#173B2F" />
                      <span>Aloe Vera</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'howToUse' && (
              <div className="tab-pane">
                <p>{howToUse}</p>
              </div>
            )}
            {activeTab === 'caution' && (
              <div className="tab-pane">
                <p>{caution}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <SectionHeading 
              subtitle="COMPLETE YOUR RITUAL" 
              title="You May Also Like" 
            />
            <div className="related-grid">
              {relatedProducts.map(relProduct => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
