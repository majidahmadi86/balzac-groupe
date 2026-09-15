# Groupe Balzac

Corporate site for Groupe Balzac (balzacgroupe.com), the hub tying together Balzac Café, Balzac Antiques and Balzac Immobilier.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Static content, no database
- Fonts self-hosted from `app/fonts` via `next/font/local` (EB Garamond for display and text, SIL OFL 1.1)
- Route-based i18n: English at `/`, French at `/fr`, same slugs (`/vision` and `/fr/vision`). Copy lives in `lib/i18n.ts`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Checks

Keep these green before every commit. `check:copy` needs no server; the others run against a production build.

```bash
npm run check:copy                 # no em/en dashes, no emoji, entity name only in lib/legal.ts
npm run build && npm start         # then, in another terminal:
BASE_URL=http://localhost:3000 npm run check:site      # crawl, EN/FR parity, hidden nav, icons + OG
BASE_URL=http://localhost:3000 npm run check:overflow  # 320 to 1920px, every route, both languages
npm run verify                     # lint + all of the above
```

`check:overflow` starts a local Chrome or Edge (override with `BROWSER_PATH`, or attach with `CDP_URL`).

## Brand assets and legal facts

- `npm run assets:brand` regenerates `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` and the EN/FR Open Graph cards from the plaque design.
- `lib/legal.ts` holds the legal entity and every legal fact. Unknown facts are `null` constants and show as "to be confirmed" on /legal and /privacy until filled.
- News is hidden from navigation by `SHOW_NEWS` in `lib/routes.ts`; the route stays live.

Copy `.env.example` to `.env.local` when the forms land (Resend).

## Reference

Design mockups live in `docs/`. The mobile mockup is the approved direction.
