import React, { useState, useEffect } from 'react';
import { MapPin, Phone, EnvelopeSimple, WhatsappLogo, Headset, Heart, ShieldCheck, Users, CaretDown, CheckCircle } from 'phosphor-react';
import Button from '../components/Button/Button';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { contactSlides } from '../data/heroData';
import { SectionIllustrationSlot, BotanicalWatermark } from '../components/Illustrations/BotanicalIllustrations';
import { api } from '../lib/db';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [settings, setSettings] = useState({
    phone: '+91 94282 31144',
    email: 'hello@tanushnatural.com',
    address: 'Bhavnagar, Gujarat, India',
    whatsapp: '+919428231144'
  });

  const loadSettings = async () => {
    const data = await api.getSiteSettings();
    if (data) setSettings(prev => ({ ...prev, ...data }));
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('site_settings_updated', loadSettings);
    window.addEventListener('cms_data_updated', loadSettings);

    return () => {
      window.removeEventListener('site_settings_updated', loadSettings);
      window.removeEventListener('cms_data_updated', loadSettings);
    };
  }, []);

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
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  return (
    <div className="contact-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <SectionIllustrationSlot page="Contact" section="Main" defaultIllustration="modern-indian-home" defaultPosition="top-right" defaultOpacity={6} />
      {/* Hero Section - 1920x600 pure visual banner */}
      <InnerPageHero page="contact" />

      {/* Form Section */}
      <section className="contact-hero-form" style={{ marginTop: '2rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          
          <div className="contact-form-card">
            <div className="form-header">
              <span className="icon-leaf">🌿</span>
              <h3>Send Us a Message</h3>
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
                    <input 
                      type="text" 
                      name="subject" 
                      placeholder="e.g. Order Inquiry / Bulk Order"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea 
                    name="message" 
                    rows="4" 
                    required 
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" size="large" fullWidth>
                  SEND MESSAGE &rarr;
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Info & Map */}
      <section className="contact-info-map section-padding">
        <div className="container info-map-grid">
          <div className="info-side">
            <SectionHeading title="Get in Touch" subtitle="We'd love to hear from you" alignment="center" />
            
            <div className="info-cards">
              <div className="info-card">
                <div className="icon-wrap"><Phone size={24} color="var(--color-primary)" /></div>
                <h4>Call Us</h4>
                <p className="primary-text">{settings.phone || '+91 94282 31144'}</p>
                <p className="sub-text">Mon - Sat<br/>9:30 AM - 6:30 PM</p>
              </div>
              <div className="info-card">
                <div className="icon-wrap"><WhatsappLogo size={24} color="var(--color-primary)" /></div>
                <h4>WhatsApp</h4>
                <p className="primary-text">{settings.whatsapp || '+91 94282 31144'}</p>
                <p className="sub-text">Chat with us for quick assistance</p>
              </div>
              <div className="info-card">
                <div className="icon-wrap"><EnvelopeSimple size={24} color="var(--color-primary)" /></div>
                <h4>Email Us</h4>
                <p className="primary-text">{settings.email || 'hello@tanushnatural.com'}</p>
                <p className="sub-text">We reply within<br/>24 hours</p>
              </div>
              <div className="info-card">
                <div className="icon-wrap"><MapPin size={24} color="var(--color-primary)" /></div>
                <h4>Our Location</h4>
                <p className="primary-text">{settings.address || 'Bhavnagar, Gujarat, India'}</p>
                <p className="sub-text">Find us easily</p>
              </div>
            </div>
          </div>
          
          <div className="map-side">
            <div className="map-placeholder">
              <div className="map-pin">
                <MapPin size={24} weight="fill" color="var(--color-primary)" />
                <div className="pin-tooltip">
                  <strong>Tanush Natural</strong>
                  <p>{settings.address || 'Bhavnagar, Gujarat, India'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Values */}
      <section className="support-values container section-padding">
        <div className="values-grid">
          <div className="value-item">
            <Headset size={32} weight="light" />
            <div>
              <h4>Fast Response</h4>
              <p>We value your time and respond quickly.</p>
            </div>
          </div>
          <div className="value-item">
            <Heart size={32} weight="light" />
            <div>
              <h4>Customer First</h4>
              <p>Your satisfaction is our top priority.</p>
            </div>
          </div>
          <div className="value-item">
            <ShieldCheck size={32} weight="light" />
            <div>
              <h4>Quality Guaranteed</h4>
              <p>100% natural, tested formulations.</p>
            </div>
          </div>
          <div className="value-item">
            <Users size={32} weight="light" />
            <div>
              <h4>Community Driven</h4>
              <p>Trusted by thousands of Indian homes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section container section-padding">
        <SectionHeading title="Frequently Asked Questions" subtitle="FIND QUICK ANSWERS" alignment="center" />
        
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <CaretDown size={20} className="faq-caret" />
              </div>
              {activeFaq === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
