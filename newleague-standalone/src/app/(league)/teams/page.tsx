import type { Metadata } from 'next';
import PageHero from '@/components/newleague/ui/PageHero';
import SampleBadge from '@/components/newleague/ui/SampleBadge';
import TeamDirectory from '@/components/newleague/teams/TeamDirectory';
import { league, leagueRoutes } from '@/components/newleague/data/league';
import {
  getPlayersByTeam,
  getTeamMvp,
  getTeamStanding,
  teams,
} from '@/components/newleague/lib/selectors';

export const metadata: Metadata = {
  title: 'Teams',
  description: `The eight franchises of the ${league.name}: crests, colours, owners, MVPs and rosters.`,
  alternates: { canonical: leagueRoutes.teams },
  openGraph: {
    url: leagueRoutes.teams,
    title: `Teams | ${league.shortName} Season ${league.season}`,
  },
};

export default function TeamsPage() {
  const entries = teams.map((team) => ({
    team,
    mvp: getTeamMvp(team.id),
    standing: getTeamStanding(team.id),
    roster: getPlayersByTeam(team.id),
  }));

  return (
    <>
      <PageHero
        title={['Eight', 'franchises']}
        intro={
          <p>
            Search the franchise directory, filter by sample form and open any
            team to see its roster, record and fixtures.
          </p>
        }
        image={{
          src: '/newleague/images/racket-impact.webp',
          alt: 'A racket meets a shuttlecock in a burst of gold particles.',
        }}
        aside={
          <SampleBadge>
            Team names, owners, MVPs and records are fictional placeholders, not
            registered franchises
          </SampleBadge>
        }
      />
      <section aria-label="Franchise directory" className="py-14 md:py-20">
        <div className="nl-wrap">
          <TeamDirectory entries={entries} />
        </div>
      </section>
    </>
  );
}
