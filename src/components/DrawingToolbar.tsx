import React from 'react';
import { DrawingToolType } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Hand,
  ArrowUpRight,
  MoveUpRight,
  CornerUpRight,
  Minus,
  Pencil,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Eraser,
  Highlighter,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';

export interface DrawingToolbarProps {
  activeTool: DrawingToolType;
  onSelectTool: (tool: DrawingToolType) => void;
  activeColor: string;
  onSelectColor: (color: string) => void;
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  isHighlighted: boolean;
  onToggleHighlight: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onClearAll?: () => void;
  isFullscreen?: boolean;
}

export const TACTICAL_COLORS = [
  { name: 'Sky Blue (Pass)', value: '#38BDF8', border: '#0284C7' },
  { name: 'Crimson (Run)', value: '#EF4444', border: '#B91C1C' },
  { name: 'Tactical Amber (Dribble)', value: '#F59E0B', border: '#D97706' },
  { name: 'Emerald (Press/Def)', value: '#10B981', border: '#047857' },
  { name: 'Overload Purple', value: '#A855F7', border: '#7E22CE' },
  { name: 'High-Vis Neon', value: '#39FF14', border: '#16A34A' },
  { name: 'Pure White', value: '#FFFFFF', border: '#94A3B8' },
];

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onSelectTool,
  activeColor,
  onSelectColor,
  strokeWidth,
  onChangeStrokeWidth,
  isHighlighted,
  onToggleHighlight,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onClearAll,
  isFullscreen = false,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const panelBg = isLight ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-black/95 border-neutral-800 text-neutral-100';
  const groupBg = isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-neutral-900 border-neutral-800';
  const inactiveBtn = isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70' : 'text-neutral-300 hover:text-white hover:bg-neutral-800';
  const inactiveTextMuted = isLight ? 'text-slate-500 hover:text-slate-900' : 'text-neutral-400 hover:text-white';
  const dividerBorder = isLight ? 'border-slate-200' : 'border-neutral-800';

  if (isFullscreen) {
    return (
      <div className={`w-auto max-h-[85vh] flex flex-col items-center justify-start border backdrop-blur-xl rounded-2xl shadow-2xl text-xs gap-2 p-2 overflow-y-auto select-none shrink-0 scrollbar-none z-40 ${panelBg}`}>
        {/* Header Label */}
        <div className={`text-[10px] font-black uppercase tracking-wider pb-1 w-full text-center border-b ${
          isLight ? 'text-slate-700 border-slate-200' : 'text-neutral-300 border-neutral-800'
        }`}>
          Tools
        </div>

        {/* Group 1: Tactical Pointer, Arrows, Lines & Pen */}
        <div className={`flex flex-col items-center p-1.5 rounded-xl border gap-1 w-full ${groupBg}`}>
          <button
            type="button"
            onClick={() => onSelectTool('hand')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'hand'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Hand Pointer (Interact with players & pitch without drawing)"
          >
            <Hand className="w-4 h-4 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Hand</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('arrow_solid')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'arrow_solid'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Solid Arrow (Pass / Player Movement Run)"
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Arrow</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('arrow_dashed')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'arrow_dashed'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Dashed Arrow (Off-the-ball Run / Supporting Line)"
          >
            <MoveUpRight className="w-4 h-4 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Dashed</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('arrow_curved')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'arrow_curved'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Curved Arrow (Bending Cross / Overlap Run)"
          >
            <CornerUpRight className="w-4 h-4 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Curved</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('arrow_curved_dashed')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'arrow_curved_dashed'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Dashed Curved Arrow"
          >
            <CornerUpRight className="w-4 h-4 shrink-0 stroke-dashed" />
            <span className="text-[11px] whitespace-nowrap">C. Dash</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('line')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'line'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Straight Line (Channel / Barrier)"
          >
            <Minus className="w-4 h-4 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Line</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('line_dashed')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'line_dashed'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Dashed Line"
          >
            <Minus className="w-4 h-4 shrink-0 stroke-dashed opacity-90" />
            <span className="text-[11px] whitespace-nowrap">D. Line</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('pen')}
            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              activeTool === 'pen'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : inactiveBtn
            }`}
            title="Tactical Pen (Freehand)"
          >
            <Pencil className="w-4 h-4 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Pen</span>
          </button>
        </div>

        {/* Group 2: Shapes & Zones */}
        <div className={`flex flex-col items-center p-1.5 rounded-xl border gap-1 w-full ${groupBg}`}>
          <div className="grid grid-cols-3 gap-1 w-full">
            <button
              type="button"
              onClick={() => onSelectTool('rectangle')}
              className={`p-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center ${
                activeTool === 'rectangle'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : inactiveBtn
              }`}
              title="Box Zone"
            >
              <Square className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('circle')}
              className={`p-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center ${
                activeTool === 'circle'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : inactiveBtn
              }`}
              title="Target Circle"
            >
              <CircleIcon className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('triangle')}
              className={`p-1.5 rounded-lg font-bold transition cursor-pointer flex items-center justify-center ${
                activeTool === 'triangle'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : inactiveBtn
              }`}
              title="Triangle Combo"
            >
              <TriangleIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleHighlight}
            className={`w-full flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer border ${
              isHighlighted
                ? isLight
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                  : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-sm'
                : isLight
                ? 'text-slate-600 border-transparent hover:bg-slate-200/70'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Fill Highlight"
          >
            <Highlighter className={`w-3 h-3 ${isHighlighted ? 'text-emerald-500 animate-pulse' : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            <span>Fill Zone</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('eraser')}
            className={`w-full flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-rose-500 text-white font-black shadow-md ring-1 ring-rose-400'
                : isLight
                ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-100'
                : 'text-rose-400 hover:text-rose-200 hover:bg-rose-500/10'
            }`}
            title="Eraser Tool"
          >
            <Eraser className="w-3 h-3" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Group 3: Color Palette & Line Weight */}
        <div className={`flex flex-col items-center p-1.5 rounded-xl border gap-1.5 w-full ${groupBg}`}>
          <div className="grid grid-cols-4 gap-1">
            {TACTICAL_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onSelectColor(c.value)}
                className={`w-4 h-4 rounded-full transition-all cursor-pointer border ${
                  activeColor === c.value
                    ? 'scale-125 ring-2 ring-amber-400 border-white shadow-md'
                    : isLight
                    ? 'border-slate-300 opacity-80 hover:opacity-100 hover:scale-110'
                    : 'border-slate-700 opacity-80 hover:opacity-100 hover:scale-110'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>

          <div className={`grid grid-cols-3 gap-0.5 w-full pt-1 border-t ${dividerBorder}`}>
            <button
              type="button"
              onClick={() => onChangeStrokeWidth(1.2)}
              className={`px-1 py-0.5 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                strokeWidth === 1.2 ? 'bg-amber-400 text-slate-950 font-black' : inactiveTextMuted
              }`}
              title="Thin"
            >
              Thin
            </button>
            <button
              type="button"
              onClick={() => onChangeStrokeWidth(2.0)}
              className={`px-1 py-0.5 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                strokeWidth === 2.0 ? 'bg-amber-400 text-slate-950 font-black' : inactiveTextMuted
              }`}
              title="Med"
            >
              Med
            </button>
            <button
              type="button"
              onClick={() => onChangeStrokeWidth(3.0)}
              className={`px-1 py-0.5 rounded text-[10px] font-bold transition cursor-pointer text-center ${
                strokeWidth === 3.0 ? 'bg-amber-400 text-slate-950 font-black' : inactiveTextMuted
              }`}
              title="Thick"
            >
              Thick
            </button>
          </div>
        </div>

        {/* Group 4: Undo / Redo / Clear */}
        <div className={`flex items-center justify-between p-1.5 rounded-xl border w-full gap-1 ${groupBg}`}>
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              canUndo
                ? isLight
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95'
                : 'text-slate-400 opacity-40 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              canRedo
                ? isLight
                  ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95'
                : 'text-slate-400 opacity-40 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4 shrink-0" />
          </button>

          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100/80 font-bold transition cursor-pointer"
              title="Clear All Drawings"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Full Width Bar
  return (
    <div
      className={`w-full flex flex-wrap items-center justify-between border backdrop-blur-xl rounded-2xl shadow-xl text-xs gap-1.5 p-2 transition-all ${panelBg}`}
    >
      {/* Group 1: Tactical Pointer, Arrows, Lines & Pen */}
      <div className={`flex items-center p-1 rounded-xl border gap-0.5 overflow-x-auto max-w-full ${groupBg}`}>
        <button
          type="button"
          onClick={() => onSelectTool('hand')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'hand'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Hand Pointer (Interact with pitch & players without drawing)"
        >
          <Hand className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Hand</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('arrow_solid')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'arrow_solid'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Solid Arrow (Pass / Player Movement Run)"
        >
          <ArrowUpRight className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Arrow</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('arrow_dashed')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'arrow_dashed'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Dashed Arrow (Off-the-ball Run / Supporting Line)"
        >
          <MoveUpRight className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Dashed</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('arrow_curved')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'arrow_curved'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Curved Arrow (Bending Cross / Overlap Run)"
        >
          <CornerUpRight className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Curved</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('arrow_curved_dashed')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'arrow_curved_dashed'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Dashed Curved Arrow (Curved Off-the-ball Run / Overlap)"
        >
          <CornerUpRight className="w-4 h-4 shrink-0 stroke-dashed" />
          <span className="hidden sm:inline">Dashed Curve</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('line')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'line'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Straight Line (Channel / Reference Axis)"
        >
          <Minus className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Line</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('line_dashed')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'line_dashed'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Dashed Straight Line (Dashed channel / barrier)"
        >
          <Minus className="w-4 h-4 shrink-0 stroke-dashed opacity-90" />
          <span className="hidden sm:inline">Dashed Line</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('pen')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'pen'
              ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
              : inactiveBtn
          }`}
          title="Tactical Pen (Freehand Drawing)"
        >
          <Pencil className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Pen</span>
        </button>
      </div>

      {/* Group 2: Tactical Shapes, Highlight Toggle, Eraser */}
      <div className={`flex items-center p-1 rounded-xl border gap-1 ${groupBg}`}>
        <div className={`flex items-center gap-0.5 border-r pr-1 ${dividerBorder}`}>
          <button
            type="button"
            onClick={() => onSelectTool('rectangle')}
            className={`p-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTool === 'rectangle'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : inactiveBtn
            }`}
            title="Pressing Zone / Box"
          >
            <Square className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('circle')}
            className={`p-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTool === 'circle'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : inactiveBtn
            }`}
            title="Target Pocket / Circle"
          >
            <CircleIcon className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('triangle')}
            className={`p-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTool === 'triangle'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : inactiveBtn
            }`}
            title="Passing Triangle Combination"
          >
            <TriangleIcon className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Highlight Zone Fill Toggle */}
        <button
          type="button"
          onClick={onToggleHighlight}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer border ${
            isHighlighted
              ? isLight
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-sm'
              : isLight
              ? 'text-slate-600 border-transparent hover:bg-slate-200/70'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Fill shapes with translucent highlight color"
        >
          <Highlighter className={`w-3.5 h-3.5 ${isHighlighted ? 'text-emerald-500 animate-pulse' : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          <span className="hidden md:inline">Fill Zone</span>
        </button>

        {/* Eraser Tool */}
        <button
          type="button"
          onClick={() => onSelectTool('eraser')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
            activeTool === 'eraser'
              ? 'bg-rose-500 text-white font-black shadow-md ring-1 ring-rose-400'
              : isLight
              ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-100'
              : 'text-rose-400 hover:text-rose-200 hover:bg-rose-500/10'
          }`}
          title="Eraser (Tap or swipe drawings to remove)"
        >
          <Eraser className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Eraser</span>
        </button>
      </div>

      {/* Group 3: Color Palette & Line Weight */}
      <div className={`flex items-center p-1 rounded-xl border gap-2 ${groupBg}`}>
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {TACTICAL_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onSelectColor(c.value)}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all cursor-pointer border ${
                activeColor === c.value
                  ? 'scale-125 ring-2 ring-amber-400 border-white shadow-md'
                  : isLight
                  ? 'border-slate-300 opacity-80 hover:opacity-100 hover:scale-110'
                  : 'border-slate-700 opacity-80 hover:opacity-100 hover:scale-110'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        {/* Stroke Weight */}
        <div className={`flex items-center gap-1 pl-1.5 border-l ${dividerBorder}`}>
          <button
            type="button"
            onClick={() => onChangeStrokeWidth(1.2)}
            className={`px-1.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
              strokeWidth === 1.2 ? 'bg-amber-400 text-slate-950 font-black' : inactiveTextMuted
            }`}
            title="Thin (1.2px)"
          >
            Thin
          </button>
          <button
            type="button"
            onClick={() => onChangeStrokeWidth(2.0)}
            className={`px-1.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
              strokeWidth === 2.0 ? 'bg-amber-400 text-slate-950 font-black' : inactiveTextMuted
            }`}
            title="Medium (2.0px)"
          >
            Med
          </button>
          <button
            type="button"
            onClick={() => onChangeStrokeWidth(3.0)}
            className={`px-1.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
              strokeWidth === 3.0 ? 'bg-amber-400 text-slate-950 font-black' : inactiveTextMuted
            }`}
            title="Thick (3.0px)"
          >
            Thick
          </button>
        </div>
      </div>

      {/* Group 4: Undo / Redo / Clear */}
      <div className={`flex items-center p-1 rounded-xl border gap-1 ${groupBg}`}>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            canUndo
              ? isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95'
              : 'text-slate-400 opacity-40 cursor-not-allowed'
          }`}
          title="Undo Last Drawing (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 shrink-0" />
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            canRedo
              ? isLight
                ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
                : 'text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95'
              : 'text-slate-400 opacity-40 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4 shrink-0" />
        </button>

        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 font-bold text-xs transition cursor-pointer ml-1"
            title="Clear All Drawings from Pitch"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
