import { fixtures, type Fixture } from '../data/fixtures';
import { players, type Player } from '../data/players';
import { teams, type Team } from '../data/teams';
import { calculateStandings, type StandingRow } from './standings';

/** Shared, derived views over the sample data. Pages read from here only. */

const teamById = new Map(teams.map((t) => [t.id, t]));
const teamBySlug = new Map(teams.map((t) => [t.slug, t]));

export const standings: StandingRow[] = calculateStandings(teams, fixtures);
const standingByTeam = new Map(standings.map((s) => [s.teamId, s]));

export function getTeamById(id: string): Team | undefined {
  return teamById.get(id);
}

/** For data that is guaranteed to reference a valid team. */
export function requireTeam(id: string): Team {
  const team = teamById.get(id);
  if (!team) throw new Error(`Unknown team id: ${id}`);
  return team;
}

export function getTeamBySlug(slug: string): Team | undefined {
  return teamBySlug.get(slug);
}

export function getPlayersByTeam(teamId: string): Player[] {
  return players.filter((p) => p.teamId === teamId);
}

export function getTeamMvp(teamId: string): Player | undefined {
  return players.find((p) => p.teamId === teamId && p.isMvp);
}

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getTeamStanding(teamId: string): StandingRow {
  const row = standingByTeam.get(teamId);
  if (!row) throw new Error(`No standing for team: ${teamId}`);
  return row;
}

export function getTeamFixtures(teamId: string): Fixture[] {
  return fixtures.filter(
    (f) => f.homeTeamId === teamId || f.awayTeamId === teamId
  );
}

export function getUpcomingFixtures(limit?: number): Fixture[] {
  const upcoming = fixtures.filter((f) => f.status === 'scheduled');
  return typeof limit === 'number' ? upcoming.slice(0, limit) : upcoming;
}

export function getCompletedFixtures(): Fixture[] {
  return fixtures.filter((f) => f.status === 'completed');
}

export function getMvps(): Player[] {
  return players.filter((p) => p.isMvp);
}

export { teams, players, fixtures };
