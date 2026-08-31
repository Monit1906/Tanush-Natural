import React from 'react';
import './ShopJourney.css';

// Built-in Minimal Botanical Line Art Icons
const BotanicalSourceIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="journey-icon-svg" aria-hidden="true">
    {/* Delicate Seed Base */}
    <ellipse cx="24" cy="38" rx="5" ry="3" stroke="#2F6B43" strokeWidth="1.6" strokeLinecap="round" />
    {/* Organic Stem */}
    <path d="M24 35C24 28 22 21 24 13" stroke="#173B2F" strokeWidth="1.8" strokeLinecap="round" />
    {/* Left Botanical Leaf */}
    <path d="M23 25C17 24 13 18 16 14C20 13 23 18 23 25Z" fill="rgba(47, 107, 67, 0.08)" stroke="#2F6B43" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 14C19 18 21 21 23 25" stroke="#2F6B43" strokeWidth="1.2" strokeLinecap="round" />
    {/* Right Botanical Leaf */}
    <path d="M24 19C29 17 34 20 32 25C27 26 24 22 24 19Z" fill="rgba(47, 107, 67, 0.08)" stroke="#2F6B43" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 25C29 23 26 21 24 19" stroke="#2F6B43" strokeWidth="1.2" strokeLinecap="round" />
    {/* Tender Top Shoot */}
    <path d="M24 13C23 10 21 8 19 8C20 11 22 12 24 13Z" fill="rgba(47, 107, 67, 0.12)" stroke="#173B2F" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const BotanicalCraftIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="journey-icon-svg" aria-hidden="true">
    {/* Apothecary Dropper Vessel Body */}
    <rect x="16" y="20" width="16" height="20" rx="3.5" stroke="#173B2F" strokeWidth="1.7" fill="rgba(47, 107, 67, 0.05)" />
    {/* Bottle Neck & Rim */}
    <path d="M20 20V15H28V20" stroke="#173B2F" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="18" y1="15" x2="30" y2="15" stroke="#2F6B43" strokeWidth="1.6" strokeLinecap="round" />
    {/* Dropper Pipette Bulb */}
    <path d="M22 15V10C22 8.5 23 7 24 7C25 7 26 8.5 26 10V15" stroke="#2F6B43" strokeWidth="1.5" strokeLinecap="round" />
    {/* Natural Herbal Leaf Accompanying Bottle */}
    <path d="M30 29C36 27 40 31 38 36C33 37 30 33 30 29Z" fill="rgba(47, 107, 67, 0.1)" stroke="#2F6B43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Liquid Line */}
    <path d="M19 33C21 34 27 34 29 33" stroke="#2F6B43" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.5 2" />
  </svg>
);

const BotanicalQualityIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="journey-icon-svg" aria-hidden="true">
    {/* Botanical Quality Seal Ring */}
    <circle cx="24" cy="24" r="16" stroke="#2F6B43" strokeWidth="1.4" strokeDasharray="3.5 2.5" />
    <circle cx="24" cy="24" r="13" stroke="#173B2F" strokeWidth="1.5" fill="rgba(47, 107, 67, 0.06)" />
    {/* Refined Minimal Quality Checkmark */}
    <path d="M18 24.5L22 28.5L30 19.5" stroke="#173B2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Small Surrounding Botanical Leaf Accents */}
    <path d="M24 5C25 7 27 7 27 5C26 4 25 4 24 5Z" fill="#2F6B43" />
    <path d="M24 43C23 41 21 41 21 43C22 44 23 44 24 43Z" fill="#2F6B43" />
  </svg>
);

const BotanicalHomeIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="journey-icon-svg" aria-hidden="true">
    {/* Contemporary Indian Home Silhouette */}
    <path d="M14 23L24 14L34 23V37C34 38.1 33.1 39 32 39H16C14.9 39 14 38.1 14 37V23Z" stroke="#173B2F" strokeWidth="1.7" fill="rgba(47, 107, 67, 0.05)" strokeLinejoin="round" />
    {/* Soft Minimal Arch Doorway */}
    <path d="M21 39V30C21 28.3 22.3 27 24 27C25.7 27 27 28.3 27 30V39" stroke="#2F6B43" strokeWidth="1.5" strokeLinecap="round" />
    {/* Subtle Botanical Frond Wrapping Left */}
    <path d="M10 35C11 29 15 26 14 22" stroke="#2F6B43" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M13 25C9 24 8 21 11 19C13 20 14 23 13 25Z" fill="rgba(47, 107, 67, 0.1)" stroke="#2F6B43" strokeWidth="1.3" strokeLinejoin="round" />
    {/* Subtle Leaf Right */}
    <path d="M35 28C39 27 40 24 37 23C35 24 34 26 35 28Z" fill="rgba(47, 107, 67, 0.1)" stroke="#2F6B43" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const DEFAULT_STEPS = [
  {
    id: 'step-1',
    number: '01',
    label: '01 — SOURCE',
    title: 'Inspired by Nature',
    description: 'Botanical ingredients and natural inspiration selected with care.',
    iconType: 'source',
    enabled: true
  },
  {
    id: 'step-2',
    number: '02',
    label: '02 — CRAFT',
    title: 'Thoughtfully Formulated',
    description: 'Carefully crafted in India for everyday living.',
    iconType: 'craft',
    enabled: true
  },
  {
    id: 'step-3',
    number: '03',
    label: '03 — QUALITY',
    title: 'Made With Care',
    description: 'Every formulation is created with attention to detail.',
    iconType: 'quality',
    enabled: true
  },
  {
    id: 'step-4',
    number: '04',
    label: '04 — HOME',
    title: 'Made for Everyday Living',
    description: 'Thoughtfully made for modern Indian homes.',
    iconType: 'home',
    enabled: true
  }
];

