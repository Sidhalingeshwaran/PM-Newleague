import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import PageHero from '@/components/newleague/ui/PageHero';
import SampleBadge from '@/components/newleague/ui/SampleBadge';
import PlayerAvatar from '@/components/newleague/ui/PlayerAvatar';
import PlayerDirectory from '@/components/newleague/players/PlayerDirectory';
import Leaderboard from '@/components/newleague/players/Leaderboard';
import { league, leagueRoutes } from '@/components/newleague/data/league';
import { winRate } from '@/components/newleague/lib/format';
import {
  getMvps,
  players,
  requireTeam,
  teams,
} from '@/components/newleague/lib/selectors';

export const metadata: Metadata = {
  title: 'Players',
  description: `Player directory, MVPs and leaderboard for the ${league.name} (fictional sample players).`,
  alternates: { canonical: leagueRoutes.players },
  openGraph: {
    url: leagueRoutes.players,
    title: `Players | ${league.shortName} Season ${league.season}`,
  },
};

export default function PlayersPage() {
  const mvps = getMvps().sort((a, b) => b.stats.rating - a.stats.rating);
  const top = mvps[0];
  const topTeam = requireTeam(top.teamId);

  return (
    <>
      <PageHero
        title={['Players', 'and MVPs']}
        intro={
          <p>
            Search the squads, filter by team or category, and open any player
            for their profile and season numbers.
          </p>
        }
        image={{
          src: '/newleague/images/jump-smash.webp',
          alt: 'A badminton player in mid-air playing a jump smash.',
        }}
        aside={
          <SampleBadge>
            Fictional players and demo statistics, not linked to any real
            athlete
          </SampleBadge>
        }
      />

      {/* Featured MVP */}
      <section
        aria-labelledby="nl-mvp"
        className="border-b border-white/10 py-14 md:py-20"
      >
        <div className="nl-wrap">
          <div className="grid items-stretch gap-px bg-white/10 lg:grid-cols-[minmax(0,420px)_1fr]">
            <PlayerAvatar
              player={top}
              team={topTeam}
              className="aspect-[2/1] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[360px]"
            />
            <div className="bg-[#061426] p-7 md:p-10">
              <p className="text-sm font-semibold text-[#F5C65D]">
                Top-rated MVP (sample)
              </p>
              <h2
                id="nl-mvp"
                className="mt-3 text-[clamp(2.8rem,7vw,5.5rem)] font-black"
              >
                {top.name}
              </h2>
              <p className="mt-2">
                <Link
                  href={leagueRoutes.team(topTeam.slug)}
                  className="font-semibold hover:underline"
                  style={{ color: topTeam.colors.primary }}
                >
                  {topTeam.name}
                </Link>
                <span className="text-[#AAB8CA]"> — {top.category}</span>
              </p>
              <p className="mt-5 max-w-lg leading-relaxed text-[#AAB8CA]">
                {top.bio}
              </p>
              <dl className="mt-8 grid max-w-lg grid-cols-3 gap-px bg-white/10">
                {[
                  ['Rating', top.stats.rating],
                  ['Won', `${top.stats.wins}/${top.stats.matchesPlayed}`],
                  [
                    'Win rate',
                    `${winRate(top.stats.wins, top.stats.matchesPlayed)}%`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#061426] p-4">
                    <dt className="text-xs text-[#AAB8CA]">{label}</dt>
                    <dd className="nl-numeral text-4xl font-black text-[#F5C65D]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <p className="text-sm text-[#AAB8CA]">Other team MVPs</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {mvps.slice(1).map((p) => {
                    const t = requireTeam(p.teamId);
                    return (
                      <li key={p.id}>
                        <Link
                          href={leagueRoutes.player(p.id)}
                          scroll={false}
                          prefetch={false}
                          className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-sm hover:border-white/40"
                        >
                          <span
                            className="h-2 w-2"
                            style={{ background: t.colors.primary }}
                            aria-hidden="true"
                          />
                          {p.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="nl-wrap grid gap-16 py-14 md:py-20 2xl:grid-cols-[1fr_380px]">
        <section aria-labelledby="nl-directory">
          <h2
            id="nl-directory"
            className="mb-6 text-[clamp(2.4rem,6vw,4.5rem)] font-black"
          >
            Player directory
          </h2>
          <Suspense
            fallback={<p className="text-[#AAB8CA]">Loading players…</p>}
          >
            <PlayerDirectory players={players} teams={teams} />
          </Suspense>
        </section>

        <section
          aria-labelledby="nl-leaderboard"
          className="2xl:sticky 2xl:top-[calc(var(--nl-header-h)+24px)] 2xl:self-start"
        >
          <h2
            id="nl-leaderboard"
            className="text-[clamp(2.4rem,6vw,4.5rem)] font-black"
          >
            Leaderboard
          </h2>
          <p className="mb-6 mt-3 text-sm text-[#AAB8CA]">
            Top ten by sample performance rating (0–100).
          </p>
          <Leaderboard players={players} />
        </section>
      </div>
    </>
  );
}
