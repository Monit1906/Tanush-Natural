import React from 'react';
import { Leaf, ShieldCheck, Heart, CheckCircle, Lightbulb, TrendUp, Users, Target } from 'phosphor-react';
import SectionHeading from '../components/SectionHeading/SectionHeading';
import Button from '../components/Button/Button';
import InnerPageHero from '../components/InnerPageHero/InnerPageHero';
import { 
  FarmToHomeJourney, 
  BotanicalWatermark, 
  SectionIllustrationSlot, 
  MadeInIndiaInsignia, 
  TulsiSprig,
  AyurvedicMortarPestle,
  FarmerInField,
  NeemBranch
} from '../components/Illustrations/BotanicalIllustrations';
import { whyTanushSlides } from '../data/heroData';
import './WhyTanush.css';

const WhyTanush = () => {
  return (
    <div className="why-tanush-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Subtle Watermark */}
      <BotanicalWatermark illustration="neem-branch" position="top-right" opacity={0.06} size={300} />

      {/* Hero Section - 1920x600 pure visual banner */}
      <InnerPageHero page="why-tanush" />

      {/* Benefits Strip */}
      <section className="why-benefits-strip">
        <div className="container why-benefits-grid">
          <div className="why-benefit-card">
            <div className="icon-wrapper"><Leaf size={32} weight="light" /></div>
            <h4>Nature-Inspired</h4>
            <p>We look to nature for thoughtful ingredients and everyday solutions.</p>
          </div>
          <div className="why-benefit-card">
            <div className="icon-wrapper"><ShieldCheck size={32} weight="light" /></div>
            <h4>Quality You Can Trust</h4>
            <p>Carefully crafted with consistency, safety and quality at the core.</p>
          </div>
          <div className="why-benefit-card">
            <div className="icon-wrapper"><Heart size={32} weight="light" /></div>
            <h4>Made for Everyday Life</h4>
            <p>Practical, effective and designed for real Indian homes and routines.</p>
          </div>
          <div className="why-benefit-card">
            <div className="icon-wrapper"><HeartIcon /></div>
            <h4>Better Choices</h4>
            <p>We choose better ingredients, better practices and a better tomorrow.</p>
          </div>
          <div className="why-benefit-card">
            <div className="icon-wrapper"><IndiaIcon /></div>
            <h4>Proudly Made in India</h4>
            <p>Designed, developed and made for the needs of modern Indian households.</p>
          </div>
        </div>
      </section>

      {/* Thoughtful by Nature */}
      <section className="thoughtful-section container section-padding" style={{ position: 'relative' }}>
        <SectionIllustrationSlot page="WhyTanush" section="Thoughtful" defaultIllustration="tulsi-sprig" defaultPosition="bottom-left" defaultOpacity={6} />
        <div className="section-header text-center">
          <span className="subtitle">WHY TANUSH</span>
          <h2>Thoughtful by Nature. Made for You.</h2>
        </div>
        
        <div className="thoughtful-grid">
          <div className="thoughtful-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/lifestyle/thoughtful-1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <h4>Inspired by Nature</h4>
            <p>We draw inspiration from nature and use ingredients that are mindful and responsibly sourced.</p>
          </div>
          <div className="thoughtful-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/lifestyle/thoughtful-2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <h4>Carefully Crafted</h4>
            <p>Our formulations are developed with care, using modern research and expertise.</p>
          </div>
          <div className="thoughtful-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/lifestyle/thoughtful-3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <h4>Quality Assured</h4>
            <p>Every product goes through rigorous quality checks to ensure safety and consistency.</p>
          </div>
          <div className="thoughtful-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/lifestyle/thoughtful-4.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <h4>Made for Everyday</h4>
            <p>Practical, effective and easy to use products that fit seamlessly into daily life.</p>
          </div>
        </div>
      </section>

      {/* Editorial Farm-to-Home Storytelling Path */}
      <section className="farm-story-section container" style={{ padding: '0 20px' }}>
        <FarmToHomeJourney />
      </section>

      {/* Our Story */}
      <section id="our-story" className="our-story-section bg-secondary section-padding" style={{ position: 'relative' }}>
        <SectionIllustrationSlot page="WhyTanush" section="Our Story" defaultIllustration="farmer-in-field" defaultPosition="bottom-right" defaultOpacity={6} />
        <div className="container story-flex">
          <div className="story-text-content">
            <span className="subtitle">OUR STORY</span>
            <h2>A Simple Thought That Started Tanush</h2>
            
            <p>We noticed how everyday households were looking for products that are effective, safe and inspired by nature.</p>
            <p>But most options either had harsh chemicals or didn't meet our expectations for quality and care.</p>
            <p>That's when Tanush Natural was born — with a simple thought to create products that are thoughtful, nature-inspired and truly made for everyday living.</p>
            <p>Today, Tanush Natural is a growing family that believes in better choices, better practices and a better everyday.</p>
            
            <Button variant="primary" to="/shop" className="mt-xl">EXPLORE OUR PRODUCTS →</Button>
          </div>
          
          <div className="story-collage">
            <div className="collage-main" style={{ backgroundImage: "url('/images/lifestyle/collage-main.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div className="collage-sub-wrap">
              <div className="collage-sub" style={{ backgroundImage: "url('/images/lifestyle/collage-sub1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="collage-sub" style={{ backgroundImage: "url('/images/lifestyle/collage-sub2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Numbers */}
      <section className="journey-numbers-section container section-padding">
        <div className="journey-numbers-grid">
          <div className="journey-area">
            <span className="subtitle">OUR JOURNEY</span>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="icon-wrap"><Lightbulb size={24} weight="light" /></div>
                <h4>2021<br/>The Idea</h4>
                <p>A simple thought of better everyday products.</p>
              </div>
              <div className="timeline-item">
                <div className="icon-wrap"><Leaf size={24} weight="light" /></div>
                <h4>2022<br/>First Steps</h4>
                <p>Research, learning and our first range of products.</p>
              </div>
              <div className="timeline-item">
                <div className="icon-wrap"><Users size={24} weight="light" /></div>
                <h4>2023<br/>Growing Together</h4>
                <p>More families joined us and our range expanded.</p>
              </div>
              <div className="timeline-item">
                <div className="icon-wrap"><TrendUp size={24} weight="light" /></div>
                <h4>2024 & Beyond<br/>Better Everyday</h4>
                <p>Continuing our promise of thoughtful, natural and quality products.</p>
              </div>
            </div>
          </div>
          
          <div className="numbers-area">
             <span className="subtitle">TANUSH IN NUMBERS</span>
             <div className="numbers-grid">
               <div className="number-card">
                 <h3>25+</h3>
                 <p>Products</p>
               </div>
               <div className="number-card">
                 <h3>50,000+</h3>
                 <p>Happy Families</p>
               </div>
               <div className="number-card">
                 <h3>100%</h3>
                 <p>Quality Assured</p>
               </div>
               <div className="number-card">
                 <h3>Made in<br/>India</h3>
                 <p>For Indian Homes</p>
               </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IndiaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default WhyTanush;
