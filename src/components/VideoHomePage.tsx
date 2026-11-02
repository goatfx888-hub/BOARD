import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  ArrowRight,
  Shield,
  Info,
  FileText,
  Cookie,
  Mail,
  Menu,
  X,
  CheckCircle2,
  Trophy,
  TrendingUp,
  Users,
  Zap,
  LayoutGrid,
  Home,
  ChevronRight,
} from 'lucide-react';
import { LegalTabType } from './LegalModal';

interface VideoHomePageProps {
  onLaunchBoard: (presetName?: string) => void;
  onOpenLegal?: (tab: LegalTabType) => void;
}

const PRESET_FORMATIONS = [
  { id: '4-3-3', label: '4-3-3' },
  { id: '4-2-3-1', label: '4-2-3-1' },
  { id: '3-5-2', label: '3-5-2' },
  { id: '4-4-2', label: '4-4-2' },
  { id: '5-3-2', label: '5-3-2' },
] as const;

const BOTTOM_HIGHLIGHTS = [
  {
    icon: Trophy,
    title: 'Pro Tactics',
    desc: 'Learn winning strategies',
  },
  {
    icon: TrendingUp,
    title: 'Improve Skills',
    desc: 'Boost your coaching',
  },
  {
    icon: Users,
    title: 'Build Better Teams',
    desc: 'Work smarter, not harder',
  },
  {
    icon: Zap,
    title: 'Stay Ahead',
    desc: 'Be ready for every match',
  },
] as const;

