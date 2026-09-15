import React from 'react';

export type ZoneMode = 'off' | '5-channels' | '18-zones';

interface TacticalZonesOverlayProps {
  mode: ZoneMode;
  orientation?: 'horizontal' | 'vertical';
}

const TacticalZonesOverlayComponent: React.FC<TacticalZonesOverlayProps> = ({
  mode,
  orientation = 'horizontal',
}) => {
  if (mode === 'off') return null;

  const isVert = orientation === 'vertical';

  // 1. 5 Tactical Channels Overlay
  if (mode === '5-channels') {
    if (isVert) {
      return (
        <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
          {/* 5 Vertical Channels */}
          <div className="absolute inset-0 grid grid-cols-5">
            {/* Left Flank */}
            <div className="relative border-r border-dashed border-white/15 bg-white/[0.02] flex flex-col justify-between items-center py-2">
              <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                L Flank
              </span>
              <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                L Flank
              </span>
            </div>

            {/* Left Half-Space */}
            <div className="relative border-r border-dashed border-cyan-400/20 bg-cyan-500/[0.04] flex flex-col justify-between items-center py-2">
              <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                L Half-Space
              </span>
              <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                L Half-Space
              </span>
            </div>

            {/* Central Axis */}
            <div className="relative border-r border-dashed border-white/15 bg-white/[0.015] flex flex-col justify-between items-center py-2">
              <span className="text-[7px] font-semibold tracking-wider text-emerald-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                Center Axis
              </span>
              <span className="text-[7px] font-semibold tracking-wider text-emerald-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                Center Axis
              </span>
            </div>

            {/* Right Half-Space */}
            <div className="relative border-r border-dashed border-cyan-400/20 bg-cyan-500/[0.04] flex flex-col justify-between items-center py-2">
              <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                R Half-Space
              </span>
              <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                R Half-Space
              </span>
            </div>

            {/* Right Flank */}
            <div className="relative bg-white/[0.02] flex flex-col justify-between items-center py-2">
              <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                R Flank
              </span>
              <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
                R Flank
              </span>
            </div>
          </div>

          {/* Thirds Horizontal Dotted Reference Dividers */}
          <div className="absolute top-[33.33%] left-0 right-0 border-b border-dashed border-white/15 flex justify-end pr-2">
            <span className="text-[6.5px] font-medium text-white/40 uppercase tracking-widest -mt-2.5 bg-slate-950/50 px-1 rounded">
              Defensive 1/3
            </span>
          </div>
          <div className="absolute top-[66.66%] left-0 right-0 border-b border-dashed border-white/15 flex justify-end pr-2">
            <span className="text-[6.5px] font-medium text-white/40 uppercase tracking-widest -mt-2.5 bg-slate-950/50 px-1 rounded">
              Attacking 1/3
            </span>
          </div>
        </div>
      );
    }

    // Horizontal 5 Channels
    return (
      <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
        {/* 5 Horizontal Channels */}
        <div className="absolute inset-0 grid grid-rows-5">
          {/* Top Flank (Left Wing) */}
          <div className="relative border-b border-dashed border-white/15 bg-white/[0.02] flex items-center justify-between px-3">
            <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Left Flank
            </span>
            <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Left Flank
            </span>
          </div>

          {/* Upper Half-Space */}
          <div className="relative border-b border-dashed border-cyan-400/20 bg-cyan-500/[0.04] flex items-center justify-between px-3">
            <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Left Half-Space
            </span>
            <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Left Half-Space
            </span>
          </div>

          {/* Central Corridor */}
          <div className="relative border-b border-dashed border-white/15 bg-white/[0.015] flex items-center justify-between px-3">
            <span className="text-[7px] font-semibold tracking-wider text-emerald-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Central Axis
            </span>
            <span className="text-[7px] font-semibold tracking-wider text-emerald-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Central Axis
            </span>
          </div>

          {/* Lower Half-Space */}
          <div className="relative border-b border-dashed border-cyan-400/20 bg-cyan-500/[0.04] flex items-center justify-between px-3">
            <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Right Half-Space
            </span>
            <span className="text-[7px] font-semibold tracking-wider text-cyan-300/60 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Right Half-Space
            </span>
          </div>

          {/* Bottom Flank (Right Wing) */}
          <div className="relative bg-white/[0.02] flex items-center justify-between px-3">
            <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Right Flank
            </span>
            <span className="text-[7px] font-semibold tracking-wider text-white/40 uppercase bg-slate-950/40 px-1 py-0.2 rounded">
              Right Flank
            </span>
          </div>
        </div>

        {/* Thirds Vertical Dotted Reference Dividers */}
        <div className="absolute top-0 bottom-0 left-[33.33%] border-r border-dashed border-white/15 flex flex-col justify-start pt-1.5 pl-1.5">
          <span className="text-[6.5px] font-medium text-white/40 uppercase tracking-widest bg-slate-950/50 px-1 py-0.2 rounded">
            Defensive 1/3
          </span>
        </div>
        <div className="absolute top-0 bottom-0 left-[66.66%] border-r border-dashed border-white/15 flex flex-col justify-start pt-1.5 pl-1.5">
          <span className="text-[6.5px] font-medium text-white/40 uppercase tracking-widest bg-slate-950/50 px-1 py-0.2 rounded">
            Attacking 1/3
          </span>
        </div>
      </div>
    );
  }

  // 2. 18 Tactical Pitch Zones (FIFA / UEFA Standard 3x6 Grid with Minimalist Zone 14)
  if (isVert) {
    const zonesVert = [
      { id: 1, name: 'Z1' },
      { id: 2, name: 'Z2' },
      { id: 3, name: 'Z3' },
      { id: 4, name: 'Z4' },
      { id: 5, name: 'Z5' },
      { id: 6, name: 'Z6' },
      { id: 7, name: 'Z7' },
      { id: 8, name: 'Z8' },
      { id: 9, name: 'Z9' },
      { id: 10, name: 'Z10' },
      { id: 11, name: 'Z11' },
      { id: 12, name: 'Z12' },
      { id: 13, name: 'Z13' },
      { id: 14, name: 'Z14', isGolden: true, label: 'Zone 14' },
      { id: 15, name: 'Z15' },
      { id: 16, name: 'Z16' },
      { id: 17, name: 'Z17' },
      { id: 18, name: 'Z18' },
    ];

    return (
      <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-6">
          {zonesVert.map((zone) => (
            <div
              key={zone.id}
              className={`relative border border-dashed flex flex-col items-center justify-center p-0.5 transition-all ${
                zone.isGolden
                  ? 'border-amber-400/40 bg-amber-400/[0.06]'
                  : 'border-white/10 bg-white/[0.01]'
              }`}
            >
              <span
                className={`text-[7.5px] font-semibold tracking-wider ${
                  zone.isGolden
                    ? 'text-amber-300 font-bold px-1 rounded bg-slate-950/60 border border-amber-400/30'
                    : 'text-white/40'
                }`}
              >
                {zone.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal 18 Zones: 6 columns, 3 rows
  const zonesHoriz = [
    // Top Row (Left Flank)
    { id: 1, name: 'Z1' },
    { id: 4, name: 'Z4' },
    { id: 7, name: 'Z7' },
    { id: 10, name: 'Z10' },
    { id: 13, name: 'Z13' },
    { id: 16, name: 'Z16' },
    // Center Row (Spine & Zone 14)
    { id: 2, name: 'Z2' },
    { id: 5, name: 'Z5' },
    { id: 8, name: 'Z8' },
    { id: 11, name: 'Z11' },
    { id: 14, name: 'Z14', isGolden: true, label: 'Zone 14' },
    { id: 17, name: 'Z17' },
    // Bottom Row (Right Flank)
    { id: 3, name: 'Z3' },
    { id: 6, name: 'Z6' },
    { id: 9, name: 'Z9' },
    { id: 12, name: 'Z12' },
    { id: 15, name: 'Z15' },
    { id: 18, name: 'Z18' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden font-sans">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-3">
        {zonesHoriz.map((zone) => (
          <div
            key={zone.id}
            className={`relative border border-dashed flex flex-col items-center justify-center p-0.5 transition-all ${
              zone.isGolden
                ? 'border-amber-400/40 bg-amber-400/[0.06]'
                : 'border-white/10 bg-white/[0.01]'
            }`}
          >
            <span
              className={`text-[7.5px] font-semibold tracking-wider ${
                zone.isGolden
                  ? 'text-amber-300 font-bold px-1.5 py-0.2 rounded bg-slate-950/60 border border-amber-400/30'
                  : 'text-white/40'
              }`}
            >
              {zone.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TacticalZonesOverlay = React.memo(TacticalZonesOverlayComponent);
