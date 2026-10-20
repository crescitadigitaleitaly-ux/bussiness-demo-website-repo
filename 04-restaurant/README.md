# Lanterna — seafood restaurant demo website

**Live demo:** https://restaurant-demo.crescitadigitaleitalia.com

A bilingual (IT/EN) website for a **fictional** seafood restaurant in Camogli, on the Ligurian Riviera. Crescita Digitale Italia uses it as a portfolio demo.
The restaurant, chef, reviews and contact details are invented and labelled as fictional. The dishes, prices and legal notes follow how Ligurian seafood restaurants really publish their menus.

The design comes from direction **C · Lanterna**, one of four restaurant directions (fine dining, trattoria, seafood, pizzeria) presented to the agency and chosen by it.

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack) · TypeScript · Tailwind CSS v4 · Motion · Lucide · React Hook Form + Zod · `next/font` (Libre Caslon Display, Libre Caslon Text italic, Figtree) · Playwright · axe-core.

## Getting started

```bash
npm install
cp .env.example .env.local      # then edit values
npm run dev                     # http://localhost:3000 → redirects to /it or /en
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build && npm start` | Production build and server |
| `npm run lint` / `npx tsc --noEmit` | Lint and type-check |
| `PORT=3400 npx playwright test` | 14 browser tests (starts the server on port 3400). Inside the Claude cloud sandbox, prefix it with `PW_CHROMIUM=/opt/pw-browsers/chromium`. |
| `node scripts/screenshots.mjs` | Full-page screenshots at 1440, 768 and 375px into `screenshots/` (needs a running server on :3400) |
| `node scripts/a11y-scan.mjs http://localhost:3400` | axe-core WCAG 2.2 AA scan of every sitemap URL (add `MOTION=no-preference` for a second pass) |

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL, used for canonical/hreflang links, the sitemap, Open Graph and JSON-LD |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp destination, digits only, international format. The placeholder `390000000000` stays until the client approves a real number. |
| `NEXT_PUBLIC_THEFORK_URL` | The restaurant's own TheFork page. Defaults to the TheFork home page in the demo. |

## Pages

Home · Menu · Prenota (booking) · La cucina · Terrazza ed eventi · Dove siamo · Privacy · Cookie · localized 404.

## What makes it a restaurant site (and not a template)

- **Today's catch** (`CatchBoard`): the day's fish with an "updated at" time, priced per 100 g, as Ligurian seafood restaurants do.
- **Live open/closed badge** (`OpenStatus` + `src/lib/hours.ts`): computed in Europe/Rome time, for example "Chiuso ora · riapre oggi 19:30". The same opening hours generate the `Restaurant` JSON-LD, so the two never disagree.
- **HTML menu, not a PDF** (`MenuBrowser`):
  - Crudo / gluten-free / vegetarian filters. Filters only hide dishes, so search engines read the whole menu.
  - The 14 EU allergens are numbered on every dish (Reg. UE 1169/2011).
  - The legal notes Italian menus carry: fish served raw is blast-frozen (Reg. CE 853/2004), and an asterisk marks products that may be frozen at origin.
  - The cover charge.
  - `Menu` JSON-LD with prices and diet tags.
- **Three ways to book** (`BookingOptions`):
  - the restaurant's own booking form: date, lunch or dinner time slot, guests, terrace or dining room, allergies;
  - a WhatsApp message, pre-filled;
  - a "Prenota su TheFork" link.
- **Phone-first actions** (`MobileActionBar`): a Prenota · Chiama · WhatsApp bar stays at the bottom of the screen on phones.

## Replacing the demo branding

1. **Copy, dishes, prices and hours:** edit `src/content/it.ts` and `src/content/en.ts`. TypeScript reports any key missing from the English file. Change the opening hours in `src/lib/hours.ts` too, and keep them in line with `brand.hours`.
2. **Logo:** `src/components/Logo.tsx`, `public/icon.svg` and `public/logo.png`.
3. **Colours and fonts:** `@theme` in `src/app/globals.css` and the font imports in `src/app/[lang]/layout.tsx`. Accent text on light backgrounds uses `amber` (#93600f). The brighter `sun` (#d9a03a) is only for dark backgrounds and graphics, because it fails contrast on the light background.
4. **Demo labelling:** remove `brand.demoBar` and the "fictional" notes (`common.fictionalReviews`, `footer.rights`, chef `role`) **only** once the content is real. Replace the demo reviews with real ones, used with permission.
5. **Booking links:** set `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_THEFORK_URL`.
6. **Legal pages:** the privacy and cookie texts are placeholders. Allergy information is sensitive, so have the privacy notice written by a professional.

## Images

Every image lives in `public/images/<slot>.jpg`, and `next/image` serves it as AVIF/WebP at responsive sizes.

- Real photos: list Unsplash photo IDs in `scripts/images.json` (only free `photo-…` IDs), then run `node scripts/fetch-images.mjs`. The script crops each photo to its slot and writes `public/images/CREDITS.md`. If you are behind a proxy, prefix the command with `NODE_USE_ENV_PROXY=1`.
- For a real client, use their own photos of the dishes, the dining room and the view. That matters more than anything else on a restaurant site.

## Forms and connecting a real backend

The booking and contact forms validate on the client (React Hook Form + Zod) and again on the server (`src/app/api/booking/route.ts`).
Spam protection is a hidden honeypot field plus a minimum fill time.

**Demo mode:** the route validates the request and returns `{ ok: true, demo: true }`. Nothing is sent or stored, and the UI says so. It never shows a fake confirmation.

To go live:
- send requests by email (Resend), or
- post them to the restaurant's reservation system (TheFork Manager, Plateform, SevenRooms, Google Sheets via n8n or Make).

Add rate limiting or Cloudflare Turnstile if spam becomes a problem.

## Deploying to Vercel

1. Import the repository at vercel.com/new and set **Root Directory** to `04-restaurant`.
2. Framework preset: Next.js. The default build settings work.
3. Add the environment variables above.
4. Deploy, then add the custom domain under Settings → Domains.

## Quality checks (October 2026)

- Playwright: 14/14 passing. The tests cover links, overflow at 375/768/1440, the language switch, the 404, the mobile menu and quick-action bar, the skip link, booking validation, the three booking options, menu filters, the open/closed badge and opening-hours logic, the contact form, the API and reduced motion.
- axe-core: 0 violations in both reduced-motion and full-motion modes.
- Lighthouse (mobile): Accessibility, Best Practices and SEO 100. Performance 95–97 on home and menu, 89–92 on the booking page, which loads the form-validation code.

## Remaining limitations

- Forms run in demo mode until a delivery backend is connected.
- The catch board and menu are static content. A real client would update them in the content files or through a small CMS or Google Sheet.
- Photos are stock images, not the restaurant's own.
- The privacy and cookie pages are placeholder texts.
