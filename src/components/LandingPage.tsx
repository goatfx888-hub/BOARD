import React, { useState } from 'react';
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
  Activity,
  Flame,
  Radio,
  Sparkles,
  Crosshair,
  RotateCcw,
} from 'lucide-react';
import { LegalTabType } from './LegalModal';
import { useTheme } from '../context/ThemeContext';
import {
  SvgBeCoachLogo,
  SvgCoachLogo,
  SvgFootballBall,
  SvgLuxuryCrest,
  SvgMatchClash,
  SvgTurfStadium,
  SvgKeyframeFilm,
  SvgDrawingTactics,
  SvgJerseyKit,
  SvgExport4K,
  SvgCrownStar,
  SvgLuxuryArrow,
  SvgLuxuryPlay,
  SvgLuxuryCheck,
  SvgDiamondBadge,
  SvgDarkModePro,
  SvgLightModePro,
} from './LandingSvgIcons';

interface LandingPageProps {
  onLaunchBoard: (presetName?: string) => void;
  onOpenLegal: (tab: LegalTabType) => void;
}

// Mini-pitch animated preview positions for the Hero showcase
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
    question: 'Can I switch between Single-Team view and 11v11 Home vs Away Match mode?',
    answer:
      'Yes. In the studio, toggle between "Home Team", "Away Team", or full "11 vs 11 Matchup" mode to test defensive shape against opposing attacking runs simultaneously.',
  },
  {
    question: 'Are my tactics and custom lineups kept private?',
    answer:
      'Yes. All tactical board state, drawings, custom player names, and kit customizations reside exclusively in your local browser session. No tactics are stored on public servers without your explicit action.',
  },
];

