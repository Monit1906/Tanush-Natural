import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import './AnnouncementMarquee.css';

const defaultMessages = [
  "🌿 Nature-inspired products for everyday living",
  "🚚 Free Shipping on orders above ₹499",
  "🌿 Thoughtfully made for modern Indian homes",
  "🛍️ Explore the Tanush Natural Collection",
  "🤝 Become a Tanush Natural Partner"
];

const AnnouncementMarquee = () => {
  const [messages, setMessages] = useState(defaultMessages);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await api.getSiteSettings();
      if (settings) {
        if (settings.announcement_enabled === false) {
          setEnabled(false);
        } else {
          setEnabled(true);
        }
        if (settings.announcement_text) {
          setMessages([
            `✨ ${settings.announcement_text}`,
            "🌿 Nature-inspired products for everyday living",
            "🚚 Free Shipping on orders above ₹499",
            "🛍️ Explore the Tanush Natural Collection"
          ]);
        }
      }
    };
    loadSettings();

    const handleSettingsUpdate = (e) => {
      if (e.detail) {
        if (e.detail.announcement_enabled === false) {
          setEnabled(false);
        } else {
          setEnabled(true);
        }
        if (e.detail.announcement_text) {
          setMessages([
            `✨ ${e.detail.announcement_text}`,
            "🌿 Nature-inspired products for everyday living",
            "🚚 Free Shipping on orders above ₹499",
            "🛍️ Explore the Tanush Natural Collection"
          ]);
        }
      }
    };
    window.addEventListener('site_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('site_settings_updated', handleSettingsUpdate);
  }, []);

  if (!enabled) return null;

  // Two complete message passes per set ensures seamless infinite scrolling across 4K displays
  const fullList = [...messages, ...messages];

  return (
    <div className="announcement-marquee-container">
      <div className="announcement-marquee-track">
        <div className="marquee-content-set">
          {fullList.map((msg, idx) => (
            <React.Fragment key={`set1-${idx}`}>
              <span className="marquee-msg">{msg}</span>
              <span className="marquee-separator">✦</span>
            </React.Fragment>
          ))}
        </div>
        <div className="marquee-content-set" aria-hidden="true">
          {fullList.map((msg, idx) => (
            <React.Fragment key={`set2-${idx}`}>
              <span className="marquee-msg">{msg}</span>
              <span className="marquee-separator">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
