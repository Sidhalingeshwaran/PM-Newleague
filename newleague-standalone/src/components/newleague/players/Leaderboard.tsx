import type { Player } from '../data/players';
import { requireTeam } from '../lib/selectors';
import { leagueRoutes } from '../data/league';
import Link from 'next/link';

interface LeaderboardProps {
  players: Player[];
  limit?: number;
}

/** Ranked list by the sample performance index, with proportional bars. */
export default function Leaderboard({ players, limit = 10 }: LeaderboardProps) {
  const ranked = [...players]
    .sort(
      (a, b) =>
        b.stats.rating - a.stats.rating ||
        b.stats.wins - a.stats.wins ||
        a.name.localeCompare(b.name)
    )
    .slice(0, limit);
  const max = 100;

  return (
    <ol className="divide-y divide-white/10 border-y border-white/10">
      {ranked.map((p, i) => {
        const team = requireTeam(p.teamId);
        return (
          <li
            key={p.id}
            className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-3 sm:grid-cols-[3rem_minmax(0,16rem)_1fr_auto] sm:gap-5"
          >
            <span className="nl-numeral text-2xl font-black text-[#AAB8CA]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <Link
                href={leagueRoutes.player(p.id)}
                scroll={false}
                prefetch={false}
                className="block truncate font-semibold hover:underline"
              >
                {p.name}
              </Link>
              <span
                className="block truncate text-xs"
                style={{ color: team.colors.primary }}
              >
                {team.name}
              </span>
            </div>
            <div
              className="hidden h-2 bg-white/[0.06] sm:block"
              aria-hidden="true"
            >
              <div
                className="h-full"
                style={{
                  width: `${(p.stats.rating / max) * 100}%`,
                  background: team.colors.primary,
                }}
              />
            </div>
            <span className="nl-numeral text-2xl font-black text-[#F5C65D]">
              {p.stats.rating}
              <span className="sr-only"> rating</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
