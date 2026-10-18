'use client';

import { useId, useMemo, useState } from 'react';
import type { Fixture, FixtureStatus } from '../data/fixtures';
import type { Team } from '../data/teams';
import { cx } from '../lib/format';
import FixtureCard from './FixtureCard';

type View = 'all' | 'upcoming' | 'completed';

const VIEWS: Array<{ value: View; label: string }> = [
  { value: 'all', label: 'All matches' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

interface ScheduleExplorerProps {
  fixtures: Fixture[];
  teams: Team[];
}

export default function ScheduleExplorer({
  fixtures,
  teams,
}: ScheduleExplorerProps) {
  const [view, setView] = useState<View>('all');
  const [teamId, setTeamId] = useState('all');
  const [status, setStatus] = useState<'any' | FixtureStatus>('any');
  const teamSelectId = useId();
  const statusSelectId = useId();

  const teamById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const rounds = useMemo(() => {
    const filtered = fixtures.filter((f) => {
      if (view === 'upcoming' && f.status === 'completed') return false;
      if (view === 'completed' && f.status !== 'completed') return false;
      if (status !== 'any' && f.status !== status) return false;
      if (
        teamId !== 'all' &&
        f.homeTeamId !== teamId &&
        f.awayTeamId !== teamId
      )
        return false;
      return true;
    });
    const byRound = new Map<number, Fixture[]>();
    for (const f of filtered)
      byRound.set(f.round, [...(byRound.get(f.round) ?? []), f]);
    return Array.from(byRound.entries()).sort(([a], [b]) => a - b);
  }, [fixtures, view, status, teamId]);

  const total = rounds.reduce((n, [, list]) => n + list.length, 0);

  const reset = () => {
    setView('all');
    setTeamId('all');
    setStatus('any');
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Show matches"
          className="flex flex-wrap gap-2"
        >
          {VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              aria-pressed={view === v.value}
              onClick={() => setView(v.value)}
              className={cx(
                'h-10 border px-4 text-sm font-semibold transition-colors',
                view === v.value
                  ? 'border-[#F5C65D] bg-[#F5C65D] text-[#061426]'
                  : 'border-white/15 text-[#AAB8CA] hover:border-white/40 hover:text-white'
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor={teamSelectId}
              className="w-14 shrink-0 text-sm text-[#AAB8CA] sm:w-auto"
            >
              Team
            </label>
            <select
              id={teamSelectId}
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="h-10 w-full min-w-0 border border-white/15 bg-[#0A1D35] py-0 pl-3 pr-9 text-sm text-white focus:border-[#F5C65D] focus:ring-0"
            >
              <option value="all">All teams</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor={statusSelectId}
              className="w-14 shrink-0 text-sm text-[#AAB8CA] sm:w-auto"
            >
              Status
            </label>
            <select
              id={statusSelectId}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'any' | FixtureStatus)
              }
              className="h-10 w-full min-w-0 border border-white/15 bg-[#0A1D35] py-0 pl-3 pr-9 text-sm text-white focus:border-[#F5C65D] focus:ring-0"
            >
              <option value="any">Any status</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="tba">Date to be announced</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-[#AAB8CA]" aria-live="polite">
        {total === 1 ? '1 match' : `${total} matches`} shown
      </p>

      {total === 0 ? (
        <div className="mt-6 border border-dashed border-white/20 px-6 py-14 text-center">
          <p className="nl-display text-3xl font-black">
            No matches for these filters
          </p>
          <p className="mt-2 text-[#AAB8CA]">
            Completed matches can&apos;t also be upcoming. Change the view or
            status, or reset everything.
          </p>
          <button
            type="button"
            onClick={reset}
            className="nl-btn nl-btn--line nl-btn--sm mt-6"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {rounds.map(([round, list]) => (
            <section key={round} aria-labelledby={`round-${round}`}>
              <div className="flex items-baseline gap-4">
                <h3 id={`round-${round}`} className="text-4xl font-black">
                  Round {round}
                </h3>
                <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
              </div>
              <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {list.map((f) => {
                  const home = teamById.get(f.homeTeamId);
                  const away = teamById.get(f.awayTeamId);
                  if (!home || !away) return null;
                  return (
                    <li key={f.id}>
                      <FixtureCard fixture={f} home={home} away={away} />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
