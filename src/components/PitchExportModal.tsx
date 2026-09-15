import React, { useState } from 'react';
import { SquadData } from '../types';
import { toPng, toJpeg } from 'html-to-image';
import { X, Download, Share2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SvgExportTactical } from './LandingSvgIcons';

interface PitchExportModalProps {
  squad: SquadData;
  isOpen: boolean;
  onClose: () => void;
  pitchRef: React.RefObject<HTMLDivElement | null>;
}

export const PitchExportModal: React.FC<PitchExportModalProps> = ({
  squad,
  isOpen,
  onClose,
  pitchRef,
}) => {
  if (!isOpen) return null;

  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isExporting, setIsExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    if (!pitchRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl =
        format === 'png'
          ? await toPng(pitchRef.current, { quality: 0.95, pixelRatio: 2 })
          : await toJpeg(pitchRef.current, { quality: 0.9, pixelRatio: 2 });

      const link = document.createElement('a');
      link.download = `${squad.name.toLowerCase().replace(/\s+/g, '_')}_lineup.${format}`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to export pitch image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center flex flex-col items-center ${
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

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${
          isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        }`}>
          <ImageIcon className="w-6 h-6" />
        </div>

        <h3 className={`text-xl font-black tracking-tight mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Export Tactical Lineup Graphic
        </h3>
        <p className={`text-xs mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Download your realistic pitch lineup and squad tactics as a high-resolution image to share.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => handleDownloadImage('png')}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-extrabold text-sm py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-white cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-5 h-5 text-emerald-200" />
                Lineup Downloaded!
              </>
            ) : isExporting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Rendering Image...
              </>
            ) : (
              <>
                <SvgExportTactical className="w-5 h-5 stroke-white" />
                Download High-Res PNG
              </>
            )}
          </button>

          <button
            onClick={() => handleDownloadImage('jpeg')}
            disabled={isExporting}
            className={`w-full font-bold text-xs py-2.5 rounded-xl border transition cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            Download compressed JPEG
          </button>
        </div>
      </div>
    </div>
  );
};
