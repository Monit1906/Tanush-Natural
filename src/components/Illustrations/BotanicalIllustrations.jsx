import React, { useState, useEffect } from 'react';
import { api } from '../../lib/db';
import './BotanicalIllustrations.css';

/**
 * TANUSH NATURAL — COMPLETE BOTANICAL ILLUSTRATION SYSTEM
 * Universal editorial vector illustrations across all pages and sections:
 * - BOTANICAL & AYURVEDIC HERBS
 * - NATURAL FARMING, SOIL, SEEDS & TOOLS
 * - FARM TO HOME STORYTELLING
 * - MOSQUITO PROTECTION, VAPORIZER, SPRAY & REFILL
 * - MODERN INDIAN HOMES, MONSOON & OUTDOOR LIVING
 * - WELLNESS, PURITY, SUSTAINABILITY & FUNCTIONAL EMPTY STATES
 */

// -----------------------------------------------------------------------------
// 1. BOTANICAL HERBS & AYURVEDIC PLANTS
// -----------------------------------------------------------------------------

export const NeemBranch = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M15 85 C35 65 55 45 85 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M35 65 C25 60 20 48 24 38 C32 46 36 55 40 60" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M48 52 C38 48 34 36 38 26 C46 34 50 43 54 48" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M62 38 C52 34 50 22 56 14 C62 22 66 30 68 35" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M38 68 C45 60 56 58 64 64 C56 70 48 72 40 70" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M52 54 C60 46 72 46 78 54 C70 58 62 60 54 56" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M66 40 C74 32 84 34 88 42 C82 46 74 46 68 42" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M85 15 C92 8 96 12 90 22 C84 20 80 18 85 15 Z" stroke={color} strokeWidth="1.6" fill="none" />
    <circle cx="28" cy="74" r="2.5" stroke={color} strokeWidth="1.4" fill="none" />
    <circle cx="42" cy="78" r="2.2" stroke={color} strokeWidth="1.4" fill="none" />
  </svg>
);

export const MoringaFrond = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 80 Q50 60 80 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="38" cy="56" rx="6" ry="3.5" transform="rotate(-35 38 56)" stroke={color} strokeWidth="1.5" />
    <ellipse cx="48" cy="62" rx="6" ry="3.5" transform="rotate(35 48 62)" stroke={color} strokeWidth="1.5" />
    <ellipse cx="50" cy="44" rx="5.5" ry="3.2" transform="rotate(-40 50 44)" stroke={color} strokeWidth="1.5" />
    <ellipse cx="60" cy="50" rx="5.5" ry="3.2" transform="rotate(30 60 50)" stroke={color} strokeWidth="1.5" />
    <ellipse cx="64" cy="32" rx="5" ry="3" transform="rotate(-45 64 32)" stroke={color} strokeWidth="1.5" />
    <ellipse cx="72" cy="38" rx="5" ry="3" transform="rotate(25 72 38)" stroke={color} strokeWidth="1.5" />
    <ellipse cx="80" cy="20" rx="4.5" ry="2.8" transform="rotate(-20 80 20)" stroke={color} strokeWidth="1.5" />
    <path d="M30 75 Q40 85 45 92" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const TulsiSprig = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M50 90 L50 25" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M50 25 L50 10 M48 20 L52 20 M47 16 L53 16 M48 12 L52 12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M50 45 C35 42 28 35 34 26 C42 26 48 36 50 45" stroke={color} strokeWidth="1.6" />
    <path d="M50 45 C65 42 72 35 66 26 C58 26 52 36 50 45" stroke={color} strokeWidth="1.6" />
    <path d="M50 62 C30 58 22 50 28 40 C38 40 46 52 50 62" stroke={color} strokeWidth="1.6" />
    <path d="M50 62 C70 58 78 50 72 40 C62 40 54 52 50 62" stroke={color} strokeWidth="1.6" />
    <path d="M50 78 C34 74 26 66 32 58 C42 58 48 68 50 78" stroke={color} strokeWidth="1.6" />
    <path d="M50 78 C66 74 74 66 68 58 C58 58 52 68 50 78" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const CitronellaCluster = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M50 90 Q30 65 15 40 Q25 45 42 75" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 90 Q40 50 28 20 Q42 35 48 70" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 90 Q50 40 50 12 Q56 45 54 75" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M50 90 Q60 50 72 20 Q58 35 52 70" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 90 Q70 65 85 40 Q75 45 58 75" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 90 C47 90 45 92 45 94 C45 96.5 50 99 50 99 C50 99 55 96.5 55 94 C55 92 53 90 50 90 Z" fill={color} opacity="0.8" />
  </svg>
);

