export interface UclPlayerNode {
  id: string;
  name: string;
  shortName: string;
  number: number;
  position: string;
  x: number; // 0 to 100 on pitch width
  y: number; // 0 to 100 on pitch length (0 = top goal, 100 = bottom goal)
  avatarUrl?: string;
  showJerseyNumber?: boolean; // if true, shows jersey number instead of photo
  jerseyNumber?: number;
  clubBadgeUrl?: string;
  showIndicatorTriangle?: boolean;
  indicatorDirection?: 'left' | 'right' | 'up' | 'down' | 'top-right' | 'top-left';
  indicatorColor?: string;
}

export interface PassingLane {
  fromId: string;
  toId: string;
  hasArrow?: boolean;
  arrowPosition?: 'end' | 'mid';
  style?: 'solid' | 'dashed';
}

export interface UclSquadPreset {
  id: string;
  name: string;
  formationName: string;
  formationId: string;
  badgeEmoji: string;
  clubName: string;
  clubBadgeUrl?: string;
  players: UclPlayerNode[];
  passingLanes: PassingLane[];
}

// Curated high quality transparent & clean headshots of star players
export const STAR_AVATAR_PRESETS = [
  {
    name: 'Jude Bellingham',
    number: 5,
    position: 'CAM',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vinícius Júnior',
    number: 7,
    position: 'LW',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Thibaut Courtois',
    number: 1,
    position: 'GK',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dani Carvajal',
    number: 2,
    position: 'RB',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kylian Mbappé',
    number: 9,
    position: 'ST',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Federico Valverde',
    number: 8,
    position: 'CM',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rodrygo Silva',
    number: 11,
    position: 'RW',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Luka Modrić',
    number: 10,
    position: 'CM',
    club: 'Real Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Erling Haaland',
    number: 9,
    position: 'ST',
    club: 'Manchester City',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kevin De Bruyne',
    number: 17,
    position: 'CAM',
    club: 'Manchester City',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lionel Messi',
    number: 10,
    position: 'RW',
    club: 'Inter Miami',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cristiano Ronaldo',
    number: 7,
    position: 'ST',
    club: 'Al Nassr',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
  },
];

// Club crest badge presets (SVG encoded / stylish badges)
export const CLUB_BADGE_PRESETS = [
  { id: 'real_madrid', name: 'Real Madrid', symbol: '👑', color: '#f59e0b', ringColor: '#3b82f6' },
  { id: 'man_city', name: 'Man City', symbol: '⛵', color: '#0ea5e9', ringColor: '#38bdf8' },
  { id: 'bayern', name: 'Bayern Munich', symbol: '⭐', color: '#ef4444', ringColor: '#f87171' },
  { id: 'barcelona', name: 'Barcelona', symbol: '🔴🔵', color: '#dc2626', ringColor: '#2563eb' },
  { id: 'arsenal', name: 'Arsenal', symbol: '🔴', color: '#dc2626', ringColor: '#fbbf24' },
  { id: 'liverpool', name: 'Liverpool', symbol: '🦅', color: '#b91c1c', ringColor: '#f59e0b' },
  { id: 'psg', name: 'Paris Saint-Germain', symbol: '🗼', color: '#1e3a8a', ringColor: '#ef4444' },
  { id: 'ucl_star', name: 'UEFA Champions Star', symbol: '★', color: '#38bdf8', ringColor: '#60a5fa' },
];

