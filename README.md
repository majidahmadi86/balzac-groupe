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

Keep these green before every commit; `npm run verify` runs them all. `check:copy` and `check:forms` need no running server (build first for `check:forms`); `check:site` and `check:responsive` run against `npm start`.

```bash
npm run check:copy                 # no em/en dashes, no emoji, entity name only in lib/legal.ts
npm run build && npm start         # then, in another terminal:
BASE_URL=http://localhost:3000 npm run check:site        # link crawl, anchors, EN/FR parity, hidden nav, icons + OG
BASE_URL=http://localhost:3000 npm run check:responsive  # the responsive gate, 320 to 1920px, every route, both languages
npm run check:forms                # both forms end to end against a local mock of the Resend API
```

The responsive gate fails on horizontal overflow, text escaping its section, a section shorter than its content, any tap target under 44px, and (below 768px) an image box more than 25% off its source aspect. Hero crops opt out with `data-crop="art-directed"`.

Browser-based checks start a local Chrome or Edge (override with `BROWSER_PATH`, or attach with `CDP_URL`).

## Forms and email

Contact and Franchise forms post to server actions (`lib/form-actions.ts`) and send through Resend (`lib/email.ts`): server-side validation, a honeypot, a per-IP rate limit, Reply-To set to the submitter, plain text and HTML templates.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (key name in Resend: Balzac_Groupe). Never commit it. |
| `CONTACT_TO_EMAIL` | Inbox that receives submissions (comma-separated for several). |
| `RESEND_FROM_EMAIL` | Optional sender on the verified domain. Defaults to `Groupe Balzac <site@balzacgroupe.com>`. |
| `FORM_RATE_LIMIT`, `FORM_RATE_WINDOW_MS` | Optional. Defaults: 5 sends per IP per 10 minutes. |

## Brand assets and legal facts

- `npm run assets:brand` regenerates `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` and the EN/FR Open Graph cards from the plaque design.
- `lib/legal.ts` holds the legal entity and every legal fact. Unknown facts are `null` constants and show as "to be confirmed" on /legal and /privacy until filled.
- News is hidden from navigation by `SHOW_NEWS` in `lib/routes.ts`; the route stays live.

Copy `.env.example` to `.env.local` and fill it in for the forms to send.

## Reference

Design mockups live in `docs/`. The mobile mockup is the approved direction.
