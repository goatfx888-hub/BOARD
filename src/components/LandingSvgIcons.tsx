import React from 'react';

interface SvgProps {
  className?: string;
  size?: number;
}

// 1. Professional Football Coach & Tactical Board Vector Logo (Be Coach Official Emblem)
export const SvgBeCoachLogo: React.FC<SvgProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      {/* Dynamic Gradients */}
      <linearGradient id="bcGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="45%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="bcGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="bcGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="bcShieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="bcGlassHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter id="bcGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#10b981" floodOpacity="0.5" />
      </filter>
    </defs>

    {/* Master Geometric Crest Frame (Modern Chamfered Tactical Shield) */}
    <path
      d="M24 2.5L42 7.5V21C42 33.5 34.5 42.5 24 46C13.5 42.5 6 33.5 6 21V7.5L24 2.5Z"
      fill="url(#bcShieldBg)"
      stroke="url(#bcGradPrimary)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Inner Glass Bevel Highlight */}
    <path
      d="M24 4.5L40 9V21C40 31.5 33.5 39.8 24 43.5C14.5 39.8 8 31.5 8 21V9L24 4.5Z"
      stroke="url(#bcGlassHighlight)"
      strokeWidth="1"
      fill="none"
      opacity="0.8"
    />

    {/* Tactical Pitch Geometry Subdivision */}
    <path
      d="M10 24H38M24 9V41"
      stroke="#1e293b"
      strokeWidth="1.2"
      strokeDasharray="2 2"
      opacity="0.8"
    />
    <circle
      cx="24"
      cy="24"
      r="8.5"
      stroke="#334155"
      strokeWidth="1"
      strokeDasharray="2 2"
      fill="none"
      opacity="0.5"
    />

    {/* Letter "B" (Bold Tactical Pillar & Fluid Upper/Lower Loops) */}
    <path
      d="M14.5 13.5V34.5"
      stroke="url(#bcGradPrimary)"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M14.5 14H22.5C25.5 14 27.5 15.8 27.5 18.5C27.5 21.2 25.5 23 22.5 23H14.5M14.5 23H23.5C27 23 29 25 29 28.5C29 32 27 34 23.5 34H14.5"
      stroke="url(#bcGradPrimary)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#bcGlow)"
    />

    {/* Letter "C" (Tactical Encompassing Arc & Forward Strategy Vector) */}
    <path
      d="M36 17C33.5 14.5 29.5 13.5 25.5 14M25.5 34C30 34.5 34 33 36.5 29.5"
      stroke="url(#bcGradCyan)"
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    {/* Dynamic Forward Strategy Vector Arrow (Tactical Playmaker Breakaway) */}
    <path
      d="M31.5 12L37.5 11.5L36.8 17.5"
      stroke="url(#bcGradGold)"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Central Tactical Ball / Node Token */}
    <circle cx="24" cy="24" r="2.6" fill="#ffffff" stroke="#090d16" strokeWidth="1" />
    <circle cx="24" cy="24" r="1.1" fill="#10b981" />

    {/* Tactical Star / Coach Excellence Crest Emblem at Apex */}
    <polygon
      points="24,5 24.9,7.2 27.2,7.2 25.3,8.6 26.1,10.8 24,9.4 21.9,10.8 22.7,8.6 20.8,7.2 23.1,7.2"
      fill="url(#bcGradGold)"
    />
  </svg>
);

// 1b. Legacy SvgCoachLogo alias for backward compatibility
export const SvgCoachLogo: React.FC<SvgProps> = (props) => <SvgBeCoachLogo {...props} />;