// Default Real Madrid lineup matching the exact layout in the user's screenshot
export const DEFAULT_UCL_LINEUP: UclPlayerNode[] = [
  // Goalkeeper (Bottom)
  {
    id: 'ucl-gk',
    name: 'Courtois',
    shortName: 'Courtois',
    number: 1,
    position: 'GK',
    x: 50,
    y: 86,
    showJerseyNumber: true,
    jerseyNumber: 1,
    showIndicatorTriangle: true,
    indicatorDirection: 'right',
    indicatorColor: '#3b82f6',
  },

  // Defensive Line (4 defenders)
  {
    id: 'ucl-lb',
    name: 'Carvajal',
    shortName: 'Carvajal',
    number: 5,
    position: 'LB',
    x: 16.5,
    y: 69,
    showJerseyNumber: true,
    jerseyNumber: 5,
    showIndicatorTriangle: false,
  },
  {
    id: 'ucl-lcb',
    name: 'Bellingham',
    shortName: 'Bellingham',
    number: 4,
    position: 'CB',
    x: 37,
    y: 72.5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: true,
    indicatorDirection: 'left',
    indicatorColor: '#3b82f6',
  },
  {
    id: 'ucl-rcb',
    name: 'Vinícius Jr',
    shortName: 'Vinícius Jr',
    number: 3,
    position: 'CB',
    x: 61,
    y: 72.5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: false,
  },
  {
    id: 'ucl-rb',
    name: 'Carvajal',
    shortName: 'Carvajal',
    number: 2,
    position: 'RB',
    x: 81.5,
    y: 69,
    showJerseyNumber: true,
    jerseyNumber: 2,
    showIndicatorTriangle: true,
    indicatorDirection: 'top-left',
    indicatorColor: '#86efac',
  },

  // Midfield Line (3 midfielders)
  {
    id: 'ucl-lm',
    name: 'Bellingham',
    shortName: 'Bellingham',
    number: 8,
    position: 'LM',
    x: 32.5,
    y: 48,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: true,
    indicatorDirection: 'left',
    indicatorColor: '#3b82f6',
  },
  {
    id: 'ucl-cm',
    name: 'Vinícius Jr.',
    shortName: 'Vinícius Jr.',
    number: 10,
    position: 'CM',
    x: 48.5,
    y: 48,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: false,
  },
  {
    id: 'ucl-rm',
    name: 'Bellingham',
    shortName: 'Bellingham',
    number: 6,
    position: 'RM',
    x: 65.5,
    y: 48,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: false,
  },

  // Forward Line (3 attackers)
  {
    id: 'ucl-lw',
    name: 'Vinícius Jr.',
    shortName: 'Vinícius Jr.',
    number: 8,
    position: 'LW',
    x: 26.5,
    y: 23,
    showJerseyNumber: true,
    jerseyNumber: 8,
    showIndicatorTriangle: true,
    indicatorDirection: 'right',
    indicatorColor: '#3b82f6',
  },
  {
    id: 'ucl-st',
    name: 'Bellingham',
    shortName: 'Bellingham',
    number: 9,
    position: 'ST',
    x: 48.5,
    y: 19,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: true,
    indicatorDirection: 'right',
    indicatorColor: '#86efac',
  },
  {
    id: 'ucl-rw',
    name: 'Vinícius Jr.',
    shortName: 'Vinícius Jr.',
    number: 7,
    position: 'RW',
    x: 71.5,
    y: 23,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    showIndicatorTriangle: false,
  },
];

// Tactical passing lines matching the screenshot network
export const DEFAULT_UCL_PASSING_LANES: PassingLane[] = [
  // GK to CBs
  { fromId: 'ucl-gk', toId: 'ucl-lcb', hasArrow: false },
  { fromId: 'ucl-gk', toId: 'ucl-rcb', hasArrow: false },

  // Backline connections
  { fromId: 'ucl-lb', toId: 'ucl-lcb', hasArrow: false },
  { fromId: 'ucl-lcb', toId: 'ucl-rcb', hasArrow: false },
  { fromId: 'ucl-rcb', toId: 'ucl-rb', hasArrow: false },

  // Backline to Midfield
  { fromId: 'ucl-lb', toId: 'ucl-lm', hasArrow: false },
  { fromId: 'ucl-lcb', toId: 'ucl-lm', hasArrow: false },
  { fromId: 'ucl-lcb', toId: 'ucl-cm', hasArrow: false },
  { fromId: 'ucl-rcb', toId: 'ucl-cm', hasArrow: false },
  { fromId: 'ucl-rcb', toId: 'ucl-rm', hasArrow: false },
  { fromId: 'ucl-rb', toId: 'ucl-rm', hasArrow: false },

  // Midfield connections (Central network)
  { fromId: 'ucl-lm', toId: 'ucl-cm', hasArrow: false },
  { fromId: 'ucl-cm', toId: 'ucl-rm', hasArrow: false },

  // Midfield to Attackers
  { fromId: 'ucl-lm', toId: 'ucl-lw', hasArrow: false },
  { fromId: 'ucl-lm', toId: 'ucl-st', hasArrow: false },
  { fromId: 'ucl-cm', toId: 'ucl-st', hasArrow: true, arrowPosition: 'mid' },
  { fromId: 'ucl-rm', toId: 'ucl-st', hasArrow: false },
  { fromId: 'ucl-rm', toId: 'ucl-rw', hasArrow: true, arrowPosition: 'end' },

  // Frontline connections
  { fromId: 'ucl-lw', toId: 'ucl-st', hasArrow: false },
  { fromId: 'ucl-st', toId: 'ucl-rw', hasArrow: false },

  // Direct vertical passes from Right Wing back to RB / midfield
  { fromId: 'ucl-rw', toId: 'ucl-rb', hasArrow: true, arrowPosition: 'end' },
];

