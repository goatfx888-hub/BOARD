import React from 'react';
import { Player, SquadData, PositionRole } from '../types';
import {
  X,
  Hash,
  Type,
  Sparkles,
  Check,
  Shield,
  Zap,
  Users,
  Eye,
  EyeOff,
  CircleDot,
  RotateCcw,
  SlidersHorizontal,
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
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
  'CDM', 'CM', 'CAM', 'LM', 'RM',
  'LW', 'RW', 'ST', 'CF'
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
  if (!isOpen) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const currentSquad = activeTeam === 'home' ? homeSquad : (awaySquad || homeSquad);
  const currentKit = currentSquad.kit;

  // Quick auto-number 1 to 11
  const handleAutoNumber1to11 = () => {
    const updatedXI = currentSquad.startingXI.map((p, idx) => ({
      ...p,
      number: idx + 1,
    }));
    onBatchUpdatePlayers(updatedXI, activeTeam);
  };

  // Quick numbers only (clear custom names so board displays pure jersey numbers)
  const handleSetNumbersOnly = () => {
    const updatedXI = currentSquad.startingXI.map((p, idx) => ({
      ...p,
      number: p.number || idx + 1,
      shortName: `#${p.number || idx + 1}`,
      name: `Player ${p.number || idx + 1}`,
    }));
    onBatchUpdatePlayers(updatedXI, activeTeam);
  };

  const modalBg = isLight
    ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
    : 'bg-slate-900 border-slate-800 text-white shadow-2xl';

  const subHeaderBg = isLight
    ? 'bg-slate-100 border-slate-200 text-slate-900'
    : 'bg-slate-950/80 border-slate-800/80 text-white';

  const toolbarBg = isLight
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-900/90 border-slate-800/80';

  const itemCardBg = isLight
    ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300'
    : 'bg-slate-950/80 hover:bg-slate-950 border-slate-800/90 hover:border-slate-700';

  const inputBg = isLight
    ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
    : 'bg-slate-900 border-slate-800 text-white focus:border-emerald-500';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className={`border rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto ${modalBg}`}>
        
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${subHeaderBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Hash className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Player Names &amp; Numbers
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  Live Board Sync
                </span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Rename players or customize shirt numbers. Updates appear instantly on the tactical pitch.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls Bar */}
        <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs ${toolbarBg}`}>
          
          {/* Team Switcher (if in VS mode) */}
          {matchMode === 'home_vs_away' && awaySquad ? (
            <div className={`flex items-center p-1 rounded-xl border shadow-inner ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => onSelectTeam('home')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTeam === 'home'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full border border-white/40"
                  style={{ backgroundColor: homeSquad.kit.primaryColor }}
                />
                <span>{homeSquad.name || 'Home Team'}</span>
              </button>
              <button
                onClick={() => onSelectTeam('away')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTeam === 'away'
                    ? 'bg-rose-500 text-white shadow'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full border border-white/40"
                  style={{ backgroundColor: awaySquad.kit.primaryColor }}
                />
                <span>{awaySquad.name || 'Away Team'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white/40"
                style={{ backgroundColor: currentKit.primaryColor }}
              />
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{currentSquad.name}</span>
            </div>
          )}

          {/* Board Display Mode Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Token Display Mode: Numbers vs Roles */}
            <div className={`flex items-center p-0.5 rounded-xl border ${
              isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => onChangeTokenDisplayMode('number')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] cursor-pointer ${
                  tokenDisplayMode === 'number'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Display Jersey Numbers inside player tokens"
              >
                <Hash className="w-3 h-3" />
                <span># Numbers</span>
              </button>

              <button
                onClick={() => onChangeTokenDisplayMode('position')}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] cursor-pointer ${
                  tokenDisplayMode === 'position'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Display Position Roles inside player tokens (GK, CB, ST)"
              >
                <CircleDot className="w-3 h-3" />
                <span>Positions</span>
              </button>
            </div>

            {/* Show/Hide Name Tags Below Tokens */}
            <button
              onClick={onToggleShowNames}
              className={`px-3 py-1 rounded-xl font-bold border transition flex items-center gap-1.5 text-[11px] shadow-sm cursor-pointer ${
                showNames
                  ? isLight
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle player name banners on the pitch board"
            >
              {showNames ? (
                <>
                  <Type className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                  <span>Name Tags: ON</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Name Tags: OFF</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Quick Batch Actions Bar */}
        <div className={`px-5 py-2 border-b flex items-center justify-between gap-2 text-xs ${
          isLight ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/40 border-slate-800/60'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Starting XI Lineup ({currentSquad.startingXI.length} Players)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoNumber1to11}
              className={`px-2.5 py-1 rounded-lg border transition text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700/60'
              }`}
              title="Auto-number starting lineup 1 to 11 sequentially"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Auto 1-11</span>
            </button>

            <button
              onClick={handleSetNumbersOnly}
              className={`px-2.5 py-1 rounded-lg border transition text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700/60'
              }`}
              title="Set simple player labels to #1, #2, #3"
            >
              <Hash className={`w-3 h-3 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
              <span># Numbered Only</span>
            </button>
          </div>
        </div>

        {/* Player List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {currentSquad.startingXI.map((player, idx) => {
            const isGK = player.position === 'GK';
            const shirtColor = isGK ? currentKit.gkPrimaryColor : currentKit.primaryColor;

            return (
              <div
                key={player.id}
                className={`border rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition shadow-sm group ${itemCardBg}`}
              >
                {/* Left: Token Preview & Position */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Jersey Token Miniature */}
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white/80 shadow-md flex items-center justify-center font-black text-xs shrink-0 drop-shadow"
                    style={{
                      backgroundColor: shirtColor,
                      color: currentKit.numberColor || '#ffffff',
                    }}
                  >
                    {tokenDisplayMode === 'position' ? player.position : (player.number || idx + 1)}
                  </div>

                  {/* Position Dropdown Selector */}
                  <div className="flex flex-col">
                    <label className={`text-[9px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Role</label>
                    <select
                      value={player.position}
                      onChange={(e) => {
                        onUpdatePlayer(
                          { ...player, position: e.target.value as PositionRole },
                          activeTeam
                        );
                      }}
                      className={`border rounded-lg px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none ${
                        isLight ? 'bg-white border-slate-300 text-emerald-800' : 'bg-slate-900 border-slate-800 text-emerald-400'
                      }`}
                    >
                      {ALL_POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Middle: Shirt Number & Names Inputs */}
                <div className="flex-1 grid grid-cols-12 gap-2 text-xs">
                  
                  {/* Shirt # */}
                  <div className="col-span-3 sm:col-span-2">
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Shirt #
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={player.number ?? idx + 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdatePlayer(
                          { ...player, number: isNaN(val) ? 0 : val },
                          activeTeam
                        );
                      }}
                      className={`w-full rounded-xl py-1.5 px-2 text-center font-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none border ${inputBg}`}
                    />
                  </div>

                  {/* Pitch Name (Displayed on the board banner) */}
                  <div className="col-span-5 sm:col-span-5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Pitch Name (On Board)
                    </label>
                    <input
                      type="text"
                      value={player.shortName || ''}
                      placeholder={player.name || `Player ${player.number || idx + 1}`}
                      onChange={(e) => {
                        onUpdatePlayer(
                          { ...player, shortName: e.target.value },
                          activeTeam
                        );
                      }}
                      className={`w-full rounded-xl py-1.5 px-2.5 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none border ${inputBg}`}
                    />
                  </div>

                  {/* Full Name */}
                  <div className="col-span-4 sm:col-span-5">
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={player.name || ''}
                      placeholder={`Player ${player.number || idx + 1}`}
                      onChange={(e) => {
                        onUpdatePlayer(
                          { ...player, name: e.target.value },
                          activeTeam
                        );
                      }}
                      className={`w-full rounded-xl py-1.5 px-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none border ${
                        isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300 focus:text-white'
                      }`}
                    />
                  </div>

                </div>

                {/* Right: Quick Captain / PK Badges */}
                <div className="flex items-center gap-1 shrink-0 pt-1 sm:pt-0">
                  <button
                    onClick={() => {
                      onUpdatePlayer(
                        { ...player, isCaptain: !player.isCaptain },
                        activeTeam
                      );
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
                      player.isCaptain
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : isLight
                        ? 'bg-white text-slate-500 border-slate-300 hover:text-slate-900'
                        : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                    title="Set as Captain (C)"
                  >
                    (C)
                  </button>

                  <button
                    onClick={() => {
                      onUpdatePlayer(
                        { ...player, isPenaltyTaker: !player.isPenaltyTaker },
                        activeTeam
                      );
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black border transition cursor-pointer ${
                      player.isPenaltyTaker
                        ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                        : isLight
                        ? 'bg-white text-slate-500 border-slate-300 hover:text-slate-900'
                        : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                    title="Set as Penalty Taker (PK)"
                  >
                    PK
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between shrink-0 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800/80'
        }`}>
          <div className={`flex items-center gap-1.5 text-xs font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <Check className={`w-4 h-4 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
            <span>Changes update the board in real-time</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
