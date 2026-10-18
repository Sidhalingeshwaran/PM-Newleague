import type { Metadata } from 'next';
import './global.css';

/**
 * Root layout for the standalone league site.
 *
 * Keeps the same document shell as the PlayMatches player portal root layout
 * (html/body/main classes) so the league pages render identically. PlayMatches-
 * only pieces are intentionally not included: the PlayMatches header/footer
 * (already hidden on league pages), auth/UTM providers, Google Analytics,
 * Zoho SalesIQ, the Meta Pixel and the Teko/Chakra Petch fonts (league pages
 * use their own fonts from components/newleague/fonts.ts).
 *
 * League metadata (titles, description, Open Graph) lives in (league)/layout.tsx.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col">
        <main className="relative z-10 flex-1">{children}</main>
      </body>
    </html>
  );
}