export const UCL_FORMATIONS_PRESETS = [
  {
    id: '4-3-3',
    name: '4-3-3 Attack (Matchday)',
    positions: [
      { id: 'ucl-gk', role: 'GK', x: 50, y: 86 },
      { id: 'ucl-lb', role: 'LB', x: 16.5, y: 69 },
      { id: 'ucl-lcb', role: 'CB', x: 37, y: 72.5 },
      { id: 'ucl-rcb', role: 'CB', x: 61, y: 72.5 },
      { id: 'ucl-rb', role: 'RB', x: 81.5, y: 69 },
      { id: 'ucl-lm', role: 'LM', x: 32.5, y: 48 },
      { id: 'ucl-cm', role: 'CM', x: 48.5, y: 48 },
      { id: 'ucl-rm', role: 'RM', x: 65.5, y: 48 },
      { id: 'ucl-lw', role: 'LW', x: 26.5, y: 23 },
      { id: 'ucl-st', role: 'ST', x: 48.5, y: 19 },
      { id: 'ucl-rw', role: 'RW', x: 71.5, y: 23 },
    ]
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1 Champions Classic',
    positions: [
      { id: 'ucl-gk', role: 'GK', x: 50, y: 86 },
      { id: 'ucl-lb', role: 'LB', x: 16.5, y: 70 },
      { id: 'ucl-lcb', role: 'CB', x: 37, y: 73 },
      { id: 'ucl-rcb', role: 'CB', x: 61, y: 73 },
      { id: 'ucl-rb', role: 'RB', x: 81.5, y: 70 },
      { id: 'ucl-lm', role: 'CDM', x: 36, y: 56 },
      { id: 'ucl-cm', role: 'CAM', x: 48.5, y: 38 },
      { id: 'ucl-rm', role: 'CDM', x: 62, y: 56 },
      { id: 'ucl-lw', role: 'LAM', x: 25, y: 36 },
      { id: 'ucl-st', role: 'ST', x: 48.5, y: 19 },
      { id: 'ucl-rw', role: 'RAM', x: 72, y: 36 },
    ]
  },
  {
    id: '3-5-2',
    name: '3-5-2 Wing Play',
    positions: [
      { id: 'ucl-gk', role: 'GK', x: 50, y: 86 },
      { id: 'ucl-lb', role: 'CB', x: 28, y: 72 },
      { id: 'ucl-lcb', role: 'CB', x: 48.5, y: 74 },
      { id: 'ucl-rcb', role: 'CB', x: 70, y: 72 },
      { id: 'ucl-rb', role: 'RWB', x: 84, y: 47 },
      { id: 'ucl-lm', role: 'LWB', x: 15, y: 47 },
      { id: 'ucl-cm', role: 'CAM', x: 48.5, y: 39 },
      { id: 'ucl-rm', role: 'CM', x: 62, y: 54 },
      { id: 'ucl-lw', role: 'CM', x: 35, y: 54 },
      { id: 'ucl-st', role: 'ST', x: 39, y: 21 },
      { id: 'ucl-rw', role: 'ST', x: 59, y: 21 },
    ]
  },
  {
    id: '4-4-2',
    name: '4-4-2 Solid Block',
    positions: [
      { id: 'ucl-gk', role: 'GK', x: 50, y: 86 },
      { id: 'ucl-lb', role: 'LB', x: 16.5, y: 70 },
      { id: 'ucl-lcb', role: 'CB', x: 37, y: 73 },
      { id: 'ucl-rcb', role: 'CB', x: 61, y: 73 },
      { id: 'ucl-rb', role: 'RB', x: 81.5, y: 70 },
      { id: 'ucl-lm', role: 'LM', x: 20, y: 47 },
      { id: 'ucl-cm', role: 'CM', x: 40, y: 49 },
      { id: 'ucl-rm', role: 'CM', x: 58, y: 49 },
      { id: 'ucl-lw', role: 'RM', x: 78, y: 47 },
      { id: 'ucl-st', role: 'ST', x: 40, y: 22 },
      { id: 'ucl-rw', role: 'ST', x: 58, y: 22 },
    ]
  }
];
