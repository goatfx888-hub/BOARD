import React, { useState, useRef, useEffect } from 'react';
import { PitchTexture, PitchPerspective, LightingMode, SquadData } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  SvgBeCoachLogo,
  SvgExportTactical,
  SvgDarkModePro,
  SvgLightModePro,
} from './LandingSvgIcons';
import {
  Layers,
  Pencil,
  Shirt,
  MoveHorizontal,
  MoveVertical,
  Box,
  Tv,
  RotateCcw,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Menu,
  X,
  Hash,
  Sun,
  Moon,
  Sparkles,
  SlidersHorizontal,
  Globe,
  Scan,
} from 'lucide-react';

export interface HeaderProps {
  squad?: SquadData;
  homeSquad?: SquadData;
  awaySquad?: SquadData;
  matchMode?: 'home_vs_away' | 'home_only' | 'away_only';
  onChangeMatchMode?: (mode: 'home_vs_away' | 'home_only' | 'away_only') => void;
  showNames: boolean;
  onToggleShowNames: () => void;
  onOpenPlayerNamer?: () => void;
  tokenDisplayMode?: 'number' | 'position';
  texture: PitchTexture;
  onChangeTexture: (texture: PitchTexture) => void;
  perspective: PitchPerspective;
  onChangePerspective: (perspective: PitchPerspective) => void;
  lighting: LightingMode;
  onChangeLighting: (lighting: LightingMode) => void;
  orientation: 'horizontal' | 'vertical';
  onChangeOrientation: (orientation: 'horizontal' | 'vertical') => void;
  isDrawingMode: boolean;
  onToggleDrawingMode: () => void;
  drawingType: 'pass' | 'run' | 'dribble' | 'press';
  onChangeDrawingType: (type: 'pass' | 'run' | 'dribble' | 'press') => void;
  onClearArrows: () => void;
  onExportImage: () => void;
  onOpenKitModal: () => void;
  onResetBoard?: () => void;
  onNavigateHome?: () => void;
}

interface TextureOption {
  id: PitchTexture;
  name: string;
  category: 'Modern' | 'Classic' | 'Special';
  previewBg: string;
  accent: string;
}

const PITCH_TEXTURE_OPTIONS: TextureOption[] = [
  { id: 'striped', name: 'Premier Lawn Stripes', category: 'Modern', previewBg: 'bg-emerald-600 ring-1 ring-emerald-400', accent: '#10b981' },
  { id: 'checkerboard', name: 'Checkerboard Lawn', category: 'Modern', previewBg: 'bg-emerald-700 ring-1 ring-emerald-500', accent: '#059669' },
  { id: 'circular', name: 'Concentric Rings', category: 'Modern', previewBg: 'bg-emerald-600 ring-1 ring-teal-400', accent: '#10b981' },
  { id: 'diamond_cut', name: 'Diamond Cut Lawn', category: 'Modern', previewBg: 'bg-emerald-700 ring-1 ring-emerald-400', accent: '#34d399' },
  { id: 'deep_emerald', name: 'Deep Emerald Turf', category: 'Modern', previewBg: 'bg-emerald-800 ring-1 ring-emerald-500', accent: '#059669' },
  { id: 'hybrid_stadium', name: 'Hybrid Desso Turf', category: 'Modern', previewBg: 'bg-green-600 ring-1 ring-green-400', accent: '#22c55e' },
  { id: 'frost_pitch', name: 'Winter Match Frost', category: 'Special', previewBg: 'bg-teal-800 ring-1 ring-cyan-400', accent: '#38bdf8' },
  { id: 'vintage_classic', name: 'Vintage Classic 1970s', category: 'Classic', previewBg: 'bg-lime-800 ring-1 ring-lime-400', accent: '#84cc16' },
  { id: 'retro_grass', name: 'Retro Grass', category: 'Classic', previewBg: 'bg-green-700 ring-1 ring-green-400', accent: '#4ade80' },
  { id: 'indoor_turf', name: '4G Synthetic Turf', category: 'Modern', previewBg: 'bg-teal-700 ring-1 ring-teal-400', accent: '#2dd4bf' },
  { id: 'tactical_dark', name: 'Tactical Slate Dark', category: 'Special', previewBg: 'bg-slate-900 ring-1 ring-cyan-500', accent: '#94a3b8' },
];

