import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import TeamCrest from '@/components/newleague/ui/TeamCrest';
import SampleBadge from '@/components/newleague/ui/SampleBadge';
import PlayerCard from '@/components/newleague/players/PlayerCard';
import FixtureCard from '@/components/newleague/schedule/FixtureCard';
import StandingsTable from '@/components/newleague/schedule/StandingsTable';
import CountUp from '@/components/newleague/ui/CountUp';
import { league, leagueRoutes } from '@/components/newleague/data/league';
import {
  getPlayersByTeam,
  getTeamBySlug,
  getTeamFixtures,
  getTeamMvp,
  getTeamStanding,
  requireTeam,
  standings,
  teams,
} from '@/components/newleague/lib/selectors';

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: 'Team not found' };
  const path = leagueRoutes.team(team.slug);
  return {
    title: team.name,
    description: `${team.name} — ${team.tagline} Roster, record and fixtures in the ${league.name} (sample data).`,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `${team.name} | ${league.shortName} Season ${league.season}`,
    },
  };
}

export default async function TeamDetailPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const roster = getPlayersByTeam(team.id);
  const mvp = getTeamMvp(team.id);
  const standing = getTeamStanding(team.id);
  const teamFixtures = getTeamFixtures(team.id);
  const upcoming = teamFixtures.filter((f) => f.status !== 'completed');
  const results = teamFixtures
    .filter((f) => f.status === 'completed')
    .reverse();
  const { primary, secondary } = team.colors;

  return (
    <>
      {/* Team hero */}
      <section
        aria-labelledby="nl-team-title"
        className="relative overflow-hidden border-b border-white/10 pb-14 pt-[calc(var(--nl-header-h)+32px)] md:pb-20"
        style={{
          backgroundImage: `radial-gradient(1200px 520px at 85% 10%, ${secondary} 0%, transparent 70%)`,
        }}
      >
        <span
          aria-hidden="true"
          className="nl-display pointer-events-none absolute -bottom-10 right-[-2%] select-none text-[clamp(10rem,32vw,26rem)] font-black leading-none opacity-[0.08]"
          style={{ color: primary }}
        >
          {team.code}
        </span>
        <div className="nl-wrap relative">
          <Link
            href={leagueRoutes.teams}
            className="inline-flex items-center gap-2 text-sm text-[#AAB8CA] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all teams
          </Link>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end">
            <TeamCrest team={team} size={132} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: primary }}>
                {team.identity}
              </p>
              <h1
                id="nl-team-title"
                className="nl-rise mt-2 text-[clamp(3.2rem,10vw,7.5rem)] font-black leading-[0.86]"
              >
                <span className="block">{team.name}</span>
              </h1>
              <p className="nl-fade-late mt-4 max-w-xl text-lg leading-relaxed text-[#D5DEEA]">
                {team.tagline} {team.description}
              </p>
            </div>
          </div>

          <div className="nl-fade-late mt-10 flex flex-wrap items-center gap-3">
            <SampleBadge>
              Fictional franchise — owner, roster and statistics are sample data
            </SampleBadge>
          </div>

          <dl className="nl-fade-late mt-6 grid grid-cols-6 gap-px bg-white/10 md:grid-cols-5">
            <div className="col-span-6 bg-[#061426] p-5 sm:col-span-3 md:col-span-1">
              <dt className="text-xs text-[#AAB8CA]">Owner (sample)</dt>
              <dd className="mt-1 text-lg font-semibold">{team.owner}</dd>
            </div>
            <div className="col-span-6 bg-[#061426] p-5 sm:col-span-3 md:col-span-1">
              <dt className="text-xs text-[#AAB8CA]">MVP (sample)</dt>
              <dd className="mt-1 text-lg font-semibold">
                {mvp ? (
                  <Link
                    href={leagueRoutes.player(mvp.id)}
                    className="hover:underline"
                  >
                    {mvp.name}
                  </Link>
                ) : (
                  'To be announced'
                )}
              </dd>
            </div>
            {[
              ['Played', standing.played],
              ['Won', standing.wins],
              ['Lost', standing.losses],
            ].map(([label, value]) => (
              <div
                key={label}
                className="col-span-2 bg-[#061426] p-5 md:col-span-1"
              >
                <dt className="text-xs text-[#AAB8CA]">{label}</dt>
                <dd className="nl-numeral mt-1 text-5xl font-black">
                  <CountUp value={Number(value)} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Roster */}
      <section aria-labelledby="nl-roster" className="py-16 md:py-24">
        <div className="nl-wrap">
          <h2
            id="nl-roster"
            className="text-[clamp(2.4rem,6vw,4.5rem)] font-black"
          >
            Roster
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {roster.map((p) => (
              <li key={p.id}>
                <PlayerCard
                  player={p}
                  team={team}
                  action={
                    <Link
                      href={leagueRoutes.player(p.id)}
                      className="nl-btn nl-btn--line nl-btn--sm w-full"
                    >
                      View profile<span className="sr-only">: {p.name}</span>
                    </Link>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fixtures + results + table */}
      <section
        aria-label="Fixtures and results"
        className="border-t border-white/10 py-16 md:py-24"
      >
        <div className="nl-wrap grid gap-14 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-14">
            <div>
              <h2 className="text-[clamp(2.2rem,5vw,3.75rem)] font-black">
                Fixtures
              </h2>
              {upcoming.length > 0 ? (
                <ul className="mt-6 grid gap-4">
                  {upcoming.map((f) => (
                    <li key={f.id}>
                      <FixtureCard
                        fixture={f}
                        home={requireTeam(f.homeTeamId)}
                        away={requireTeam(f.awayTeamId)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[#AAB8CA]">
                  No upcoming fixtures for this team.
                </p>
              )}
            </div>
            <div>
              <h2 className="text-[clamp(2.2rem,5vw,3.75rem)] font-black">
                Recent results
              </h2>
              {results.length > 0 ? (
                <ul className="mt-6 grid gap-4">
                  {results.map((f) => (
                    <li key={f.id}>
                      <FixtureCard
                        fixture={f}
                        home={requireTeam(f.homeTeamId)}
                        away={requireTeam(f.awayTeamId)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[#AAB8CA]">
                  This team hasn&apos;t played yet.
                </p>
              )}
            </div>
          </div>
          <aside aria-labelledby="nl-team-table">
            <h2
              id="nl-team-table"
              className="text-[clamp(2.2rem,5vw,3.75rem)] font-black"
            >
              Sample table
            </h2>
            <div className="mt-6">
              <StandingsTable
                rows={standings}
                highlightTeamId={team.id}
                compact
              />
            </div>
            <Link
              href={leagueRoutes.schedule}
              className="nl-btn nl-btn--line nl-btn--sm mt-6"
            >
              Full schedule
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
