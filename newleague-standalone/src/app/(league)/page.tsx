import type { Metadata } from 'next';
import Link from 'next/link';
import HeroPoster from '@/components/newleague/hero/HeroPoster';
import HeroScene from '@/components/newleague/hero/HeroScene';
import TeamCard from '@/components/newleague/teams/TeamCard';
import FixtureCard from '@/components/newleague/schedule/FixtureCard';
import PlayerCard from '@/components/newleague/players/PlayerCard';
import FranchiseCTA from '@/components/newleague/FranchiseCTA';
import SectionHeading from '@/components/newleague/ui/SectionHeading';
import SampleBadge from '@/components/newleague/ui/SampleBadge';
import Reveal from '@/components/newleague/ui/Reveal';
import CountUp from '@/components/newleague/ui/CountUp';
import ParallaxImage from '@/components/newleague/ui/ParallaxImage';
import { league, leagueRoutes } from '@/components/newleague/data/league';
import {
  fixtures,
  getMvps,
  getTeamMvp,
  getTeamStanding,
  getUpcomingFixtures,
  players,
  requireTeam,
  teams,
} from '@/components/newleague/lib/selectors';

export const metadata: Metadata = {
  title: { absolute: `${league.name} | Season ${league.season}` },
  alternates: { canonical: leagueRoutes.home },
  openGraph: { url: leagueRoutes.home },
};

