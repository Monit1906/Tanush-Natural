import React, { useRef } from 'react';
import StrokeText from '../StrokeText/StrokeText';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AnimatedSectionHeading = ({ 
  children,
  text, 
  className = '', 
  strokeColor = 'var(--color-accent)', 
  fillColor = 'var(--color-primary)',
  delayElements = [] // CSS selectors for sibling elements to delay (like paragraphs)
}) => {
  const headingText = text || (typeof children === 'string' ? children : '');
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    if (delayElements.length === 0) return;
    
    // Find sibling elements that match the delayElements selectors
    const parent = containerRef.current.parentElement;
    if (!parent) return;
    
    const elementsToReveal = parent.querySelectorAll(delayElements.join(', '));
    if (elementsToReveal.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
       gsap.set(elementsToReveal, { opacity: 1, y: 0, visibility: 'visible' });
       return;
    }

    // Hide them initially
    gsap.set(elementsToReveal, { opacity: 0, y: 15, visibility: 'hidden' });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(elementsToReveal, {
          opacity: 1,
          y: 0,
          visibility: 'visible',
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.6 // Animate in after heading starts
        });
      }
    });
  }, { scope: containerRef });

  return (
    <h2 className={`animated-section-heading ${className}`} ref={containerRef}>
      <StrokeText
        text={headingText}
        strokeColor={strokeColor}
        fillColor={fillColor}
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
  );
};

export default AnimatedSectionHeading;
