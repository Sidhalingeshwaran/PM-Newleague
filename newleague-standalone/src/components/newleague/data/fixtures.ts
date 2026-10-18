/**
 * SAMPLE fixture data — a single round robin between the eight sample
 * franchises (7 rounds, 28 ties).
 *
 * These are NOT an official timetable. Dates, times, venue use and results
 * are illustrative only. Rounds 6 and 7 are deliberately left unscheduled
 * ("date to be announced") to show the unscheduled state.
 *
 * Scores are sample tie scores (rubbers won by each side). Standings are
 * derived from these results in `lib/standings.ts`, so the two always agree.
 */

export type FixtureStatus = 'completed' | 'scheduled' | 'tba';

export interface FixtureScore {
  home: number;
  away: number;
}

export interface Fixture {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  /** ISO date (yyyy-mm-dd), or null when not yet scheduled. */
  date: string | null;
  /** 24h local time (HH:mm), or null when not yet scheduled. */
  time: string | null;
  status: FixtureStatus;
  score?: FixtureScore;
}

/** Sample venue for scheduled fixtures — the venue partner named on the banner. */
export const SAMPLE_VENUE = 'Zeal Badminton and Sports Elite';

export const fixtures: Fixture[] = [
  {
    id: 'M01',
    round: 1,
    homeTeamId: 'thunder-smashers',
    awayTeamId: 'elite-smashers',
    date: '2026-10-03',
    time: '18:00',
    status: 'completed',
    score: { home: 3, away: 1 },
  },
  {
    id: 'M02',
    round: 1,
    homeTeamId: 'royal-racquets',
    awayTeamId: 'shadow-strikers',
    date: '2026-10-03',
    time: '19:30',
    status: 'completed',
    score: { home: 3, away: 1 },
  },
  {
    id: 'M03',
    round: 1,
    homeTeamId: 'blaze-warriors',
    awayTeamId: 'storm-breakers',
    date: '2026-10-04',
    time: '18:00',
    status: 'completed',
    score: { home: 3, away: 0 },
  },
  {
    id: 'M04',
    round: 1,
    homeTeamId: 'net-ninjas',
    awayTeamId: 'golden-falcons',
    date: '2026-10-04',
    time: '19:30',
    status: 'completed',
    score: { home: 3, away: 0 },
  },
  {
    id: 'M05',
    round: 2,
    homeTeamId: 'shadow-strikers',
    awayTeamId: 'thunder-smashers',
    date: '2026-10-10',
    time: '18:00',
    status: 'completed',
    score: { home: 3, away: 1 },
  },
  {
    id: 'M06',
    round: 2,
    homeTeamId: 'elite-smashers',
    awayTeamId: 'storm-breakers',
    date: '2026-10-10',
    time: '19:30',
    status: 'completed',
    score: { home: 3, away: 0 },
  },
  {
    id: 'M07',
    round: 2,
    homeTeamId: 'royal-racquets',
    awayTeamId: 'golden-falcons',
    date: '2026-10-11',
    time: '18:00',
    status: 'completed',
    score: { home: 2, away: 3 },
  },
  {
    id: 'M08',
    round: 2,
    homeTeamId: 'blaze-warriors',
    awayTeamId: 'net-ninjas',
    date: '2026-10-11',
    time: '19:30',
    status: 'completed',
    score: { home: 3, away: 0 },
  },
  {
    id: 'M09',
    round: 3,
    homeTeamId: 'thunder-smashers',
    awayTeamId: 'storm-breakers',
    date: '2026-10-17',
    time: '18:00',
    status: 'completed',
    score: { home: 2, away: 3 },
  },
  {
    id: 'M10',
    round: 3,
    homeTeamId: 'shadow-strikers',
    awayTeamId: 'golden-falcons',
    date: '2026-10-17',
    time: '19:30',
    status: 'completed',
    score: { home: 0, away: 3 },
  },
  {
    id: 'M11',
    round: 3,
    homeTeamId: 'elite-smashers',
    awayTeamId: 'net-ninjas',
    date: '2026-10-18',
    time: '18:00',
    status: 'completed',
    score: { home: 3, away: 2 },
  },
  {
    id: 'M12',
    round: 3,
    homeTeamId: 'royal-racquets',
    awayTeamId: 'blaze-warriors',
    date: '2026-10-18',
    time: '19:30',
    status: 'completed',
    score: { home: 3, away: 0 },
  },
  {
    id: 'M13',
    round: 4,
    homeTeamId: 'golden-falcons',
    awayTeamId: 'thunder-smashers',
    date: '2026-10-24',
    time: '18:00',
    status: 'scheduled',
  },
  {
    id: 'M14',
    round: 4,
    homeTeamId: 'storm-breakers',
    awayTeamId: 'net-ninjas',
    date: '2026-10-24',
    time: '19:30',
    status: 'scheduled',
  },
  {
    id: 'M15',
    round: 4,
    homeTeamId: 'shadow-strikers',
    awayTeamId: 'blaze-warriors',
    date: '2026-10-25',
    time: '18:00',
    status: 'scheduled',
  },
  {
    id: 'M16',
    round: 4,
    homeTeamId: 'elite-smashers',
    awayTeamId: 'royal-racquets',
    date: '2026-10-25',
    time: '19:30',
    status: 'scheduled',
  },
  {
    id: 'M17',
    round: 5,
    homeTeamId: 'thunder-smashers',
    awayTeamId: 'net-ninjas',
    date: '2026-10-31',
    time: '18:00',
    status: 'scheduled',
  },
  {
    id: 'M18',
    round: 5,
    homeTeamId: 'golden-falcons',
    awayTeamId: 'blaze-warriors',
    date: '2026-10-31',
    time: '19:30',
    status: 'scheduled',
  },
  {
    id: 'M19',
    round: 5,
    homeTeamId: 'storm-breakers',
    awayTeamId: 'royal-racquets',
    date: '2026-11-01',
    time: '18:00',
    status: 'scheduled',
  },
  {
    id: 'M20',
    round: 5,
    homeTeamId: 'shadow-strikers',
    awayTeamId: 'elite-smashers',
    date: '2026-11-01',
    time: '19:30',
    status: 'scheduled',
  },
  {
    id: 'M21',
    round: 6,
    homeTeamId: 'blaze-warriors',
    awayTeamId: 'thunder-smashers',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M22',
    round: 6,
    homeTeamId: 'net-ninjas',
    awayTeamId: 'royal-racquets',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M23',
    round: 6,
    homeTeamId: 'golden-falcons',
    awayTeamId: 'elite-smashers',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M24',
    round: 6,
    homeTeamId: 'storm-breakers',
    awayTeamId: 'shadow-strikers',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M25',
    round: 7,
    homeTeamId: 'thunder-smashers',
    awayTeamId: 'royal-racquets',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M26',
    round: 7,
    homeTeamId: 'blaze-warriors',
    awayTeamId: 'elite-smashers',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M27',
    round: 7,
    homeTeamId: 'net-ninjas',
    awayTeamId: 'shadow-strikers',
    date: null,
    time: null,
    status: 'tba',
  },
  {
    id: 'M28',
    round: 7,
    homeTeamId: 'golden-falcons',
    awayTeamId: 'storm-breakers',
    date: null,
    time: null,
    status: 'tba',
  },
];
