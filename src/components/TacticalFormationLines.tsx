import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SquadData, Player } from '../types';

interface TacticalFormationLinesProps {
  squad: SquadData;
  awaySquad?: SquadData | null;
  matchMode?: 'home_vs_away' | 'home_only' | 'away_only';
  orientation?: 'horizontal' | 'vertical';
  visible: boolean;
  animatorPositions?: Record<string, { x: number; y: number }>;
}

// Helper to compute exact display position (0-100%) on pitch container
const computeDisplayPos = (
  player: Player,
  team: 'home' | 'away',
  matchMode: string,
  orientation: string,
  animatorPositions?: Record<string, { x: number; y: number }>
) => {
  // If animator is overriding position
  if (animatorPositions && animatorPositions[player.id]) {
    const pos = animatorPositions[player.id];
    return { x: pos.x, y: pos.y };
  }

  const isVS = matchMode === 'home_vs_away';
  const px = Math.max(3, Math.min(97, isVS ? (player.vsPitchX ?? player.pitchX ?? 50) : (player.pitchX ?? 50)));
  const py = isVS ? (player.vsPitchY ?? player.pitchY ?? 50) : (player.pitchY ?? 50);

  let xPos: number;
  let yPos: number;

  if (team === 'home') {
    if (matchMode === 'home_vs_away') {
      const scaledY = Math.max(3, Math.min(97, 50 + (py / 100) * 43));
      if (orientation === 'horizontal') {
        xPos = 100 - scaledY;
        yPos = px;
      } else {
        xPos = px;
        yPos = scaledY;
      }
    } else {
      if (orientation === 'horizontal') {
        xPos = 100 - Math.max(3, Math.min(97, py));
        yPos = px;
      } else {
        xPos = px;
        yPos = Math.max(3, Math.min(97, py));
      }
    }
  } else {
    // away
    if (matchMode === 'home_vs_away') {
      const scaledY = Math.max(3, Math.min(97, 50 - (py / 100) * 43));
      if (orientation === 'horizontal') {
        xPos = 100 - scaledY;
        yPos = 100 - px;
      } else {
        xPos = 100 - px;
        yPos = scaledY;
      }
    } else {
      if (orientation === 'horizontal') {
        xPos = 100 - Math.max(3, Math.min(97, py));
        yPos = px;
      } else {
        xPos = px;
        yPos = Math.max(3, Math.min(97, py));
      }
    }
  }

  return { x: xPos, y: yPos };
};

interface TeamShapeData {
  team: 'home' | 'away';
  teamName: string;
  primaryColor: string;
  lineColor: string;
  fillColor: string;
  gk?: { player: Player; pos: { x: number; y: number } };
  defenders: { player: Player; pos: { x: number; y: number } }[];
  midfielders: { player: Player; pos: { x: number; y: number } }[];
  attackers: { player: Player; pos: { x: number; y: number } }[];
  triangles: { p1: { x: number; y: number }; p2: { x: number; y: number }; p3: { x: number; y: number } }[];
  verticalLinks: { from: { x: number; y: number }; to: { x: number; y: number }; label?: string }[];
  hullPoints: { x: number; y: number }[];
}

