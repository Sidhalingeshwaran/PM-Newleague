import Link from 'next/link';
import { Phone } from 'lucide-react';
import {
  league,
  leagueContacts,
  leagueNav,
  leagueRoutes,
} from '../data/league';
import { formatINR, telHref } from '../lib/format';
import LeagueMark from './LeagueMark';

export default function LeagueFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-[#030B17]">
      {/* Franchise strip */}
      <div className="border-b border-white/10">
        <div className="nl-wrap flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <p className="nl-display text-[clamp(2rem,5vw,3rem)] font-black">
              Own a team in Season 4
            </p>
            <p className="mt-2 text-[#AAB8CA]">
              Franchise fee {formatINR(league.franchiseFee)}. Talk to the
              organisers to find out what&apos;s available.
            </p>
          </div>
          <Link href={leagueRoutes.contact} className="nl-btn nl-btn--gold">
            Enquire about a franchise
          </Link>
        </div>
      </div>

      <div className="nl-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link
            href={leagueRoutes.home}
            className="inline-flex items-center gap-3"
            aria-label={`${league.name} — home`}
          >
            <LeagueMark size={44} />
            <span className="nl-display text-xl font-extrabold leading-tight">
              {league.name}
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#AAB8CA]">
            {league.seasonLabel}. Presented by {league.presenter}.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="nl-display text-lg font-extrabold text-[#F5C65D]">
            League
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {leagueNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[#AAB8CA] transition-colors hover:text-white"
                >
                  {item.label === 'Teams'
                    ? 'Team directory'
                    : item.label === 'Players'
                    ? 'Player directory'
                    : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="nl-display text-lg font-extrabold text-[#F5C65D]">
            Venue partner
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white">
            {league.venuePartner}
          </p>
          <h2 className="nl-display mt-8 text-lg font-extrabold text-[#F5C65D]">
            Follow
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#AAB8CA]">
            Official social channels will be listed here once the organisers
            share them.
          </p>
        </div>

        <div>
          <h2 className="nl-display text-lg font-extrabold text-[#F5C65D]">
            Call the organisers
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {leagueContacts.map((c) => (
              <li key={c.phone}>
                <a
                  href={telHref(c.phone)}
                  className="group inline-flex items-center gap-2.5 text-white"
                >
                  <Phone
                    className="h-4 w-4 text-[#F5C65D]"
                    aria-hidden="true"
                  />
                  <span>
                    {c.name}
                    <span className="ml-2 text-[#AAB8CA] group-hover:text-white">
                      {c.phone}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="nl-wrap flex flex-col gap-2 py-6 text-xs text-[#AAB8CA] md:flex-row md:items-center md:justify-between">
          <p>
            © {league.year} {league.name}. Presented by {league.presenter}.
          </p>
          <p>
            Teams, players, fixtures and statistics on this site are sample data
            until official details are published.
          </p>
        </div>
      </div>
    </footer>
  );
}
