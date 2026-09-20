import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Trash2,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Users,
} from 'lucide-react';
import { PlaybackStatus, PlaybackMode, RecordedStep } from '../utils/tacticAnimator';
import { SquadData, Player } from '../types';
import { useTheme } from '../context/ThemeContext';

// Custom Crisp Vector SVG Icons
const StudioClapperIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.2 6 3 11l-.9-3 17.2-5z" />
    <path d="m6.2 5.3 3.1 4.7" />
    <path d="m12.2 3.5 3.1 4.7" />
    <rect width="20" height="12" x="2" y="8" rx="2.5" />
    <circle cx="7" cy="14" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <circle cx="17" cy="14" r="1.5" fill="currentColor" fillOpacity="0.3" />
    <path d="M7 14h10" strokeDasharray="2 2" />
  </svg>
);

const SoccerBallSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9.5" />
    <polygon points="12 7.5 15.5 10 14 14 10 14 8.5 10" fill="currentColor" fillOpacity="0.25" strokeWidth="1.4" />
    <line x1="12" y1="7.5" x2="12" y2="2.5" />
    <line x1="15.5" y1="10" x2="20" y2="8.5" />
    <line x1="14" y1="14" x2="18" y2="18" />
    <line x1="10" y1="14" x2="6" y2="18" />
    <line x1="8.5" y1="10" x2="4" y2="8.5" />
  </svg>
);

const LiveRadarSvg: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
  </svg>
);

const SpeedGaugeSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    <circle cx="12" cy="14" r="2" fill="currentColor" />
  </svg>
);

const TacticalBlueprintIllustration: React.FC<{ className?: string; isLight?: boolean }> = ({ className = 'w-24 h-24', isLight = false }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className}>
    {/* Pitch Outline */}
    <rect x="10" y="15" width="100" height="90" rx="8" stroke={isLight ? '#cbd5e1' : '#334155'} strokeWidth="2" strokeDasharray="3 3" />
    <line x1="60" y1="15" x2="60" y2="105" stroke={isLight ? '#cbd5e1' : '#334155'} strokeWidth="1.5" />
    <circle cx="60" cy="60" r="18" stroke={isLight ? '#cbd5e1' : '#334155'} strokeWidth="1.5" />
    
    {/* Passing trajectory curve */}
    <path d="M 30 75 Q 55 35 90 55" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />
    <polygon points="88,50 96,56 89,61" fill="#10b981" />
    
    {/* Player Nodes */}
    <circle cx="30" cy="75" r="8" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
    <text x="30" y="79" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#10b981">8</text>
    
    <circle cx="90" cy="55" r="8" fill="#059669" fillOpacity="0.3" stroke="#059669" strokeWidth="2" />
    <text x="90" y="59" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#059669">10</text>

    {/* Ball Pulse */}
    <circle cx="60" cy="46" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
  </svg>
);

interface KeyframesRecordedStudioProps {
  status: PlaybackStatus;
  playbackMode?: PlaybackMode;
  currentStepIndex: number;
  totalSteps: number;
  overallProgress: number;
  steps: RecordedStep[];
  homeSquad: SquadData;
  awaySquad?: SquadData | null;
  onPlay: () => void;
  onPlayUnit?: () => void;
  onContinue?: () => void;
  onContinueUnit?: () => void;
  hasUnplayedSteps?: boolean;
  onResume?: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeekStep: (index: number) => void;
  onRemoveStep: (index: number) => void;
  onClearSteps: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onLoadSampleTactic?: () => void;
  isFullscreen?: boolean;
}

