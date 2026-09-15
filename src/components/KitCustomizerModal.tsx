import React, { useState } from 'react';
import { KitConfig } from '../types';
import { Shirt, X, Save, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface KitCustomizerModalProps {
  kit: KitConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (kit: KitConfig) => void;
}

export const KitCustomizerModal: React.FC<KitCustomizerModalProps> = ({
  kit,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState<KitConfig>({ ...kit });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const patterns = [
    { id: 'solid', label: 'Solid Classic' },
    { id: 'stripes_vertical', label: 'Vertical Stripes' },
    { id: 'hoops_horizontal', label: 'Horizontal Hoops' },
    { id: 'sash_diagonal', label: 'Diagonal Sash' },
    { id: 'half_half', label: 'Half & Half' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-2xl w-full max-w-lg p-5 shadow-2xl relative ${
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
          <Shirt className="w-5 h-5" />
          Customize Team Kit &amp; Jersey Design
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Live Jersey Preview */}
          <div className={`flex items-center justify-center p-4 rounded-xl border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div
              className="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center shadow-xl relative overflow-hidden"
              style={{
                background:
                  formData.pattern === 'stripes_vertical'
                    ? `repeating-linear-gradient(90deg, ${formData.primaryColor}, ${formData.primaryColor} 10px, ${formData.secondaryColor} 10px, ${formData.secondaryColor} 20px)`
                    : formData.pattern === 'hoops_horizontal'
                    ? `repeating-linear-gradient(0deg, ${formData.primaryColor}, ${formData.primaryColor} 10px, ${formData.secondaryColor} 10px, ${formData.secondaryColor} 20px)`
                    : formData.pattern === 'sash_diagonal'
                    ? `linear-gradient(135deg, ${formData.primaryColor} 40%, ${formData.secondaryColor} 40%, ${formData.secondaryColor} 60%, ${formData.primaryColor} 60%)`
                    : formData.pattern === 'half_half'
                    ? `linear-gradient(90deg, ${formData.primaryColor} 50%, ${formData.secondaryColor} 50%)`
                    : formData.primaryColor,
              }}
            >
              <span className="font-black text-2xl drop-shadow" style={{ color: formData.numberColor }}>
                10
              </span>
            </div>
          </div>

          {/* Kit Pattern Selector */}
          <div>
            <label className={`block font-bold mb-1.5 uppercase text-[10px] tracking-wider ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Jersey Pattern Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {patterns.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, pattern: p.id as any })}
                  className={`p-2 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                    formData.pattern === p.id
                      ? isLight
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                        : 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                      : isLight
                      ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{formData.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{formData.secondaryColor}</span>
              </div>
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Shirt Number Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.numberColor}
                  onChange={(e) => setFormData({ ...formData, numberColor: e.target.value })}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{formData.numberColor}</span>
              </div>
            </div>
          </div>

          {/* Goalkeeper Color */}
          <div className={`p-3 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <label className={`block font-bold mb-2 uppercase text-[10px] tracking-wider ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              Goalkeeper (GK) Kit Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.gkPrimaryColor}
                onChange={(e) => setFormData({ ...formData, gkPrimaryColor: e.target.value })}
                className="w-9 h-9 rounded border-none cursor-pointer bg-transparent"
              />
              <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{formData.gkPrimaryColor}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Apply Custom Kit Design
          </button>
        </form>
      </div>
    </div>
  );
};
