import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Trash2,
  Gauge,
  Film,
  Sparkles,
  Users,
  FastForward,
} from 'lucide-react';
import { PlaybackStatus, PlaybackMode, RecordedStep } from '../utils/tacticAnimator';
import { useTheme } from '../context/ThemeContext';

interface TacticPlaybackControlsProps {
  status: PlaybackStatus;
  playbackMode?: PlaybackMode;
  currentStepIndex: number;
  totalSteps: number;
  overallProgress: number;
  steps: RecordedStep[];
  onPlay: () => void;
  onPlayUnit?: () => void;
  onContinue?: () => void;
  onContinueUnit?: () => void;
  onResume?: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeekStep: (index: number) => void;
  onClearSteps: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isFullscreen?: boolean;
}

export const TacticPlaybackControls: React.FC<TacticPlaybackControlsProps> = ({
  status,
  playbackMode = 'sequential',
  currentStepIndex,
  totalSteps,
  overallProgress,
  steps,
  onPlay,
  onPlayUnit,
  onContinue,
  onContinueUnit,
  onResume,
  onPause,
  onStop,
  onSeekStep,
  onClearSteps,
  playbackSpeed,
  onChangeSpeed,
  isFullscreen = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isPlaying = status === 'playing' || status === 'countdown';

  const containerBg = isLight
    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
    : 'bg-slate-900/95 border-slate-800 text-white shadow-xl';

  const subPillBg = isLight
    ? 'bg-slate-100 border-slate-300 text-slate-800'
    : 'bg-slate-950 border-slate-800 text-slate-300';

  const btnBg = isLight
    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800';

  return (
    <div
      className={`w-full backdrop-blur-xl rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${containerBg} ${
        isFullscreen ? 'px-3 py-2 max-w-4xl' : 'px-3 sm:px-4 py-2.5 max-w-full'
      }`}
    >
      {/* Top Row: Playback Action Bar */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 text-xs">
        
        {/* Left: Main Play / Continue / Pause Controls & Step Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {status === 'paused' ? (
              <>
                {/* Dedicated Continue / Resume Button */}
                <button
                  onClick={onContinue || onResume || onPlay}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  title="Continue Playback from where it stopped"
                >
                  <Play className="w-4 h-4 fill-current stroke-[2.5]" />
                  <span>Continue</span>
                </button>

                {/* Restart Button */}
                <button
                  onClick={onPlay}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 rounded-xl border transition cursor-pointer whitespace-nowrap ${btnBg}`}
                  title="Play from Beginning with 3s Countdown"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>From Start</span>
                </button>
              </>
            ) : isPlaying ? (
              /* Pause Button while playing */
              <button
                onClick={onPause}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400/50 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                title="Pause Playback"
              >
                <Pause className="w-4 h-4 fill-current stroke-[2.5]" />
                <span>Pause</span>
              </button>
            ) : (
              <>
                {/* Continue Sequential Button */}
                <button
                  onClick={onContinue || onPlay}
                  disabled={totalSteps === 0}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                    totalSteps > 0
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                      : isLight
                      ? 'bg-slate-200 text-slate-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Continue moving step-by-step from where players stopped"
                >
                  <FastForward className="w-4 h-4 fill-current stroke-[2.5]" />
                  <span>Continue</span>
                </button>

                {/* Continue Unit Button */}
                <button
                  onClick={onContinueUnit || onPlayUnit}
                  disabled={totalSteps === 0}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
                    totalSteps > 0
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30 ring-2 ring-sky-400/50'
                      : isLight
                      ? 'bg-slate-200 text-slate-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Continue moving all players simultaneously as a unit from current position"
                >
                  <Users className="w-4 h-4 stroke-[2.5]" />
                  <span>Continue Unit</span>
                </button>

                {/* Play Tactic / Play All (with countdown from start) */}
                <button
                  onClick={onPlay}
                  disabled={totalSteps === 0}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${btnBg}`}
                  title={totalSteps === 0 ? "Drag players or ball on the pitch to record movements first" : "Play entire tactic from start (3s Countdown)"}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play All</span>
                </button>
              </>
            )}
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Previous Step */}
              <button
                onClick={() => onSeekStep(Math.max(0, currentStepIndex - 1))}
                disabled={totalSteps === 0 || currentStepIndex === 0}
                className={`p-1.5 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer ${btnBg}`}
                title="Jump to Previous Step"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              {/* Next Step */}
              <button
                onClick={() => onSeekStep(Math.min(totalSteps - 1, currentStepIndex + 1))}
                disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
                className={`p-1.5 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer ${btnBg}`}
                title="Jump to Next Step"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Stop / Reset to Start */}
              <button
                onClick={onStop}
                disabled={totalSteps === 0}
                className={`p-1.5 rounded-xl border disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer ${btnBg}`}
                title="Stop & Reset to Initial Positions"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Center: Steps Counter & Auto-Record Tag */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border shadow-inner ${subPillBg}`}>
          <div className="flex items-center gap-1.5">
            <Film className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
            <span className={`font-extrabold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              {totalSteps > 0 ? (
                <>
                  Step <span className={`font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{currentStepIndex + 1}</span> of{' '}
                  <span className={`font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{totalSteps}</span>
                </>
              ) : (
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>0 Keyframes Recorded</span>
              )}
            </span>
          </div>

          <span className={`text-[10px] border px-1.5 py-0.5 rounded font-black tracking-wide uppercase ${
            isLight
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            Auto-Log On Release
          </span>
        </div>

        {/* Right: Speed & Clear */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Speed Selector */}
          <div className={`flex items-center p-0.5 rounded-xl border gap-0.5 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <Gauge className="w-3 h-3 text-slate-500 ml-1.5 shrink-0" />
            {[0.5, 1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                  playbackSpeed === spd
                    ? isLight
                      ? 'bg-white text-emerald-700 border border-slate-300 shadow-sm'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Clear Recorded Steps */}
          {totalSteps > 0 && (
            <button
              onClick={onClearSteps}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 border-slate-300'
                  : 'bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border-slate-800'
              }`}
              title="Clear all recorded animation steps"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Bottom Row: Interactive Keyframe Timeline Scrubber */}
      {totalSteps > 0 && (
        <div className={`w-full flex items-center gap-2 pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 font-mono">
            Timeline
          </span>

          <div className={`relative flex-1 h-3 flex items-center rounded-full border px-1 overflow-hidden ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            {/* Smooth Progress Bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 transition-all duration-75"
              style={{ width: `${Math.max(0, Math.min(100, overallProgress * 100))}%` }}
            />

            {/* Keyframe Step Markers */}
            <div className="relative z-10 w-full flex items-center justify-between">
              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;

                return (
                  <button
                    key={step.order}
                    onClick={() => onSeekStep(idx)}
                    className={`group/marker relative flex items-center justify-center -my-1 cursor-pointer transition-all ${
                      isActive
                        ? 'scale-125'
                        : 'hover:scale-110'
                    }`}
                    title={`Step #${idx + 1}: ${step.elementId === 'ball' ? 'Ball pass/dribble' : `Player Move (${step.team})`}`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        isActive
                          ? 'bg-amber-400 border-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.9)] ring-2 ring-amber-400/80'
                          : isPast
                          ? 'bg-emerald-400 border-slate-900'
                          : isLight
                          ? 'bg-slate-400 border-slate-300'
                          : 'bg-slate-700 border-slate-900'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <span className={`text-[10px] font-bold font-mono shrink-0 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            {Math.round(overallProgress * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