export const VideoHomePage: React.FC<VideoHomePageProps> = ({
  onLaunchBoard,
  onOpenLegal,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync ambient background video with main video playback
  useEffect(() => {
    const main = videoRef.current;
    const ambient = ambientRef.current;
    if (!main || !ambient) return;

    const handlePlay = () => ambient.play().catch(() => {});
    const handlePause = () => ambient.pause();
    const handleTimeUpdate = () => {
      if (Math.abs(ambient.currentTime - main.currentTime) > 0.3) {
        ambient.currentTime = main.currentTime;
      }
    };

    main.addEventListener('play', handlePlay);
    main.addEventListener('pause', handlePause);
    main.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      main.removeEventListener('play', handlePlay);
      main.removeEventListener('pause', handlePause);
      main.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Keyboard shortcut support (Space / Enter -> Launch)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onLaunchBoard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLaunchBoard]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full bg-[#050b08] overflow-x-hidden flex flex-col justify-between select-none text-white font-sans"
    >
      {/* ========================================================================= */}
      {/* 1. FULL-WIDTH EDGE-TO-EDGE VIDEO ENGINE (NO BLACK BUBBLE BACKGROUND)      */}
      {/* Clear, unobstructed video showcase across all devices                     */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Ambient glow layer */}
        <video
          ref={ambientRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-30 pointer-events-none"
        >
          <source src="/assets/aistudio/Video_Project_12_9d0a3a03.mp4" type="video/mp4" />
          <source src="/hero_coach_video.mp4" type="video/mp4" />
        </video>

        {/* The Main 1080p Video - TRUE FULL WIDTH & COVER */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/hero_coach_poster.webp"
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-center pointer-events-auto cursor-pointer"
          onClick={() => onLaunchBoard()}
          title="Click to launch Be Coach Tactical Studio"
        >
          <source src="/assets/aistudio/Video_Project_12_9d0a3a03.mp4" type="video/mp4" />
          <source src="/hero_coach_video.mp4" type="video/mp4" />
        </video>

        {/* Subtle blur layer between the video and foreground font/CTA */}
        <div className="absolute inset-0 backdrop-blur-[3px] pointer-events-none" />

        {/* Subtle radial shadow strictly for contrast, no heavy dark bubble masks */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTERED EZOIC COMPLIANCE NAVIGATION PILL (MATCHING SCREENSHOT)        */}
      {/* [ HOME  TACTICS | About Us  Privacy Policy  Terms of Service  Cookie Policy  Contact Us ] */}
      {/* No logo on the left, no 3 buttons on the right                            */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex justify-center pointer-events-auto">
        
        {/* Desktop & Tablet Centered Navigation Pill */}
        <nav
          aria-label="Main & Compliance Navigation"
          className="hidden md:inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-[#0a140f]/90 backdrop-blur-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_15px_rgba(0,223,130,0.15)]"
        >
          {/* HOME (Active Badge) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#033b24] border border-emerald-500/60 shadow-sm transition cursor-pointer"
          >
            HOME
          </button>

          {/* TACTICS */}
          <button
            type="button"
            onClick={() => onLaunchBoard('4-3-3')}
            className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-slate-100 hover:text-[#00df82] transition cursor-pointer"
          >
            TACTICS
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-3.5 bg-emerald-500/40 mx-1" />

          {/* About Us */}
          <button
            type="button"
            onClick={() => onOpenLegal?.('about')}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-[#00df82] transition cursor-pointer whitespace-nowrap"
          >
            About Us
          </button>

          {/* Privacy Policy */}
          <button
            type="button"
            onClick={() => onOpenLegal?.('privacy')}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-[#00df82] transition cursor-pointer whitespace-nowrap"
          >
            Privacy Policy
          </button>

          {/* Terms of Service */}
          <button
            type="button"
            onClick={() => onOpenLegal?.('terms')}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-[#00df82] transition cursor-pointer whitespace-nowrap"
          >
            Terms of Service
          </button>

          {/* Cookie Policy */}
          <button
            type="button"
            onClick={() => onOpenLegal?.('cookies')}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-[#00df82] transition cursor-pointer whitespace-nowrap"
          >
            Cookie Policy
          </button>

          {/* Contact Us */}
          <button
            type="button"
            onClick={() => onOpenLegal?.('contact')}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-[#00df82] transition cursor-pointer whitespace-nowrap"
          >
            Contact Us
          </button>
        </nav>

        {/* Mobile Navigation Pill (< md screens) */}
        <div className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a140f]/90 backdrop-blur-xl border border-emerald-500/40 shadow-xl">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#033b24] border border-emerald-500/60 transition cursor-pointer"
          >
            HOME
          </button>
          <button
            type="button"
            onClick={() => onLaunchBoard('4-3-3')}
            className="px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-slate-200 hover:text-[#00df82] transition cursor-pointer"
          >
            TACTICS
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO CONTENT & TYPOGRAPHY (CLEAN, NO UNDERLINES, NO BUBBLE CONTAINER)  */}
      {/* ========================================================================= */}
      <main className="relative z-20 w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 flex-1 flex flex-col justify-center pointer-events-auto">
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl flex flex-col items-start gap-4 sm:gap-6">
          
          {/* Main Title with Premium Sports Typography (Outfit) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2 sm:space-y-3"
          >
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              <span className="text-white">BE </span>
              <span className="bg-gradient-to-r from-[#00df82] via-[#22c55e] to-[#10b981] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,223,130,0.5)]">
                COACH
              </span>
            </h1>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
              <span className="text-white">Think the game. </span>
              <span className="text-[#00df82]">
                Master the tactics.
              </span>
            </h2>
          </motion.div>

          {/* Description Paragraph with refined editorial balance */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          >
            Explore advanced tactics, improve your coaching skills, and take your team to the next level with our interactive 11v11 whiteboard and matchday studio.
          </motion.p>

          {/* Main Glowing Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1"
          >
            <motion.button
              whileHover={{ scale: 1.04, translateY: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onLaunchBoard('4-3-3')}
              className="relative group w-full sm:w-auto px-9 sm:px-11 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#00df82] via-[#10b981] to-[#059669] hover:from-[#10b981] hover:to-[#00df82] text-slate-950 font-display font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-3.5 shadow-[0_0_50px_rgba(0,223,130,0.7),0_12px_30px_rgba(0,0,0,0.8)] border border-emerald-200/60 transition-all cursor-pointer overflow-hidden active:scale-95"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              {/* Icon Circle */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950/20 ring-1 ring-slate-950/30 flex items-center justify-center text-slate-950 shrink-0 group-hover:bg-slate-950 group-hover:text-[#00df82] transition-all shadow-inner">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
              </div>

              <span className="font-extrabold drop-shadow-sm whitespace-nowrap tracking-wide">
                EXPLORE TACTICS
              </span>

              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </motion.button>
          </motion.div>

          {/* Quick Instant Formations Kickoff Bar (Without the black bubble background) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-2 max-w-full"
          >
            <span className="text-[10px] sm:text-xs font-black text-emerald-300 uppercase tracking-widest pl-1 shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              KICKOFF FORMATIONS:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_FORMATIONS.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onLaunchBoard(fmt.id)}
                  className="px-2.5 sm:px-3 py-1 rounded-lg bg-emerald-950/70 hover:bg-[#00df82] text-emerald-200 hover:text-slate-950 text-[11px] sm:text-xs font-black border border-emerald-500/40 hover:border-emerald-300 transition active:scale-95 cursor-pointer shadow-md backdrop-blur-sm shrink-0"
                  title={`Directly launch ${fmt.label} tactical formation`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Value Props Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00df82]" />
              <span>Free 11v11 Whiteboard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00df82]" />
              <span>2D &amp; 3D TV Angles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00df82]" />
              <span>1-Click HD Export</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. PROFESSIONAL BOTTOM HIGHLIGHT STRIP & EZOIC FOOTER LINKS               */}
      {/* 4 Sleek athletic studio telemetry cards matching the home page theme      */}
      {/* ========================================================================= */}
      <footer className="relative z-30 w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-12 pb-5 sm:pb-7 flex flex-col gap-4 pointer-events-auto">
        
        {/* 4 Cards Strip (responsive grid across mobile, tablet, desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {BOTTOM_HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                onClick={() => onLaunchBoard()}
                className="group p-3 sm:p-4 rounded-2xl bg-[#0a140f]/60 hover:bg-[#0a140f]/85 backdrop-blur-md border border-emerald-500/25 hover:border-emerald-400/60 shadow-lg transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00df82]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-xs sm:text-sm text-white group-hover:text-[#00df82] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Micro Footer with Direct Policy Links for Complete Ad Quality Compliance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-emerald-500/15 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} BE COACH • Professional Football Tactical Studio</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-emerald-400/80">UEFA / FIFA Tactical Standards Compliant</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => onOpenLegal?.('about')}
              className="hover:text-[#00df82] transition cursor-pointer"
            >
              About
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('privacy')}
              className="hover:text-[#00df82] transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('terms')}
              className="hover:text-[#00df82] transition cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('cookies')}
              className="hover:text-[#00df82] transition cursor-pointer"
            >
              Cookie Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('contact')}
              className="hover:text-[#00df82] transition cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
