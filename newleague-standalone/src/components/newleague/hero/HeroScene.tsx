'use client';

import dynamic from 'next/dynamic';

/**
 * Client boundary that lazy-loads the 3D canvas in the browser only, so the
 * renderer never runs during server rendering and never ships to other routes.
 */
const LeagueHero3D = dynamic(() => import('./LeagueHero3D'), {
  ssr: false,
  loading: () => null,
});

export default function HeroScene() {
  return <LeagueHero3D />;
}
