import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import EnquiryForm from '@/components/newleague/contact/EnquiryForm';
import {
  league,
  leagueContacts,
  leagueRoutes,
} from '@/components/newleague/data/league';
import { formatINR, telHref } from '@/components/newleague/lib/format';

export const metadata: Metadata = {
  title: 'Franchise enquiries',
  description: `Enquire about owning a franchise in the ${league.name}, ${
    league.seasonLabel
  }. Franchise fee ${formatINR(league.franchiseFee)}.`,
  alternates: { canonical: leagueRoutes.contact },
  openGraph: {
    url: leagueRoutes.contact,
    title: `Franchise enquiries | ${league.shortName} Season ${league.season}`,
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 pb-14 pt-[calc(var(--nl-header-h)+56px)] md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 480px at 90% 0%, rgba(245,198,93,0.16), transparent 65%)',
          }}
        />
        <div className="nl-wrap relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <h1 className="nl-rise text-[clamp(3.2rem,10vw,7.5rem)] font-black leading-[0.86]">
              <span className="block">Your team.</span>
              <span className="block text-[#F5C65D]">Your legacy.</span>
            </h1>
            <p className="nl-fade-late mt-6 max-w-lg text-lg leading-relaxed text-[#D5DEEA]">
              Explore franchise opportunities and become part of the badminton
              league.
            </p>
          </div>
          <dl className="nl-fade-late grid gap-px bg-white/10 sm:grid-cols-2">
            <div className="bg-[#061426] p-5 sm:col-span-2">
              <dt className="text-sm text-[#AAB8CA]">Franchise fee</dt>
              <dd className="nl-numeral mt-1 text-6xl font-black text-[#F5C65D]">
                {formatINR(league.franchiseFee)}
              </dd>
            </div>
            <div className="bg-[#061426] p-5">
              <dt className="text-sm text-[#AAB8CA]">Season</dt>
              <dd className="mt-1 font-semibold">{league.seasonLabel}</dd>
            </div>
            <div className="bg-[#061426] p-5">
              <dt className="text-sm text-[#AAB8CA]">Venue partner</dt>
              <dd className="mt-1 font-semibold">{league.venuePartner}</dd>
            </div>
            <div className="bg-[#061426] p-5 sm:col-span-2">
              <dt className="text-sm text-[#AAB8CA]">Presented by</dt>
              <dd className="mt-1 font-semibold">{league.presenter}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="nl-wrap grid gap-14 py-14 md:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <section aria-labelledby="nl-call">
          <h2 id="nl-call" className="text-[clamp(2.4rem,6vw,4rem)] font-black">
            Call the organisers
          </h2>
          <p className="mt-3 max-w-sm text-[#AAB8CA]">
            The quickest way to ask about a franchise. Tap a number to call.
          </p>
          <ul className="mt-8 border-t border-white/10">
            {leagueContacts.map((c) => (
              <li key={c.phone} className="border-b border-white/10">
                <a
                  href={telHref(c.phone)}
                  className="group flex items-center justify-between gap-4 py-5"
                  aria-label={`Call ${c.name} on ${c.phone
                    .split('')
                    .join(' ')}`}
                >
                  <span>
                    <span className="block text-lg font-semibold">
                      {c.name}
                    </span>
                    <span className="nl-numeral block text-3xl font-black tracking-wide text-[#F5C65D]">
                      {c.phone}
                    </span>
                  </span>
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-white/20 transition-colors group-hover:border-[#F5C65D] group-hover:bg-[#F5C65D] group-hover:text-[#061426]">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="nl-enquiry"
          className="border border-white/10 bg-[#0A1D35] p-6 md:p-10"
        >
          <h2
            id="nl-enquiry"
            className="text-[clamp(2.2rem,5vw,3.5rem)] font-black"
          >
            Franchise enquiry
          </h2>
          <p className="mb-8 mt-3 max-w-lg text-[#AAB8CA]">
            Tell us a little about yourself. Fields marked optional can be left
            blank.
          </p>
          <EnquiryForm />
        </section>
      </div>
    </>
  );
}
