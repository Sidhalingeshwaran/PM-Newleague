import type { Metadata } from 'next';
import '@/components/newleague/newleague.css';
import { leagueBody, leagueDisplay } from '@/components/newleague/fonts';
import LeagueHeader from '@/components/newleague/layout/LeagueHeader';
import LeagueFooter from '@/components/newleague/layout/LeagueFooter';
import { league } from '@/components/newleague/data/league';

const description =
  'Explore the T. Dasarahalli Premier Badminton League, discover franchises, meet players, follow fixtures, and enquire about franchise opportunities.';

/**
 * League-scoped metadata. Overrides the PlayMatches title template only for
 * /newleague routes; the root application's metadata is untouched.
 */
export const metadata: Metadata = {
  title: {
    default: `${league.name} | Season ${league.season}`,
    template: `%s | ${league.shortName} Season ${league.season}`,
  },
  description,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: league.name,
    title: `${league.name} | Season ${league.season}`,
    description,
    images: [
      {
        url: '/newleague/images/shuttle-arena.webp',
        width: 1600,
        height: 900,
        alt: league.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${league.name} | Season ${league.season}`,
    description,
    images: ['/newleague/images/shuttle-arena.webp'],
  },
};

export default function NewLeagueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`nl-root ${leagueDisplay.variable} ${leagueBody.variable}`}>
      <a href="#nl-main" className="nl-skip">
        Skip to content
      </a>
      <LeagueHeader />
      <div id="nl-main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </div>
      <LeagueFooter />
    </div>
  );
}
