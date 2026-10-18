'use client';

import { useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import TeamCard, { type TeamCardProps } from './TeamCard';
import { cx } from '../lib/format';

type RecordFilter = 'all' | 'winning' | 'level-or-behind';
type SortKey = 'table' | 'name';

const FILTERS: Array<{ value: RecordFilter; label: string }> = [
  { value: 'all', label: 'All teams' },
  { value: 'winning', label: 'Winning record' },
  { value: 'level-or-behind', label: 'Level or behind' },
];

interface TeamDirectoryProps {
  entries: TeamCardProps[];
}

export default function TeamDirectory({ entries }: TeamDirectoryProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RecordFilter>('all');
  const [sort, setSort] = useState<SortKey>('table');
  const searchId = useId();
  const sortId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter(
        ({ team }) =>
          !q ||
          `${team.name} ${team.identity} ${team.code}`.toLowerCase().includes(q)
      )
      .filter(({ standing }) => {
        if (filter === 'winning') return standing.wins > standing.losses;
        if (filter === 'level-or-behind')
          return standing.wins <= standing.losses;
        return true;
      })
      .sort((a, b) =>
        sort === 'name'
          ? a.team.name.localeCompare(b.team.name)
          : a.standing.position - b.standing.position
      );
  }, [entries, query, filter, sort]);

  const reset = () => {
    setQuery('');
    setFilter('all');
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor={searchId} className="sr-only">
            Search teams by name
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAB8CA]"
            aria-hidden="true"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams"
            className="h-12 w-full border border-white/15 bg-[#0A1D35] pl-10 pr-3 text-base text-white placeholder:text-[#AAB8CA]/70 focus:border-[#F5C65D] focus:ring-0"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            role="group"
            aria-label="Filter by sample record"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cx(
                  'h-10 border px-3.5 text-sm font-semibold transition-colors',
                  filter === f.value
                    ? 'border-[#F5C65D] bg-[#F5C65D] text-[#061426]'
                    : 'border-white/15 text-[#AAB8CA] hover:border-white/40 hover:text-white'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={sortId} className="text-sm text-[#AAB8CA]">
              Sort
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 border border-white/15 bg-[#0A1D35] py-0 pl-3 pr-9 text-sm text-white focus:border-[#F5C65D] focus:ring-0"
            >
              <option value="table">Sample table position</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-[#AAB8CA]" aria-live="polite">
        Showing {visible.length} of {entries.length} teams
      </p>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((entry) => (
            <li key={entry.team.id}>
              <TeamCard {...entry} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 border border-dashed border-white/20 px-6 py-14 text-center">
          <p className="nl-display text-3xl font-black">No teams match</p>
          <p className="mt-2 text-[#AAB8CA]">
            Try a different name, or clear the search and filters.
          </p>
          <button
            type="button"
            onClick={reset}
            className="nl-btn nl-btn--line nl-btn--sm mt-6"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  );
}
