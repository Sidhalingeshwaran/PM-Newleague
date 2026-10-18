import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/newleague/ui/PageHero';
import SampleBadge from '@/components/newleague/ui/SampleBadge';
import Reveal from '@/components/newleague/ui/Reveal';
import ParallaxImage from '@/components/newleague/ui/ParallaxImage';
import FranchiseCTA from '@/components/newleague/FranchiseCTA';
import LeagueMark from '@/components/newleague/layout/LeagueMark';
import { league, leagueRoutes } from '@/components/newleague/data/league';
import { formatINR } from '@/components/newleague/lib/format';

export const metadata: Metadata = {
  title: 'About the league',
  description: `About the ${league.name}: a franchise-based badminton league presented by ${league.presenter}. ${league.seasonLabel}.`,
  alternates: { canonical: leagueRoutes.about },
  openGraph: {
    url: leagueRoutes.about,
    title: `About the league | ${league.shortName} Season ${league.season}`,
  },
};

function Editorial({
  id,
  title,
  image,
  flip,
  children,
}: {
  id: string;
  title: string;
  image: { src: string; alt: string };
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-white/10 py-20 md:py-28"
    >
      <div className="nl-wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal className={flip ? 'lg:order-2' : undefined}>
          <h2 id={id} className="text-[clamp(2.6rem,6vw,4.8rem)] font-black">
            {title}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-[#AAB8CA]">
            {children}
          </div>
        </Reveal>
        <Reveal delay={100} className={flip ? 'lg:order-1' : undefined}>
          <ParallaxImage
            src={image.src}
            alt={image.alt}
            className="aspect-[4/3] w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={['A league', 'built for', 'the court']}
        intro={
          <p>
            The {league.name} turns local badminton into a franchise
            competition: teams with their own colours, owners and players, all
            chasing the same title.
          </p>
        }
        image={{
          src: '/newleague/images/shuttle-arena.webp',
          alt: 'A shuttlecock in flight above a floodlit indoor court.',
        }}
        aside={
          <SampleBadge>Suggested copy, awaiting organiser review</SampleBadge>
        }
      />

      <Editorial
        id="nl-about-intro"
        title="What the league is"
        image={{
          src: '/newleague/images/shuttle-blue.webp',
          alt: 'A white shuttlecock lit by arena spotlights against a blue background.',
        }}
      >
        <p>
          A franchise-based badminton league for {league.locality} and the
          surrounding community. Players represent a team rather than only
          themselves, and every result counts toward that team&apos;s season.
        </p>
        <p>
          {league.seasonLabel} is presented by {league.presenter}.
        </p>
      </Editorial>

      {/* Vision and mission */}
      <section
        aria-labelledby="nl-vision"
        className="relative overflow-hidden border-t border-white/10 bg-[#0A1D35] py-20 md:py-28"
      >
        <div className="nl-wrap">
          <Reveal>
            <h2
              id="nl-vision"
              className="text-[clamp(2.6rem,6vw,4.8rem)] font-black"
            >
              Vision and mission
            </h2>
            <p className="mt-4 max-w-xl text-[#AAB8CA]">
              Suggested wording for the organisers to adopt or replace. It is
              not an official statement.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-2">
            <Reveal className="bg-[#0A1D35] p-8 md:p-12">
              <h3 className="text-3xl font-black text-[#F5C65D]">Vision</h3>
              <p className="nl-display mt-5 text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold normal-case leading-[1.05]">
                A badminton community where every player has a team to play for
                and a crowd to play in front of.
              </p>
            </Reveal>
            <Reveal delay={100} className="bg-[#0A1D35] p-8 md:p-12">
              <h3 className="text-3xl font-black text-[#F5C65D]">Mission</h3>
              <ul className="mt-5 space-y-4 text-lg leading-relaxed text-[#D5DEEA]">
                <li>
                  Give local players a well-run, competitive season to train
                  for.
                </li>
                <li>
                  Build franchises that people want to follow and support.
                </li>
                <li>
                  Keep fair play and respect at the centre of every match.
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <Editorial
        id="nl-community"
        title="Community and sportsmanship"
        image={{
          src: '/newleague/images/jump-smash.webp',
          alt: 'A player leaps for a jump smash under arena lights.',
        }}
        flip
      >
        <p>
          A league is only as good as the way it&apos;s played. Respect for
          opponents, officials and the people watching matters as much as the
          scoreline.
        </p>
        <p>
          Franchise teams give players a reason to support each other and give
          spectators a side to cheer for.
        </p>
      </Editorial>

      {/* League concept + franchise overview */}
      <section
        aria-labelledby="nl-concept"
        className="border-t border-white/10 py-20 md:py-28"
      >
        <div className="nl-wrap">
          <Reveal>
            <h2
              id="nl-concept"
              className="max-w-3xl text-[clamp(2.6rem,6vw,4.8rem)] font-black"
            >
              The concept: franchises, not just fixtures
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {[
              [
                'Franchises',
                'Each team is run by a franchise owner, with its own name, colours and identity.',
              ],
              [
                'Squads',
                'Players join a franchise squad and represent it across the season.',
              ],
              [
                'A season-long table',
                'Results build into standings, so every match day shapes the race.',
              ],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 80} className="bg-[#061426] p-8">
                <h3 className="text-3xl font-black">{title}</h3>
                <p className="mt-3 leading-relaxed text-[#AAB8CA]">{body}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#AAB8CA]">
            Match format, squad sizes and qualification rules will be confirmed
            by the organisers.
          </p>
        </div>
      </section>

      {/* Season 4 facts from the organisers' banner */}
      <section
        aria-labelledby="nl-season"
        className="border-t border-white/10 bg-[#0A1D35] py-20 md:py-28"
      >
        <div className="nl-wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <Reveal>
            <h2
              id="nl-season"
              className="text-[clamp(2.6rem,6vw,4.8rem)] font-black"
            >
              {league.seasonLabel}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[#AAB8CA]">
              These details come from the organisers&apos; Season 4 franchise
              invitation.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <dl className="grid gap-px bg-white/10 sm:grid-cols-2">
              {[
                ['League', league.name],
                ['Season', `Season ${league.season}, ${league.year}`],
                ['Franchise fee', formatINR(league.franchiseFee)],
                ['Presented by', league.presenter],
                ['Venue partner', league.venuePartner],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-[#0A1D35] p-5 last:sm:col-span-2"
                >
                  <dt className="text-sm text-[#AAB8CA]">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Venue partner + presenter */}
      <section
        aria-label="Partners"
        className="border-t border-white/10 py-20 md:py-28"
      >
        <div className="nl-wrap">
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            <Reveal className="bg-[#061426] p-8 md:p-12">
              <p className="text-sm font-semibold text-[#F5C65D]">
                Venue partner
              </p>
              <h2
                id="nl-venue"
                className="mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)] font-black leading-[0.95]"
              >
                {league.venuePartner}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-[#AAB8CA]">
                The league&apos;s venue partner for {league.seasonLabel}. Match
                venues will be confirmed with the official schedule.
              </p>
            </Reveal>
            <Reveal delay={100} className="bg-[#061426] p-8 md:p-12">
              <p className="text-sm font-semibold text-[#F5C65D]">
                Presented by
              </p>
              <div className="mt-4 flex items-center gap-4">
                <LeagueMark size={52} />
                <h2
                  id="nl-presenter"
                  className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-black leading-[0.95]"
                >
                  {league.presenter}
                </h2>
              </div>
              <p className="mt-5 max-w-md leading-relaxed text-[#AAB8CA]">
                {league.presenter} presents the {league.name}. Contact the
                organisers for details about the academy.
              </p>
              <Link
                href={leagueRoutes.contact}
                className="nl-btn nl-btn--line nl-btn--sm mt-6"
              >
                Contact the organisers
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <FranchiseCTA />
    </>
  );
}
