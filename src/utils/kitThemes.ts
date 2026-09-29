import { KitConfig, SquadData } from '../types';

export interface KitPairTheme {
  name: string;
  homeKit: KitConfig;
  awayKit: KitConfig;
}

export const DYNAMIC_KIT_PAIRS: KitPairTheme[] = [
  {
    name: 'Sky Blue vs Crimson Fire',
    homeKit: {
      primaryColor: '#0284C7',
      secondaryColor: '#38BDF8',
      accentColor: '#BAE6FD',
      pattern: 'solid',
      gkPrimaryColor: '#A3E635',
      gkSecondaryColor: '#4D7C0F',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#FFFFFF',
    },
    awayKit: {
      primaryColor: '#DC2626',
      secondaryColor: '#991B1B',
      accentColor: '#FCA5A5',
      pattern: 'solid',
      gkPrimaryColor: '#06B6D4',
      gkSecondaryColor: '#164E63',
      numberColor: '#FFFFFF',
      badgeStyle: 'circle',
      badgeColor: '#DC2626',
    },
  },
  {
    name: 'Royal Navy vs Solar Amber',
    homeKit: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#3B82F6',
      accentColor: '#93C5FD',
      pattern: 'solid',
      gkPrimaryColor: '#F43F5E',
      gkSecondaryColor: '#881337',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#1E3A8A',
    },
    awayKit: {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      accentColor: '#FDE68A',
      pattern: 'solid',
      gkPrimaryColor: '#10B981',
      gkSecondaryColor: '#064E3B',
      numberColor: '#0F172A',
      badgeStyle: 'circle',
      badgeColor: '#F59E0B',
    },
  },
  {
    name: 'Emerald Pitch vs Radiant Scarlet',
    homeKit: {
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      accentColor: '#A7F3D0',
      pattern: 'solid',
      gkPrimaryColor: '#F97316',
      gkSecondaryColor: '#9A3412',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#059669',
    },
    awayKit: {
      primaryColor: '#E11D48',
      secondaryColor: '#BE123C',
      accentColor: '#FECDD3',
      pattern: 'solid',
      gkPrimaryColor: '#00D1FF',
      gkSecondaryColor: '#002B49',
      numberColor: '#FFFFFF',
      badgeStyle: 'circle',
      badgeColor: '#E11D48',
    },
  },
  {
    name: 'Glacier Pure White vs Cyber Charcoal',
    homeKit: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#E2E8F0',
      accentColor: '#CBD5E1',
      pattern: 'solid',
      gkPrimaryColor: '#14B8A6',
      gkSecondaryColor: '#0F766E',
      numberColor: '#0F172A',
      badgeStyle: 'shield',
      badgeColor: '#FFFFFF',
    },
    awayKit: {
      primaryColor: '#18181B',
      secondaryColor: '#27272A',
      accentColor: '#71717A',
      pattern: 'solid',
      gkPrimaryColor: '#FB7185',
      gkSecondaryColor: '#9F1239',
      numberColor: '#CCFF00',
      badgeStyle: 'circle',
      badgeColor: '#18181B',
    },
  },
  {
    name: 'Vibrant Royal Purple vs Neon Volt',
    homeKit: {
      primaryColor: '#7E22CE',
      secondaryColor: '#9333EA',
      accentColor: '#E9D5FF',
      pattern: 'solid',
      gkPrimaryColor: '#EAB308',
      gkSecondaryColor: '#854D0E',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#7E22CE',
    },
    awayKit: {
      primaryColor: '#84CC16',
      secondaryColor: '#65A30D',
      accentColor: '#D9F99D',
      pattern: 'solid',
      gkPrimaryColor: '#06B6D4',
      gkSecondaryColor: '#155E75',
      numberColor: '#3B0764',
      badgeStyle: 'circle',
      badgeColor: '#84CC16',
    },
  },
  {
    name: 'Blaze Orange vs Deep Marine Cyan',
    homeKit: {
      primaryColor: '#EA580C',
      secondaryColor: '#C2410C',
      accentColor: '#FED7AA',
      pattern: 'solid',
      gkPrimaryColor: '#84CC16',
      gkSecondaryColor: '#3F6212',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#EA580C',
    },
    awayKit: {
      primaryColor: '#0E7490',
      secondaryColor: '#155E75',
      accentColor: '#A5F3FC',
      pattern: 'solid',
      gkPrimaryColor: '#FBBF24',
      gkSecondaryColor: '#B45309',
      numberColor: '#FFFFFF',
      badgeStyle: 'circle',
      badgeColor: '#0E7490',
    },
  },
  {
    name: 'Deep Maroon Burgundy vs Ice Cyan',
    homeKit: {
      primaryColor: '#881337',
      secondaryColor: '#4C0519',
      accentColor: '#FECDD3',
      pattern: 'solid',
      gkPrimaryColor: '#22C55E',
      gkSecondaryColor: '#15803D',
      numberColor: '#E0F2FE',
      badgeStyle: 'shield',
      badgeColor: '#881337',
    },
    awayKit: {
      primaryColor: '#38BDF8',
      secondaryColor: '#0284C7',
      accentColor: '#E0F2FE',
      pattern: 'solid',
      gkPrimaryColor: '#A855F7',
      gkSecondaryColor: '#6B21A8',
      numberColor: '#4C0519',
      badgeStyle: 'circle',
      badgeColor: '#38BDF8',
    },
  },
  {
    name: 'Turquoise Teal vs Sunset Coral',
    homeKit: {
      primaryColor: '#0D9488',
      secondaryColor: '#14B8A6',
      accentColor: '#99F6E4',
      pattern: 'solid',
      gkPrimaryColor: '#F59E0B',
      gkSecondaryColor: '#B45309',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#0D9488',
    },
    awayKit: {
      primaryColor: '#F43F5E',
      secondaryColor: '#BE123C',
      accentColor: '#FFE4E6',
      pattern: 'solid',
      gkPrimaryColor: '#00D1FF',
      gkSecondaryColor: '#002B49',
      numberColor: '#FFFFFF',
      badgeStyle: 'circle',
      badgeColor: '#F43F5E',
    },
  },
  {
    name: 'Classic Royal Azure vs Fiery Crimson',
    homeKit: {
      primaryColor: '#2563EB',
      secondaryColor: '#1D4ED8',
      accentColor: '#BFDBFE',
      pattern: 'solid',
      gkPrimaryColor: '#84CC16',
      gkSecondaryColor: '#4D7C0F',
      numberColor: '#FFFFFF',
      badgeStyle: 'shield',
      badgeColor: '#2563EB',
    },
    awayKit: {
      primaryColor: '#EF4444',
      secondaryColor: '#B91C1C',
      accentColor: '#FECACA',
      pattern: 'solid',
      gkPrimaryColor: '#F59E0B',
      gkSecondaryColor: '#92400E',
      numberColor: '#FFFFFF',
      badgeStyle: 'circle',
      badgeColor: '#EF4444',
    },
  },
  {
    name: 'Electric Neon Cyan vs Hot Fuchsia',
    homeKit: {
      primaryColor: '#06B6D4',
      secondaryColor: '#0891B2',
      accentColor: '#CFFAFE',
      pattern: 'solid',
      gkPrimaryColor: '#A3E635',
      gkSecondaryColor: '#4D7C0F',
      numberColor: '#0F172A',
      badgeStyle: 'shield',
      badgeColor: '#06B6D4',
    },
    awayKit: {
      primaryColor: '#D946EF',
      secondaryColor: '#A21CAF',
      accentColor: '#FDF4FF',
      pattern: 'solid',
      gkPrimaryColor: '#F97316',
      gkSecondaryColor: '#9A3412',
      numberColor: '#FFFFFF',
      badgeStyle: 'circle',
      badgeColor: '#D946EF',
    },
  },
];

let lastThemeIndex = -1;

export function getRandomKitPair(): KitPairTheme {
  let nextIndex: number;
  do {
    nextIndex = Math.floor(Math.random() * DYNAMIC_KIT_PAIRS.length);
  } while (nextIndex === lastThemeIndex && DYNAMIC_KIT_PAIRS.length > 1);

  lastThemeIndex = nextIndex;
  return DYNAMIC_KIT_PAIRS[nextIndex];
}

export function applyDynamicKits(
  homeSquad: SquadData,
  awaySquad: SquadData,
  presetPair?: KitPairTheme
): { updatedHome: SquadData; updatedAway: SquadData } {
  const chosenPair = presetPair || getRandomKitPair();

  const updatedHome: SquadData = {
    ...homeSquad,
    kit: {
      ...chosenPair.homeKit,
    },
  };

  const updatedAway: SquadData = {
    ...awaySquad,
    kit: {
      ...chosenPair.awayKit,
    },
  };

  return { updatedHome, updatedAway };
}