export const LemongrassStalk = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M44 92 L46 60 M56 92 L54 60" stroke={color} strokeWidth="2" />
    <path d="M42 92 C46 94 54 94 58 92" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M45 78 C48 80 52 80 55 78 M45 68 C48 70 52 70 55 68" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M46 60 Q30 35 12 25 Q35 32 48 55" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M50 60 Q50 25 38 12 Q54 22 52 50" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M54 60 Q70 35 88 25 Q65 32 52 55" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const EucalyptusSprig = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M25 85 Q50 55 75 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="36" cy="68" r="9" stroke={color} strokeWidth="1.6" />
    <circle cx="48" cy="74" r="8.5" stroke={color} strokeWidth="1.6" />
    <circle cx="50" cy="48" r="8" stroke={color} strokeWidth="1.6" />
    <circle cx="62" cy="54" r="7.5" stroke={color} strokeWidth="1.6" />
    <circle cx="64" cy="30" r="7" stroke={color} strokeWidth="1.6" />
    <circle cx="74" cy="34" r="6.5" stroke={color} strokeWidth="1.6" />
    <ellipse cx="78" cy="16" rx="5" ry="4" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const WildTurmeric = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M25 75 C30 65 42 62 55 68 C68 64 78 72 75 82 C65 92 35 90 25 75 Z" stroke={color} strokeWidth="1.8" />
    <path d="M35 72 C40 76 45 74 50 78 M55 72 C60 76 65 74 70 78" stroke={color} strokeWidth="1.3" />
    <path d="M50 64 Q50 35 50 18" stroke={color} strokeWidth="2" />
    <path d="M50 45 C35 40 30 25 40 18 C48 24 50 35 50 45" stroke={color} strokeWidth="1.6" />
    <path d="M50 38 C65 32 70 18 60 12 C52 18 50 28 50 38" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const AmlaCluster = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 70 Q50 45 80 20" stroke={color} strokeWidth="1.8" />
    <path d="M35 50 L30 42 M45 42 L40 34 M55 35 L50 26 M65 28 L60 18" stroke={color} strokeWidth="1.4" />
    <path d="M40 55 L46 48 M50 48 L56 40 M60 40 L66 32 M70 32 L76 24" stroke={color} strokeWidth="1.4" />
    <circle cx="34" cy="68" r="12" stroke={color} strokeWidth="1.8" />
    <path d="M34 56 C30 62 30 74 34 80 M34 56 C38 62 38 74 34 80" stroke={color} strokeWidth="1.2" />
    <circle cx="58" cy="58" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M58 48 C55 53 55 63 58 68 M58 48 C61 53 61 63 58 68" stroke={color} strokeWidth="1.2" />
  </svg>
);

export const AloeVeraRosette = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M50 90 C42 60 40 35 50 15 C60 35 58 60 50 90 Z" stroke={color} strokeWidth="1.8" />
    <path d="M50 90 C35 70 20 50 12 30 C28 42 42 65 50 90 Z" stroke={color} strokeWidth="1.6" />
    <path d="M50 90 C65 70 80 50 88 30 C72 42 58 65 50 90 Z" stroke={color} strokeWidth="1.6" />
    <path d="M50 90 C30 75 15 65 5 50 C20 60 38 75 50 90 Z" stroke={color} strokeWidth="1.4" opacity="0.8" />
    <path d="M50 90 C70 75 85 65 95 50 C80 60 62 75 50 90 Z" stroke={color} strokeWidth="1.4" opacity="0.8" />
  </svg>
);

export const BhringrajFlora = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M50 90 L50 35" stroke={color} strokeWidth="2" />
    <circle cx="50" cy="24" r="7" stroke={color} strokeWidth="1.8" />
    <circle cx="50" cy="24" r="2.5" fill={color} />
    <path d="M50 17 L50 10 M57 24 L64 24 M50 31 L50 38 M43 24 L36 24" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M50 50 C35 45 25 35 30 25 C40 30 46 42 50 50" stroke={color} strokeWidth="1.5" />
    <path d="M50 65 C65 60 75 50 70 40 C60 45 54 57 50 65" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const HibiscusBlossom = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M50 50 C40 30 20 30 25 50 C28 62 42 56 50 50" stroke={color} strokeWidth="1.6" />
    <path d="M50 50 C60 30 80 30 75 50 C72 62 58 56 50 50" stroke={color} strokeWidth="1.6" />
    <path d="M50 50 C35 65 35 85 50 82 C65 85 65 65 50 50" stroke={color} strokeWidth="1.6" />
    <path d="M50 50 C30 40 15 55 30 70 C42 66 48 56 50 50" stroke={color} strokeWidth="1.6" />
    <path d="M50 50 C70 40 85 55 70 70 C58 66 52 56 50 50" stroke={color} strokeWidth="1.6" />
    <path d="M50 50 L50 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="50" cy="18" r="2.5" fill={color} />
  </svg>
);

// -----------------------------------------------------------------------------
// 2. NATURAL FARMING, SOIL, SEEDS & TOOLS
// -----------------------------------------------------------------------------

export const FarmerInField = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <circle cx="95" cy="35" r="12" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <path d="M10 95 Q60 85 110 95" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15 105 Q60 96 105 105" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M25 114 Q60 106 95 114" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <ellipse cx="58" cy="34" rx="6" ry="4" stroke={color} strokeWidth="1.8" />
    <circle cx="58" cy="40" r="3.5" stroke={color} strokeWidth="1.5" />
    <path d="M58 44 L58 64 M58 48 L48 58 M58 48 L68 56" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M46 38 L46 95" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M58 64 L52 86 M58 64 L65 85" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M22 93 C20 88 18 84 22 80 C26 84 24 88 22 93" stroke={color} strokeWidth="1.3" />
    <path d="M88 93 C86 88 84 84 88 80 C92 84 90 88 88 93" stroke={color} strokeWidth="1.3" />
  </svg>
);

export const PlantingHands = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 90 Q60 78 100 90" stroke={color} strokeWidth="1.8" />
    <path d="M30 96 Q60 88 90 96" stroke={color} strokeWidth="1.2" />
    <path d="M60 85 L60 50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M60 62 C50 56 46 45 52 38 C58 44 60 54 60 62" stroke={color} strokeWidth="1.6" />
    <path d="M60 54 C70 48 74 38 68 32 C62 38 60 46 60 54" stroke={color} strokeWidth="1.6" />
    <path d="M60 85 Q55 92 50 96 M60 85 Q65 92 70 96" stroke={color} strokeWidth="1.2" />
    <path d="M25 70 C35 72 45 80 52 82 C48 88 38 88 28 82" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M95 70 C85 72 75 80 68 82 C72 88 82 88 92 82" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const SeedSowing = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M15 65 Q60 55 105 65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M25 78 Q60 68 95 78" stroke={color} strokeWidth="1.3" />
    <ellipse cx="60" cy="58" rx="8" ry="5" transform="rotate(-15 60 58)" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M60 53 Q58 40 60 30" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="60" cy="24" r="2.5" fill={color} />
  </svg>
);

