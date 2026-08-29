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
      )}

      {/* Journey & Form */}
      {(isSectionActive('process') || isSectionActive('form_section')) && (
        <section className="journey-form-section container section-padding" style={{ position: 'relative' }}>
          <SectionIllustrationSlot page="BecomePartner" section="Form" defaultIllustration="modern-indian-home" defaultPosition="bottom-right" defaultOpacity={6} />
          <div className="journey-form-grid">
            
            {/* Journey Process Steps */}
            {isSectionActive('process') && (
              <div className="journey-side">
                <SectionHeading title={processSec?.content?.heading || "Our Partner Journey"} alignment="left" />
                
                <div className="journey-steps">
                  <div className="j-step">
                    <div className="j-icon"><ClipboardText size={32} /></div>
                    <div className="j-info">
                      <h4>1. Enquiry &amp; Registration</h4>
                      <p>Fill in your basic details and interest in partnering with us.</p>
                    </div>
                  </div>
                  <div className="j-step">
                    <div className="j-icon"><Handshake size={32} /></div>
                    <div className="j-info">
                      <h4>2. Discussion &amp; Proposal</h4>
                      <p>Our team discusses terms, margin structures, and opportunities.</p>
                    </div>
                  </div>
                  <div className="j-step">
                    <div className="j-icon"><CheckCircle size={32} /></div>
                    <div className="j-info">
                      <h4>3. Onboarding &amp; Samples</h4>
                      <p>Product catalog, initial sample sets, and business onboarding.</p>
                    </div>
                  </div>
                  <div className="j-step">
                    <div className="j-icon"><Storefront size={32} /></div>
                    <div className="j-info">
                      <h4>4. Launch &amp; Grow</h4>
                      <p>Begin distribution and retail sales with continuous marketing support.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Form */}
            {isSectionActive('form_section') && (
              <div className="form-side">
                <div className="partner-form-card glass-panel">
                  <div className="form-header">
                    <h3>{formSec?.content?.heading || "Partner Registration"}</h3>
                    <p>{formSec?.content?.subheading || "Let's connect and build a rewarding business together."}</p>
                  </div>

                  {isSubmitted ? (
                    <div className="partner-success">
                      <CheckCircle size={48} color="#2F6B43" />
                      <h4>Thank you for your interest!</h4>
                      <p>Our partnership desk will contact you within 24 hours.</p>
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

                      <Button variant="primary" type="submit" className="w-full">
                        {formSec?.content?.primaryCtaText || "SUBMIT PARTNERSHIP ENQUIRY →"}
                      </Button>

                      {formSec?.content?.whatsappNumber && (
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                          <a 
                            href={`https://wa.me/${formSec.content.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Tanush%20Natural,%20I%20am%20interested%20in%20a%20business%20partnership.`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 600, fontSize: '0.86rem', textDecoration: 'none' }}
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
        </section>
      )}
    </div>
  );
};

export default BecomePartner;
