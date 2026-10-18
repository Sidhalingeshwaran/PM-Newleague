'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Search, X } from 'lucide-react';
import type { Player, PlayerCategory } from '../data/players';
import { playerCategories } from '../data/players';
import type { Team } from '../data/teams';
import { leagueRoutes } from '../data/league';
import { cx, winRate } from '../lib/format';
import PlayerAvatar from '../ui/PlayerAvatar';
import SampleBadge from '../ui/SampleBadge';
import PlayerCard from './PlayerCard';

interface PlayerDirectoryProps {
  players: Player[];
  teams: Team[];
}

/**
 * Searchable, filterable player grid with a native <dialog> profile.
 * The open profile is reflected in `?player=<id>` so it can be linked to
 * (team pages deep-link here) and survives a refresh.
 */
export default function PlayerDirectory({
  players,
  teams,
}: PlayerDirectoryProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const [query, setQuery] = useState('');
  const [teamId, setTeamId] = useState('all');
  const [category, setCategory] = useState<'all' | PlayerCategory>('all');
  const [mvpOnly, setMvpOnly] = useState(false);
  const ids = {
    search: useId(),
    team: useId(),
    category: useId(),
    mvp: useId(),
  };

  const selectedId = searchParams.get('player');
  const teamById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);
  const selected = useMemo(
    () => players.find((p) => p.id === selectedId) ?? null,
    [players, selectedId]
  );
  const selectedTeam = selected ? teamById.get(selected.teamId) : undefined;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((p) => {
      if (mvpOnly && !p.isMvp) return false;
      if (teamId !== 'all' && p.teamId !== teamId) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (
        q &&
        !`${p.name} ${teamById.get(p.teamId)?.name ?? ''}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [players, query, teamId, category, mvpOnly, teamById]);

  const setPlayerParam = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set('player', id);
      else params.delete('player');
      const qs = params.toString();
      // Native history update (supported since Next 14.1): keeps
      // useSearchParams in sync without a server round trip.
      window.history.replaceState(
        null,
        '',
        qs ? `${pathname}?${qs}` : pathname
      );
    },
    [pathname, searchParams]
  );

  // Keep the native dialog in sync with the URL.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  const openProfile = (id: string, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setPlayerParam(id);
  };

  const onDialogClose = () => {
    if (selectedId) setPlayerParam(null);
    returnFocusRef.current?.focus();
  };

  const reset = () => {
    setQuery('');
    setTeamId('all');
    setCategory('all');
    setMvpOnly(false);
  };

  return (
    <div>
      <div className="grid gap-3 border-y border-white/10 py-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center">
        <div className="relative">
          <label htmlFor={ids.search} className="sr-only">
            Search players by name or team
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAB8CA]"
            aria-hidden="true"
          />
          <input
            id={ids.search}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players"
            className="h-12 w-full border border-white/15 bg-[#0A1D35] pl-10 pr-3 text-base text-white placeholder:text-[#AAB8CA]/70 focus:border-[#F5C65D] focus:ring-0"
          />
        </div>
        <div>
          <label htmlFor={ids.team} className="sr-only">
            Filter by team
          </label>
          <select
            id={ids.team}
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="h-12 w-full border border-white/15 bg-[#0A1D35] pl-3 pr-9 text-sm text-white focus:border-[#F5C65D] focus:ring-0"
          >
            <option value="all">All teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.category} className="sr-only">
            Filter by playing category
          </label>
          <select
            id={ids.category}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as 'all' | PlayerCategory)
            }
            className="h-12 w-full border border-white/15 bg-[#0A1D35] pl-3 pr-9 text-sm text-white focus:border-[#F5C65D] focus:ring-0"
          >
            <option value="all">All categories</option>
            {playerCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <label
          htmlFor={ids.mvp}
          className="flex h-12 cursor-pointer items-center gap-3 border border-white/15 px-4 text-sm"
        >
          <input
            id={ids.mvp}
            type="checkbox"
            checked={mvpOnly}
            onChange={(e) => setMvpOnly(e.target.checked)}
            className="h-4 w-4 rounded-none border-white/40 bg-transparent text-[#F5C65D] focus:ring-[#F5C65D] focus:ring-offset-0"
          />
          MVPs only
        </label>
      </div>

      <p className="mt-4 text-sm text-[#AAB8CA]" aria-live="polite">
        Showing {visible.length} of {players.length} players
      </p>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => {
            const team = teamById.get(p.teamId);
            if (!team) return null;
            return (
              <li key={p.id}>
                <PlayerCard
                  player={p}
                  team={team}
                  headingLevel="h3"
                  action={
                    <button
                      type="button"
                      onClick={(e) => openProfile(p.id, e.currentTarget)}
                      className="nl-btn nl-btn--line nl-btn--sm w-full"
                      aria-haspopup="dialog"
                    >
                      View profile<span className="sr-only">: {p.name}</span>
                    </button>
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-6 border border-dashed border-white/20 px-6 py-14 text-center">
          <p className="nl-display text-3xl font-black">No players match</p>
          <p className="mt-2 text-[#AAB8CA]">
            Try another name, team or category.
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

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-labelledby="nl-player-dialog-title"
        className="nl-dialog m-auto w-[min(92vw,720px)] max-h-[90vh] overflow-y-auto border border-white/15 bg-[#0A1D35] p-0 text-white"
      >
        {selected && selectedTeam && (
          <div className="grid md:grid-cols-[260px_1fr]">
            <PlayerAvatar
              player={selected}
              team={selectedTeam}
              className="aspect-[4/3] md:aspect-auto md:h-full"
            />
            <div className="relative p-6 md:p-8">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center text-[#AAB8CA] hover:text-white"
                aria-label="Close profile"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <SampleBadge>Sample profile</SampleBadge>
              <h2
                id="nl-player-dialog-title"
                className="mt-4 pr-8 text-5xl font-black"
              >
                {selected.name}
              </h2>
              <p className="mt-2 text-sm">
                <span
                  className="font-semibold"
                  style={{ color: selectedTeam.colors.primary }}
                >
                  {selectedTeam.name}
                </span>
                <span className="text-[#AAB8CA]"> — {selected.category}</span>
                {selected.isMvp && (
                  <span className="ml-2 font-semibold text-[#F5C65D]">
                    Team MVP
                  </span>
                )}
              </p>
              <p className="mt-5 leading-relaxed text-[#AAB8CA]">
                {selected.bio}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
                {[
                  ['Played', selected.stats.matchesPlayed],
                  ['Won', selected.stats.wins],
                  [
                    'Win rate',
                    `${winRate(
                      selected.stats.wins,
                      selected.stats.matchesPlayed
                    )}%`,
                  ],
                  ['Rating', selected.stats.rating],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#0A1D35] p-3">
                    <dt className="text-[11px] text-[#AAB8CA]">{label}</dt>
                    <dd className="nl-numeral text-3xl font-extrabold">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-[#AAB8CA]">
                Rally points won (sample):{' '}
                <span className="nl-numeral text-base text-white">
                  {selected.stats.pointsWon}
                </span>
              </p>
              <Link
                href={leagueRoutes.team(selectedTeam.slug)}
                className={cx('nl-btn nl-btn--gold nl-btn--sm mt-6')}
              >
                View {selectedTeam.name}
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