export const SproutingSeedling = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 85 Q60 80 100 85" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M60 85 L60 45" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M60 45 C45 35 40 20 52 15 C60 22 62 35 60 45" stroke={color} strokeWidth="1.8" />
    <path d="M60 45 C75 35 80 20 68 15 C60 22 58 35 60 45" stroke={color} strokeWidth="1.8" />
    <circle cx="60" cy="94" r="3" stroke={color} strokeWidth="1.4" />
  </svg>
);

export const HarvestBasket = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M30 65 L40 100 C50 104 70 104 80 100 L90 65 Z" stroke={color} strokeWidth="2" />
    <path d="M36 76 L84 76 M40 88 L80 88" stroke={color} strokeWidth="1.3" />
    <path d="M50 65 L48 102 M70 65 L72 102 M60 65 L60 103" stroke={color} strokeWidth="1.3" />
    <path d="M40 65 C32 50 40 38 48 42 C48 55 42 62 40 65" stroke={color} strokeWidth="1.6" />
    <path d="M55 65 C50 45 60 30 70 36 C68 50 60 60 55 65" stroke={color} strokeWidth="1.6" />
    <path d="M72 65 C78 50 90 46 88 58 C84 62 76 64 72 65" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const RootsAndSoil = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M15 45 Q60 40 105 45" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M60 45 L60 20" stroke={color} strokeWidth="2" />
    <path d="M60 32 C50 25 45 15 54 10 C58 18 60 26 60 32" stroke={color} strokeWidth="1.6" />
    <path d="M60 25 C70 18 75 8 66 5 C62 12 60 20 60 25" stroke={color} strokeWidth="1.6" />
    <path d="M60 45 Q55 70 40 95 M60 45 Q65 70 80 95 M60 45 L60 105" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M55 60 Q45 75 30 80 M65 60 Q75 75 90 80 M58 75 Q48 90 42 105" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// 3. MOSQUITO PROTECTION, VAPORIZER, SPRAY & REFILL
// -----------------------------------------------------------------------------

export const MosquitoVaporizerArt = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <rect x="42" y="60" width="36" height="34" rx="8" stroke={color} strokeWidth="2" />
    <path d="M48 94 L48 106 C48 110 72 110 72 106 L72 94" stroke={color} strokeWidth="1.8" />
    <path d="M52 102 L68 102" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
    <circle cx="60" cy="76" r="3" stroke={color} strokeWidth="1.5" />
    <circle cx="60" cy="76" r="1" fill={color} />
    <path d="M60 55 Q50 40 60 25 Q70 12 60 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 48 Q44 35 50 22" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    <path d="M68 48 Q76 35 70 22" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    <path d="M34 50 C26 44 24 35 30 30 C35 35 36 44 34 50" stroke={color} strokeWidth="1.5" />
    <path d="M86 50 C94 44 96 35 90 30 C85 35 84 44 86 50" stroke={color} strokeWidth="1.5" />
    <g transform="translate(92, 18) scale(0.6)" opacity="0.5">
      <line x1="0" y1="5" x2="8" y2="5" stroke={color} strokeWidth="1.2" />
      <path d="M4 5 Q2 0 6 0 Q7 2 4 5" stroke={color} strokeWidth="1" fill="none" />
      <path d="M4 5 Q2 10 6 10 Q7 8 4 5" stroke={color} strokeWidth="1" fill="none" />
    </g>
  </svg>
);

export const VaporizerRefillCartridge = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <rect x="46" y="55" width="28" height="48" rx="6" stroke={color} strokeWidth="2" />
    <rect x="52" y="38" width="16" height="17" rx="3" stroke={color} strokeWidth="1.8" />
    <line x1="60" y1="20" x2="60" y2="55" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 75 Q60 82 70 75" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" />
    <circle cx="60" cy="18" r="1.5" fill={color} />
  </svg>
);

export const MosquitoSprayArt = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <rect x="44" y="55" width="32" height="52" rx="6" stroke={color} strokeWidth="2" />
    <path d="M52 55 L52 42 L68 42 L68 55" stroke={color} strokeWidth="1.8" />
    <path d="M50 42 L70 42" stroke={color} strokeWidth="1.8" />
    <path d="M60 42 L60 30 L45 30 L45 36" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M48 36 Q38 42 42 48" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M38 32 Q25 25 15 20 M36 35 Q22 34 10 35 M38 38 Q25 44 15 50" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeDasharray="3 3" opacity="0.8" />
    <path d="M78 85 Q92 70 88 50" stroke={color} strokeWidth="1.6" />
    <ellipse cx="88" cy="65" rx="5" ry="3" transform="rotate(30 88 65)" stroke={color} strokeWidth="1.3" />
    <ellipse cx="84" cy="52" rx="5" ry="3" transform="rotate(-30 84 52)" stroke={color} strokeWidth="1.3" />
    <g transform="translate(14, 12) scale(0.6)" opacity="0.45">
      <line x1="0" y1="5" x2="8" y2="5" stroke={color} strokeWidth="1.2" />
      <path d="M4 5 Q2 0 6 0 Q7 2 4 5" stroke={color} strokeWidth="1" fill="none" />
      <path d="M4 5 Q2 10 6 10 Q7 8 4 5" stroke={color} strokeWidth="1" fill="none" />
    </g>
  </svg>
);

