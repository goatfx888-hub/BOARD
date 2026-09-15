import React from 'react';
import { PitchTexture, LightingMode } from '../types';

export interface PitchSVGProps {
  texture: PitchTexture;
  lighting: LightingMode;
  orientation?: 'horizontal' | 'vertical';
  showTechnicalArea?: boolean;
  showCornerFlags?: boolean;
  showGoals?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PitchSVGComponent: React.FC<PitchSVGProps> = ({
  texture,
  lighting,
  orientation = 'horizontal',
  showTechnicalArea = true,
  showCornerFlags = true,
  showGoals = true,
  className = '',
  children,
}) => {
  // Rich, realistic, world-class stadium turf base background
  const getPitchBackground = () => {
    switch (texture) {
      case 'striped':
        return 'bg-gradient-to-b from-[#135d2c] via-[#1a7738] to-[#125829]';
      case 'checkerboard':
        return 'bg-gradient-to-br from-[#125b2b] via-[#197437] to-[#105527]';
      case 'circular':
        return 'bg-gradient-to-b from-[#135e2d] via-[#1b793a] to-[#12592a]';
      case 'diamond_cut':
        return 'bg-gradient-to-br from-[#14602e] via-[#1c7b3b] to-[#125a2a]';
      case 'deep_emerald':
        return 'bg-gradient-to-b from-[#0f4d25] via-[#166432] to-[#0e4822]';
      case 'hybrid_stadium':
        return 'bg-gradient-to-b from-[#15622e] via-[#1d7d3c] to-[#135c2b]';
      case 'frost_pitch':
        return 'bg-gradient-to-b from-[#165240] via-[#216e57] to-[#154c3b]';
      case 'vintage_classic':
        return 'bg-gradient-to-b from-[#2e551e] via-[#3c7028] to-[#294c1a]';
      case 'retro_grass':
        return 'bg-gradient-to-b from-[#186a2a] via-[#228437] to-[#156226]';
      case 'indoor_turf':
        return 'bg-gradient-to-b from-[#116140] via-[#197c54] to-[#0f5739]';
      case 'tactical_dark':
        return 'bg-gradient-to-b from-[#0a1526] via-[#102038] to-[#081220]';
      default:
        return 'bg-gradient-to-b from-[#135d2c] via-[#1a7738] to-[#125829]';
    }
  };

  const lineStroke =
    texture === 'tactical_dark'
      ? 'rgba(56, 189, 248, 0.95)'
      : 'rgba(255, 255, 255, 0.96)';

  const innerLineStroke =
    texture === 'tactical_dark'
      ? 'rgba(56, 189, 248, 0.45)'
      : 'rgba(255, 255, 255, 0.55)';

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden border border-emerald-950/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300 ${getPitchBackground()} ${className}`}
    >
      {/* SVG Canvas for High-Precision Pitch Graphics */}
      {orientation === 'horizontal' ? (
        <svg
          className="absolute inset-0 w-full h-full select-none"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Real Grass Micro-Fiber Texture Filter */}
            <filter id="grass-grain-h" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
              <feBlend mode="multiply" in="SourceGraphic" />
            </filter>

            {/* Soft Painted Chalk Line Filter */}
            <filter id="chalk-glow-h" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.6" floodColor="rgba(0,0,0,0.30)" />
            </filter>

            {/* Realistic Stadium Mower Blade Gradients (Light Sun Sheen vs Root Shadow) */}
            <linearGradient id="premier-light-band-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.02)" />
              <stop offset="25%" stopColor="rgba(255, 255, 255, 0.065)" />
              <stop offset="50%" stopColor="rgba(74, 222, 128, 0.07)" />
              <stop offset="75%" stopColor="rgba(255, 255, 255, 0.065)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
            </linearGradient>

            <linearGradient id="premier-dark-band-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 0, 0, 0.14)" />
              <stop offset="30%" stopColor="rgba(5, 38, 16, 0.22)" />
              <stop offset="50%" stopColor="rgba(0, 0, 0, 0.24)" />
              <stop offset="70%" stopColor="rgba(5, 38, 16, 0.22)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.14)" />
            </linearGradient>

            {/* Premier League Mown Lawn Stripes (Horizontal Pitch) */}
            <pattern id="grass-stripes-h" width="100" height="700" patternUnits="userSpaceOnUse">
              {/* Light Mower Band */}
              <rect x="0" y="0" width="50" height="700" fill="url(#premier-light-band-h)" />
              <rect x="1" y="0" width="48" height="700" fill="rgba(74, 222, 128, 0.03)" />
              {/* Central Roller Pressure Highlight */}
              <line x1="25" y1="0" x2="25" y2="700" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" opacity="0.4" />
              
              {/* Dark Mower Band */}
              <rect x="50" y="0" width="50" height="700" fill="url(#premier-dark-band-h)" />
              <rect x="51" y="0" width="48" height="700" fill="rgba(5, 35, 15, 0.16)" />
              {/* Central Dark Roller Furrow */}
              <line x1="75" y1="0" x2="75" y2="700" stroke="rgba(0, 0, 0, 0.18)" strokeWidth="4" opacity="0.5" />

              {/* Roller Track Pressure Seams & Blade Direction Sheen */}
              <line x1="0" y1="0" x2="0" y2="700" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
              <line x1="50" y1="0" x2="50" y2="700" stroke="rgba(0, 0, 0, 0.26)" strokeWidth="1.5" />
              <line x1="51" y1="0" x2="51" y2="700" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.8" />

              {/* Mower Wheel Tracks */}
              <line x1="16.5" y1="0" x2="16.5" y2="700" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.75" />
              <line x1="33.5" y1="0" x2="33.5" y2="700" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.75" />
              <line x1="66.5" y1="0" x2="66.5" y2="700" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="0.75" />
              <line x1="83.5" y1="0" x2="83.5" y2="700" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="0.75" />

              {/* Transverse Cylinder Cutter Reel Lines */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="100" y2="150" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="200" x2="100" y2="200" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="250" x2="100" y2="250" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="300" x2="100" y2="300" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="350" x2="100" y2="350" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="400" x2="100" y2="400" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="450" x2="100" y2="450" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="500" x2="100" y2="500" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="550" x2="100" y2="550" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="600" x2="100" y2="600" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="0" y1="650" x2="100" y2="650" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
            </pattern>

            {/* Checkerboard Mown Grid */}
            <pattern id="grass-checker-h" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="50" height="50" fill="rgba(255, 255, 255, 0.07)" />
              <rect x="50" y="0" width="50" height="50" fill="rgba(0, 0, 0, 0.11)" />
              <rect x="0" y="50" width="50" height="50" fill="rgba(0, 0, 0, 0.11)" />
              <rect x="50" y="50" width="50" height="50" fill="rgba(255, 255, 255, 0.07)" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" />
            </pattern>

            {/* Diamond Cut Grass Pattern */}
            <pattern id="grass-diamond-h" width="90" height="90" patternUnits="userSpaceOnUse">
              <polygon points="45,0 90,45 45,90 0,45" fill="rgba(255, 255, 255, 0.065)" />
              <polygon points="45,0 90,0 90,45" fill="rgba(0, 0, 0, 0.09)" />
              <polygon points="0,45 0,90 45,90" fill="rgba(0, 0, 0, 0.09)" />
              <polygon points="0,0 45,0 0,45" fill="rgba(0, 0, 0, 0.04)" />
              <polygon points="90,45 90,90 45,90" fill="rgba(0, 0, 0, 0.04)" />
            </pattern>

            {/* Concentric Mown Rings */}
            <radialGradient id="grass-rings-h" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="12%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="37%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="62%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="87%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.09)" />
            </radialGradient>

            {/* Desso Hybrid Pitch Reinforced Fibers */}
            <pattern id="grass-hybrid-h" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="25" height="50" fill="rgba(255, 255, 255, 0.06)" />
              <rect x="25" y="0" width="25" height="50" fill="rgba(0, 0, 0, 0.08)" />
              <line x1="0" y1="25" x2="50" y2="25" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
            </pattern>

            {/* Winter Match Frost Crystals Texture */}
            <pattern id="grass-frost-h" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="30" height="60" fill="rgba(255, 255, 255, 0.10)" />
              <rect x="30" y="0" width="30" height="60" fill="rgba(186, 230, 253, 0.06)" />
              <circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.35)" />
              <circle cx="45" cy="45" r="1.5" fill="rgba(255,255,255,0.35)" />
            </pattern>

            {/* 4G Synthetic Infill Crumb Micro-Dots */}
            <pattern id="turf-synthetic-h" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="rgba(0, 0, 0, 0.18)" />
              <circle cx="15" cy="15" r="1" fill="rgba(0, 0, 0, 0.18)" />
              <path d="M 20 0 L 0 20" fill="none" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="0.5" />
            </pattern>

            {/* Micro-Grass Fiber Mesh */}
            <pattern id="turf-fibers-h" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="2" y1="0" x2="2" y2="10" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
              <line x1="7" y1="0" x2="7" y2="10" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="0.5" />
            </pattern>

            {/* High-Fidelity 3D Hexagonal Goal Net Pattern */}
            <pattern id="goal-net-hex-h" width="8" height="8" patternUnits="userSpaceOnUse">
              <path
                d="M 4,0 L 8,2.5 L 8,5.5 L 4,8 L 0,5.5 L 0,2.5 Z"
                fill="rgba(0,0,0,0.18)"
                stroke="rgba(255, 255, 255, 0.70)"
                strokeWidth="0.7"
              />
            </pattern>

            {/* Goal Post Cylindrical Metal Gradient */}
            <linearGradient id="post-white-h" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="25%" stopColor="#f3f4f6" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            <linearGradient id="post-crossbar-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            {/* Stadium Pitch Atmospheric Vignette */}
            <radialGradient id="pitch-vignette-h" cx="50%" cy="50%" r="70%">
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="85%" stopColor="rgba(0,0,0,0.18)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
            </radialGradient>

            {/* Sun Day Specular Turf Glare */}
            <radialGradient id="day-sun-glare-h" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.10)" />
              <stop offset="45%" stopColor="rgba(255, 255, 255, 0.03)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* 4-Corner Stadium Floodlight Cones */}
            <radialGradient id="floodlight-top-left-h" cx="0%" cy="0%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="floodlight-top-right-h" cx="100%" cy="0%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="floodlight-bottom-left-h" cx="0%" cy="100%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="floodlight-bottom-right-h" cx="100%" cy="100%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* Sunset Stadium Sky Glow */}
            <linearGradient id="sunset-overlay-h" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.22)" />
              <stop offset="45%" stopColor="rgba(217, 70, 239, 0.12)" />
              <stop offset="100%" stopColor="rgba(30, 58, 138, 0.25)" />
            </linearGradient>
          </defs>

          {/* Grass Organic Micro-Fiber Texture Layer */}
          <rect x="0" y="0" width="1000" height="700" fill="url(#turf-fibers-h)" />

          {/* Dynamic Grass Lawn Mowing Style */}
          {texture === 'striped' && (
            <>
              <rect x="0" y="0" width="1000" height="700" fill="url(#grass-stripes-h)" />
              {/* Premier League Headland Perimeter Mower Turnaround Band */}
              <rect x="0" y="0" width="1000" height="700" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="50" />
              <rect x="25" y="25" width="950" height="650" fill="none" stroke="rgba(0, 0, 0, 0.12)" strokeWidth="1.2" />
              <line x1="50" y1="50" x2="950" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="50" y1="650" x2="950" y2="650" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </>
          )}
          {texture === 'checkerboard' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#grass-checker-h)" />
          )}
          {texture === 'circular' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#grass-rings-h)" />
          )}
          {texture === 'diamond_cut' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#grass-diamond-h)" />
          )}
          {texture === 'deep_emerald' && (
            <>
              <rect x="0" y="0" width="1000" height="700" fill="url(#grass-stripes-h)" opacity="0.4" />
            </>
          )}
          {texture === 'hybrid_stadium' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#grass-hybrid-h)" />
          )}
          {texture === 'frost_pitch' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#grass-frost-h)" />
          )}
          {texture === 'retro_grass' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#grass-stripes-h)" opacity="0.65" />
          )}
          {texture === 'indoor_turf' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#turf-synthetic-h)" />
          )}
          {texture === 'vintage_classic' && (
            <>
              <rect x="0" y="0" width="1000" height="700" fill="url(#grass-stripes-h)" opacity="0.5" />
              {/* Natural worn center/goal turf spots */}
              <circle cx="500" cy="350" r="110" fill="rgba(161, 98, 7, 0.08)" />
              <circle cx="130" cy="350" r="65" fill="rgba(161, 98, 7, 0.12)" />
              <circle cx="870" cy="350" r="65" fill="rgba(161, 98, 7, 0.12)" />
            </>
          )}

          {/* Authentic Goalkeeper & Penalty High-Traffic Turf Wear */}
          <g opacity={texture === 'tactical_dark' ? 0 : 0.35}>
            {/* Left Goalmouth Scuff & Turf Thinning */}
            <ellipse cx="65" cy="350" rx="14" ry="40" fill="rgba(120, 53, 15, 0.20)" />
            <circle cx="160" cy="350" r="8" fill="rgba(120, 53, 15, 0.14)" />
            {/* Right Goalmouth Scuff & Turf Thinning */}
            <ellipse cx="935" cy="350" rx="14" ry="40" fill="rgba(120, 53, 15, 0.20)" />
            <circle cx="840" cy="350" r="8" fill="rgba(120, 53, 15, 0.14)" />
            {/* Center Spot Scuff */}
            <circle cx="500" cy="350" r="7" fill="rgba(120, 53, 15, 0.10)" />
          </g>

          {/* Goal Structure (Horizontal - Left and Right 3D Goals with Stanchions & Hex Nets) */}
          {showGoals && (
            <g>
              {/* Left Goal Depth Drop Shadow on Turf */}
              <rect x="14" y="258" width="38" height="184" fill="rgba(0,0,0,0.45)" rx="4" />
              {/* Left Goal Hexagonal Net */}
              <rect x="16" y="260" width="34" height="180" fill="url(#goal-net-hex-h)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              {/* Goal Rear Ground Support Bar */}
              <line x1="16" y1="260" x2="16" y2="440" stroke="url(#post-white-h)" strokeWidth="4.5" />
              <line x1="16" y1="260" x2="50" y2="260" stroke="url(#post-white-h)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="16" y1="440" x2="50" y2="440" stroke="url(#post-white-h)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Goal Line Posts & Crossbar */}
              <line x1="50" y1="258" x2="50" y2="442" stroke="url(#post-crossbar-h)" strokeWidth="6" strokeLinecap="square" />

              {/* Right Goal Depth Drop Shadow on Turf */}
              <rect x="948" y="258" width="38" height="184" fill="rgba(0,0,0,0.45)" rx="4" />
              {/* Right Goal Hexagonal Net */}
              <rect x="950" y="260" width="34" height="180" fill="url(#goal-net-hex-h)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              {/* Goal Rear Ground Support Bar */}
              <line x1="984" y1="260" x2="984" y2="440" stroke="url(#post-white-h)" strokeWidth="4.5" />
              <line x1="950" y1="260" x2="984" y2="260" stroke="url(#post-white-h)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="950" y1="440" x2="984" y2="440" stroke="url(#post-white-h)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Goal Line Posts & Crossbar */}
              <line x1="950" y1="258" x2="950" y2="442" stroke="url(#post-crossbar-h)" strokeWidth="6" strokeLinecap="square" />
            </g>
          )}

          {/* Professional Pitch Markings (Accurate IFAB Regulation Ratios with Chalk Filter) */}
          <g stroke={lineStroke} strokeWidth="3" fill="none" filter="url(#chalk-glow-h)">
            {/* Outer Boundary Touchlines */}
            <rect x="50" y="50" width="900" height="600" />

            {/* Halfway Line */}
            <line x1="500" y1="50" x2="500" y2="650" />

            {/* Center Circle & Center Spot */}
            <circle cx="500" cy="350" r="95" />
            <circle cx="500" cy="350" r="4.5" fill={lineStroke} />

            {/* Left Penalty Area (18-Yard Box & 6-Yard Box) */}
            <rect x="50" y="175" width="165" height="350" />
            <rect x="50" y="260" width="55" height="180" />
            {/* Penalty Spot & Indicator Ring */}
            <circle cx="160" cy="350" r="4.5" fill={lineStroke} />
            <circle cx="160" cy="350" r="9" stroke={innerLineStroke} strokeWidth="1.2" />
            {/* Penalty D-Arc (9.15m from penalty spot) */}
            <path d="M 215 285 A 95 95 0 0 1 215 415" />

            {/* Right Penalty Area (18-Yard Box & 6-Yard Box) */}
            <rect x="785" y="175" width="165" height="350" />
            <rect x="895" y="260" width="55" height="180" />
            {/* Penalty Spot & Indicator Ring */}
            <circle cx="840" cy="350" r="4.5" fill={lineStroke} />
            <circle cx="840" cy="350" r="9" stroke={innerLineStroke} strokeWidth="1.2" />
            {/* Penalty D-Arc */}
            <path d="M 785 285 A 95 95 0 0 0 785 415" />

            {/* Corner Arcs (1-Yard Radius) */}
            <path d="M 75 50 A 25 25 0 0 0 50 75" />
            <path d="M 925 50 A 25 25 0 0 1 950 75" />
            <path d="M 50 625 A 25 25 0 0 0 75 650" />
            <path d="M 950 625 A 25 25 0 0 1 925 650" />

            {/* Corner Regulation Tick Marks (9.15m) */}
            <line x1="141" y1="46" x2="141" y2="50" stroke={lineStroke} strokeWidth="2.5" />
            <line x1="859" y1="46" x2="859" y2="50" stroke={lineStroke} strokeWidth="2.5" />
            <line x1="141" y1="650" x2="141" y2="654" stroke={lineStroke} strokeWidth="2.5" />
            <line x1="859" y1="650" x2="859" y2="654" stroke={lineStroke} strokeWidth="2.5" />

            {/* Technical Area Markings */}
            {showTechnicalArea && (
              <>
                <g>
                  <rect
                    x="280"
                    y="662"
                    width="130"
                    height="26"
                    stroke={innerLineStroke}
                    strokeWidth="1.4"
                    strokeDasharray="4,4"
                  />
                  <text x="345" y="679" textAnchor="middle" fill={innerLineStroke} fontSize="9" fontWeight="bold" letterSpacing="1">
                    TECHNICAL AREA
                  </text>
                </g>
                <g>
                  <rect
                    x="590"
                    y="662"
                    width="130"
                    height="26"
                    stroke={innerLineStroke}
                    strokeWidth="1.4"
                    strokeDasharray="4,4"
                  />
                  <text x="655" y="679" textAnchor="middle" fill={innerLineStroke} fontSize="9" fontWeight="bold" letterSpacing="1">
                    TECHNICAL AREA
                  </text>
                </g>
              </>
            )}
          </g>

          {/* Realistic Corner Flags */}
          {showCornerFlags && (
            <g>
              {/* Top Left Flag */}
              <ellipse cx="48" cy="51" rx="4" ry="2" fill="rgba(0,0,0,0.4)" />
              <line x1="50" y1="50" x2="35" y2="35" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="35,35 52,30 43,47" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="50" cy="50" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

              {/* Top Right Flag */}
              <ellipse cx="952" cy="51" rx="4" ry="2" fill="rgba(0,0,0,0.4)" />
              <line x1="950" y1="50" x2="965" y2="35" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="965,35 948,30 957,47" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="950" cy="50" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

              {/* Bottom Left Flag */}
              <ellipse cx="48" cy="651" rx="4" ry="2" fill="rgba(0,0,0,0.4)" />
              <line x1="50" y1="650" x2="35" y2="665" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="35,665 52,670 43,653" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="50" cy="650" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

              {/* Bottom Right Flag */}
              <ellipse cx="952" cy="651" rx="4" ry="2" fill="rgba(0,0,0,0.4)" />
              <line x1="950" y1="650" x2="965" y2="665" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="965,665 948,670 957,653" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="950" cy="650" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
            </g>
          )}

          {/* Ambient Lighting & Atmosphere */}
          {lighting === 'day' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#day-sun-glare-h)" pointerEvents="none" />
          )}

          {/* Ambient Pitch Vignette */}
          <rect x="0" y="0" width="1000" height="700" fill="url(#pitch-vignette-h)" pointerEvents="none" />

          {/* Night Floodlight Multi-Ray Stadium Lighting */}
          {lighting === 'floodlight_night' && (
            <>
              <rect x="0" y="0" width="1000" height="700" fill="url(#floodlight-top-left-h)" pointerEvents="none" />
              <rect x="0" y="0" width="1000" height="700" fill="url(#floodlight-top-right-h)" pointerEvents="none" />
              <rect x="0" y="0" width="1000" height="700" fill="url(#floodlight-bottom-left-h)" pointerEvents="none" />
              <rect x="0" y="0" width="1000" height="700" fill="url(#floodlight-bottom-right-h)" pointerEvents="none" />
              <rect x="0" y="0" width="1000" height="700" fill="rgba(0, 0, 0, 0.16)" pointerEvents="none" />
            </>
          )}

          {/* Sunset Lighting */}
          {lighting === 'sunset' && (
            <rect x="0" y="0" width="1000" height="700" fill="url(#sunset-overlay-h)" pointerEvents="none" />
          )}
        </svg>
      ) : (
        /* Vertical Pitch Rendering */
        <svg
          className="absolute inset-0 w-full h-full select-none"
          viewBox="0 0 700 1000"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Real Grass Micro-Fiber Texture Filter Vertical */}
            <filter id="grass-grain-v" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
              <feBlend mode="multiply" in="SourceGraphic" />
            </filter>

            {/* Soft Painted Chalk Line Filter Vertical */}
            <filter id="chalk-glow-v" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.6" floodColor="rgba(0,0,0,0.30)" />
            </filter>

            {/* Realistic Stadium Mower Blade Gradients Vertical */}
            <linearGradient id="premier-light-band-v" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.02)" />
              <stop offset="25%" stopColor="rgba(255, 255, 255, 0.065)" />
              <stop offset="50%" stopColor="rgba(74, 222, 128, 0.07)" />
              <stop offset="75%" stopColor="rgba(255, 255, 255, 0.065)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
            </linearGradient>

            <linearGradient id="premier-dark-band-v" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 0, 0, 0.14)" />
              <stop offset="30%" stopColor="rgba(5, 38, 16, 0.22)" />
              <stop offset="50%" stopColor="rgba(0, 0, 0, 0.24)" />
              <stop offset="70%" stopColor="rgba(5, 38, 16, 0.22)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.14)" />
            </linearGradient>

            {/* Premier League Mown Lawn Stripes (Vertical Pitch) */}
            <pattern id="grass-stripes-v" width="700" height="100" patternUnits="userSpaceOnUse">
              {/* Light Mower Band */}
              <rect x="0" y="0" width="700" height="50" fill="url(#premier-light-band-v)" />
              <rect x="0" y="1" width="700" height="48" fill="rgba(74, 222, 128, 0.03)" />
              {/* Central Roller Pressure Highlight */}
              <line x1="0" y1="25" x2="700" y2="25" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" opacity="0.4" />
              
              {/* Dark Mower Band */}
              <rect x="0" y="50" width="700" height="50" fill="url(#premier-dark-band-v)" />
              <rect x="0" y="51" width="700" height="48" fill="rgba(5, 35, 15, 0.16)" />
              {/* Central Dark Roller Furrow */}
              <line x1="0" y1="75" x2="700" y2="75" stroke="rgba(0, 0, 0, 0.18)" strokeWidth="4" opacity="0.5" />

              {/* Roller Track Pressure Seams & Blade Direction Sheen */}
              <line x1="0" y1="0" x2="700" y2="0" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
              <line x1="0" y1="50" x2="700" y2="50" stroke="rgba(0, 0, 0, 0.26)" strokeWidth="1.5" />
              <line x1="0" y1="51" x2="700" y2="51" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.8" />

              {/* Mower Wheel Track Imprints */}
              <line x1="0" y1="16.5" x2="700" y2="16.5" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.75" />
              <line x1="0" y1="33.5" x2="700" y2="33.5" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.75" />
              <line x1="0" y1="66.5" x2="700" y2="66.5" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="0.75" />
              <line x1="0" y1="83.5" x2="700" y2="83.5" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="0.75" />

              {/* Transverse Cylinder Cutter Reel Lines */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="100" y1="0" x2="100" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="150" y1="0" x2="150" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="200" y1="0" x2="200" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="250" y1="0" x2="250" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="300" y1="0" x2="300" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="350" y1="0" x2="350" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="400" y1="0" x2="400" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="450" y1="0" x2="450" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="500" y1="0" x2="500" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="550" y1="0" x2="550" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="600" y1="0" x2="600" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
              <line x1="650" y1="0" x2="650" y2="100" stroke="rgba(255, 255, 255, 0.015)" strokeWidth="0.5" />
            </pattern>

            {/* Checkerboard Mown Grid */}
            <pattern id="grass-checker-v" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="50" height="50" fill="rgba(255, 255, 255, 0.07)" />
              <rect x="50" y="0" width="50" height="50" fill="rgba(0, 0, 0, 0.11)" />
              <rect x="0" y="50" width="50" height="50" fill="rgba(0, 0, 0, 0.11)" />
              <rect x="50" y="50" width="50" height="50" fill="rgba(255, 255, 255, 0.07)" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" />
            </pattern>

            {/* Diamond Cut Grass Pattern */}
            <pattern id="grass-diamond-v" width="90" height="90" patternUnits="userSpaceOnUse">
              <polygon points="45,0 90,45 45,90 0,45" fill="rgba(255, 255, 255, 0.065)" />
              <polygon points="45,0 90,0 90,45" fill="rgba(0, 0, 0, 0.09)" />
              <polygon points="0,45 0,90 45,90" fill="rgba(0, 0, 0, 0.09)" />
            </pattern>

            {/* Concentric Mown Rings */}
            <radialGradient id="grass-rings-v" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="12%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="37%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="62%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="75%" stopColor="rgba(255,255,255,0.09)" />
              <stop offset="87%" stopColor="rgba(0,0,0,0.09)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.09)" />
            </radialGradient>

            {/* Desso Hybrid Pitch Reinforced Fibers */}
            <pattern id="grass-hybrid-v" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="50" height="25" fill="rgba(255, 255, 255, 0.06)" />
              <rect x="0" y="25" width="50" height="25" fill="rgba(0, 0, 0, 0.08)" />
            </pattern>

            {/* Winter Match Frost Crystals Texture */}
            <pattern id="grass-frost-v" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="60" height="30" fill="rgba(255, 255, 255, 0.10)" />
              <rect x="0" y="30" width="60" height="30" fill="rgba(186, 230, 253, 0.06)" />
              <circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.35)" />
              <circle cx="45" cy="45" r="1.5" fill="rgba(255,255,255,0.35)" />
            </pattern>

            {/* 4G Synthetic Infill Crumb Micro-Dots */}
            <pattern id="turf-synthetic-v" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="rgba(0, 0, 0, 0.18)" />
              <circle cx="15" cy="15" r="1" fill="rgba(0, 0, 0, 0.18)" />
            </pattern>

            {/* Micro-Grass Fiber Mesh */}
            <pattern id="turf-fibers-v" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="2" x2="10" y2="2" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
              <line x1="0" y1="7" x2="10" y2="7" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="0.5" />
            </pattern>

            {/* Hexagonal Goal Net Pattern */}
            <pattern id="goal-net-hex-v" width="8" height="8" patternUnits="userSpaceOnUse">
              <path
                d="M 4,0 L 8,2.5 L 8,5.5 L 4,8 L 0,5.5 L 0,2.5 Z"
                fill="rgba(0,0,0,0.18)"
                stroke="rgba(255, 255, 255, 0.70)"
                strokeWidth="0.7"
              />
            </pattern>

            {/* Goal Post Metal Gradient Vertical */}
            <linearGradient id="post-white-v" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="25%" stopColor="#f3f4f6" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            <linearGradient id="post-crossbar-v" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            {/* Pitch Vignette Overlay */}
            <radialGradient id="pitch-vignette-v" cx="50%" cy="50%" r="70%">
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="85%" stopColor="rgba(0,0,0,0.18)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
            </radialGradient>

            {/* Day Sun Glare */}
            <radialGradient id="day-sun-glare-v" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.10)" />
              <stop offset="45%" stopColor="rgba(255, 255, 255, 0.03)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* Floodlight Beams Vertical */}
            <radialGradient id="floodlight-top-left-v" cx="0%" cy="0%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="floodlight-top-right-v" cx="100%" cy="0%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="floodlight-bottom-left-v" cx="0%" cy="100%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="floodlight-bottom-right-v" cx="100%" cy="100%" r="85%">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.35)" />
              <stop offset="35%" stopColor="rgba(254, 240, 138, 0.12)" />
              <stop offset="75%" stopColor="rgba(254, 240, 138, 0.025)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>

            {/* Sunset Overlay Vertical */}
            <linearGradient id="sunset-overlay-v" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.22)" />
              <stop offset="45%" stopColor="rgba(217, 70, 239, 0.12)" />
              <stop offset="100%" stopColor="rgba(30, 58, 138, 0.25)" />
            </linearGradient>
          </defs>

          {/* Grass Organic Micro-Fiber Texture Layer */}
          <rect x="0" y="0" width="700" height="1000" fill="url(#turf-fibers-v)" />

          {/* Dynamic Grass Lawn Mowing Style */}
          {texture === 'striped' && (
            <>
              <rect x="0" y="0" width="700" height="1000" fill="url(#grass-stripes-v)" />
              {/* Premier League Headland Perimeter Mower Turnaround Band Vertical */}
              <rect x="0" y="0" width="700" height="1000" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="50" />
              <rect x="25" y="25" width="650" height="950" fill="none" stroke="rgba(0, 0, 0, 0.12)" strokeWidth="1.2" />
              <line x1="50" y1="50" x2="50" y2="950" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="650" y1="50" x2="650" y2="950" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </>
          )}
          {texture === 'checkerboard' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-checker-v)" />
          )}
          {texture === 'circular' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-rings-v)" />
          )}
          {texture === 'diamond_cut' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-diamond-v)" />
          )}
          {texture === 'deep_emerald' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-stripes-v)" opacity="0.4" />
          )}
          {texture === 'hybrid_stadium' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-hybrid-v)" />
          )}
          {texture === 'frost_pitch' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-frost-v)" />
          )}
          {texture === 'retro_grass' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#grass-stripes-v)" opacity="0.65" />
          )}
          {texture === 'indoor_turf' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#turf-synthetic-v)" />
          )}
          {texture === 'vintage_classic' && (
            <>
              <rect x="0" y="0" width="700" height="1000" fill="url(#grass-stripes-v)" opacity="0.5" />
              {/* Natural worn center/goal turf spots */}
              <circle cx="350" cy="500" r="110" fill="rgba(161, 98, 7, 0.08)" />
              <circle cx="350" cy="130" r="65" fill="rgba(161, 98, 7, 0.12)" />
              <circle cx="350" cy="870" r="65" fill="rgba(161, 98, 7, 0.12)" />
            </>
          )}

          {/* Goal Scuff Areas Vertical */}
          <g opacity={texture === 'tactical_dark' ? 0 : 0.35}>
            {/* Top Goalmouth Scuff */}
            <ellipse cx="350" cy="65" rx="40" ry="14" fill="rgba(120, 53, 15, 0.20)" />
            <circle cx="350" cy="160" r="8" fill="rgba(120, 53, 15, 0.14)" />
            {/* Bottom Goalmouth Scuff */}
            <ellipse cx="350" cy="935" rx="40" ry="14" fill="rgba(120, 53, 15, 0.20)" />
            <circle cx="350" cy="840" r="8" fill="rgba(120, 53, 15, 0.14)" />
            {/* Center Spot Scuff */}
            <circle cx="350" cy="500" r="7" fill="rgba(120, 53, 15, 0.10)" />
          </g>

          {/* Goal Structure Vertical (Top & Bottom Goals) */}
          {showGoals && (
            <g>
              {/* Top Goal */}
              <rect x="258" y="14" width="184" height="38" fill="rgba(0,0,0,0.45)" rx="4" />
              <rect x="260" y="16" width="180" height="34" fill="url(#goal-net-hex-v)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              <line x1="260" y1="16" x2="440" y2="16" stroke="url(#post-white-v)" strokeWidth="4.5" />
              <line x1="260" y1="16" x2="260" y2="50" stroke="url(#post-white-v)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="440" y1="16" x2="440" y2="50" stroke="url(#post-white-v)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="258" y1="50" x2="442" y2="50" stroke="url(#post-crossbar-v)" strokeWidth="6" strokeLinecap="square" />

              {/* Bottom Goal */}
              <rect x="258" y="948" width="184" height="38" fill="rgba(0,0,0,0.45)" rx="4" />
              <rect x="260" y="950" width="180" height="34" fill="url(#goal-net-hex-v)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              <line x1="260" y1="984" x2="440" y2="984" stroke="url(#post-white-v)" strokeWidth="4.5" />
              <line x1="260" y1="950" x2="260" y2="984" stroke="url(#post-white-v)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="440" y1="950" x2="440" y2="984" stroke="url(#post-white-v)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="258" y1="950" x2="442" y2="950" stroke="url(#post-crossbar-v)" strokeWidth="6" strokeLinecap="square" />
            </g>
          )}

          {/* Professional Pitch Markings Vertical */}
          <g stroke={lineStroke} strokeWidth="3" fill="none" filter="url(#chalk-glow-v)">
            {/* Touchlines */}
            <rect x="50" y="50" width="600" height="900" />

            {/* Halfway Line */}
            <line x1="50" y1="500" x2="650" y2="500" />

            {/* Center Circle */}
            <circle cx="350" cy="500" r="95" />
            <circle cx="350" cy="500" r="4.5" fill={lineStroke} />

            {/* Top Penalty Area */}
            <rect x="175" y="50" width="350" height="165" />
            <rect x="260" y="50" width="180" height="55" />
            <circle cx="350" cy="160" r="4.5" fill={lineStroke} />
            <circle cx="350" cy="160" r="9" stroke={innerLineStroke} strokeWidth="1.2" />
            <path d="M 285 215 A 95 95 0 0 0 415 215" />

            {/* Bottom Penalty Area */}
            <rect x="175" y="785" width="350" height="165" />
            <rect x="260" y="895" width="180" height="55" />
            <circle cx="350" cy="840" r="4.5" fill={lineStroke} />
            <circle cx="350" cy="840" r="9" stroke={innerLineStroke} strokeWidth="1.2" />
            <path d="M 285 785 A 95 95 0 0 1 415 785" />

            {/* Corner Arcs */}
            <path d="M 50 75 A 25 25 0 0 1 75 50" />
            <path d="M 625 50 A 25 25 0 0 1 650 75" />
            <path d="M 50 925 A 25 25 0 0 0 75 950" />
            <path d="M 625 950 A 25 25 0 0 0 650 925" />

            {/* Corner Tick Marks */}
            <line x1="46" y1="141" x2="50" y2="141" stroke={lineStroke} strokeWidth="2.5" />
            <line x1="650" y1="141" x2="654" y2="141" stroke={lineStroke} strokeWidth="2.5" />
            <line x1="46" y1="859" x2="50" y2="859" stroke={lineStroke} strokeWidth="2.5" />
            <line x1="650" y1="859" x2="654" y2="859" stroke={lineStroke} strokeWidth="2.5" />

            {/* Technical Area Vertical */}
            {showTechnicalArea && (
              <>
                <g>
                  <rect
                    x="12"
                    y="280"
                    width="26"
                    height="130"
                    stroke={innerLineStroke}
                    strokeWidth="1.4"
                    strokeDasharray="4,4"
                  />
                </g>
                <g>
                  <rect
                    x="12"
                    y="590"
                    width="26"
                    height="130"
                    stroke={innerLineStroke}
                    strokeWidth="1.4"
                    strokeDasharray="4,4"
                  />
                </g>
              </>
            )}
          </g>

          {/* Corner Flags Vertical */}
          {showCornerFlags && (
            <g>
              {/* Top Left Flag */}
              <ellipse cx="51" cy="48" rx="2" ry="4" fill="rgba(0,0,0,0.4)" />
              <line x1="50" y1="50" x2="35" y2="35" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="35,35 30,52 47,43" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="50" cy="50" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

              {/* Top Right Flag */}
              <ellipse cx="651" cy="48" rx="2" ry="4" fill="rgba(0,0,0,0.4)" />
              <line x1="650" y1="50" x2="665" y2="35" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="665,35 670,52 653,43" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="650" cy="50" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

              {/* Bottom Left Flag */}
              <ellipse cx="51" cy="952" rx="2" ry="4" fill="rgba(0,0,0,0.4)" />
              <line x1="50" y1="950" x2="35" y2="965" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="35,965 30,948 47,957" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="50" cy="950" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />

              {/* Bottom Right Flag */}
              <ellipse cx="651" cy="952" rx="2" ry="4" fill="rgba(0,0,0,0.4)" />
              <line x1="650" y1="950" x2="665" y2="965" stroke="#f1f5f9" strokeWidth="2.75" />
              <polygon points="665,965 670,948 653,957" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.75" />
              <circle cx="650" cy="950" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.5" />
            </g>
          )}

          {/* Ambient Lighting */}
          {lighting === 'day' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#day-sun-glare-v)" pointerEvents="none" />
          )}

          {/* Pitch Vignette */}
          <rect x="0" y="0" width="700" height="1000" fill="url(#pitch-vignette-v)" pointerEvents="none" />

          {/* Floodlights Vertical */}
          {lighting === 'floodlight_night' && (
            <>
              <rect x="0" y="0" width="700" height="1000" fill="url(#floodlight-top-left-v)" pointerEvents="none" />
              <rect x="0" y="0" width="700" height="1000" fill="url(#floodlight-top-right-v)" pointerEvents="none" />
              <rect x="0" y="0" width="700" height="1000" fill="url(#floodlight-bottom-left-v)" pointerEvents="none" />
              <rect x="0" y="0" width="700" height="1000" fill="url(#floodlight-bottom-right-v)" pointerEvents="none" />
              <rect x="0" y="0" width="700" height="1000" fill="rgba(0, 0, 0, 0.16)" pointerEvents="none" />
            </>
          )}

          {/* Sunset Vertical */}
          {lighting === 'sunset' && (
            <rect x="0" y="0" width="700" height="1000" fill="url(#sunset-overlay-v)" pointerEvents="none" />
          )}
        </svg>
      )}

      {/* Children Layer (Players, Tactical Lines, Heatmaps, Keyframe Ghosting) */}
      {children}
    </div>
  );
};

export const PitchSVG = React.memo(PitchSVGComponent);
