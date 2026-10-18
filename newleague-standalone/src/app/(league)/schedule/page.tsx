import type { Metadata } from 'next';
import PageHero from '@/components/newleague/ui/PageHero';
import SampleBadge from '@/components/newleague/ui/SampleBadge';
import ScheduleExplorer from '@/components/newleague/schedule/ScheduleExplorer';
import StandingsTable from '@/components/newleague/schedule/StandingsTable';
import { league, leagueRoutes } from '@/components/newleague/data/league';
import { POINTS_PER_WIN } from '@/components/newleague/lib/standings';
import {
  fixtures,
  getCompletedFixtures,
  getUpcomingFixtures,
  standings,
  teams,
} from '@/components/newleague/lib/selectors';

export const metadata: Metadata = {
  title: 'Schedule and standings',
  description: `Fixtures, results and standings for the ${league.name} (sample data until the official schedule is published).`,
  alternates: { canonical: leagueRoutes.schedule },
  openGraph: {
    url: leagueRoutes.schedule,
    title: `Schedule | ${league.shortName} Season ${league.season}`,
  },
};

export default function SchedulePage() {
  const completed = getCompletedFixtures().length;
  const scheduled = getUpcomingFixtures().length;
  const tba = fixtures.length - completed - scheduled;

  return (
    <>
      <PageHero
        title={['Fixtures', 'and results']}
        intro={
          <p>
            Every tie of the sample season, the results so far, and the table
            they produce.
          </p>
        }
        image={{
          src: '/newleague/images/shuttle-blue.webp',
          alt: 'A shuttlecock under arena floodlights.',
        }}
        aside={
          <div className="flex flex-col gap-6">
            <SampleBadge>
              Sample schedule: not an official timetable. Dates, venues and
              results are illustrative.
            </SampleBadge>
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              {[
                ['Completed', completed],
                ['Scheduled', scheduled],
                ['Date to be announced', tba],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="text-sm text-[#AAB8CA]">{label}</dt>
                  <dd className="nl-numeral text-5xl font-black">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <div className="nl-wrap grid gap-16 py-14 md:py-20 xl:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="nl-fixtures">
          <h2
            id="nl-fixtures"
            className="mb-6 text-[clamp(2.4rem,6vw,4.5rem)] font-black"
          >
            Matches
          </h2>
          <ScheduleExplorer fixtures={fixtures} teams={teams} />
        </section>

        <section
          aria-labelledby="nl-standings"
          className="xl:sticky xl:top-[calc(var(--nl-header-h)+24px)] xl:self-start"
        >
          <h2
            id="nl-standings"
            className="text-[clamp(2.4rem,6vw,4.5rem)] font-black"
          >
            Standings
          </h2>
          <p className="mb-6 mt-3 text-sm leading-relaxed text-[#AAB8CA]">
            Calculated from the sample results on this page: {POINTS_PER_WIN}{' '}
            points per tie won, ties separated by rubber difference. The
            official points system will come from the organisers.
          </p>
          <StandingsTable rows={standings} />
        </section>
      </div>
    </>
  );
}
