import Link from 'next/link';
import type { Fixture } from '../data/fixtures';
import { SAMPLE_VENUE } from '../data/fixtures';
import type { Team } from '../data/teams';
import { leagueRoutes } from '../data/league';
import { cx, formatFixtureDate, formatTime } from '../lib/format';
import TeamCrest from '../ui/TeamCrest';

const STATUS_LABEL: Record<Fixture['status'], string> = {
  completed: 'Completed',
  scheduled: 'Scheduled',
  tba: 'Date to be announced',
};

interface FixtureCardProps {
  fixture: Fixture;
  home: Team;
  away: Team;
}

function Side({
  team,
  score,
  won,
  align,
}: {
  team: Team;
  score?: number;
  won: boolean;
  align: 'left' | 'right';
}) {
  return (
    <div
      className={cx(
        'flex min-w-0 flex-1 items-center gap-3',
        align === 'right' && 'flex-row-reverse text-right'
      )}
    >
      <TeamCrest team={team} size={40} />
      <div className="min-w-0">
        <Link
          href={leagueRoutes.team(team.slug)}
          className={cx(
            'nl-display block text-xl font-extrabold leading-none hover:underline sm:text-2xl',
            !won && score !== undefined && 'text-[#AAB8CA]'
          )}
        >
          <span className="sm:hidden">{team.code}</span>
          <span className="hidden sm:inline">{team.name}</span>
        </Link>
      </div>
      {score !== undefined && (
        <span
          className={cx(
            'nl-numeral ml-auto text-4xl font-black leading-none',
            align === 'right' && 'ml-0 mr-auto',
            won ? 'text-[#F5C65D]' : 'text-white/40'
          )}
          aria-hidden="true"
        >
          {score}
        </span>
      )}
    </div>
  );
}

/** Match card used on the homepage, schedule and team pages. */
export default function FixtureCard({ fixture, home, away }: FixtureCardProps) {
  const { score, status } = fixture;
  const homeWon = !!score && score.home > score.away;
  const awayWon = !!score && score.away > score.home;
  const winner = homeWon ? home : awayWon ? away : null;

  return (
    <article
      className="relative border border-white/10 bg-[#0A1D35]/70 p-5 transition-colors hover:border-white/25"
      aria-label={`${fixture.id}: ${home.name} versus ${away.name}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="text-[#AAB8CA]">
          <span className="nl-numeral text-sm font-extrabold text-white">
            {fixture.id}
          </span>
          <span className="mx-2 text-white/30" aria-hidden="true">
            /
          </span>
          Round {fixture.round}
        </p>
        <span
          className={cx(
            'border px-2 py-0.5 font-semibold',
            status === 'completed' && 'border-white/20 text-[#AAB8CA]',
            status === 'scheduled' && 'border-[#168BFF] text-[#7CC0FF]',
            status === 'tba' && 'border-dashed border-white/30 text-[#AAB8CA]'
          )}
        >
          {STATUS_LABEL[status]}
        </span>
      </header>

      <div className="mt-5 flex items-center gap-3">
        <Side team={home} score={score?.home} won={homeWon} align="left" />
        <span className="nl-display shrink-0 text-sm font-extrabold text-white/40">
          VS
        </span>
        <Side team={away} score={score?.away} won={awayWon} align="right" />
      </div>

      {score && (
        <p className="sr-only">
          Sample result: {home.name} {score.home}, {away.name} {score.away}.{' '}
          {winner ? `${winner.name} won.` : ''}
        </p>
      )}

      <footer className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-4 text-sm text-[#AAB8CA]">
        {fixture.date && fixture.time ? (
          <>
            <span>
              <span className="sr-only">Date: </span>
              {formatFixtureDate(fixture.date)}
            </span>
            <span>
              <span className="sr-only">Time: </span>
              {formatTime(fixture.time)}
            </span>
            <span>
              <span className="sr-only">Venue: </span>
              {SAMPLE_VENUE}
            </span>
          </>
        ) : (
          <span>Date, time and venue to be announced</span>
        )}
      </footer>
    </article>
  );
}