// 1. Classic & Luxury Football / Soccer Ball Icon
export const SvgFootballBall: React.FC<SvgProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      {/* 3D Sphere Lighting Gradient */}
      <radialGradient id="ballShading" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#e2e8f0" />
        <stop offset="90%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </radialGradient>
      {/* Dark Pentagon Panels Gradient */}
      <linearGradient id="darkPanel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#090d16" />
      </linearGradient>
      {/* Gold/Emerald Tactical Accent */}
      <linearGradient id="ballGoldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* Outer Ball Sphere */}
    <circle cx="24" cy="24" r="22" fill="url(#ballShading)" stroke="#0f172a" strokeWidth="2" />

    {/* Center Pentagon */}
    <polygon
      points="24,15 31.5,20.5 28.5,29.5 19.5,29.5 16.5,20.5"
      fill="url(#darkPanel)"
      stroke="#0f172a"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />

    {/* Radial Seam Lines extending from Center Pentagon */}
    <line x1="24" y1="15" x2="24" y2="3.5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="31.5" y1="20.5" x2="43.5" y2="16.5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="28.5" y1="29.5" x2="37.5" y2="40.5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="19.5" y1="29.5" x2="10.5" y2="40.5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="16.5" y1="20.5" x2="4.5" y2="16.5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />

    {/* Outer Top Pentagon Fragment */}
    <polygon
      points="17.5,2.5 30.5,2.5 27,8.5 21,8.5"
      fill="url(#darkPanel)"
      stroke="#0f172a"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <line x1="17.5" y1="2.5" x2="21" y2="8.5" stroke="#0f172a" strokeWidth="1.4" />
    <line x1="30.5" y1="2.5" x2="27" y2="8.5" stroke="#0f172a" strokeWidth="1.4" />
    <line x1="21" y1="8.5" x2="24" y2="15" stroke="#0f172a" strokeWidth="1.6" />
    <line x1="27" y1="8.5" x2="24" y2="15" stroke="#0f172a" strokeWidth="1.6" />

    {/* Outer Right Pentagon Fragment */}
    <polygon
      points="44.5,13.5 45.5,26.5 39.5,25 38.5,17"
      fill="url(#darkPanel)"
      stroke="#0f172a"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <line x1="31.5" y1="20.5" x2="38.5" y2="17" stroke="#0f172a" strokeWidth="1.6" />
    <line x1="31.5" y1="20.5" x2="39.5" y2="25" stroke="#0f172a" strokeWidth="1.6" />

    {/* Outer Left Pentagon Fragment */}
    <polygon
      points="3.5,13.5 2.5,26.5 8.5,25 9.5,17"
      fill="url(#darkPanel)"
      stroke="#0f172a"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <line x1="16.5" y1="20.5" x2="9.5" y2="17" stroke="#0f172a" strokeWidth="1.6" />
    <line x1="16.5" y1="20.5" x2="8.5" y2="25" stroke="#0f172a" strokeWidth="1.6" />

    {/* Outer Bottom Right Pentagon Fragment */}
    <polygon
      points="34,42 22,45.5 25,38 33,36"
      fill="url(#darkPanel)"
      stroke="#0f172a"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <line x1="28.5" y1="29.5" x2="33" y2="36" stroke="#0f172a" strokeWidth="1.6" />
    <line x1="28.5" y1="29.5" x2="25" y2="38" stroke="#0f172a" strokeWidth="1.6" />

    {/* Outer Bottom Left Pentagon Fragment */}
    <polygon
      points="14,42 22,45.5 20,38 15,36"
      fill="url(#darkPanel)"
      stroke="#0f172a"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <line x1="19.5" y1="29.5" x2="15" y2="36" stroke="#0f172a" strokeWidth="1.6" />
    <line x1="19.5" y1="29.5" x2="20" y2="38" stroke="#0f172a" strokeWidth="1.6" />

    {/* Highlight Specular Glint on Top-Left */}
    <ellipse cx="14" cy="11" rx="5" ry="3" fill="#ffffff" fillOpacity="0.45" transform="rotate(-30 14 11)" />
  </svg>
);

// 1. Luxury Tactical Crest / Pitch Monogram Logo
export const SvgLuxuryCrest: React.FC<SvgProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="crestInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
    </defs>
    {/* Shield outer border */}
    <path
      d="M24 4L8 10V22C8 32.5 14.8 42.1 24 44C33.2 42.1 40 32.5 40 22V10L24 4Z"
      fill="url(#crestInner)"
      stroke="url(#crestGold)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Tactical pitch markings inside shield */}
    <rect x="14" y="14" width="20" height="20" rx="2" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.8" />
    <line x1="14" y1="24" x2="34" y2="24" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.8" />
    <circle cx="24" cy="24" r="3.5" stroke="#fef08a" strokeWidth="1.2" />
    <circle cx="24" cy="24" r="1" fill="#fef08a" />
    {/* Penalty boxes */}
    <rect x="20" y="14" width="8" height="3" stroke="#34d399" strokeWidth="1" strokeOpacity="0.6" />
    <rect x="20" y="31" width="8" height="3" stroke="#34d399" strokeWidth="1" strokeOpacity="0.6" />
  </svg>
);

// 2. Luxury Match 11v11 Clash Icon
export const SvgMatchClash: React.FC<SvgProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="8" cy="10" r="3" fill="#10b981" />
    <circle cx="8" cy="22" r="3" fill="#10b981" />
    <circle cx="24" cy="10" r="3" fill="#fb7185" />
    <circle cx="24" cy="22" r="3" fill="#fb7185" />
    <circle cx="16" cy="16" r="2.5" fill="#fef08a" />
    {/* Curved tactical collision vectors */}
    <path d="M11 10C14 10 14 14 15 15" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    <path d="M21 22C18 22 18 18 17 17" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    <path d="M13 22L19 10" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 3. Luxury Stadium Turf Layers Icon
export const SvgTurfStadium: React.FC<SvgProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8L16 3L28 8L16 13L4 8Z" fill="#047857" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 14L16 19L28 14" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 20L16 25L28 20" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="16" y1="3" x2="16" y2="25" stroke="#fef08a" strokeWidth="1.2" strokeOpacity="0.8" />
    <circle cx="16" cy="13" r="2" fill="#fef08a" />
  </svg>
);