export const Header: React.FC<HeaderProps> = ({
  homeSquad,
  awaySquad,
  matchMode = 'home_vs_away',
  onChangeMatchMode,
  showNames,
  onToggleShowNames,
  onOpenPlayerNamer,
  tokenDisplayMode = 'number',
  texture,
  onChangeTexture,
  perspective,
  onChangePerspective,
  lighting,
  onChangeLighting,
  orientation,
  onChangeOrientation,
  isDrawingMode,
  onToggleDrawingMode,
  drawingType,
  onChangeDrawingType,
  onClearArrows,
  onExportImage,
  onOpenKitModal,
  onResetBoard,
  onNavigateHome,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTextureDropdownOpen, setIsTextureDropdownOpen] = useState(false);
  const textureDropdownRef = useRef<HTMLDivElement>(null);

  // Studio Options Popover state
  const [isStudioOptionsOpen, setIsStudioOptionsOpen] = useState(false);
  const [isStudioTurfSelectOpen, setIsStudioTurfSelectOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const studioOptionsRef = useRef<HTMLDivElement>(null);

  // Scroll listener for dynamic elevation, compact scaling, and progress bar
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;

          setIsScrolled(scrollY > 20);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textureDropdownRef.current &&
        !textureDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTextureDropdownOpen(false);
      }
      if (
        studioOptionsRef.current &&
        !studioOptionsRef.current.contains(event.target as Node)
      ) {
        setIsStudioOptionsOpen(false);
        setIsStudioTurfSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStudioOptionsOpen(false);
        setIsStudioTurfSelectOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentTextureObj =
    PITCH_TEXTURE_OPTIONS.find((t) => t.id === texture) || PITCH_TEXTURE_OPTIONS[0];

  return (
    <header
      id="app-tactical-header"
      className={`w-full sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? isLight
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
            : 'bg-black/95 backdrop-blur-xl border-b border-neutral-800/90 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.7)]'
          : isLight
          ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200 py-2 sm:py-2.5 shadow-sm'
          : 'bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-neutral-800/80 py-2 sm:py-2.5 shadow-sm'
      }`}
    >
      {/* Scroll Progress Accent Bar at top-bottom seam */}
      {isScrolled && (
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150 z-50 opacity-90 pointer-events-none"
          style={{ width: `${Math.max(4, scrollProgress)}%` }}
        />
      )}

      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* ========================================================================= */}
        {/* DESKTOP INTEGRATED COMMAND BAR (CLEAN, MODULAR, NEVER BORING) */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center justify-between gap-3 xl:gap-4 w-full">
          
          {/* POD 1: BRAND IDENTITY & HOME LINK */}
          <div className="flex items-center gap-2.5 xl:gap-3 shrink-0">
            <div
              onClick={onNavigateHome}
              className={`flex items-center gap-2.5 ${onNavigateHome ? 'cursor-pointer group select-none' : ''}`}
              title={onNavigateHome ? 'Return to Tactical Studio Landing' : undefined}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center overflow-hidden p-0.5">
                  <SvgBeCoachLogo className="w-full h-full drop-shadow group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h1
                  className={`font-black text-sm tracking-normal flex items-center leading-none transition-colors ${
                    isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-300'
                  }`}
                >
                  BE COACH
                </h1>
                {onNavigateHome && (
                  <span
                    className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-lg font-semibold transition ${
                      isLight
                        ? 'text-slate-600 bg-slate-100 border border-slate-200 group-hover:border-emerald-500 group-hover:text-emerald-600'
                        : 'text-neutral-400 bg-neutral-900 border border-neutral-800 group-hover:border-emerald-500/40 group-hover:text-emerald-400'
                    }`}
                  >
                    ← Home
                  </span>
                )}
              </div>
            </div>

            {/* Match Mode Pills (Home, Away, Both) */}
            {onChangeMatchMode && (
              <div
                className={`flex items-center p-0.5 rounded-xl border shadow-inner transition-colors ${
                  isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-neutral-900/90 border-neutral-800/90'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onChangeMatchMode('home_vs_away')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    matchMode === 'home_vs_away'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Both Teams (VS Mode)"
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xl:inline">Both (VS)</span>
                  <span className="xl:hidden">VS</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMatchMode('home_only')}
                  className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    matchMode === 'home_only'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Home Team Only"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMatchMode('away_only')}
                  className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    matchMode === 'away_only'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Away Team Only"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 border border-slate-900" />
                  <span>Away</span>
                </button>
              </div>
            )}
          </div>

          {/* POD 4: TACTICAL TOOLS & OPTIONS */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* Tactical Drawing Tools Toggle */}
            <button
              type="button"
              onClick={onToggleDrawingMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition active:scale-95 shadow-sm cursor-pointer ${
                isDrawingMode
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm font-black ring-1 ring-emerald-400/40'
                    : 'bg-neutral-800 text-emerald-400 border-neutral-700 shadow-sm font-black ring-1 ring-emerald-500/40'
                  : isLight
                  ? 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400 border-neutral-800 hover:border-emerald-500/40'
              }`}
              title="Toggle Tactical Annotation & Drawing Tools"
            >
              <Pencil className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Tools</span>
              {isDrawingMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
              )}
            </button>

            {/* Options Pill Button with Studio Tools Dropdown */}
            <div className="relative shrink-0" ref={studioOptionsRef}>
              <button
                type="button"
                onClick={() => setIsStudioOptionsOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition active:scale-95 shadow-md shrink-0 cursor-pointer bg-[#00df82] hover:bg-[#00c975] text-slate-950 shadow-emerald-500/20"
                title="Options & Studio Tools"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Options</span>
                {isStudioOptionsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
              </button>

              {/* Dropdown Card: "OPTIONS & STUDIO TOOLS" */}
              {isStudioOptionsOpen && (
                <div
                  className="absolute right-0 top-full mt-2.5 w-[340px] sm:w-[380px] max-w-[92vw] rounded-2xl bg-[#121517] border border-neutral-800/90 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-3.5 sm:p-4 z-[150] backdrop-blur-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150 text-white select-none text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="font-black text-xs sm:text-sm tracking-wider uppercase text-white">
                        OPTIONS &amp; STUDIO TOOLS
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsStudioOptionsOpen(false)}
                      className="w-7 h-7 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                      title="Close Options"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hero Green Banner: Export Photo (HD) */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsStudioOptionsOpen(false);
                      onExportImage();
                    }}
                    className="w-full p-3 rounded-2xl bg-[#00df82] hover:bg-[#00c975] text-slate-950 flex items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-slate-950 shrink-0">
                        <Scan className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="text-sm font-black leading-tight text-slate-950">
                          Export Photo (HD)
                        </div>
                        <div className="text-[11px] text-slate-800 font-semibold leading-tight mt-0.5">
                          High-resolution snapshot for presentations &amp; coaching
                        </div>
                      </div>
                    </div>
                    <div className="bg-black/25 px-2 py-1.5 rounded-lg text-slate-950 font-black text-[10px] leading-tight text-center shrink-0 ml-2">
                      <div>4K</div>
                      <div>HD</div>
                    </div>
                  </button>

                  {/* VIEW & PERSPECTIVE */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>VIEW &amp; PERSPECTIVE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 bg-neutral-800/80 border border-neutral-700/60 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => onChangePerspective('2d_flat')}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          perspective === '2d_flat'
                            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm font-black'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>2D Plan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangePerspective('3d_perspective')}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          perspective === '3d_perspective'
                            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm font-black'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>3D Pitch</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangePerspective('broadcast_tv')}
                        className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          perspective === 'broadcast_tv'
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm font-black'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Tv className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>TV Angle</span>
                      </button>
                    </div>
                  </div>

                  {/* SQUAD & PLAYERS */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                      <Hash className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SQUAD &amp; PLAYERS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={onToggleShowNames}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                          showNames
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                            : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border-neutral-700/60'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Names: {showNames ? 'ON' : 'OFF'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsStudioOptionsOpen(false);
                          onOpenPlayerNamer?.();
                        }}
                        className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Hash className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit Names</span>
                      </button>
                    </div>
                  </div>

                  {/* PITCH & STADIUM TURF */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PITCH &amp; STADIUM TURF</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 truncate max-w-[170px]">
                        {currentTextureObj.name}
                      </span>
                    </div>

                    {/* Dropdown Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsStudioTurfSelectOpen((prev) => !prev)}
                        className="w-full py-2.5 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs font-bold flex items-center justify-between text-neutral-200 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Layers className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className={`w-3.5 h-3.5 rounded-full border border-slate-400/50 shrink-0 ${currentTextureObj.previewBg}`} />
                          <span className="truncate">{currentTextureObj.name}</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0 ml-1 ${isStudioTurfSelectOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                      </button>

                      {/* Turf Options Menu */}
                      {isStudioTurfSelectOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto custom-scrollbar rounded-xl bg-neutral-900 border border-neutral-700/80 shadow-2xl p-1.5 z-20 flex flex-col gap-1">
                          {PITCH_TEXTURE_OPTIONS.map((opt) => {
                            const isSelected = opt.id === texture;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  onChangeTexture(opt.id);
                                  setIsStudioTurfSelectOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <span className={`w-3 h-3 rounded-full border border-slate-400/50 shrink-0 ${opt.previewBg}`} />
                                  <span className="truncate">{opt.name}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PITCH & ENVIRONMENT */}
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-black tracking-wider text-neutral-400 uppercase">
                      PITCH &amp; ENVIRONMENT
                    </div>

                    {/* Row 1: Day/Night + Orientation */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-xl p-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onChangeLighting('day')}
                          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            lighting === 'day'
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm font-black'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Day</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onChangeLighting('floodlight_night')}
                          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            lighting === 'floodlight_night'
                              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm font-black'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>Night</span>
                        </button>
                      </div>

                      {/* Orientation Toggle */}
                      {onChangeOrientation && (
                        <button
                          type="button"
                          onClick={() => onChangeOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')}
                          className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          {orientation === 'horizontal' ? (
                            <MoveHorizontal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <MoveVertical className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          <span className="truncate">{orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</span>
                        </button>
                      )}
                    </div>

                    {/* Row 2: Kit Studio + Reset */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsStudioOptionsOpen(false);
                          onOpenKitModal();
                        }}
                        className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Shirt className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Kit Studio</span>
                      </button>

                      {onResetBoard && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsStudioOptionsOpen(false);
                            onResetBoard();
                          }}
                          className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {/* Row 3: Language (العربية) + Light/Dark Mode */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsArabic((prev) => !prev)}
                        className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                        title="Toggle Arabic / English language"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{isArabic ? 'English' : 'العربية'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                      >
                        {isLight ? (
                          <>
                            <Moon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>Dark Mode</span>
                          </>
                        ) : (
                          <>
                            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Light Mode</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-1.5 rounded-xl border transition active:scale-95 shadow-sm cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-600 border-slate-200 hover:border-amber-300'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-yellow-300 border-neutral-800 hover:border-neutral-700'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <SvgDarkModePro className="w-4 h-4 drop-shadow-sm shrink-0" />
              ) : (
                <SvgLightModePro className="w-4 h-4 drop-shadow-sm shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET COMPACT TOP BAR (< LG BREAKPOINT) */}
        {/* ========================================================================= */}
        <div className="flex lg:hidden items-center justify-between gap-2 py-0.5">
          {/* Logo & Quick Brand Title */}
          <div
            onClick={onNavigateHome}
            className={`flex items-center gap-2 ${onNavigateHome ? 'cursor-pointer select-none active:opacity-80' : ''}`}
            title={onNavigateHome ? 'Return to Home Page' : undefined}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 flex items-center justify-center text-slate-950 shrink-0 shadow-sm">
              <div className="w-full h-full rounded-[6px] bg-black flex items-center justify-center overflow-hidden p-0.5">
                <SvgBeCoachLogo className="w-full h-full drop-shadow" />
              </div>
            </div>
            <h1 className={`font-black text-sm tracking-normal flex items-center leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
              BE COACH
            </h1>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Tactical Drawing Tools */}
            <button
              type="button"
              onClick={onToggleDrawingMode}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition cursor-pointer ${
                isDrawingMode
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-neutral-800 text-emerald-400 border-neutral-700 ring-1 ring-emerald-500'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
              }`}
              title="Tactical Annotation Tools"
            >
              <Pencil className="w-4 h-4 text-emerald-500 shrink-0" />
            </button>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition cursor-pointer ${
                isLight
                  ? 'bg-slate-100 text-indigo-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-neutral-900 text-yellow-300 border-neutral-800 hover:bg-neutral-800'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? (
                <SvgDarkModePro className="w-4 h-4 drop-shadow-sm" />
              ) : (
                <SvgLightModePro className="w-4 h-4 drop-shadow-sm" />
              )}
            </button>

            {onResetBoard && (
              <button
                type="button"
                onClick={onResetBoard}
                className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition cursor-pointer ${
                  isLight
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                title="Reset Board Positions"
              >
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenKitModal}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition cursor-pointer ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-neutral-900/90 text-neutral-200 border-neutral-800'
              }`}
              title="Kit Customizer"
            >
              <Shirt className="w-4 h-4 text-emerald-500 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onExportImage}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/25 border border-emerald-300/40 active:scale-95 transition cursor-pointer"
              title="Export High-Res Tactical Map"
            >
              <SvgExportTactical className="w-3.5 h-3.5 stroke-slate-950 shrink-0" />
              <span>Export</span>
            </button>

            {/* Mobile Settings Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center justify-center shadow-sm active:scale-95 transition cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800'
              }`}
              title="Toggle Mobile Pitch Settings"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET EXPANDED DRAWER MENU (< LG BREAKPOINT) */}
        {/* ========================================================================= */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden pt-2 pb-3 border-t mt-1.5 flex flex-col gap-3 max-h-[80vh] overflow-y-auto custom-scrollbar px-1 animate-in slide-in-from-top-2 duration-200 ${
              isLight ? 'border-slate-200' : 'border-neutral-800/80'
            }`}
          >
            {/* Match Setup Mode */}
            {onChangeMatchMode && (
              <div
                className={`p-3 rounded-2xl border flex flex-col gap-2 shadow-inner ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/90 border-neutral-800/90'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Match Setup Mode
                </span>
                <div
                  className={`flex items-center gap-1 p-1 rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onChangeMatchMode('home_vs_away')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      matchMode === 'home_vs_away'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Both (VS)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeMatchMode('home_only')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      matchMode === 'home_only'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeMatchMode('away_only')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      matchMode === 'away_only'
                        ? 'bg-rose-500 text-white shadow-md'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 border border-slate-900" />
                    <span>Away</span>
                  </button>
                </div>
              </div>
            )}

            {/* Camera & Perspective */}
            <div
              className={`p-3 rounded-2xl border flex flex-col gap-2 shadow-inner ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/90 border-neutral-800/90'
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Camera &amp; Pitch View
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                {/* Perspective 2D / 3D / TV */}
                <div
                  className={`col-span-2 flex items-center p-1 rounded-xl border gap-1 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onChangePerspective('2d_flat')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      perspective === '2d_flat'
                        ? isLight
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>2D Flat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangePerspective('3d_perspective')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      perspective === '3d_perspective'
                        ? isLight
                          ? 'bg-cyan-50 text-cyan-700 border border-cyan-300'
                          : 'bg-neutral-800 text-cyan-400 border border-neutral-700'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Angle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangePerspective('broadcast_tv')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      perspective === 'broadcast_tv'
                        ? isLight
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-neutral-800 text-amber-400 border border-neutral-700'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>TV View</span>
                  </button>
                </div>

                {/* Orientation Switcher */}
                <div
                  className={`flex items-center p-1 rounded-xl border gap-1 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onChangeOrientation('horizontal')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      orientation === 'horizontal'
                        ? isLight
                          ? 'bg-slate-200 text-slate-900 border border-slate-300'
                          : 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <MoveHorizontal className="w-3.5 h-3.5" />
                    <span>H</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeOrientation('vertical')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      orientation === 'vertical'
                        ? isLight
                          ? 'bg-slate-200 text-slate-900 border border-slate-300'
                          : 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <MoveVertical className="w-3.5 h-3.5" />
                    <span>V</span>
                  </button>
                </div>

                {/* Day / Night Lighting */}
                <div
                  className={`flex items-center p-1 rounded-xl border gap-1 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onChangeLighting('day')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      lighting === 'day'
                        ? isLight
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Day</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeLighting('floodlight_night')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      lighting === 'floodlight_night'
                        ? isLight
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-blue-600/25 text-blue-300 border border-blue-500/40'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Night</span>
                  </button>
                </div>
              </div>

              {/* Pitch Grass Texture Dropdown for Mobile */}
              <div
                className={`flex items-center px-3 py-2 rounded-xl border gap-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
                <select
                  value={texture}
                  onChange={(e) => onChangeTexture(e.target.value as PitchTexture)}
                  className={`bg-transparent font-bold focus:outline-none cursor-pointer text-xs w-full ${
                    isLight ? 'text-slate-800' : 'text-neutral-200'
                  }`}
                >
                  {PITCH_TEXTURE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className={isLight ? 'bg-white text-slate-800' : 'bg-neutral-900 text-white'}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Labels row */}
              <div>
                <button
                  type="button"
                  onClick={onOpenPlayerNamer || onToggleShowNames}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    showNames
                      ? isLight
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-neutral-900 text-emerald-400 border-emerald-500/40'
                      : isLight
                      ? 'bg-white text-slate-700 border-slate-200'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                  }`}
                  title="Customize player names and shirt numbers"
                >
                  <Hash className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Customize Names &amp; Numbers</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </header>
  );
};
