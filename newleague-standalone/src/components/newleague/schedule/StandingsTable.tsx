import Link from 'next/link';
import type { StandingRow } from '../lib/standings';
import { POINTS_PER_WIN } from '../lib/standings';
import { leagueRoutes } from '../data/league';
import { requireTeam } from '../lib/selectors';
import { cx } from '../lib/format';
import TeamCrest from '../ui/TeamCrest';

interface StandingsTableProps {
  rows: StandingRow[];
  caption?: string;
  highlightTeamId?: string;
  compact?: boolean;
}

/**
 * Semantic standings table. On narrow screens the rubber columns collapse
 * and team names shorten to codes, so the table never needs to scroll.
 */
export default function StandingsTable({
  rows,
  caption = 'Sample standings',
  highlightTeamId,
  compact,
}: StandingsTableProps) {
  return (
    <div className="border border-white/10">
      <table className="nl-table w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {caption}. Derived from sample results: {POINTS_PER_WIN} points per
          tie won; ties broken by rubber difference.
        </caption>
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-xs text-[#AAB8CA]">
            <th scope="col" className="w-12 py-3 pl-4 font-semibold">
              <abbr title="Position" className="no-underline">
                Pos
              </abbr>
            </th>
            <th scope="col" className="py-3 font-semibold">
              Team
            </th>
            <th scope="col" className="py-3 text-center font-semibold">
              <abbr title="Played" className="no-underline">
                P
              </abbr>
            </th>
            <th scope="col" className="py-3 text-center font-semibold">
              <abbr title="Wins" className="no-underline">
                W
              </abbr>
            </th>
            <th scope="col" className="py-3 text-center font-semibold">
              <abbr title="Losses" className="no-underline">
                L
              </abbr>
            </th>
            {!compact && (
              <th
                scope="col"
                className="hidden py-3 text-center font-semibold md:table-cell"
              >
                Rubbers
              </th>
            )}
            <th scope="col" className="py-3 pr-4 text-right font-semibold">
              <abbr title="Points" className="no-underline">
                Pts
              </abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = requireTeam(row.teamId);
            const highlighted = row.teamId === highlightTeamId;
            return (
              <tr
                key={row.teamId}
                className={cx(
                  'border-b border-white/5 last:border-0',
                  highlighted && 'bg-[#F5C65D]/10'
                )}
              >
                <td className="nl-numeral py-3 pl-4 text-lg font-extrabold text-[#AAB8CA]">
                  {row.position}
                </td>
                <th scope="row" className="py-2.5 pr-2 font-normal">
                  <Link
                    href={leagueRoutes.team(team.slug)}
                    className="flex items-center gap-2.5 hover:underline"
                  >
                    <TeamCrest team={team} size={26} />
                    <span className="font-semibold">
                      <span className="sm:hidden">{team.code}</span>
                      <span className="hidden sm:inline">{team.name}</span>
                    </span>
                  </Link>
                </th>
                <td className="nl-numeral py-3 text-center text-base">
                  {row.played}
                </td>
                <td className="nl-numeral py-3 text-center text-base">
                  {row.wins}
                </td>
                <td className="nl-numeral py-3 text-center text-base">
                  {row.losses}
                </td>
                {!compact && (
                  <td className="nl-numeral hidden py-3 text-center text-base text-[#AAB8CA] md:table-cell">
                    {row.rubbersWon}–{row.rubbersLost}
                  </td>
                )}
                <td className="nl-numeral py-3 pr-4 text-right text-xl font-black text-[#F5C65D]">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
