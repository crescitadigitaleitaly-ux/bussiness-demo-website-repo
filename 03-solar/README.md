# Aurevo Energia — solar energy demo website

**Live demo:** https://solar-demo.crescitadigitaleitalia.com

A bilingual (IT/EN), dark-theme website for a **fictional** solar installer in Verona. Crescita Digitale Italia uses it as a portfolio demo.
The company, projects, contact details and figures are invented and labelled as fictional. The savings calculator is clearly marked as a non-binding estimate, and every assumption it uses is listed on the page. It guarantees no savings.

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack) · TypeScript · Tailwind CSS v4 · Motion · Lucide · React Hook Form + Zod · `next/font` (Sora + Geist) · Playwright · axe-core.

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
| `PORT=3300 npx playwright test` | Browser journeys (starts the server on port 3300). Inside the Claude cloud sandbox, prefix it with `PW_CHROMIUM=/opt/pw-browsers/chromium`. |
| `node scripts/screenshots.mjs` | Full-page screenshots at 1440, 768 and 375px into `screenshots/` (needs a running server on :3300) |

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL, used for canonical/hreflang links, the sitemap, Open Graph and JSON-LD |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp destination, digits only, international format. The placeholder `390000000000` stays until the client approves a real number. |

## Structure

```
src/
  proxy.ts                  locale redirect: / → /it (or /en for English browsers)
  content/it.ts, en.ts      ALL copy, per language (en is type-checked against it)
  lib/i18n.ts               locales, dictionary lookup, shared SEO metadata helper
  lib/savings.ts            the savings estimate model and its assumptions
  lib/schema.ts             Zod schema shared by the forms and the API route
  app/[lang]/…              pages: home, about, solutions, solutions/[slug] (residential, commercial,
                            battery storage, EV charging), projects, savings, contact, quote, privacy, cookies, 404
  app/api/quote             quote + contact form endpoint (demo mode)
  app/sitemap.ts, robots.ts
  components/               Header, Footer, RequestForm, QuoteForm, SavingsCalculator, ProjectGallery,
                            EnergyFlow (animated diagram), Reveal…
```

URLs are `/it/...` and `/en/...` and use the same slug in both languages, so the language switcher keeps you on the current page.

## Savings calculator

`src/lib/savings.ts` holds the model. It works out a suggested system size from the monthly bill, then yearly output, a savings range, a payback range and CO₂ avoided.
The `assumptions` object there and the list in `savings.assumptions` (in both content files) must stay in sync: if you change a number, update the text too.
The calculator runs entirely in the browser and sends no data. Its "Request a quote" link pre-fills the property type and battery interest in the quote form (`/quote?property=home&battery=yes`).

## Replacing the demo branding

1. **Name, contacts and copy:** edit `src/content/it.ts` and `src/content/en.ts`. TypeScript reports any key missing from the English file.
2. **Logo:** `src/components/Logo.tsx`, `public/icon.svg` and `public/logo.png`.
3. **Colours and fonts:** `@theme` in `src/app/globals.css` and the font imports in `src/app/[lang]/layout.tsx`.
4. **Demo labelling:** remove `brand.demoBar` and the "fictional / illustrative" notes (`common.*`, `footer.rights`) **only** once the content is real.
5. **Projects:** `projects.items` in the content files. Use only real, documented installations with the client's permission.
6. **Structured data:** the `LocalBusiness` JSON-LD in `src/app/[lang]/layout.tsx`.
7. **Legal pages:** the privacy and cookie texts are placeholders. Have them written by a professional for the real data controller.

## Images

Every image lives in `public/images/<slot>.jpg`, and `next/image` serves it as AVIF/WebP at responsive sizes.

- Real photos: list Unsplash photo IDs in `scripts/images.json` (only free `photo-…` IDs, not `premium_photo-…`), then run `node scripts/fetch-images.mjs`. The script crops each photo to its slot and writes `public/images/CREDITS.md`. If you are behind a proxy, prefix the command with `NODE_USE_ENV_PROXY=1`.
- Or drop in your own licensed JPGs with the same file names. Slot sizes are listed in `scripts/fetch-images.mjs`.

## Forms and connecting a real backend

The quote form collects name, email, phone, property type, approximate monthly bill, installation location, roof type, interest in battery storage, optional additional information and privacy consent.

The contact and quote forms validate on the client (React Hook Form + Zod) and again on the server (`src/app/api/quote/route.ts`).
Spam protection is a hidden honeypot field plus a minimum fill time. Submissions that look automated get a fake "ok" response and are dropped.

**Demo mode:** the route validates the request and returns `{ ok: true, demo: true }`. Nothing is sent or stored, and the UI says so.

To deliver real requests, replace the final `return` in the route handler. For example, with [Resend](https://resend.com):

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "Website <noreply@yourdomain.it>",
  to: process.env.QUOTE_INBOX!,
  replyTo: data.email,
  subject: `New ${data.kind} request — ${data.name}`,
  text: JSON.stringify(data, null, 2),
});
```

Alternatives: POST the payload to a CRM webhook (HubSpot, Pipedrive, n8n/Make/Zapier).
For high-traffic sites, add rate limiting (e.g. Upstash) or Cloudflare Turnstile.

## Deploying to Vercel

1. Push the repository to GitHub and import it at vercel.com/new. If this folder sits inside a monorepo, set **Root Directory** to `03-solar`.
2. Framework preset: Next.js. The default build settings work.
3. Add `NEXT_PUBLIC_SITE_URL` (e.g. `https://solar-demo.crescitadigitaleitalia.com`) and `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Deploy, then add the custom domain under Settings → Domains.

## Cookies

The site sets no profiling or analytics cookies, so no consent banner is required (Italian Garante guidelines, June 2021).
If you add analytics, add a compliant consent banner before you enable it.

## Quality checks

`node scripts/a11y-scan.mjs http://localhost:3300` runs axe-core (WCAG 2.2 AA) on every sitemap URL at 1440px and 375px. Add `MOTION=no-preference` to scan with animations enabled.

## Remaining limitations

- Forms run in demo mode until a delivery backend is connected (see above).
- The savings model is deliberately simple: no hourly consumption profile, panel degradation, financing or incentives.
- Projects, figures and photos are illustrative stock images, not real installations.
- The privacy and cookie pages are placeholder texts.