const renderDefaultIcon = (type) => {
  switch (type) {
    case 'source':
    case 'sprout':
    case 'leaf':
      return <BotanicalSourceIcon />;
    case 'craft':
    case 'formulation':
    case 'bottle':
      return <BotanicalCraftIcon />;
    case 'quality':
    case 'seal':
    case 'check':
      return <BotanicalQualityIcon />;
    case 'home':
    case 'living':
    case 'house':
      return <BotanicalHomeIcon />;
    default:
      return <BotanicalSourceIcon />;
  }
};

const ShopJourney = ({ config }) => {
  const isEnabled = config?.isActive !== false && config?.enabled !== false;
  if (!isEnabled) return null;

  const content = config?.content || {};
  const eyebrow = content.eyebrow || content.badge || 'THE TANUSH JOURNEY';
  const heading = content.heading || content.title || 'FROM NATURE TO YOUR HOME';
  const subheading = content.subheading || content.subtitle || 'Thoughtfully made, from natural inspiration to everyday living.';
  const bgColor = config?.layout?.bgColor || '#FAF8F5';

  const rawSteps = Array.isArray(config?.steps) && config.steps.length > 0
    ? config.steps
    : DEFAULT_STEPS;

  const steps = rawSteps.filter(s => s.enabled !== false && s.isActive !== false);
  if (steps.length === 0) return null;

  return (
    <section 
      className="shop-journey-section container"
      style={{ backgroundColor: bgColor }}
      aria-label="From Nature to Your Home Journey"
    >
      {/* Editorial Header */}
      <div className="journey-header-block">
        {eyebrow && <span className="journey-eyebrow">{eyebrow}</span>}
        <h2 className="journey-heading">{heading}</h2>
        {subheading && <p className="journey-subheading">{subheading}</p>}
      </div>

      {/* Main Continuous Journey Track */}
      <div className="journey-track-wrapper">
        {/* Continuous Botanical Connecting Stem (Desktop) */}
        <div className="journey-botanical-stem-line" aria-hidden="true">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="stem-svg-line">
            {/* Organic Path spanning full width */}
            <path 
              d="M 60 30 Q 200 24, 340 32 T 620 28 T 940 30" 
              fill="none" 
              stroke="rgba(47, 107, 67, 0.28)" 
              strokeWidth="1.6" 
              strokeDasharray="4 3" 
            />
            {/* Delicate Leaves along the stem */}
            <path d="M 200 26 C 206 20 214 22 212 28 C 207 29 202 28 200 26 Z" fill="rgba(47, 107, 67, 0.35)" />
            <path d="M 480 30 C 488 36 496 34 494 28 C 489 27 483 28 480 30 Z" fill="rgba(47, 107, 67, 0.35)" />
            <path d="M 780 27 C 786 21 794 23 792 29 C 787 30 782 29 780 27 Z" fill="rgba(47, 107, 67, 0.35)" />
          </svg>
        </div>

        {/* 4 Storytelling Steps */}
        <div className="journey-steps-grid">
          {steps.map((step, index) => {
            const stepNumber = step.number || `0${index + 1}`;
            const stepLabel = step.label || `${stepNumber} — ${(step.title || '').split(' ')[0].toUpperCase()}`;
            const stepTitle = step.title || `Step ${stepNumber}`;
            const stepDesc = step.description || '';
            const customImg = step.customIllustration || step.illustrationImage || (step.illustration && step.illustration.startsWith('http') ? step.illustration : null);
            const iconType = step.illustration || step.iconType || DEFAULT_STEPS[index % 4]?.iconType;
            const opacity = typeof step.opacity === 'number' ? step.opacity / 100 : 1;
            const scaleClass = step.scale === 'small' ? 'scale-sm' : step.scale === 'large' ? 'scale-lg' : 'scale-md';
            const alignClass = `align-${step.position || 'center'}`;

            return (
              <div 
                key={step.id || `step-${index}`} 
                className={`journey-step-item ${alignClass} ${step.desktopVisible === false ? 'hide-desktop' : ''} ${step.mobileVisible === false ? 'hide-mobile' : ''}`}
              >
                {/* Botanical Step Node / Icon */}
                <div 
                  className={`journey-step-node ${scaleClass}`}
                  style={{ opacity }}
                >
                  <div className="journey-icon-capsule">
                    {customImg ? (
                      <img 
                        src={customImg} 
                        alt={stepTitle} 
                        className="journey-custom-illustration"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      renderDefaultIcon(iconType)
                    )}
                  </div>
                </div>

                {/* Typography Block */}
                <div className="journey-step-text">
                  <span className="journey-step-number-label">{stepLabel}</span>
                  <h3 className="journey-step-title">{stepTitle}</h3>
                  {stepDesc && <p className="journey-step-desc">{stepDesc}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopJourney;
