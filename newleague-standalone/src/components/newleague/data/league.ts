/**
 * League configuration for the T. Dasarahalli Premier Badminton League.
 *
 * Everything in this file comes from the franchise invitation banner supplied
 * by the organisers (league name, presenter, season, fee, venue partner and
 * contacts). Teams, players and fixtures live in their own files and are
 * SAMPLE data until official information is supplied.
 */

// Standalone build: the league is served from the site root, so the former
// '/newleague' prefix is empty and 'Home' points to '/'.
export const LEAGUE_BASE_PATH = '';

export const league = {
  name: 'T. Dasarahalli Premier Badminton League',
  shortName: 'TDPBL',
  presenter: 'RacketRush Badminton Academy',
  presenterShort: 'RacketRush',
  season: 4,
  year: 2026,
  seasonLabel: 'Season 4 — 2026',
  franchiseFee: 60000,
  venuePartner: 'Zeal Badminton and Sports Elite',
  locality: 'T. Dasarahalli',
} as const;

export interface LeagueContact {
  name: string;
  /** Exactly as printed on the organisers' banner. */
  phone: string;
}

/**
 * Contact numbers exactly as printed on the banner.
 * Note: the third number has 9 digits on the banner — confirm with the
 * organisers before launch.
 */
export const leagueContacts: LeagueContact[] = [
  { name: 'Naveen Devaraya', phone: '9740785523' },
  { name: 'Adarsh Kumar', phone: '9008862827' },
  { name: 'Mohan Babu', phone: '961114140' },
];

export interface LeagueNavItem {
  label: string;
  href: string;
}

export const leagueNav: LeagueNavItem[] = [
  { label: 'Home', href: LEAGUE_BASE_PATH || '/' },
  { label: 'About', href: `${LEAGUE_BASE_PATH}/about` },
  { label: 'Teams', href: `${LEAGUE_BASE_PATH}/teams` },
  { label: 'Schedule', href: `${LEAGUE_BASE_PATH}/schedule` },
  { label: 'Players', href: `${LEAGUE_BASE_PATH}/players` },
  { label: 'Contact', href: `${LEAGUE_BASE_PATH}/contact` },
];

export const leagueRoutes = {
  home: LEAGUE_BASE_PATH || '/',
  about: `${LEAGUE_BASE_PATH}/about`,
  teams: `${LEAGUE_BASE_PATH}/teams`,
  team: (slug: string) => `${LEAGUE_BASE_PATH}/teams/${slug}`,
  schedule: `${LEAGUE_BASE_PATH}/schedule`,
  players: `${LEAGUE_BASE_PATH}/players`,
  player: (id: string) => `${LEAGUE_BASE_PATH}/players?player=${id}`,
  contact: `${LEAGUE_BASE_PATH}/contact`,
} as const;