export default function NewLeagueHomePage() {
  const featured = getMvps()
    .sort((a, b) => b.stats.rating - a.stats.rating)
    .slice(0, 4);
  const upcoming = getUpcomingFixtures(4);

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section
        aria-labelledby="nl-hero-title"
        className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#061426] md:min-h-[min(100svh,960px)]"
      >
        <div className="absolute inset-0">
          <HeroPoster />
          <HeroScene />
        </div>
        {/* Readability scrims: from the left on wide screens, from the bottom on phones */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061426] via-[#061426]/75 to-transparent md:bg-gradient-to-r md:from-[#061426]/95 md:via-[#061426]/55 md:to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061426] to-transparent"
        />

        <div className="nl-wrap relative z-10 flex flex-1 flex-col justify-end pb-14 pt-[calc(var(--nl-header-h)+32px)] md:justify-center md:pb-20">
          <div className="max-w-[52rem]">
            <div className="nl-fade-late inline-flex items-stretch border border-white/15 bg-[#061426]/60 backdrop-blur-sm">
              <span className="w-1.5 bg-[#F5C65D]" aria-hidden="true" />
              <p className="px-4 py-2.5 leading-tight">
                <span className="nl-display block text-sm font-extrabold tracking-[0.12em] text-[#AAB8CA] sm:text-base">
                  {league.name.toUpperCase()}
                </span>
                <span className="nl-display block text-xl font-black tracking-[0.08em] text-white">
                  Season 04 <span className="text-[#F5C65D]">|</span>{' '}
                  {league.year}
                </span>
              </p>
            </div>

            <h1
              id="nl-hero-title"
              className="nl-rise mt-7 text-[clamp(3.2rem,10.5vw,7.4rem)] font-black leading-[0.86]"
            >
              <span className="block">T. Dasarahalli</span>
              <span className="block">Premier</span>
              <span className="block text-[#F5C65D]">Badminton League</span>
            </h1>

            <p className="nl-fade-late mt-6 max-w-md text-lg leading-relaxed text-[#D5DEEA] md:text-xl">
              Eight franchises. One court. A season of relentless competition.
            </p>

            <div className="nl-fade-late mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={leagueRoutes.teams} className="nl-btn nl-btn--gold">
                Explore the league
              </Link>
              <Link href={leagueRoutes.contact} className="nl-btn nl-btn--line">
                Own a franchise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- INTRO */}
      <section aria-labelledby="nl-intro" className="relative py-20 md:py-28">
        <div className="nl-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2
              id="nl-intro"
              className="text-[clamp(2.6rem,6.5vw,5rem)] font-black"
            >
              Badminton, played as a team sport.
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-[#AAB8CA]">
              <p>
                The {league.name} brings local players together under franchise
                colours. Players compete for their franchise, so every match
                they win counts for the whole team.
              </p>
              <p>
                Presented by {league.presenter}, with {league.venuePartner} as
                venue partner, Season 4 is about community, sportsmanship and
                badminton worth turning up for.
              </p>
            </div>
            <Link
              href={leagueRoutes.about}
              className="nl-btn nl-btn--line mt-8"
            >
              About the league
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <ParallaxImage
              src="/newleague/images/racket-impact.webp"
              alt="A racket strikes a shuttlecock in a burst of golden light."
              className="aspect-[4/3] w-full"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- FRANCHISES */}
      <section
        aria-labelledby="nl-franchises"
        className="border-t border-white/10 py-20 md:py-28"
      >
        <div className="nl-wrap">
          <SectionHeading
            id="nl-franchises"
            title="Eight franchises"
            intro={
              <>
                <p>
                  Every team has its own colours, crest and playing identity.
                  Pick one and explore its roster, record and fixtures.
                </p>
                <SampleBadge className="mt-4">
                  Sample franchises, owners and MVPs
                </SampleBadge>
              </>
            }
            action={
              <Link
                href={leagueRoutes.teams}
                className="nl-btn nl-btn--line nl-btn--sm"
              >
                All teams
              </Link>
            }
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {teams.map((team) => (
              <li key={team.id}>
                <TeamCard
                  team={team}
                  mvp={getTeamMvp(team.id)}
                  standing={getTeamStanding(team.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- FORMAT */}
      <section
        aria-labelledby="nl-format"
        className="relative overflow-hidden border-t border-white/10 bg-[#0A1D35] py-20 md:py-28"
      >
        <div className="nl-wrap grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              id="nl-format"
              title="How the league works"
              intro={
                <p>
                  An outline of the season. The organisers will publish the
                  official match format and rules — until then, the figures
                  below describe this site&apos;s sample season.
                </p>
              }
            />
            <dl className="mt-10 grid grid-cols-2 gap-px bg-white/10">
              {[
                { value: teams.length, label: 'Franchises' },
                { value: players.length, label: 'Players (sample)' },
                { value: fixtures.length, label: 'Ties (sample)' },
                { value: league.season, label: 'Season' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col-reverse bg-[#0A1D35] p-5"
                >
                  <dt className="mt-1 text-sm text-[#AAB8CA]">{s.label}</dt>
                  <dd className="nl-numeral text-6xl font-black text-white">
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="grid gap-px bg-white/10 sm:grid-cols-2">
            {[
              [
                'Franchise teams',
                'Eight franchises, each with an owner, colours and a squad of players.',
              ],
              [
                'Team-based competition',
                'Franchises face each other through the season. The official match format will come from the organisers.',
              ],
              [
                'Player and team performance',
                'Results count for the team table and for each player’s record.',
              ],
              [
                'Fixtures and results',
                'Every tie is listed on the schedule, with results once it’s played.',
              ],
              [
                'MVP recognition',
                'Each franchise highlights a standout player as its MVP.',
              ],
              [
                'Community first',
                'A local league built around sportsmanship on and off court.',
              ],
            ].map(([title, body]) => (
              <li key={title} className="bg-[#0A1D35] p-6">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#AAB8CA]">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------- PLAYERS */}
      <section
        aria-labelledby="nl-players"
        className="border-t border-white/10 py-20 md:py-28"
      >
        <div className="nl-wrap">
          <SectionHeading
            id="nl-players"
            title="Players to watch"
            intro={
              <>
                <p>Team MVPs with the strongest sample ratings so far.</p>
                <SampleBadge className="mt-4">
                  Fictional players and demo statistics
                </SampleBadge>
              </>
            }
            action={
              <Link
                href={leagueRoutes.players}
                className="nl-btn nl-btn--line nl-btn--sm"
              >
                All players
              </Link>
            }
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <li key={p.id}>
                <PlayerCard
                  player={p}
                  team={requireTeam(p.teamId)}
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

      {/* ---------------------------------------------------------- FIXTURES */}
      <section
        aria-labelledby="nl-upcoming"
        className="border-t border-white/10 py-20 md:py-28"
      >
        <div className="nl-wrap">
          <SectionHeading
            id="nl-upcoming"
            title="Upcoming matches"
            intro={
              <>
                <p>The next ties on the sample schedule.</p>
                <SampleBadge className="mt-4">
                  Sample fixtures, not an official timetable
                </SampleBadge>
              </>
            }
            action={
              <Link
                href={leagueRoutes.schedule}
                className="nl-btn nl-btn--line nl-btn--sm"
              >
                Full schedule
              </Link>
            }
          />
          <ul className="mt-12 grid gap-4 lg:grid-cols-2">
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
        </div>
      </section>

      {/* ---------------------------------------------------------- FRANCHISE INVITATION */}
      <FranchiseCTA />

      {/* ---------------------------------------------------------- FINAL CTA */}
      <section
        aria-labelledby="nl-final"
        className="relative overflow-hidden py-24 md:py-36"
      >
        <ParallaxImage
          src="/newleague/images/jump-smash.webp"
          alt=""
          className="!absolute inset-0"
          imageClassName="object-[70%_center] opacity-60"
          sizes="100vw"
          strength={40}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#061426]/85 to-[#061426]/20"
        />
        <div className="nl-wrap relative">
          <Reveal className="max-w-2xl">
            <h2
              id="nl-final"
              className="text-[clamp(3rem,9vw,7rem)] font-black"
            >
              Pick your side.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[#D5DEEA]">
              Follow a franchise through the season, or talk to the organisers
              about owning one.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={leagueRoutes.teams} className="nl-btn nl-btn--gold">
                Explore the teams
              </Link>
              <Link href={leagueRoutes.contact} className="nl-btn nl-btn--line">
                Contact the league
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
