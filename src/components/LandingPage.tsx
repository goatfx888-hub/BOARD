import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  Lock,
  Volume2,
  VolumeX,
  Maximize2,
  Play,
  ArrowRight,
  Trophy,
  TrendingUp,
  Users,
  Zap,
  Search,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { LegalTabType } from './LegalModal';
import { useTheme } from '../context/ThemeContext';
import { ThreeTacticalCanvas } from './ThreeTacticalCanvas';
import {
  SvgBeCoachLogo,
  SvgTurfStadium,
  SvgKeyframeFilm,
  SvgDrawingTactics,
  SvgJerseyKit,
  SvgExport4K,
  SvgCrownStar,
  SvgLuxuryArrow,
  SvgLuxuryPlay,
  SvgDiamondBadge,
  SvgMatchClash,
} from './LandingSvgIcons';

interface LandingPageProps {
  onLaunchBoard: (presetName?: string) => void;
  onOpenLegal: (tab: LegalTabType) => void;
}

// Mini-pitch animated preview positions for the Tactical Sandbox section
interface HeroPlayer {
  id: string;
  x: number;
  y: number;
  role: string;
  label: string;
  name: string;
  instruction: string;
}

const HERO_FORMATIONS: Record<string, HeroPlayer[]> = {
  '4-3-3': [
    { id: 'gk', x: 50, y: 88, role: 'GK', label: '1', name: 'Alisson', instruction: 'Sweeper keeper • Sweeping in behind & rapid distribution' },
    { id: 'lb', x: 18, y: 72, role: 'LB', label: '3', name: 'Robertson', instruction: 'Inverted full-back • Underlapping runs to overload midfield' },
    { id: 'cb1', x: 38, y: 76, role: 'CB', label: '4', name: 'Van Dijk', instruction: 'Covering defender • Aerial dominance & diagonal switches' },
    { id: 'cb2', x: 62, y: 76, role: 'CB', label: '5', name: 'Saliba', instruction: 'Stopper centre-back • Aggressive forward duels' },
    { id: 'rb', x: 82, y: 72, role: 'RB', label: '2', name: 'Alexander-Arnold', instruction: 'Deep playmaker • Half-space whipped deliveries into box' },
    { id: 'cdm', x: 50, y: 56, role: 'CDM', label: '6', name: 'Rodri', instruction: 'Anchor pivot • Recovers second balls & dictates tempo' },
    { id: 'cm1', x: 34, y: 44, role: 'CM', label: '8', name: 'Bellingham', instruction: 'Box-to-box engine • Late surge into penalty box' },
    { id: 'cm2', x: 66, y: 44, role: 'CM', label: '10', name: 'De Bruyne', instruction: 'Creative #10 • Through-balls behind low blocks' },
    { id: 'lw', x: 20, y: 24, role: 'LW', label: '11', name: 'Vinícius Jr', instruction: 'Inside forward • 1v1 isolation dribbling on wing' },
    { id: 'st', x: 50, y: 16, role: 'ST', label: '9', name: 'Haaland', instruction: 'Complete forward • Relentless press & near-post runs' },
    { id: 'rw', x: 80, y: 24, role: 'RW', label: '7', name: 'Salah', instruction: 'Inverted winger • Cutting inside onto dominant left foot' },
  ],
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, role: 'GK', label: '1', name: 'Courtois', instruction: 'Commanding keeper • High-claim aerial box dominance' },
    { id: 'lb', x: 18, y: 72, role: 'LB', label: '3', name: 'Davies', instruction: 'Overlapping full-back • High-speed width & cutbacks' },
    { id: 'cb1', x: 38, y: 76, role: 'CB', label: '4', name: 'Rúben Dias', instruction: 'Ball-playing CB • Breaking the first pressing line' },
    { id: 'cb2', x: 62, y: 76, role: 'CB', label: '5', name: 'Rüdiger', instruction: 'Aggressive stopper • Tight man-to-man coverage' },
    { id: 'rb', x: 82, y: 72, role: 'RB', label: '2', name: 'Hakimi', instruction: 'Attacking wing-back • Wide channel overlap' },
    { id: 'cdm1', x: 36, y: 58, role: 'CDM', label: '6', name: 'Rice', instruction: 'Defensive screen • Interceptions in Zone 14' },
    { id: 'cdm2', x: 64, y: 58, role: 'CDM', label: '8', name: 'Valverde', instruction: 'Dynamic pivot • Powerful transition ball carrying' },
    { id: 'lam', x: 22, y: 38, role: 'LAM', label: '11', name: 'Mbappé', instruction: 'Wide playmaker • Explosive finish on counter-attack' },
    { id: 'cam', x: 50, y: 36, role: 'CAM', label: '10', name: 'Musiala', instruction: 'Shadow striker • Pocket dribbling between opponent lines' },
    { id: 'ram', x: 78, y: 38, role: 'RAM', label: '7', name: 'Saka', instruction: 'Direct winger • Driving to touchline for cutbacks' },
    { id: 'st', x: 50, y: 16, role: 'ST', label: '9', name: 'Kane', instruction: 'False nine • Dropping deep to link play with runners' },
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88, role: 'GK', label: '1', name: 'Donnarumma', instruction: 'Shot-stopper • Quick distribution to wide wing-backs' },
    { id: 'cb1', x: 26, y: 76, role: 'CB', label: '3', name: 'Bastoni', instruction: 'Wide centre-back • Overlapping up the left flank' },
    { id: 'cb2', x: 50, y: 78, role: 'CB', label: '4', name: 'Marquinhos', instruction: 'Libero • Organizing 3-man backline shape' },
    { id: 'cb3', x: 74, y: 76, role: 'CB', label: '5', name: 'Akanji', instruction: 'Wide centre-back • Stepping into midfield pivot' },
    { id: 'lwb', x: 14, y: 48, role: 'LWB', label: '11', name: 'Dimarco', instruction: 'Full-flank runner • Whipped crosses & set pieces' },
    { id: 'cm1', x: 36, y: 52, role: 'CM', label: '6', name: 'Barella', instruction: 'Mezzala • Dynamic underlapping channel runs' },
    { id: 'cm2', x: 64, y: 52, role: 'CM', label: '8', name: 'Camavinga', instruction: 'Regista • Switching play to un-marked flank' },
    { id: 'cam', x: 50, y: 36, role: 'CAM', label: '10', name: 'Wirtz', instruction: 'Advanced playmaker • Incisive passes into strikers' },
    { id: 'rwb', x: 86, y: 48, role: 'RWB', label: '7', name: 'Frimpong', instruction: 'Sprint wing-back • Back-post tap-in finishes' },
    { id: 'st1', x: 38, y: 18, role: 'ST', label: '9', name: 'Lautaro', instruction: 'Pressing forward • Creating space for strike partner' },
    { id: 'st2', x: 62, y: 18, role: 'ST', label: '19', name: 'Osimhen', instruction: 'Target striker • Channel sprinting & aerial duels' },
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, role: 'GK', label: '1', name: 'Neuer', instruction: 'Sweeper keeper • Command of entire defensive third' },
    { id: 'lb', x: 18, y: 72, role: 'LB', label: '3', name: 'Hernández', instruction: 'Pacy full-back • High overlap on counter-attacks' },
    { id: 'cb1', x: 38, y: 76, role: 'CB', label: '4', name: 'Gabriel', instruction: 'Compact stopper • Clearing crosses from wide zones' },
    { id: 'cb2', x: 62, y: 76, role: 'CB', label: '5', name: 'Konaté', instruction: 'Physical anchor • Tracking striker runs in behind' },
    { id: 'rb', x: 82, y: 72, role: 'RB', label: '2', name: 'Carvajal', instruction: 'Tactical full-back • Compact defensive diagonal' },
    { id: 'lm', x: 18, y: 46, role: 'LM', label: '11', name: 'Martinelli', instruction: 'Wide midfielder • Pressing fullback & breakaways' },
    { id: 'cm1', x: 38, y: 54, role: 'CM', label: '6', name: 'Kroos', instruction: 'Midfield orchestrator • Precision 95%+ pass accuracy' },
    { id: 'cm2', x: 62, y: 54, role: 'CM', label: '8', name: 'Modrić', instruction: 'Creative pivot • Escaping heavy opponent press' },
    { id: 'rm', x: 82, y: 46, role: 'RM', label: '7', name: 'Foden', instruction: 'Inverted midfielder • Pocket combination in Zone 14' },
    { id: 'st1', x: 38, y: 20, role: 'ST', label: '9', name: 'Lewandowski', instruction: 'Poacher • Box predatory finishing & hold-up play' },
    { id: 'st2', x: 62, y: 20, role: 'ST', label: '10', name: 'Griezmann', instruction: 'Supporting striker • Dropping deep between lines' },
  ],
  '5-3-2': [
    { id: 'gk', x: 50, y: 88, role: 'GK', label: '1', name: 'Oblak', instruction: 'Low-block keeper • Elite reaction reflex shot stopping' },
    { id: 'lwb', x: 14, y: 58, role: 'LWB', label: '3', name: 'Nuno Mendes', instruction: 'Defensive wing-back • Neutralizing wide threats' },
    { id: 'cb1', x: 30, y: 76, role: 'CB', label: '4', name: 'Gvardiol', instruction: 'Left centre-back • Stepping out into midfield' },
    { id: 'cb2', x: 50, y: 78, role: 'CB', label: '5', name: 'Min-jae Kim', instruction: 'Central rock • Dominating near-box penalty area' },
    { id: 'cb3', x: 70, y: 76, role: 'CB', label: '6', name: 'Araújo', instruction: 'Right centre-back • Recovery pace against transitions' },
    { id: 'rwb', x: 86, y: 58, role: 'RWB', label: '2', name: 'Dumfries', instruction: 'Power wing-back • Far-post aerial headers' },
    { id: 'cm1', x: 32, y: 46, role: 'CM', label: '8', name: 'Pedri', instruction: 'Playmaker • Threading tight angles into space' },
    { id: 'cdm', x: 50, y: 54, role: 'CDM', label: '14', name: 'Tchouaméni', instruction: 'Midfield destroyer • Breaking up opponent transitions' },
    { id: 'cm2', x: 68, y: 46, role: 'CM', label: '10', name: 'Bernardo Silva', instruction: 'Press-resistant dribbler • Retaining possession' },
    { id: 'st1', x: 40, y: 20, role: 'ST', label: '9', name: 'Son', instruction: 'Counter-attack striker • Deadly two-footed finishing' },
    { id: 'st2', x: 60, y: 20, role: 'ST', label: '7', name: 'Julián Álvarez', instruction: 'Workhorse striker • High pressing on opposing CBs' },
  ],
};

