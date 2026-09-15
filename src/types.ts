export type ThemeMode = 'light' | 'dark';

export type PositionRole = 
  | 'GK' 
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'ST' | 'CF';

export type PitchTexture = 
  | 'striped' 
  | 'checkerboard' 
  | 'circular' 
  | 'diamond_cut' 
  | 'deep_emerald' 
  | 'hybrid_stadium' 
  | 'frost_pitch' 
  | 'vintage_classic' 
  | 'retro_grass' 
  | 'indoor_turf' 
  | 'tactical_dark';

export type PitchPerspective = '2d_flat' | '3d_perspective' | 'broadcast_tv' | 'half_pitch';

export type LightingMode = 'day' | 'floodlight_night' | 'sunset' | 'tactical_neon';

export interface PositionCoordinates {
  x: number; // 0 to 100 percentage from left of pitch
  y: number; // 0 to 100 percentage from top of pitch
  role: PositionRole;
  label?: string;
}

export interface Formation {
  id: string;
  name: string;
  category: '4-Back' | '3-Back' | '5-Back' | 'Custom';
  styleTag?: 'Attacking' | 'Defensive' | 'Balanced';
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  bestFor?: string;
  lineStructure?: string;
  positions: PositionCoordinates[]; // array of 11 positions
}

export interface PlayerRoleInstructions {
  attackingRole?: string;
  defensiveDuty?: string;
  keyInstructions?: string[];
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  number: number;
  position: PositionRole;
  secondaryPositions?: PositionRole[];
  rating: number; // 50 to 99
  nationality?: string;
  flag?: string;
  club?: string;
  avatarUrl?: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isPenaltyTaker?: boolean;
  isFreeKickTaker?: boolean;
  isCornerTaker?: boolean;
  instructions?: PlayerRoleInstructions;
  // Position on pitch if custom or mapped to slot
  pitchX?: number; 
  pitchY?: number;
  vsPitchX?: number;
  vsPitchY?: number;
  isBench?: boolean;
}

export interface KitConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: 'solid' | 'stripes_vertical' | 'hoops_horizontal' | 'sash_diagonal' | 'half_half' | 'sleeves_contrast';
  gkPrimaryColor: string;
  gkSecondaryColor: string;
  numberColor: string;
  badgeStyle: 'shield' | 'circle' | 'minimal' | 'star';
  badgeColor: string;
}

export type DrawingToolType = 
  | 'hand'
  | 'arrow_solid' 
  | 'arrow_dashed' 
  | 'arrow_curved' 
  | 'arrow_curved_dashed'
  | 'line' 
  | 'line_dashed'
  | 'pen' 
  | 'eraser' 
  | 'rectangle' 
  | 'circle' 
  | 'triangle'
  | 'select';

export interface DrawingPoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface DrawingElement {
  id: string;
  tool?: DrawingToolType;
  startX: number; // %
  startY: number; // %
  endX: number;   // %
  endY: number;   // %
  controlX?: number;
  controlY?: number;
  points?: DrawingPoint[];
  color: string;
  strokeWidth?: number; // 1 to 5
  isDashed?: boolean;
  isHighlighted?: boolean; // filled background highlight for shapes & zones
  type?: 'pass' | 'run' | 'dribble' | 'press' | string; // backward compatibility
}

export type TacticalArrow = DrawingElement;

export interface TeamTactics {
  teamName: string;
  managerName: string;
  formationId: string;
  vsFormationId?: string;
  playStyle: 'Possession' | 'Counter Attack' | 'High Press / Gegenpress' | 'Tiki-Taka' | 'Direct Play' | 'Park the Bus';
  defensiveLine: 'Low Block' | 'Mid Block' | 'High Line';
  attackingWidth: 'Narrow' | 'Balanced' | 'Wide';
  notes: string;
}

export interface SquadData {
  id: string;
  name: string;
  tactics: TeamTactics;
  kit: KitConfig;
  startingXI: Player[];
  substitutes: Player[];
  tacticalArrows: TacticalArrow[];
  vsTacticalArrows?: TacticalArrow[];
}
