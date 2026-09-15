import React, { useState, useRef } from 'react';
import { Player, PositionRole } from '../types';
import { X, Save, Shield, Award, Sparkles, Upload, Image, Trash2, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PlayerEditModalProps {
  player: Player | null;
  onClose: () => void;
  onSave: (updatedPlayer: Player) => void;
}

export const PlayerEditModal: React.FC<PlayerEditModalProps> = ({
  player,
  onClose,
  onSave,
}) => {
  if (!player) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState<Player>({ ...player });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({ ...prev, avatarUrl: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const positions: PositionRole[] = [
    'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
    'CDM', 'CM', 'CAM', 'LM', 'RM',
    'LW', 'RW', 'ST', 'CF'
  ];

  const inputClass = isLight
    ? 'w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500'
    : 'w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500';

  const cardSectionClass = isLight
    ? 'bg-slate-50 p-3 rounded-xl border border-slate-200'
    : 'bg-slate-950/80 p-3 rounded-xl border border-slate-800';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-2xl w-full max-w-md p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition cursor-pointer ${
            isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 mb-4 ${
          isLight ? 'text-emerald-700' : 'text-emerald-400'
        }`}>
          <Sparkles className="w-5 h-5" />
          Edit Player Profile
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          {/* Player Photo Upload Section */}
          <div className={cardSectionClass}>
            <label className={`block font-bold mb-2 flex items-center justify-between ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              <span className="flex items-center gap-1.5">
                <Image className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                Player Photo / Avatar
              </span>
              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarUrl: undefined })}
                  className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              )}
            </label>

            <div className="flex items-center gap-3">
              {/* Photo Preview Thumbnail */}
              <div className={`w-14 h-14 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0 shadow-inner relative ${
                isLight ? 'border-emerald-400 bg-slate-100' : 'border-emerald-500/50 bg-slate-900'
              }`}>
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name || 'Player'}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <User className={`w-7 h-7 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
                )}
              </div>

              {/* Upload Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 border border-dashed rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                  isDraggingOver
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : isLight
                    ? 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <Upload className={`w-4 h-4 mb-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <span className={`text-[11px] font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  Click or drag photo here
                </span>
                <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Supports PNG, JPG, WebP
                </span>
              </div>
            </div>
          </div>

          {/* Full Name & Short Display Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pitch Name</label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Number, Position, Rating */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Shirt #</label>
              <input
                type="number"
                value={formData.number}
                min={1}
                max={99}
                onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) })}
                className={`${inputClass} text-center font-bold`}
              />
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Position</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as PositionRole })}
                className={`${inputClass} font-bold`}
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Rating OVR</label>
              <input
                type="number"
                value={formData.rating}
                min={50}
                max={99}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className={`${inputClass} font-extrabold text-center ${isLight ? 'text-amber-700' : 'text-amber-400'}`}
              />
            </div>
          </div>

          {/* Nationality Flag */}
          <div>
            <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Flag / Nationality</label>
            <input
              type="text"
              value={formData.flag || ''}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              placeholder="Flag Emoji (e.g. 🇧🇷, 🇫🇷, 🇪🇸)"
              className={inputClass}
            />
          </div>

          {/* Special Role Badges */}
          <div className={`${cardSectionClass} flex flex-col gap-2 mt-1`}>
            <span className={`font-bold uppercase tracking-wider text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Special Roles</span>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 cursor-pointer ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={!!formData.isCaptain}
                  onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                  className="rounded border-slate-400 bg-slate-100 text-amber-500 focus:ring-0"
                />
                Team Captain (C)
              </label>

              <label className={`flex items-center gap-2 cursor-pointer ${isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}`}>
                <input
                  type="checkbox"
                  checked={!!formData.isPenaltyTaker}
                  onChange={(e) => setFormData({ ...formData, isPenaltyTaker: e.target.checked })}
                  className="rounded border-slate-400 bg-slate-100 text-rose-500 focus:ring-0"
                />
                Penalty Taker (PK)
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Player Profile
          </button>
        </form>
      </div>
    </div>
  );
};
