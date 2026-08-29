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
        <section className="contact-hero-form" style={{ marginTop: '2rem', position: 'relative' }}>
          <SectionIllustrationSlot page="Contact" section="Form" defaultIllustration="tulsi-sprig" defaultPosition="bottom-left" defaultOpacity={5} />
          <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            
            <div className="contact-form-card">
              <div className="form-header">
                <span className="icon-leaf">🌿</span>
                <h3>{formSec?.content?.heading || "Send Us a Message"}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7C73' }}>
                  {formSec?.content?.subheading || "We typically respond within 24 business hours."}
                </p>
              </div>
              
              {isSubmitted ? (
                <div className="success-state">
                  <CheckCircle size={48} color="var(--color-primary)" />
                  <h4>Message Sent!</h4>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="e.g. +91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
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

                  <Button variant="primary" type="submit" className="w-full">
                    {formSec?.content?.primaryCtaText || "SEND MESSAGE →"}
                  </Button>
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
            <SectionHeading 
              subtitle="DIRECT CHANNELS" 
              title={infoSec?.content?.heading || "Other Ways to Reach Us"} 
              alignment="center" 
            />
            
            <div className="contact-cards-grid">
              
              {/* Phone */}
              <div className="contact-info-card">
                <div className="card-icon"><Phone size={28} /></div>
                <h4>Call Us</h4>
                <p className="info-main"><a href={`tel:${displayPhone}`}>{displayPhone}</a></p>
                <p className="info-sub">{displayHours}</p>
              </div>

              {/* Email */}
              <div className="contact-info-card">
                <div className="card-icon"><EnvelopeSimple size={28} /></div>
                <h4>Email Us</h4>
                <p className="info-main"><a href={`mailto:${displayEmail}`}>{displayEmail}</a></p>
                <p className="info-sub">We reply within 24 hours</p>
              </div>

              {/* WhatsApp */}
              <div className="contact-info-card">
                <div className="card-icon"><WhatsappLogo size={28} /></div>
                <h4>WhatsApp</h4>
                <p className="info-main"><a href={`https://wa.me/${displayWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>
                <p className="info-sub">Instant quick answers</p>
              </div>

              {/* Location */}
              <div className="contact-info-card">
                <div className="card-icon"><MapPin size={28} /></div>
                <h4>Location</h4>
                <p className="info-main">{displayAddress}</p>
                <p className="info-sub">Headquarters &amp; Operations</p>
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
