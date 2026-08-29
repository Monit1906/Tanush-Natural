/**
 * TANUSH NATURAL — CENTRALIZED PAGE-WISE & SECTION-WISE CONFIGURATION ARCHITECTURE
 * Provides unified schema, default presets, and normalization for all public pages.
 */

export const DEFAULT_PAGES_CONFIG = {
  home: {
    id: 'home',
    name: 'Home',
    slug: '/',
    isActive: true,
    seoTitle: 'Tanush Natural — Thoughtful Everyday Natural Living & Mosquito Protection',
    seoDescription: 'Experience pure botanical mosquito protection, natural farming extracts, and mindful living essentials for modern Indian homes.',
    sections: [
      {
        id: 'hero',
        name: 'Hero Slider & Banners',
        type: 'hero',
        order: 0,
        isActive: true,
        content: {
          badge: '100% BOTANICAL & SAFE',
          heading: 'Thoughtful Natural Care for Modern Living',
          subheading: 'Pure botanical extracts, mindful formulations, and chemical-free everyday mosquito protection.',
          primaryCtaText: 'SHOP BESTSELLERS',
          primaryCtaLink: '/shop',
          secondaryCtaText: 'OUR FARM STORY',
          secondaryCtaLink: '/why-tanush'
        },
        media: {
          desktopImage: '/images/hero/hero-1.jpg',
          mobileImage: '/images/hero/hero-1.jpg',
          imagePosition: 'center'
        },
        illustration: {
          id: 'tulsi-sprig',
          position: 'top-right',
          opacity: 12,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'left',
          width: 'full',
          spacing: 'normal',
          bgColor: '#FAF8F5'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'benefits',
        name: 'Trust & Benefits Strip',
        type: 'benefits',
        order: 1,
        isActive: true,
        content: {
          heading: 'Why Families Choose Tanush Natural',
          subheading: 'Carefully crafted with consistency, safety, and botanicals at the core.'
        },
        media: {},
        illustration: {
          id: 'botanical-shield',
          position: 'center-left',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'compact',
          bgColor: '#FFFFFF'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'categories',
        name: 'Shop by Category',
        type: 'categories',
        order: 2,
        isActive: true,
        content: {
          badge: 'CATEGORIES',
          heading: 'Thoughtfully Crafted Collections',
          subheading: 'Formulated with botanical extracts for mindful everyday living'
        },
        media: {},
        illustration: {
          id: 'neem-branch',
          position: 'top-right',
          opacity: 10,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#FAF8F5'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'products',
        name: 'Featured Formulations',
        type: 'products',
        order: 3,
        isActive: true,
        content: {
          badge: 'OUR FORMULATIONS',
          heading: 'Everyday Natural Essentials',
          subheading: 'Effective, gentle, and made with pure botanical ingredients'
        },
        media: {},
        illustration: {
          id: 'citronella-cluster',
          position: 'center-right',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#FFFFFF'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'farming',
        name: 'Natural Farming & Ingredients',
        type: 'farming',
        order: 4,
        isActive: true,
        content: {
          badge: 'NATURAL FARMING',
          heading: 'Grown with Care in Indian Soil',
          subheading: 'We partner with responsible cultivators practicing non-hybrid, chemical-free agriculture.',
          primaryCtaText: 'EXPLORE BOTANICAL PHILOSOPHY',
          primaryCtaLink: '/why-tanush'
        },
        media: {
          desktopImage: '/images/lifestyle/thoughtful-1.jpg',
          imagePosition: 'right'
        },
        illustration: {
          id: 'farmer-in-field',
          position: 'bottom-right',
          opacity: 12,
          scale: 110,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: true
        },
        layout: {
          align: 'left',
          width: 'contained',
          spacing: 'spacious',
          bgColor: '#FAF8F5'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'farm_to_home',
        name: 'Farm to Home Journey',
        type: 'farm_to_home',
        order: 5,
        isActive: true,
        content: {
          badge: 'THE JOURNEY',
          heading: 'From Seed to Your Sanctuary',
          subheading: 'A transparent five-step process preserving herbal vitality.'
        },
        media: {},
        illustration: {
          id: 'harvest-basket',
          position: 'top-left',
          opacity: 8,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#FFFFFF'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'stories',
        name: 'Reels & Stories Video Strip',
        type: 'stories',
        order: 6,
        isActive: true,
        content: {
          badge: 'STORIES & RITUALS',
          heading: 'Moments of Natural Living',
          subheading: 'Watch everyday routines, botanical harvesting, and tips from our community'
        },
        media: {},
        illustration: {
          id: 'lemongrass-stalk',
          position: 'top-right',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#FAF8F5'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'testimonials',
        name: 'Verified Testimonials',
        type: 'testimonials',
        order: 7,
        isActive: true,
        content: {
          badge: 'COMMUNITY LOVE',
          heading: 'Trusted by Indian Families',
          subheading: 'Real reviews from households who made the shift to natural living'
        },
        media: {},
        illustration: {
          id: 'tulsi-sprig',
          position: 'center-left',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#FFFFFF'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'community',
        name: 'Social & Brand Wall',
        type: 'community',
        order: 8,
        isActive: true,
        content: {
          badge: 'OUR COMMUNITY',
          heading: 'Join the Tanush Family',
          subheading: 'Share your everyday rituals with #TanushNatural'
        },
        media: {},
        illustration: {
          id: 'modern-indian-home',
          position: 'bottom-right',
          opacity: 8,
          scale: 95,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'center',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#FAF8F5'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'partner',
        name: 'Partnership Banner',
        type: 'partner',
        order: 9,
        isActive: true,
        content: {
          badge: 'PARTNERSHIP',
          heading: 'Grow With Tanush Natural',
          subheading: 'Collaborate with us as a retailer, distributor, or wellness partner across India.',
          primaryCtaText: 'BECOME A PARTNER →',
          primaryCtaLink: '/become-a-partner'
        },
        media: {
          desktopImage: '/images/lifestyle/thoughtful-4.jpg'
        },
        illustration: {
          id: 'harvest-basket',
          position: 'top-right',
          opacity: 10,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: {
          align: 'left',
          width: 'contained',
          spacing: 'normal',
          bgColor: '#173B2F'
        },
        visibility: { desktop: true, tablet: true, mobile: true }
      }
    ]
  },

  shop: {
    id: 'shop',
    name: 'Shop',
    slug: '/shop',
    isActive: true,
    seoTitle: 'Shop Botanical Formulations — Tanush Natural',
    seoDescription: 'Explore our complete range of natural mosquito vaporizers, repellent sprays, and herbal care essentials.',
    sections: [
      {
        id: 'hero',
        name: 'Shop Hero Banner',
        type: 'shop_hero',
        order: 0,
        isActive: true,
        content: {
          badge: 'OUR COLLECTION',
          heading: 'Mindful Formulations for Everyday Life',
          subheading: 'Thoughtfully created using botanical extracts, time-tested wisdom, and modern research.'
        },
        media: {
          desktopImage: '/images/hero/hero-1.jpg'
        },
        illustration: {
          id: 'botanical-shield',
          position: 'top-right',
          opacity: 10,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'full', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'category_bar',
        name: 'Category Navigation Strip',
        type: 'category_bar',
        order: 1,
        isActive: true,
        content: {
          heading: 'Filter by Category'
        },
        media: {},
        illustration: {},
        layout: { align: 'center', width: 'contained', spacing: 'compact', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'product_grid',
        name: 'Product Catalog Grid & Filters',
        type: 'product_grid',
        order: 2,
        isActive: true,
        content: {
          heading: 'All Products'
        },
        media: {},
        illustration: {
          id: 'tulsi-sprig',
          position: 'bottom-right',
          opacity: 6,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'left', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'promotional',
        name: 'Botanical Quality Guarantee',
        type: 'promotional',
        order: 3,
        isActive: true,
        content: {
          badge: 'OUR PROMISE',
          heading: '100% Plant Actives. Zero Harsh Synthetics.',
          subheading: 'Every batch is crafted in India with rigorous safety testing.',
          primaryCtaText: 'READ OUR PROMISE',
          primaryCtaLink: '/why-tanush'
        },
        media: {},
        illustration: {
          id: 'made-in-india-insignia',
          position: 'center-right',
          opacity: 12,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      }
    ]
  },

  'why-tanush': {
    id: 'why-tanush',
    name: 'Why Tanush',
    slug: '/why-tanush',
    isActive: true,
    seoTitle: 'Why Tanush — Our Story, Natural Farming & Botanical Heritage',
    seoDescription: 'Learn about our farming heritage, chemical-free extraction process, and mission to deliver pure everyday essentials.',
    sections: [
      {
        id: 'hero',
        name: 'Why Tanush Hero',
        type: 'why_hero',
        order: 0,
        isActive: true,
        content: {
          badge: 'WHY TANUSH',
          heading: 'Thoughtful by Nature. Made for You.',
          subheading: 'We look to Indian botanical wisdom for clean everyday solutions.'
        },
        media: {
          desktopImage: '/images/hero/hero-1.jpg'
        },
        illustration: {
          id: 'neem-branch',
          position: 'top-right',
          opacity: 10,
          scale: 110,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'full', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'benefits',
        name: 'Core Pillars Strip',
        type: 'why_benefits',
        order: 1,
        isActive: true,
        content: {
          heading: 'Our Five Guiding Pillars'
        },
        media: {},
        illustration: {},
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'thoughtful',
        name: 'Thoughtful by Nature Grid',
        type: 'thoughtful_grid',
        order: 2,
        isActive: true,
        content: {
          badge: 'PHILOSOPHY',
          heading: 'Thoughtful by Nature. Made for You.',
          subheading: 'Mindful sourcing, modern research, and uncompromising safety checks.'
        },
        media: {},
        illustration: {
          id: 'tulsi-sprig',
          position: 'bottom-left',
          opacity: 6,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'farm_journey',
        name: 'Farm-to-Home Storytelling Path',
        type: 'farm_to_home',
        order: 3,
        isActive: true,
        content: {
          badge: 'OUR PROCESS',
          heading: 'From Seed to Sanctuary'
        },
        media: {},
        illustration: {
          id: 'roots-and-soil',
          position: 'top-right',
          opacity: 8,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'story',
        name: 'Our Story & Brand Origins',
        type: 'our_story',
        order: 4,
        isActive: true,
        content: {
          badge: 'OUR STORY',
          heading: 'A Simple Thought That Started Tanush',
          description: 'We noticed how everyday households were looking for products that are effective, safe, and inspired by nature without harsh chemicals. That is when Tanush Natural was born.',
          primaryCtaText: 'EXPLORE OUR PRODUCTS →',
          primaryCtaLink: '/shop'
        },
        media: {
          desktopImage: '/images/lifestyle/collage-main.jpg'
        },
        illustration: {
          id: 'farmer-in-field',
          position: 'bottom-right',
          opacity: 8,
          scale: 110,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'left', width: 'contained', spacing: 'spacious', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'timeline_numbers',
        name: 'Milestones & Tanush in Numbers',
        type: 'timeline_numbers',
        order: 5,
        isActive: true,
        content: {
          badge: 'OUR JOURNEY',
          heading: 'Growing With Indian Families'
        },
        media: {},
        illustration: {
          id: 'made-in-india-insignia',
          position: 'bottom-right',
          opacity: 10,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      }
    ]
  },

  'become-a-partner': {
    id: 'become-a-partner',
    name: 'Become a Partner',
    slug: '/become-a-partner',
    isActive: true,
    seoTitle: 'Partner With Tanush Natural — Distribution, Retail & Supply',
    seoDescription: 'Join our expanding network of authorized retailers, distributors, and bulk partners across India.',
    sections: [
      {
        id: 'hero',
        name: 'Partner Hero Banner',
        type: 'partner_hero',
        order: 0,
        isActive: true,
        content: {
          badge: 'PARTNER PROGRAM',
          heading: 'Grow Your Business With Tanush Natural',
          subheading: 'Join India’s rapidly growing botanical wellness and everyday essentials network.'
        },
        media: {
          desktopImage: '/images/hero/hero-1.jpg'
        },
        illustration: {
          id: 'harvest-basket',
          position: 'top-right',
          opacity: 10,
          scale: 110,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'full', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'intro',
        name: 'Partnership Value & Intro',
        type: 'partner_intro',
        order: 1,
        isActive: true,
        content: {
          badge: 'COLLABORATION',
          heading: 'A Win-Win Partnership',
          description: 'We believe in shared growth. As a Tanush Natural partner, you gain access to premium botanical formulations, dedicated account management, and aggressive marketing support.'
        },
        media: {},
        illustration: {
          id: 'botanical-shield',
          position: 'center-left',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'benefits',
        name: 'Why Partner With Us (6 Benefits)',
        type: 'partner_benefits',
        order: 2,
        isActive: true,
        content: {
          heading: 'Why Partner With Us?'
        },
        media: {},
        illustration: {},
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'partner_types',
        name: 'Who Can Partner Cards',
        type: 'partner_types',
        order: 3,
        isActive: true,
        content: {
          heading: 'Who Can Partner?'
        },
        media: {},
        illustration: {
          id: 'harvest-basket',
          position: 'top-right',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'process',
        name: 'Partner Journey (4 Steps)',
        type: 'partner_process',
        order: 4,
        isActive: true,
        content: {
          heading: 'Our Partner Journey'
        },
        media: {},
        illustration: {},
        layout: { align: 'left', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'form_section',
        name: 'Partner Application Form',
        type: 'partner_form',
        order: 5,
        isActive: true,
        content: {
          heading: 'Register Your Interest',
          subheading: 'Fill out the form below and our partnerships team will reach out within 24 hours.',
          primaryCtaText: 'SUBMIT PARTNER ENQUIRY',
          whatsappNumber: '+919428231144'
        },
        media: {},
        illustration: {
          id: 'modern-indian-home',
          position: 'bottom-right',
          opacity: 8,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      }
    ]
  },

  contact: {
    id: 'contact',
    name: 'Contact Us',
    slug: '/contact',
    isActive: true,
    seoTitle: 'Contact Us — Tanush Natural Customer Care & Head Office',
    seoDescription: 'Get in touch with Tanush Natural. Customer support, order queries, and business enquiries.',
    sections: [
      {
        id: 'hero',
        name: 'Contact Hero Banner',
        type: 'contact_hero',
        order: 0,
        isActive: true,
        content: {
          badge: 'GET IN TOUCH',
          heading: 'We’d Love to Hear from You',
          subheading: 'Whether you have a query about formulations, orders, or partnerships, we are here for you.'
        },
        media: {
          desktopImage: '/images/hero/hero-1.jpg'
        },
        illustration: {
          id: 'modern-indian-home',
          position: 'top-right',
          opacity: 10,
          scale: 100,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'full', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'form_section',
        name: 'Send Us a Message Form',
        type: 'contact_form',
        order: 1,
        isActive: true,
        content: {
          heading: 'Send Us a Message',
          subheading: 'We typically respond within 24 business hours.',
          primaryCtaText: 'SEND MESSAGE'
        },
        media: {},
        illustration: {
          id: 'tulsi-sprig',
          position: 'bottom-left',
          opacity: 6,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'info_cards',
        name: 'Contact Info & Channels',
        type: 'contact_info_cards',
        order: 2,
        isActive: true,
        content: {
          heading: 'Contact Information',
          phone: '+91 94282 31144',
          email: 'hello@tanushnatural.com',
          address: 'Bhavnagar, Gujarat, India',
          businessHours: 'Monday - Saturday: 9:00 AM – 6:00 PM IST',
          whatsapp: '+919428231144'
        },
        media: {},
        illustration: {
          id: 'botanical-shield',
          position: 'center-right',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'faq',
        name: 'Frequently Asked Questions',
        type: 'contact_faq',
        order: 3,
        isActive: true,
        content: {
          heading: 'Frequently Asked Questions'
        },
        media: {},
        illustration: {},
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      }
    ]
  },

  'product-detail': {
    id: 'product-detail',
    name: 'Product Detail',
    slug: '/product/:slug',
    isActive: true,
    seoTitle: 'Product Details — Tanush Natural',
    seoDescription: 'Thoughtfully formulated using pure herbal and botanical extracts.',
    sections: [
      {
        id: 'gallery_info',
        name: 'Product Gallery & Purchase Info',
        type: 'product_main',
        order: 0,
        isActive: true,
        content: {},
        media: {},
        illustration: {
          id: 'botanical-shield',
          position: 'top-right',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'left', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'tabs',
        name: 'Product Details & Ingredients Tabs',
        type: 'product_tabs',
        order: 1,
        isActive: true,
        content: {},
        media: {},
        illustration: {},
        layout: { align: 'left', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'usage_flow',
        name: 'Visual Usage Flow Guide',
        type: 'product_usage',
        order: 2,
        isActive: true,
        content: {},
        media: {},
        illustration: {
          id: 'tulsi-sprig',
          position: 'center-right',
          opacity: 8,
          scale: 90,
          rotation: 0,
          desktopVisible: true,
          mobileVisible: false
        },
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FFFFFF' },
        visibility: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: 'related',
        name: 'Complete Your Ritual (Related Products)',
        type: 'product_related',
        order: 3,
        isActive: true,
        content: {
          badge: 'COMPLETE YOUR RITUAL',
          heading: 'You May Also Like'
        },
        media: {},
        illustration: {},
        layout: { align: 'center', width: 'contained', spacing: 'normal', bgColor: '#FAF8F5' },
        visibility: { desktop: true, tablet: true, mobile: true }
      }
    ]
  }
};

/**
 * Normalizes a page configuration object with default fallbacks
 */
export function normalizePageConfig(pageId, rawConfig) {
  const fallback = DEFAULT_PAGES_CONFIG[pageId] || {
    id: pageId,
    name: pageId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slug: `/${pageId}`,
    isActive: true,
    seoTitle: `${pageId} — Tanush Natural`,
    seoDescription: '',
    sections: []
  };

  if (!rawConfig) return fallback;

  return {
    ...fallback,
    ...rawConfig,
    id: pageId,
    name: rawConfig.name || fallback.name,
    slug: rawConfig.slug || fallback.slug,
    isActive: rawConfig.isActive !== false,
    seoTitle: rawConfig.seoTitle || fallback.seoTitle,
    seoDescription: rawConfig.seoDescription || fallback.seoDescription,
    sections: Array.isArray(rawConfig.sections) && rawConfig.sections.length > 0
      ? rawConfig.sections.map((sec, idx) => ({
          ...sec,
          order: typeof sec.order === 'number' ? sec.order : idx,
          isActive: sec.isActive !== false,
          content: { ...(sec.content || {}) },
          media: { ...(sec.media || {}) },
          illustration: { ...(sec.illustration || {}) },
          layout: { ...(sec.layout || {}) },
          visibility: { desktop: true, tablet: true, mobile: true, ...(sec.visibility || {}) }
        })).sort((a, b) => (a.order || 0) - (b.order || 0))
      : fallback.sections
  };
}
