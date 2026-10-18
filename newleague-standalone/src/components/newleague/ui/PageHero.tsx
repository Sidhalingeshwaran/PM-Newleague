import Image from 'next/image';

interface PageHeroProps {
  /** Each entry renders as its own line of the headline. */
  title: string[];
  intro: React.ReactNode;
  image?: { src: string; alt: string };
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Inner-page hero: oversized headline on a half-court backdrop, with an
 * optional photograph bleeding off the right edge.
 */
export default function PageHero({
  title,
  intro,
  image,
  aside,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pt-[calc(var(--nl-header-h)+56px)] pb-14 md:pb-20">
      {image && (
        <div
          className="absolute inset-y-0 right-0 hidden w-[52%] md:block"
          aria-hidden="true"
        >
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="52vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061426] via-[#061426]/70 to-[#061426]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#061426] to-transparent" />
        </div>
      )}
      {/* Half-court markings */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-full w-[640px] opacity-[0.18]"
        viewBox="0 0 640 600"
        preserveAspectRatio="xMinYMid slice"
      >
        <g fill="none" stroke="#EBF4FF" strokeWidth="1.2">
          <rect x="60" y="40" width="520" height="620" />
          <line x1="104" y1="40" x2="104" y2="660" />
          <line x1="536" y1="40" x2="536" y2="660" />
          <line x1="60" y1="104" x2="580" y2="104" />
          <line x1="60" y1="420" x2="580" y2="420" />
          <line x1="320" y1="104" x2="320" y2="420" />
        </g>
      </svg>

      <div className="nl-wrap relative">
        <div className="max-w-3xl">
          <h1 className="nl-rise text-[clamp(3rem,10vw,7.5rem)] font-black">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="nl-fade-late mt-6 max-w-xl text-base leading-relaxed text-[#AAB8CA] md:text-lg">
            {intro}
          </div>
          {children && (
            <div className="nl-fade-late mt-8 flex flex-wrap items-center gap-3">
              {children}
            </div>
          )}
        </div>
        {aside && <div className="nl-fade-late mt-10">{aside}</div>}
      </div>
      {image && <p className="sr-only">{image.alt}</p>}
    </section>
  );
}
