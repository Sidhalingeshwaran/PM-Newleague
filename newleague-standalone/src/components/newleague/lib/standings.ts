import type { Fixture } from '../data/fixtures';
import type { Team } from '../data/teams';

/** Sample points rule used for the demo table: 2 points per tie won. */
export const POINTS_PER_WIN = 2;

export interface StandingRow {
  position: number;
  teamId: string;
  played: number;
  wins: number;
  losses: number;
  rubbersWon: number;
  rubbersLost: number;
  points: number;
}

/**
 * Derives the standings table from completed fixtures so that results and
 * the table can never contradict each other.
 *
 * Ordering: points, then rubber difference, then rubbers won, then team name.
 */
export function calculateStandings(
  teams: readonly Team[],
  fixtures: readonly Fixture[]
): StandingRow[] {
  const rows = new Map<string, Omit<StandingRow, 'position'>>();
  for (const team of teams) {
    rows.set(team.id, {
      teamId: team.id,
      played: 0,
      wins: 0,
      losses: 0,
      rubbersWon: 0,
      rubbersLost: 0,
      points: 0,
    });
  }

  for (const fixture of fixtures) {
    if (fixture.status !== 'completed' || !fixture.score) continue;
    const home = rows.get(fixture.homeTeamId);
    const away = rows.get(fixture.awayTeamId);
    if (!home || !away) continue;

    const { home: h, away: a } = fixture.score;
    home.played += 1;
    away.played += 1;
    home.rubbersWon += h;
    home.rubbersLost += a;
    away.rubbersWon += a;
    away.rubbersLost += h;

    if (h > a) {
      home.wins += 1;
      away.losses += 1;
    } else if (a > h) {
      away.wins += 1;
      home.losses += 1;
    }
  }

  const nameOf = new Map(teams.map((t) => [t.id, t.name]));

  return Array.from(rows.values())
    .map((row) => ({ ...row, points: row.wins * POINTS_PER_WIN }))
    .sort(
      (x, y) =>
        y.points - x.points ||
        y.rubbersWon - y.rubbersLost - (x.rubbersWon - x.rubbersLost) ||
        y.rubbersWon - x.rubbersWon ||
        (nameOf.get(x.teamId) ?? '').localeCompare(nameOf.get(y.teamId) ?? '')
    )
    .map((row, index) => ({ ...row, position: index + 1 }));
}
