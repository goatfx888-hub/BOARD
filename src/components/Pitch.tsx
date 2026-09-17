import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PitchSVG } from './PitchSVG';
import { PlayerCard } from './PlayerCard';
import { DrawingOverlay } from './DrawingOverlay';
import { DrawingToolbar, TACTICAL_COLORS } from './DrawingToolbar';
import { CountdownOverlay } from './CountdownOverlay';
import { KeyframesRecordedStudio } from './KeyframesRecordedStudio';
import { useTheme } from '../context/ThemeContext';
import {
  SquadData,
  PitchTexture,
  PitchPerspective,
  LightingMode,
  TacticalArrow,
  Player,
  DrawingToolType,
  DrawingElement,
} from '../types';
import {
  TacticAnimator,
  FrameState,
  ElementSnapshot,
  RecordedStep,
} from '../utils/tacticAnimator';
import {
  Check,
  RotateCcw,
  Pencil,
  Trash2,
  Maximize2,
  Minimize2,
  Grid3X3,
  Layers,
  SlidersHorizontal,
  Tv,
  Eye,
  Hash,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  MoveHorizontal,
  MoveVertical,
  Shirt,
  Globe,
  Scan,
  X,
  Box,
  Hand,
  ArrowUpRight,
  MoveUpRight,
  CornerUpRight,
  Minus,
  Square,
  Eraser,
  Undo2,
  Redo2,
} from 'lucide-react';
import { TacticalZonesOverlay, ZoneMode } from './TacticalZonesOverlay';

interface TextureOption {
  id: PitchTexture;
  name: string;
  category: 'Modern' | 'Classic' | 'Special';
  previewBg: string;
  accent: string;
}

const PITCH_TEXTURE_OPTIONS: TextureOption[] = [
  { id: 'vintage_classic', name: 'Vintage Classic 1970s', category: 'Classic', previewBg: 'bg-lime-800 ring-1 ring-lime-400', accent: '#84cc16' },
  { id: 'striped', name: 'Premier Lawn Stripes', category: 'Modern', previewBg: 'bg-emerald-600 ring-1 ring-emerald-400', accent: '#10b981' },
  { id: 'checkerboard', name: 'Checkerboard Lawn', category: 'Modern', previewBg: 'bg-emerald-700 ring-1 ring-emerald-500', accent: '#059669' },
  { id: 'circular', name: 'Concentric Rings', category: 'Modern', previewBg: 'bg-emerald-600 ring-1 ring-teal-400', accent: '#10b981' },
  { id: 'diamond_cut', name: 'Diamond Cut Lawn', category: 'Modern', previewBg: 'bg-emerald-700 ring-1 ring-emerald-400', accent: '#34d399' },
  { id: 'deep_emerald', name: 'Deep Emerald Turf', category: 'Modern', previewBg: 'bg-emerald-800 ring-1 ring-emerald-500', accent: '#059669' },
  { id: 'hybrid_stadium', name: 'Hybrid Desso Turf', category: 'Modern', previewBg: 'bg-green-600 ring-1 ring-green-400', accent: '#22c55e' },
  { id: 'frost_pitch', name: 'Winter Match Frost', category: 'Special', previewBg: 'bg-teal-800 ring-1 ring-cyan-400', accent: '#38bdf8' },
  { id: 'retro_grass', name: 'Retro Grass', category: 'Classic', previewBg: 'bg-green-700 ring-1 ring-green-400', accent: '#4ade80' },
  { id: 'indoor_turf', name: '4G Synthetic Turf', category: 'Modern', previewBg: 'bg-teal-700 ring-1 ring-teal-400', accent: '#2dd4bf' },
  { id: 'tactical_dark', name: 'Tactical Slate Dark', category: 'Special', previewBg: 'bg-slate-900 ring-1 ring-cyan-500', accent: '#94a3b8' },
];

interface PitchProps {
  boardRef?: React.RefObject<HTMLDivElement | null>;
  squad: SquadData; // Home Squad
  awaySquad?: SquadData | null; // Away Squad
  matchMode?: 'home_vs_away' | 'home_only' | 'away_only';
  onMatchModeChange?: (mode: 'home_vs_away' | 'home_only' | 'away_only') => void;
  showNames?: boolean;
  onToggleShowNames?: () => void;
  onOpenPlayerNamer?: () => void;
  tokenDisplayMode?: 'number' | 'position';
  texture: PitchTexture;
  onChangeTexture?: (texture: PitchTexture) => void;
  perspective: PitchPerspective;
  onChangePerspective?: (perspective: PitchPerspective) => void;
  lighting: LightingMode;
  onChangeLighting?: (lighting: LightingMode) => void;
  orientation?: 'horizontal' | 'vertical';
  onChangeOrientation?: (orientation: 'horizontal' | 'vertical') => void;
  selectedPlayerId: string | null;
  onSelectPlayer: (playerId: string, team?: 'home' | 'away') => void;
  onSwapPlayers: (player1Id: string, player2Id: string, team?: 'home' | 'away') => void;
  onUpdatePlayerPosition: (playerId: string, pitchX: number, pitchY: number, team?: 'home' | 'away') => void;
  isDrawingMode: boolean;
  drawingType: 'pass' | 'run' | 'dribble' | 'press';
  onAddArrow: (arrow: TacticalArrow) => void;
  onUpdateArrow?: (arrow: TacticalArrow) => void;
  onRemoveArrow: (id: string) => void;
  onSelectTeam?: (team: 'home' | 'away') => void;
  onResetBoard?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onToggleDrawingMode?: () => void;
  onChangeDrawingType?: (type: 'pass' | 'run' | 'dribble' | 'press') => void;
  onClearArrows?: () => void;
  onExportImage?: () => void;
  onOpenKitModal?: () => void;
}

// Helper: Calculate container display position (xPos %, yPos %) from player pitchX, pitchY
const getPlayerDisplayPosition = (
  player: Player,
  team: 'home' | 'away',
  matchMode: 'home_vs_away' | 'home_only' | 'away_only' | string,
  orientation: 'horizontal' | 'vertical' | string
) => {
  const isVS = matchMode === 'home_vs_away';
  const px = Math.max(3, Math.min(97, isVS ? (player.vsPitchX ?? player.pitchX ?? 50) : (player.pitchX ?? 50)));
  const py = isVS ? (player.vsPitchY ?? player.pitchY ?? 50) : (player.pitchY ?? 50);

  let xPos: number;
  let yPos: number;

  if (team === 'home') {
    if (matchMode === 'home_vs_away' || matchMode === 'away_only') {
      const scaledY = Math.max(3, Math.min(97, 50 + (py / 100) * 43));
      if (orientation === 'horizontal') {
        xPos = 100 - scaledY;
        yPos = px;
      } else {
        xPos = px;
        yPos = scaledY;
      }
    } else {
      if (orientation === 'horizontal') {
        xPos = 100 - Math.max(3, Math.min(97, py));
        yPos = px;
      } else {
        xPos = px;
        yPos = Math.max(3, Math.min(97, py));
      }
    }
  } else {
    // away
    if (matchMode === 'home_vs_away' || matchMode === 'home_only') {
      const scaledY = Math.max(3, Math.min(97, 50 - (py / 100) * 43));
      if (orientation === 'horizontal') {
        xPos = 100 - scaledY;
        yPos = 100 - px;
      } else {
        xPos = 100 - px;
        yPos = scaledY;
      }
    } else {
      if (orientation === 'horizontal') {
        xPos = 100 - Math.max(3, Math.min(97, py));
        yPos = px;
      } else {
        xPos = px;
        yPos = Math.max(3, Math.min(97, py));
      }
    }
  }

  return { xPos, yPos };
};

