import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Sparkles, Activity, Layers } from 'lucide-react';
import { SvgBeCoachLogo } from './LandingSvgIcons';

interface TransitionGraphicProps {
  isActive: boolean;
  onComplete: () => void;
  targetPresetName?: string;
}

export const TransitionGraphic: React.FC<TransitionGraphicProps> = ({
  isActive,
  onComplete,
  targetPresetName = 'Be Coach Tactical Board',
}) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    // Step 1: Initiating pitch render
    const t1 = setTimeout(() => setPhase(1), 300);
    // Step 2: Calibrating coordinates & formations
    const t2 = setTimeout(() => setPhase(2), 750);
    // Step 3: Match Ready & complete
    const t3 = setTimeout(() => setPhase(3), 1200);
    const t4 = setTimeout(() => {
      onComplete();
    }, 1550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      >
        {/* Dynamic Background Grid & Stadium Light Rays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950" />
        
        {/* Pitch Lines Outline overlay */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-12 border-2 border-emerald-400/40 rounded-3xl pointer-events-none flex items-center justify-center"
        >
          {/* Halfway line & center circle */}
          <div className="absolute w-full h-0.5 bg-emerald-400/40" />
          <div className="w-56 h-56 rounded-full border-2 border-emerald-400/40" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
        </motion.div>

        {/* Tactical Scan Line */}
        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent pointer-events-none"
        />

        {/* Center Card & Tactical Animation */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
          
          {/* Animated Emblem */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="w-28 h-28 rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center"
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 m-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-1 flex items-center justify-center shadow-2xl shadow-emerald-500/40"
            >
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden p-1">
                <SvgBeCoachLogo className="w-12 h-12 drop-shadow-lg animate-pulse" />
              </div>
            </motion.div>

            {/* Orbiting tactical dots */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400 absolute -top-1 left-1/2 -translate-x-1/2" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-300 shadow-md shadow-teal-300 absolute -bottom-1 left-1/2 -translate-x-1/2" />
            </motion.div>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2 mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launching Be Coach Studio</span>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight text-white">
              {targetPresetName}
            </h2>
            <p className="text-xs text-slate-400">
              Generating broadcast lawn turf, coordinates &amp; tactical roster
            </p>
          </motion.div>

          {/* Progress Bar & Phase Messages */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                {phase === 0 && 'Allocating pitch canvas...'}
                {phase === 1 && 'Applying turf textures & floodlights...'}
                {phase === 2 && 'Positioning 11v11 tactical formation...'}
                {phase === 3 && 'Be Coach Board Ready!'}
              </span>
              <span className="text-slate-400 font-mono">
                {phase === 0 && '25%'}
                {phase === 1 && '60%'}
                {phase === 2 && '88%'}
                {phase === 3 && '100%'}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={{
                  width: phase === 0 ? '25%' : phase === 1 ? '60%' : phase === 2 ? '88%' : '100%',
                }}
                transition={{ ease: 'easeOut', duration: 0.35 }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
