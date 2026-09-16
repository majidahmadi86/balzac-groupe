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
BASE_URL=http://localhost:3000 npm run check:site        # link crawl, anchors, EN/FR parity, hidden nav, icons + OG, no email or placeholder shipped
BASE_URL=http://localhost:3000 npm run check:responsive  # the responsive gate, 320 to 1920px, every route, both languages
BASE_URL=http://localhost:3000 npm run check:lighthouse  # Lighthouse on every route, both languages (not part of verify, about 15 minutes)
npm run check:forms                # both forms end to end: Resend mocked; captcha absent, mocked and live (Cloudflare test keys)
```

`check:site` also fails if any page, the 404 page or any script or stylesheet they load contains an email address, or if a "to be confirmed" placeholder is rendered anywhere. `check:lighthouse` fails below SEO 100, accessibility 100, best practices 100 or performance 90, keeping the median of 3 runs per page (`LIGHTHOUSE_RUNS`). Performance is a lab figure: the same unchanged page moves by several points from run to run, so the floor only catches a real regression; `LIGHTHOUSE_MIN_PERFORMANCE=96` holds the reference target on reference hardware.

The responsive gate fails on horizontal overflow, text escaping its section, content cut off by its section, any tap target under 44px, (below 768px) an image box more than 25% off its source aspect, text under 4.5:1 against the pixels actually rendered behind it (`data-contrast` regions: heroes, forms, bands, pillars), HTML text over baked-in sign text in a photo (`data-text-zones`), and, from 1024px, a form whose first field is not visible in a 768px-tall window. Hero crops opt out of the aspect rule with `data-crop="art-directed"`. `GATE_ONLY=home,contact` limits a run while iterating.

`/sitemap.xml` and `/robots.txt` come from `app/sitemap.ts` and `app/robots.ts`; routes hidden by a flag stay out of the sitemap.

Browser-based checks start a local Chrome or Edge (override with `BROWSER_PATH`, or attach with `CDP_URL`).

## Forms and email

Contact and Franchise forms post to server actions (`lib/form-actions.ts`) and send through Resend (`lib/email.ts`): server-side validation, a honeypot, a per-IP rate limit, a Cloudflare Turnstile captcha verified server-side (`lib/captcha.ts`), Reply-To set to the submitter, plain text and HTML templates.

No email address is shown anywhere on the site. The forms are the only way to write to the group; submissions go to `CONTACT_TO_EMAIL`, which is read on the server and never rendered. When a send fails, the form keeps the typed text and offers to try again.

Turnstile renders in interaction-only mode and loads only once someone starts using a form, so reading a page never loads the vendor script. With both Turnstile keys set, a submission without a valid token gets the failure state and nothing is sent. With either key missing, the forms still send (honeypot and rate limit only) and each submission logs `captcha is unconfigured`. The browser asks for the site key through a server action when a form is first used, so pages stay static and the keys can be set or removed with a restart, no rebuild.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (key name in Resend: Balzac_Groupe). Never commit it. |
| `CONTACT_TO_EMAIL` | Inbox that receives submissions (comma-separated for several). |
| `RESEND_FROM_EMAIL` | Optional sender on the verified domain. Defaults to `Groupe Balzac <site@balzacgroupe.com>`. |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (public, sent to the browser when a form is used). |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key (server only). Never commit it. |
| `FORM_RATE_LIMIT`, `FORM_RATE_WINDOW_MS` | Optional. Defaults: 5 sends per IP per 10 minutes. |

## Brand assets and legal facts

- `npm run assets:brand` regenerates `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` and the EN/FR Open Graph cards from the plaque design.
- `lib/legal.ts` holds the legal entity and every legal fact. Facts not supplied yet are `null` constants and their lines are left out of /legal and /privacy; no placeholder is ever shown. Filling one makes its line appear.
- News is hidden from navigation by `SHOW_NEWS` in `lib/routes.ts`; the route stays live.
- Balzac Immobilier is shown while `SHOW_IMMOBILIER` in `lib/routes.ts` is true (homepage band, About chapter, contact link, legal mentions), described as an activity only: no listings, prices, property gallery or search. Setting it to false hides every mention with no other edit.
- `/houses` and `/fr/houses` answer 301 to `/about` and `/fr/about` (see `next.config.mjs`).
- Photography lives in `public/images/balzacgroupe-*.jpg`. Sections without client photos still use `public/images/temp/` mockup crops, each marked with a TEMP comment.

Copy `.env.example` to `.env.local` and fill it in for the forms to send.

## Reference

Design mockups live in `docs/`. The mobile mockup is the approved direction.