export const TacticalFormationLines: React.FC<TacticalFormationLinesProps> = ({
  squad,
  awaySquad,
  matchMode = 'home_vs_away',
  orientation = 'horizontal',
  visible,
  animatorPositions,
}) => {
  const isHorizontal = orientation === 'horizontal';

  // Process tactical structures for active teams
  const teamShapes = useMemo<TeamShapeData[]>(() => {
    if (!visible) return [];

    const teamsToProcess: Array<{ squad: SquadData; team: 'home' | 'away'; defaultColor: string }>= [];

    if (matchMode === 'home_vs_away') {
      teamsToProcess.push({
        squad,
        team: 'home',
        defaultColor: squad.kit?.primaryColor || '#10b981',
      });
      if (awaySquad) {
        teamsToProcess.push({
          squad: awaySquad,
          team: 'away',
          defaultColor: awaySquad.kit?.primaryColor || '#f43f5e',
        });
      }
    } else if (matchMode === 'away_only' && awaySquad) {
      teamsToProcess.push({
        squad: awaySquad,
        team: 'away',
        defaultColor: awaySquad.kit?.primaryColor || '#f43f5e',
      });
    } else {
      teamsToProcess.push({
        squad,
        team: 'home',
        defaultColor: squad.kit?.primaryColor || '#10b981',
      });
    }

    return teamsToProcess.map(({ squad: currentSquad, team, defaultColor }) => {
      const players = currentSquad.startingXI;

      // Map display positions
      const mapped = players.map((p) => ({
        player: p,
        pos: computeDisplayPos(p, team, matchMode, orientation, animatorPositions),
      }));

      // Sort by pitch lateral coordinate (Y in horizontal, X in vertical)
      const sortLateral = (a: { pos: { x: number; y: number } }, b: { pos: { x: number; y: number } }) => {
        return isHorizontal ? a.pos.y - b.pos.y : a.pos.x - b.pos.x;
      };

      const gk = mapped.find((m) => m.player.position === 'GK');
      const defenders = mapped
        .filter((m) => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(m.player.position))
        .sort(sortLateral);
      const midfielders = mapped
        .filter((m) => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(m.player.position))
        .sort(sortLateral);
      const attackers = mapped
        .filter((m) => ['ST', 'CF', 'LW', 'RW'].includes(m.player.position))
        .sort(sortLateral);

      // Generate passing triangles / geometric connections
      const triangles: { p1: { x: number; y: number }; p2: { x: number; y: number }; p3: { x: number; y: number } }[] = [];
      const verticalLinks: { from: { x: number; y: number }; to: { x: number; y: number }; label?: string }[] = [];

      // Link GK to central defenders
      if (gk && defenders.length > 0) {
        const centralDefs = defenders.filter((d) => ['CB'].includes(d.player.position));
        const targetDefs = centralDefs.length > 0 ? centralDefs : [defenders[Math.floor(defenders.length / 2)]];
        targetDefs.forEach((cd) => {
          verticalLinks.push({ from: gk.pos, to: cd.pos, label: 'Build-up' });
        });
      }

      // Link Defenders to Midfielders (Flank channels & Central pivot)
      if (defenders.length >= 2 && midfielders.length >= 2) {
        // Left Flank link
        verticalLinks.push({ from: defenders[0].pos, to: midfielders[0].pos, label: 'Flank' });
        // Right Flank link
        verticalLinks.push({
          from: defenders[defenders.length - 1].pos,
          to: midfielders[midfielders.length - 1].pos,
          label: 'Flank',
        });
      }

      // Central progression links & triangles
      if (defenders.length > 0 && midfielders.length > 0) {
        const midCenter = midfielders[Math.floor(midfielders.length / 2)];
        const defCenter = defenders[Math.floor(defenders.length / 2)];
        if (midCenter && defCenter) {
          verticalLinks.push({ from: defCenter.pos, to: midCenter.pos, label: 'Spine' });
        }

        // Add passing triangle if possible (e.g. Left CB - Right CB - Central Midfielder)
        if (defenders.length >= 2 && midCenter) {
          const d1 = defenders[0];
          const d2 = defenders[defenders.length - 1];
          triangles.push({ p1: d1.pos, p2: d2.pos, p3: midCenter.pos });
        }
      }

      // Midfielders to Attackers
      if (midfielders.length > 0 && attackers.length > 0) {
        midfielders.forEach((m) => {
          // Find closest 1-2 attackers
          const closestAtt = [...attackers].sort(
            (a, b) =>
              Math.hypot(a.pos.x - m.pos.x, a.pos.y - m.pos.y) -
              Math.hypot(b.pos.x - m.pos.x, b.pos.y - m.pos.y)
          )[0];
          if (closestAtt) {
            verticalLinks.push({ from: m.pos, to: closestAtt.pos });
          }
        });

        // Midfield - Attack Triangles
        if (midfielders.length >= 2 && attackers.length >= 1) {
          triangles.push({
            p1: midfielders[0].pos,
            p2: midfielders[midfielders.length - 1].pos,
            p3: attackers[0].pos,
          });
        }
      }

      // Shaded tactical shape hull (compactness envelope)
      const allFieldPlayers = [...defenders, ...midfielders, ...attackers];
      const hullPoints = allFieldPlayers.map((p) => p.pos);

      // Color scheme based on team
      const lineColor = team === 'home' ? '#38bdf8' : '#fb7185';
      const fillColor = team === 'home' ? 'rgba(56, 189, 248, 0.07)' : 'rgba(251, 113, 133, 0.07)';

      return {
        team,
        teamName: currentSquad.name || (team === 'home' ? 'Home Team' : 'Away Team'),
        primaryColor: defaultColor,
        lineColor,
        fillColor,
        gk,
        defenders,
        midfielders,
        attackers,
        triangles,
        verticalLinks,
        hullPoints,
      };
    });
  }, [squad, awaySquad, matchMode, orientation, visible, animatorPositions, isHorizontal]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible select-none animate-in fade-in duration-300">
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glowing Tactical Filter */}
          <filter id="tacticalGlowHome" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="tacticalGlowAway" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Tactical Mesh Diagonal Stripe Patterns */}
          <pattern id="tacticalMeshPatternHome" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.15" />
          </pattern>

          <pattern id="tacticalMeshPatternAway" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#fb7185" strokeWidth="0.5" strokeOpacity="0.15" />
          </pattern>
        </defs>

        {teamShapes.map((shape) => {
          const isHome = shape.team === 'home';
          const primaryLineStroke = isHome ? '#38bdf8' : '#fb7185';
          const secondaryLineStroke = isHome ? '#0ea5e9' : '#f43f5e';
          const triangleFill = isHome ? 'rgba(56, 189, 248, 0.08)' : 'rgba(251, 113, 133, 0.08)';
          const patternId = isHome ? 'url(#tacticalMeshPatternHome)' : 'url(#tacticalMeshPatternAway)';

          return (
            <g key={`shape-${shape.team}`} className="transition-all duration-300">
              {/* 1. Geometric Tactical Triangles & Passing Diamonds (Positional Mesh) */}
              {shape.triangles.map((tri, idx) => (
                <polygon
                  key={`tri-${shape.team}-${idx}`}
                  points={`${tri.p1.x},${tri.p1.y} ${tri.p2.x},${tri.p2.y} ${tri.p3.x},${tri.p3.y}`}
                  fill={triangleFill}
                  stroke={secondaryLineStroke}
                  strokeWidth="0.35"
                  strokeDasharray="1.5,1.5"
                  strokeOpacity="0.5"
                  className="transition-all duration-300"
                />
              ))}

              {/* 2. Tactical Unit Bands / Shaded Compactness Polygons */}
              {shape.defenders.length >= 2 && shape.midfielders.length >= 2 && (
                <polygon
                  points={`
                    ${shape.defenders[0].pos.x},${shape.defenders[0].pos.y}
                    ${shape.defenders[shape.defenders.length - 1].pos.x},${shape.defenders[shape.defenders.length - 1].pos.y}
                    ${shape.midfielders[shape.midfielders.length - 1].pos.x},${shape.midfielders[shape.midfielders.length - 1].pos.y}
                    ${shape.midfielders[0].pos.x},${shape.midfielders[0].pos.y}
                  `}
                  fill={patternId}
                  stroke="none"
                  className="transition-all duration-500"
                />
              )}

              {/* 3. Inter-line Vertical Passing Links (Dashed Motion Graphic Lines) */}
              {shape.verticalLinks.map((link, idx) => (
                <g key={`vlink-${shape.team}-${idx}`}>
                  {/* Subtle Background Glow Track */}
                  <line
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    stroke={secondaryLineStroke}
                    strokeWidth="1.2"
                    strokeOpacity="0.25"
                  />
                  {/* Animated Dashed Flow Line */}
                  <line
                    x1={link.from.x}
                    y1={link.from.y}
                    x2={link.to.x}
                    y2={link.to.y}
                    stroke={secondaryLineStroke}
                    strokeWidth="0.75"
                    strokeDasharray="2,2"
                    strokeOpacity="0.8"
                    className="animate-dash-flow"
                  />
                </g>
              ))}

              {/* 4. Primary Tactical Unit Horizontal Lines (Backline, Midfield Block, Frontline) */}
              {/* --- Defensive Line --- */}
              {shape.defenders.length > 1 && (
                <g filter={isHome ? 'url(#tacticalGlowHome)' : 'url(#tacticalGlowAway)'}>
                  {/* Solid Base Glow Line */}
                  <polyline
                    points={shape.defenders.map((d) => `${d.pos.x},${d.pos.y}`).join(' ')}
                    fill="none"
                    stroke={primaryLineStroke}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.4"
                  />
                  {/* High-Tech Animated Dashed Formation Stroke */}
                  <polyline
                    points={shape.defenders.map((d) => `${d.pos.x},${d.pos.y}`).join(' ')}
                    fill="none"
                    stroke={primaryLineStroke}
                    strokeWidth="1.1"
                    strokeDasharray="3,2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-dash-flow"
                  />
                </g>
              )}

              {/* --- Midfield Unit Line --- */}
              {shape.midfielders.length > 1 && (
                <g filter={isHome ? 'url(#tacticalGlowHome)' : 'url(#tacticalGlowAway)'}>
                  <polyline
                    points={shape.midfielders.map((m) => `${m.pos.x},${m.pos.y}`).join(' ')}
                    fill="none"
                    stroke={isHome ? '#34d399' : '#fb923c'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.4"
                  />
                  <polyline
                    points={shape.midfielders.map((m) => `${m.pos.x},${m.pos.y}`).join(' ')}
                    fill="none"
                    stroke={isHome ? '#34d399' : '#fb923c'}
                    strokeWidth="1.1"
                    strokeDasharray="3,2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-dash-flow"
                  />
                </g>
              )}

              {/* --- Attacking Unit Line --- */}
              {shape.attackers.length > 1 && (
                <g filter={isHome ? 'url(#tacticalGlowHome)' : 'url(#tacticalGlowAway)'}>
                  <polyline
                    points={shape.attackers.map((a) => `${a.pos.x},${a.pos.y}`).join(' ')}
                    fill="none"
                    stroke={isHome ? '#f43f5e' : '#ec4899'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.4"
                  />
                  <polyline
                    points={shape.attackers.map((a) => `${a.pos.x},${a.pos.y}`).join(' ')}
                    fill="none"
                    stroke={isHome ? '#f43f5e' : '#ec4899'}
                    strokeWidth="1.1"
                    strokeDasharray="3,2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-dash-flow"
                  />
                </g>
              )}

              {/* 5. Glowing Tactical Nodes and Crosshairs on Player Vertices */}
              {[
                ...(shape.gk ? [shape.gk] : []),
                ...shape.defenders,
                ...shape.midfielders,
                ...shape.attackers,
              ].map(({ player, pos }) => (
                <g key={`node-${player.id}`} className="transition-all duration-300">
                  {/* Outer Pulsing Tactical Target Ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="2.6"
                    fill="none"
                    stroke={primaryLineStroke}
                    strokeWidth="0.5"
                    strokeDasharray="1,1"
                    strokeOpacity="0.7"
                    className="animate-spin origin-center"
                    style={{ animationDuration: '8s' }}
                  />
                  {/* Inner Node Dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="1.0"
                    fill={primaryLineStroke}
                    stroke="#0f172a"
                    strokeWidth="0.4"
                  />
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Floating Tactical Structure HUD Badge */}
      <div className="absolute top-2 left-2 pointer-events-none z-30 flex items-center gap-2">
        <div className="backdrop-blur-md bg-slate-950/85 text-white px-2.5 py-1 rounded-lg border border-cyan-500/40 shadow-lg shadow-cyan-950/50 flex items-center gap-2 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="text-cyan-300 font-extrabold uppercase tracking-wider">Formation Structure Active</span>
          <span className="text-slate-400 font-mono text-[9px] border-l border-slate-700 pl-1.5 hidden sm:inline">
            {teamShapes.map((t) => `${t.team === 'home' ? 'Home' : 'Away'}: ${t.defenders.length}-${t.midfielders.length}-${t.attackers.length}`).join(' vs ')}
          </span>
        </div>
      </div>
    </div>
  );
};