// 4. Luxury Keyframe Studio Icon
export const SvgKeyframeFilm: React.FC<SvgProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="6" width="26" height="20" rx="4" stroke="#10b981" strokeWidth="1.5" />
    <line x1="3" y1="12" x2="29" y2="12" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="3" y1="20" x2="29" y2="20" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
    {/* Sprocket holes */}
    <circle cx="7" cy="9" r="1" fill="#34d399" />
    <circle cx="13" cy="9" r="1" fill="#34d399" />
    <circle cx="19" cy="9" r="1" fill="#34d399" />
    <circle cx="25" cy="9" r="1" fill="#34d399" />
    <circle cx="7" cy="23" r="1" fill="#34d399" />
    <circle cx="13" cy="23" r="1" fill="#34d399" />
    <circle cx="19" cy="23" r="1" fill="#34d399" />
    <circle cx="25" cy="23" r="1" fill="#34d399" />
    {/* Play triangle inside */}
    <polygon points="14,13 14,19 20,16" fill="#fef08a" />
  </svg>
);

// 5. Luxury Tactical Drawing Stylus Icon
export const SvgDrawingTactics: React.FC<SvgProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 26L11 25L24 12L19 7L6 20L6 26Z" fill="#065f46" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="16" y1="10" x2="21" y2="15" stroke="#fef08a" strokeWidth="1.5" />
    <path d="M4 28C8 26 10 28 14 27" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="25" cy="6" r="2" fill="#fef08a" />
  </svg>
);

// 6. Luxury Football Jersey Crest Icon
export const SvgJerseyKit: React.FC<SvgProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 6L4 11L7 16L10 14V27H22V14L25 16L28 11L22 6C20 8 12 8 10 6Z"
      fill="#047857"
      stroke="#34d399"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <line x1="16" y1="9" x2="16" y2="27" stroke="#fef08a" strokeWidth="1.5" />
    <circle cx="16" cy="18" r="2.5" fill="#fef08a" />
  </svg>
);

// 7. Luxury 4K Export Camera Frame Icon
export const SvgExport4K: React.FC<SvgProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="6" width="24" height="20" rx="3" stroke="#34d399" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="5" stroke="#fef08a" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="2" fill="#fef08a" />
    {/* Corner camera accents */}
    <path d="M8 10H6V12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 10H26V12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 22H6V20" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 22H26V20" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 8. Luxury Crown / Star Badge
export const SvgCrownStar: React.FC<SvgProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#fef08a"
      stroke="#eab308"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

// 9. Luxury Arrow Chevron Icon
export const SvgLuxuryArrow: React.FC<SvgProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 10. Luxury Play Triangle Icon
export const SvgLuxuryPlay: React.FC<SvgProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="6,3 20,12 6,21" fill="currentColor" />
  </svg>
);

// 11. Luxury Checkmark Seal Icon
export const SvgLuxuryCheck: React.FC<SvgProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="1.8" />
    <path d="M8 12L11 15L16 9" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 12. Luxury Diamond Monogram
export const SvgDiamondBadge: React.FC<SvgProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="12,2 22,12 12,22 2,12" stroke="#fef08a" strokeWidth="1.5" fill="#047857" fillOpacity="0.4" />
    <circle cx="12" cy="12" r="2" fill="#fef08a" />
  </svg>
);

// 13. Professional High-Tech Tactical Export SVG Icon
export const SvgExportTactical: React.FC<SvgProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="exportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Frame corners representing camera viewfinder & tactical framing */}
    <path
      d="M4 8V5C4 4.44772 4.44772 4 5 4H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 4H19C19.5523 4 20 4.44772 20 5V8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 16V19C4 19.5523 4.44772 20 5 20H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 20H19C19.5523 20 20 19.5523 20 19V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Center Tactical Download Arrow with Dynamic Trajectory */}
    <path
      d="M12 7V15M12 15L8.5 11.5M12 15L15.5 11.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Baseline pitch floor indicator */}
    <path
      d="M9 17.5H15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

// 14. Professional Dark Mode Crescent Moon SVG with Glint Stars
export const SvgDarkModePro: React.FC<SvgProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4338ca" />
      </linearGradient>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Sculpted Crescent Moon */}
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      fill="url(#moonGrad)"
      stroke="#a5b4fc"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Star Glints */}
    <path
      d="M19 4L19.5 5.5L21 6L19.5 6.5L19 8L18.5 6.5L17 6L18.5 5.5L19 4Z"
      fill="url(#starGrad)"
    />
    <circle cx="15.5" cy="2.5" r="0.75" fill="#fef08a" />
  </svg>
);

// 15. Professional Light Mode Radiant Sun SVG
export const SvgLightModePro: React.FC<SvgProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
  >
    <defs>
      <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Core Solar Orb */}
    <circle
      cx="12"
      cy="12"
      r="4.5"
      fill="url(#sunGrad)"
      stroke="#fbbf24"
      strokeWidth="1"
    />
    {/* Primary Compass Rays */}
    <path
      d="M12 2V4.5M12 19.5V22M2 12H4.5M19.5 12H22"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Diagonal Ambient Rays */}
    <path
      d="M4.93 4.93L6.7 6.7M17.3 17.3L19.07 19.07M4.93 19.07L6.7 17.3M17.3 6.7L19.07 4.93"
      stroke="#fbbf24"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
