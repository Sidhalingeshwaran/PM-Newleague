import Image from 'next/image';
import Link from 'next/link';
import { league, leagueRoutes } from './data/league';
import { formatINR } from './lib/format';
import Reveal from './ui/Reveal';

interface FranchiseCTAProps {
  headingLevel?: 'h2' | 'h3';
}

/**
 * Franchise invitation, built from the organisers' banner: fee, presenter and
 * venue partner. Makes no claims about returns or availability.
 */
export default function FranchiseCTA({
  headingLevel = 'h2',
}: FranchiseCTAProps) {
  const Heading = headingLevel;
  return (
    <section
      aria-labelledby="nl-franchise-heading"
      className="relative overflow-hidden border-y border-[#F5C65D]/25 bg-[#030B17]"
    >
      <div
        className="absolute inset-y-0 right-0 w-full md:w-[55%]"
        aria-hidden="true"
      >
        <Image
          src="/newleague/images/gold-racket.webp"
          alt=""
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover object-[70%_center] opacity-40 md:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030B17] via-[#030B17]/60 to-transparent" />
      </div>

      <div className="nl-wrap relative grid gap-12 py-20 md:grid-cols-[1.15fr_1fr] md:py-28">
        <Reveal>
          <Heading
            id="nl-franchise-heading"
            className="text-[clamp(2.8rem,8vw,6rem)] font-black"
          >
            <span className="block">Own your team.</span>
            <span className="block text-[#F5C65D]">Build your legacy.</span>
          </Heading>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#AAB8CA]">
            Be part of the action. Join the growing badminton community and
            explore the franchise opportunities available for the upcoming
            league.
          </p>

          <dl className="mt-10 grid max-w-lg gap-px bg-white/10 sm:grid-cols-2">
            <div className="bg-[#030B17] p-5 sm:col-span-2">
              <dt className="text-sm text-[#AAB8CA]">Franchise fee</dt>
              <dd className="nl-numeral mt-1 text-6xl font-black text-[#F5C65D]">
                {formatINR(league.franchiseFee)}
              </dd>
            </div>
            <div className="bg-[#030B17] p-5">
              <dt className="text-sm text-[#AAB8CA]">Venue partner</dt>
              <dd className="mt-1 font-semibold">{league.venuePartner}</dd>
            </div>
            <div className="bg-[#030B17] p-5">
              <dt className="text-sm text-[#AAB8CA]">Presented by</dt>
              <dd className="mt-1 font-semibold">{league.presenter}</dd>
            </div>
          </dl>

          <Link
            href={leagueRoutes.contact}
            className="nl-btn nl-btn--gold mt-10"
          >
            Enquire about a franchise
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
