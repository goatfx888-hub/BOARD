import React, { useState } from 'react';
import { Player, SquadData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Users, Plus, Edit2, ArrowRightLeft, Search, UserPlus } from 'lucide-react';

interface SquadBenchProps {
  squad: SquadData;
  activeTeam?: 'home' | 'away';
  onSelectTeam?: (team: 'home' | 'away') => void;
  matchMode?: 'home_vs_away' | 'home_only' | 'away_only';
  homeSquad?: SquadData;
  awaySquad?: SquadData;
  selectedPlayerId: string | null;
  onSelectPlayer: (playerId: string) => void;
  onSwapPlayers: (player1Id: string, player2Id: string) => void;
  onOpenPlayerEdit: (player: Player) => void;
  onAddPlayer: (player: Player) => void;
}

export const SquadBench: React.FC<SquadBenchProps> = ({
  squad,
  activeTeam,
  onSelectTeam,
  matchMode = 'home_vs_away',
  homeSquad,
  awaySquad,
  selectedPlayerId,
  onSelectPlayer,
  onSwapPlayers,
  onOpenPlayerEdit,
  onAddPlayer,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  // New Player Form state
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState(12);
  const [newPos, setNewPos] = useState<Player['position']>('CM');
  const [newRating, setNewRating] = useState(82);
  const [newFlag, setNewFlag] = useState('⚽');

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newP: Player = {
      id: `custom-${Date.now()}`,
      name: newName,
      shortName: newName.split(' ').pop() || newName,
      number: Number(newNumber),
      position: newPos,
      rating: Number(newRating),
      flag: newFlag,
      isBench: true,
    };

    onAddPlayer(newP);
    setNewName('');
    setIsAddingPlayer(false);
  };

  const filteredSubs = squad.substitutes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerBg = isLight
    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/80'
    : 'bg-slate-900/80 border-slate-800 text-white shadow-xl';

  const teamSelectorBg = isLight
    ? 'bg-slate-100 border-slate-200'
    : 'bg-slate-950/80 border-slate-800';

  const inputBg = isLight
    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
    : 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500 focus:ring-emerald-500';

  const cardBg = isLight
    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white';

  const formBg = isLight
    ? 'bg-slate-50 border-emerald-500/40 text-slate-900'
    : 'bg-slate-950/90 border-emerald-500/40 text-white';

  const formInputBg = isLight
    ? 'bg-white border-slate-300 text-slate-900'
    : 'bg-slate-800 border-slate-700 text-white';

  return (
    <div className={`w-full backdrop-blur-md rounded-2xl border p-4 flex flex-col gap-3 ${containerBg}`}>
      {/* Active Team Bench Selector */}
      {onSelectTeam && (
        <div className={`flex items-center p-1 rounded-xl border gap-1 ${teamSelectorBg}`}>
          <button
            onClick={() => onSelectTeam('home')}
            disabled={matchMode === 'away_only'}
            className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTeam === 'home'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            } ${matchMode === 'away_only' ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 border border-slate-900" />
            <span>Home Bench</span>
            {homeSquad && <span className="text-[10px] opacity-80">({homeSquad.substitutes.length})</span>}
          </button>

          <button
            onClick={() => onSelectTeam('away')}
            disabled={matchMode === 'home_only'}
            className={`flex-1 py-1.5 px-3 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTeam === 'away'
                ? 'bg-rose-500 text-white shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
            } ${matchMode === 'home_only' ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 border border-slate-900" />
            <span>Away Bench</span>
            {awaySquad && <span className="text-[10px] opacity-80">({awaySquad.substitutes.length})</span>}
          </button>
        </div>
      )}

      {/* Bench Header & Search */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <h3 className={`font-bold text-sm tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Substitutes & Reserve Pool
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isLight
              ? 'bg-slate-100 text-slate-700 border-slate-300'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            {squad.substitutes.length}
          </span>
        </div>

        <button
          onClick={() => setIsAddingPlayer(!isAddingPlayer)}
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
            isLight
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border-emerald-800/60'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Player
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
        <input
          type="text"
          placeholder="Filter substitutes by name or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs transition border focus:outline-none ${inputBg}`}
        />
      </div>

      {/* Add New Player Collapsible Form */}
      {isAddingPlayer && (
        <form onSubmit={handleCreatePlayer} className={`p-3 rounded-xl border flex flex-col gap-2 ${formBg}`}>
          <div className={`text-xs font-bold flex items-center justify-between ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
            <span>Create Custom Player</span>
            <button type="button" onClick={() => setIsAddingPlayer(false)} className={`text-[10px] cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Player Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className={`border rounded p-1.5 text-xs focus:outline-none ${formInputBg}`}
            />
            <input
              type="number"
              placeholder="Shirt Number"
              value={newNumber}
              onChange={(e) => setNewNumber(Number(e.target.value))}
              min={1}
              max={99}
              className={`border rounded p-1.5 text-xs focus:outline-none ${formInputBg}`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={newPos}
              onChange={(e) => setNewPos(e.target.value as Player['position'])}
              className={`border rounded p-1.5 text-xs focus:outline-none ${formInputBg}`}
            >
              {['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Rating"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              min={50}
              max={99}
              className={`border rounded p-1.5 text-xs focus:outline-none ${formInputBg}`}
            />

            <input
              type="text"
              placeholder="Flag Emoji (e.g. 🇧🇷)"
              value={newFlag}
              onChange={(e) => setNewFlag(e.target.value)}
              className={`border rounded p-1.5 text-xs focus:outline-none text-center ${formInputBg}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-xs py-1.5 rounded-lg text-white transition mt-1 cursor-pointer"
          >
            Save Player to Bench
          </button>
        </form>
      )}

      {/* Substitutes Grid / Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
        {filteredSubs.map((player) => {
          const isSelected = selectedPlayerId === player.id;

          return (
            <div
              key={player.id}
              onClick={() => {
                if (selectedPlayerId) {
                  onSwapPlayers(selectedPlayerId, player.id);
                  onSelectPlayer('');
                } else {
                  onSelectPlayer(player.id);
                }
              }}
              className={`group relative p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                isSelected
                  ? isLight
                    ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                    : 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50'
                  : cardBg
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isLight
                    ? 'bg-slate-200/80 text-emerald-800 border-slate-300'
                    : 'bg-slate-800 text-emerald-400 border-slate-700'
                }`}>
                  {player.position}
                </span>
              </div>

              <div className="my-1">
                <div className={`text-xs font-bold truncate flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>{player.flag}</span>
                  <span className="truncate">{player.shortName}</span>
                </div>
              </div>

              <div className={`flex items-center justify-between text-[10px] border-t pt-1 ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
              }`}>
                <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{player.rating} OVR</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPlayerEdit(player);
                  }}
                  className={`p-0.5 cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
                  title="Edit Player Details"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