const KeyframesRecordedStudioComponent: React.FC<KeyframesRecordedStudioProps> = ({
  status,
  playbackMode = 'sequential',
  currentStepIndex,
  totalSteps,
  overallProgress,
  steps,
  homeSquad,
  awaySquad,
  onPlay,
  onPlayUnit,
  onContinue,
  onContinueUnit,
  hasUnplayedSteps = false,
  onResume,
  onPause,
  onStop,
  onSeekStep,
  onRemoveStep,
  onClearSteps,
  playbackSpeed,
  onChangeSpeed,
  onLoadSampleTactic,
  isFullscreen = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isPlaying = status === 'playing' || status === 'countdown';

  // Helper to find player details from element ID
  const getPlayerDetails = (elementId: string, team?: 'home' | 'away'): { name: string; number: number | string; position: string; team: 'home' | 'away'; color: string } => {
    if (elementId === 'ball') {
      return { name: 'Match Football', number: '⚽', position: 'BALL', team: 'home', color: '#f59e0b' };
    }

    const homePlayer = homeSquad.startingXI.find((p) => p.id === elementId);
    if (homePlayer) {
      return {
        name: homePlayer.shortName || homePlayer.name,
        number: homePlayer.number,
        position: homePlayer.position,
        team: 'home',
        color: homeSquad.kit.primaryColor,
      };
    }

    const awayPlayer = awaySquad?.startingXI.find((p) => p.id === elementId);
    if (awayPlayer && awaySquad) {
      return {
        name: awayPlayer.shortName || awayPlayer.name,
        number: awayPlayer.number,
        position: awayPlayer.position,
        team: 'away',
        color: awaySquad.kit.primaryColor,
      };
    }

    return {
      name: team === 'away' ? 'Away Player' : 'Home Player',
      number: '#',
      position: 'POS',
      team: team || 'home',
      color: team === 'away' ? (awaySquad?.kit.primaryColor || '#ef4444') : homeSquad.kit.primaryColor,
    };
  };

  // Estimate tactical distance on a standard 105m x 68m pitch
  const getTacticalDistanceMeters = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = (to.x - from.x) * 1.05; // 105m pitch
    const dy = (to.y - from.y) * 0.68; // 68m pitch
    const meters = Math.round(Math.hypot(dx, dy));
    return Math.max(1, meters);
  };

  const containerBg = isLight
    ? 'bg-white border-slate-200/80 text-slate-900 shadow-xl shadow-slate-200/40'
    : 'bg-black border-neutral-800 text-white shadow-2xl shadow-black';

  const subPanelBg = isLight
    ? 'bg-slate-50 border-slate-200/80'
    : 'bg-neutral-900/90 border-neutral-800';

  const miniCardBg = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-neutral-950 border-neutral-800 text-neutral-100';

  // Compact layout for fullscreen mode
  if (isFullscreen) {
    return (
      <div className={`w-full max-w-4xl backdrop-blur-xl rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col gap-2 border transition-all ${
        isLight ? 'bg-white/95 border-slate-200 shadow-slate-300/60' : 'bg-black/95 border-neutral-800 shadow-black'
      }`}>
        <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 text-xs">
          {/* Main Controls + Step & Speed Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto">
            {/* Primary Action Buttons (2-col on mobile, 4-col on tablet, inline on desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-1.5 w-full sm:w-auto">
              {status === 'paused' ? (
                <>
                  <button
                    onClick={onResume || onPlay}
                    className="w-full lg:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50 transition active:scale-95 cursor-pointer whitespace-nowrap"
                    title="Resume Tactic from current position"
                  >
                    <Play className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                    <span>Resume</span>
                  </button>
                  <button
                    onClick={onPlay}
                    className={`w-full lg:w-auto flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border transition active:scale-95 cursor-pointer whitespace-nowrap ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                    }`}
                    title="Restart from Start (3s Timer)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restart</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Continue Sequential Button */}
                  <button
                    onClick={onContinue || onPlay}
                    disabled={totalSteps === 0}
                    className={`w-full lg:w-auto flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs transition active:scale-95 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                      hasUnplayedSteps
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-400/60 animate-pulse'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-700'
                    }`}
                    title="Continue tactic step-by-step from where the move stopped"
                  >
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Continue</span>
                  </button>

                  {/* Continue as Unit Button */}
                  <button
                    onClick={onContinueUnit || onPlayUnit}
                    disabled={totalSteps === 0}
                    className={`w-full lg:w-auto flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs transition active:scale-95 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                      hasUnplayedSteps
                        ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30 ring-2 ring-sky-400/60 animate-pulse'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-sky-800 border-slate-300'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-neutral-700'
                    }`}
                    title="Continue tactic moving all players simultaneously as a unit from current position"
                  >
                    <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Continue Unit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isPlaying && playbackMode === 'sequential') {
                        onPause();
                      } else {
                        onPlay();
                      }
                    }}
                    disabled={totalSteps === 0}
                    className={`w-full lg:w-auto flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                      isPlaying && playbackMode === 'sequential'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                    }`}
                    title={totalSteps === 0 ? "Drag players or ball on the pitch to record keyframes first" : "Play entire tactic from the start (3s Countdown)"}
                  >
                    {isPlaying && playbackMode === 'sequential' ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                        <span>Play All</span>
                      </>
                    )}
                  </button>

                  {/* Move as Unit Button */}
                  <button
                    onClick={() => {
                      if (isPlaying && playbackMode === 'unit') {
                        onPause();
                      } else {
                        onPlayUnit?.();
                      }
                    }}
                    disabled={totalSteps === 0}
                    className={`w-full lg:w-auto flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                      isPlaying && playbackMode === 'unit'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                        : isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                    }`}
                    title={
                      totalSteps === 0
                        ? "Drag players or ball on the pitch to record positions first"
                        : "Play entire tactic as a synchronized unit from the start (3s Countdown)"
                    }
                  >
                    {isPlaying && playbackMode === 'unit' ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                        <span>Pause Unit</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Unit All</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Secondary step & speed controls */}
            <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 w-full sm:w-auto shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSeekStep(Math.max(0, currentStepIndex - 1))}
                  disabled={totalSteps === 0 || currentStepIndex === 0}
                  className={`p-1.5 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                  }`}
                  title="Previous Step"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSeekStep(Math.min(totalSteps - 1, currentStepIndex + 1))}
                  disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
                  className={`p-1.5 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                  }`}
                  title="Next Step"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onStop}
                  disabled={totalSteps === 0}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer whitespace-nowrap ${
                    isLight ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300' : 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-neutral-800'
                  }`}
                  title="Reset to Step 0"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Reset Start</span>
                  <span className="inline sm:hidden">Reset</span>
                </button>
              </div>

              {/* Playback Speed Controller */}
              <div className={`flex items-center p-0.5 sm:p-1 rounded-xl border gap-0.5 ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-neutral-900 border-neutral-800'
              }`} title="Control Tactic Animation Speed">
                <SpeedGaugeSvg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1 mr-0.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`} />
                {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onChangeSpeed(spd)}
                    className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold font-mono transition cursor-pointer ${
                      playbackSpeed === spd
                        ? isLight
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm font-black'
                          : 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-sm font-black'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                    title={`Set speed to ${spd}x`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={isLight ? "text-slate-600 font-bold" : "text-neutral-400"}>
              {totalSteps > 0 ? (
                <>Step <strong className={isLight ? "text-emerald-700" : "text-emerald-400"}>{currentStepIndex + 1}</strong> of <strong>{totalSteps}</strong></>
              ) : (
                '0 Steps'
              )}
            </span>

            {totalSteps > 0 && (
              <button
                onClick={onClearSteps}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  isLight ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200' : 'bg-neutral-900 hover:bg-rose-950/50 text-neutral-400 hover:text-rose-400 border-neutral-800'
                }`}
                title="Clear All Keyframes"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Timeline Bar */}
        {totalSteps > 0 && (
          <div className={`relative w-full h-2 rounded-full border overflow-hidden ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75"
              style={{ width: `${Math.max(0, Math.min(100, overallProgress * 100))}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  // Full Executive Keyframes Studio & Timeline Panel
  return (
    <div className={`w-full backdrop-blur-2xl rounded-2xl border p-4 sm:p-5 flex flex-col gap-3.5 transition-all ${
      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50' : 'bg-black border-neutral-800 text-white shadow-2xl'
    }`}>
      {/* Top Header: Studio Title, Keyframe Counter Badge & Auto-Record Status */}
      <div className={`w-full flex flex-wrap items-center justify-between gap-3 border-b pb-3.5 ${
        isLight ? 'border-slate-200' : 'border-neutral-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border flex items-center justify-center transition-transform hover:scale-105 ${
            isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-neutral-900 border-neutral-800 text-emerald-400 shadow-inner'
          }`}>
            <StudioClapperIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-extrabold text-sm sm:text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-neutral-100'}`}>
                Keyframes Recorded Studio
              </h3>
              <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                totalSteps > 0
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-neutral-900 text-emerald-400 border-neutral-700 shadow-sm'
                  : isLight
                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}>
                {totalSteps} {totalSteps === 1 ? 'Keyframe' : 'Keyframes'}
              </span>
            </div>
            <p className={`text-[11px] sm:text-xs flex items-center gap-1.5 mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              <LiveRadarSvg className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Auto-records movements when you drag &amp; release players or ball on the board</span>
            </p>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          {totalSteps === 0 && onLoadSampleTactic && (
            <button
              onClick={onLoadSampleTactic}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition active:scale-95 shadow-sm cursor-pointer border ${
                isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border-neutral-700 hover:border-emerald-500/40'
              }`}
              title="Load a sample 1-2 passing play keyframe sequence"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Load Sample Play</span>
            </button>
          )}

          {totalSteps > 0 && (
            <button
              onClick={onClearSteps}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer border ${
                isLight
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border-neutral-800 hover:border-rose-800/60'
              }`}
              title="Clear all recorded keyframes"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Playback Control Bar */}
      <div className={`w-full flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-2xl border shadow-sm ${subPanelBg}`}>
        {/* Playback Triggers & Step Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
          {/* Primary Action Buttons (2-col grid on mobile, 4-col on tablets, inline flex on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex xl:items-center gap-2 w-full sm:w-auto">
            {status === 'paused' ? (
              <>
                {/* Dedicated Resume Button */}
                <button
                  onClick={onResume || onPlay}
                  className="w-full xl:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/60 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  title="Resume playback from current paused position"
                >
                  <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                  <span>Resume</span>
                </button>

                {/* Restart from beginning with 3s timer */}
                <button
                  onClick={onPlay}
                  className={`w-full xl:w-auto flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                  }`}
                  title="Restart Tactic from Beginning (3s Countdown)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>From Start</span>
                </button>
              </>
            ) : (
              <>
                {/* Continue Sequential Button */}
                <button
                  onClick={onContinue || onPlay}
                  disabled={totalSteps === 0}
                  className={`w-full xl:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 md:px-4 py-2.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                    hasUnplayedSteps
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-400/60 animate-pulse'
                      : isLight
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/40'
                  }`}
                  title="Continue tactic step-by-step from where the move stopped"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Continue</span>
                </button>

                {/* Continue as Unit Button */}
                <button
                  onClick={onContinueUnit || onPlayUnit}
                  disabled={totalSteps === 0}
                  className={`w-full xl:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 md:px-4 py-2.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                    hasUnplayedSteps
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30 ring-2 ring-sky-400/60 animate-pulse'
                      : isLight
                      ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-sky-500/40'
                  }`}
                  title="Continue tactic moving all players simultaneously as a unit from current position"
                >
                  <Users className="w-4 h-4 stroke-[2.5]" />
                  <span>Continue Unit</span>
                </button>

                {/* Play Tactic Button (Full Sequence from Beginning) */}
                <button
                  onClick={() => {
                    if (isPlaying && playbackMode === 'sequential') {
                      onPause();
                    } else {
                      onPlay();
                    }
                  }}
                  disabled={totalSteps === 0}
                  className={`w-full xl:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 md:px-4 py-2.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                    isPlaying && playbackMode === 'sequential'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/60'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                  }`}
                  title={totalSteps === 0 ? "Drag players or ball on the pitch to record keyframes first" : "Play entire tactic from the start (3s Countdown)"}
                >
                  {isPlaying && playbackMode === 'sequential' ? (
                    <>
                      <Pause className="w-4 h-4 fill-current stroke-[2.5]" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                      <span>Play All</span>
                    </>
                  )}
                </button>

                {/* Move as Unit Button (Full Unit Replay from Beginning) */}
                <button
                  onClick={() => {
                    if (isPlaying && playbackMode === 'unit') {
                      onPause();
                    } else {
                      onPlayUnit?.();
                    }
                  }}
                  disabled={totalSteps === 0}
                  className={`w-full xl:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 md:px-4 py-2.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                    isPlaying && playbackMode === 'unit'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/60'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                  }`}
                  title={
                    totalSteps === 0
                      ? "Drag players or ball on the pitch to record positions first"
                      : "Play entire tactic as a synchronized unit from the start (3s Countdown)"
                  }
                >
                  {isPlaying && playbackMode === 'unit' ? (
                    <>
                      <Pause className="w-4 h-4 fill-current stroke-[2.5]" />
                      <span>Pause Unit</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 stroke-[2.5]" />
                      <span>Unit All</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Secondary Controls: Step navigation and reset board */}
          <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Step Backwards */}
              <button
                onClick={() => onSeekStep(Math.max(0, currentStepIndex - 1))}
                disabled={totalSteps === 0 || currentStepIndex === 0}
                className={`p-1.5 sm:p-2 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer shrink-0 ${
                  isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                }`}
                title="Step Backwards"
              >
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Step Forwards */}
              <button
                onClick={() => onSeekStep(Math.min(totalSteps - 1, currentStepIndex + 1))}
                disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
                className={`p-1.5 sm:p-2 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer shrink-0 ${
                  isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                }`}
                title="Step Forwards"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Reset Board to Initial Positions */}
              <button
                onClick={onStop}
                disabled={totalSteps === 0}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer border whitespace-nowrap shrink-0 ${
                  isLight
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-neutral-800 hover:border-amber-500/40'
                }`}
                title="Reset Board to Initial Step 0 Positions"
              >
                <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                <span className="hidden sm:inline">Reset Start</span>
                <span className="inline sm:hidden">Reset</span>
              </button>
            </div>

            {/* Speed Selector on Mobile & Tablet */}
            <div className={`flex xl:hidden items-center p-0.5 rounded-xl border gap-0.5 shrink-0 ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <SpeedGaugeSvg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1 mr-0.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`} />
              {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onChangeSpeed(spd)}
                  className={`px-1 sm:px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold font-mono transition cursor-pointer ${
                    playbackSpeed === spd
                      ? isLight
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm font-black'
                        : 'bg-neutral-900 text-emerald-400 border border-neutral-700 shadow-sm font-black'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Large Desktop Speed Selector */}
        <div className="hidden xl:flex items-center gap-2.5 shrink-0">
          <div className={`flex items-center p-1 rounded-xl border gap-0.5 ${
            isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <SpeedGaugeSvg className={`w-4 h-4 ml-1.5 mr-0.5 shrink-0 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`} />
            {[0.5, 1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                  playbackSpeed === spd
                    ? isLight
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm font-black'
                      : 'bg-neutral-900 text-emerald-400 border border-neutral-700 shadow-sm font-black'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Keyframe Timeline Scrubber */}
      <div className={`w-full flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-2xl border ${
        isLight ? 'bg-slate-50 border-slate-200/90' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
            <span className={`font-bold text-xs ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
              Animation Timeline Scrubber
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>
              {totalSteps > 0 ? (
                <>Step <strong className={isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold'}>{currentStepIndex + 1}</strong> of <strong className={isLight ? 'text-slate-800' : 'text-neutral-200'}>{totalSteps}</strong></>
              ) : (
                'Waiting for moves'
              )}
            </span>
            <span className={`font-extrabold px-2.5 py-0.5 rounded-lg border ${
              isLight ? 'text-emerald-800 bg-emerald-100 border-emerald-300' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            }`}>
              {Math.round(overallProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Scrubber Track */}
        <div className={`relative w-full h-4 flex items-center rounded-full border px-1 overflow-hidden my-1 ${
          isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-neutral-900 border-neutral-800'
        }`}>
          {/* Progress Fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 transition-all duration-75"
            style={{ width: `${Math.max(0, Math.min(100, overallProgress * 100))}%` }}
          />

          {/* Interactive Step Markers */}
          {totalSteps > 0 && (
            <div className="relative z-10 w-full flex items-center justify-between px-1">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;

                return (
                  <button
                    key={`marker-${step.order}-${idx}`}
                    onClick={() => onSeekStep(idx)}
                    className={`group/marker relative flex items-center justify-center p-1 -my-2 cursor-pointer transition-all ${
                      isActive ? 'scale-125' : 'hover:scale-110'
                    }`}
                    title={`Step #${idx + 1}: ${step.elementId === 'ball' ? 'Ball Pass/Move' : `Player Movement (${step.team})`}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all ${
                        isActive
                          ? 'bg-amber-400 border-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.9)] ring-2 ring-amber-400/80 scale-110'
                          : isPast
                          ? 'bg-emerald-400 border-slate-900 shadow-sm shadow-emerald-500/40'
                          : isLight
                          ? 'bg-slate-400 border-slate-200'
                          : 'bg-neutral-700 border-neutral-900'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recorded Keyframe Steps Cards List / Carousel */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
            <h4 className={`text-xs sm:text-sm font-extrabold tracking-tight ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
              Sequential Movement Log ({totalSteps})
            </h4>
          </div>
          {totalSteps > 0 && (
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              Click any step card to jump &amp; preview on the board
            </span>
          )}
        </div>

        {totalSteps === 0 ? (
          /* Empty State with Tactical Blueprint Vector Illustration */
          <div className={`w-full rounded-2xl border border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3 transition-all ${
            isLight ? 'bg-slate-50/70 border-slate-300' : 'bg-neutral-950/80 border-neutral-800'
          }`}>
            <div className={`p-3 rounded-2xl flex items-center justify-center border ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <TacticalBlueprintIllustration className="w-20 h-20" isLight={isLight} />
            </div>
            <div className="max-w-md">
              <h5 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-neutral-100'}`}>
                No Keyframe Actions Recorded Yet
              </h5>
              <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Click any player token to pass the ball directly to them, or drag players and the football across the pitch. Every pass and movement is automatically logged in sequence.
              </p>
            </div>

            {onLoadSampleTactic && (
              <button
                onClick={onLoadSampleTactic}
                className={`mt-1 flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs transition active:scale-95 cursor-pointer shadow-sm border ${
                  isLight
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/40'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Sample 1-2 Play (3 Keyframes)</span>
              </button>
            )}
          </div>
        ) : (
          /* Step Cards Horizontal Scroll Track / Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
            {steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const details = getPlayerDetails(step.elementId, step.team);
              const distanceMeters = getTacticalDistanceMeters(step.from, step.to);
              const isBall = step.elementId === 'ball' || step.type === 'ball';

              return (
                <div
                  key={`step-card-${step.order}-${idx}`}
                  onClick={() => onSeekStep(idx)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 select-none shadow-sm ${
                    isActive
                      ? isLight
                        ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/80 shadow-md scale-[1.02]'
                        : 'bg-gradient-to-br from-amber-500/20 via-neutral-900 to-neutral-950 border-amber-400 ring-2 ring-amber-400/60 shadow-amber-950/40 scale-[1.02]'
                      : isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900'
                      : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-850 hover:border-neutral-700 text-white'
                  }`}
                >
                  {/* Step Header: Step Order Badge & Delete Button */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-lg border ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold'
                          : isLight
                          ? 'bg-slate-100 text-emerald-800 border-slate-300'
                          : 'bg-neutral-950 text-emerald-400 border-neutral-700'
                      }`}>
                        STEP #{idx + 1}
                      </span>
                      {isActive && (
                        <span className={`text-[9px] font-extrabold uppercase tracking-wide animate-pulse ${
                          isLight ? 'text-amber-800' : 'text-amber-300'
                        }`}>
                          Active
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStep(idx);
                      }}
                      className={`p-1 rounded-lg transition opacity-80 group-hover:opacity-100 cursor-pointer ${
                        isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30'
                      }`}
                      title="Delete this step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actor Details: Player or Ball with crisp SVG */}
                  <div className="flex items-center gap-2 my-0.5">
                    {isBall ? (
                      <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${
                        isLight
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-inner'
                      }`}>
                        <SoccerBallSvg className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className="w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-black shrink-0 text-white shadow-inner"
                          style={{
                            backgroundColor: details.color || '#10b981',
                            borderColor: details.team === 'away' ? '#f43f5e' : '#10b981',
                          }}
                        >
                          {details.number}
                        </div>
                        {step.carriedBall && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-950 rounded-full border border-amber-400 flex items-center justify-center text-amber-400 shadow-sm">
                            <SoccerBallSvg className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <span className={`font-extrabold text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`} title={step.label || details.name}>
                        {step.label || details.name}
                      </span>
                      <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        {isBall ? (
                          <span className={isLight ? "text-amber-700 font-semibold flex items-center gap-1" : "text-amber-400 font-semibold flex items-center gap-1"}>
                            <SoccerBallSvg className="w-3 h-3" />
                            <span>Ball Pass / Movement</span>
                          </span>
                        ) : step.carriedBall ? (
                          <span className={isLight ? "text-amber-800 font-semibold flex items-center gap-1" : "text-amber-300 font-semibold flex items-center gap-1"}>
                            <SoccerBallSvg className="w-3 h-3" />
                            <span>Dribbling with Ball</span>
                          </span>
                        ) : (
                          <>{details.position} &bull; <span className={details.team === 'away' ? 'text-rose-500' : isLight ? 'text-emerald-700' : 'text-emerald-400'}>{details.team === 'away' ? 'Away' : 'Home'}</span></>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Movement Coordinates & Calculated Distance */}
                  <div className={`rounded-xl p-2 border flex flex-col gap-1 text-[10px] font-mono ${miniCardBg}`}>
                    <div className={`flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                      <span>({Math.round(step.from.x)}%, {Math.round(step.from.y)}%)</span>
                      <ArrowRight className={`w-3 h-3 shrink-0 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                      <span className={`font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>({Math.round(step.to.x)}%, {Math.round(step.to.y)}%)</span>
                    </div>
                    <div className={`flex items-center justify-between border-t pt-1 font-sans ${isLight ? 'border-slate-200 text-slate-500' : 'border-neutral-800 text-neutral-400'}`}>
                      <span className={`text-[10px] font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400/90'}`}>
                        ~{distanceMeters}m {isBall ? 'pass' : step.carriedBall ? 'dribble' : 'run'}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        isBall
                          ? isLight
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : step.carriedBall
                          ? isLight
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isLight
                          ? 'text-slate-500'
                          : 'text-neutral-500'
                      }`}>
                        {isBall ? 'BALL PASS' : step.carriedBall ? 'DRIBBLE WITH BALL' : 'TACTICAL MOVE'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const KeyframesRecordedStudio = React.memo(KeyframesRecordedStudioComponent);

