import React, { useState, useEffect } from 'react';
import { MapPin, Phone, EnvelopeSimple, WhatsappLogo, Headset, Heart, ShieldCheck, Users, CaretDown, CheckCircle } from 'phosphor-react';
import Button from '../components/Button/Button';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { SectionIllustrationSlot, BotanicalWatermark } from '../components/Illustrations/BotanicalIllustrations';
import { api } from '../lib/db';
import './Contact.css';

const Contact = () => {
  const [pageConfig, setPageConfig] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [settings, setSettings] = useState({
    phone: '+91 94282 31144',
    email: 'hello@tanushnatural.com',
    address: 'Bhavnagar, Gujarat, India',
    businessHours: 'Monday - Saturday: 9:00 AM – 6:00 PM IST',
    whatsapp: '+919428231144'
  });

  const loadData = async () => {
    try {
      const [siteData, configData] = await Promise.all([
        api.getSiteSettings(),
        api.getPageConfig('contact')
      ]);
      if (siteData) setSettings(prev => ({ ...prev, ...siteData }));
      if (configData) setPageConfig(configData);
    } catch (e) {
      console.warn('Failed loading contact page config:', e);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();

    window.addEventListener('page_sections_updated', handleSync);
    window.addEventListener('site_settings_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('page_sections_updated', handleSync);
      window.removeEventListener('site_settings_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, []);

  const sections = pageConfig?.sections || [];
  const getSection = (id) => sections.find(s => s.id === id);
  const isSectionActive = (id) => {
    const sec = getSection(id);
    return sec ? sec.isActive !== false : true;
  };

  const heroSec = getSection('hero');
  const formSec = getSection('form_section');
  const infoSec = getSection('info_cards');
  const faqSec = getSection('faq');

  const displayPhone = infoSec?.content?.phone || settings.phone;
  const displayEmail = infoSec?.content?.email || settings.email;
  const displayAddress = infoSec?.content?.address || settings.address;
  const displayHours = infoSec?.content?.businessHours || settings.businessHours;
  const displayWhatsapp = infoSec?.content?.whatsapp || settings.whatsapp || '+919428231144';

  const faqs = [
    { q: 'How can I place an order?', a: 'You can easily place an order through our website. Simply add your desired products to the cart and proceed to checkout.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and offer Cash on Delivery (COD) for most pin codes.' },
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days depending on your location. Metro cities usually receive orders within 2-3 days.' },
    { q: 'Do you offer returns or refunds?', a: 'Yes, we offer a hassle-free 7-day return policy for unused products in their original packaging. Please check our Returns page for details.' },
    { q: 'Do you ship outside India?', a: 'Currently, we only ship within India. We are working on expanding our delivery network soon.' },
    { q: 'How can I become a partner?', a: 'You can fill out the partner enquiry form on our "Become a Partner" page, and our business team will get in touch with you.' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.saveMessage({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        message: `${formData.subject ? `[${formData.subject}] ` : ''}${formData.message}`,
        status: 'New'
      });
      await api.logAnalyticsEvent({
        type: 'message',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        details: `Subject: ${formData.subject || 'General Enquiry'}`
      });
    } catch (err) {
      console.warn('Failed to log contact message:', err);
    }
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="contact-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <SectionIllustrationSlot page="Contact" section="Main" defaultIllustration="modern-indian-home" defaultPosition="top-right" defaultOpacity={6} />
      
      {/* Hero Section */}
      {isSectionActive('hero') && (
        <InnerPageHero 
          page="contact" 
          title={heroSec?.content?.heading} 
          subtitle={heroSec?.content?.subheading} 
        />
      )}

      {/* Form Section */}
      {isSectionActive('form_section') && (
        <section className="contact-hero-form">
          <div className="contact-form-overlay"></div>
          <SectionIllustrationSlot page="Contact" section="Form" defaultIllustration="tulsi-sprig" defaultPosition="bottom-left" defaultOpacity={8} />
          <div className="container form-container-relative">
            
            <div className="contact-form-card">
              <div className="form-header">
                <div className="leaf-icon-badge">🌿</div>
                <h3>{formSec?.content?.heading || "Send Us a Message"}</h3>
                <p>
                  {formSec?.content?.subheading || "We typically respond within 24 business hours."}
                </p>
              </div>
              
              {isSubmitted ? (
                <div className="success-state">
                  <div className="success-icon-wrap">
                    <CheckCircle size={56} weight="fill" color="#2F6B43" />
                  </div>
                  <h4>Message Sent Successfully!</h4>
                  <p>Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-inner">
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Your Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="e.g. Rahul Sharma" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="e.g. rahul@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="e.g. +91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>Subject</label>
                      <select 
                        name="subject" 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="">Select a topic</option>
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Order Status">Order Status</option>
                        <option value="Partnership / Dealership">Partnership / Dealership</option>
                        <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      required 
                      placeholder="How can we help you today? Please provide as much detail as possible..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    {formSec?.content?.primaryCtaText || "SEND MESSAGE"} →
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      )}

      {/* Contact Info Cards */}
      {isSectionActive('info_cards') && (
        <section className="contact-details-section section-padding" style={{ position: 'relative' }}>
          <SectionIllustrationSlot page="Contact" section="Cards" defaultIllustration="botanical-shield" defaultPosition="center-right" defaultOpacity={6} />
          <div className="container">
            <div className="contact-section-header">
              <span className="contact-section-badge">DIRECT CHANNELS</span>
              <h2>{infoSec?.content?.heading || "Contact Information"}</h2>
              <div className="contact-badge-divider"></div>
            </div>
            
            <div className="contact-cards-grid">
              
              {/* Phone */}
              <div className="contact-info-card">
                <div className="card-icon-wrap">
                  <Phone size={26} weight="duotone" />
                </div>
                <h4>Call Us</h4>
                <p className="info-main">
                  <a href={`tel:${displayPhone}`}>{displayPhone}</a>
                </p>
                <div className="info-sub-pill">{displayHours}</div>
                <a href={`tel:${displayPhone}`} className="card-action-link">
                  Call Now <span>→</span>
                </a>
              </div>

              {/* Email */}
              <div className="contact-info-card">
                <div className="card-icon-wrap">
                  <EnvelopeSimple size={26} weight="duotone" />
                </div>
                <h4>Email Us</h4>
                <p className="info-main">
                  <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
                </p>
                <div className="info-sub-pill">We reply within 24 hours</div>
                <a href={`mailto:${displayEmail}`} className="card-action-link">
                  Send Email <span>→</span>
                </a>
              </div>

              {/* WhatsApp */}
              <div className="contact-info-card highlight-card">
                <div className="card-icon-wrap whatsapp-icon-wrap">
                  <WhatsappLogo size={26} weight="duotone" />
                </div>
                <h4>WhatsApp Support</h4>
                <p className="info-main">
                  <a href={`https://wa.me/${displayWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </p>
                <div className="info-sub-pill whatsapp-pill">Instant Quick Answers</div>
                <a href={`https://wa.me/${displayWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="card-action-link whatsapp-link">
                  Start Chat <span>→</span>
                </a>
              </div>

              {/* Location */}
              <div className="contact-info-card">
                <div className="card-icon-wrap">
                  <MapPin size={26} weight="duotone" />
                </div>
                <h4>Headquarters</h4>
                <p className="info-main">{displayAddress}</p>
                <div className="info-sub-pill">Headquarters &amp; Operations</div>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(displayAddress)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="card-action-link"
                >
                  View on Map <span>→</span>
                </a>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {isSectionActive('faq') && (
        <section className="contact-faq-section section-padding bg-secondary" style={{ position: 'relative' }}>
          <div className="container">
            <SectionHeading 
              subtitle="FREQUENTLY ASKED" 
              title={faqSec?.content?.heading || "Common Questions"} 
              alignment="center" 
            />
            
            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question">
                    <h4>{faq.q}</h4>
                    <CaretDown size={20} className={`faq-caret ${activeFaq === index ? 'rotated' : ''}`} />
                  </div>
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Contact;
