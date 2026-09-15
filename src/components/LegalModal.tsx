import React, { useState } from 'react';
import { X, Shield, FileText, Cookie, HelpCircle, Check, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export type LegalTabType = 'privacy' | 'terms' | 'cookies' | 'guide';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTabType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Legal &amp; Policy Documentation
                </h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Transparency, privacy guidelines and terms for Be Coach
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex items-center gap-2 px-6 py-3 border-b overflow-x-auto scrollbar-none ${
            isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              Terms of Service
            </button>

            <button
              onClick={() => setActiveTab('cookies')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'cookies'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cookie className="w-4 h-4" />
              Cookie &amp; Storage Policy
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Tactical Board Guide &amp; FAQ
            </button>
          </div>

          {/* Body Content */}
          <div className={`flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className={`border rounded-2xl p-4 flex items-start gap-3 ${
                  isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                }`}>
                  <Shield className={`w-5 h-5 shrink-0 mt-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                  <div className="text-xs space-y-1">
                    <p className={`font-semibold ${isLight ? 'text-emerald-900' : 'text-emerald-200'}`}>100% Privacy by Design</p>
                    <p>
                      Be Coach runs directly in your browser. All formations, customized player cards, tactical drawing paths, and keyframes remain strictly in your local device session.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Information Collection &amp; Processing</h3>
                  <p>
                    We believe tactical strategies and scouting analysis are proprietary to coaches and creators. We do not sell, rent, or monetize your tactical data. The application does not collect personal identifiers unless you voluntarily provide feedback.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Local Storage &amp; Session Data</h3>
                  <p>
                    Your tactical setups, customized kit designs, and keyframe recordings are temporarily kept in your browser memory and client-side storage to enable offline functionality and fast exports. You can clear this data at any time through your browser settings or by resetting the board.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>3. Exported Tactical Graphics</h3>
                  <p>
                    When rendering high-resolution PNG snapshots or recording animations, the conversion happens entirely on your machine using standard HTML5 Canvas rendering. No image files are sent to remote image-processing servers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>4. Contact Information</h3>
                  <p>
                    For privacy inquiries or compliance requests, you can contact our technical team via the tactical support channel.
                  </p>
                </div>

                <div className={`text-xs pt-4 border-t ${isLight ? 'text-slate-400 border-slate-200' : 'text-slate-500 border-slate-800'}`}>
                  Last Updated: 2026 Season Edition • Version 4.2 Pro
                </div>
              </motion.div>
            )}

            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using Be Coach, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you may discontinue use of the tactical application.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>2. Permitted Commercial &amp; Coaching Use</h3>
                  <p>
                    You are free to use exported tactical boards, formations, and diagrams for:
                  </p>
                  <ul className={`list-disc pl-5 space-y-1.5 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <li>Coaching presentations, team dressing room briefings, and training manuals.</li>
                    <li>Social media tactical breakdowns, YouTube analysis videos, and blog articles.</li>
                    <li>Football scouting reports and match tactical previews.</li>
                    <li>Esports, video game squads, and fantasy league team representations.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>3. Intellectual Property</h3>
                  <p>
                    The tactical software interface, pitch rendering algorithms, drawing engines, and custom icon assets are proprietary. You retain full intellectual ownership of the original formations and tactical schemes you create using the software.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>4. Disclaimer of Warranties</h3>
                  <p>
                    The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. We are not liable for match outcomes, coaching decisions, or tactical results derived from using this software.
                  </p>
                </div>

                <div className={`text-xs pt-4 border-t ${isLight ? 'text-slate-400 border-slate-200' : 'text-slate-500 border-slate-800'}`}>
                  Effective Date: January 1, 2026
                </div>
              </motion.div>
            )}

            {activeTab === 'cookies' && (
              <motion.div
                key="cookies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>1. What We Store</h3>
                  <p>
                    Be Coach uses modern browser storage mechanisms (such as localStorage and sessionStorage) solely for essential application features:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className={`p-3.5 border rounded-xl space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <p className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Pitch Preferences</p>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Saves your preferred pitch texture (e.g. premier stripes), lighting mode, and orientation.</p>
                    </div>
                    <div className={`p-3.5 border rounded-xl space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                    }`}>
                      <p className={`font-semibold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Active Squad Formations</p>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Stores player coordinates, custom jersey numbers, and kit colors during your session.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>2. No Third-Party Advertising Trackers</h3>
                  <p>
                    We do not embed third-party advertising cookies or cross-site tracking scripts. Your coaching data is never shared with programmatic ad networks.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>3. Managing Local Cache</h3>
                  <p>
                    You can clear stored boards and reset all pitch presets at any time by clicking the &quot;Reset Pitch&quot; button on the tactical toolbar or through your web browser&apos;s site data management menu.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Mastering the Tactical Studio</h3>
                  <p>
                    Here is a quick reference guide to get the most out of your match planning:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 border rounded-2xl space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>1</div>
                    <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Drag &amp; Drop Positioning</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Click and drag any player token to position them precisely on the pitch. Drag one player onto another to initiate an instant tactical swap.
                    </p>
                  </div>

                  <div className={`p-4 border rounded-2xl space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-500/10 text-blue-400'
                    }`}>2</div>
                    <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Tactical Drawing Arrows</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Enable Drawing Mode from the top toolbar to sketch passing lanes, overlapping runs, dribble patterns, and pressing triggers.
                    </p>
                  </div>

                  <div className={`p-4 border rounded-2xl space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/10 text-amber-400'
                    }`}>3</div>
                    <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Keyframe Studio &amp; Playback</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Record sequence snapshots at Phase 1, Phase 2, and Phase 3 to animate tactical movements, corner routines, and pressing traps.
                    </p>
                  </div>

                  <div className={`p-4 border rounded-2xl space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isLight ? 'bg-teal-100 text-teal-800' : 'bg-teal-500/10 text-teal-400'
                    }`}>4</div>
                    <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>High-Resolution Export</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Export crisp PNG images of your formation with custom watermarks, team lineups, and bench rosters ready for matchday presentation.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Action */}
          <div className={`px-6 py-4 border-t flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Be Coach • Professional Tactical Board &amp; Coaching System
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Understood &amp; Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
