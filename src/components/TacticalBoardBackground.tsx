import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const TacticalBoardBackground: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* Base Canvas Gradient tailored for pro tactical software */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isLight
            ? 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]'
            : 'bg-gradient-to-b from-[#090d16] via-[#060911] to-[#04060a]'
        }`}
      />

      {/* Subtle Pro Tactical Ambient Radial Sheen */}
      {isLight ? (
        <>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[140px] opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 70%)',
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full blur-[150px] opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.09) 35%, rgba(30, 58, 138, 0.05) 60%, transparent 75%)',
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full blur-[130px] opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Pure Vector Tactical Coaching Grid Matrix (Crisp, High-Tech, Non-Distracting) */}
      <svg
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isLight ? 'opacity-80' : 'opacity-65'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Micro Grid Dot Cell (32x32) */}
          <pattern
            id="tactical-tool-micro-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="16"
              cy="16"
              r={isLight ? '0.85' : '0.75'}
              fill={isLight ? '#94a3b8' : '#38bdf8'}
              opacity={isLight ? '0.55' : '0.4'}
            />
          </pattern>

          {/* Major Blueprint Grid Unit (128x128) with Precision Crosshairs */}
          <pattern
            id="tactical-tool-major-grid"
            width="128"
            height="128"
            patternUnits="userSpaceOnUse"
          >
            {/* Fill with micro-grid dots */}
            <rect width="128" height="128" fill="url(#tactical-tool-micro-grid)" />

            {/* Subtle Grid Border Lines */}
            <path
              d="M 128 0 L 0 0 0 128"
              fill="none"
              stroke={isLight ? 'rgba(203, 213, 225, 0.65)' : 'rgba(30, 41, 59, 0.7)'}
              strokeWidth="0.75"
            />

            {/* Corner Crosshair Marks (+) */}
            <path
              d="M 0 5 L 0 -5 M -5 0 L 5 0"
              stroke={isLight ? '#64748b' : '#10b981'}
              strokeWidth="0.9"
              opacity={isLight ? '0.6' : '0.6'}
            />
            <path
              d="M 128 133 L 128 123 M 123 128 L 133 128"
              stroke={isLight ? '#64748b' : '#10b981'}
              strokeWidth="0.9"
              opacity={isLight ? '0.6' : '0.6'}
            />
          </pattern>
        </defs>

        {/* Applied Blueprint Background Grid */}
        <rect width="100%" height="100%" fill="url(#tactical-tool-major-grid)" />
      </svg>

      {/* Modern Coaching Suite UI Corner Accents */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 pointer-events-none opacity-40 select-none font-mono text-[9px] sm:text-[10px] tracking-wider uppercase">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLight ? 'bg-emerald-600' : 'bg-emerald-400'
              } animate-pulse`}
            />
            <span className={isLight ? 'text-slate-600 font-semibold' : 'text-slate-400 font-semibold'}>
              TACTICAL STUDIO // CANVAS
            </span>
          </div>
          <div className={isLight ? 'text-slate-400' : 'text-neutral-500'}>
            GRID: 100 × 100 PERCENTILE
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className={isLight ? 'text-slate-400' : 'text-neutral-600'}>
            BECOACH TACTICAL ENGINE
          </div>
          <div className={isLight ? 'text-slate-400' : 'text-neutral-600'}>
            VECTOR STAGE
          </div>
        </div>
      </div>

      {/* Smooth Outer Vignette Frame */}
      <div
        className={`absolute inset-0 ${
          isLight
            ? 'bg-[radial-gradient(circle_at_center,transparent_55%,rgba(226,232,240,0.6)_100%)]'
            : 'bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.65)_100%)]'
        }`}
      />
    </div>
  );
};