export const BotanicalShield = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M60 15 C78 15 95 24 95 50 C95 80 60 102 60 102 C60 102 25 80 25 50 C25 24 42 15 60 15 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M60 30 C45 42 45 68 60 82 C75 68 75 42 60 30 Z" stroke={color} strokeWidth="1.8" />
    <path d="M60 30 L60 82" stroke={color} strokeWidth="1.5" />
    <path d="M60 48 L52 54 M60 60 L50 66 M60 48 L68 54 M60 60 L70 66" stroke={color} strokeWidth="1.3" />
    <circle cx="60" cy="58" r="48" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
  </svg>
);

// -----------------------------------------------------------------------------
// 4. MODERN INDIAN HOME, MONSOON & OUTDOOR LIVING
// -----------------------------------------------------------------------------

export const ModernIndianHome = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <rect x="25" y="25" width="70" height="75" rx="4" stroke={color} strokeWidth="2" />
    <line x1="60" y1="25" x2="60" y2="100" stroke={color} strokeWidth="1.5" />
    <line x1="25" y1="62" x2="95" y2="62" stroke={color} strokeWidth="1.5" />
    <path d="M32 88 L35 98 L48 98 L51 88 Z" stroke={color} strokeWidth="1.6" />
    <path d="M40 88 C35 80 40 72 45 88" stroke={color} strokeWidth="1.4" />
    <path d="M43 88 C48 76 52 82 45 88" stroke={color} strokeWidth="1.4" />
    <path d="M72 85 Q65 72 75 60 Q85 48 78 35" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
  </svg>
);

export const MonsoonRainLeaves = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <line x1="30" y1="15" x2="25" y2="30" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
    <line x1="60" y1="10" x2="55" y2="28" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
    <line x1="90" y1="18" x2="85" y2="34" stroke={color} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
    <path d="M20 75 Q60 50 100 65" stroke={color} strokeWidth="2" />
    <path d="M45 58 C35 50 38 35 48 40 C48 52 45 58 45 58" stroke={color} strokeWidth="1.6" />
    <path d="M68 60 C65 46 76 34 82 42 C78 54 68 60 68 60" stroke={color} strokeWidth="1.6" />
    <circle cx="52" cy="48" r="2.5" fill={color} opacity="0.8" />
    <circle cx="75" cy="52" r="2" fill={color} opacity="0.8" />
    <circle cx="38" cy="85" r="2.2" fill={color} opacity="0.8" />
  </svg>
);

export const OutdoorGardenSanctuary = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M15 95 Q60 88 105 95" stroke={color} strokeWidth="2" />
    <path d="M30 95 C30 70 45 55 45 35 C55 45 50 70 45 95" stroke={color} strokeWidth="1.6" />
    <circle cx="85" cy="40" r="10" stroke={color} strokeWidth="1.4" strokeDasharray="2 2" opacity="0.5" />
    <path d="M70 95 C75 80 85 75 90 60 C95 75 90 85 85 95" stroke={color} strokeWidth="1.4" />
  </svg>
);

// -----------------------------------------------------------------------------
// 5. WELLNESS, PURITY & FUNCTIONAL EMPTY STATES
// -----------------------------------------------------------------------------

export const AyurvedicMortarPestle = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M28 55 C28 88 50 98 60 98 C70 98 92 88 92 55 L28 55 Z" stroke={color} strokeWidth="2" />
    <ellipse cx="60" cy="55" rx="32" ry="7" stroke={color} strokeWidth="1.8" />
    <path d="M52 50 L75 20 L84 26 L64 56" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M45 55 C38 46 45 36 52 42 C50 50 45 55 45 55" stroke={color} strokeWidth="1.4" />
  </svg>
);

