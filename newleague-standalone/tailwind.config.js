/**
 * Tailwind configuration for the standalone league site.
 *
 * Mirrors apps/pm-player-portal/tailwind.config.js: the same preset (PlayMatches
 * design tokens + @tailwindcss/forms) and the typography plugin. Nx glob helpers,
 * shared-library globs, the safelist and brand colours/fonts were removed because
 * they belong to other PlayMatches pages; the league pages do not use them.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./tailwind.preset.js')],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('@tailwindcss/typography')],
};