const FAQ_ITEMS = [
  {
    question: 'Is Be Coach completely free to use?',
    answer:
      'Yes, 100%. All core features including 11v11 simulations, customizable pitch grass textures, kit designers, and high-definition PNG exports are freely available in your browser without any subscription or mandatory sign-up.',
  },
  {
    question: 'Can I export high-resolution formation diagrams for social media or coaching books?',
    answer:
      'Absolutely! Click the Export button in the tactical studio to generate clean, high-resolution PNG image snapshots with customizable backgrounds, team lineup names, and bench rosters ready for presentation.',
  },
  {
    question: 'How does the Tactical Keyframe Recording Studio work?',
    answer:
      'The Keyframe Studio allows you to capture distinct phases of play (e.g. Phase 1: Build-up, Phase 2: Overlap, Phase 3: Box Entry). Once recorded, you can play back the sequence with smooth automated player transitions to illustrate plays dynamically.',
  },
  {
    question: 'Can I simulate full 11 vs 11 match clashes between two squads?',
    answer:
      'Yes. Toggle Match Mode to "Home vs Away" in the header to populate both teams simultaneously. You can customize kits, formations, and tactical movement for each team independently.',
  },
];

// Tactical phase shift calculator for sandbox pitch
const getShiftedPosition = (
  player: HeroPlayer,
  phase: 'balanced' | 'attack' | 'defense'
): { x: number; y: number } => {
  let { x, y, role } = player;

  if (phase === 'attack') {
    if (role.includes('ST')) {
      y = Math.max(9, y - 6);
    } else if (role.includes('RW') || role.includes('LW') || role.includes('RM') || role.includes('LM')) {
      y = Math.max(12, y - 10);
      x = role.includes('LW') || role.includes('LM') ? Math.max(x - 5, 8) : Math.min(x + 5, 92);
    } else if (role.includes('CAM') || role.includes('LAM') || role.includes('RAM')) {
      y = Math.max(22, y - 12);
    } else if (role.includes('CM')) {
      y = Math.max(30, y - 12);
    } else if (role.includes('CDM')) {
      y = Math.max(44, y - 8);
    } else if (role.includes('LB') || role.includes('RB') || role.includes('LWB') || role.includes('RWB')) {
      y = Math.max(48, y - 18);
      x = role.includes('LB') || role.includes('LWB') ? Math.max(x - 6, 8) : Math.min(x + 6, 92);
    } else if (role.includes('CB')) {
      y = Math.max(62, y - 10);
    } else if (role.includes('GK')) {
      y = Math.max(82, y - 4);
    }
  } else if (phase === 'defense') {
    if (role.includes('ST')) {
      y = Math.min(38, y + 16);
    } else if (role.includes('RW') || role.includes('LW') || role.includes('RM') || role.includes('LM')) {
      y = Math.min(56, y + 18);
      x = role.includes('LW') || role.includes('LM') ? Math.min(x + 7, 28) : Math.max(x - 7, 72);
    } else if (role.includes('CAM') || role.includes('LAM') || role.includes('RAM')) {
      y = Math.min(52, y + 15);
    } else if (role.includes('CM') || role.includes('CDM')) {
      y = Math.min(68, y + 14);
      x = x < 50 ? 39 : 61;
    } else if (role.includes('LB') || role.includes('RB') || role.includes('LWB') || role.includes('RWB')) {
      y = Math.min(82, y + 10);
      x = role.includes('LB') || role.includes('LWB') ? Math.min(x + 4, 25) : Math.max(x - 4, 75);
    } else if (role.includes('CB')) {
      y = Math.min(84, y + 8);
    } else if (role.includes('GK')) {
      y = Math.min(92, y + 4);
    }
  }

  return { x, y };
};

