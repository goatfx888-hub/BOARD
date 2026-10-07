import React, { useState } from 'react';
import { Player, SquadData, PositionRole } from '../types';
import {
  X,
  Hash,
  Check,
  Zap,
  Eye,
  EyeOff,
  CircleDot,
  Search,
  Plus,
  Minus,
  Trash2,
  Users,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlayerNamerModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeSquad: SquadData;
  awaySquad?: SquadData;
  matchMode: 'home_vs_away' | 'home_only' | 'away_only';
  activeTeam: 'home' | 'away';
  onSelectTeam: (team: 'home' | 'away') => void;
  onUpdatePlayer: (updatedPlayer: Player, team: 'home' | 'away') => void;
  showNames: boolean;
  onToggleShowNames: () => void;
  tokenDisplayMode: 'number' | 'position';
  onChangeTokenDisplayMode: (mode: 'number' | 'position') => void;
  onBatchUpdatePlayers: (players: Player[], team: 'home' | 'away') => void;
}

const ALL_POSITIONS: PositionRole[] = [
  'GK',
  'CB',
  'LB',
  'RB',
  'LWB',
  'RWB',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RM',
  'LW',
  'RW',
  'ST',
  'CF',
];

export const PlayerNamerModal: React.FC<PlayerNamerModalProps> = ({
  isOpen,
  onClose,
  homeSquad,
  awaySquad,
  matchMode,
  activeTeam,
  onSelectTeam,
  onUpdatePlayer,
  showNames,
  onToggleShowNames,
  tokenDisplayMode,
  onChangeTokenDisplayMode,
  onBatchUpdatePlayers,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentSquad = activeTeam === 'home' ? homeSquad : awaySquad || homeSquad;
  const currentKit = currentSquad.kit;

  // Filter Starting XI players by search query
  const filteredPlayers = currentSquad.startingXI.filter((player, idx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (player.name || '').toLowerCase().includes(q);
    const shortNameMatch = (player.shortName || '').toLowerCase().includes(q);
    const posMatch = player.position.toLowerCase().includes(q);
    const numMatch = (player.number ?? idx + 1).toString().includes(q);
    return nameMatch || shortNameMatch || posMatch || numMatch;
  });

  // Smart Player Name Update (Keeps name and shortName seamlessly in sync)
  const handleNameChange = (player: Player, newText: string) => {
    const trimmed = newText.trim();
    let shortName = newText;
    if (trimmed.includes(' ')) {
      const parts = trimmed.split(' ');
      shortName = parts[parts.length - 1];
    }
    onUpdatePlayer(
      {
        ...player,
        name: newText,
        shortName: shortName || newText,
      },
      activeTeam
    );
  };

  // Adjust number with +/- stepper
  const handleNumberStep = (player: Player, delta: number) => {
    const current = player.number ?? 1;
    const next = Math.max(1, Math.min(99, current + delta));
    onUpdatePlayer({ ...player, number: next }, activeTeam);
  };

  // Quick auto-number 1 to 11
  const handleAutoNumber1to11 = () => {
    const updatedXI = currentSquad.startingXI.map((p, idx) => ({
      ...p,
      number: idx + 1,
    }));
    onBatchUpdatePlayers(updatedXI, activeTeam);
  };

  // Quick numbers only (e.g. #1, #2, #3...)
  const handleSetNumbersOnly = () => {
    const updatedXI = currentSquad.startingXI.map((p, idx) => ({
      ...p,
      number: p.number || idx + 1,
      shortName: `#${p.number || idx + 1}`,
      name: `Player ${p.number || idx + 1}`,
    }));
    onBatchUpdatePlayers(updatedXI, activeTeam);
  };

  // Clear all player names
  const handleClearAllNames = () => {
    const updatedXI = currentSquad.startingXI.map((p, idx) => ({
      ...p,
      shortName: '',
      name: '',
    }));
    onBatchUpdatePlayers(updatedXI, activeTeam);
  };

  // Handle Done & View Pitch (ensures names are enabled on pitch)
  const handleDone = () => {
    if (!showNames) {
      onToggleShowNames();
    }
    onClose();
  };

  // Position Category Color Badges
  const getPosBadgeColor = (pos: PositionRole) => {
    if (pos === 'GK') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos)) return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  };

  const modalBg = isLight
    ? 'bg-slate-50 border-slate-200 text-slate-900 shadow-2xl'
    : 'bg-[#0b0f19] border-slate-800 text-white shadow-2xl';

  const subHeaderBg = isLight
    ? 'bg-white border-slate-200 text-slate-900'
    : 'bg-[#111625] border-slate-800/80 text-white';

  const itemCardBg = isLight
    ? 'bg-white hover:border-emerald-500/50 border-slate-200 shadow-sm'
    : 'bg-[#131b2e] hover:border-emerald-500/40 border-slate-800/90 shadow-md';

  const inputBg = isLight
    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500'
    : 'bg-[#0a0f1d] border-slate-700/80 text-white placeholder-slate-500 focus:bg-[#080d1a] focus:border-emerald-400';

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div
        className={`border rounded-3xl w-full max-w-xl max-h-[94vh] flex flex-col overflow-hidden my-auto ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between shrink-0 ${subHeaderBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 shrink-0">
              <Hash className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                  Edit Player Names &amp; Numbers
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Pitch Sync
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} leading-tight mt-0.5`}>
                Type player names and they will display cleanly on the tactical pitch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer shrink-0 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TEAM & DISPLAY MODE CONTROLS */}
        {/* ========================================================================= */}
        <div className={`px-4 sm:px-6 py-2.5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 text-xs ${
          isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#0f1422] border-slate-800/80'
        }`}>
          {/* Team Switcher (VS Mode) */}
          {matchMode === 'home_vs_away' && awaySquad ? (
            <div className={`flex items-center p-1 rounded-xl border shadow-inner ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#080d1a] border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => onSelectTeam('home')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
                  activeTeam === 'home'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                <span className="truncate max-w-[110px]">{homeSquad.name || 'Home'}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectTeam('away')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
                  activeTeam === 'away'
                    ? 'bg-rose-500 text-white font-black shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-slate-900" />
                <span className="truncate max-w-[110px]">{awaySquad.name || 'Away'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-bold text-xs">
              <span
                className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                style={{ backgroundColor: currentKit.primaryColor }}
              />
              <span className="truncate">{currentSquad.name || 'Current Squad'}</span>
            </div>
          )}

          {/* Quick Display Mode Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Token Mode: Numbers vs Roles */}
            <div className={`flex items-center p-0.5 rounded-xl border ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#080d1a] border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => onChangeTokenDisplayMode('number')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] cursor-pointer ${
                  tokenDisplayMode === 'number'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hash className="w-3 h-3" />
                <span># Numbers</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeTokenDisplayMode('position')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] cursor-pointer ${
                  tokenDisplayMode === 'position'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CircleDot className="w-3 h-3" />
                <span>Roles</span>
              </button>
            </div>

            {/* Name Tags ON / OFF */}
            <button
              type="button"
              onClick={onToggleShowNames}
              className={`px-2.5 py-1 rounded-xl font-bold border transition flex items-center gap-1.5 text-[11px] shadow-sm cursor-pointer ${
                showNames
                  ? isLight
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isLight
                  ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  : 'bg-[#080d1a] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {showNames ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Names: ON</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Names: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUICK ACTIONS & SEARCH BAR */}
        {/* ========================================================================= */}
        <div className={`px-4 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-2.5 text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b101c] border-slate-800/70'
        }`}>
          {/* Action Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleAutoNumber1to11}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Number 1 to 11 in order"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto 1-11</span>
            </button>

            <button
              type="button"
              onClick={handleSetNumbersOnly}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Clear names and show #1, #2..."
            >
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span># Numbers Only</span>
            </button>

            <button
              type="button"
              onClick={handleClearAllNames}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                isLight ? 'bg-white hover:bg-rose-50 text-rose-600 border-slate-300' : 'bg-slate-800/80 hover:bg-rose-950/40 text-rose-400 border-slate-700'
              }`}
              title="Clear all names"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-[200px] sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-7 py-1.5 text-xs border focus:outline-none transition ${inputBg}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STARTING XI LINEUP (11 PLAYERS ONLY) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5 custom-scrollbar">
          {filteredPlayers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No players found matching "{searchQuery}"
            </div>
          ) : (
            filteredPlayers.map((player, idx) => {
              const isGK = player.position === 'GK';
              const shirtColor = isGK ? currentKit.gkPrimaryColor : currentKit.primaryColor;
              const numberColor = currentKit.numberColor || '#ffffff';
              const playerNumber = player.number ?? idx + 1;
              const displayName = player.shortName || player.name || '';

              return (
                <div
                  key={player.id}
                  className={`border rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2.5 transition-all duration-150 ${itemCardBg}`}
                >
                  {/* Top Bar: Token + Role + Shirt # + Badges */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: Token + Position Role + Stepper */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {/* Jersey Circle Miniature */}
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-md flex items-center justify-center font-black text-xs shrink-0"
                        style={{
                          backgroundColor: shirtColor,
                          color: numberColor,
                        }}
                      >
                        {tokenDisplayMode === 'position' ? player.position : playerNumber}
                      </div>

                      {/* Position Role Selector */}
                      <select
                        value={player.position}
                        onChange={(e) => {
                          onUpdatePlayer(
                            { ...player, position: e.target.value as PositionRole },
                            activeTeam
                          );
                        }}
                        className={`border rounded-lg px-2 py-1 text-xs font-black focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer ${getPosBadgeColor(
                          player.position
                        )} ${isLight ? 'bg-white' : 'bg-[#0a0f1d]'}`}
                      >
                        {ALL_POSITIONS.map((pos) => (
                          <option key={pos} value={pos} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                            {pos}
                          </option>
                        ))}
                      </select>

                      {/* Shirt Number with +/- Touch Stepper */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleNumberStep(player, -1)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer active:scale-95 ${
                            isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                              : 'bg-[#080d1a] hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                          title="Decrease shirt number"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={playerNumber}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onUpdatePlayer(
                                { ...player, number: isNaN(val) ? 1 : Math.max(1, Math.min(99, val)) },
                                activeTeam
                              );
                            }}
                            className={`w-11 text-center font-black text-xs sm:text-sm py-1 rounded-lg border focus:outline-none focus:border-emerald-400 ${inputBg}`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleNumberStep(player, 1)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer active:scale-95 ${
                            isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                              : 'bg-[#080d1a] hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                          title="Increase shirt number"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Quick Captain & Penalty Taker Toggles */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdatePlayer(
                            { ...player, isCaptain: !player.isCaptain },
                            activeTeam
                          );
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
                          player.isCaptain
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-black'
                            : isLight
                            ? 'bg-white text-slate-400 border-slate-300 hover:text-slate-800'
                            : 'bg-[#080d1a] text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                        title="Captain (C)"
                      >
                        (C)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onUpdatePlayer(
                            { ...player, isPenaltyTaker: !player.isPenaltyTaker },
                            activeTeam
                          );
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
                          player.isPenaltyTaker
                            ? 'bg-rose-500 text-white border-rose-400 shadow-sm font-black'
                            : isLight
                            ? 'bg-white text-slate-400 border-slate-300 hover:text-slate-800'
                            : 'bg-[#080d1a] text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                        title="Penalty Taker (PK)"
                      >
                        PK
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Big Easy Player Name Input */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={displayName}
                      placeholder={`Enter player name (e.g. Player ${playerNumber})...`}
                      onChange={(e) => handleNameChange(player, e.target.value)}
                      className={`w-full rounded-xl py-2.5 sm:py-2 pl-3.5 pr-8 font-bold text-sm sm:text-xs transition border focus:outline-none focus:ring-1 focus:ring-emerald-400 ${inputBg}`}
                    />
                    {displayName && (
                      <button
                        type="button"
                        onClick={() => handleNameChange(player, '')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                        title="Clear name"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER - DONE BUTTON */}
        {/* ========================================================================= */}
        <div className={`p-3.5 sm:p-4 border-t flex items-center justify-between gap-3 shrink-0 ${subHeaderBg}`}>
          <div className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {currentSquad.startingXI.filter((p) => p.name || p.shortName).length} of {currentSquad.startingXI.length} players named
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Done &amp; View Pitch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
