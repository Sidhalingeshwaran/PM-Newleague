/**
 * SAMPLE franchise data.
 *
 * These eight franchises, their owners and identities are fictional
 * placeholders for the frontend. They are not registered franchises or
 * confirmed owners. Replace this file with official data when available.
 */

export type TeamEmblem =
  | 'bolt'
  | 'crown'
  | 'flame'
  | 'shuriken'
  | 'wing'
  | 'wave'
  | 'eclipse'
  | 'star';

export interface TeamColors {
  /** Main team colour, used for accents on the navy background. */
  primary: string;
  /** Deep partner colour, used for panels and crest fills. */
  secondary: string;
  /** Readable text colour when placed on `primary`. */
  onPrimary: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  code: string;
  identity: string;
  /** Sample owner name — not a confirmed franchise owner. */
  owner: string;
  emblem: TeamEmblem;
  colors: TeamColors;
  tagline: string;
  description: string;
}

export const teams: Team[] = [
  {
    id: 'thunder-smashers',
    slug: 'thunder-smashers',
    name: 'Thunder Smashers',
    code: 'TS',
    identity: 'Thunder',
    owner: 'Arjun Reddy',
    emblem: 'bolt',
    colors: { primary: '#FFD23F', secondary: '#3B2A8F', onPrimary: '#14102E' },
    tagline: 'Loud from the back court.',
    description:
      'Built around steep, relentless attack. The Smashers want every rally to end with the shuttle driven into the floor.',
  },
  {
    id: 'royal-racquets',
    slug: 'royal-racquets',
    name: 'Royal Racquets',
    code: 'RR',
    identity: 'Royals',
    owner: 'Vikram Shetty',
    emblem: 'crown',
    colors: { primary: '#9B7BFF', secondary: '#2E1A6B', onPrimary: '#140A33' },
    tagline: 'Patience is a weapon.',
    description:
      'A side that controls the tempo with tight net play and deep clears, waiting for the one loose lift.',
  },
  {
    id: 'blaze-warriors',
    slug: 'blaze-warriors',
    name: 'Blaze Warriors',
    code: 'BW',
    identity: 'Blaze',
    owner: 'Pranav Gowda',
    emblem: 'flame',
    colors: { primary: '#FF6B2C', secondary: '#6B1E05', onPrimary: '#2A0A00' },
    tagline: 'Fast hands, faster starts.',
    description:
      'The Warriors play the flat, fast game — drives, pushes and early pressure from the very first serve.',
  },
  {
    id: 'net-ninjas',
    slug: 'net-ninjas',
    name: 'Net Ninjas',
    code: 'NN',
    identity: 'Ninjas',
    owner: 'Rahul Varma',
    emblem: 'shuriken',
    colors: { primary: '#19D3B4', secondary: '#0A3E3B', onPrimary: '#03201D' },
    tagline: 'Gone before you see it.',
    description:
      'Quiet, precise and deceptive at the net. The Ninjas win the short exchanges that decide close games.',
  },
  {
    id: 'golden-falcons',
    slug: 'golden-falcons',
    name: 'Golden Falcons',
    code: 'GF',
    identity: 'Falcons',
    owner: 'Sanjay Kumar',
    emblem: 'wing',
    colors: { primary: '#F2B544', secondary: '#5C3A00', onPrimary: '#241600' },
    tagline: 'Strike from height.',
    description:
      'A tall, rangy squad that loves the jump smash and covers the rear court with long, easy strides.',
  },
  {
    id: 'storm-breakers',
    slug: 'storm-breakers',
    name: 'Storm Breakers',
    code: 'SB',
    identity: 'Storm',
    owner: 'Naveen Raj',
    emblem: 'wave',
    colors: { primary: '#3FB0FF', secondary: '#0B3566', onPrimary: '#021A33' },
    tagline: 'Every rally, a pressure system.',
    description:
      'Endurance first. The Breakers stretch rallies out and grind opponents down over three long games.',
  },
  {
    id: 'shadow-strikers',
    slug: 'shadow-strikers',
    name: 'Shadow Strikers',
    code: 'SS',
    identity: 'Shadows',
    owner: 'Deepak Shetty',
    emblem: 'eclipse',
    colors: { primary: '#C3CCDD', secondary: '#262C3A', onPrimary: '#10141D' },
    tagline: 'Read the play. Steal the point.',
    description:
      'Disguise and anticipation define the Strikers — late holds, reverse slices and interceptions at the forecourt.',
  },
  {
    id: 'elite-smashers',
    slug: 'elite-smashers',
    name: 'Elite Smashers',
    code: 'ES',
    identity: 'Elite',
    owner: 'Manoj Reddy',
    emblem: 'star',
    colors: { primary: '#FF4D7A', secondary: '#5E0B26', onPrimary: '#2A0010' },
    tagline: 'Polish under pressure.',
    description:
      'A balanced, all-court roster that prides itself on clean technique and calm finishes at 20-all.',
  },
];
