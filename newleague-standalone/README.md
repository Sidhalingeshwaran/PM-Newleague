# T. Dasarahalli Premier Badminton League — standalone site

The league website (Season 4 — 2026, presented by RacketRush Badminton Academy), extracted from the PlayMatches monorepo where it lived at `apps/pm-player-portal` under `/newleague`. It is now its own Next.js app served from the site root.

The code is the original NewLeague implementation, copied unchanged except where noted in [Changes made during extraction](#changes-made-during-extraction).

## Tech stack

|                 |                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | Next.js 14.2.35 (App Router), React 19.0.1, TypeScript 5.8                                                                              |
| Styling         | Tailwind CSS 3.4 (+ `@tailwindcss/forms`, `@tailwindcss/typography`), one scoped stylesheet (`src/components/newleague/newleague.css`)  |
| Fonts           | Big Shoulders Display + Archivo, self-hosted with `next/font/local` (files in `src/components/newleague/fonts/`, SIL Open Font License) |
| Icons           | `lucide-react`                                                                                                                          |
| 3D hero         | Custom Canvas 2D renderer (no WebGL library)                                                                                            |
| Package manager | pnpm 10.11.1 (pinned via `packageManager`)                                                                                              |

Versions are pinned to exactly what the PlayMatches monorepo lockfile resolved, so the site builds with the same toolchain it was developed with.

## Getting started

Requirements: Node.js 18.17+ (20 or 22 recommended) and pnpm. If you have Corepack, `corepack enable` picks up the pinned pnpm version automatically.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Production:

```bash
pnpm build
pnpm start        # http://localhost:3000
```

Other scripts: `pnpm lint`, `pnpm typecheck`, `pnpm format`.

**Fonts:** the two league fonts are bundled in the repo, so `next build` needs no access to Google Fonts. (Earlier builds fetched them from Google at build time, which can crash Next.js 14.2 when Google returns a font URL without a file extension; see [vercel/next.js#99114](https://github.com/vercel/next.js/issues/99114).)

## Environment variables

Copy `.env.example` to `.env.local` if you need to set any.

| Name                   | Required                                 | Purpose                                                                                                                       |
| ---------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No (defaults to `http://localhost:3000`) | Base URL for canonical and Open Graph links. Same name as in the PlayMatches portal. Set it to the real domain in production. |

No secrets are needed.

## External services

- **Google Fonts**: none. The fonts are self-hosted.
- **None at runtime.** The site makes no API calls. All teams, players, fixtures and statistics come from local TypeScript files in `src/components/newleague/data/` and are **sample data**. The franchise enquiry form validates in the browser but **does not send anywhere**: there was no backend in the original either. The place to connect one is `submitEnquiryDemo()` in `src/components/newleague/contact/EnquiryForm.tsx`.

## Routes

| URL             | Page                                                                        | Was (in PlayMatches)      |
| --------------- | --------------------------------------------------------------------------- | ------------------------- |
| `/`             | Home (3D hero, franchises, format, players, fixtures, franchise invitation) | `/newleague`              |
| `/about`        | About the league                                                            | `/newleague/about`        |
| `/teams`        | Franchise directory (search, filter, sort)                                  | `/newleague/teams`        |
| `/teams/[slug]` | Team details (8 pages, pre-rendered)                                        | `/newleague/teams/[slug]` |
| `/schedule`     | Fixtures, results, standings (filters)                                      | `/newleague/schedule`     |
| `/players`      | Player directory, MVPs, leaderboard; `?player=<id>` opens a profile         | `/newleague/players`      |
| `/contact`      | Franchise enquiries and organiser phone numbers                             | `/newleague/contact`      |

Unknown URLs show the league's "Out of bounds" 404 page.

## Folder structure

```
newleague-standalone/
├── public/newleague/images/      # 5 WebP images (original paths kept)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # root document shell (html/body/main)
│   │   ├── global.css            # Tailwind layers + base styles from the portal
│   │   ├── not-found.tsx         # 404 for unmatched URLs, wraps the league layout
│   │   ├── icon.svg              # favicon (the league mark)
│   │   └── (league)/             # original app/newleague/ folder, unchanged
│   │       ├── layout.tsx  template.tsx  page.tsx  not-found.tsx
│   │       ├── about/  contact/  players/  schedule/
│   │       └── teams/  teams/[slug]/
│   └── components/newleague/     # original components, data, hooks, lib, styles
├── tailwind.config.js  tailwind.preset.js  postcss.config.js
├── next.config.js  tsconfig.json  eslint.config.mjs
├── package.json  pnpm-lock.yaml  .prettierrc  .env.example
```

`(league)` is a Next.js route group: the folder name does not appear in URLs. It lets the original league layout file stay untouched underneath a separate root layout.

## Changes made during extraction

Everything under `src/app/(league)/`, `src/components/newleague/` and `public/newleague/` is a byte-for-byte copy of the original, except:

1. **`src/components/newleague/data/league.ts`**: `LEAGUE_BASE_PATH` changed from `'/newleague'` to `''`, and the two "Home" entries use `LEAGUE_BASE_PATH || '/'`. Every internal link is built from this constant, so this one edit moves the whole site to the root URL.
2. **`src/app/newleague/` → `src/app/(league)/`**: folder moved into a route group so the pages serve at `/`, `/about`, etc. File contents unchanged.

New files (the parts that used to come from the monorepo):

- `src/app/layout.tsx`: root layout. Keeps the portal's `<html class="scroll-smooth">`, body classes and `<main class="relative z-10 flex-1">` wrapper. Leaves out PlayMatches-only parts: header/footer (already hidden on league pages), auth and UTM providers, Google Analytics, Zoho SalesIQ chat, Meta Pixel, and the Teko/Chakra Petch fonts (league pages use their own fonts).
- `src/app/global.css`: lines 1–51 of the portal's `global.css` (Tailwind layers and the `@layer base` block). The rest of that file only styles other PlayMatches pages.
- `tailwind.preset.js`: copy of `libs/pm-web-ui-core/tailwind.config.js` (design tokens + forms plugin) with its monorepo content paths removed.
- `tailwind.config.js`, `postcss.config.js`, `next.config.js`, `tsconfig.json`, `eslint.config.mjs`: equivalents of the portal's configs without Nx (`withNx`, Nx glob helpers, Nx ESLint presets), monorepo paths, and settings for other apps.
- `src/app/not-found.tsx`: shows the original league 404 page, inside the league layout, for unmatched URLs.
- `src/app/icon.svg`: favicon drawn from the existing `LeagueMark` SVG. The portal used the PlayMatches favicon.

## Known limitations

- Teams, owners, players, fixtures, results and statistics are fictional sample data, labelled as such on the site.
- The enquiry form is a front-end preview only (see above).
- Organiser phone number `961114140` has 9 digits, as printed on the organisers' banner. Confirm it before launch.
- The photos in `public/newleague/images` came from reference images supplied during development. Confirm usage rights before launch.
- `pnpm install` shows a peer-dependency warning (Next 14 declares React 18; this project uses React 19.0.1). This is inherited from the PlayMatches monorepo, which uses the same combination.