const getShiftedPosition = (
  player: HeroPlayer,
  phase: 'balanced' | 'attack' | 'defense',
) => {
  let { x, y } = player;
  const role = player.role.toUpperCase();

  if (phase === 'attack') {
    if (role.includes('ST')) {
      y = Math.max(9, y - 7);
    } else if (role.includes('LW') || role.includes('RW')) {
      y = Math.max(14, y - 8);
      x = role.includes('LW') ? Math.min(x + 5, 29) : Math.max(x - 5, 71);
    } else if (role.includes('CAM') || role.includes('LAM') || role.includes('RAM')) {
      y = Math.max(22, y - 10);
    } else if (role.includes('LB') || role.includes('RB') || role.includes('LWB') || role.includes('RWB')) {
      y = Math.max(44, y - 22);
    } else if (role.includes('CM') || role.includes('CDM') || role.includes('LM') || role.includes('RM')) {
      y = Math.max(34, y - 12);
    } else if (role.includes('CB')) {
      y = Math.max(60, y - 14);
    } else if (role.includes('GK')) {
      y = Math.max(78, y - 8);
    }
  } else if (phase === 'defense') {
    if (role.includes('ST')) {
      y = Math.min(38, y + 18);
    } else if (role.includes('LW') || role.includes('RW') || role.includes('LM') || role.includes('RM')) {
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

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchBoard,
  onOpenLegal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [selectedFormationKey, setSelectedFormationKey] =
    useState<keyof typeof HERO_FORMATIONS>('4-3-3');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showZones, setShowZones] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'pitch' | 'tactics' | 'kit'>('pitch');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tactical Analysis State
  const [tacticalPhase, setTacticalPhase] = useState<'balanced' | 'attack' | 'defense'>('balanced');

  const heroPositions = HERO_FORMATIONS[selectedFormationKey] || HERO_FORMATIONS['4-3-3'];
  const activePlayer = heroPositions.find((p) => p.id === selectedPlayerId) || heroPositions[9]; // default to striker

  return (
    <div
      className={`min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-slate-950'
          : 'bg-black text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
      }`}
    >
      {/* ========================================================================= */}
      {/* NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-2xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all ${
          isLight
            ? 'bg-white/95 border-b border-slate-200 shadow-sm'
            : 'bg-black/95 border-b border-neutral-800 shadow-2xl'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Luxury Football Logo Brand */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl p-0.5 flex items-center justify-center shadow-md shrink-0 group border ${
              isLight
                ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-emerald-500/10 border-emerald-300/40'
                : 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-emerald-500/20 border-emerald-300/40'
            }`}>
              <div
                className={`w-full h-full rounded-[10px] sm:rounded-[14px] flex items-center justify-center overflow-hidden p-1 ${
                  isLight ? 'bg-white' : 'bg-black'
                }`}
              >
                <SvgBeCoachLogo className="w-full h-full drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span
                  className={`font-black text-xs sm:text-sm md:text-base tracking-normal uppercase ${
                    isLight ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  BE COACH
                </span>
              </div>
              <p className={`text-[10px] font-medium tracking-normal hidden sm:block mt-0.5 ${
                isLight ? 'text-emerald-700/80 font-medium' : 'text-emerald-600 dark:text-emerald-400/80'
              }`}>
                Elite Football Tactical Board
              </p>
            </div>
          </div>

          {/* Center Navigation Links with Professional Typography */}
          <nav
            className={`hidden lg:flex items-center gap-5 xl:gap-8 text-xs font-semibold tracking-wider uppercase whitespace-nowrap ${
              isLight ? 'text-slate-700' : 'text-neutral-300'
            }`}
          >
            <a href="#features" className={isLight ? "hover:text-emerald-600 transition-colors" : "hover:text-emerald-500 transition-colors"}>Features</a>
            <a href="#pitch-styles" className={isLight ? "hover:text-emerald-600 transition-colors" : "hover:text-emerald-500 transition-colors"}>Turf &amp; Textures</a>
            <a href="#formations" className={isLight ? "hover:text-emerald-600 transition-colors" : "hover:text-emerald-500 transition-colors"}>Formations</a>
            <a href="#keyframes" className={isLight ? "hover:text-emerald-600 transition-colors" : "hover:text-emerald-500 transition-colors"}>Keyframe Studio</a>
            <a href="#faq" className={isLight ? "hover:text-emerald-600 transition-colors" : "hover:text-emerald-500 transition-colors"}>FAQ</a>
          </nav>

          {/* Action Group (Without Redundant Header CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center active:scale-95 ${
                isLight
                  ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'
                  : 'border-neutral-800 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <SvgDarkModePro className="w-4 h-4 drop-shadow-sm" />
              ) : (
                <SvgLightModePro className="w-4 h-4 drop-shadow-sm" />
              )}
            </button>

            <button
              onClick={() => onOpenLegal('guide')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 whitespace-nowrap cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm'
                  : 'border-neutral-800 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300'
              }`}
            >
              <SvgDiamondBadge className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-500'}`} />
              <span>User Guide</span>
            </button>

            {/* Mobile & Tablet Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition active:scale-95 flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-4 h-4 ${isLight ? 'text-slate-800' : 'text-emerald-500'}`} />
              ) : (
                <Menu className={`w-4 h-4 ${isLight ? 'text-slate-800' : 'text-emerald-500'}`} />
              )}
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Quick Nav Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`lg:hidden pt-3 pb-2 mt-2 border-t flex flex-col gap-1.5 text-xs font-display font-semibold ${
                isLight ? 'border-slate-200 text-slate-800' : 'border-neutral-800 text-neutral-300'
              }`}
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl active:scale-[0.99] transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SvgMatchClash className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  <span>Tactical Features</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <a
                href="#pitch-styles"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl active:scale-[0.99] transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SvgTurfStadium className={`w-4 h-4 ${isLight ? 'text-teal-600' : 'text-teal-500'}`} />
                  <span>Turf Textures &amp; Lighting</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <a
                href="#formations"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl active:scale-[0.99] transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SvgDiamondBadge className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  <span>Presets &amp; Formations</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <a
                href="#keyframes"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl active:scale-[0.99] transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SvgKeyframeFilm className="w-4 h-4 text-amber-500" />
                  <span>Keyframe Movement Studio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl active:scale-[0.99] transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SvgCrownStar className="w-4 h-4 text-amber-500" />
                  <span>FAQ &amp; Knowledge Base</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLegal('guide');
                }}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl active:scale-[0.99] transition text-left cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SvgDiamondBadge className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  <span>Coaching User Guide</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION WITH TACTICAL STADIUM BACKGROUND & MATCHDAY STUDIO */}
      {/* ========================================================================= */}
      <section className="relative isolate overflow-hidden pt-4 pb-10 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-24 px-3 sm:px-6 lg:px-8">
        
        {/* Background Atmosphere: Cinematic Stadium & Tactical Chalkboard */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* Tactical Stadium & Player Celebrating Background Image - Multi-device Framing */}
          <img
            src="/hero-tactical-bg.jpg"
            alt="Football Stadium Tactical Atmosphere"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-[78%_20%] sm:object-[72%_25%] md:object-[68%_30%] lg:object-right transition-all duration-700 ${
              isLight
                ? 'opacity-35 sm:opacity-40 filter brightness-[1.05] contrast-[1.05]'
                : 'opacity-90 sm:opacity-95 filter brightness-[0.95] contrast-[1.15]'
            }`}
          />

          {/* Tactical Pitch Geometry Dot Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:28px_28px] opacity-15" />

          {/* Background Ambient Glow */}
          <div
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[480px] lg:w-[650px] h-[280px] sm:h-[480px] lg:h-[650px] rounded-full blur-3xl pointer-events-none ${
              isLight ? 'bg-emerald-500/10' : 'bg-emerald-500/25'
            }`}
          />

          {/* High-Legibility Adaptive Gradient Overlay for Phones, Tablets & Desktops */}
          <div
            className={`absolute inset-0 transition-colors duration-300 ${
              isLight
                ? 'bg-gradient-to-b from-slate-50/95 via-slate-50/80 to-slate-50/95 lg:bg-gradient-to-r lg:from-slate-50/95 lg:via-slate-50/75 lg:to-slate-50/30'
                : 'bg-gradient-to-b from-black/90 via-black/65 to-black/90 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/45 lg:to-transparent'
            }`}
          />

          {/* Top Boundary Vignette */}
          <div
            className={`absolute top-0 inset-x-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-b ${
              isLight ? 'from-slate-50/90' : 'from-black/85'
            } to-transparent`}
          />

          {/* Bottom Boundary Vignette */}
          <div
            className={`absolute bottom-0 inset-x-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t ${
              isLight ? 'from-slate-50' : 'from-black'
            } to-transparent`}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-14">
          
          {/* Left Column: Headline, Description & The ONLY Primary Middle CTA */}
          <div className="flex-1 text-center lg:text-left space-y-3.5 sm:space-y-5 lg:space-y-6 max-w-2xl">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase shadow-sm ${
                isLight
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/70 border border-emerald-400/40 text-emerald-300'
              }`}
            >
              <SvgCrownStar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Next-Gen Football Tactics Studio • 2026 Edition</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] sm:leading-[1.12] uppercase ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              BE COACH AND{' '}
              <span className="block font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 mt-0.5 sm:mt-1">
                SHOW US YOUR IDEAS
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-normal px-0.5 sm:px-0 max-w-xl mx-auto lg:mx-0 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              The all-in-one football tactics board trusted by coaches, analysts, and creators. Build custom formations, simulate 11v11 clashes, customize realistic stadium turf, design team kits, and record animated tactical sequences.
            </motion.p>

            {/* Tactical Highlights Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-0.5 sm:pt-1"
            >
              <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border flex items-center gap-1.5 ${
                isLight ? 'bg-slate-100/90 border-slate-200 text-slate-700' : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
              }`}>
                <Crosshair className="w-3.5 h-3.5 text-emerald-500" />
                <span>5-Channel Positional Play</span>
              </span>
              <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border flex items-center gap-1.5 ${
                isLight ? 'bg-slate-100/90 border-slate-200 text-slate-700' : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
              }`}>
                <Activity className="w-3.5 h-3.5 text-teal-500" />
                <span>11v11 Match Engine</span>
              </span>
              <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold border flex items-center gap-1.5 ${
                isLight ? 'bg-slate-100/90 border-slate-200 text-slate-700' : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Animated Keyframe Transitions</span>
              </span>
            </motion.div>

            {/* MIDDLE PRIMARY CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2 w-full"
            >
              {/* Primary Middle CTA Button */}
              <button
                onClick={() => onLaunchBoard(selectedFormationKey)}
                className="w-full sm:w-auto px-6 sm:px-9 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer group relative overflow-hidden luxury-cta text-slate-950 border border-emerald-200/50 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-luxury-shimmer pointer-events-none" />
                <SvgLuxuryPlay className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="tracking-wide whitespace-nowrap font-extrabold">Open Tactical Board</span>
                <SvgLuxuryArrow className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* Secondary Feature Explorer Button */}
              <a
                href="#features"
                className={`w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] ${
                  isLight
                    ? 'bg-white/90 hover:bg-white border-slate-300 text-slate-800'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
                }`}
              >
                <SvgDiamondBadge className="w-4 h-4 text-emerald-500" />
                <span>Explore Features</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`pt-1 sm:pt-4 flex flex-wrap sm:grid sm:grid-cols-3 justify-center lg:justify-start gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-semibold ${
                isLight ? 'text-slate-700' : 'text-neutral-300'
              }`}
            >
              <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 border sm:border-0 rounded-xl px-2.5 py-1.5 sm:p-0 ${
                isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
              }`}>
                <SvgLuxuryCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span>100% Free &amp; In-Browser</span>
              </div>
              <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 border sm:border-0 rounded-xl px-2.5 py-1.5 sm:p-0 ${
                isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
              }`}>
                <SvgLuxuryCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span>4K PNG Diagram Export</span>
              </div>
              <div className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 border sm:border-0 rounded-xl px-2.5 py-1.5 sm:p-0 ${
                isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
              }`}>
                <SvgLuxuryCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span>Interactive 11v11 Engine</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Friendly & Responsive Interactive Hero Pitch Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none mx-auto"
          >
            <div className={`relative p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-2xl border transition-all ${
              isLight
                ? 'bg-white/95 border-slate-200 shadow-slate-200/80 backdrop-blur-md'
                : 'bg-neutral-950/95 border-neutral-800 shadow-black backdrop-blur-md'
            }`}>
              
              {/* Top Board Control Bar (Formations + Tactical Phases + Interactive Toggles) */}
              <div className={`p-2 sm:p-3 rounded-t-xl sm:rounded-t-2xl flex flex-col gap-1.5 sm:gap-2 border-b ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black border-neutral-800 text-white'
              }`}>
                
                {/* Row 1: Formation Selectors & 5-Channel Zones */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full scrollbar-none">
                    {(['4-3-3', '4-2-3-1', '3-5-2', '4-4-2', '5-3-2'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          setSelectedFormationKey(fmt);
                          setSelectedPlayerId(null);
                        }}
                        className={`px-2 sm:px-2.5 md:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedFormationKey === fmt
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-extrabold'
                            : isLight
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowZones(!showZones)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold border flex items-center gap-1 transition active:scale-95 cursor-pointer shrink-0 ${
                      showZones
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold shadow-sm'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-black border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                    title="Toggle Tactical 5-Channel Zones"
                  >
                    <span>Zones</span>
                  </button>
                </div>

                {/* Row 2: Tactical Phase Simulator (Balanced, Attack, Defense) */}
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/60 dark:border-neutral-800/80 text-[10px] sm:text-[11px]">
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 text-slate-500 dark:text-neutral-400">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span>Phase Sim:</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTacticalPhase('balanced')}
                      className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold transition cursor-pointer ${
                        tacticalPhase === 'balanced'
                          ? 'bg-slate-800 text-white dark:bg-neutral-200 dark:text-slate-950 shadow-xs'
                          : isLight
                          ? 'text-slate-600 hover:bg-slate-200'
                          : 'text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      Shape
                    </button>
                    <button
                      onClick={() => setTacticalPhase('attack')}
                      className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5 sm:gap-1 ${
                        tacticalPhase === 'attack'
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : isLight
                          ? 'text-emerald-700 hover:bg-emerald-50'
                          : 'text-emerald-400 hover:bg-emerald-950/50'
                      }`}
                    >
                      <span>Attack</span>
                      <span className="text-[8px] sm:text-[9px]">▲</span>
                    </button>
                    <button
                      onClick={() => setTacticalPhase('defense')}
                      className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold transition cursor-pointer flex items-center gap-0.5 sm:gap-1 ${
                        tacticalPhase === 'defense'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : isLight
                          ? 'text-amber-700 hover:bg-amber-50'
                          : 'text-amber-400 hover:bg-amber-950/50'
                      }`}
                    >
                      <span>Defense</span>
                      <span className="text-[8px] sm:text-[9px]">▼</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Pitch Canvas Preview */}
              <div className="relative aspect-[4/3] rounded-lg sm:rounded-xl bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 overflow-hidden select-none shadow-inner">
                
                {/* Grass Stripes Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08)_50%,transparent_50%)] bg-[length:100%_40px] opacity-50 pointer-events-none" />

                {/* Tactical 5-Channel Zones Overlay */}
                {showZones && (
                  <div className="absolute inset-0 grid grid-cols-5 pointer-events-none z-0">
                    <div className="border-r border-dashed border-white/15 bg-white/[0.02] flex items-start justify-center pt-2 text-[7px] font-semibold text-white/40 uppercase tracking-wider">Flank</div>
                    <div className="border-r border-dashed border-cyan-400/20 bg-cyan-500/[0.04] flex items-start justify-center pt-2 text-[7px] font-semibold text-cyan-300/60 uppercase tracking-wider">Half-Space</div>
                    <div className="border-r border-dashed border-white/15 bg-white/[0.015] flex items-start justify-center pt-2 text-[7px] font-semibold text-emerald-300/60 uppercase tracking-wider">Center</div>
                    <div className="border-r border-dashed border-cyan-400/20 bg-cyan-500/[0.04] flex items-start justify-center pt-2 text-[7px] font-semibold text-cyan-300/60 uppercase tracking-wider">Half-Space</div>
                    <div className="bg-white/[0.02] flex items-start justify-center pt-2 text-[7px] font-semibold text-white/40 uppercase tracking-wider">Flank</div>
                  </div>
                )}

                {/* Pitch Markings SVG */}
                <svg className="absolute inset-0 w-full h-full stroke-white/50 fill-none" strokeWidth="2">
                  {/* Outer Boundary */}
                  <rect x="5%" y="5%" width="90%" height="90%" rx="6" />
                  {/* Halfway Line */}
                  <line x1="5%" y1="50%" x2="95%" y2="50%" />
                  {/* Center Circle */}
                  <circle cx="50%" cy="50%" r="14%" />
                  <circle cx="50%" cy="50%" r="2" className="fill-white/80" />
                  {/* Penalty Box Top */}
                  <rect x="25%" y="5%" width="50%" height="18%" />
                  <rect x="36%" y="5%" width="28%" height="7%" />
                  <circle cx="50%" cy="17%" r="2" className="fill-white/80" />
                  {/* Penalty Box Bottom */}
                  <rect x="25%" y="77%" width="50%" height="18%" />
                  <rect x="36%" y="88%" width="28%" height="7%" />
                  <circle cx="50%" cy="83%" r="2" className="fill-white/80" />
                </svg>

                {/* Dynamic Player Tokens with Phase Shift Physics */}
                {heroPositions.map((player) => {
                  const isSelected = selectedPlayerId === player.id;
                  const shifted = getShiftedPosition(player, tacticalPhase);

                  return (
                    <motion.div
                      key={player.id}
                      layout
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        left: `${shifted.x}%`,
                        top: `${shifted.y}%`,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 26,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group p-1"
                      onClick={() => setSelectedPlayerId(player.id)}
                    >
                      {/* Player Token Circle */}
                      <div
                        className={`w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-[9px] sm:text-[10px] md:text-xs transition-all shadow-md ${
                          isSelected
                            ? 'bg-emerald-400 text-slate-950 ring-3 sm:ring-4 ring-emerald-300/60 scale-120 sm:scale-125'
                            : isLight
                            ? 'bg-white border-2 border-emerald-500 text-slate-900 group-hover:scale-115 group-hover:border-emerald-600'
                            : 'bg-black border-2 border-emerald-400 text-white group-hover:scale-115 group-hover:border-emerald-300'
                        }`}
                      >
                        {player.label}
                      </div>

                      {/* Position Tag */}
                      <span
                        className={`text-[7px] sm:text-[8px] md:text-[9px] font-bold px-1 sm:px-1.5 py-0.2 rounded mt-0.5 tracking-tight uppercase shadow-sm border ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                            : isLight
                            ? 'bg-white/95 text-slate-800 border-slate-300'
                            : 'bg-black/90 text-neutral-200 border-neutral-800'
                        }`}
                      >
                        {player.role}
                      </span>
                    </motion.div>
                  );
                })}

                {/* Floating Tactical Badges & Phase Indicator */}
                <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-30 bg-black/90 backdrop-blur-md border border-emerald-500/40 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold text-emerald-300 shadow-md flex items-center gap-1 sm:gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {tacticalPhase === 'attack'
                      ? 'Attacking Overload (xG +2.4)'
                      : tacticalPhase === 'defense'
                      ? 'Compact Mid-Block (xGA -0.3)'
                      : 'Positional Base: xG +1.92'}
                  </span>
                </div>

                <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 z-30 bg-black/90 backdrop-blur-md border border-amber-500/40 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold text-amber-300 shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400" />
                  <span>
                    {tacticalPhase === 'attack'
                      ? 'Box Entry Overload'
                      : tacticalPhase === 'defense'
                      ? 'Rest Defense Safe'
                      : 'High Press Zone'}
                  </span>
                </div>
              </div>

              {/* Bottom Player Tactical Instruction & Launch Bar */}
              <div className={`p-2 sm:p-3 rounded-b-xl sm:rounded-b-2xl flex items-center justify-between border-t gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black border-neutral-800 text-white'
              }`}>
                <div className="flex items-center gap-2 text-xs truncate min-w-0 flex-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full font-black flex items-center justify-center text-[9px] sm:text-[10px] shrink-0 bg-emerald-500 text-slate-950">
                    {activePlayer.label}
                  </div>
                  <div className="truncate min-w-0 flex-1">
                    <p className={`font-bold text-[11px] sm:text-xs truncate ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {activePlayer.name} ({activePlayer.role})
                    </p>
                    <p className={`text-[10px] sm:text-[11px] truncate ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                      {activePlayer.instruction}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchBoard(selectedFormationKey)}
                  className="w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition shadow-sm shrink-0 cursor-pointer active:scale-95 bg-emerald-500 hover:bg-emerald-400 text-slate-950 whitespace-nowrap"
                >
                  <span>Edit in Studio</span>
                  <SvgLuxuryArrow className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* STATS & CREDIBILITY BAR */}
      {/* ========================================================================= */}
      <section className={`border-y py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden transition-colors ${
        isLight
          ? 'bg-slate-100/60 border-slate-200 text-slate-900'
          : 'bg-black border-neutral-800 text-white'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6 text-center">
          <div className={`p-3.5 sm:p-5 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className={`text-2xl sm:text-4xl font-luxury font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>50+</div>
            <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-display font-semibold tracking-wider uppercase">Formations</p>
          </div>
          <div className={`p-3.5 sm:p-5 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="text-2xl sm:text-4xl font-luxury font-black text-amber-500 dark:text-amber-300 tracking-tight">11</div>
            <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-display font-semibold tracking-wider uppercase">Turf Styles</p>
          </div>
          <div className={`p-3.5 sm:p-5 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="text-2xl sm:text-4xl font-luxury font-black text-emerald-600 dark:text-emerald-400 tracking-tight">11v11</div>
            <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-display font-semibold tracking-wider uppercase">Match Clash</p>
          </div>
          <div className={`p-3.5 sm:p-5 rounded-2xl border space-y-1 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="text-2xl sm:text-4xl font-luxury font-black text-teal-600 dark:text-teal-300 tracking-tight">100%</div>
            <p className="text-[10px] sm:text-xs text-teal-600 dark:text-teal-400 font-display font-semibold tracking-wider uppercase">Speed &amp; Privacy</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURE BENTO GRID (Deep presentation of website & board) */}
      {/* ========================================================================= */}
      <section id="features" className="py-12 sm:py-24 lg:py-32 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-display font-bold tracking-[0.15em] uppercase border ${
            isLight
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-sm'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            <SvgDiamondBadge className="w-3.5 h-3.5" />
            <span>Complete Tactical Arsenal</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-luxury font-black tracking-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            Engineered for Modern Football Minds
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base font-sans leading-relaxed max-w-xl mx-auto ${
            isLight ? 'text-slate-700' : 'text-neutral-300'
          }`}>
            Every tool you need to analyze opponent patterns, communicate match strategies with players, and export publication-ready visuals.
          </p>
        </div>

        {/* Bento Grid with Custom Luxury SVGs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          
          {/* Card 1: 11v11 Match Simulation */}
          <div className={`p-5 sm:p-7 rounded-3xl border transition-all space-y-3.5 sm:space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-850'
          }`}>
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-400/30 text-emerald-500'
            }`}>
              <SvgMatchClash className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              True 11v11 &amp; Single Team Modes
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Switch effortlessly between single squad drill planning and full 11 vs 11 pitch clashes. Drag players to map pressing traps, overloads, and defensive cover shadows in real time.
            </p>
          </div>

          {/* Card 2: Realistic Pitch Textures */}
          <div id="pitch-styles" className={`p-5 sm:p-7 rounded-3xl border transition-all space-y-3.5 sm:space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-teal-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-teal-500/50 hover:bg-neutral-850'
          }`}>
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? 'bg-teal-50 border-teal-200 text-teal-600' : 'bg-teal-500/10 border-teal-400/30 text-teal-500'
            }`}>
              <SvgTurfStadium className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              11 Stadium Turf Textures
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              From Premier League lawn stripes, concentric mower rings, diamond cut turf to 4G synthetic turf and winter frost with daylight, sunset, and floodlight stadium modes.
            </p>
          </div>

          {/* Card 3: Keyframe Studio */}
          <div id="keyframes" className={`p-5 sm:p-7 rounded-3xl border transition-all space-y-3.5 sm:space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-850'
          }`}>
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-400/30 text-emerald-500'
            }`}>
              <SvgKeyframeFilm className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Keyframe Animation Studio
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Record player movements across Phase 1, Phase 2, and Phase 3. Play back corner routines, counter-attacks, and pressing schemes with smooth automated transitions.
            </p>
          </div>

          {/* Card 4: Tactical Arrows & Heatmaps */}
          <div className={`p-5 sm:p-7 rounded-3xl border transition-all space-y-3.5 sm:space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-amber-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-850'
          }`}>
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-amber-500/10 border-amber-400/30 text-amber-500'
            }`}>
              <SvgDrawingTactics className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Precision Tactical Drawing
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Sketch passing lanes, diagonal runs, dribbling zones, and pressing arrows with multiple line styles. Enable the live heatmap overlay to visualize pitch occupancy.
            </p>
          </div>

          {/* Card 5: Kit & Strip Customizer */}
          <div className={`p-5 sm:p-7 rounded-3xl border transition-all space-y-3.5 sm:space-y-4 group shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-blue-500/50 hover:bg-neutral-850'
          }`}>
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-blue-500/10 border-blue-400/30 text-blue-500'
            }`}>
              <SvgJerseyKit className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Full Kit &amp; Jersey Customizer
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Tailor team strips with custom primary/secondary colors, vertical stripes, horizontal hoops, sashes, goalkeeper colors, custom squad numbers, and team crest badges.
            </p>
          </div>

          {/* Card 6: 4K Export Studio */}
          <div className={`p-5 sm:p-7 rounded-3xl border transition-all space-y-3.5 sm:space-y-4 group sm:col-span-2 lg:col-span-1 shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
              : 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-850'
          }`}>
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-500/10 border-emerald-400/30 text-emerald-500'
            }`}>
              <SvgExport4K className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Instant HD / 4K Graphic Export
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Generate crisp PNG image files formatted for tactical books, coaching slideshows, Twitter/X breakdowns, and video editing overlays with one click.
            </p>
          </div>

        </div>

        {/* Center Luxury Launch CTA inside features */}
        <div className="text-center pt-2 sm:pt-6">
          <button
            onClick={() => onLaunchBoard()}
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-display font-black text-sm transition-all inline-flex items-center justify-center gap-2.5 active:scale-95 relative overflow-hidden group cursor-pointer luxury-cta text-slate-950 border border-emerald-200/40 shadow-xl shadow-emerald-500/25"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-luxury-shimmer pointer-events-none" />
            <SvgLuxuryPlay className="w-4 h-4 text-slate-950" />
            <span className="tracking-wide font-extrabold">Launch Tactical Studio</span>
            <SvgLuxuryArrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SQUAD PRESETS & FORMATIONS SHOWCASE */}
      {/* ========================================================================= */}
      <section id="formations" className={`py-12 sm:py-24 border-y px-3.5 sm:px-6 lg:px-8 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-black border-neutral-800'
      }`}>
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-14">
          
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-4">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-display font-bold tracking-[0.15em] uppercase border ${
              isLight
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-700 shadow-sm'
                : 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400'
            }`}>
              <SvgDiamondBadge className="w-3.5 h-3.5" />
              <span>Instant Tactical Setups</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-luxury font-black tracking-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Pre-Configured Tactical Archetypes
            </h2>
            <p className={`text-xs sm:text-sm font-sans ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
              Pick a tactical archetype to load immediately into the interactive board with tailored tactical instructions:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Archetype 1 */}
            <div className={`p-5 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-5 sm:space-y-6 shadow-sm ${
              isLight
                ? 'bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
                : 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/60'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg font-luxury text-xs font-bold border ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  }`}>
                    4-3-3 Holding
                  </span>
                  <span className={`text-xs font-display font-bold tracking-wide uppercase ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Possession Base</span>
                </div>
                <h3 className={`text-base sm:text-lg font-luxury font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Elite Positional Play (Juego de Posición)
                </h3>
                <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Single pivot CDM shielding central defense with high-positioned wingers creating 1v1 overloads and interior #8s exploiting half-spaces.
                </p>
              </div>
              <button
                onClick={() => onLaunchBoard('4-3-3 Holding')}
                className={`w-full py-3 rounded-xl active:scale-[0.98] font-display font-bold text-xs transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-emerald-500 hover:text-slate-950 text-slate-800 border-slate-200 hover:border-emerald-400 font-extrabold shadow-sm'
                    : 'bg-neutral-800 hover:bg-emerald-500 hover:text-slate-950 text-white border-neutral-700 hover:border-emerald-400'
                }`}
              >
                <span>Launch this Formation</span>
                <SvgLuxuryArrow className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Archetype 2 */}
            <div className={`p-5 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-5 sm:space-y-6 shadow-sm ${
              isLight
                ? 'bg-white border-slate-200 hover:border-teal-500/50 hover:shadow-md'
                : 'bg-neutral-900 border-neutral-800 hover:border-teal-500/60'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg font-luxury text-xs font-bold border ${
                    isLight
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                  }`}>
                    4-2-3-1 Modern
                  </span>
                  <span className={`text-xs font-display font-bold tracking-wide uppercase ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>High Press &amp; Transition</span>
                </div>
                <h3 className={`text-base sm:text-lg font-luxury font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Double Pivot Heavy Metal Press
                </h3>
                <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Stifling midfield control with dual defensive pivots, a creative central #10 creating killer through-balls, and rapid counter-pressing triggers.
                </p>
              </div>
              <button
                onClick={() => onLaunchBoard('4-2-3-1 Modern')}
                className={`w-full py-3 rounded-xl active:scale-[0.98] font-display font-bold text-xs transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-teal-400 hover:text-slate-950 text-slate-800 border-slate-200 hover:border-teal-400 font-extrabold shadow-sm'
                    : 'bg-neutral-800 hover:bg-teal-400 hover:text-slate-950 text-white border-neutral-700 hover:border-teal-400'
                }`}
              >
                <span>Launch this Formation</span>
                <SvgLuxuryArrow className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Archetype 3 */}
            <div className={`p-5 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-5 sm:space-y-6 sm:col-span-2 lg:col-span-1 shadow-sm ${
              isLight
                ? 'bg-white border-slate-200 hover:border-amber-500/50 hover:shadow-md'
                : 'bg-neutral-900 border-neutral-800 hover:border-amber-500/60'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg font-luxury text-xs font-bold border ${
                    isLight
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    3-5-2 Wing-Back
                  </span>
                  <span className={`text-xs font-display font-bold tracking-wide uppercase ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Fluid Overload</span>
                </div>
                <h3 className={`text-base sm:text-lg font-luxury font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  3-Back Dynamic Width &amp; 2 Strikers
                </h3>
                <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Solid 3-center-back defensive foundation with marathon wing-backs supplying crosses to dual attacking target strikers.
                </p>
              </div>
              <button
                onClick={() => onLaunchBoard('3-5-2 Wing-Back')}
                className={`w-full py-3 rounded-xl active:scale-[0.98] font-display font-bold text-xs transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-amber-400 hover:text-slate-950 text-slate-800 border-slate-200 hover:border-amber-400 font-extrabold shadow-sm'
                    : 'bg-neutral-800 hover:bg-amber-400 hover:text-slate-950 text-white border-neutral-700 hover:border-amber-400'
                }`}
              >
                <span>Launch this Formation</span>
                <SvgLuxuryArrow className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 STEP HOW IT WORKS */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-24 lg:py-32 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-display font-bold tracking-[0.15em] uppercase border ${
            isLight
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-sm'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            <SvgDiamondBadge className="w-3.5 h-3.5" />
            <span>Tactical Workflow</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-luxury font-black tracking-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            From Match Plan to Pitch Execution in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          
          {/* Step 1 */}
          <div className={`p-5 sm:p-7 rounded-3xl border relative space-y-3.5 sm:space-y-4 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="w-10 h-10 rounded-2xl font-luxury font-black text-base flex items-center justify-center shadow-md bg-emerald-500 text-slate-950 shadow-emerald-500/30">
              I
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Configure Squad &amp; Formation
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Select preset squads or customize your own starting XI. Assign player roles, jersey numbers, captaincy, and choose your favorite pitch turf texture.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-5 sm:p-7 rounded-3xl border relative space-y-3.5 sm:space-y-4 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="w-10 h-10 rounded-2xl font-luxury font-black text-base flex items-center justify-center shadow-md bg-teal-400 text-slate-950 shadow-teal-500/30">
              II
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Plot Strategies &amp; Keyframe Movement
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Drag player tokens on the pitch, draw tactical arrows for runs and passes, and capture keyframe snapshots to animate set-piece execution.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-5 sm:p-7 rounded-3xl border relative space-y-3.5 sm:space-y-4 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="w-10 h-10 rounded-2xl font-luxury font-black text-base flex items-center justify-center shadow-md bg-amber-400 text-slate-950 shadow-amber-400/30">
              III
            </div>
            <h3 className={`text-base sm:text-lg font-display font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Export &amp; Share Match Gameplan
            </h3>
            <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Export ultra-sharp PNG tactical cards ready for team briefings, social channels, coaching sessions, or video breakdown analysis.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ SECTION */}
      {/* ========================================================================= */}
      <section id="faq" className={`py-12 sm:py-24 border-y px-3.5 sm:px-6 lg:px-8 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-black border-neutral-800'
      }`}>
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-2.5 sm:space-y-4">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-display font-bold tracking-[0.15em] uppercase border ${
              isLight
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-sm'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              <SvgCrownStar className="w-3.5 h-3.5 text-amber-500" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-luxury font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              Tactical Board Knowledge Base
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-4">
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
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className={`w-full px-4 sm:px-7 py-3.5 sm:py-5 text-left flex items-center justify-between gap-4 font-display font-bold text-xs sm:text-sm transition cursor-pointer active:scale-[0.99] ${
                      isLight ? 'text-slate-900 hover:text-emerald-700' : 'text-white hover:text-emerald-400'
                    }`}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? isLight ? 'rotate-180 text-emerald-600' : 'rotate-180 text-emerald-500'
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
                        transition={{ duration: 0.3 }}
                        className={`px-4 sm:px-7 pb-4 sm:pb-6 text-xs leading-relaxed font-sans border-t pt-3.5 ${
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
      {/* COMPREHENSIVE PROFESSIONAL FOOTER */}
      {/* ========================================================================= */}
      <footer className={`mt-auto border-t text-xs py-10 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isLight
          ? 'border-slate-200 bg-white text-slate-700'
          : 'border-neutral-800 bg-black text-neutral-400'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 sm:gap-10">
          
          {/* Column 1: Brand & Bio */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl p-1 flex items-center justify-center shadow-md border ${
                isLight ? 'bg-white border-slate-200' : 'bg-black border-neutral-800'
              }`}>
                <SvgBeCoachLogo className="w-full h-full" />
              </div>
              <span className={`font-luxury font-bold text-base tracking-[0.14em] uppercase ${isLight ? 'text-slate-950' : 'text-white'}`}>
                BE COACH
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-sm font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              The premier web-based football tactics board and squad manager for coaches, tactical analysts, content creators, and football enthusiasts worldwide.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] font-display text-neutral-500">
              <span className={`inline-flex items-center gap-1.5 font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-600 dark:text-emerald-400'}`}>
                <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
                Live Client Engine
              </span>
              <span>•</span>
              <span>2026 Season Edition</span>
            </div>
          </div>

          {/* Column 2: Tactical Studio Features */}
          <div className="space-y-3 font-display">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950 font-black' : 'text-white'}`}>Tactical Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onLaunchBoard()} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  11v11 Matchup Board
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard()} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  Turf &amp; Stadium Lighting
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard()} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  Tactical Arrows &amp; Heatmaps
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard()} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  Keyframe Animation Studio
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard()} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  Jersey &amp; Kit Customizer
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Formations & Setups */}
          <div className="space-y-3 font-display">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950 font-black' : 'text-white'}`}>Formations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onLaunchBoard('4-3-3')} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  4-3-3 Attack &amp; Holding
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard('4-2-3-1')} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  4-2-3-1 High Press
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard('3-5-2')} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  3-5-2 Wing-Back Overload
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard('5-3-2')} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  5-3-2 Solid Low Block
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchBoard('4-4-2')} className={`transition text-left active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
                  4-4-2 Classic Flat
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Policies & Documentation */}
          <div className="space-y-3 font-display">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-950 font-black' : 'text-white'}`}>Legal &amp; Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className={`transition text-left flex items-center gap-1.5 active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}
                >
                  <SvgDiamondBadge className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className={`transition text-left flex items-center gap-1.5 active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('cookies')}
                  className={`transition text-left flex items-center gap-1.5 active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Cookie &amp; Storage</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('guide')}
                  className={`transition text-left flex items-center gap-1.5 active:scale-95 cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}
                >
                  <SvgCrownStar className="w-3.5 h-3.5 text-amber-500" />
                  <span>User Guide &amp; FAQ</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer Row */}
        <div className={`max-w-7xl mx-auto mt-8 sm:mt-14 pt-5 sm:pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] font-display text-neutral-500 text-center sm:text-left ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <p>© 2026 Be Coach — Elite Football Tactical Board. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button onClick={() => onOpenLegal('privacy')} className={`transition cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegal('terms')} className={`transition cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
              Terms
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegal('cookies')} className={`transition cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
              Cookies
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegal('guide')} className={`transition cursor-pointer ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-500'}`}>
              Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

