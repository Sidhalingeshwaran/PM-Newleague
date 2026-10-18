'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  league,
  leagueNav,
  leagueRoutes,
  LEAGUE_BASE_PATH,
} from '../data/league';
import { cx } from '../lib/format';
import LeagueMark from './LeagueMark';

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === LEAGUE_BASE_PATH)
    return pathname === LEAGUE_BASE_PATH || pathname === `${LEAGUE_BASE_PATH}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function LeagueHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Compact, solid header once the page scrolls (state only flips at the threshold).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() =>
      firstLinkRef.current?.focus()
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = () => desktop.matches && close();
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [open, close]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
          solid
            ? 'border-b border-white/10 bg-[#061426]/92 backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-[#030B17]/80 to-transparent'
        )}
      >
        <div className="nl-wrap flex h-[var(--nl-header-h)] items-center justify-between gap-4">
          <Link
            href={leagueRoutes.home}
            className="flex min-w-0 items-center gap-3"
            aria-label={`${league.name} — home`}
            onClick={() => close()}
          >
            <LeagueMark size={40} />
            <span className="min-w-0 leading-tight">
              <span className="block text-[11px] font-semibold tracking-wide text-[#F5C65D]">
                {league.presenterShort}
              </span>
              <span className="nl-display block truncate text-lg font-extrabold sm:hidden">
                {league.shortName} <span className="text-[#AAB8CA]">S4</span>
              </span>
              <span className="nl-display hidden truncate text-lg font-extrabold sm:block lg:max-w-[18rem] xl:max-w-none">
                {league.name}
              </span>
            </span>
          </Link>

          <nav aria-label="League" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {leagueNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cx(
                        'nl-display relative block px-3 py-2 text-[1.05rem] font-extrabold tracking-[0.08em] transition-colors',
                        active
                          ? 'text-white'
                          : 'text-[#AAB8CA] hover:text-white'
                      )}
                    >
                      {item.label.toUpperCase()}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute inset-x-3 -bottom-0.5 h-[2px] origin-left bg-[#F5C65D] transition-transform duration-300',
                          active ? 'scale-x-100' : 'scale-x-0'
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={leagueRoutes.contact}
              className="nl-btn nl-btn--gold nl-btn--sm hidden min-[380px]:inline-flex"
            >
              Own a franchise
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"
              aria-expanded={open}
              aria-controls="nl-mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become
          the containing block for this fixed overlay and clip it. */}
      <div
        id="nl-mobile-menu"
        className="nl-menu fixed inset-x-0 bottom-0 top-[var(--nl-header-h)] z-40 overflow-y-auto bg-[#061426] lg:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <nav
          aria-label="League mobile"
          className="nl-wrap flex min-h-full flex-col py-8"
        >
          <ul className="border-t border-white/10">
            {leagueNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className="border-b border-white/10"
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => close()}
                    className={cx(
                      'nl-display flex items-center justify-between py-4 text-[2.4rem] font-black',
                      active ? 'text-[#F5C65D]' : 'text-white'
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="text-sm font-semibold normal-case tracking-normal text-[#AAB8CA]"
                        style={{ fontFamily: 'var(--nl-font-body)' }}
                      >
                        You are here
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto pt-10">
            <Link
              href={leagueRoutes.contact}
              onClick={() => close()}
              className="nl-btn nl-btn--gold w-full"
            >
              Own a franchise
            </Link>
            <p className="mt-4 text-sm text-[#AAB8CA]">
              {league.seasonLabel}. Presented by {league.presenter}.
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
