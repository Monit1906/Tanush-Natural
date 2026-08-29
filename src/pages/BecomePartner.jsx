import React, { useState } from 'react';
import { 
  Storefront, Truck, Handshake, TrendUp, Megaphone, 
  GraduationCap, Globe, ClipboardText, WhatsappLogo, 
  Quotes, CheckCircle, Leaf
} from 'phosphor-react';
import Button from '../components/Button/Button';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { BotanicalWatermark } from '../components/Illustrations/BotanicalIllustrations';
import { partnerSlides } from '../data/heroData';
import './BecomePartner.css';

const BecomePartner = () => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    city: '',
    phone: '',
    email: '',
    businessType: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend mock submit
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({
      name: '', businessName: '', city: '', phone: '', email: '', businessType: '', message: ''
    });
  };

  return (
    <div className="partner-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <BotanicalWatermark illustration="harvest-basket" position="top-right" opacity={0.06} size={280} />
      {/* Hero Section - 1920x600 pure visual banner */}
      <InnerPageHero page="become-a-partner" />

      {/* Why Partner With Us */}
      <section className="why-partner-section container section-padding">
        <SectionHeading title="Why Partner With Us?" alignment="center" />
        
        <div className="why-partner-grid">
          <div className="why-partner-card">
            <Leaf size={32} />
            <h4>Growing Product Portfolio</h4>
            <p>A wide range of natural, everyday products</p>
          </div>
          <div className="why-partner-card">
            <Handshake size={32} />
            <h4>Attractive Margins</h4>
            <p>Better business opportunities</p>
          </div>
          <div className="why-partner-card">
            <Megaphone size={32} />
            <h4>Marketing Support</h4>
            <p>Branding & promotional assistance</p>
          </div>
          <div className="why-partner-card">
            <GraduationCap size={32} />
            <h4>Product Training</h4>
            <p>Knowledge & product insights</p>
          </div>
          <div className="why-partner-card">
            <Storefront size={32} />
            <h4>Retail & Distribution Opportunities</h4>
            <p>Expand your business reach</p>
          </div>
          <div className="why-partner-card">
            <TrendUp size={32} />
            <h4>Long-term Partnership</h4>
            <p>Grow together for a healthier future</p>
          </div>
        </div>
      </section>

      {/* Who Can Partner */}
      <section className="who-can-partner section-padding">
        <div className="container">
          <SectionHeading title="Who Can Partner?" alignment="center" />
          
          <div className="who-partner-grid">
            <div className="who-partner-card">
              <div className="card-img" style={{ backgroundImage: "url('/images/categories/home-care.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <h4>Retailers</h4>
            </div>
            <div className="who-partner-card">
              <div className="card-img" style={{ backgroundImage: "url('/images/categories/mosquito-protection.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <h4>Distributors</h4>
            </div>
            <div className="who-partner-card">
              <div className="card-img" style={{ backgroundImage: "url('/images/categories/personal-care.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <h4>Wholesalers</h4>
            </div>
            <div className="who-partner-card">
              <div className="card-img" style={{ backgroundImage: "url('/images/categories/more.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <h4>E-commerce Sellers</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Form */}
      <section className="journey-form-section container section-padding">
        <div className="journey-form-grid">
          
          <div className="journey-side">
            <SectionHeading title="Our Partner Journey" alignment="left" />
            
            <div className="journey-steps">
              <div className="j-step">
                <div className="j-icon"><ClipboardText size={32} /></div>
                <div className="j-text">
                  <h4>Enquiry</h4>
                  <p>Share your business details</p>
                </div>
              </div>
              <div className="j-arrow">→</div>
              <div className="j-step">
                <div className="j-icon"><Handshake size={32} /></div>
                <div className="j-text">
                  <h4>Onboarding</h4>
                  <p>Get product catalog & support</p>
                </div>
              </div>
              <div className="j-arrow">→</div>
              <div className="j-step">
                <div className="j-icon"><TrendUp size={32} /></div>
                <div className="j-text">
                  <h4>Grow Together</h4>
                  <p>Sell more, serve better</p>
                </div>
              </div>
              <div className="j-arrow">→</div>
              <div className="j-step">
                <div className="j-icon"><Globe size={32} /></div>
                <div className="j-text">
                  <h4>Long-term Success</h4>
                  <p>A stronger business ahead</p>
                </div>
              </div>
            </div>

            <div className="journey-message bg-sage">
              <div className="icon"><Leaf size={32} color="var(--color-primary)" /></div>
              <div>
                <h4>Together for a Healthier Tomorrow.</h4>
                <p>Partner with Tanush Natural and be part of a growing natural living movement.</p>
              </div>
            </div>
          </div>

          <div id="enquiry-form" className="form-side">
            <div className="form-card">
              <h3>Partner Enquiry Form</h3>
              
              {isSubmitted ? (
                <div className="success-state">
                  <CheckCircle size={48} color="var(--color-success)" />
                  <h4>Thank You!</h4>
                  <p>Our team will get in touch with you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                    <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
                  </div>
                  <div className="form-row">
                    <input type="text" name="city" placeholder="City / Location" value={formData.city} onChange={handleChange} required />
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                  <select name="businessType" value={formData.businessType} onChange={handleChange} required>
                    <option value="" disabled>Business Type</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Ecommerce">E-commerce Seller</option>
                    <option value="Other">Other</option>
                  </select>
                  <textarea name="message" placeholder="Tell us about your business / partnership interest" rows="4" value={formData.message} onChange={handleChange} required></textarea>
                  
                  <Button type="submit" variant="primary" fullWidth size="large">Submit Enquiry</Button>
                </form>
              )}
              
              <div className="whatsapp-contact">
                <WhatsappLogo size={20} color="#25D366" /> Or reach us directly on WhatsApp
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Testimonials */}
      <section className="partner-testimonials container section-padding">
        <SectionHeading title="What Our Partners Say" alignment="center" />
        
        <div className="partner-test-grid">
          <div className="partner-test-card">
            <Quotes size={32} color="var(--color-accent)" weight="fill" />
            <p className="quote">"Tanush products sell really well. Customers love the natural quality and trust the brand."</p>
            <div className="author">— Retail Store Owner, Bhavnagar</div>
          </div>
          <div className="partner-test-card">
            <Quotes size={32} color="var(--color-accent)" weight="fill" />
            <p className="quote">"Good margins, great support and growing demand. Tanush is a reliable partner."</p>
            <div className="author">— Distributor, Gujarat</div>
          </div>
          <div className="partner-test-card">
            <Quotes size={32} color="var(--color-accent)" weight="fill" />
            <p className="quote">"The range is excellent and fits perfectly with our customers' needs for natural, safe and effective products."</p>
            <div className="author">— Wholesaler, Surat</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="partner-final-cta container section-padding">
        <div className="final-cta-card">
          <div className="cta-content">
            <Leaf size={40} color="var(--color-white)" />
            <div>
              <h2>Ready to Partner?</h2>
              <p>Let's build a healthier, greener and more natural tomorrow — together.</p>
            </div>
          </div>
          <Button variant="outline" className="bg-white" to="#enquiry-form">Become a Tanush Partner →</Button>
        </div>
      </section>
      
    </div>
  );
};

export default BecomePartner;
