# Arvenis Group — corporate demo website

A bilingual (IT/EN) website for a **fictional** business advisory firm. Crescita Digitale Italia uses it as a portfolio demo.
All company details, people, figures, testimonials and case studies are invented and are labelled as fictional on the site.

**Stack:** Next.js 16 (App Router, Cache Components, Turbopack) · TypeScript · Tailwind CSS v4 · Motion · Lucide · React Hook Form + Zod · `next/font` (Instrument Sans + Instrument Serif) · Playwright.

## Getting started

```bash
npm install
cp .env.example .env.local      # then edit values
node scripts/placeholders.mjs   # creates placeholder images for any missing slot
npm run dev                     # http://localhost:3000 → redirects to /it or /en
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build && npm start` | Production build and server |
| `npm run lint` / `npx tsc --noEmit` | Lint and type-check |
| `npx playwright test` | Browser journeys (starts the server on port 3100). Inside the Claude cloud sandbox, prefix it with `PW_CHROMIUM=/opt/pw-browsers/chromium`. |
| `node scripts/screenshots.mjs` | Full-page screenshots at 1440, 768 and 375px into `screenshots/` (needs a running server on :3100) |

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
  lib/schema.ts             Zod schema shared by the forms and the API route
  app/[lang]/…              pages: home, about, services, projects/[slug], why-us,
                            team, insights/[slug], contact, consultation, privacy, cookies, 404
  app/api/consultation      form endpoint (demo mode)
  app/sitemap.ts, robots.ts
  components/               Header, Footer, RequestForm, Reveal, Counter, ParallaxImage…
```

URLs are `/it/...` and `/en/...` and use the same slug in both languages, so the language switcher keeps you on the current page.

## Replacing the demo branding

1. **Name, contacts and copy:** edit `src/content/it.ts` and `src/content/en.ts`. TypeScript reports any key missing from the English file.
2. **Logo:** `src/components/Logo.tsx` and `public/icon.svg`.
3. **Colours and fonts:** `@theme` in `src/app/globals.css` and the font imports in `src/app/[lang]/layout.tsx`.
4. **Demo labelling:** remove `brand.demoBar` and the "fictional / illustrative" notes (`common.*`, `footer.rights`) **only** once the content is real.
5. **Structured data:** the `ProfessionalService` JSON-LD in `src/app/[lang]/layout.tsx`.
6. **Legal pages:** the privacy and cookie texts are placeholders. Have them written by a professional for the real data controller.

## Images

Every image lives in `public/images/<slot>.jpg`, and `next/image` serves it as AVIF/WebP at responsive sizes.

- Placeholders: `node scripts/placeholders.mjs` (`--force` regenerates them).
- Real photos: fill `scripts/images.json` with Unsplash photo URLs and run `node scripts/fetch-images.mjs`. The script crops each photo to its slot and writes `public/images/CREDITS.md`.
- Or drop in your own licensed JPGs with the same file names. Recommended sizes are in `scripts/placeholders.mjs`.

## Forms and connecting a real backend

The contact and consultation forms validate on the client (React Hook Form + Zod) and again on the server (`src/app/api/consultation/route.ts`).
Spam protection is a hidden honeypot field plus a minimum fill time. Submissions that look automated get a fake "ok" response and are dropped.

**Demo mode:** the route validates the request and returns `{ ok: true, demo: true }`. Nothing is sent or stored, and the UI says so.

To deliver real requests, replace the final `return` in the route handler. For example, with [Resend](https://resend.com):

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "Website <noreply@yourdomain.it>",
  to: process.env.CONSULTATION_INBOX!,
  replyTo: data.email,
  subject: `New ${data.kind} request — ${data.name}`,
  text: JSON.stringify(data, null, 2),
});
```

Alternatives: POST the payload to a CRM or booking webhook (HubSpot, Calendly, n8n/Make/Zapier).
For high-traffic sites, add rate limiting (e.g. Upstash) or Cloudflare Turnstile.

## Deploying to Vercel

1. Push the repository to GitHub and import it at vercel.com/new. If this folder sits inside a monorepo, set **Root Directory** to `01-corporate`.
2. Framework preset: Next.js. The default build settings work.
3. Add `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.example.it`) and `NEXT_PUBLIC_WHATSAPP_NUMBER`.
4. Deploy, then add the custom domain under Settings → Domains.

## Cookies

The site sets no profiling or analytics cookies, so no consent banner is required (Italian Garante guidelines, June 2021).
If you add analytics, add a compliant consent banner before you enable it.
