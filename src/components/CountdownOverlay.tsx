import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CountdownOverlayProps {
  countdownValue: number | null; // 3, 2, 1
  countdownFraction: number; // 0.0 to 1.0
  mode?: 'sequential' | 'unit';
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  countdownValue,
  countdownFraction,
  mode = 'sequential',
}) => {
  if (countdownValue === null) return null;

  const isUnit = mode === 'unit';

  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-slate-950/75 pointer-events-none rounded-2xl overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={countdownValue}
          initial={{ scale: 0.7, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center"
        >
          {/* Circular Countdown Glow Plate */}
          <div
            className={`relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-900 border-2 ${
              isUnit
                ? 'border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.55)]'
                : 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
            }`}
          >
            {/* SVG Ring Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-1">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800"
              />
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="276"
                strokeDashoffset={276 * (1 - countdownFraction)}
                className={`transition-all duration-75 ${
                  isUnit ? 'text-sky-400' : 'text-emerald-400'
                }`}
              />
            </svg>

            {/* Glowing Big Number */}
            <span
              className={`text-4xl sm:text-6xl font-black tracking-tighter font-mono ${
                isUnit ? 'text-sky-400' : 'text-emerald-400'
              }`}
            >
              {countdownValue}
            </span>
          </div>

          {/* Subtitle Badge */}
          <div
            className={`mt-3 px-3 py-0.5 rounded-full bg-slate-900 border text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-md ${
              isUnit
                ? 'border-sky-500/40 text-sky-300'
                : 'border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isUnit ? 'TEAM UNIT MOVE' : 'TACTIC PLAYBACK'}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