const SvgBeCoachCrown: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="crownGradPro" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="30%" stopColor="#c084fc" />
        <stop offset="70%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <filter id="crownProGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.8" result="glow" />
        <feComposite in="SourceGraphic" in2="glow" operator="over" />
      </filter>
    </defs>
    <path
      d="M7 16L13 32H31L37 16L27 23.5L22 9L17 23.5L7 16Z"
      fill="url(#crownGradPro)"
      filter="url(#crownProGlow)"
    />
    <circle cx="7" cy="16" r="2.2" fill="#ffffff" />
    <circle cx="22" cy="9" r="2.8" fill="#ffffff" />
    <circle cx="37" cy="16" r="2.2" fill="#ffffff" />
    <rect x="12" y="34" width="20" height="3.5" rx="1.75" fill="#a855f7" />
    <circle cx="16.5" cy="35.75" r="0.9" fill="#ffffff" />
    <circle cx="22" cy="35.75" r="1.1" fill="#ffffff" />
    <circle cx="27.5" cy="35.75" r="0.9" fill="#ffffff" />
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchBoard,
  onOpenLegal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  // 3D Video & Parallax Stage States
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  // Formation Sandbox & UI States
  const [selectedFormationKey, setSelectedFormationKey] =
    useState<keyof typeof HERO_FORMATIONS>('4-3-3');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [tacticalPhase, setTacticalPhase] = useState<'balanced' | 'attack' | 'defense'>('balanced');
  const [showZones, setShowZones] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-play video on mount
  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = isVideoMuted;
      mainVideoRef.current.play().catch(() => {});
    }
  }, [isVideoMuted]);

  const toggleVideoAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isVideoMuted;
    setIsVideoMuted(nextMuted);
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = nextMuted;
      if (!nextMuted) {
        mainVideoRef.current.play().catch(() => {});
      }
    }
  };

  const handleFullscreenVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (mainVideoRef.current) {
      if (mainVideoRef.current.requestFullscreen) {
        mainVideoRef.current.requestFullscreen();
      }
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (q.includes('4-4-2') || q.includes('442')) {
      onLaunchBoard('4-4-2');
    } else if (q.includes('3-5-2') || q.includes('352')) {
      onLaunchBoard('3-5-2');
    } else if (q.includes('5-3-2') || q.includes('532')) {
      onLaunchBoard('5-3-2');
    } else if (q.includes('4-2-3-1') || q.includes('4231')) {
      onLaunchBoard('4-2-3-1');
    } else if (q.includes('train') || q.includes('drill') || q.includes('keyframe')) {
      const el = document.getElementById('keyframes');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else onLaunchBoard('4-3-3');
    } else if (q.includes('feature')) {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else onLaunchBoard('4-3-3');
    } else {
      onLaunchBoard('4-3-3');
    }
  };

  const heroPositions = HERO_FORMATIONS[selectedFormationKey] || HERO_FORMATIONS['4-3-3'];
  const activePlayer = heroPositions.find((p) => p.id === selectedPlayerId) || heroPositions[9];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900 selection:bg-purple-500 selection:text-white'
          : 'bg-[#070312] text-slate-100 selection:bg-purple-500 selection:text-white'
      }`}
    >
      {/* ========================================================================= */}
      {/* 3D IMMERSIVE HERO VIEWPORT & MAIN VIDEO CENTERPIECE */}
      {/* ========================================================================= */}
      <section
        className="relative w-full overflow-hidden bg-[#070312] text-white pt-4 sm:pt-6 pb-12 sm:pb-16"
      >
        {/* Three.js Interactive 3D Stadium & Tactical Particle Scene */}
        <ThreeTacticalCanvas isLight={false} />

        {/* Ambient Volumetric Radial Lighting behind the Hero Section */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-purple-900/35 via-violet-600/20 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-950/30 rounded-full blur-[120px] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 sm:gap-8">
          
          {/* ===================================================================== */}
          {/* 1. TOP MINIMAL NAVIGATION BAR */}
          {/* ===================================================================== */}
          <header className="w-full flex items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
            {/* Brand Logo & Wordmark */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                <SvgBeCoachCrown className="w-full h-full drop-shadow-[0_0_16px_rgba(168,85,247,0.85)] group-hover:scale-105 transition-transform duration-200" />
              </div>
              <span className="font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center">
                Be&nbsp;<span className="text-[#c084fc] font-extrabold">Coach</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold">
              <a
                href="#features"
                className="px-3.5 py-2 rounded-lg text-purple-200/80 hover:text-white hover:bg-purple-900/40 transition-colors"
              >
                Features
              </a>
              <a
                href="#formations"
                className="px-3.5 py-2 rounded-lg text-purple-200/80 hover:text-white hover:bg-purple-900/40 transition-colors"
              >
                Formations
              </a>
              <a
                href="#sandbox"
                className="px-3.5 py-2 rounded-lg text-purple-200/80 hover:text-white hover:bg-purple-900/40 transition-colors"
              >
                Tactics Sandbox
              </a>
              <a
                href="#faq"
                className="px-3.5 py-2 rounded-lg text-purple-200/80 hover:text-white hover:bg-purple-900/40 transition-colors"
              >
                FAQ
              </a>
            </nav>

            {/* Right Controls: Search, Sound Toggle, Theme, Launch Studio */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tactics..."
                  className="w-36 lg:w-44 pl-8 pr-3 py-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400 focus:w-52 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 pointer-events-none" />
              </form>

              <button
                type="button"
                onClick={toggleVideoAudio}
                className="px-3 py-2 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                title={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isVideoMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden sm:inline">Sound Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                    <span className="hidden sm:inline">Sound On</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-purple-800/40 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 hover:text-white transition cursor-pointer flex items-center justify-center active:scale-95"
                title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label="Toggle Theme"
              >
                {isLight ? <Moon className="w-4 h-4 text-purple-300" /> : <Sun className="w-4 h-4 text-purple-300" />}
              </button>

              <button
                type="button"
                onClick={() => onLaunchBoard('4-3-3')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold tracking-wide transition shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Launch Studio
              </button>
            </div>
          </header>

          {/* ===================================================================== */}
          {/* 2. CENTERED HEADLINE BLOCK */}
          {/* ===================================================================== */}
          <div className="w-full max-w-4xl mx-auto text-center space-y-4 pt-4 sm:pt-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Football Tactics &amp; Strategy</span>
            </div>

            {/* Giant Title: BE COACH */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black italic tracking-tight text-white leading-none">
              BE <span className="text-[#a855f7] drop-shadow-[0_0_45px_rgba(168,85,247,0.7)]">COACH</span>
            </h1>

            {/* Subheadline */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic tracking-tight text-slate-100">
              Think the game.{' '}
              <span className="text-[#c084fc] drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]">
                Master the tactics.
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-purple-200/80 font-normal leading-relaxed max-w-2xl mx-auto px-4">
              Explore advanced tactics, simulate 11v11 matchdays, and elevate your coaching with our interactive 3D tactical studio.
            </p>
          </div>

          {/* ===================================================================== */}
          {/* 3. MAIN CENTERED VIDEO SHOWCASE (BORDERED CARD FRAME) */}
          {/* ===================================================================== */}
          <div className="w-full max-w-5xl mx-auto relative perspective-[1400px] pt-1 pb-2">
            <div className="w-full rounded-2xl sm:rounded-3xl border border-purple-500/30 bg-[#0d0722]/90 shadow-[0_20px_70px_rgba(112,26,117,0.4),0_0_60px_rgba(168,85,247,0.25)] overflow-hidden backdrop-blur-md">
              {/* Frame Top Bar */}
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 border-b border-purple-500/20 bg-purple-950/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-purple-200/90 font-bold text-[11px] sm:text-xs tracking-wide flex items-center gap-1.5 pl-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    3D Tactical Coach Masterclass
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVideoAudio}
                    className="px-2.5 py-1 rounded-md bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                    title={isVideoMuted ? 'Unmute' : 'Mute'}
                  >
                    {isVideoMuted ? <VolumeX className="w-3 h-3 text-purple-400" /> : <Volume2 className="w-3 h-3 text-purple-300 animate-pulse" />}
                    <span className="hidden sm:inline">{isVideoMuted ? 'Unmute' : 'Muted'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFullscreenVideo}
                    className="p-1 rounded-md bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 hover:text-white transition active:scale-95 cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative w-full aspect-video bg-black">
                <video
                  ref={mainVideoRef}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  playsInline
                  poster="/hero_coach_poster.webp"
                  preload="auto"
                  className="w-full h-full object-contain sm:object-cover aspect-video"
                >
                  <source src="/assets/aistudio/kling_20261101_VIDEO_animate____2080_0_9bd4589e.mp4" type="video/mp4" />
                  <source src="/hero_coach_video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 4. ACTION BUTTON & INSTANT FORMATION PRESETS DIRECTLY BENEATH VIDEO */}
          {/* ===================================================================== */}
          <div className="w-full flex flex-col items-center justify-center space-y-4 pt-1">
            {/* Centered Explore Tactics Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onLaunchBoard('4-3-3')}
              className="px-9 sm:px-12 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-3 shadow-[0_0_35px_rgba(139,92,246,0.6)] border border-purple-300/30 transition-all cursor-pointer group active:scale-95"
            >
              <Play className="w-4 h-4 fill-white text-white shrink-0" />
              <span>Explore Tactics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </motion.button>

            {/* Instant Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-purple-300/70 uppercase tracking-wider mr-1">
                Instant Formations:
              </span>
              {(['4-3-3', '4-2-3-1', '3-5-2', '4-4-2', '5-3-2'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => onLaunchBoard(fmt)}
                  className="px-3 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm"
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 5. 4 FEATURE CARDS (4-COLUMN GRID) */}
          {/* ===================================================================== */}
          <div className="w-full max-w-5xl mx-auto pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Card 1: Pro Tactics */}
              <div
                onClick={() => onLaunchBoard('4-3-3')}
                className="rounded-2xl p-4 bg-[#140b2e]/90 hover:bg-[#1f1045] border border-purple-800/40 hover:border-purple-500/70 backdrop-blur-md transition-all duration-200 cursor-pointer group flex items-center gap-3.5 shadow-lg shadow-purple-950/50"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-950/90 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  <Trophy className="w-5 h-5 text-[#c084fc]" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug">Pro Tactics</h4>
                  <p className="text-purple-300/75 text-xs font-medium">Learn winning strategies</p>
                </div>
              </div>

              {/* Card 2: Improve Skills */}
              <div
                onClick={() => onLaunchBoard('4-4-2')}
                className="rounded-2xl p-4 bg-[#140b2e]/90 hover:bg-[#1f1045] border border-purple-800/40 hover:border-purple-500/70 backdrop-blur-md transition-all duration-200 cursor-pointer group flex items-center gap-3.5 shadow-lg shadow-purple-950/50"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-950/90 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  <TrendingUp className="w-5 h-5 text-[#c084fc]" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug">Improve Skills</h4>
                  <p className="text-purple-300/75 text-xs font-medium">Boost your coaching</p>
                </div>
              </div>

              {/* Card 3: Build Better Teams */}
              <div
                onClick={() => onLaunchBoard('3-5-2')}
                className="rounded-2xl p-4 bg-[#140b2e]/90 hover:bg-[#1f1045] border border-purple-800/40 hover:border-purple-500/70 backdrop-blur-md transition-all duration-200 cursor-pointer group flex items-center gap-3.5 shadow-lg shadow-purple-950/50"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-950/90 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  <Users className="w-5 h-5 text-[#c084fc]" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug">Build Better Teams</h4>
                  <p className="text-purple-300/75 text-xs font-medium">Work smarter, not harder</p>
                </div>
              </div>

              {/* Card 4: Stay Ahead */}
              <div
                onClick={() => onLaunchBoard('4-2-3-1')}
                className="rounded-2xl p-4 bg-[#140b2e]/90 hover:bg-[#1f1045] border border-purple-800/40 hover:border-purple-500/70 backdrop-blur-md transition-all duration-200 cursor-pointer group flex items-center gap-3.5 shadow-lg shadow-purple-950/50"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-950/90 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  <Zap className="w-5 h-5 text-[#c084fc]" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug">Stay Ahead</h4>
                  <p className="text-purple-300/75 text-xs font-medium">Be ready for every match</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 6. SPONSORED BANNER (CENTERED AT BOTTOM OF HERO SECTION) */}
          {/* ===================================================================== */}
          <div className="w-full max-w-5xl mx-auto pt-3 pb-2">
            <div className="rounded-xl overflow-hidden border border-purple-500/20 bg-black/60 p-1.5 shadow-lg flex items-center justify-center">
              <div className="w-full min-h-[60px] sm:min-h-[70px] rounded-lg bg-gradient-to-r from-[#140c26] via-[#21113d] to-[#140c26] border border-purple-500/30 flex items-center justify-between px-4 sm:px-6 py-2 text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-xl sm:text-2xl font-black italic tracking-tighter text-amber-400">
                    amazon
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-xs sm:text-sm text-white">Better Deals. Bigger Smiles.</div>
                    <div className="text-[10px] sm:text-xs text-purple-300/70">Shop verified tactical gear, magnetic boards &amp; kit designers</div>
                  </div>
                </div>
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Shop now
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* STATS & CREDIBILITY BAR */}
      {/* ========================================================================= */}
      <section className={`border-y py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-slate-100/70 border-slate-200 text-slate-900'
          : 'bg-[#0a0518] border-purple-950 text-white'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className={`p-4 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-purple-950/40 border-purple-800/40'
          }`}>
            <div className={`text-2xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>50+</div>
            <p className="text-[11px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase">Tactical Formations</p>
          </div>
          <div className={`p-4 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-purple-950/40 border-purple-800/40'
          }`}>
            <div className="text-2xl sm:text-4xl font-black text-amber-500 dark:text-amber-300 tracking-tight">11</div>
            <p className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase">Turf Styles &amp; Lights</p>
          </div>
          <div className={`p-4 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-purple-950/40 border-purple-800/40'
          }`}>
            <div className="text-2xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tight">11v11</div>
            <p className="text-[11px] sm:text-xs text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase">Match Clash Mode</p>
          </div>
          <div className={`p-4 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-purple-950/40 border-purple-800/40'
          }`}>
            <div className="text-2xl sm:text-4xl font-black text-teal-600 dark:text-teal-300 tracking-tight">100%</div>
            <p className="text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 font-semibold tracking-wider uppercase">Free &amp; In-Browser</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE FORMATION SANDBOX (PITCH & PLAYER DRILLS) */}
      {/* ========================================================================= */}
      <section id="sandbox" className={`py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-14 transition-colors ${
        isLight ? 'text-slate-900' : 'text-white'
      }`}>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
            isLight
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-700'
              : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
          }`}>
            <SvgDiamondBadge className="w-3.5 h-3.5" />
            <span>Interactive Tactics Sandbox</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            Experience Tactical Mechanics in Real-Time
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl mx-auto ${
            isLight ? 'text-slate-700' : 'text-neutral-300'
          }`}>
            Test formation geometry, toggle pressing phases, and view individual player instructions right on the pitch.
          </p>
        </div>

        {/* Sandbox Grid: Pitch on Left, Controls & Player Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Pitch Container */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-3">
            {/* Top Toolbar */}
            <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              {/* Formation Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['4-3-3', '4-2-3-1', '3-5-2', '4-4-2', '5-3-2'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormationKey(fmt)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition active:scale-95 cursor-pointer whitespace-nowrap ${
                      selectedFormationKey === fmt
                        ? 'bg-purple-600 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Tactical Phase Selector */}
              <div className="flex items-center gap-1">
                {(['balanced', 'attack', 'defense'] as const).map((ph) => (
                  <button
                    key={ph}
                    type="button"
                    onClick={() => setTacticalPhase(ph)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition active:scale-95 cursor-pointer ${
                      tacticalPhase === ph
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {ph}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch Board */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/30 bg-[#0f2e1b] shadow-xl">
              {/* Pitch Grass Stripes */}
              <div className="absolute inset-0 flex flex-col">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${i % 2 === 0 ? 'bg-white/[0.04]' : 'bg-transparent'}`}
                  />
                ))}
              </div>

              {/* Pitch Markings */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect x="4" y="4" width="92" height="92" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.8)" />
                <rect x="25" y="4" width="50" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <rect x="36" y="4" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <rect x="25" y="80" width="50" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                <rect x="36" y="90" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              </svg>

              {/* Players Tokens */}
              {heroPositions.map((player) => {
                const { x, y } = getShiftedPosition(player, tacticalPhase);
                const isSelected = selectedPlayerId === player.id;
                return (
                  <motion.button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayerId(player.id)}
                    animate={{ left: `${x}%`, top: `${y}%` }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-black text-[9px] sm:text-[10px] shadow-lg transition-transform duration-200 group-hover:scale-125 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-110'
                          : 'bg-purple-500 text-white ring-1 ring-purple-950/40'
                      }`}
                    >
                      {player.label}
                    </div>
                    <span
                      className={`text-[8px] sm:text-[9px] font-bold px-1 rounded mt-0.5 whitespace-nowrap shadow-sm pointer-events-none ${
                        isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-black/80 text-white'
                      }`}
                    >
                      {player.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Card: Selected Player Tactical Profile */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className={`p-6 rounded-3xl border shadow-md space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Tactical Role Profile
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activePlayer.role}
                </span>
              </div>

              <div>
                <h3 className={`text-xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {activePlayer.name}
                </h3>
                <p className="text-xs text-purple-400 font-semibold">Jersey #{activePlayer.label}</p>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-neutral-800/60 border-neutral-700 text-neutral-300'
              }`}>
                <p className="font-semibold text-purple-400 mb-1">Assigned Instruction:</p>
                {activePlayer.instruction}
              </div>

              <button
                type="button"
                onClick={() => onLaunchBoard(selectedFormationKey)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Edit Squad in Full Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURE BENTO GRID */}
      {/* ========================================================================= */}
      <section id="features" className={`py-12 sm:py-24 border-t px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-16 transition-colors ${
        isLight ? 'border-slate-200' : 'border-neutral-800'
      }`}>
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
            isLight
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-700'
              : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
          }`}>
            <SvgDiamondBadge className="w-3.5 h-3.5" />
            <span>Complete Tactical Arsenal</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            Engineered for Modern Football Minds
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl mx-auto ${
            isLight ? 'text-slate-700' : 'text-neutral-300'
          }`}>
            Every tool you need to analyze opponent patterns, communicate match strategies with players, and export publication-ready visuals.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: 11v11 Simulation */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SvgMatchClash className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              True 11v11 &amp; Single Team Modes
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Switch effortlessly between single squad drill planning and full 11 vs 11 pitch clashes. Drag players to map pressing traps, overloads, and defensive cover shadows in real time.
            </p>
          </div>

          {/* Card 2: 11 Turf Styles */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SvgTurfStadium className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              11 Stadium Turf Textures
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              From Premier League lawn stripes, concentric mower rings, diamond cut turf to 4G synthetic turf and winter frost with daylight, sunset, and floodlight stadium modes.
            </p>
          </div>

          {/* Card 3: Keyframe Studio */}
          <div id="keyframes" className={`p-6 rounded-3xl border transition-all space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SvgKeyframeFilm className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Keyframe Animation Studio
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Record player movements across Phase 1, Phase 2, and Phase 3. Play back corner routines, counter-attacks, and pressing schemes with smooth automated transitions.
            </p>
          </div>

          {/* Card 4: Tactical Arrows */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SvgDrawingTactics className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Precision Tactical Drawing
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Sketch passing lanes, diagonal runs, dribbling zones, and pressing arrows with multiple line styles. Enable the live heatmap overlay to visualize pitch occupancy.
            </p>
          </div>

          {/* Card 5: Kit Customizer */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SvgJerseyKit className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Full Kit &amp; Jersey Customizer
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Tailor team strips with custom primary/secondary colors, vertical stripes, horizontal hoops, sashes, goalkeeper colors, custom squad numbers, and team crest badges.
            </p>
          </div>

          {/* Card 6: 4K Export */}
          <div className={`p-6 rounded-3xl border transition-all space-y-4 group sm:col-span-2 lg:col-span-1 shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-purple-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SvgExport4K className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Instant HD Graphic Export
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Generate crisp PNG image files formatted for tactical books, coaching slideshows, Twitter/X breakdowns, and video editing overlays with one click.
            </p>
          </div>

        </div>

        {/* Center Launch CTA */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => onLaunchBoard()}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-purple-900/40 transition active:scale-95 inline-flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Launch Tactical Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SQUAD PRESETS & FORMATIONS SHOWCASE */}
      {/* ========================================================================= */}
      <section id="formations" className={`py-12 sm:py-24 border-t px-4 sm:px-6 lg:px-8 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#080414] border-neutral-800'
      }`}>
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
              isLight
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-700'
                : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
            }`}>
              <SvgDiamondBadge className="w-3.5 h-3.5" />
              <span>Instant Tactical Setups</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Pre-Configured Tactical Archetypes
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
              Pick a tactical archetype to load immediately into the interactive board:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Archetype 1 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    4-3-3 Holding
                  </span>
                  <span className="text-xs font-bold uppercase text-purple-400">Possession Base</span>
                </div>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Elite Positional Play (Juego de Posición)
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Single pivot CDM shielding central defense with high-positioned wingers creating 1v1 overloads and interior #8s exploiting half-spaces.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLaunchBoard('4-3-3 Holding')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch this Formation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Archetype 2 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    4-2-3-1 Modern
                  </span>
                  <span className="text-xs font-bold uppercase text-teal-400">High Press &amp; Transition</span>
                </div>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Double Pivot Heavy Metal Press
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Stifling midfield control with dual defensive pivots, a creative central #10 creating killer through-balls, and rapid counter-pressing triggers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLaunchBoard('4-2-3-1 Modern')}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch this Formation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Archetype 3 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 sm:col-span-2 lg:col-span-1 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    3-5-2 Wing-Back
                  </span>
                  <span className="text-xs font-bold uppercase text-amber-400">Fluid Overload</span>
                </div>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  3-Back Dynamic Width &amp; 2 Strikers
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Solid 3-center-back defensive foundation with marathon wing-backs supplying crosses to dual attacking target strikers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLaunchBoard('3-5-2 Wing-Back')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch this Formation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ SECTION */}
      {/* ========================================================================= */}
      <section id="faq" className={`py-12 sm:py-24 border-t px-4 sm:px-6 lg:px-8 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-black border-neutral-800'
      }`}>
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
              isLight
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-700'
                : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
            }`}>
              <SvgCrownStar className="w-3.5 h-3.5 text-amber-500" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Tactical Board Knowledge Base
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border overflow-hidden transition-all shadow-sm ${
                    isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className={`w-full px-5 sm:px-7 py-4 sm:py-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-[0.99] ${
                      isLight ? 'text-slate-900 hover:text-purple-700' : 'text-white hover:text-purple-300'
                    }`}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 text-purple-400'
                          : isLight
                          ? 'text-slate-400'
                          : 'text-neutral-500'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`px-5 sm:px-7 pb-5 text-xs leading-relaxed border-t pt-3.5 ${
                          isLight
                            ? 'border-slate-100 text-slate-700'
                            : 'border-neutral-800 text-neutral-300'
                        }`}
                      >
                        {item.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE FOOTER */}
      {/* ========================================================================= */}
      <footer className={`mt-auto border-t text-xs py-10 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isLight
          ? 'border-slate-200 bg-white text-slate-700'
          : 'border-neutral-800 bg-[#060310] text-neutral-400'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <SvgBeCoachCrown className="w-full h-full drop-shadow-md" />
              </div>
              <span className={`font-black text-lg tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Be&nbsp;<span className="text-purple-400">Coach</span>
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              The premier web-based football tactics board and squad manager for coaches, tactical analysts, content creators, and football enthusiasts worldwide.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-purple-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>3D Tactical Engine • 2026 Edition</span>
            </div>
          </div>

          {/* Column 2: Studio Features */}
          <div className="space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950' : 'text-white'}`}>Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => onLaunchBoard()} className="hover:text-purple-400 transition text-left cursor-pointer">
                  11v11 Matchup Board
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onLaunchBoard()} className="hover:text-purple-400 transition text-left cursor-pointer">
                  Turf &amp; Lighting Styles
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onLaunchBoard()} className="hover:text-purple-400 transition text-left cursor-pointer">
                  Tactical Arrows &amp; Heatmaps
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onLaunchBoard()} className="hover:text-purple-400 transition text-left cursor-pointer">
                  Keyframe Animation Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Formations */}
          <div className="space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950' : 'text-white'}`}>Formations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={() => onLaunchBoard('4-3-3')} className="hover:text-purple-400 transition text-left cursor-pointer">
                  4-3-3 Attack
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onLaunchBoard('4-2-3-1')} className="hover:text-purple-400 transition text-left cursor-pointer">
                  4-2-3-1 High Press
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onLaunchBoard('3-5-2')} className="hover:text-purple-400 transition text-left cursor-pointer">
                  3-5-2 Wing-Back
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onLaunchBoard('5-3-2')} className="hover:text-purple-400 transition text-left cursor-pointer">
                  5-3-2 Low Block
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div className="space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950' : 'text-white'}`}>Legal &amp; Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-purple-400 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <SvgDiamondBadge className="w-3.5 h-3.5 text-purple-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-purple-400 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('cookies')}
                  className="hover:text-purple-400 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('guide')}
                  className="hover:text-purple-400 transition text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <SvgCrownStar className="w-3.5 h-3.5 text-amber-500" />
                  <span>User Guide</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className={`max-w-7xl mx-auto mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <p>© 2026 Be Coach — Elite Football Tactical Board &amp; Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onOpenLegal('privacy')} className="hover:text-purple-400 transition cursor-pointer">
              Privacy
            </button>
            <span>•</span>
            <button type="button" onClick={() => onOpenLegal('terms')} className="hover:text-purple-400 transition cursor-pointer">
              Terms
            </button>
            <span>•</span>
            <button type="button" onClick={() => onOpenLegal('cookies')} className="hover:text-purple-400 transition cursor-pointer">
              Cookies
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