// Helper: Inverse mapping from container percentages (pctX, pctY) to pitchX & pitchY
const getPitchCoordsFromContainer = (
  pctX: number,
  pctY: number,
  team: 'home' | 'away',
  matchMode: 'home_vs_away' | 'home_only' | 'away_only' | string,
  orientation: 'horizontal' | 'vertical' | string
) => {
  let pitchX = 50;
  let pitchY = 50;

  if (team === 'home') {
    if (matchMode === 'home_vs_away') {
      if (orientation === 'horizontal') {
        pitchY = ((50 - pctX) / 43) * 100;
        pitchX = pctY;
      } else {
        pitchX = pctX;
        pitchY = ((pctY - 50) / 43) * 100;
      }
    } else {
      if (orientation === 'horizontal') {
        pitchY = 100 - pctX;
        pitchX = pctY;
      } else {
        pitchX = pctX;
        pitchY = pctY;
      }
    }
  } else {
    // away
    if (matchMode === 'home_vs_away') {
      if (orientation === 'horizontal') {
        pitchY = ((pctX - 50) / 43) * 100;
        pitchX = 100 - pctY;
      } else {
        pitchX = 100 - pctX;
        pitchY = ((50 - pctY) / 43) * 100;
      }
    } else {
      if (orientation === 'horizontal') {
        pitchY = 100 - pctX;
        pitchX = pctY;
      } else {
        pitchX = pctX;
        pitchY = pctY;
      }
    }
  }

  pitchX = Math.max(1, Math.min(99, pitchX));
  if (matchMode === 'home_vs_away') {
    pitchY = Math.max(-116, Math.min(116, pitchY));
  } else {
    pitchY = Math.max(1, Math.min(99, pitchY));
  }

  return { pitchX, pitchY };
};

