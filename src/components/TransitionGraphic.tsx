import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Sparkles } from 'lucide-react';
import { SvgBeCoachLogo } from './LandingSvgIcons';

interface TransitionGraphicProps {
  isActive: boolean;
  onComplete: () => void;
  targetPresetName?: string;
}

export const TransitionGraphic: React.FC<TransitionGraphicProps> = ({
  isActive,
  onComplete,
  targetPresetName = '11v11 Matchday Studio',
}) => {
  const [phase, setPhase] = useState<number>(0);

  // Play subtle athletic sci-fi synthesizer chime when transition starts
  useEffect(() => {
    if (!isActive) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        // Low sub thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);

        // Hi-tech shimmer chime
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(520, now + 0.1);
        chime.frequency.exponentialRampToValueAtTime(1040, now + 0.45);
        chimeGain.gain.setValueAtTime(0.08, now + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now + 0.1);
        chime.stop(now + 0.6);
      }
    } catch {
      // Audio auto-play policies silently fail
    }
  }, [isActive]);

  // Phase Timing Sequence
  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    // Phase 1: Whiteboard & Radar mapping
    const t1 = setTimeout(() => setPhase(1), 320);
    // Phase 2: Formations & Player tokens locking
    const t2 = setTimeout(() => setPhase(2), 700);
    // Phase 3: Match Ready
    const t3 = setTimeout(() => setPhase(3), 1150);
    // Complete and unveil board
    const t4 = setTimeout(() => {
      onComplete();
    }, 1500);

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
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[999] bg-[#030805]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      >
        {/* ========================================================================= */}
        {/* 1. CINEMATIC BACKGROUND VIDEO / TEXTURE LAYER                             */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter blur-md scale-110"
          >
            <source src="/assets/aistudio/Video_Project_12_9d0a3a03.mp4" type="video/mp4" />
            <source src="/hero_coach_video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Stadium green spotlights & radial glow */}
        <div className="absolute inset-0 bg-radial from-emerald-500/15 via-[#030805]/85 to-[#030805] pointer-events-none" />

        {/* ========================================================================= */}
        {/* 2. DYNAMIC TACTICAL WHITEBOARD DIAGRAM (REFERENCING COACH'S VIDEO)        */}
        {/* Animated pitch outline, passing curves, and player tokens                 */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-xl aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center pointer-events-none mb-4">
          
          {/* Tactical Pitch Frame */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-2 sm:inset-4 border-2 border-emerald-400/40 rounded-3xl bg-slate-950/70 backdrop-blur-md shadow-[0_0_50px_rgba(0,223,130,0.25)] overflow-hidden flex items-center justify-center"
          >
            {/* Halfway line & Center Circle */}
            <div className="absolute w-full h-px bg-emerald-400/30" />
            <div className="w-40 sm:w-56 h-40 sm:h-56 rounded-full border border-emerald-400/35 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#00df82]" />
            </div>

            {/* Penalty boxes */}
            <div className="absolute top-0 w-48 sm:w-64 h-20 sm:h-24 border-b border-x border-emerald-400/30 rounded-b-xl" />
            <div className="absolute bottom-0 w-48 sm:w-64 h-20 sm:h-24 border-t border-x border-emerald-400/30 rounded-t-xl" />

            {/* Animated Laser Tactical Passing Lines (mimicking coach's whiteboard drawings) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Build up pass from CB to CM */}
              <motion.path
                d="M 160 300 Q 200 230 250 180"
                fill="none"
                stroke="#00df82"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              {/* Through ball to Winger */}
              <motion.path
                d="M 250 180 Q 320 150 420 100"
                fill="none"
                stroke="#00df82"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              />
              {/* Curving cross into striker */}
              <motion.path
                d="M 420 100 Q 340 70 270 75"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.95 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
            </svg>

            {/* Tactical Player Nodes pulsing onto the board */}
            {/* Goalkeeper */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-4 w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_15px_#f59e0b]"
            >
              1
            </motion.div>

            {/* Center Backs */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.25 }}
              className="absolute bottom-14 left-[34%] w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_15px_#00df82]"
            >
              4
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-14 right-[34%] w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_15px_#00df82]"
            >
              5
            </motion.div>

            {/* Midfielder playmaker */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ delay: 0.4 }}
              className="absolute top-[48%] left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[11px] flex items-center justify-center shadow-[0_0_20px_#00df82]"
            >
              8
            </motion.div>

            {/* Winger */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.55 }}
              className="absolute top-[28%] right-[18%] w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_15px_#00df82]"
            >
              7
            </motion.div>

            {/* Striker in box */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ delay: 0.7 }}
              className="absolute top-[16%] left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-950 font-black text-[11px] flex items-center justify-center shadow-[0_0_20px_#ffffff]"
            >
              9
            </motion.div>

            {/* High-speed scanning laser sweep */}
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent pointer-events-none"
            />
          </motion.div>

          {/* Central Logo Emblem Pulse */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/85 border border-emerald-500/60 p-3 shadow-[0_0_40px_rgba(0,223,130,0.5)] flex items-center justify-center"
          >
            <SvgBeCoachLogo className="w-full h-full drop-shadow-md" />
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BROADCAST TELEMETRY & PHASE MESSAGING                                  */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-3">
          
          {/* Eyebrow Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#00df82] animate-pulse" />
            <span>Tactical Motion Engine</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white uppercase leading-none drop-shadow-lg">
            <span>BE </span>
            <span className="text-[#00df82]">COACH</span>
            <span className="text-white"> STUDIO</span>
          </h2>

          <p className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            {targetPresetName}
          </p>

          {/* Fast Calibration Telemetry Bar */}
          <div className="w-full bg-[#0a140f]/90 border border-emerald-500/35 rounded-2xl p-4 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#00df82] flex items-center gap-1.5 truncate">
                <Activity className="w-3.5 h-3.5 animate-spin shrink-0" />
                {phase === 0 && 'Mapping coach whiteboard coordinates...'}
                {phase === 1 && 'Deploying 11v11 formation & tactical lanes...'}
                {phase === 2 && 'Calibrating 2D/3D broadcast turf...'}
                {phase === 3 && 'Pitch Ready — Entering Match Studio!'}
              </span>
              <span className="text-emerald-300 font-mono pl-2">
                {phase === 0 && '32%'}
                {phase === 1 && '68%'}
                {phase === 2 && '94%'}
                {phase === 3 && '100%'}
              </span>
            </div>

            {/* Glowing Emerald Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative border border-emerald-950">
              <motion.div
                initial={{ width: '0%' }}
                animate={{
                  width: phase === 0 ? '32%' : phase === 1 ? '68%' : phase === 2 ? '94%' : '100%',
                }}
                transition={{ ease: 'easeOut', duration: 0.35 }}
                className="h-full bg-gradient-to-r from-emerald-500 via-[#00df82] to-teal-300 rounded-full shadow-[0_0_15px_#00df82]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
