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

Copy `.env.example` to `.env.local` when the forms land (Resend).

## Reference

Design mockups live in `docs/`. The mobile mockup is the approved direction.
