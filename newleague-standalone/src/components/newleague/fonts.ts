import { Archivo, Big_Shoulders_Display } from 'next/font/google';

/**
 * League typefaces, scoped to /newleague via CSS variables on the league
 * root element so they never affect the rest of PlayMatches.
 *
 * Big Shoulders Display — condensed athletic display face for headlines,
 *   scores and numbers.
 * Archivo — sturdy grotesque for body copy and UI.
 */
export const leagueDisplay = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['600', '800', '900'],
  variable: '--nl-font-display',
  display: 'swap',
});

export const leagueBody = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--nl-font-body',
  display: 'swap',
});
