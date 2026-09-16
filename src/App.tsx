import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Pitch } from './components/Pitch';
import { TacticsSidebar } from './components/TacticsSidebar';
import { PlayerEditModal } from './components/PlayerEditModal';
import { KitCustomizerModal } from './components/KitCustomizerModal';
import { PitchExportModal } from './components/PitchExportModal';
import { PlayerNamerModal } from './components/PlayerNamerModal';
import { PRESET_SQUADS } from './data/presetSquads';
import { getFormationById } from './data/formations';
import { Shield, SlidersHorizontal, Maximize2, Minimize2, X } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { TransitionGraphic } from './components/TransitionGraphic';
import { LegalModal, LegalTabType } from './components/LegalModal';
import {
  SquadData,
  PitchTexture,
  PitchPerspective,
  LightingMode,
  TacticalArrow,
  Player,
} from './types';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [currentView, setCurrentView] = useState<'landing' | 'board'>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTargetName, setTransitionTargetName] = useState('11v11 Matchday Studio');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType>('privacy');

  const [homeSquad, setHomeSquad] = useState<SquadData>(PRESET_SQUADS[0]);
  const [awaySquad, setAwaySquad] = useState<SquadData>(PRESET_SQUADS[1]);
  const [matchMode, setMatchMode] = useState<'home_vs_away' | 'home_only' | 'away_only'>('home_vs_away');
  const [activeTeam, setActiveTeam] = useState<'home' | 'away'>('home');
  const [showNames, setShowNames] = useState(false);
  const [tokenDisplayMode, setTokenDisplayMode] = useState<'number' | 'position'>('number');
  const [isPlayerNamerOpen, setIsPlayerNamerOpen] = useState(false);

  const [texture, setTexture] = useState<PitchTexture>('vintage_classic');
  const [perspective, setPerspective] = useState<PitchPerspective>('2d_flat');
  const [lighting, setLighting] = useState<LightingMode>('day');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'vertical';
    }
    return 'horizontal';
  });

  // Ensure orientation switches appropriately on device resize (vertical on mobile, horizontal on desktop/laptop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOrientation('vertical');
      } else {
        setOrientation('horizontal');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingType, setDrawingType] = useState<'pass' | 'run' | 'dribble' | 'press'>('run');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isKitModalOpen, setIsKitModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'pitch' | 'tactics' | 'all'>('pitch');

  const exportPitchRef = useRef<HTMLDivElement>(null);

  // Fullscreen toggle handler with native Browser Fullscreen API integration
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Keyboard shortcut & browser fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Active Squad computed property
  const currentSquad = activeTeam === 'home' ? homeSquad : awaySquad;
  const setCurrentSquad = activeTeam === 'home' ? setHomeSquad : setAwaySquad;

  // --- Select Preset Squad ---
  const handleSelectPresetSquad = (newSquad: SquadData, team: 'home' | 'away') => {
    if (team === 'home') {
      setHomeSquad(newSquad);
    } else {
      setAwaySquad(newSquad);
    }
    setSelectedPlayerId(null);
  };

  // --- CTA Launch from Landing Page with Motion Graphic ---
  const handleLaunchBoard = (presetName?: string) => {
    // On computer/laptop, ensure the tactical board always opens in horizontal orientation
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setOrientation('horizontal');
    }

    const targetTitle = presetName
      ? `${presetName} Tactical Board`
      : 'Full Matchday Tactical Studio';
    setTransitionTargetName(targetTitle);

    if (presetName) {
      const lower = presetName.toLowerCase();
      if (lower.includes('4-3-3')) {
        handleUpdateFormation('4-3-3-holding');
      } else if (lower.includes('4-2-3-1')) {
        handleUpdateFormation('4-2-3-1-narrow');
      } else if (lower.includes('3-5-2')) {
        handleUpdateFormation('3-5-2');
      } else if (lower.includes('5-3-2')) {
        handleUpdateFormation('5-3-2');
      } else if (lower.includes('4-4-2')) {
        handleUpdateFormation('4-4-2-flat');
      }
    }

    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setOrientation('horizontal');
    }
    setIsTransitioning(false);
    setCurrentView('board');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: LegalTabType) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // --- Formation Switch Handler ---
  const handleUpdateFormation = (formationId: string) => {
    const formation = getFormationById(formationId);
    if (!formation) return;

    const isVS = matchMode === 'home_vs_away';

    const updatedStartingXI = currentSquad.startingXI.map((player, index) => {
      const pos = formation.positions[index] || { x: 50, y: 50, role: 'CM' };
      if (isVS) {
        return {
          ...player,
          position: pos.role,
          vsPitchX: pos.x,
          vsPitchY: pos.y,
        };
      } else {
        return {
          ...player,
          position: pos.role,
          pitchX: pos.x,
          pitchY: pos.y,
        };
      }
    });

    setCurrentSquad((prev) => ({
      ...prev,
      tactics: {
        ...prev.tactics,
        formationId: isVS ? prev.tactics.formationId : formationId,
        vsFormationId: isVS ? formationId : prev.tactics.vsFormationId,
      },
      startingXI: updatedStartingXI,
    }));
  };

  // --- Swap Players (Pitch to Pitch, or Pitch to Bench) ---
  const handleSwapPlayers = (player1Id: string, player2Id: string, team?: 'home' | 'away') => {
    if (player1Id === player2Id) return;
    const targetTeam = team || activeTeam;
    const setTargetSquad = targetTeam === 'home' ? setHomeSquad : setAwaySquad;
    const isVS = matchMode === 'home_vs_away';

    setTargetSquad((prev) => {
      const p1InXI = prev.startingXI.find((p) => p.id === player1Id);
      const p2InXI = prev.startingXI.find((p) => p.id === player2Id);
      const p1InSub = prev.substitutes.find((p) => p.id === player1Id);
      const p2InSub = prev.substitutes.find((p) => p.id === player2Id);

      let newXI = [...prev.startingXI];
      let newSubs = [...prev.substitutes];

      if (p1InXI && p2InXI) {
        if (isVS) {
          const x1 = p1InXI.vsPitchX ?? p1InXI.pitchX;
          const y1 = p1InXI.vsPitchY ?? p1InXI.pitchY;
          const x2 = p2InXI.vsPitchX ?? p2InXI.pitchX;
          const y2 = p2InXI.vsPitchY ?? p2InXI.pitchY;
          const pos1 = p1InXI.position;

          newXI = newXI.map((p) => {
            if (p.id === player1Id) {
              return { ...p, vsPitchX: x2, vsPitchY: y2, position: p2InXI.position };
            }
            if (p.id === player2Id) {
              return { ...p, vsPitchX: x1, vsPitchY: y1, position: pos1 };
            }
            return p;
          });
        } else {
          const x1 = p1InXI.pitchX;
          const y1 = p1InXI.pitchY;
          const pos1 = p1InXI.position;

          newXI = newXI.map((p) => {
            if (p.id === player1Id) {
              return { ...p, pitchX: p2InXI.pitchX, pitchY: p2InXI.pitchY, position: p2InXI.position };
            }
            if (p.id === player2Id) {
              return { ...p, pitchX: x1, pitchY: y1, position: pos1 };
            }
            return p;
          });
        }
      } else if (p1InXI && p2InSub) {
        if (isVS) {
          const p1X = p1InXI.vsPitchX ?? p1InXI.pitchX;
          const p1Y = p1InXI.vsPitchY ?? p1InXI.pitchY;
          newXI = newXI.map((p) =>
            p.id === player1Id
              ? { ...p2InSub, vsPitchX: p1X, vsPitchY: p1Y, position: p1InXI.position, isBench: false }
              : p
          );
          newSubs = newSubs.map((p) => (p.id === player2Id ? { ...p1InXI, isBench: true } : p));
        } else {
          newXI = newXI.map((p) =>
            p.id === player1Id
              ? { ...p2InSub, pitchX: p1InXI.pitchX, pitchY: p1InXI.pitchY, position: p1InXI.position, isBench: false }
              : p
          );
          newSubs = newSubs.map((p) => (p.id === player2Id ? { ...p1InXI, isBench: true } : p));
        }
      } else if (p2InXI && p1InSub) {
        if (isVS) {
          const p2X = p2InXI.vsPitchX ?? p2InXI.pitchX;
          const p2Y = p2InXI.vsPitchY ?? p2InXI.pitchY;
          newXI = newXI.map((p) =>
            p.id === player2Id
              ? { ...p1InSub, vsPitchX: p2X, vsPitchY: p2Y, position: p2InXI.position, isBench: false }
              : p
          );
          newSubs = newSubs.map((p) => (p.id === player1Id ? { ...p2InXI, isBench: true } : p));
        } else {
          newXI = newXI.map((p) =>
            p.id === player2Id
              ? { ...p1InSub, pitchX: p2InXI.pitchX, pitchY: p2InXI.pitchY, position: p2InXI.position, isBench: false }
              : p
          );
          newSubs = newSubs.map((p) => (p.id === player1Id ? { ...p2InXI, isBench: true } : p));
        }
      }

      return {
        ...prev,
        startingXI: newXI,
        substitutes: newSubs,
      };
    });
  };

  // --- Update Single Player Pitch Position ---
  const handleUpdatePlayerPosition = (
    playerId: string,
    pitchX: number,
    pitchY: number,
    team?: 'home' | 'away'
  ) => {
    const targetTeam = team || activeTeam;
    const setTargetSquad = targetTeam === 'home' ? setHomeSquad : setAwaySquad;
    const isVS = matchMode === 'home_vs_away';

    setTargetSquad((prev) => ({
      ...prev,
      startingXI: prev.startingXI.map((p) =>
        p.id === playerId
          ? isVS
            ? { ...p, vsPitchX: pitchX, vsPitchY: pitchY }
            : { ...p, pitchX, pitchY }
          : p
      ),
    }));
  };

  // --- Save Edited Player Details ---
  const handleSavePlayer = (updatedPlayer: Player) => {
    setCurrentSquad((prev) => ({
      ...prev,
      startingXI: prev.startingXI.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
      substitutes: prev.substitutes.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    }));
  };

  // --- Live Update Single Player from Namer / Quick Editor ---
  const handleUpdatePlayerDirect = (updatedPlayer: Player, team?: 'home' | 'away') => {
    const targetTeam = team || activeTeam;
    const setTargetSquad = targetTeam === 'home' ? setHomeSquad : setAwaySquad;

    setTargetSquad((prev) => ({
      ...prev,
      startingXI: prev.startingXI.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
      substitutes: prev.substitutes.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    }));
  };

  // --- Batch Update Players (Auto 1-11, Number Only, Custom Names) ---
  const handleBatchUpdatePlayers = (updatedPlayers: Player[], team?: 'home' | 'away') => {
    const targetTeam = team || activeTeam;
    const setTargetSquad = targetTeam === 'home' ? setHomeSquad : setAwaySquad;

    setTargetSquad((prev) => {
      const updateMap = new Map(updatedPlayers.map((p) => [p.id, p]));
      return {
        ...prev,
        startingXI: prev.startingXI.map((p) => updateMap.get(p.id) || p),
        substitutes: prev.substitutes.map((p) => updateMap.get(p.id) || p),
      };
    });
  };

  // --- Add New Player ---
  const handleAddPlayer = (newPlayer: Player) => {
    setCurrentSquad((prev) => ({
      ...prev,
      substitutes: [newPlayer, ...prev.substitutes],
    }));
  };

  // --- Update Tactics ---
  const handleUpdateTactics = (updatedTactics: Partial<SquadData['tactics']>) => {
    setCurrentSquad((prev) => ({
      ...prev,
      tactics: { ...prev.tactics, ...updatedTactics },
    }));
  };

  // --- Update Set Piece Taker / Captain ---
  const handleUpdateSetPieceTaker = (
    playerId: string,
    role: 'captain' | 'viceCaptain' | 'penalty' | 'freeKick' | 'corner'
  ) => {
    setCurrentSquad((prev) => ({
      ...prev,
      startingXI: prev.startingXI.map((p) => {
        if (role === 'captain') {
          return { ...p, isCaptain: p.id === playerId };
        }
        if (role === 'penalty') {
          return { ...p, isPenaltyTaker: p.id === playerId };
        }
        return p;
      }),
    }));
  };

  // --- Tactical Arrows ---
  const handleAddArrow = (arrow: TacticalArrow) => {
    const isVS = matchMode === 'home_vs_away';
    if (isVS) {
      setHomeSquad((prev) => ({
        ...prev,
        vsTacticalArrows: [...(prev.vsTacticalArrows || []), arrow],
      }));
    } else if (matchMode === 'away_only' || activeTeam === 'away') {
      setAwaySquad((prev) => ({
        ...prev,
        tacticalArrows: [...(prev.tacticalArrows || []), arrow],
      }));
    } else {
      setHomeSquad((prev) => ({
        ...prev,
        tacticalArrows: [...(prev.tacticalArrows || []), arrow],
      }));
    }
  };

  const handleUpdateArrow = (updatedArrow: TacticalArrow) => {
    const isVS = matchMode === 'home_vs_away';
    if (isVS) {
      setHomeSquad((prev) => ({
        ...prev,
        vsTacticalArrows: (prev.vsTacticalArrows || []).map((a) =>
          a.id === updatedArrow.id ? updatedArrow : a
        ),
      }));
    } else if (matchMode === 'away_only' || activeTeam === 'away') {
      setAwaySquad((prev) => ({
        ...prev,
        tacticalArrows: (prev.tacticalArrows || []).map((a) =>
          a.id === updatedArrow.id ? updatedArrow : a
        ),
      }));
    } else {
      setHomeSquad((prev) => ({
        ...prev,
        tacticalArrows: (prev.tacticalArrows || []).map((a) =>
          a.id === updatedArrow.id ? updatedArrow : a
        ),
      }));
    }
  };

  const handleRemoveArrow = (id: string) => {
    const isVS = matchMode === 'home_vs_away';
    if (isVS) {
      setHomeSquad((prev) => ({
        ...prev,
        vsTacticalArrows: (prev.vsTacticalArrows || []).filter((a) => a.id !== id),
      }));
    } else if (matchMode === 'away_only' || activeTeam === 'away') {
      setAwaySquad((prev) => ({
        ...prev,
        tacticalArrows: (prev.tacticalArrows || []).filter((a) => a.id !== id),
      }));
    } else {
      setHomeSquad((prev) => ({
        ...prev,
        tacticalArrows: (prev.tacticalArrows || []).filter((a) => a.id !== id),
      }));
    }
  };

  const handleClearArrows = () => {
    const isVS = matchMode === 'home_vs_away';
    if (isVS) {
      setHomeSquad((prev) => ({ ...prev, vsTacticalArrows: [] }));
      setAwaySquad((prev) => ({ ...prev, vsTacticalArrows: [] }));
    } else if (matchMode === 'away_only' || activeTeam === 'away') {
      setAwaySquad((prev) => ({ ...prev, tacticalArrows: [] }));
    } else {
      setHomeSquad((prev) => ({ ...prev, tacticalArrows: [] }));
    }
  };

  // --- Reset Player Positions & Board for Current Mode ---
  const handleResetBoard = () => {
    const isVS = matchMode === 'home_vs_away';

    if (isVS) {
      // Reset Home Squad VS positions
      const homeFormId = homeSquad.tactics.vsFormationId || homeSquad.tactics.formationId;
      const homeFormation = getFormationById(homeFormId) || getFormationById('4-3-3-holding');
      if (homeFormation) {
        setHomeSquad((prev) => ({
          ...prev,
          startingXI: prev.startingXI.map((player, index) => {
            const pos = homeFormation.positions[index] || { x: 50, y: 50 };
            return {
              ...player,
              vsPitchX: pos.x,
              vsPitchY: pos.y,
            };
          }),
          vsTacticalArrows: [],
        }));
      }

      // Reset Away Squad VS positions
      if (awaySquad) {
        const awayFormId = awaySquad.tactics.vsFormationId || awaySquad.tactics.formationId;
        const awayFormation = getFormationById(awayFormId) || getFormationById('4-3-3-holding');
        if (awayFormation) {
          setAwaySquad((prev) => ({
            ...prev,
            startingXI: prev.startingXI.map((player, index) => {
              const pos = awayFormation.positions[index] || { x: 50, y: 50 };
              return {
                ...player,
                vsPitchX: pos.x,
                vsPitchY: pos.y,
              };
            }),
            vsTacticalArrows: [],
          }));
        }
      }
    } else {
      // Reset Single Team positions
      const targetSquad = activeTeam === 'home' ? homeSquad : awaySquad;
      const setTarget = activeTeam === 'home' ? setHomeSquad : setAwaySquad;
      const form = getFormationById(targetSquad.tactics.formationId) || getFormationById('4-3-3-holding');

      if (form) {
        setTarget((prev) => ({
          ...prev,
          startingXI: prev.startingXI.map((player, index) => {
            const pos = form.positions[index] || { x: 50, y: 50 };
            return {
              ...player,
              pitchX: pos.x,
              pitchY: pos.y,
            };
          }),
          tacticalArrows: [],
        }));
      }
    }

    setSelectedPlayerId(null);
  };

  // --- Change Match / Team Mode ---
  const handleMatchModeChange = useCallback((mode: 'home_vs_away' | 'home_only' | 'away_only') => {
    setMatchMode(mode);
    if (mode === 'home_only') {
      setActiveTeam('home');
    } else if (mode === 'away_only') {
      setActiveTeam('away');
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLight
        ? 'bg-slate-100 text-slate-900 selection:bg-emerald-500 selection:text-white'
        : 'bg-black text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
    }`}>
      {/* Landing Home Page View */}
      {currentView === 'landing' && !isFullscreen ? (
        <LandingPage
          onLaunchBoard={handleLaunchBoard}
          onOpenLegal={handleOpenLegal}
        />
      ) : isFullscreen ? (
        /* Fullscreen Board View Mode (Hides all other tools and page chrome on ALL devices) */
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-1 sm:p-2 overflow-hidden select-none animate-in fade-in duration-200 ${
          isLight ? 'bg-slate-100' : 'bg-black'
        }`}>
          {/* Quick Exit Fullscreen button floating top right for instant touch exit on phones & tablets */}
          <button
            onClick={handleToggleFullscreen}
            className={`hidden sm:flex absolute top-2 right-2 z-[10000] font-extrabold px-2.5 py-1 rounded-xl shadow-xl items-center gap-1.5 text-xs active:scale-95 transition cursor-pointer backdrop-blur-md ${
              isLight
                ? 'bg-white/95 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-lg'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/50'
            }`}
            title="Exit Fullscreen Mode (Esc)"
          >
            <Minimize2 className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-700' : 'text-emerald-400'}`} />
            <span className="font-mono text-[11px] font-black">&lt;&gt;</span>
            <span className="hidden sm:inline">Exit Fullscreen</span>
          </button>

          <div className="w-full h-full flex flex-col items-center justify-between min-h-0 overflow-hidden">
            <Pitch
              boardRef={exportPitchRef}
              squad={homeSquad}
              awaySquad={awaySquad}
              matchMode={matchMode}
              onMatchModeChange={handleMatchModeChange}
              showNames={showNames}
              tokenDisplayMode={tokenDisplayMode}
              texture={texture}
              perspective={perspective}
              lighting={lighting}
              orientation={orientation}
              selectedPlayerId={selectedPlayerId}
              onSelectPlayer={(id, team) => {
                setSelectedPlayerId(id);
                if (team) setActiveTeam(team);
              }}
              onSwapPlayers={handleSwapPlayers}
              onUpdatePlayerPosition={handleUpdatePlayerPosition}
              isDrawingMode={isDrawingMode}
              drawingType={drawingType}
              onAddArrow={handleAddArrow}
              onUpdateArrow={handleUpdateArrow}
              onRemoveArrow={handleRemoveArrow}
              onResetBoard={handleResetBoard}
              isFullscreen={true}
              onToggleFullscreen={handleToggleFullscreen}
              onToggleDrawingMode={() => setIsDrawingMode(!isDrawingMode)}
              onChangeDrawingType={setDrawingType}
              onClearArrows={handleClearArrows}
              onChangeTexture={setTexture}
              onChangePerspective={setPerspective}
              onChangeLighting={setLighting}
              onChangeOrientation={setOrientation}
              onToggleShowNames={() => setShowNames(!showNames)}
              onOpenPlayerNamer={() => setIsPlayerNamerOpen(true)}
              onExportImage={() => setIsExportModalOpen(true)}
              onOpenKitModal={() => setIsKitModalOpen(true)}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Top Controls Header */}
          <Header
            squad={homeSquad}
            homeSquad={homeSquad}
            awaySquad={awaySquad}
            matchMode={matchMode}
            onChangeMatchMode={handleMatchModeChange}
            showNames={showNames}
            onToggleShowNames={() => setShowNames(!showNames)}
            onOpenPlayerNamer={() => setIsPlayerNamerOpen(true)}
            tokenDisplayMode={tokenDisplayMode}
            texture={texture}
            onChangeTexture={setTexture}
            perspective={perspective}
            onChangePerspective={setPerspective}
            lighting={lighting}
            onChangeLighting={setLighting}
            orientation={orientation}
            onChangeOrientation={setOrientation}
            isDrawingMode={isDrawingMode}
            onToggleDrawingMode={() => setIsDrawingMode(!isDrawingMode)}
            drawingType={drawingType}
            onChangeDrawingType={setDrawingType}
            onClearArrows={handleClearArrows}
            onExportImage={() => setIsExportModalOpen(true)}
            onOpenKitModal={() => setIsKitModalOpen(true)}
            onResetBoard={handleResetBoard}
            onNavigateHome={() => setCurrentView('landing')}
          />

          {/* Main Pitch & Tactical Board Area */}
          <main className="flex-1 w-full max-w-[1700px] mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-5 flex flex-col gap-4 relative isolate z-10">
            
            {/* Mobile View Selector Bar (visible on screens under lg breakpoint) */}
            <div className={`lg:hidden w-full flex items-center justify-between p-1.5 rounded-2xl border text-xs shadow-lg backdrop-blur-md ${
              isLight
                ? 'bg-white/95 border-slate-200 text-slate-800'
                : 'bg-[#0a0a0a]/95 border-neutral-800 text-slate-100'
            }`}>
              <button
                onClick={() => setMobileView('pitch')}
                className={`flex-1 py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  mobileView === 'pitch'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Pitch &amp; Studio</span>
              </button>

              <button
                onClick={() => setMobileView('tactics')}
                className={`flex-1 py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  mobileView === 'tactics'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Tactics</span>
              </button>

              <button
                onClick={() => setMobileView('all')}
                className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1 ${
                  mobileView === 'all'
                    ? isLight
                      ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-sm'
                      : 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-md'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="View All Sections"
              >
                <Maximize2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">All</span>
              </button>
            </div>

            {/* Layout Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Tactics Sidebar Column */}
              <div
                className={`lg:col-span-4 xl:col-span-3 flex flex-col gap-4 ${
                  mobileView === 'tactics' || mobileView === 'all' ? 'block' : 'hidden lg:block'
                }`}
              >
                <TacticsSidebar
                  squad={currentSquad}
                  activeTeam={activeTeam}
                  onSelectTeam={setActiveTeam}
                  matchMode={matchMode}
                  homeSquad={homeSquad}
                  awaySquad={awaySquad}
                  onUpdateFormation={handleUpdateFormation}
                  onUpdateTactics={handleUpdateTactics}
                  onUpdateSetPieceTaker={handleUpdateSetPieceTaker}
                  onSelectPlayer={setSelectedPlayerId}
                  selectedPlayerId={selectedPlayerId}
                  onOpenPlayerEdit={setEditingPlayer}
                />
              </div>

              {/* Center Pitch & Keyframes Studio Column */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col items-center gap-6 w-full">
                
                {/* Pitch Board & Keyframes Studio */}
                <div
                  className={`w-full ${
                    mobileView === 'pitch' || mobileView === 'all' ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <div className="w-full">
                    <Pitch
                      boardRef={exportPitchRef}
                      squad={homeSquad}
                      awaySquad={awaySquad}
                      matchMode={matchMode}
                      onMatchModeChange={handleMatchModeChange}
                      showNames={showNames}
                      tokenDisplayMode={tokenDisplayMode}
                      texture={texture}
                      perspective={perspective}
                      lighting={lighting}
                      orientation={orientation}
                      selectedPlayerId={selectedPlayerId}
                      onSelectPlayer={(id, team) => {
                        setSelectedPlayerId(id);
                        if (team) setActiveTeam(team);
                      }}
                      onSwapPlayers={handleSwapPlayers}
                      onUpdatePlayerPosition={handleUpdatePlayerPosition}
                      isDrawingMode={isDrawingMode}
                      drawingType={drawingType}
                      onAddArrow={handleAddArrow}
                      onUpdateArrow={handleUpdateArrow}
                      onRemoveArrow={handleRemoveArrow}
                      onResetBoard={handleResetBoard}
                      isFullscreen={false}
                      onToggleFullscreen={handleToggleFullscreen}
                      onToggleDrawingMode={() => setIsDrawingMode(!isDrawingMode)}
                      onChangeDrawingType={setDrawingType}
                      onClearArrows={handleClearArrows}
                      onChangeTexture={setTexture}
                      onChangePerspective={setPerspective}
                      onChangeLighting={setLighting}
                      onChangeOrientation={setOrientation}
                      onToggleShowNames={() => setShowNames(!showNames)}
                      onOpenPlayerNamer={() => setIsPlayerNamerOpen(true)}
                      onExportImage={() => setIsExportModalOpen(true)}
                      onOpenKitModal={() => setIsKitModalOpen(true)}
                    />
                  </div>
                </div>

              </div>

            </div>

          </main>
        </>
      )}

      {/* Motion Graphic Screen Transition */}
      <TransitionGraphic
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
        targetPresetName={transitionTargetName}
      />

      {/* Policy & Legal Documentation Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Modals */}
      <PlayerEditModal
        player={editingPlayer}
        onClose={() => setEditingPlayer(null)}
        onSave={handleSavePlayer}
      />

      <KitCustomizerModal
        kit={currentSquad.kit}
        isOpen={isKitModalOpen}
        onClose={() => setIsKitModalOpen(false)}
        onSave={(newKit) => setCurrentSquad((prev) => ({ ...prev, kit: newKit }))}
      />

      <PitchExportModal
        squad={currentSquad}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        pitchRef={exportPitchRef}
      />

      <PlayerNamerModal
        isOpen={isPlayerNamerOpen}
        onClose={() => setIsPlayerNamerOpen(false)}
        homeSquad={homeSquad}
        awaySquad={awaySquad}
        matchMode={matchMode}
        activeTeam={activeTeam}
        onSelectTeam={setActiveTeam}
        onUpdatePlayer={handleUpdatePlayerDirect}
        onBatchUpdatePlayers={handleBatchUpdatePlayers}
        showNames={showNames}
        onToggleShowNames={() => setShowNames(!showNames)}
        tokenDisplayMode={tokenDisplayMode}
        onChangeTokenDisplayMode={setTokenDisplayMode}
      />
    </div>
  );
}
