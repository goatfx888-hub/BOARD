import React, { useState, useRef } from 'react';
import { UclPlayerNode, STAR_AVATAR_PRESETS, CLUB_BADGE_PRESETS } from '../data/uclSquadData';
import {
  X,
  Upload,
  Image as ImageIcon,
  User,
  Trash2,
  Sparkles,
  Shield,
  Check,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Hash,
  ZoomIn,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface UclPlayerEditModalProps {
  player: UclPlayerNode | null;
  onClose: () => void;
  onSave: (updatedPlayer: UclPlayerNode) => void;
}

export const UclPlayerEditModal: React.FC<UclPlayerEditModalProps> = ({
  player,
  onClose,
  onSave,
}) => {
  if (!player) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState<UclPlayerNode>({ ...player });
  const [activeTab, setActiveTab] = useState<'photo' | 'info' | 'badge' | 'indicator'>('photo');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: event.target?.result as string,
          showJerseyNumber: false,
        }));
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

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: imageUrlInput.trim(),
        showJerseyNumber: false,
      }));
      setImageUrlInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const modalBg = isLight
    ? 'bg-white border-slate-200 text-slate-900 shadow-2xl'
    : 'bg-slate-900 border-slate-700/80 text-white shadow-2xl';

  const subPanelBg = isLight
    ? 'bg-slate-50 border-slate-200 text-slate-900'
    : 'bg-slate-950/60 border-slate-800 text-white';

  const inputBg = isLight
    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
    : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className={`border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${modalBg}`}>
        
        {/* Header with UCL branding */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border-slate-200' : 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-slate-700/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-black border ${
              isLight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-600/30 border-blue-400 text-blue-400'
            }`}>
              ★
            </div>
            <div>
              <h3 className={`font-black text-sm sm:text-base tracking-wide flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Customize Player Circle
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-blue-700' : 'text-blue-300/80'}`}>
                Upload custom picture, change name, position &amp; badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Token Preview Bar */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-4 ${subPanelBg}`}>
          <div className="flex items-center gap-3">
            {/* Realtime Circle Node Preview */}
            <div className="relative">
              <div className={`w-14 h-14 rounded-full border-2 shadow-[0_0_12px_rgba(59,130,246,0.5)] overflow-hidden flex items-center justify-center relative ${
                isLight ? 'border-blue-500 bg-slate-100' : 'border-blue-500 bg-slate-900'
              }`}>
                {formData.showJerseyNumber ? (
                  <div className={`w-full h-full flex items-center justify-center font-black text-lg ${
                    isLight ? 'bg-white text-slate-900' : 'bg-white text-slate-900'
                  }`}>
                    {formData.jerseyNumber || formData.number}
                  </div>
                ) : formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <User className={`w-7 h-7 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                )}
              </div>

              {/* Real Madrid / Club Crest badge preview */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-slate-950 flex items-center justify-center text-[10px] shadow">
                👑
              </div>

              {/* Indicator triangle preview */}
              {formData.showIndicatorTriangle && (
                <div
                  className="absolute -top-1 -left-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[9px]"
                  style={{ borderBottomColor: formData.indicatorColor || '#3b82f6' }}
                />
              )}
            </div>

            <div>
              <span className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded-full border shadow ${
                isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700/80'
              }`}>
                {formData.name || 'Player Name'}
              </span>
              <div className={`text-[11px] mt-1 flex items-center gap-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>#{formData.number}</span>
                <span>•</span>
                <span className={`font-semibold ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>{formData.position}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, showJerseyNumber: !prev.showJerseyNumber }))}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                formData.showJerseyNumber
                  ? isLight
                    ? 'bg-blue-100 border-blue-400 text-blue-800'
                    : 'bg-blue-600/30 border-blue-500 text-blue-300'
                  : isLight
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              {formData.showJerseyNumber ? 'Number Mode' : 'Photo Mode'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-5 pt-2 gap-2 ${isLight ? 'border-slate-200 bg-slate-100/60' : 'border-slate-800 bg-slate-900'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'photo'
                ? isLight
                  ? 'border-blue-600 text-blue-700'
                  : 'border-blue-500 text-blue-400'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload Picture
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'info'
                ? isLight
                  ? 'border-blue-600 text-blue-700'
                  : 'border-blue-500 text-blue-400'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Name &amp; Role
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('indicator')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'indicator'
                ? isLight
                  ? 'border-blue-600 text-blue-700'
                  : 'border-blue-500 text-blue-400'
                : isLight
                ? 'border-transparent text-slate-500 hover:text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Indicator Triangle
          </button>
        </div>

        {/* Body content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          
          {/* TAB 1: PHOTO UPLOAD */}
          {activeTab === 'photo' && (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDraggingOver
                    ? 'border-blue-400 bg-blue-500/10'
                    : isLight
                    ? 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/80'
                    : 'border-slate-700 hover:border-blue-500/70 bg-slate-950/50 hover:bg-slate-950/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-3 shadow-md ${
                  isLight ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <p className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Click to upload or drag player picture here
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Supports PNG, JPG, WEBP, or GIF. Fits perfectly into the circular token.
                </p>
              </div>

              {/* URL input fallback */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste an image web URL (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className={`flex-1 rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${inputBg}`}
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!imageUrlInput.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Star Player Quick Pick */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Quick Star Headshots
                  </label>
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: undefined }))}
                      className="text-rose-500 hover:text-rose-600 text-[11px] flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove photo
                    </button>
                  )}
                </div>

                <div className={`grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  {STAR_AVATAR_PRESETS.map((star, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          name: star.name.split(' ').pop() || star.name,
                          avatarUrl: star.avatarUrl,
                          showJerseyNumber: false,
                        }));
                      }}
                      className={`group flex flex-col items-center p-1.5 rounded-lg transition text-center cursor-pointer ${
                        isLight ? 'hover:bg-slate-200/80' : 'hover:bg-slate-800/80'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full border overflow-hidden mb-1 shadow-sm ${
                        isLight ? 'border-slate-300 group-hover:border-blue-500' : 'border-slate-700 group-hover:border-blue-400'
                      }`}>
                        <img
                          src={star.avatarUrl}
                          alt={star.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className={`text-[10px] font-medium truncate w-full ${
                        isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {star.name.split(' ').pop()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NAME & ROLE */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Player Name (Displayed in Black Badge)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bellingham, Vinicius Jr., Courtois"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 border ${inputBg}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={formData.number}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 1;
                      setFormData({ ...formData, number: num, jerseyNumber: num });
                    }}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 border ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Position Role
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 border ${inputBg}`}
                  >
                    {['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'].map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Selector */}
              <div className={`p-3 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <span className={`text-xs font-bold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Circle Content Style
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showJerseyNumber: false })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      !formData.showJerseyNumber
                        ? isLight
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : isLight
                        ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Player Photo Face
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showJerseyNumber: true })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      formData.showJerseyNumber
                        ? isLight
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : isLight
                        ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Hash className="w-4 h-4" />
                    White Jersey #{formData.number}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INDICATOR TRIANGLE */}
          {activeTab === 'indicator' && (
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <div>
                  <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Show Tactical Triangle
                  </span>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Displays tactical indicator triangle next to the circle node (as shown in matchday broadcast)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showIndicatorTriangle}
                  onChange={(e) => setFormData({ ...formData, showIndicatorTriangle: e.target.checked })}
                  className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                />
              </div>

              {formData.showIndicatorTriangle && (
                <>
                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Triangle Direction / Placement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left', 'right', 'up', 'down', 'top-left', 'top-right'] as const).map((dir) => (
                        <button
                          key={dir}
                          type="button"
                          onClick={() => setFormData({ ...formData, indicatorDirection: dir })}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-semibold capitalize transition cursor-pointer ${
                            formData.indicatorDirection === dir
                              ? isLight
                                ? 'bg-blue-100 border-blue-400 text-blue-800 font-bold'
                                : 'bg-blue-600/30 border-blue-500 text-blue-300 font-bold'
                              : isLight
                              ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {dir}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Triangle Color
                    </label>
                    <div className="flex gap-2.5">
                      {[
                        { name: 'UCL Blue', color: '#3b82f6' },
                        { name: 'Mint Green', color: '#86efac' },
                        { name: 'Gold Yellow', color: '#eab308' },
                        { name: 'Cyan Neon', color: '#06b6d4' },
                        { name: 'Coral Red', color: '#f43f5e' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setFormData({ ...formData, indicatorColor: c.color })}
                          className={`w-8 h-8 rounded-full border-2 transition cursor-pointer ${
                            formData.indicatorColor === c.color ? 'border-blue-600 scale-110' : isLight ? 'border-slate-300' : 'border-slate-700'
                          }`}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className={`pt-3 border-t flex items-center justify-end gap-2.5 mt-auto ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
            >
              Save Player
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