const PitchComponent: React.FC<PitchProps> = ({
  boardRef,
  squad,
  awaySquad,
  matchMode = 'home_vs_away',
  onMatchModeChange,
  showNames = false,
  tokenDisplayMode = 'number',
  texture,
  perspective,
  lighting,
  orientation = 'horizontal',
  selectedPlayerId,
  onSelectPlayer,
  onSwapPlayers,
  onUpdatePlayerPosition,
  isDrawingMode,
  drawingType,
  onAddArrow,
  onUpdateArrow,
  onRemoveArrow,
  onSelectTeam,
  onResetBoard,
  isFullscreen = false,
  onToggleFullscreen,
  onToggleDrawingMode,
  onChangeDrawingType,
  onClearArrows,
  onToggleShowNames,
  onOpenPlayerNamer,
  onChangeTexture,
  onChangePerspective,
  onChangeLighting,
  onChangeOrientation,
  onExportImage,
  onOpenKitModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const pitchContainerRef = useRef<HTMLDivElement | null>(null);

  // When tools are active (pen, arrows, lines, zones, etc.) or when dragging a player/ball,
  // prevent mobile browsers (iOS Safari, Android Chrome) from scrolling or rubber-banding.
  // When tools are NOT active and nothing is being dragged, allow completely normal page scrolling.
  const isInteractingRef = useRef(false);
  const isEffectiveDrawingActiveRef = useRef(false);

  const onPitchTouchMove = useCallback((e: TouchEvent) => {
    // Only block page scrolling if drawing tools are active or a player/ball is being actively dragged
    if (isEffectiveDrawingActiveRef.current || isInteractingRef.current) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }, []);

  // Sync ref to internal container ref and external boardRef
  const setPitchContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (pitchContainerRef.current) {
        pitchContainerRef.current.removeEventListener('touchmove', onPitchTouchMove);
      }
      pitchContainerRef.current = node;
      if (node) {
        node.addEventListener('touchmove', onPitchTouchMove, { passive: false });
      }
      if (boardRef) {
        if (typeof boardRef === 'function') {
          (boardRef as (instance: HTMLDivElement | null) => void)(node);
        } else if ('current' in boardRef) {
          (boardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    },
    [boardRef, onPitchTouchMove]
  );

  useEffect(() => {
    const container = pitchContainerRef.current;
    return () => {
      if (container) {
        container.removeEventListener('touchmove', onPitchTouchMove);
      }
    };
  }, [onPitchTouchMove]);

  // Vanilla JS Tactic Animator Engine
  const animatorRef = useRef<TacticAnimator>(new TacticAnimator());
  const [animatorState, setAnimatorState] = useState<FrameState>(() => ({
    status: 'idle',
    currentStepIndex: 0,
    totalSteps: 0,
    stepProgress: 0,
    overallProgress: 0,
    countdownValue: null,
    countdownFraction: 0,
    activeElementId: null,
    positions: {},
    ballPos: { x: 50, y: 50 },
  }));
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Match Football position state (default center spot at 50%, 50%)
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isDraggingBall, setIsDraggingBall] = useState(false);
  const [isPassing, setIsPassing] = useState(false);
  const [ballRotation, setBallRotation] = useState(0);
  const [receivingPlayerId, setReceivingPlayerId] = useState<string | null>(null);
  const [ballOwnerId, setBallOwnerId] = useState<string | null>(null);
  const passTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic pixel-accurate ball offset based on current pitch viewport
  // Ensures the ball is positioned snug and close to the player's feet without floating too far,
  // and without obscuring the player's number or jersey token.
  const getBallOffset = useCallback(() => {
    const container = pitchContainerRef.current;
    if (!container) {
      return orientation === 'horizontal' ? 3.0 : 3.8;
    }
    const rect = container.getBoundingClientRect();
    const dimension = orientation === 'horizontal' ? rect.width : rect.height;
    if (!dimension || dimension <= 0) {
      return orientation === 'horizontal' ? 3.0 : 3.8;
    }

    // Target pixel spacing from center of player token to center of ball:
    // Mobile (< 640px): ~23px in vertical / ~21px in horizontal (token radius is ~13-15px, ball radius is 9.5px;
    // this places the ball directly at the player's feet, snug and close, keeping the central number 100% visible)
    // Tablet (640-1024px): ~26px in vertical / ~25px in horizontal
    // Desktop (> 1024px): ~28px in vertical / ~27px in horizontal
    const isMobile = rect.width < 640;
    const isTablet = rect.width >= 640 && rect.width < 1024;

    let targetPx = 28;
    if (isMobile) {
      targetPx = orientation === 'vertical' ? 23 : 21;
    } else if (isTablet) {
      targetPx = orientation === 'vertical' ? 26 : 25;
    } else {
      targetPx = orientation === 'vertical' ? 29 : 27;
    }

    const pct = (targetPx / dimension) * 100;
    return Math.max(2.4, Math.min(5.4, pct));
  }, [orientation]);

  // Helper to place ball at Goalkeeper's feet for single-team mode
  const positionBallWithGoalkeeper = useCallback((activeMode: 'home_only' | 'away_only') => {
    const currentActiveSquad = activeMode === 'home_only' ? squad : (awaySquad || squad);
    const teamKey: 'home' | 'away' = activeMode === 'home_only' ? 'home' : 'away';
    const teamPlayers = currentActiveSquad.startingXI;
    const gk = teamPlayers.find((p) => p.position === 'GK') || teamPlayers[0];
    if (gk) {
      setBallOwnerId(gk.id);
      const { xPos, yPos } = getPlayerDisplayPosition(gk, teamKey, activeMode, orientation);
      const offset = getBallOffset();
      let targetX = xPos;
      let targetY = yPos;
      if (orientation === 'horizontal') {
        targetX = teamKey === 'home'
          ? Math.max(2, Math.min(98, xPos - offset))
          : Math.max(2, Math.min(98, xPos + offset));
      } else {
        targetY = teamKey === 'home'
          ? Math.max(2, Math.min(98, yPos - offset))
          : Math.max(2, Math.min(98, yPos + offset));
      }
      setBallPos({ x: targetX, y: targetY });
    }
  }, [squad, awaySquad, orientation, getBallOffset]);

  // Automatically place the football with the Goalkeeper whenever switching to or viewing Home-Only or Away-Only mode
  const prevMatchModeRef = useRef(matchMode);
  useEffect(() => {
    if (prevMatchModeRef.current !== matchMode) {
      prevMatchModeRef.current = matchMode;
      if (matchMode === 'home_only' || matchMode === 'away_only') {
        positionBallWithGoalkeeper(matchMode);
      } else if (matchMode === 'home_vs_away') {
        // Reset to center spot for classical kickoff
        setBallPos({ x: 50, y: 50 });
        setBallOwnerId(null);
      }
    }
  }, [matchMode, positionBallWithGoalkeeper]);

  // Dragging Player State (Mouse / Touch on Mobile & Tablet)
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);

  // Professional Tactical Drawing Tools State
  const [activeTool, setActiveTool] = useState<DrawingToolType>('arrow_solid');
  const [activeColor, setActiveColor] = useState<string>('#38BDF8');
  const [strokeWidth, setStrokeWidth] = useState<number>(2.0);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  // Tactical Pitch Zones Overlay Mode ('off' | '5-channels' | '18-zones')
  const [zoneMode, setZoneMode] = useState<ZoneMode>('off');

  const toggleZoneMode = useCallback(() => {
    setZoneMode((prev) => {
      if (prev === 'off') return '5-channels';
      if (prev === '5-channels') return '18-zones';
      return 'off';
    });
  }, []);

  // Drawing Undo / Redo History Stack
  const [drawingHistory, setDrawingHistory] = useState<DrawingElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingElement[][]>([]);

  // Sync initial board positions into TacticAnimator
  const syncInitialPositions = useCallback(() => {
    const animator = animatorRef.current;
    const initialElements: ElementSnapshot[] = [];
    const isVS = matchMode === 'home_vs_away';

    // Home squad
    squad.startingXI.forEach((p) => {
      const px = isVS ? (p.vsPitchX ?? p.pitchX ?? 50) : (p.pitchX ?? 50);
      const py = isVS ? (p.vsPitchY ?? p.pitchY ?? 50) : (p.pitchY ?? 50);
      initialElements.push({
        id: p.id,
        x: px,
        y: py,
        type: 'player',
        team: 'home',
        number: p.number,
        name: p.shortName || p.name,
      });
    });

    // Away squad
    if (awaySquad && matchMode !== 'home_only') {
      awaySquad.startingXI.forEach((p) => {
        const px = isVS ? (p.vsPitchX ?? p.pitchX ?? 50) : (p.pitchX ?? 50);
        const py = isVS ? (p.vsPitchY ?? p.pitchY ?? 50) : (p.pitchY ?? 50);
        initialElements.push({
          id: p.id,
          x: px,
          y: py,
          type: 'player',
          team: 'away',
          number: p.number,
          name: p.shortName || p.name,
        });
      });
    }

    // Match Football
    initialElements.push({
      id: 'ball',
      x: ballPos.x,
      y: ballPos.y,
      type: 'ball',
    });

    animator.setInitialState(initialElements);
  }, [squad, awaySquad, matchMode, ballPos.x, ballPos.y]);

  useEffect(() => {
    if (animatorRef.current.steps.length === 0) {
      syncInitialPositions();
    }
  }, [syncInitialPositions]);

  // Subscribe to animator frame events
  useEffect(() => {
    const unsubscribe = animatorRef.current.subscribe((frame) => {
      setAnimatorState(frame);
    });
    return () => unsubscribe();
  }, []);

  // Playback Control Handlers
  const handlePlayTactic = () => {
    setReceivingPlayerId(null);
    animatorRef.current.setSpeed(playbackSpeed);
    animatorRef.current.play(true, 'sequential');
  };

  const handlePlayUnitTactic = () => {
    setReceivingPlayerId(null);
    animatorRef.current.setSpeed(playbackSpeed);
    animatorRef.current.playUnit(true);
  };

  const handleResumeTactic = () => {
    setReceivingPlayerId(null);
    animatorRef.current.setSpeed(playbackSpeed);
    animatorRef.current.resume();
  };

  const handlePauseTactic = () => {
    animatorRef.current.pause();
  };

  const handleStopTactic = () => {
    animatorRef.current.stop();
  };

  const handleSeekStep = (index: number) => {
    animatorRef.current.seekToStep(index);
  };

  const handleClearSteps = () => {
    animatorRef.current.clearSteps();
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    animatorRef.current.setSpeed(speed);
  };

  const handleRemoveStep = (index: number) => {
    animatorRef.current.removeStep(index);
  };

  const handleLoadSampleTactic = () => {
    animatorRef.current.clearSteps();
    syncInitialPositions();
    const isVS = matchMode === 'home_vs_away';

    const cm = squad.startingXI.find((p) => ['CM', 'CAM', 'CDM'].includes(p.position)) || squad.startingXI[6] || squad.startingXI[0];
    const winger = squad.startingXI.find((p) => ['RW', 'LW', 'RM', 'LM'].includes(p.position)) || squad.startingXI[9] || squad.startingXI[1];
    const striker = squad.startingXI.find((p) => ['ST', 'CF'].includes(p.position)) || squad.startingXI[10] || squad.startingXI[2];

    const cmX = isVS ? (cm.vsPitchX ?? cm.pitchX ?? 50) : (cm.pitchX ?? 50);
    const cmY = isVS ? (cm.vsPitchY ?? cm.pitchY ?? 50) : (cm.pitchY ?? 50);

    const winX = isVS ? (winger.vsPitchX ?? winger.pitchX ?? 75) : (winger.pitchX ?? 75);
    const winY = isVS ? (winger.vsPitchY ?? winger.pitchY ?? 35) : (winger.pitchY ?? 35);

    const stX = isVS ? (striker.vsPitchX ?? striker.pitchX ?? 50) : (striker.pitchX ?? 50);
    const stY = isVS ? (striker.vsPitchY ?? striker.pitchY ?? 20) : (striker.pitchY ?? 20);

    // Step 1: Ball pass from CM to Winger
    const wingerInitialDisp = getPlayerDisplayPosition(winger, 'home', matchMode, orientation);
    const winTargetPitchX = Math.min(90, Math.max(10, winX + 10));
    const winTargetPitchY = Math.max(12, Math.min(88, winY - 14));
    const wingerTargetPlayer = { ...winger, pitchX: winTargetPitchX, pitchY: winTargetPitchY, vsPitchX: winTargetPitchX, vsPitchY: winTargetPitchY };
    const wingerTargetDisp = getPlayerDisplayPosition(wingerTargetPlayer, 'home', matchMode, orientation);

    const sampleBallOffset = getBallOffset();
    const ballAtWingerFeet1 = {
      x: orientation === 'horizontal' ? Math.max(3, Math.min(97, wingerInitialDisp.xPos + sampleBallOffset)) : wingerInitialDisp.xPos,
      y: orientation === 'horizontal' ? wingerInitialDisp.yPos : Math.max(3, Math.min(97, wingerInitialDisp.yPos - sampleBallOffset)),
    };

    const ballAtWingerFeet2 = {
      x: orientation === 'horizontal' ? Math.max(3, Math.min(97, wingerTargetDisp.xPos + sampleBallOffset)) : wingerTargetDisp.xPos,
      y: orientation === 'horizontal' ? wingerTargetDisp.yPos : Math.max(3, Math.min(97, wingerTargetDisp.yPos - sampleBallOffset)),
    };

    const strikerDisp = getPlayerDisplayPosition(striker, 'home', matchMode, orientation);

    animatorRef.current.recordStep(
      'ball',
      { x: ballPos.x, y: ballPos.y },
      ballAtWingerFeet1,
      { type: 'ball', label: `Pass from ${cm.shortName || cm.name} to ${winger.shortName || winger.name}` }
    );

    // Step 2: Winger sprint forward carrying the ball (Dribble)
    animatorRef.current.recordStep(
      winger.id,
      { x: winX, y: winY },
      { x: winTargetPitchX, y: winTargetPitchY },
      {
        type: 'player',
        team: 'home',
        label: `${winger.shortName || winger.name} attacking wing dribble with ball`,
        carriedBall: true,
        ballFrom: ballAtWingerFeet1,
        ballTo: ballAtWingerFeet2,
      }
    );

    // Step 3: Ball whipped cross into penalty box to striker
    animatorRef.current.recordStep(
      'ball',
      ballAtWingerFeet2,
      { x: strikerDisp.xPos, y: strikerDisp.yPos },
      { type: 'ball', label: `Cross to ${striker.shortName || striker.name}` }
    );

    // Step 4: Striker finish run
    animatorRef.current.recordStep(
      striker.id,
      { x: stX, y: stY },
      { x: stX, y: Math.max(8, stY - 8) },
      { type: 'player', team: 'home', label: `${striker.shortName || striker.name} box strike run` }
    );
  };

  // Handle pointer down on player token (works on Mouse, Touch for phone/tablet, and Stylus)
  const handlePointerDownPlayer = (
    e: React.PointerEvent<HTMLDivElement>,
    player: Player,
    team: 'home' | 'away'
  ) => {
    // If drawing tool active (and not hand/select tool), do not capture player drag
    if (isDrawingMode && activeTool !== 'hand' && activeTool !== 'select') return;

    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();

    isInteractingRef.current = true;

    const target = e.currentTarget;
    const pointerId = e.pointerId;
    try {
      target.setPointerCapture(pointerId);
    } catch (_) {}

    const container = pitchContainerRef.current;
    if (!container) return;

    const cachedRect = container.getBoundingClientRect();

    // Ball possession: only moves with the player if the ball has been passed to/owned by this player
    const hasBallPossession = ballOwnerId === player.id;

    const isVS = matchMode === 'home_vs_away';
    const initialPitchX = isVS ? (player.vsPitchX ?? player.pitchX ?? 50) : (player.pitchX ?? 50);
    const initialPitchY = isVS ? (player.vsPitchY ?? player.pitchY ?? 50) : (player.pitchY ?? 50);
    let latestPitchX = initialPitchX;
    let latestPitchY = initialPitchY;

    const initialBallX = ballPos.x;
    const initialBallY = ballPos.y;
    let latestBallX = initialBallX;
    let latestBallY = initialBallY;

    const startX = e.clientX;
    const startY = e.clientY;
    let prevPointerX = startX;
    let prevPointerY = startY;
    let isMove = false;
    let rafId: number | null = null;

    const handlePointerMove = (moveEv: PointerEvent) => {
      if (moveEv.pointerId !== pointerId) return;
      if (moveEv.cancelable) {
        moveEv.preventDefault();
      }

      const deltaX = moveEv.clientX - startX;
      const deltaY = moveEv.clientY - startY;
      const stepDx = moveEv.clientX - prevPointerX;
      const stepDy = moveEv.clientY - prevPointerY;
      prevPointerX = moveEv.clientX;
      prevPointerY = moveEv.clientY;

      if (!isMove && Math.hypot(deltaX, deltaY) > 2) {
        isMove = true;
        setDraggingPlayerId(player.id);
        if (hasBallPossession) {
          setIsDraggingBall(true);
        }
      }

      // Roll and rotate the football realistically as the player dribbles across the pitch
      if (isMove && hasBallPossession) {
        const stepDist = Math.hypot(stepDx, stepDy);
        if (stepDist > 0.05) {
          const dirSign = Math.abs(stepDx) >= Math.abs(stepDy)
            ? (stepDx >= 0 ? 1 : -1)
            : (stepDy >= 0 ? 1 : -1);
          const rollAmount = dirSign * stepDist * 8.5;
          setBallRotation((prev) => prev + rollAmount);
        }
      }

      if (isMove) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (cachedRect.width === 0 || cachedRect.height === 0) return;

          const pctX = ((moveEv.clientX - cachedRect.left) / cachedRect.width) * 100;
          const pctY = ((moveEv.clientY - cachedRect.top) / cachedRect.height) * 100;

          const clampedX = Math.max(2, Math.min(98, pctX));
          const clampedY = Math.max(2, Math.min(98, pctY));

          const { pitchX, pitchY } = getPitchCoordsFromContainer(
            clampedX,
            clampedY,
            team,
            matchMode,
            orientation
          );

          latestPitchX = pitchX;
          latestPitchY = pitchY;
          onUpdatePlayerPosition(player.id, pitchX, pitchY, team);

          // If this player possesses the ball, move the ball along in a natural, responsive dribbling position
          if (hasBallPossession) {
            const curDx = moveEv.clientX - startX;
            const curDy = moveEv.clientY - startY;
            const moveMagnitude = Math.hypot(curDx, curDy);

            let offsetX = 0;
            let offsetY = 0;
            const leadDist = getBallOffset() * 0.85;

            if (moveMagnitude > 3) {
              // Lead the ball slightly in the current movement vector
              const unitX = curDx / moveMagnitude;
              const unitY = curDy / moveMagnitude;
              offsetX = unitX * leadDist;
              offsetY = unitY * leadDist;
            } else {
              // Default attacking direction
              if (orientation === 'horizontal') {
                offsetX = team === 'home' ? leadDist : -leadDist;
              } else {
                offsetY = team === 'home' ? -leadDist : leadDist;
              }
            }

            const newBallX = Math.max(2, Math.min(98, clampedX + offsetX));
            const newBallY = Math.max(2, Math.min(98, clampedY + offsetY));
            latestBallX = newBallX;
            latestBallY = newBallY;
            setBallPos({ x: newBallX, y: newBallY });
          }
        });
      }
    };

    const handlePointerUp = (upEv: PointerEvent) => {
      if (upEv.pointerId !== pointerId) return;

      try {
        target.releasePointerCapture(pointerId);
      } catch (_) {}

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (rafId) cancelAnimationFrame(rafId);

      if (isMove) {
        // AUTOMATIC STEP RECORDING (ON RELEASE):
        const playerName = player.shortName || player.name;

        animatorRef.current.recordStep(
          player.id,
          { x: initialPitchX, y: initialPitchY },
          { x: latestPitchX, y: latestPitchY },
          {
            type: 'player',
            team,
            label: hasBallPossession
              ? `${playerName} (${player.position}) Dribble with Ball`
              : `${playerName} (${player.position}) Move`,
            carriedBall: hasBallPossession,
            ballFrom: hasBallPossession ? { x: initialBallX, y: initialBallY } : undefined,
            ballTo: hasBallPossession ? { x: latestBallX, y: latestBallY } : undefined,
          }
        );

        if (hasBallPossession) {
          setBallPos({ x: latestBallX, y: latestBallY });
          setBallOwnerId(player.id);
        }
      } else {
        // Tap/click: explicitly passes the ball to this player's feet and selects player
        handlePlayerClick(player, team);
      }

      if (hasBallPossession) {
        setIsDraggingBall(false);
      }
      setDraggingPlayerId(null);
      isInteractingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const activeTacticalArrows =
    matchMode === 'home_vs_away'
      ? (squad.vsTacticalArrows || squad.tacticalArrows || [])
      : matchMode === 'away_only'
      ? (awaySquad?.tacticalArrows || [])
      : (squad.tacticalArrows || []);

  // Add drawing element handler with history push
  const handleAddDrawingElement = (element: DrawingElement) => {
    setDrawingHistory((prev) => [...prev, activeTacticalArrows]);
    setRedoStack([]);
    onAddArrow(element);
  };

  const handleUpdateDrawingElement = (element: DrawingElement) => {
    if (onUpdateArrow) {
      onUpdateArrow(element);
    }
  };

  const handleUndo = () => {
    if (drawingHistory.length === 0) return;
    const previousState = drawingHistory[drawingHistory.length - 1];
    setDrawingHistory((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, activeTacticalArrows]);

    if (onClearArrows) onClearArrows();
    previousState.forEach((elem) => onAddArrow(elem));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setDrawingHistory((prev) => [...prev, activeTacticalArrows]);

    if (onClearArrows) onClearArrows();
    nextState.forEach((elem) => onAddArrow(elem));
  };

  const handleClearAllDrawings = () => {
    if (activeTacticalArrows.length > 0) {
      setDrawingHistory((prev) => [...prev, activeTacticalArrows]);
      setRedoStack([]);
    }
    if (onClearArrows) onClearArrows();
  };

  // Keyboard shortcut listener for Ctrl+Z (Undo), Ctrl+Y (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isDrawingMode) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawingMode, drawingHistory, redoStack, activeTacticalArrows]);

  // Handle dragging the football
  const handlePointerDownBall = (e: React.PointerEvent) => {
    if (isDrawingMode && activeTool !== 'hand' && activeTool !== 'select') return;

    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();

    setBallOwnerId(null);
    isInteractingRef.current = true;

    const target = e.currentTarget;
    const pointerId = e.pointerId;
    try {
      target.setPointerCapture(pointerId);
    } catch (_) {}

    const container = pitchContainerRef.current;
    if (!container) return;

    const cachedRect = container.getBoundingClientRect();

    const startX = e.clientX;
    const startY = e.clientY;
    let prevBallPointerX = startX;
    let prevBallPointerY = startY;
    const initialX = ballPos.x;
    const initialY = ballPos.y;
    let latestBallX = initialX;
    let latestBallY = initialY;

    let isMove = false;
    let rafId: number | null = null;

    const handlePointerMove = (moveEv: PointerEvent) => {
      if (moveEv.pointerId !== pointerId) return;
      if (moveEv.cancelable) {
        moveEv.preventDefault();
      }

      const deltaX = moveEv.clientX - startX;
      const deltaY = moveEv.clientY - startY;
      const stepDx = moveEv.clientX - prevBallPointerX;
      const stepDy = moveEv.clientY - prevBallPointerY;
      prevBallPointerX = moveEv.clientX;
      prevBallPointerY = moveEv.clientY;

      if (!isMove && Math.hypot(deltaX, deltaY) > 3) {
        isMove = true;
        setIsDraggingBall(true);
      }

      if (isMove) {
        const moveDist = Math.hypot(stepDx, stepDy);
        if (moveDist > 0.2) {
          const dirSign = Math.abs(stepDx) >= Math.abs(stepDy)
            ? (stepDx >= 0 ? 1 : -1)
            : (stepDy >= 0 ? 1 : -1);
          const rollAmount = dirSign * moveDist * 5.0;
          setBallRotation((prev) => prev + rollAmount);
        }

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (cachedRect.width === 0 || cachedRect.height === 0) return;

          const pctX = initialX + (deltaX / cachedRect.width) * 100;
          const pctY = initialY + (deltaY / cachedRect.height) * 100;

          const clampedX = Math.max(2, Math.min(98, pctX));
          const clampedY = Math.max(2, Math.min(98, pctY));

          latestBallX = clampedX;
          latestBallY = clampedY;

          setBallPos({ x: clampedX, y: clampedY });
        });
      }
    };

    const handlePointerUp = (upEv: PointerEvent) => {
      if (upEv.pointerId !== pointerId) return;

      try {
        target.releasePointerCapture(pointerId);
      } catch (_) {}

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (rafId) cancelAnimationFrame(rafId);
      setIsDraggingBall(false);

      if (isMove) {
        // Check if ball was dropped near any player to attach ownership
        let closestPlayer: { player: Player; team: 'home' | 'away'; dist: number } | null = null;
        const allPlayers = [
          ...squad.startingXI.map((p) => ({ player: p, team: 'home' as const })),
          ...(awaySquad && matchMode !== 'home_only' ? awaySquad.startingXI.map((p) => ({ player: p, team: 'away' as const })) : [])
        ];

        for (const item of allPlayers) {
          const { xPos, yPos } = getPlayerDisplayPosition(item.player, item.team, matchMode, orientation);
          const d = Math.hypot(xPos - latestBallX, yPos - latestBallY);
          if (d < 7.0) {
            if (!closestPlayer || d < closestPlayer.dist) {
              closestPlayer = { ...item, dist: d };
            }
          }
        }

        if (closestPlayer) {
          setBallOwnerId(closestPlayer.player.id);
          // Snap ball cleanly to player's feet offset so it sits close without covering the player's number
          const { xPos, yPos } = getPlayerDisplayPosition(closestPlayer.player, closestPlayer.team, matchMode, orientation);
          const offset = getBallOffset();
          let snapX = xPos;
          let snapY = yPos;
          if (orientation === 'horizontal') {
            snapX = matchMode === 'home_vs_away'
              ? (closestPlayer.team === 'home' ? xPos + offset : xPos - offset)
              : xPos + offset;
          } else {
            snapY = matchMode === 'home_vs_away'
              ? (closestPlayer.team === 'home' ? yPos - offset : yPos + offset)
              : yPos - offset;
          }
          snapX = Math.max(2, Math.min(98, snapX));
          snapY = Math.max(2, Math.min(98, snapY));
          latestBallX = snapX;
          latestBallY = snapY;
          setBallPos({ x: snapX, y: snapY });
        }

        // AUTOMATIC STEP RECORDING FOR BALL (ON RELEASE):
        const stepLabel = closestPlayer
          ? `Pass to #${closestPlayer.player.number} ${closestPlayer.player.shortName || closestPlayer.player.name}`
          : 'Ball Movement / Pass';

        animatorRef.current.recordStep(
          'ball',
          { x: initialX, y: initialY },
          { x: latestBallX, y: latestBallY },
          {
            type: 'ball',
            team: closestPlayer?.team || 'home',
            label: stepLabel,
          }
        );
      }
      isInteractingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleResetBoard = () => {
    if (matchMode === 'home_only' || matchMode === 'away_only') {
      positionBallWithGoalkeeper(matchMode);
    } else {
      setBallPos({ x: 50, y: 50 });
      setBallOwnerId(null);
    }
    animatorRef.current.clearSteps();
    syncInitialPositions();
    if (onResetBoard) {
      onResetBoard();
    }
  };

  // Selected player detail
  const selectedPlayer =
    squad.startingXI.find((p) => p.id === selectedPlayerId) ||
    awaySquad?.startingXI.find((p) => p.id === selectedPlayerId);

  const selectedTeam: 'home' | 'away' = squad.startingXI.some((p) => p.id === selectedPlayerId)
    ? 'home'
    : 'away';

  // Handle click on player card or pitch slot (passes ball in front of player facing opponent goal)
  const handlePlayerClick = (player: Player, team: 'home' | 'away') => {
    // Set this player as current ball owner
    setBallOwnerId(player.id);

    // Calculate player display coordinates
    const { xPos, yPos } = getPlayerDisplayPosition(player, team, matchMode, orientation);

    // Position ball IN FRONT OF the player (towards opponent goal)
    // Snug responsive offset so the ball is positioned clearly visible in front of player feet on all screens
    const ballOffset = getBallOffset();
    let targetX = xPos;
    let targetY = yPos;

    if (orientation === 'horizontal') {
      if (matchMode === 'home_vs_away') {
        targetX = team === 'home' ? xPos + ballOffset : xPos - ballOffset;
      } else {
        targetX = xPos + ballOffset;
      }
    } else {
      if (matchMode === 'home_vs_away') {
        targetY = team === 'home' ? yPos - ballOffset : yPos + ballOffset;
      } else {
        targetY = yPos - ballOffset;
      }
    }

    targetX = Math.max(2, Math.min(98, targetX));
    targetY = Math.max(2, Math.min(98, targetY));

    const fromBallX = ballPos.x;
    const fromBallY = ballPos.y;
    const dx = targetX - fromBallX;
    const dy = targetY - fromBallY;
    const dist = Math.hypot(dx, dy);

    if (dist > 0.3) {
      setIsPassing(true);
      setReceivingPlayerId(player.id);

      // Roll ball rotation proportionally to pass distance
      const rollTurns = Math.max(360, Math.round(dist * 16));
      setBallRotation((prev) => prev + (dx >= 0 ? rollTurns : -rollTurns));
      setBallPos({ x: targetX, y: targetY });

      // AUTOMATIC STEP RECORDING FOR BALL PASS IN KEYFRAME STUDIO:
      const playerName = player.shortName || player.name;
      animatorRef.current.recordStep(
        'ball',
        { x: fromBallX, y: fromBallY },
        { x: targetX, y: targetY },
        {
          type: 'ball',
          team,
          label: `Pass to #${player.number} ${playerName} (${player.position})`,
        }
      );

      if (passTimerRef.current) clearTimeout(passTimerRef.current);
      passTimerRef.current = setTimeout(() => {
        setIsPassing(false);
        setReceivingPlayerId(null);
      }, 550);
    }

    if (selectedPlayerId === player.id) {
      onSelectPlayer('');
    } else {
      onSelectPlayer(player.id, team);
    }
  };

  // Click on pitch board - deselect player if clicking empty pitch space
  const handlePitchClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if click was directly on pitch or drawing overlay (not on a player card)
    const target = e.target as HTMLElement;
    if (target.closest('.player-card-token')) return;

    if (selectedPlayerId) {
      onSelectPlayer('');
    }
  };

  // CSS classes for Perspective / 3D tilt
  const getPerspectiveTransform = () => {
    switch (perspective) {
      case '3d_perspective':
        return orientation === 'horizontal'
          ? 'perspective-[1200px] [transform:rotateX(22deg)_scale(0.96)] shadow-2xl'
          : 'perspective-[1000px] [transform:rotateX(28deg)_scale(0.95)] shadow-2xl';
      case 'broadcast_tv':
        return orientation === 'horizontal'
          ? 'perspective-[1200px] [transform:rotateX(28deg)_rotateY(-3deg)_scale(0.94)] shadow-2xl'
          : 'perspective-[1200px] [transform:rotateX(36deg)_rotateY(-2deg)_scale(0.92)] shadow-2xl';
      case 'half_pitch':
        return 'scale-110';
      default:
        return 'transform-none';
    }
  };

  const containerAspect = orientation === 'horizontal'
    ? 'aspect-[10/7] w-full'
    : 'aspect-[9/16] sm:aspect-[7/10] w-full';

  // Responsive container sizing: tailored for regular and friendly fullscreen laptop/mobile view
  const pitchWidthClass = isFullscreen
    ? 'w-full h-full max-h-full mx-auto flex flex-col items-center justify-between overflow-hidden'
    : (orientation === 'horizontal' ? 'max-w-4xl md:max-w-[780px] lg:max-w-[1020px] xl:max-w-[1060px]' : 'w-full max-w-[460px] sm:max-w-2xl md:max-w-[640px] lg:max-w-[720px] xl:max-w-[760px]');

  const pitchAspectClass = isFullscreen
    ? (orientation === 'horizontal'
        ? 'h-full max-h-full max-w-full aspect-[10/7] flex items-center justify-center'
        : 'h-full max-h-full w-auto max-w-full aspect-[9/16] md:aspect-[7/10] flex items-center justify-center')
    : `w-full ${containerAspect}`;

  // In fullscreen mode on desktop (md+ screens), drawing can stay always ready; on mobile, it follows whether Tools are open
  const isEffectiveDrawingActive = isFullscreen
    ? (isDrawingMode || (typeof window !== 'undefined' && window.innerWidth >= 768))
    : isDrawingMode;

  useEffect(() => {
    isEffectiveDrawingActiveRef.current = isEffectiveDrawingActive;
  }, [isEffectiveDrawingActive]);

  return (
    <div className={`relative w-full ${pitchWidthClass} mx-auto flex flex-col items-center select-none ${isFullscreen ? 'p-0.5 sm:p-1.5 gap-1 sm:gap-1.5 justify-between min-h-0' : 'py-1 gap-2'}`}>
      {/* Match Teams & Drawing Tools Control Bar */}
      <div className={`w-full flex ${
        isFullscreen
          ? 'flex-nowrap overflow-x-auto justify-start sm:justify-center px-1.5 sm:px-2 py-1 max-w-3xl scrollbar-none gap-1 sm:gap-2'
          : 'flex-wrap items-center justify-center px-3 py-1.5 gap-1.5 sm:gap-2.5'
      } backdrop-blur-md rounded-xl shadow-md text-xs shrink-0 z-30 ${
        isLight
          ? 'bg-white/95 border border-slate-200 shadow-slate-200/60'
          : 'bg-neutral-900/95 border border-neutral-800'
      }`}>
        {/* Team Selector */}
        {onMatchModeChange ? (
          <div className={`flex items-center p-1 rounded-xl border gap-1 shrink-0 ${
            isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-black border-neutral-800 shadow-inner'
          }`}>
            <button
              onClick={() => {
                onMatchModeChange('home_only');
                onSelectTeam?.('home');
              }}
              className={`px-1.5 sm:px-2.5 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 ${
                matchMode === 'home_only'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Display Home Team only"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0"
                style={{ backgroundColor: squad.kit.primaryColor }}
              />
              <span className={isFullscreen ? 'hidden sm:inline' : ''}>Home Team</span>
              <span className={isFullscreen ? 'inline sm:hidden' : 'hidden'}>Home</span>
            </button>

            <button
              onClick={() => onMatchModeChange('home_vs_away')}
              className={`px-1.5 sm:px-2.5 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 ${
                matchMode === 'home_vs_away'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Display both teams (Home vs Away)"
            >
              <span className={isFullscreen ? 'hidden sm:inline' : ''}>Both (VS)</span>
              <span className={isFullscreen ? 'inline sm:hidden' : 'hidden'}>Both</span>
            </button>

            {awaySquad && (
              <button
                onClick={() => {
                  onMatchModeChange('away_only');
                  onSelectTeam?.('away');
                }}
                className={`px-1.5 sm:px-2.5 py-1 rounded-lg font-black text-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 ${
                  matchMode === 'away_only'
                    ? 'bg-rose-500 text-white shadow-md font-extrabold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Display Away Team only"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0"
                  style={{ backgroundColor: awaySquad.kit.primaryColor }}
                />
                <span className={isFullscreen ? 'hidden sm:inline' : ''}>Away Team</span>
                <span className={isFullscreen ? 'inline sm:hidden' : 'hidden'}>Away</span>
              </button>
            )}
          </div>
        ) : (
          <div className={`px-2.5 py-1 rounded-md font-black text-xs border shrink-0 ${
            isLight
              ? 'bg-slate-100 text-emerald-700 border-slate-200'
              : 'bg-neutral-800 text-emerald-400 border border-neutral-700/80'
          }`}>
            {matchMode === 'home_vs_away' ? 'BOTH (VS)' : matchMode === 'home_only' ? 'HOME TEAM' : 'AWAY TEAM'}
          </div>
        )}

        {/* Tactical Pitch Zones Button */}
        <button
          onClick={toggleZoneMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-extrabold text-xs transition active:scale-95 shadow-sm shrink-0 cursor-pointer ${
            zoneMode !== 'off'
              ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400/80 font-black'
              : isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80'
          }`}
          title="Toggle Pitch Tactical Zones (5 Channels / 18 Grid Zones / Off)"
        >
          <Grid3X3 className={`w-3.5 h-3.5 shrink-0 ${zoneMode !== 'off' ? 'text-slate-950' : isLight ? 'text-teal-600' : 'text-teal-400'}`} />
          <span className={isFullscreen ? 'hidden sm:inline' : ''}>
            {zoneMode === 'off' && 'Zones'}
            {zoneMode === '5-channels' && 'Zones: 5 Channels'}
            {zoneMode === '18-zones' && 'Zones: 18 (Zone 14)'}
          </span>
          <span className={isFullscreen ? 'inline sm:hidden' : 'hidden'}>Zones</span>
        </button>

        {/* Reset Button */}
        {onResetBoard && (
          <button
            onClick={handleResetBoard}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-extrabold text-xs transition active:scale-95 shadow-sm shrink-0 cursor-pointer ${
              isLight
                ? 'bg-amber-100/90 hover:bg-amber-200/80 text-amber-900 border border-amber-300/80'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
            }`}
            title="Reset all player positions and ball back to original center position"
          >
            <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
            <span>Reset</span>
          </button>
        )}

        {/* Fullscreen Button (<>) */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-extrabold text-xs transition active:scale-95 shadow-sm shrink-0 cursor-pointer ${
              isFullscreen
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/80 font-black'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80'
            }`}
            title={isFullscreen ? "Exit Fullscreen Mode (Esc)" : "Full Screen (<>)"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="font-mono text-[11px] font-black">&lt;&gt;</span>
                <span className="hidden sm:inline">Exit Fullscreen</span>
                <span className="inline sm:hidden">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span className={`font-mono text-[11px] font-black ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>&lt;&gt;</span>
                <span>Fullscreen</span>
              </>
            )}
          </button>
        )}

        {/* 1. Tools Button */}
        {onToggleDrawingMode && (
          <button
            type="button"
            onClick={onToggleDrawingMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm shrink-0 cursor-pointer ${
              isDrawingMode
                ? isLight
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm font-black ring-1 ring-emerald-400/50'
                  : 'bg-neutral-800 text-emerald-300 border border-emerald-500/60 shadow-sm font-black ring-1 ring-emerald-400/50'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                : 'bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/80'
            }`}
            title="Toggle Tactical Annotation Tools"
          >
            <Pencil className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tools</span>
            {isDrawingMode && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Tactical Drawing Toolbar when Drawing Mode is active (Horizontal in normal mode) */}
      {!isFullscreen && isDrawingMode && (
        <div className="w-full animate-in fade-in slide-in-from-top-1">
          <DrawingToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            activeColor={activeColor}
            onSelectColor={setActiveColor}
            strokeWidth={strokeWidth}
            onChangeStrokeWidth={setStrokeWidth}
            isHighlighted={isHighlighted}
            onToggleHighlight={() => setIsHighlighted(!isHighlighted)}
            canUndo={drawingHistory.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearAll={handleClearAllDrawings}
            isFullscreen={false}
          />
        </div>
      )}

      {/* Main Pitch Container Area (Flex-col on mobile, Flex-row on md+ screens in Fullscreen) */}
      <div className={`w-full flex ${isFullscreen ? 'flex-col md:flex-row items-center justify-center gap-1 sm:gap-3 flex-1 min-h-0 min-w-0 relative overflow-hidden py-0.5' : 'flex-col items-center'}`}>
        {/* Left Side Vertical Drawing Toolbar (In Fullscreen Mode - ONLY on tablet/desktop md: and up) */}
        {isFullscreen && (
          <div className="hidden md:flex h-full items-center justify-center shrink-0 z-40 animate-in fade-in slide-in-from-left-3 duration-200">
            <DrawingToolbar
              activeTool={activeTool}
              onSelectTool={setActiveTool}
              activeColor={activeColor}
              onSelectColor={setActiveColor}
              strokeWidth={strokeWidth}
              onChangeStrokeWidth={setStrokeWidth}
              isHighlighted={isHighlighted}
              onToggleHighlight={() => setIsHighlighted(!isHighlighted)}
              canUndo={drawingHistory.length > 0}
              canRedo={redoStack.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClearAll={handleClearAllDrawings}
              isFullscreen={true}
            />
          </div>
        )}

        {/* Mobile Fullscreen Floating Tactical Toolbar (Only on mobile devices when Tools are active) */}
        {isFullscreen && isDrawingMode && (
          <div className="md:hidden absolute bottom-2 left-2 right-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
            <div className={`w-full flex flex-col p-2 rounded-2xl border shadow-2xl backdrop-blur-xl gap-2 ${
              isLight ? 'bg-white/95 border-slate-300 text-slate-900 shadow-slate-900/30' : 'bg-neutral-950/95 border-neutral-800 text-white shadow-black/90'
            }`}>
              {/* Header row with Title, Undo, Redo, Clear & Close */}
              <div className="flex items-center justify-between pb-1 border-b border-neutral-700/50">
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tactical Tools</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={drawingHistory.length === 0}
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Undo"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Redo"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllDrawings}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 cursor-pointer"
                    title="Clear all drawings"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onToggleDrawingMode}
                    className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer ml-1"
                    title="Hide Tools"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Row 1: Tactical Tools horizontal scrolling buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTool('hand')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'hand' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>Hand</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('arrow_solid')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'arrow_solid' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Arrow</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('arrow_dashed')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'arrow_dashed' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <MoveUpRight className="w-3.5 h-3.5" />
                  <span>Dashed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('arrow_curved')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'arrow_curved' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <CornerUpRight className="w-3.5 h-3.5" />
                  <span>Curved</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('pen')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'pen' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Pen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('line')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'line' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Line</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('rectangle')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'rectangle' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Zone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTool('eraser')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeTool === 'eraser' ? 'bg-rose-500 text-white font-black shadow-sm' : 'bg-neutral-800 text-rose-400'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>
              </div>

              {/* Row 2: Colors + Stroke thickness */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {TACTICAL_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setActiveColor(c.value)}
                      className={`w-5 h-5 rounded-full border transition cursor-pointer shrink-0 ${
                        activeColor === c.value ? 'scale-125 ring-2 ring-amber-400 border-white shadow' : 'border-neutral-600 opacity-80'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStrokeWidth(2)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      strokeWidth === 2 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    Thin
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrokeWidth(4)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      strokeWidth === 4 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    Med
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrokeWidth(6)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      strokeWidth === 6 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    Thick
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pitch Container with Perspective Transform */}
        <div
          ref={setPitchContainerRef}
          onClick={handlePitchClick}
          className={`relative isolate overflow-hidden select-none ${
            isEffectiveDrawingActive ? 'touch-none' : ''
          } ${pitchAspectClass} ${isFullscreen ? 'h-full max-h-full' : ''} transition-transform duration-500 ease-out ${getPerspectiveTransform()}`}
        >
        {/* Realistic Pitch Background SVG */}
        <PitchSVG texture={texture} lighting={lighting} orientation={orientation} showCornerFlags showGoals>
          {/* Tactical Pitch Zones & Channels Overlay */}
          <TacticalZonesOverlay mode={zoneMode} orientation={orientation} isLight={isLight} />

          {/* Tactical Drawing Overlay */}
          <DrawingOverlay
            elements={activeTacticalArrows}
            onAddElement={handleAddDrawingElement}
            onUpdateElement={handleUpdateDrawingElement}
            onRemoveElement={onRemoveArrow}
            isDrawingMode={isEffectiveDrawingActive}
            activeTool={activeTool}
            activeColor={activeColor}
            strokeWidth={strokeWidth}
            isHighlighted={isHighlighted}
            orientation={orientation}
          />

          {/* Starting XI Players & Football positioned on Pitch Grid */}
          <div
            className={`absolute inset-0 select-none ${
              isEffectiveDrawingActive
                ? activeTool !== 'hand' && activeTool !== 'select'
                  ? 'z-30 pointer-events-none touch-none'
                  : 'z-50 pointer-events-auto touch-none'
                : 'z-50 pointer-events-auto'
            }`}
          >
            {/* Match Football (Center Spot / Draggable / Pass target / Animated) */}
            {(() => {
              const isAnimating =
                animatorState.status === 'playing' ||
                animatorState.status === 'paused' ||
                animatorState.status === 'completed' ||
                animatorState.status === 'countdown';

              const activeBallPos =
                isAnimating && animatorState.positions['ball']
                  ? animatorState.positions['ball']
                  : ballPos;

              return (
                <div
                  onPointerDown={handlePointerDownBall}
                  onDoubleClick={() => setBallPos({ x: 50, y: 50 })}
                  style={{
                    position: 'absolute',
                    left: `${activeBallPos.x}%`,
                    top: `${activeBallPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isDraggingBall ? 65 : isPassing ? 55 : 35,
                    willChange: isDraggingBall || isAnimating ? 'left, top' : 'auto',
                    transition: isDraggingBall || isAnimating
                      ? 'none'
                      : isPassing
                      ? 'left 0.38s cubic-bezier(0.16, 1, 0.3, 1), top 0.38s cubic-bezier(0.16, 1, 0.3, 1)'
                      : 'left 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)',
                  }}
                  className="touch-none select-none cursor-grab active:cursor-grabbing group/ball"
                  title="Match Football (Click any player to pass, drag to move, double-click to reset)"
                >
                  {/* Realistic Ground Shadow */}
                  <div
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 sm:w-5 md:w-7 h-1.5 sm:h-2 bg-slate-950/80 rounded-full blur-[2px] transform transition-all ${
                      isPassing ? 'scale-x-140 scale-y-50 opacity-60 translate-y-0.5' : 'scale-y-80 group-hover/ball:scale-125'
                    }`}
                  />

                  {/* Ball Container with Rolling Spin Animation */}
                  <div
                    style={{
                      transform:
                        isAnimating && (animatorState.activeElementId === 'ball' || animatorRef.current.steps[animatorState.currentStepIndex]?.carriedBall)
                          ? `rotate(${ballRotation + animatorState.stepProgress * 720}deg)`
                          : `rotate(${ballRotation}deg)`,
                      transition: isPassing ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                    }}
                    className={`relative transition-transform duration-150 active:scale-95 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] ${
                      isPassing ? 'scale-125' : 'group-hover/ball:scale-115'
                    } w-[19px] h-[19px] sm:w-[24px] sm:h-[24px] md:w-[26px] md:h-[26px] lg:w-[28px] lg:h-[28px]`}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                      <defs>
                        {/* Main Sphere 3D Lighting */}
                        <radialGradient id="matchBallBase" cx="35%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="55%" stopColor="#f8fafc" />
                          <stop offset="85%" stopColor="#cbd5e1" />
                          <stop offset="100%" stopColor="#64748b" />
                        </radialGradient>
                        {/* Top Specular Gloss */}
                        <radialGradient id="matchBallGloss" cx="32%" cy="22%" r="45%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                        {/* Ring Glow on Hover */}
                        <filter id="ballGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Hover ring halo */}
                      <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        className="opacity-0 group-hover/ball:opacity-90 transition-opacity"
                        filter="url(#ballGlow)"
                      />

                      {/* Main Sphere */}
                      <circle cx="50" cy="50" r="46" fill="url(#matchBallBase)" stroke="#1e293b" strokeWidth="2.5" />

                      {/* Center Pentagon */}
                      <polygon
                        points="50,33 64.3,43.4 58.8,60.1 41.2,60.1 35.7,43.4"
                        fill="#0f172a"
                        stroke="#020617"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />

                      {/* Outer Pentagonal Patches & Seams */}
                      <g stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
                        {/* Seam lines connecting center to edge patches */}
                        <line x1="50" y1="33" x2="50" y2="15" />
                        <line x1="64.3" y1="43.4" x2="81" y2="36" />
                        <line x1="58.8" y1="60.1" x2="74" y2="74" />
                        <line x1="41.2" y1="60.1" x2="26" y2="74" />
                        <line x1="35.7" y1="43.4" x2="19" y2="36" />

                        {/* Top patch */}
                        <polygon points="50,15 36,5 64,5" fill="#0f172a" />

                        {/* Top Right patch */}
                        <polygon points="81,36 94,20 95,47" fill="#0f172a" />

                        {/* Bottom Right patch */}
                        <polygon points="74,74 92,72 78,92" fill="#0f172a" />

                        {/* Bottom Left patch */}
                        <polygon points="26,74 8,72 22,92" fill="#0f172a" />

                        {/* Top Left patch */}
                        <polygon points="19,36 6,20 5,47" fill="#0f172a" />
                      </g>

                      {/* Gold/Orange Modern Match Accent Trims */}
                      <path
                        d="M 46,30 Q 50,26 54,30"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 62,40 Q 66,45 61,50"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 38,40 Q 34,45 39,50"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Highlight Specular Glare */}
                      <circle cx="50" cy="50" r="46" fill="url(#matchBallGloss)" />
                    </svg>
                  </div>
                </div>
              );
            })()}

            {/* Home Team Players */}
            {squad.startingXI.map((player) => {
              const isAnimating =
                animatorState.status === 'playing' ||
                animatorState.status === 'paused' ||
                animatorState.status === 'completed' ||
                animatorState.status === 'countdown';

              const animatedPitchPos =
                isAnimating && animatorState.positions[player.id]
                  ? animatorState.positions[player.id]
                  : null;

              const effectivePlayer = animatedPitchPos
                ? {
                    ...player,
                    pitchX: animatedPitchPos.x,
                    pitchY: animatedPitchPos.y,
                    vsPitchX: animatedPitchPos.x,
                    vsPitchY: animatedPitchPos.y,
                  }
                : player;

              const { xPos, yPos } = getPlayerDisplayPosition(effectivePlayer, 'home', matchMode, orientation);
              const isReceiving = receivingPlayerId === player.id;
              const isBeingDragged = draggingPlayerId === player.id;
              const isVisible = matchMode !== 'away_only';

              return (
                <div
                  key={`home-${player.id}`}
                  onPointerDown={(e) => handlePointerDownPlayer(e, player, 'home')}
                  style={{
                    position: 'absolute',
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: `translate(-50%, -50%) ${!isVisible ? 'scale(0.85)' : isBeingDragged ? 'scale(1.08)' : 'scale(1)'}`,
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: !isVisible || (isDrawingMode && activeTool !== 'hand' && activeTool !== 'select') ? 'none' : 'auto',
                    willChange: isBeingDragged || isAnimating ? 'left, top' : 'left, top, opacity, transform',
                    transition: isBeingDragged || isAnimating
                      ? 'none'
                      : 'left 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.32s ease-out, transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)',
                    zIndex: isBeingDragged ? 60 : selectedPlayerId === player.id || isReceiving ? 45 : isVisible ? 38 : 10,
                  }}
                  className={`player-card-token touch-none select-none cursor-grab active:cursor-grabbing relative ${
                    isBeingDragged
                      ? 'drop-shadow-[0_8px_16px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400 rounded-full'
                      : 'hover:scale-105'
                  }`}
                >
                  {isReceiving && (
                    <div className="absolute -inset-2 rounded-full border-2 border-emerald-400 bg-emerald-400/20 animate-ping pointer-events-none z-0" />
                  )}
                  <PlayerCard
                    player={effectivePlayer}
                    kit={squad.kit}
                    isSelected={selectedPlayerId === player.id}
                    showName={showNames}
                    tokenDisplayMode={tokenDisplayMode}
                    teamType="home"
                    size={matchMode === 'home_vs_away' ? 'sm' : 'md'}
                  />
                </div>
              );
            })}

            {/* Away Team Players */}
            {awaySquad &&
              awaySquad.startingXI.map((player) => {
                const isAnimating =
                  animatorState.status === 'playing' ||
                  animatorState.status === 'paused' ||
                  animatorState.status === 'completed' ||
                  animatorState.status === 'countdown';

                const animatedPitchPos =
                  isAnimating && animatorState.positions[player.id]
                    ? animatorState.positions[player.id]
                    : null;

                const effectivePlayer = animatedPitchPos
                  ? {
                      ...player,
                      pitchX: animatedPitchPos.x,
                      pitchY: animatedPitchPos.y,
                      vsPitchX: animatedPitchPos.x,
                      vsPitchY: animatedPitchPos.y,
                    }
                  : player;

                const { xPos, yPos } = getPlayerDisplayPosition(effectivePlayer, 'away', matchMode, orientation);
                const isReceiving = receivingPlayerId === player.id;
                const isBeingDragged = draggingPlayerId === player.id;
                const isVisible = matchMode !== 'home_only';

                return (
                  <div
                    key={`away-${player.id}`}
                    onPointerDown={(e) => handlePointerDownPlayer(e, player, 'away')}
                    style={{
                      position: 'absolute',
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                      transform: `translate(-50%, -50%) ${!isVisible ? 'scale(0.85)' : isBeingDragged ? 'scale(1.08)' : 'scale(1)'}`,
                      opacity: isVisible ? 1 : 0,
                      pointerEvents: !isVisible || (isDrawingMode && activeTool !== 'hand' && activeTool !== 'select') ? 'none' : 'auto',
                      willChange: isBeingDragged || isAnimating ? 'left, top' : 'left, top, opacity, transform',
                      transition: isBeingDragged || isAnimating
                        ? 'none'
                        : 'left 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.32s ease-out, transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)',
                      zIndex: isBeingDragged ? 60 : selectedPlayerId === player.id || isReceiving ? 45 : isVisible ? 38 : 10,
                    }}
                    className={`player-card-token touch-none select-none cursor-grab active:cursor-grabbing relative ${
                      isBeingDragged
                        ? 'drop-shadow-[0_8px_16px_rgba(244,63,94,0.8)] ring-2 ring-rose-400 rounded-full'
                        : 'hover:scale-105'
                    }`}
                  >
                    {isReceiving && (
                      <div className="absolute -inset-2 rounded-full border-2 border-emerald-400 bg-emerald-400/20 animate-ping pointer-events-none z-0" />
                    )}
                    <PlayerCard
                      player={effectivePlayer}
                      kit={awaySquad.kit}
                      isSelected={selectedPlayerId === player.id}
                      showName={showNames}
                      tokenDisplayMode={tokenDisplayMode}
                      teamType="away"
                      size={matchMode === 'home_vs_away' ? 'sm' : 'md'}
                    />
                  </div>
                );
              })}
          </div>

          {/* 3-Second Playback Countdown Overlay (Only rendered during countdown) */}
          {animatorState.status === 'countdown' && (
            <CountdownOverlay
              countdownValue={animatorState.countdownValue}
              countdownFraction={animatorState.countdownFraction}
              mode={animatorState.playbackMode}
            />
          )}
        </PitchSVG>
      </div>
    </div>

    {/* Keyframes Recorded Studio & Timeline (Spacious in normal, sleek compact bar in fullscreen) */}
    <div className={`w-full flex justify-center shrink-0 z-30 ${isFullscreen ? 'max-w-4xl px-1 sm:px-2' : ''}`}>
      <KeyframesRecordedStudio
        status={animatorState.status}
        playbackMode={animatorState.playbackMode}
        currentStepIndex={animatorState.currentStepIndex}
        totalSteps={animatorState.totalSteps}
        overallProgress={animatorState.overallProgress}
        steps={animatorRef.current.steps}
        homeSquad={squad}
        awaySquad={awaySquad}
        onPlay={handlePlayTactic}
        onPlayUnit={handlePlayUnitTactic}
        onResume={handleResumeTactic}
        onPause={handlePauseTactic}
        onStop={handleStopTactic}
        onSeekStep={handleSeekStep}
        onRemoveStep={handleRemoveStep}
        onClearSteps={handleClearSteps}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleChangeSpeed}
        onLoadSampleTactic={handleLoadSampleTactic}
        isFullscreen={isFullscreen}
      />
    </div>
  </div>
);
};

export const Pitch = React.memo(PitchComponent);

