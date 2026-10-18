import localFont from 'next/font/local';

/**
 * League typefaces, scoped to /newleague via CSS variables on the league
 * root element so they never affect the rest of PlayMatches.
 *
 * Big Shoulders Display — condensed athletic display face for headlines,
 *   scores and numbers.
 * Archivo — sturdy grotesque for body copy and UI.
 *
 * Self-hosted (next/font/local) rather than fetched from Google Fonts at build
 * time: next/font/google in Next.js 14.2 crashes when Google returns a font
 * URL without a file extension (vercel/next.js#99114), which failed the
 * Vercel build. The files in ./fonts are the official Google Fonts variable
 * fonts (SIL Open Font License, see ./fonts/OFL-*.txt), subset to Google's
 * latin + latin-ext character sets (latin-ext carries the ₹ sign). Weights are
 * declared exactly as before so font matching is unchanged.
 */
export const leagueDisplay = localFont({
  src: [
    {
      path: './fonts/BigShouldersDisplay-wght-latin-latinext.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/BigShouldersDisplay-wght-latin-latinext.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/BigShouldersDisplay-wght-latin-latinext.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--nl-font-display',
  display: 'swap',
});

export const leagueBody = localFont({
  src: [
    {
      path: './fonts/Archivo-wght-latin-latinext.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Archivo-wght-latin-latinext.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Archivo-wght-latin-latinext.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Archivo-wght-latin-latinext.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--nl-font-body',
  display: 'swap',
});