export const MadeInIndiaInsignia = ({ size = 80, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="60" cy="60" r="42" stroke={color} strokeWidth="1.8" />
    <path d="M60 78 C48 62 42 45 60 32 C78 45 72 62 60 78 Z" stroke={color} strokeWidth="1.8" />
    <path d="M60 78 C40 70 30 52 42 42 C48 52 55 68 60 78 Z" stroke={color} strokeWidth="1.4" />
    <path d="M60 78 C80 70 90 52 78 42 C72 52 65 68 60 78 Z" stroke={color} strokeWidth="1.4" />
    <circle cx="60" cy="78" r="2.5" fill={color} />
  </svg>
);

export const EmptyCartBasket = ({ size = 64, color = "currentColor", className = "", ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`botanical-svg-icon ${className}`}
    aria-hidden="true"
    {...props}
  >
    <path d="M25 50 L35 85 C40 90 60 90 65 85 L75 50 Z" stroke={color} strokeWidth="1.8" />
    <path d="M30 60 L70 60 M34 72 L66 72" stroke={color} strokeWidth="1.2" />
    <path d="M40 50 C35 38 42 28 50 32 C48 42 43 48 40 50" stroke={color} strokeWidth="1.4" />
    <path d="M52 50 C58 38 68 35 66 45 C62 48 56 50 52 50" stroke={color} strokeWidth="1.4" />
  </svg>
);

// -----------------------------------------------------------------------------
// 6. MASTER CATALOG & REGISTRY OF ALL ILLUSTRATIONS
// -----------------------------------------------------------------------------

export const BOTANICAL_ILLUSTRATIONS_CATALOG = [
  // 1. BOTANICAL
  {
    id: 'neem-branch',
    name: 'Neem Botanical Sprig',
    category: 'BOTANICAL',
    tags: ['neem', 'herbal', 'purifying', 'ayurvedic'],
    description: 'Detailed neem frond with delicate serrations and herbal berry accents.',
    component: NeemBranch
  },
  {
    id: 'moringa-frond',
    name: 'Moringa Botanical Frond',
    category: 'BOTANICAL',
    tags: ['moringa', 'superfood', 'organic', 'nourishing'],
    description: 'Fine-textured bipinnate moringa leaflets with seed pod contour.',
    component: MoringaFrond
  },
  {
    id: 'tulsi-sprig',
    name: 'Holy Basil (Tulsi) Blossom',
    category: 'BOTANICAL',
    tags: ['tulsi', 'basil', 'sacred', 'immunity'],
    description: 'Traditional Tulsi sprig with flower manjari and paired fragrant leaves.',
    component: TulsiSprig
  },
  {
    id: 'amla-cluster',
    name: 'Wild Amla Cluster',
    category: 'BOTANICAL',
    tags: ['amla', 'vitamin-c', 'hair', 'vitality'],
    description: 'Shade-grown amla fruit cluster with feathery botanical foliage.',
    component: AmlaCluster
  },
  {
    id: 'aloe-vera-rosette',
    name: 'Aloe Vera Rosette',
    category: 'BOTANICAL',
    tags: ['aloe', 'hydration', 'skin', 'soothing'],
    description: 'Fleshy succulent aloe vera rosette with soothing contour lines.',
    component: AloeVeraRosette
  },
  {
    id: 'bhringraj-flora',
    name: 'Bhringraj Herbal Bloom',
    category: 'BOTANICAL',
    tags: ['bhringraj', 'hair-care', 'herbs', 'scalp'],
    description: 'Ayurvedic keshya herb with delicate blossom and opposite leaves.',
    component: BhringrajFlora
  },
  {
    id: 'hibiscus-blossom',
    name: 'Hibiscus Hair Bloom',
    category: 'BOTANICAL',
    tags: ['hibiscus', 'hair-care', 'flower', 'keshya'],
    description: 'Graceful Indian hibiscus bloom nourishing hair follicles.',
    component: HibiscusBlossom
  },
  {
    id: 'wild-turmeric',
    name: 'Kasturi Haldi Blossom & Root',
    category: 'BOTANICAL',
    tags: ['turmeric', 'haldi', 'glow', 'skin'],
    description: 'Pure wild turmeric rhizome and emerging aromatic flower bud.',
    component: WildTurmeric
  },

  // 2. NATURAL FARMING
  {
    id: 'farmer-in-field',
    name: 'Organic Farmer in Field',
    category: 'NATURAL FARMING',
    tags: ['farmer', 'farm', 'cultivation', 'organic', 'soil'],
    description: 'Respectful, authentic silhouette of a farmer walking along contoured natural rows.',
    component: FarmerInField
  },
  {
    id: 'planting-hands',
    name: 'Hands Planting Seed',
    category: 'NATURAL FARMING',
    tags: ['planting', 'hands', 'seedling', 'roots', 'earth'],
    description: 'Mindful human hands cradling rich soil while a tender seedling sprouts.',
    component: PlantingHands
  },
  {
    id: 'seed-sowing',
    name: 'Seed Sowing in Furrow',
    category: 'NATURAL FARMING',
    tags: ['seed', 'soil', 'earth', 'origin'],
    description: 'Organic non-hybrid seed resting in living fertile soil.',
    component: SeedSowing
  },
  {
    id: 'sprouting-seedling',
    name: 'Sprouting Earth Seedling',
    category: 'NATURAL FARMING',
    tags: ['seedling', 'growth', 'sprout', 'natural'],
    description: 'Two tender organic cotyledons breaking through clean soil.',
    component: SproutingSeedling
  },
  {
    id: 'harvest-basket',
    name: 'Traditional Harvest Basket',
    category: 'NATURAL FARMING',
    tags: ['harvest', 'basket', 'tokri', 'fresh', 'botanical'],
    description: 'Handwoven Indian basket overflowing with freshly harvested botanical herbs.',
    component: HarvestBasket
  },
  {
    id: 'roots-and-soil',
    name: 'Roots & Living Soil',
    category: 'NATURAL FARMING',
    tags: ['soil', 'roots', 'subterranean', 'organic'],
    description: 'Deep organic root network flourishing in pesticide-free Indian earth.',
    component: RootsAndSoil
  },

  // 3. INGREDIENTS
  {
    id: 'citronella-cluster',
    name: 'Citronella Grass Cluster',
    category: 'INGREDIENTS',
    tags: ['citronella', 'mosquito', 'repellent', 'essential-oil'],
    description: 'Aromatic clumping citronella blades with pure essential oil essence droplet.',
    component: CitronellaCluster
  },
  {
    id: 'lemongrass-stalk',
    name: 'Lemongrass Herb Stalk',
    category: 'INGREDIENTS',
    tags: ['lemongrass', 'fresh', 'citrus', 'repellency'],
    description: 'Crisp layered lemongrass base and fragrant arching blades.',
    component: LemongrassStalk
  },
  {
    id: 'eucalyptus-sprig',
    name: 'Eucalyptus Leaf Sprig',
    category: 'INGREDIENTS',
    tags: ['eucalyptus', 'cooling', 'aroma', 'defense'],
    description: 'Silvery round eucalyptus foliage providing natural air freshness.',
    component: EucalyptusSprig
  },

  // 4. MOSQUITO PROTECTION
  {
    id: 'botanical-shield',
    name: 'Botanical Defense Shield',
    category: 'MOSQUITO PROTECTION',
    tags: ['shield', 'safe', 'protection', 'home'],
    description: 'Elegant leaf-formed emblem representing natural household protection.',
    component: BotanicalShield
  },

  // 5. VAPORIZER
  {
    id: 'mosquito-vaporizer-art',
    name: 'Natural Mosquito Vaporizer',
    category: 'VAPORIZER',
    tags: ['vaporizer', 'machine', 'refill', 'indoor', '45-nights'],
    description: 'Compact plug-in vaporizer emitting gentle botanical vapor waves.',
    component: MosquitoVaporizerArt
  },
  {
    id: 'vaporizer-refill-cartridge',
    name: 'Vaporizer Refill Cartridge',
    category: 'VAPORIZER',
    tags: ['refill', 'bottle', 'wick', 'liquid'],
    description: 'Essential oil repellent bottle with natural graphite porous wick.',
    component: VaporizerRefillCartridge
  },

  // 6. REPELLENT SPRAY
  {
    id: 'mosquito-spray-art',
    name: 'Botanical Repellent Spray',
    category: 'REPELLENT SPRAY',
    tags: ['spray', 'mist', 'outdoor', 'travel', 'deet-free'],
    description: 'Minimal spray bottle dispersing fine botanical mist for outdoor ease.',
    component: MosquitoSprayArt
  },

  // 7. INDIAN HOME & OUTDOOR
  {
    id: 'modern-indian-home',
    name: 'Modern Indian Living & Balcony',
    category: 'INDIAN HOME',
    tags: ['home', 'balcony', 'plants', 'lifestyle', 'everyday'],
    description: 'Modern Indian home sanctuary with airy veranda and indoor botanical greenery.',
    component: ModernIndianHome
  },
  {
    id: 'outdoor-garden-sanctuary',
    name: 'Outdoor Garden & Veranda',
    category: 'INDIAN HOME',
    tags: ['garden', 'outdoor', 'evening', 'veranda'],
    description: 'Gentle outdoor twilight garden for serene evenings.',
    component: OutdoorGardenSanctuary
  },

  // 8. MONSOON
  {
    id: 'monsoon-rain-leaves',
    name: 'Monsoon Rain & Fresh Leaves',
    category: 'MONSOON',
    tags: ['monsoon', 'rain', 'fresh', 'seasonal', 'defense'],
    description: 'Fresh Indian monsoon rain droplets beading on crisp neem and citronella leaves.',
    component: MonsoonRainLeaves
  },

  // 9. WELLNESS & CRAFT
  {
    id: 'ayurvedic-mortar-pestle',
    name: 'Ayurvedic Mortar & Pestle',
    category: 'WELLNESS & CARE',
    tags: ['ayurveda', 'formulation', 'mortar', 'pestle', 'craft'],
    description: 'Traditional stone mortar grinding fresh herbs into thoughtful formulations.',
    component: AyurvedicMortarPestle
  },
  {
    id: 'made-in-india-insignia',
    name: 'Pure Made in India Insignia',
    category: 'QUALITY & CRAFT',
    tags: ['india', 'purity', 'lotus', 'insignia', 'trust'],
    description: 'Editorial lotus insignia celebrating authentic Indian botanical heritage.',
    component: MadeInIndiaInsignia
  },
  {
    id: 'empty-cart-basket',
    name: 'Empty Cart Basket',
    category: 'WELLNESS & CARE',
    tags: ['cart', 'basket', 'empty', 'shop'],
    description: 'Minimal handwoven basket with leaf sprigs for cart and checkout states.',
    component: EmptyCartBasket
  }
];

// Helper to look up illustration by ID
export const getBotanicalIllustration = (id) => {
  const match = BOTANICAL_ILLUSTRATIONS_CATALOG.find(item => item.id === id);
  return match || BOTANICAL_ILLUSTRATIONS_CATALOG[0];
};

// Universal Component to render any Illustration by ID or Custom Media URL
export const BotanicalIllustration = ({ 
  id, 
  customUrl = null, 
  size = 64, 
  color = "currentColor", 
  className = "", 
  ...props 
}) => {
  if (customUrl) {
    return (
      <img 
        src={customUrl} 
        alt="Botanical Illustration" 
        style={{ width: size, height: size, objectFit: 'contain', pointerEvents: 'none' }}
        className={`botanical-svg-icon ${className}`}
        aria-hidden="true"
        onError={(e) => { e.target.style.display = 'none'; }}
        {...props}
      />
    );
  }
  const item = getBotanicalIllustration(id);
  const Component = item.component || NeemBranch;
  return <Component size={size} color={color} className={className} {...props} />;
};

// -----------------------------------------------------------------------------
// 7. DYNAMIC SECTION ILLUSTRATION SLOT (UNIVERSAL PER-PAGE & PER-SECTION)
// -----------------------------------------------------------------------------

export const SectionIllustrationSlot = ({
  page = 'Home',
  section = 'Hero',
  defaultIllustration = null,
  defaultPosition = 'top-right',
  defaultOpacity = 8,
  defaultScale = 100,
  className = ""
}) => {
  const [activeIllustrations, setActiveIllustrations] = useState([]);

  const loadAssignments = async () => {
    try {
      const settings = await api.getIllustrationSettings();
      if (settings && Array.isArray(settings.assignments)) {
        const matches = settings.assignments.filter(a => 
          a.isActive !== false &&
          (a.page?.toLowerCase() === page?.toLowerCase() || a.page === 'All' || a.page === 'All Pages') &&
          (a.section?.toLowerCase() === section?.toLowerCase() || a.section === 'All' || a.section?.toLowerCase().includes(section?.toLowerCase()))
        );
        // Sort by order property if set
        matches.sort((a, b) => (a.order || 0) - (b.order || 0));
        setActiveIllustrations(matches);
      }
    } catch (e) {
      console.warn('Error loading dynamic illustration slot:', e);
    }
  };

  useEffect(() => {
    loadAssignments();

    const handleSync = () => loadAssignments();
    window.addEventListener('illustration_settings_updated', handleSync);
    window.addEventListener('cms_data_updated', handleSync);

    return () => {
      window.removeEventListener('illustration_settings_updated', handleSync);
      window.removeEventListener('cms_data_updated', handleSync);
    };
  }, [page, section]);

  // If no dynamic CMS assignments, render default fallback (if provided)
  if (activeIllustrations.length === 0) {
    if (!defaultIllustration) return null;
    const defItem = getBotanicalIllustration(defaultIllustration);
    const Comp = defItem.component || NeemBranch;
    const posClass = `section-illustration-${defaultPosition}`;
    return (
      <div 
        className={`section-illustration-slot ${posClass} ${className}`}
        style={{ opacity: defaultOpacity / 100, transform: `scale(${defaultScale / 100})` }}
        aria-hidden="true"
      >
        <Comp size={240} color="var(--color-primary, #173B2F)" />
      </div>
    );
  }

  return (
    <>
      {activeIllustrations.map(item => {
        const posClass = `section-illustration-${item.position || 'top-right'}`;
        const desktopClass = item.desktopVisible === false ? 'section-illustration-desktop-hidden' : '';
        const mobileClass = item.mobileVisible === false ? 'section-illustration-mobile-hidden' : '';
        const scaleVal = (item.scale || 100) / 100;
        const opacityVal = (item.opacity || 10) / 100;
        const rotVal = item.rotation || 0;

        return (
          <div
            key={item.id}
            className={`section-illustration-slot ${posClass} ${desktopClass} ${mobileClass} ${className}`}
            style={{ 
              opacity: opacityVal,
              transform: `scale(${scaleVal}) rotate(${rotVal}deg)`,
              zIndex: item.zIndex || 0
            }}
            aria-hidden="true"
          >
            <BotanicalIllustration 
              id={item.illustrationId} 
              customUrl={item.customUrl} 
              size={260} 
              color="var(--color-primary, #173B2F)" 
            />
          </div>
        );
      })}
    </>
  );
};

// -----------------------------------------------------------------------------
// 8. HIGH-LEVEL STORYTELLING & LIFESTYLE COMPONENTS
// -----------------------------------------------------------------------------

/**
 * FarmToHomeJourney
 * An editorial 5-stage storytelling path:
 * Organic Indian Farms -> Mindful Harvest -> Botanical Essence -> Thoughtful Formulation -> Modern Indian Home
 */
export const FarmToHomeJourney = ({ className = "" }) => {
  const steps = [
    {
      num: "01",
      title: "Organic Indian Farms",
      desc: "Ethically cultivated in rich, pesticide-free Indian soils.",
      icon: <FarmerInField size={48} color="var(--color-primary, #173B2F)" />
    },
    {
      num: "02",
      title: "Mindful Harvest",
      desc: "Hand-harvested at peak potency to preserve plant life.",
      icon: <HarvestBasket size={48} color="var(--color-primary, #173B2F)" />
    },
    {
      num: "03",
      title: "Botanical Essence",
      desc: "Steam-distilled pure extracts of Citronella, Neem & Tulsi.",
      icon: <CitronellaCluster size={48} color="var(--color-primary, #173B2F)" />
    },
    {
      num: "04",
      title: "Thoughtful Formulation",
      desc: "Balanced Ayurvedic proportions with zero harsh synthetics.",
      icon: <PlantingHands size={48} color="var(--color-primary, #173B2F)" />
    },
    {
      num: "05",
      title: "Everyday Indian Home",
      desc: "Gentle, non-toxic protection for families across India.",
      icon: <ModernIndianHome size={48} color="var(--color-primary, #173B2F)" />
    }
  ];

  return (
    <div className={`farm-to-home-container ${className}`}>
      <div className="farm-to-home-header">
        <span className="farm-to-home-eyebrow">
          <TulsiSprig size={18} color="var(--color-accent, #D4AF37)" />
          Botanical Integrity
        </span>
        <h3 className="farm-to-home-title">The Farm-to-Home Journey</h3>
        <p className="farm-to-home-subtitle">
          From organic Indian soil to your living space — how Tanush Natural brings safe, nature-inspired protection into everyday life.
        </p>
      </div>

      <div className="farm-to-home-flow">
        {steps.map((step, idx) => (
          <div className="farm-journey-step" key={idx}>
            <div className="farm-step-icon-wrap">
              <span className="farm-step-number">{step.num}</span>
              {step.icon}
            </div>
            <div className="farm-step-label">{step.title}</div>
            <p className="farm-step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ProductUsageFlow
 * Context-aware usage visual step-by-step diagram for Product Detail pages
 */
export const ProductUsageFlow = ({ product }) => {
  if (!product) return null;
  const cat = (product.category || '').toLowerCase();
  const slug = (product.slug || product.id || '').toLowerCase();
  const isVaporizer = slug.includes('vaporizer') || slug.includes('refill') || slug.includes('liquid');
  const isSpray = slug.includes('spray') || (cat.includes('mosquito') && slug.includes('spray'));
  const isPowder = slug.includes('haldi') || slug.includes('amla') || slug.includes('powder');
  const isClean = slug.includes('floor') || slug.includes('bath') || slug.includes('dish') || slug.includes('clean');

  let steps = [];
  let title = "How It Works Naturally";

  if (isVaporizer) {
    title = "Natural Vaporizer Ritual";
    steps = [
      { num: "01", text: "Insert Refill", sub: "Lock botanical liquid cartridge into machine", icon: <MosquitoVaporizerArt size={32} /> },
      { num: "02", text: "Plug In", sub: "Standard wall socket 30 mins before sleep", icon: <ModernIndianHome size={32} /> },
      { num: "03", text: "Gentle Vapor", sub: "Citronella & Neem aromatic micro-currents", icon: <CitronellaCluster size={32} /> },
      { num: "04", text: "45 Nights Safe", sub: "Peaceful sleep for children & elders", icon: <BotanicalShield size={32} /> }
    ];
  } else if (isSpray) {
    title = "Natural Spray Protection";
    steps = [
      { num: "01", text: "Shake Gently", sub: "Blend pure essential herbal oils", icon: <MosquitoSprayArt size={32} /> },
      { num: "02", text: "Fine Mist", sub: "Spray evenly onto exposed skin & fabrics", icon: <EucalyptusSprig size={32} /> },
      { num: "03", text: "Outdoor & Home", sub: "Ideal for evening garden, travel & veranda", icon: <ModernIndianHome size={32} /> },
      { num: "04", text: "DEET-Free Care", sub: "Gentle natural deterrence that lasts", icon: <BotanicalShield size={32} /> }
    ];
  } else if (isPowder) {
    title = "Traditional Herbal Preparation";
    steps = [
      { num: "01", text: "Pure Harvest", sub: "Sun-dried and finely stone-milled", icon: <HarvestBasket size={32} /> },
      { num: "02", text: "Blend", sub: "Mix with rose water or pure milk", icon: <WildTurmeric size={32} /> },
      { num: "03", text: "Apply Gently", sub: "Nourish skin or hair roots", icon: <PlantingHands size={32} /> },
      { num: "04", text: "Rinse Clean", sub: "Natural botanical radiance", icon: <TulsiSprig size={32} /> }
    ];
  } else if (isClean) {
    title = "Herbal Cleaning Ritual";
    steps = [
      { num: "01", text: "Pine & Citronella", sub: "Pure botanical essential oil base", icon: <LemongrassStalk size={32} /> },
      { num: "02", text: "Dilute or Spray", sub: "1 capful in half bucket of fresh water", icon: <ModernIndianHome size={32} /> },
      { num: "03", text: "Pet & Child Safe", sub: "Zero toxic synthetic residue", icon: <BotanicalShield size={32} /> },
      { num: "04", text: "Fresh Home", sub: "Naturally fragrant everyday surfaces", icon: <NeemBranch size={32} /> }
    ];
  } else {
    title = "Mindful Botanical Care";
    steps = [
      { num: "01", text: "Plant Actives", sub: "Naturally derived surfactants & oils", icon: <NeemBranch size={32} /> },
      { num: "02", text: "Easy Daily Use", sub: "Formulated for real Indian households", icon: <ModernIndianHome size={32} /> },
      { num: "03", text: "Chemical Safe", sub: "Free from harsh toxic fumes", icon: <BotanicalShield size={32} /> },
      { num: "04", text: "Pure Home", sub: "Fresh natural botanical fragrance", icon: <LemongrassStalk size={32} /> }
    ];
  }

  return (
    <div className="product-usage-steps-card">
      <div className="product-usage-header">
        <h4 className="product-usage-title">
          <TulsiSprig size={18} color="var(--color-accent, #D4AF37)" />
          {title}
        </h4>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted, #6B7C73)' }}>
          100% Botanical Actives
        </span>
      </div>
      <div className="product-usage-grid">
        {steps.map((s, idx) => (
          <div className="product-usage-step-item" key={idx}>
            <div className="product-usage-icon-box">
              {s.icon}
            </div>
            <div className="product-usage-step-num">{s.num}</div>
            <div className="product-usage-step-text">{s.text}</div>
            <div className="product-usage-step-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * BotanicalWatermark
 * Ultra-subtle background watermark vector (opacity 5-15%, pointer-events: none, aria-hidden)
 */
export const BotanicalWatermark = ({ 
  illustration = 'neem-branch', 
  position = 'top-right', 
  opacity = 0.08, 
  size = 280, 
  color = "#173B2F",
  hideOnMobile = true,
  className = "" 
}) => {
  const item = getBotanicalIllustration(illustration);
  const Component = item.component || NeemBranch;

  const posClass = `botanical-watermark-${position}`;
  const mobileClass = hideOnMobile ? 'botanical-watermark-mobile-hidden' : '';

  return (
    <div 
      className={`botanical-watermark ${posClass} ${mobileClass} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <Component size={size} color={color} />
    </div>
  );
};

/**
 * CategoryBotanicalBadge
 * Visual identity badge for Category headers
 */
export const CategoryBotanicalBadge = ({ categoryId = 'all', name = 'Collection' }) => {
  let illustrationId = 'neem-branch';
  let label = 'Botanical Care';

  if (categoryId.includes('mosquito')) {
    illustrationId = 'botanical-shield';
    label = 'Natural Mosquito Protection';
  } else if (categoryId.includes('home')) {
    illustrationId = 'lemongrass-stalk';
    label = 'Herbal Home Care';
  } else if (categoryId.includes('kitchen')) {
    illustrationId = 'harvest-basket';
    label = 'Kitchen & Pure Spices';
  } else if (categoryId.includes('personal') || categoryId.includes('skin') || categoryId.includes('hair')) {
    illustrationId = 'tulsi-sprig';
    label = 'Ayurvedic Personal Care';
  }

  const IllComp = getBotanicalIllustration(illustrationId).component;

  return (
    <div className="category-header-botanical-badge">
      <div className="category-header-botanical-icon">
        <IllComp size={20} color="#173B2F" />
      </div>
      <span className="category-header-botanical-text">{label}</span>
    </div>
  );
};

/**
 * FooterBotanicalStrip
 * Trust and botanical purity footer strip
 */
export const FooterBotanicalStrip = () => (
  <div className="footer-botanical-strip" aria-hidden="true">
    <div className="footer-purity-item">
      <FarmerInField size={22} color="rgba(255,255,255,0.7)" />
      <span>Organic Indian Farming</span>
    </div>
    <div className="footer-purity-item">
      <NeemBranch size={22} color="rgba(255,255,255,0.7)" />
      <span>100% Plant Actives</span>
    </div>
    <div className="footer-purity-item">
      <BotanicalShield size={22} color="rgba(255,255,255,0.7)" />
      <span>DEET-Free Mosquito Protection</span>
    </div>
    <div className="footer-purity-item">
      <MadeInIndiaInsignia size={22} color="rgba(255,255,255,0.7)" />
      <span>Proudly Made in India</span>
    </div>
  </div>
);
