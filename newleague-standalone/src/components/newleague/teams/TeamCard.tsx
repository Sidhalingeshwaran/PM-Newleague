'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { Team } from '../data/teams';
import type { Player } from '../data/players';
import type { StandingRow } from '../lib/standings';
import { leagueRoutes } from '../data/league';
import { useReducedMotion } from '../hooks/useReducedMotion';
import TeamCrest from '../ui/TeamCrest';

export interface TeamCardProps {
  team: Team;
  mvp?: Player;
  standing: StandingRow;
  roster?: Player[];
  /** Heading level for the team name within the surrounding outline. */
  headingLevel?: 'h2' | 'h3';
}

/**
 * Franchise card with pointer-driven tilt and a light that follows the
 * pointer. The whole card is reachable by keyboard through its Explore link;
 * tilt is purely decorative and disabled for reduced motion.
 */
export default function TeamCard({
  team,
  mvp,
  standing,
  roster,
  headingLevel = 'h3',
}: TeamCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const Heading = headingLevel;
  const { primary, secondary } = team.colors;

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || reduced || event.pointerType !== 'mouse') return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--nl-ry', `${((px - 0.5) * 8).toFixed(2)}deg`);
    card.style.setProperty('--nl-rx', `${((0.5 - py) * 6).toFixed(2)}deg`);
    card.style.setProperty('--nl-mx', `${(px * 100).toFixed(1)}%`);
    card.style.setProperty('--nl-my', `${(py * 100).toFixed(1)}%`);
  };
  const onPointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--nl-ry', '0deg');
    card.style.setProperty('--nl-rx', '0deg');
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-labelledby={`team-${team.id}-name`}
      className="nl-tilt group relative flex h-full flex-col overflow-hidden border border-white/10 bg-[#0A1D35]"
      style={{
        clipPath:
          'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
        backgroundImage: `linear-gradient(155deg, ${secondary}cc 0%, #0A1D35 55%)`,
      }}
    >
      {/* Team colour bar and oversized code watermark */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: primary }}
      />
      <span
        aria-hidden="true"
        className="nl-display pointer-events-none absolute -right-2 -top-6 select-none text-[9rem] font-black leading-none opacity-[0.07]"
        style={{ color: primary }}
      >
        {team.code}
      </span>
      <span
        aria-hidden="true"
        className="nl-tilt-light pointer-events-none absolute inset-0"
      />

      <div className="relative flex flex-1 flex-col p-6 pl-8">
        <div className="flex items-start gap-4">
          <TeamCrest team={team} size={56} />
          <div className="min-w-0">
            <Heading
              id={`team-${team.id}-name`}
              className="text-[2rem] font-black"
            >
              {team.name}
            </Heading>
            <p
              className="mt-1 text-sm font-semibold"
              style={{ color: primary }}
            >
              {team.tagline}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[#AAB8CA]">
          {team.description}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-5 text-sm">
          <div>
            <dt className="text-xs text-[#AAB8CA]">Owner (sample)</dt>
            <dd className="mt-0.5 font-semibold">{team.owner}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#AAB8CA]">Featured MVP (sample)</dt>
            <dd className="mt-0.5 font-semibold">
              {mvp?.name ?? 'To be announced'}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-[#AAB8CA]">Sample record</dt>
            <dd className="nl-numeral mt-0.5 text-2xl font-extrabold">
              {standing.played} played{' '}
              <span style={{ color: primary }}>{standing.wins}W</span>{' '}
              <span className="text-[#AAB8CA]">{standing.losses}L</span>
            </dd>
          </div>
        </dl>

        {roster && roster.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-[#AAB8CA]">Roster preview (sample)</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {roster.map((p) => (
                <li
                  key={p.id}
                  className="border border-white/10 bg-white/[0.03] px-2 py-1 text-xs"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Link
            href={leagueRoutes.team(team.slug)}
            className="nl-btn nl-btn--line nl-btn--sm"
            aria-label={`Explore ${team.name}`}
          >
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}
