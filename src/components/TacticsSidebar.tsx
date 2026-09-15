import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SquadData, Player, Formation } from '../types';
import { FORMATIONS, getFormationById } from '../data/formations';
import { FormationPitchMini } from './FormationPitchMini';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Search,
  SlidersHorizontal,
  Notebook,
  LayoutGrid,
  Sparkles,
  Check,
  Plus,
  Compass,
  Layers,
} from 'lucide-react';

interface TacticsSidebarProps {
  squad: SquadData;
  activeTeam?: 'home' | 'away';
  onSelectTeam?: (team: 'home' | 'away') => void;
  matchMode?: 'home_vs_away' | 'home_only' | 'away_only';
  homeSquad?: SquadData;
  awaySquad?: SquadData;
  onUpdateFormation: (formationId: string) => void;
  onUpdateTactics: (updatedTactics: Partial<SquadData['tactics']>) => void;
  onUpdateSetPieceTaker: (
    playerId: string,
    role: 'captain' | 'viceCaptain' | 'penalty' | 'freeKick' | 'corner'
  ) => void;
  onSelectPlayer: (playerId: string) => void;
  selectedPlayerId: string | null;
  onOpenPlayerEdit: (player: Player) => void;
}

const TacticsSidebarComponent: React.FC<TacticsSidebarProps> = ({
  squad,
  activeTeam = 'home',
  onSelectTeam,
  matchMode = 'home_only',
  homeSquad,
  awaySquad,
  onUpdateFormation,
  onUpdateTactics,
  onUpdateSetPieceTaker,
  onSelectPlayer,
  selectedPlayerId,
  onOpenPlayerEdit,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'formations' | 'notes'>('formations');
  const [categoryFilter, setCategoryFilter] = useState<'All' | '4-Back' | '3-Back' | '5-Back'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [justTouchedId, setJustTouchedId] = useState<string | null>(null);
  const [showLineDetails, setShowLineDetails] = useState(false);

  const activeFormationId =
    (matchMode === 'home_vs_away' ? squad.tactics?.vsFormationId : squad.tactics?.formationId) ||
    squad.tactics?.formationId ||
    '4-3-3-holding';
  const currentFormation = getFormationById(activeFormationId);

  // Calculate defenders, midfielders, attackers count dynamically
  const getFormationCounts = (formation?: Formation) => {
    if (!formation || !Array.isArray(formation.positions)) {
      return { gk: 1, def: 4, mid: 3, att: 3 };
    }
    const gk = formation.positions.filter((p) => p.role === 'GK').length;
    const def = formation.positions.filter((p) =>
      ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.role)
    ).length;
    const mid = formation.positions.filter((p) =>
      ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.role)
    ).length;
    const att = formation.positions.filter((p) =>
      ['ST', 'CF', 'LW', 'RW'].includes(p.role)
    ).length;
    return { gk, def, mid, att };
  };

  const currentCounts = useMemo(() => getFormationCounts(currentFormation), [currentFormation]);

  // Group current formation positions into tactical lines
  const currentLines = useMemo(() => {
    if (!currentFormation || !Array.isArray(currentFormation.positions)) {
      return { def: [], mid: [], att: [] };
    }
    const def = currentFormation.positions.filter((p) =>
      ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.role)
    );
    const mid = currentFormation.positions.filter((p) =>
      ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.role)
    );
    const att = currentFormation.positions.filter((p) =>
      ['ST', 'CF', 'LW', 'RW'].includes(p.role)
    );
    return { def, mid, att };
  }, [currentFormation]);

  // Quick preset formations
  const quickPresets = [
    { id: '4-3-3-holding', label: '4-3-3' },
    { id: '4-2-3-1-wide', label: '4-2-3-1' },
    { id: '4-4-2-flat', label: '4-4-2' },
    { id: '3-4-3', label: '3-4-3' },
    { id: '3-5-2', label: '3-5-2' },
    { id: '5-3-2', label: '5-3-2' },
  ];

  // Filtered formations
  const filteredFormations = useMemo(() => {
    return FORMATIONS.filter((f) => {
      // Category match
      const matchCategory =
        categoryFilter === 'All' ||
        (categoryFilter === '4-Back' && f.category === '4-Back') ||
        (categoryFilter === '3-Back' && f.category === '3-Back') ||
        (categoryFilter === '5-Back' && f.category === '5-Back');

      // Search match
      const matchSearch =
        searchQuery === '' ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.bestFor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.lineStructure?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [categoryFilter, searchQuery]);

  const handleSelectFormationWithMotion = (formationId: string) => {
    setJustTouchedId(formationId);
    onUpdateFormation(formationId);
    setTimeout(() => {
      setJustTouchedId(null);
    }, 600);
  };

  const tacticalNotesTemplates = [
    'High pressing triggers when opposing center-backs turn backwards',
    'Overload left half-space during sustained build-up phase',
    'Drop full-backs into deep rest defense',
    'Exploit space behind opponent backline',
    'Maintain compact midfield diamond',
  ];

  const handleAddNoteTemplate = (text: string) => {
    const currentNotes = squad.tactics.notes ? squad.tactics.notes.trim() + '\n• ' + text : '• ' + text;
    onUpdateTactics({ notes: currentNotes });
  };

  // Styling helper classes for light/dark
  const containerBg = isLight ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/80' : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-xl';
  const subCardBg = isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/90 border-slate-800 text-slate-100';
  const nestedBoxBg = isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900 border-slate-800';
  const inputBg = isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500' : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-emerald-500/60';
  const textMuted = isLight ? 'text-slate-500' : 'text-slate-400';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const tabInactive = isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200';
  const tabActive = isLight ? 'bg-white text-emerald-700 font-black shadow-sm border border-slate-200' : 'bg-slate-800 text-emerald-400 font-black shadow-sm';
  const tabContainerBg = isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800/80';
  const borderDivider = isLight ? 'border-slate-200' : 'border-slate-800/80';

  return (
    <div className={`w-full flex flex-col backdrop-blur-xl rounded-2xl border ${containerBg} overflow-hidden`}>
      
      {/* Header Bar */}
      <div className={`p-4 pb-3 border-b ${borderDivider} flex flex-col gap-3`}>
        
        {/* Title & Active Team Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-sm font-black tracking-tight ${headingColor}`}>Tactical Center</h2>
              <p className={`text-[11px] font-medium ${textMuted}`}>
                {matchMode === 'home_vs_away' ? (activeTeam === 'home' ? 'Home Squad Setup' : 'Away Squad Setup') : 'Squad Tactics & Formation'}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
            isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-950 border-slate-800 text-emerald-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentFormation.name.split(' ')[0]}</span>
          </div>
        </div>

        {/* Match Mode Team Switcher */}
        {onSelectTeam && matchMode === 'home_vs_away' && (
          <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${tabContainerBg}`}>
            <button
              onClick={() => onSelectTeam('home')}
              className={`py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTeam === 'home'
                  ? 'bg-emerald-500 text-slate-950 shadow font-black'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
              <span className="truncate">{homeSquad?.name || 'Home Team'}</span>
            </button>
            <button
              onClick={() => onSelectTeam('away')}
              className={`py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTeam === 'away'
                  ? 'bg-rose-500 text-white shadow font-black'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 border border-slate-900" />
              <span className="truncate">{awaySquad?.name || 'Away Team'}</span>
            </button>
          </div>
        )}

        {/* Primary Tab Navigation (Spacious 2-Tab Layout) */}
        <div className={`grid grid-cols-2 p-1 rounded-xl border text-xs font-bold ${tabContainerBg}`}>
          <button
            onClick={() => setActiveTab('formations')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'formations' ? tabActive : tabInactive
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Formations</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notes' ? tabActive : tabInactive
            }`}
          >
            <Notebook className="w-4 h-4" />
            <span>Tactical Notes</span>
          </button>
        </div>

      </div>

      {/* Main Tab Content Area */}
      <div className="p-4 flex flex-col gap-4">

        {/* ========================================================================= */}
        {/* TAB 1: FORMATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'formations' && (
          <div className="flex flex-col gap-3.5">
            
            {/* Quick Presets Ribbon */}
            <div className="flex flex-col gap-1.5">
              <div className={`flex items-center justify-between text-[11px] font-bold ${textMuted}`}>
                <span>Quick Presets</span>
                <span className="text-[10px] opacity-75 font-normal">Click to apply instantly</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {quickPresets.map((preset) => {
                  const isCurrent = activeFormationId === preset.id;
                  const isJustTouched = justTouchedId === preset.id;
                  return (
                    <motion.button
                      key={preset.id}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectFormationWithMotion(preset.id)}
                      className={`relative py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-1 ring-emerald-400'
                          : isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {isJustTouched && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 1 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 rounded-lg bg-emerald-400/40 pointer-events-none"
                        />
                      )}
                      <span>{preset.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Active Formation Banner & Organized Positions Map */}
            <div className={`p-3 rounded-xl border flex flex-col gap-2.5 shadow-sm ${subCardBg}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-bold ${textMuted}`}>Active System</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                      {currentFormation.lineStructure || currentFormation.category}
                    </span>
                  </div>
                  <span className={`text-sm font-black ${headingColor}`}>{currentFormation.name}</span>
                  <span className={`text-[11px] font-medium ${textMuted}`}>{currentFormation.bestFor}</span>
                </div>

                {/* Line Breakdown Pills */}
                <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1.5 rounded-lg border shrink-0 ${nestedBoxBg}`}>
                  <span className={isLight ? "text-amber-600" : "text-amber-400"} title="Goalkeeper">{currentCounts.gk}</span>
                  <span className={isLight ? "text-slate-400" : "text-slate-600"}>-</span>
                  <span className={isLight ? "text-sky-600" : "text-sky-400"} title="Defenders">{currentCounts.def}</span>
                  <span className={isLight ? "text-slate-400" : "text-slate-600"}>-</span>
                  <span className={isLight ? "text-emerald-600" : "text-emerald-400"} title="Midfielders">{currentCounts.mid}</span>
                  <span className={isLight ? "text-slate-400" : "text-slate-600"}>-</span>
                  <span className={isLight ? "text-rose-600" : "text-rose-400"} title="Attackers">{currentCounts.att}</span>
                </div>
              </div>

              {/* Organized Tactical Line-by-Line Breakdown */}
              <div className={`pt-2 border-t ${borderDivider} flex flex-col gap-1.5`}>
                <div className={`flex items-center justify-between text-[10px] font-bold ${textMuted}`}>
                  <span className="flex items-center gap-1">
                    <Layers className={`w-3 h-3 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    Organized Position Assignments
                  </span>
                  <button
                    onClick={() => setShowLineDetails(!showLineDetails)}
                    className={`text-[9.5px] font-bold hover:underline cursor-pointer ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}
                  >
                    {showLineDetails ? 'Hide Structure' : 'Show Structure'}
                  </button>
                </div>

                {showLineDetails && (
                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    {/* Defensive Unit */}
                    <div className={`p-1.5 rounded-lg border flex flex-col gap-1 ${nestedBoxBg}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>
                        Defense ({currentLines.def.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {currentLines.def.map((p, idx) => (
                          <span
                            key={idx}
                            className={`font-bold px-1.5 py-0.5 rounded text-[9.5px] border ${
                              isLight ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            }`}
                          >
                            {p.label || p.role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Midfield Unit */}
                    <div className={`p-1.5 rounded-lg border flex flex-col gap-1 ${nestedBoxBg}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        Midfield ({currentLines.mid.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {currentLines.mid.map((p, idx) => (
                          <span
                            key={idx}
                            className={`font-bold px-1.5 py-0.5 rounded text-[9.5px] border ${
                              isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {p.label || p.role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Attack Unit */}
                    <div className={`p-1.5 rounded-lg border flex flex-col gap-1 ${nestedBoxBg}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                        Attack ({currentLines.att.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {currentLines.att.map((p, idx) => (
                          <span
                            key={idx}
                            className={`font-bold px-1.5 py-0.5 rounded text-[9.5px] border ${
                              isLight ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {p.label || p.role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 pointer-events-none ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search formation, playstyle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-xl pl-9 pr-7 py-1.5 text-xs transition border focus:outline-none ${inputBg}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-2.5 top-2 text-[10px] cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Segmented Category Filter */}
              <div className={`grid grid-cols-4 p-1 rounded-xl border text-[11px] font-bold text-center ${tabContainerBg}`}>
                {(['All', '4-Back', '3-Back', '5-Back'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`py-1 rounded-lg transition-all cursor-pointer ${
                      categoryFilter === cat ? tabActive : tabInactive
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Formations Grid with Touch Motion Graphics */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredFormations.map((f) => {
                const isCurrent = activeFormationId === f.id;
                const isJustTouched = justTouchedId === f.id;
                const counts = getFormationCounts(f);

                return (
                  <motion.div
                    key={f.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectFormationWithMotion(f.id)}
                    className={`group relative flex flex-col p-2 sm:p-2.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isCurrent
                        ? isLight
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-400/60 shadow-md'
                          : 'bg-emerald-950/30 border-emerald-400 ring-1 ring-emerald-400/50 shadow-lg shadow-emerald-950/40'
                        : isLight
                        ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                        : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-1 mb-1.5 min-w-0">
                      <span
                        className={`text-[11.5px] font-black truncate leading-tight ${
                          isCurrent ? (isLight ? 'text-emerald-800' : 'text-emerald-400') : headingColor
                        }`}
                        title={f.name}
                      >
                        {f.name}
                      </span>
                      {isCurrent && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] shrink-0 font-black shadow-sm">
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Mini Pitch Graphical Representation */}
                    <div className="w-full mb-1.5 flex justify-center">
                      <FormationPitchMini
                        positions={f.positions}
                        isCurrent={isCurrent}
                        size="sm"
                        showLabels={false}
                        showLines={true}
                      />
                    </div>

                    {/* Footer Unit Counts & Style Tag */}
                    <div className="flex items-center justify-between text-[10px] pt-1.5 mt-auto border-t border-slate-200/50 dark:border-slate-800/60">
                      <div className="flex items-center gap-1 font-bold">
                        <span className={isLight ? "text-sky-700" : "text-sky-400"} title="Defenders">{counts.def}</span>
                        <span className={isLight ? "text-slate-400" : "text-slate-600"}>-</span>
                        <span className={isLight ? "text-emerald-700" : "text-emerald-400"} title="Midfielders">{counts.mid}</span>
                        <span className={isLight ? "text-slate-400" : "text-slate-600"}>-</span>
                        <span className={isLight ? "text-rose-700" : "text-rose-400"} title="Attackers">{counts.att}</span>
                      </div>
                      <span
                        className={`text-[9.5px] font-bold ${
                          f.styleTag === 'Attacking'
                            ? isLight ? 'text-amber-700' : 'text-amber-400'
                            : f.styleTag === 'Defensive'
                            ? isLight ? 'text-blue-700' : 'text-blue-400'
                            : isLight ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        {f.styleTag || f.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANAGER TACTICAL NOTES */}
        {/* ========================================================================= */}
        {activeTab === 'notes' && (
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${textMuted}`}>
                <Notebook className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                Tactical Match Brief
              </label>
              <button
                onClick={() => onUpdateTactics({ notes: '' })}
                className={`text-[11px] font-bold transition cursor-pointer ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'}`}
              >
                Clear All
              </button>
            </div>

            <textarea
              value={squad.tactics.notes}
              onChange={(e) => onUpdateTactics({ notes: e.target.value })}
              placeholder="Enter specific managerial instructions (e.g. overload right wing, press high on opposing pivot, double up on wingers)..."
              rows={7}
              className={`w-full rounded-xl p-3 text-xs leading-relaxed custom-scrollbar resize-none border focus:outline-none ${inputBg}`}
            />

            {/* Quick Instruction Chips */}
            <div className="flex flex-col gap-2">
              <span className={`text-[10px] font-bold uppercase ${textMuted}`}>Quick Tactical Directives</span>
              <div className="flex flex-wrap gap-1.5">
                {tacticalNotesTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddNoteTemplate(template)}
                    className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-700 border-slate-200'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border-slate-800'
                    }`}
                  >
                    <Plus className="w-3 h-3 text-emerald-500" />
                    <span>{template}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export const TacticsSidebar = React.memo(TacticsSidebarComponent);
