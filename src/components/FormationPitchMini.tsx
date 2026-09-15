import React from 'react';
import { motion } from 'motion/react';
import { PositionCoordinates } from '../types';

interface FormationPitchMiniProps {
  positions: PositionCoordinates[];
  isCurrent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showLines?: boolean;
  className?: string;
}

const FormationPitchMiniComponent: React.FC<FormationPitchMiniProps> = ({
  positions = [],
  isCurrent = false,
  size = 'sm',
  showLabels = false,
  showLines = true,
  className = '',
}) => {
  const getRoleDotClass = (role: string) => {
    if (role === 'GK') return 'bg-amber-400 border-amber-200 shadow-[0_0_6px_rgba(251,191,36,0.9)]';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(role))
      return 'bg-sky-400 border-sky-200 shadow-[0_0_6px_rgba(56,189,248,0.9)]';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(role))
      return 'bg-emerald-400 border-emerald-200 shadow-[0_0_6px_rgba(52,211,153,0.9)]';
    return 'bg-rose-400 border-rose-200 shadow-[0_0_6px_rgba(251,113,133,0.9)]';
  };

  const aspectAndHeightClasses = {
    sm: 'aspect-[4/3.6] max-h-36',
    md: 'aspect-[4/3.6] max-h-44',
    lg: 'aspect-[4/3.6] max-h-56',
  };

  const nodeSizeClasses = {
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
  };

  const safePositions = Array.isArray(positions) ? positions : [];

  // Group positions into sorted lines (Defenders, Midfielders, Attackers) for clean tactical connectivity
  const defenders = safePositions.filter((p) => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.role)).sort((a, b) => a.x - b.x);
  const midfielders = safePositions.filter((p) => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.role)).sort((a, b) => a.x - b.x);
  const attackers = safePositions.filter((p) => ['ST', 'CF', 'LW', 'RW'].includes(p.role)).sort((a, b) => a.x - b.x);

  return (
    <div
      className={`relative w-full ${aspectAndHeightClasses[size]} rounded-xl overflow-hidden border transition-all duration-300 ${
        isCurrent
          ? 'border-emerald-400/90 shadow-[0_0_14px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/60 bg-gradient-to-b from-[#0a2312] via-[#0e2c17] to-[#0a2312]'
          : 'border-slate-800/90 group-hover:border-slate-600 bg-gradient-to-b from-[#081b0e] via-[#0c2413] to-[#081b0e]'
      } select-none ${className}`}
    >
      {/* Turf grass mowing pitch pattern */}
      <div className="absolute inset-0 flex flex-col pointer-events-none opacity-30">
        <div className="flex-1 bg-black/20" />
        <div className="flex-1 bg-white/[0.04]" />
        <div className="flex-1 bg-black/20" />
        <div className="flex-1 bg-white/[0.04]" />
        <div className="flex-1 bg-black/20" />
        <div className="flex-1 bg-white/[0.04]" />
      </div>

      {/* SVG Pitch Markings & Tactical Structure Grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Pitch boundary and zones */}
        <g stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.45">
          {/* Main Pitch Border */}
          <rect x="6" y="5" width="88" height="90" rx="1.5" />
          
          {/* Halfway Line & Center Circle */}
          <line x1="6" y1="50" x2="94" y2="50" />
          <circle cx="50" cy="50" r="11" />
          <circle cx="50" cy="50" r="1" fill="#ffffff" />
          
          {/* Penalty boxes Top (Away End) */}
          <rect x="25" y="5" width="50" height="15" />
          <rect x="36" y="5" width="28" height="5.5" />
          <path d="M 41 20 A 9 9 0 0 0 59 20" />
          
          {/* Penalty boxes Bottom (Home End) */}
          <rect x="25" y="80" width="50" height="15" />
          <rect x="36" y="89.5" width="28" height="5.5" />
          <path d="M 41 80 A 9 9 0 0 1 59 80" />

          {/* Corner Arcs */}
          <path d="M 6 8 A 3 3 0 0 0 9 5" />
          <path d="M 94 8 A 3 3 0 0 1 91 5" />
          <path d="M 6 92 A 3 3 0 0 1 9 95" />
          <path d="M 94 92 A 3 3 0 0 0 91 95" />
        </g>

        {/* Tactical Unit Connected Skeleton Lines */}
        {showLines && (
          <g stroke="currentColor" strokeWidth="0.85" strokeDasharray="2,2" opacity={isCurrent ? '0.85' : '0.4'}>
            {/* Defensive Line Connection */}
            {defenders.length > 1 && (
              <polyline
                points={defenders.map((p) => `${p.x},${p.y}`).join(' ')}
                className="text-sky-400"
                fill="none"
              />
            )}

            {/* Midfield Line Connection */}
            {midfielders.length > 1 && (
              <polyline
                points={midfielders.map((p) => `${p.x},${p.y}`).join(' ')}
                className="text-emerald-400"
                fill="none"
              />
            )}

            {/* Attack Line Connection */}
            {attackers.length > 1 && (
              <polyline
                points={attackers.map((p) => `${p.x},${p.y}`).join(' ')}
                className="text-rose-400"
                fill="none"
              />
            )}
          </g>
        )}
      </svg>

      {/* Motion Graphic: Radar Scan Sweep for Active Selection */}
      {isCurrent && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
          className="absolute inset-y-0 w-1/3 pointer-events-none skew-x-12 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent"
        />
      )}

      {/* Position Nodes */}
      {safePositions.map((pos, idx) => {
        const dotColorClass = getRoleDotClass(pos.role);
        return (
          <div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none transition-transform duration-200 group-hover:scale-115"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            {/* Active pulsing ripple ring for current formation */}
            {isCurrent && (
              <span className="absolute w-4 h-4 rounded-full animate-ping bg-emerald-400/25" />
            )}

            {/* Tactile Node Dot */}
            <div
              className={`rounded-full ${dotColorClass} ${nodeSizeClasses[size]} relative z-10`}
            />

            {showLabels && (
              <span className="mt-0.5 text-[7.5px] font-black tracking-tight px-1 py-0.2 rounded whitespace-nowrap shadow text-white/90 bg-slate-950/80 border border-white/10">
                {pos.label || pos.role}
              </span>
            )}
          </div>
        );
      })}

      {/* Active High-Tech Corner Crosshairs */}
      {isCurrent && (
        <div className="absolute inset-0 pointer-events-none rounded-xl border border-emerald-400/30">
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-emerald-400" />
        </div>
      )}
    </div>
  );
};

export const FormationPitchMini = React.memo(FormationPitchMiniComponent);
