import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  const [phase, setPhase] = useState<'intro' | 'playmaking' | 'zoom' | 'done'>('intro');
  const hasTriggeredAudioRef = useRef(false);

  // High-end sports broadcast sound design
  useEffect(() => {
    if (!isActive || hasTriggeredAudioRef.current) return;
    hasTriggeredAudioRef.current = true;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;

        // 1. Low cinematic sub sweep
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(120, now);
        sub.frequency.exponentialRampToValueAtTime(38, now + 0.45);
        subGain.gain.setValueAtTime(0.22, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        sub.connect(subGain);
        subGain.connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 0.55);

        // 2. High-tech magnetic snap chirp
        setTimeout(() => {
          try {
            const snap = ctx.createOscillator();
            const snapGain = ctx.createGain();
            snap.type = 'triangle';
            snap.frequency.setValueAtTime(440, ctx.currentTime);
            snap.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
            snapGain.gain.setValueAtTime(0.08, ctx.currentTime);
            snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            snap.connect(snapGain);
            snapGain.connect(ctx.destination);
            snap.start(ctx.currentTime);
            snap.stop(ctx.currentTime + 0.2);
          } catch {
            // Audio policy ignore
          }
        }, 280);

        // 3. Crisp match whistle tone on launch
        setTimeout(() => {
          try {
            const whistle = ctx.createOscillator();
            const whistleGain = ctx.createGain();
            whistle.type = 'sine';
            whistle.frequency.setValueAtTime(2600, ctx.currentTime);
            whistle.frequency.setValueAtTime(2750, ctx.currentTime + 0.08);
            whistle.frequency.setValueAtTime(2600, ctx.currentTime + 0.16);
            whistleGain.gain.setValueAtTime(0.06, ctx.currentTime);
            whistleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
            whistle.connect(whistleGain);
            whistleGain.connect(ctx.destination);
            whistle.start(ctx.currentTime);
            whistle.stop(ctx.currentTime + 0.3);
          } catch {
            // Audio policy ignore
          }
        }, 850);
      }
    } catch {
      // Audio silently ignored if autoplay blocked
    }
  }, [isActive]);

  // Clean, punchy 3-beat motion graphic sequence (~1.25s total)
  useEffect(() => {
    if (!isActive) {
      setPhase('intro');
      hasTriggeredAudioRef.current = false;
      return;
    }

    // Beat 1: Whiteboard slides in, tokens lock in
    const t1 = setTimeout(() => setPhase('playmaking'), 280);
    // Beat 2: Tactical arrows draw across the pitch
    const t2 = setTimeout(() => setPhase('zoom'), 950);
    // Beat 3: Cinematic camera zoom directly into the interactive whiteboard
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1250);

    // Hard safety timer
    const tSafe = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tSafe);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.25 }}
        onClick={onComplete}
        className="fixed inset-0 z-[999] bg-[#020704]/96 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden cursor-pointer"
        title="Tap or click to skip transition directly to board"
      >
        {/* Cinematic Stadium Night Atmosphere & Emerald Floodlight Beams */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,223,130,0.18),transparent_65%)] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Cybernetic Matchday Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00df820a_1px,transparent_1px),linear-gradient(to_bottom,#00df820a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Top Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-20 flex flex-col items-center gap-1.5 mb-3 sm:mb-5 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,223,130,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#00df82] animate-ping" />
            <span>BE COACH MATCHDAY STUDIO</span>
            <span className="text-emerald-500 font-normal">|</span>
            <span className="text-white">{targetPresetName}</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black italic tracking-tight text-white uppercase drop-shadow-lg flex items-center gap-2">
            <span>TACTICAL WHITEBOARD</span>
            <span className="text-[#00df82] font-black not-italic text-sm sm:text-lg px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40">
              11v11
            </span>
          </h2>
        </motion.div>

        {/* ========================================================================= */}
        {/* MAIN CINEMATIC TACTICAL WHITEBOARD (CLEAN, AUTHENTIC, DYNAMIC)            */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ scale: 0.82, rotateX: 18, opacity: 0 }}
          animate={
            phase === 'zoom'
              ? { scale: 1.45, opacity: 0.2, filter: 'blur(6px)' }
              : { scale: 1, rotateX: 0, opacity: 1, filter: 'blur(0px)' }
          }
          transition={{
            duration: phase === 'zoom' ? 0.35 : 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full max-w-2xl aspect-[16/10] sm:aspect-[16/9.5] rounded-3xl p-2 sm:p-3 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_60px_rgba(0,223,130,0.22)] border-2 border-slate-600/80 flex items-center justify-center overflow-hidden"
          style={{ perspective: 1000 }}
        >
          {/* Metallic Frame Bevel Effect */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />

          {/* Whiteboard Surface (Dark Emerald Modern Match Board) */}
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0b3820] via-[#0d4426] to-[#082a18] border border-emerald-400/40 shadow-inner overflow-hidden flex items-center justify-center">
            
            {/* Subtle Grass Mown Stripes */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_80px)] pointer-events-none" />

            {/* Tactical Pitch Lines (High-contrast chalk) */}
            <svg
              viewBox="0 0 1000 600"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="chalkGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00df82" floodOpacity="0.4" />
                </filter>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00df82" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Perimeter Touchlines */}
              <rect
                x="40"
                y="30"
                width="920"
                height="540"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2.5"
                rx="6"
              />

              {/* Halfway Line */}
              <line
                x1="500"
                y1="30"
                x2="500"
                y2="570"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2.5"
              />

              {/* Center Circle & Spot */}
              <circle
                cx="500"
                cy="300"
                r="85"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2.5"
              />
              <circle cx="500" cy="300" r="4.5" fill="#00df82" filter="url(#chalkGlow)" />

              {/* Left Penalty Box (Home Defense) */}
              <rect
                x="40"
                y="140"
                width="160"
                height="320"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />
              <rect
                x="40"
                y="210"
                width="55"
                height="180"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.8"
              />
              <path
                d="M 200 240 A 85 85 0 0 1 200 360"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />

              {/* Right Penalty Box (Attack Zone) */}
              <rect
                x="800"
                y="140"
                width="160"
                height="320"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />
              <rect
                x="905"
                y="210"
                width="55"
                height="180"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.8"
              />
              <path
                d="M 800 240 A 85 85 0 0 0 800 360"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
              />

              {/* ================================================================= */}
              {/* DYNAMIC LASER TACTICAL CURVES & PASSING LANES (COACH WHITEBOARD)   */}
              {/* ================================================================= */}
              {phase !== 'intro' && (
                <>
                  {/* 1. Build-up pass from CB #4 to Midfield Maestro #8 */}
                  <motion.path
                    d="M 230 380 Q 320 340 420 310"
                    fill="none"
                    stroke="#00df82"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />

                  {/* 2. Direct through-ball cutting through opponent midfield to Winger #7 */}
                  <motion.path
                    d="M 420 310 Q 560 220 720 150"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
                  />

                  {/* 3. Incisive curling cross from Winger #7 into the 6-yard box for Striker #9 */}
                  <motion.path
                    d="M 720 150 Q 820 180 870 280"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
                  />

                  {/* 4. Striker #9 diagonal run arrow towards near post */}
                  <motion.path
                    d="M 760 310 L 860 290"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.9 }}
                    transition={{ duration: 0.35, delay: 0.4, ease: 'easeOut' }}
                  />
                  {/* Arrowhead on Striker Run */}
                  <motion.polygon
                    points="865,289 850,283 853,295"
                    fill="#ffffff"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.65 }}
                  />
                </>
              )}
            </svg>

            {/* ================================================================= */}
            {/* MAGNETIC PLAYER TOKENS (SNAP ONTO THE BOARD IN FORMATION)         */}
            {/* ================================================================= */}
            
            {/* Goalkeeper #1 */}
            <motion.div
              initial={{ scale: 0, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 450, damping: 25 }}
              className="absolute left-[8%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-[0_3px_10px_rgba(0,0,0,0.7)]"
            >
              1
            </motion.div>

            {/* Defensive Line */}
            {/* Left Back #3 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 450 }}
              className="absolute left-[20%] top-[22%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-md"
            >
              3
            </motion.div>
            {/* Center Back #4 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.14, type: 'spring', stiffness: 450 }}
              className="absolute left-[23%] top-[38%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-md ring-2 ring-emerald-400/60"
            >
              4
            </motion.div>
            {/* Center Back #5 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.16, type: 'spring', stiffness: 450 }}
              className="absolute left-[23%] top-[62%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-md"
            >
              5
            </motion.div>
            {/* Right Back #2 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.18, type: 'spring', stiffness: 450 }}
              className="absolute left-[20%] top-[78%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-md"
            >
              2
            </motion.div>

            {/* Midfield Triangle */}
            {/* Defensive Midfielder #6 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.22, type: 'spring', stiffness: 450 }}
              className="absolute left-[33%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-md"
            >
              6
            </motion.div>
            {/* Central Playmaker #8 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.26, type: 'spring', stiffness: 450, damping: 14, bounce: 0.4 }}
              className="absolute left-[42%] top-[34%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00df82] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-[0_0_20px_#00df82] ring-2 ring-[#00df82]"
            >
              8
            </motion.div>
            {/* Attacking Midfielder #10 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.28, type: 'spring', stiffness: 450 }}
              className="absolute left-[44%] top-[66%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#00df82] text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-white shadow-md"
            >
              10
            </motion.div>

            {/* Attackers */}
            {/* Left Winger #11 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.32, type: 'spring', stiffness: 450 }}
              className="absolute left-[66%] top-[80%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-slate-900 shadow-md"
            >
              11
            </motion.div>
            {/* Right Winger #7 (Crosser) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 450, damping: 14, bounce: 0.4 }}
              className="absolute left-[72%] top-[18%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#38bdf8] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-[0_0_20px_#38bdf8]"
            >
              7
            </motion.div>
            {/* Striker #9 (Finisher) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 450, damping: 14, bounce: 0.45 }}
              className="absolute left-[86%] top-[48%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-amber-400 shadow-[0_0_25px_rgba(255,255,255,0.9)] ring-2 ring-white"
            >
              9
            </motion.div>

            {/* Opponent Defense Block (Red Magnetic Tokens) */}
            <div className="opacity-75">
              <div className="absolute left-[58%] top-[38%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center border border-white/80 shadow-sm">
                4
              </div>
              <div className="absolute left-[58%] top-[60%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center border border-white/80 shadow-sm">
                5
              </div>
              <div className="absolute left-[74%] top-[36%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center border border-white/80 shadow-sm">
                2
              </div>
              <div className="absolute left-[74%] top-[62%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center border border-white/80 shadow-sm">
                3
              </div>
            </div>

            {/* Glowing Match Football Magnet */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute left-[44%] top-[32%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-slate-950 shadow-[0_0_12px_#ffffff] flex items-center justify-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </motion.div>

            {/* Radar Sweep Scanning Laser */}
            <motion.div
              initial={{ left: '-20%' }}
              animate={{ left: '120%' }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Bottom Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="relative z-20 flex flex-col items-center gap-2 mt-4 sm:mt-6 text-center max-w-sm w-full"
        >
          {/* Animated Status Pill */}
          <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 backdrop-blur-md shadow-xl text-xs font-bold">
            <span className="text-[#00df82] flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current animate-pulse text-[#00df82]" />
              <span>
                {phase === 'intro' && 'Forming 11v11 matchday lanes...'}
                {phase === 'playmaking' && 'Drawing tactical passing triangles...'}
                {phase === 'zoom' && 'Tactics Locked — Entering Board!'}
                {phase === 'done' && 'Tactics Ready!'}
              </span>
            </span>

            <span className="text-white/80 font-mono text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00df82]" />
              <span>READY</span>
            </span>
          </div>

          <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
            Tap anywhere to jump into the tactical board instantly
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

