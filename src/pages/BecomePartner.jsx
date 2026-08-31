import React, { useState, useEffect } from 'react';
import { 
  Storefront, Truck, Handshake, TrendUp, Megaphone, 
  GraduationCap, Globe, ClipboardText, WhatsappLogo, 
  Quotes, CheckCircle, Leaf
} from 'phosphor-react';
import Button from '../components/Button/Button';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { SectionIllustrationSlot } from '../components/Illustrations/BotanicalIllustrations';
import { api } from '../lib/db';
import './BecomePartner.css';

const BecomePartner = () => {
  const [pageConfig, setPageConfig] = useState(null);
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

  const loadConfig = async () => {
    try {
      const conf = await api.getPageConfig('become-a-partner');
      if (conf) setPageConfig(conf);
    } catch (e) {
      console.warn('Failed loading partner page config:', e);
    }
  };

  useEffect(() => {
    loadConfig();
    const handleSync = () => loadConfig();

    window.addEventListener('page_sections_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('page_sections_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.saveMessage({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        message: `[Partner Application] Business: ${formData.businessName}, City: ${formData.city}, Type: ${formData.businessType}. Note: ${formData.message}`,
        status: 'New'
      });
      await api.logAnalyticsEvent({
        type: 'partner_lead',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        details: `Business: ${formData.businessName} (${formData.businessType})`
      });
    } catch (err) {
      console.warn('Failed to log partner application:', err);
    }
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({
      name: '', businessName: '', city: '', phone: '', email: '', businessType: '', message: ''
    });
  };

  const sections = pageConfig?.sections || [];
  const getSection = (id) => sections.find(s => s.id === id);
  const isSectionActive = (id) => {
    const sec = getSection(id);
    return sec ? sec.isActive !== false : true;
  };

  const heroSec = getSection('hero');
  const introSec = getSection('intro');
  const benefitsSec = getSection('benefits');
  const typesSec = getSection('partner_types');
  const processSec = getSection('process');
  const formSec = getSection('form_section');

  return (
    <div className="partner-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Hero Section */}
      {isSectionActive('hero') && (
        <InnerPageHero 
          page="become-a-partner" 
          title={heroSec?.content?.heading} 
          subtitle={heroSec?.content?.subheading} 
        />
      )}

      {/* Partnership Intro Banner */}
      {isSectionActive('intro') && introSec?.content?.description && (
        <section className="partner-intro-strip container text-center" style={{ padding: '40px 20px 0' }}>
          <SectionIllustrationSlot page="BecomePartner" section="Intro" defaultIllustration="botanical-shield" defaultPosition="center-left" defaultOpacity={8} />
          {introSec.content.badge && <span className="subtitle">{introSec.content.badge}</span>}
          {introSec.content.heading && <h2 style={{ fontSize: '1.8rem', color: '#173B2F', margin: '8px 0 16px' }}>{introSec.content.heading}</h2>}
          <p style={{ maxWidth: '780px', margin: '0 auto', fontSize: '1rem', color: '#556B5C', lineHeight: 1.6 }}>
            {introSec.content.description}
          </p>
        </section>
      )}

      {/* Why Partner With Us */}
      {isSectionActive('benefits') && (
        <section className="why-partner-section container section-padding" style={{ position: 'relative' }}>
          <SectionIllustrationSlot page="BecomePartner" section="Benefits" defaultIllustration="harvest-basket" defaultPosition="top-right" defaultOpacity={6} />
          <SectionHeading title={benefitsSec?.content?.heading || "Why Partner With Us?"} alignment="center" />
          
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
              <p>Branding &amp; promotional assistance</p>
            </div>
            <div className="why-partner-card">
              <GraduationCap size={32} />
              <h4>Product Training</h4>
              <p>Knowledge &amp; product insights</p>
            </div>
            <div className="why-partner-card">
              <Storefront size={32} />
              <h4>Retail &amp; Distribution Opportunities</h4>
              <p>Expand your business reach</p>
            </div>
            <div className="why-partner-card">
              <TrendUp size={32} />
              <h4>Long-term Partnership</h4>
              <p>Grow together for a healthier future</p>
            </div>
          </div>
        </section>
      )}

      {/* Who Can Partner */}
      {isSectionActive('partner_types') && (
        <section className="who-can-partner section-padding" style={{ position: 'relative' }}>
          <div className="container">
            <SectionHeading title={typesSec?.content?.heading || "Who Can Partner?"} alignment="center" />
            
            <div className="who-partner-grid">
              <div className="who-partner-card">
                <div className="card-img" style={{ backgroundImage: "url('/images/posters/posters-08.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <h4>Retailers</h4>
              </div>
              <div className="who-partner-card">
                <div className="card-img" style={{ backgroundImage: "url('/images/posters/posters-09.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <h4>Distributors</h4>
              </div>
              <div className="who-partner-card">
                <div className="card-img" style={{ backgroundImage: "url('/images/posters/posters-10.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <h4>Wholesalers</h4>
              </div>
              <div className="who-partner-card">
                <div className="card-img" style={{ backgroundImage: "url('/images/posters/posters-11.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <h4>E-commerce Sellers</h4>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Journey & Form */}
      {(isSectionActive('process') || isSectionActive('form_section')) && (
        <section className="journey-form-section section-padding" style={{ position: 'relative' }}>
          <SectionIllustrationSlot page="BecomePartner" section="Form" defaultIllustration="modern-indian-home" defaultPosition="bottom-right" defaultOpacity={6} />
          <div className="container">
            <div className="journey-form-grid">
              
              {/* Journey Process Steps */}
              {isSectionActive('process') && (
                <div className="journey-side">
                  <div className="journey-header">
                    <span className="section-badge">GROW WITH US</span>
                    <h2>{processSec?.content?.heading || "Our Partner Journey"}</h2>
                    <p className="journey-lead">
                      Partner with India's fastest growing conscious wellness brand. Seamless onboarding and dedicated distributor support.
                    </p>
                  </div>
                  
                  <div className="journey-steps-timeline">
                    <div className="j-step-card">
                      <div className="j-step-number">01</div>
                      <div className="j-icon"><ClipboardText size={26} weight="duotone" /></div>
                      <div className="j-info">
                        <h4>Enquiry &amp; Registration</h4>
                        <p>Fill in your business details and desired distribution channels.</p>
                      </div>
                    </div>
                    <div className="j-step-card">
                      <div className="j-step-number">02</div>
                      <div className="j-icon"><Handshake size={26} weight="duotone" /></div>
                      <div className="j-info">
                        <h4>Discussion &amp; Margin Terms</h4>
                        <p>Our sales team will discuss lucrative margin tiers and retail targets.</p>
                      </div>
                    </div>
                    <div className="j-step-card">
                      <div className="j-step-number">03</div>
                      <div className="j-icon"><CheckCircle size={26} weight="duotone" /></div>
                      <div className="j-info">
                        <h4>Onboarding &amp; Sample Kits</h4>
                        <p>Receive physical sample sets, catalogs, and marketing collateral.</p>
                      </div>
                    </div>
                    <div className="j-step-card">
                      <div className="j-step-number">04</div>
                      <div className="j-icon"><Storefront size={26} weight="duotone" /></div>
                      <div className="j-info">
                        <h4>Launch &amp; Continuous Growth</h4>
                        <p>Start fulfilling orders with regional exclusivity and marketing support.</p>
                      </div>
                    </div>
                  </div>

                  <div className="partner-perks-box">
                    <div className="perk-item">
                      <span className="perk-bullet">✓</span>
                      <span>High profit margins &amp; distributor ROI</span>
                    </div>
                    <div className="perk-item">
                      <span className="perk-bullet">✓</span>
                      <span>Fast dispatch &amp; reliable supply chain</span>
                    </div>
                    <div className="perk-item">
                      <span className="perk-bullet">✓</span>
                      <span>Point-of-sale display stands &amp; marketing kits</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Form */}
              {isSectionActive('form_section') && (
                <div className="form-side">
                  <div className="partner-form-card">
                    <div className="form-header">
                      <span className="form-leaf-icon">🌿</span>
                      <h3>{formSec?.content?.heading || "Register Your Interest"}</h3>
                      <p>{formSec?.content?.subheading || "Fill out the form below and our partnerships team will reach out within 24 hours."}</p>
                    </div>

                    {isSubmitted ? (
                      <div className="partner-success">
                        <div className="success-icon-wrap">
                          <CheckCircle size={56} weight="fill" color="#2F6B43" />
                        </div>
                        <h4>Thank you for your interest!</h4>
                        <p>Our partnership executive will connect with you via phone and WhatsApp within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="partner-form">
                        <div className="form-group">
                          <label>Your Name *</label>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            placeholder="e.g. Anand Mehta"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group flex-1">
                            <label>Business / Firm Name *</label>
                            <input 
                              type="text" 
                              name="businessName" 
                              required 
                              placeholder="e.g. Mehta Traders"
                              value={formData.businessName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group flex-1">
                            <label>City &amp; State *</label>
                            <input 
                              type="text" 
                              name="city" 
                              required 
                              placeholder="e.g. Ahmedabad, Gujarat"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group flex-1">
                            <label>Contact Phone Number *</label>
                            <input 
                              type="tel" 
                              name="phone" 
                              required 
                              placeholder="e.g. +91 98765 43210"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-group flex-1">
                            <label>Email Address *</label>
                            <input 
                              type="email" 
                              name="email" 
                              required 
                              placeholder="e.g. anand@mehtatraders.com"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Business Category *</label>
                          <select 
                            name="businessType" 
                            required 
                            value={formData.businessType}
                            onChange={handleChange}
                          >
                            <option value="">Select Business Model</option>
                            <option value="Retailer">Retailer / Store Owner</option>
                            <option value="Distributor">Distributor / Stockist</option>
                            <option value="Wholesaler">Wholesaler</option>
                            <option value="Ecommerce">E-commerce / Online Seller</option>
                            <option value="Institutional">Institutional / Corporate Buyer</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Message / Additional Information</label>
                          <textarea 
                            name="message" 
                            rows="3" 
                            placeholder="Tell us about your distribution reach, store locations, or experience..."
                            value={formData.message}
                            onChange={handleChange}
                          />
                        </div>

                        <button type="submit" className="partner-submit-btn">
                          {formSec?.content?.primaryCtaText || "SUBMIT PARTNER ENQUIRY"} →
                        </button>

                        {formSec?.content?.whatsappNumber && (
                          <div className="partner-whatsapp-wrapper">
                            <a 
                              href={`https://wa.me/${formSec.content.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Tanush%20Natural,%20I%20am%20interested%20in%20a%20business%20partnership.`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="partner-whatsapp-link"
                            >
                              <WhatsappLogo size={20} weight="fill" /> Quick WhatsApp Business Chat
                            </a>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BecomePartner;
