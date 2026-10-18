import Link from 'next/link';
import { leagueRoutes } from '@/components/newleague/data/league';

export default function NewLeagueNotFound() {
  return (
    <section className="nl-wrap flex min-h-[70vh] flex-col justify-center pt-[calc(var(--nl-header-h)+40px)] pb-20">
      <h1 className="text-[clamp(3rem,10vw,7rem)] font-black">Out of bounds</h1>
      <p className="mt-4 max-w-md text-[#AAB8CA]">
        That page isn&apos;t part of the league site. Head back to the teams or
        the home page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={leagueRoutes.teams} className="nl-btn nl-btn--gold">
          View teams
        </Link>
        <Link href={leagueRoutes.home} className="nl-btn nl-btn--line">
          League home
        </Link>
      </div>
    </section>
  );
}
