import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import StrokeText from '../StrokeText/StrokeText';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionHeading.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SectionHeading = ({ 
  eyebrow,
  title, 
  subtitle, 
  alignment = 'left', 
  viewAllLink, 
  viewAllText = "VIEW ALL",
  hideDivider = false,
  className = ''
}) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const elementsToReveal = containerRef.current.querySelectorAll('.section-eyebrow, .section-subtitle, .heading-divider, .view-all-link');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
       gsap.set(elementsToReveal, { opacity: 1, y: 0 });
       return;
    }

    gsap.set(elementsToReveal, { opacity: 0, y: 15 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(elementsToReveal, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.6 // Subheadings animate in after heading starts
        });
      }
    });
  }, { scope: containerRef });

  return (
    <div className={`section-heading align-${alignment} ${className}`} ref={containerRef}>
      <div className="heading-content">
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="section-title">
          <StrokeText
            text={title}
            strokeColor="var(--color-accent)"
            fillColor="var(--color-primary)"
            strokeWidth={1.2}
            drawDuration={1.2}
            fillDelay={0.15}
            stagger={0.04}
            ease="power2.out"
            trigger="scroll"
            fillMode="wipe"
            fontSize={64}
            fontFamily="var(--font-serif)"
            fontWeight={400}
            letterSpacing={0}
          />
        </h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        {!hideDivider && <div className="heading-divider"></div>}
      </div>
      {viewAllLink && (
        <Link to={viewAllLink} className="view-all-link">
          {viewAllText}
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
