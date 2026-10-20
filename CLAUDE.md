# CLAUDE.md — Crescita Digitale Italia: demo website portfolio

Read this first. It holds everything needed to continue work without starting from scratch.
Last updated: October 2026.

## Who the user is and how to work with them

- **Owner:** Crescita Digitale Italia (crescitadigitaleitalia.com), a web/digital agency in Savona, Liguria. It builds websites for the **service sector** (consultants, clinics, installers, restaurants, trades…) in Italy and abroad.
- **Role they want from Claude:** website marketing and sales strategist plus builder of beautiful, high-converting websites. Add a short, practical "how to sell this" tip when presenting work.
- **Language:** the user writes in short, informal English. Answer in clear, simple English. Site content is Italian (default) plus English.
- **Working rules they set (keep following them):**
  - Build one website at a time, verify quality, show results, then wait for approval before starting the next.
  - Never deploy, publish, buy assets, connect external services or install unapproved skills **without permission**. Deploying the demos to Vercel and pushing to these GitHub repos has been approved.
  - Never invent real business contact details. All demo brands, people, projects and numbers are **fictional and labelled as fictional** on every page.
  - No fabricated credentials, guaranteed results or misleading claims (especially medical and energy-savings content).
  - Only licensed images: Unsplash `photo-…` IDs (free licence), never `premium_photo-…`.
  - Report real measured scores. Never invent test or Lighthouse results.
- **Audit routine** (requested for each site before "green signal"): use the skills `seo-skills:seo-technical-audit`, `seo-skills:seo-schema` and `design:accessibility-review`. SE Ranking and Firecrawl are not connected, so do a local crawl of every sitemap URL (title/description length, h1, canonical, hreflang, og:image, alt, JSON-LD parse) plus the axe scan and Lighthouse. Then fix, push, verify live and report.

## The live demo websites

| Folder | Brand (fictional) | Sector / theme | Live URL | Vercel project |
|---|---|---|---|---|
| `01-corporate` | Arvenis Group | Business consulting, light (navy #172333 / blue #315d86) | https://business-demo.crescitadigitaleitalia.com | `bussiness-demo-website-repo` (prj_ER4lGDjp2xWGfDwonDYo7ln9a4pr) |
| `02-dental` | Lumea Clinica Dentale (Bologna) | Dental clinic, light teal (#F8FBFB / #19343B / #168C88) | https://dental-demo.crescitadigitaleitalia.com | `dental-demo` (prj_Ojr6r9B9CmC8TCh0yG5lNNBjAFjO) |
| `03-solar` | Aurevo Energia (Verona) | Solar installer, dark (#0A1118 / #14212B / lime #B7E35A) | https://solar-demo.crescitadigitaleitalia.com | `solar-demo` (prj_oN5En7y3q2UhzREI4V6MK8Oo67aE) |
| `04-restaurant` | Lanterna (Camogli) | Seafood restaurant, light sea-mist (#E9EFEE / navy #0F2A3A / amber #93600F, sun #D9A03A on dark) | https://restaurant-demo.crescitadigitaleitalia.com | `restaurant-demo` (prj_y0InE6pP2bdFzo32k9Z41z1jz0Dm) |

Sites 01–03 are presented on the agency site's portfolio page (04 still to be added): https://www.crescitadigitaleitalia.com/#/portfolio (repo `crescitadigitaleitaly-ux/My-Portfolio-web`, see its own CLAUDE.md).

### Deployment facts

- GitHub: `crescitadigitaleitaly-ux/bussiness-demo-website-repo` (public), branch `main`. **Every push to `main` auto-deploys every Vercel project.** Each project has its Root Directory set to its folder.
- Vercel team: "Crescita Digitale Italia's projects", `team_kZPupVaYfqxWd6zyCpzjYbE2`. The domain `crescitadigitaleitalia.com` uses Vercel DNS, so new subdomains verify instantly with `add_project_domain`.
- Env vars per project: `NEXT_PUBLIC_SITE_URL` (the subdomain URL) and `NEXT_PUBLIC_WHATSAPP_NUMBER=390000000000` (placeholder until a client gives a real one).
- Deployment protection is "all except custom domains": `*.vercel.app` URLs need a Vercel login; the custom subdomains are public.
- **Adding a new demo site** (proven recipe):
  1. Push the folder to `main`.
  2. Call `create_git_project` with repo `crescitadigitaleitaly-ux/bussiness-demo-website-repo`, `rootDirectory` set to the folder and `deploy:false`.
  3. Call `create_project_env` to add the two env vars.
  4. Call `add_project_domain` with `<name>-demo.crescitadigitaleitalia.com`.
  5. Call `create_deployment` with `skipAutoDetectionConfirmation: "1"` and gitSource `{type:"github", org, repo, ref:"main"}`, target production.
  6. Poll `get_deployment` until READY, then verify with `web_fetch_vercel_url`.
- The cloud sandbox cannot reach `*.vercel.app` or the custom domain directly. Use the Vercel MCP `web_fetch_vercel_url` to check live pages.

## Shared stack and architecture (all sites)

- **Next.js 16** (App Router, Turbopack, `cacheComponents: true`, `partialPrefetching`) · React 19 · TypeScript · **Tailwind CSS v4** · Motion (`motion/react`) · Lucide icons · React Hook Form + **Zod 4** · `next/font` · Playwright · axe-core · Lighthouse.
- Each folder's `AGENTS.md` warns that this Next.js has breaking changes. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.
- **i18n:** routes `/it/...` and `/en/...`, same slugs in both languages. `src/proxy.ts` (replaces middleware) redirects `/` to `/it`, or to `/en` for English browsers. `src/lib/page.ts#getPage()` reads the locale with `lang()` from `next/root-params`. All copy lives in `src/content/it.ts` and `en.ts` (`en` is typed as `typeof it`, so missing keys fail typecheck).
- **SEO:** `src/lib/i18n.ts#pageMetadata()` (canonical, hreflang it/en/x-default, OG, Twitter), `withBrand()` (keeps titles ≤65 chars) and `describe()` (≤155 chars). Also `sitemap.ts`, `robots.ts`, JSON-LD in `layout.tsx` (LocalBusiness/ProfessionalService/Dentist plus WebSite) and per page (Article, MedicalWebPage, Service, FAQPage). Privacy and cookie pages are `noindex`.
- **Forms:** shared `RequestForm` with client and server Zod validation (`src/lib/schema.ts`), a honeypot field and a minimum fill time (`startedAt` set on first focus). The API route (`/api/consultation`, `/api/booking`, `/api/quote`) runs in **demo mode** and returns `{ok:true, demo:true}` without sending anything. The READMEs show how to plug in Resend or a CRM.
- **Security headers** in `next.config.ts`: a strict CSP with `script-src 'self' 'unsafe-inline'` and no `unsafe-eval`, plus X-Frame-Options DENY, nosniff, Referrer-Policy and Permissions-Policy.
- **Other features on every site:** floating WhatsApp button, demo bar ("sito dimostrativo…"), skip link, localized 404 (`[...rest]` + `not-found.tsx`), reduced-motion support.
- **Images:** `scripts/images.json` (Unsplash IDs per slot) → `node scripts/fetch-images.mjs` (crops with sharp and writes `public/images/CREDITS.md`). Prefix with `NODE_USE_ENV_PROXY=1` in the sandbox.
- **Site specifics:**
  - **02-dental:** booking form (treatment, date ≥ today, time slot); `?treatment=<slug>` pre-selects the treatment. Six treatment pages and a FAQ page. No health data is collected and a medical disclaimer is shown.
  - **04-restaurant:**
    - The design came from a 4-direction study (A fine dining "Ardesia", B trattoria "Da Rosa", C seafood "Lanterna", D pizzeria "Forno 900"). The user picked C. The other three are ready-made concepts for future restaurant demos; the study page is a claude.ai artifact: https://claude.ai/artifact/RKt3KTrB82hWvHHfHkGimc
    - `src/lib/hours.ts` holds the opening hours (Europe/Rome) used by both the `OpenStatus` badge and the Restaurant JSON-LD.
    - `MenuBrowser`: HTML menu with crudo / gluten-free / vegetarian filters, the 14 EU allergens, and the Reg. CE 853/2004 raw-fish note.
    - `CatchBoard`: the day's catch priced per hg.
    - Three booking paths (`BookingOptions`): native form, WhatsApp, TheFork (`NEXT_PUBLIC_THEFORK_URL`).
    - `MobileActionBar` is a sticky Prenota / Chiama / WhatsApp bar on phones.
    - Fonts: Libre Caslon Display, Libre Caslon Text italic and Figtree.
  - **03-solar:** `src/lib/savings.ts` is the illustrative savings model. Its assumptions must stay in sync with `savings.assumptions` in both content files. The calculator links to `/quote?property=home|business&battery=yes|no`, which pre-fills the quote form. Also: filterable `ProjectGallery`, animated `EnergyFlow` SVG, quote form (property, bill range, location, roof, battery interest).

## Gotchas learned the hard way (do not repeat)

- **Tailwind v4:** custom classes used with `@apply` must be declared with `@utility`, not `@layer components`.
- **cacheComponents:** no `new Date()` or `Date.now()` during render. Use a static year, and set the form start time in `onFocusCapture`.
- **Zod 4:** call `z.config({ jitless: true })`, otherwise the CSP blocks `eval`. For "required" errors on radios or selects that can be `null`, use `z.string("key")`.
- **Hydration:** Node and Chrome group Italian 4-digit numbers differently ("1200" vs "1.200"). Always use `Intl.NumberFormat(locale, { useGrouping: "always" })`.
- **React 19 lint:** no setState in effects and no ref reads during render. Use a state reset during render (`prevPath` pattern) or callback refs (`focusOnMount`).
- **Mobile menu:** the header's `backdrop-filter` makes it the containing block, so the menu panel uses `absolute top-full` with a measured height.
- **Reduced motion:** reveals render at opacity 0 on the server. The `[data-reveal]` CSS override inside `prefers-reduced-motion` keeps content visible and makes axe contrast checks pass.
- **Heading order:** components reused on different pages take a `heading` prop (`h2`/`h3`).
- **JSON-LD:** `Service` has no `inLanguage`. Character counts in the crawler include HTML entities (`&#x27;`), so decode before judging length.

## Local QA commands (inside each site folder)

```bash
npm run lint && npx tsc --noEmit
NEXT_PUBLIC_SITE_URL=https://<sub>.crescitadigitaleitalia.com npx next build
npx next start -p 3100|3200|3300|3400       # 01 / 02 / 03 / 04
PORT=33x0 PW_CHROMIUM=/opt/pw-browsers/chromium npx playwright test     # 11 / 13 / 13 / 14 tests
node scripts/a11y-scan.mjs http://localhost:33x0                       # add MOTION=no-preference for the 2nd pass
CHROME_PATH=/opt/pw-browsers/chromium npx lighthouse http://localhost:33x0/it --chrome-flags="--headless=new --no-sandbox"
node scripts/screenshots.mjs                 # full-page shots at 1440/768/375 → screenshots/
```

- In the sandbox, start servers with `setsid npx next start -p PORT >/dev/null 2>&1 &` and stop them with `fuser -k PORT/tcp` (pkill matches its own shell).
- `node_modules` in 02, 03 and 04 are hard-linked copies of 01's (`cp -al`). Run `npm install` if a folder lacks them.

## Latest measured results (October 2026)

| Site | Playwright | axe (both motion modes) | Lighthouse mobile (A11y / BP / SEO / Perf) |
|---|---|---|---|
| 01-corporate | 11/11 | 0 violations | 100 / 100 / 100 / 93–98 |
| 02-dental | 13/13 | 0 violations | 100 / 100 / 100 / 94–97 (88–90 on a cold first run) |
| 03-solar | 13/13 | 0 violations | 100 / 100 / 100 / 90–98 |
| 04-restaurant | 14/14 | 0 violations | 100 / 100 / 100 / 95–97 (booking page 89–92) |

## Known limitations and possible next steps

- Forms are demo-only. For a real client, connect Resend (env `RESEND_API_KEY` plus an inbox variable) or a CRM webhook, and add rate limiting or Turnstile.
- The WhatsApp number and the privacy/cookie texts are placeholders.
- Ideas the user may ask for next:
  - add 04-restaurant to the agency portfolio page;
  - more sector demos (beauty, real estate, automotive, or the other restaurant directions A/B/D — the agency site lists these industries);
  - turning a demo into a real client site (replace content, images, logo, palette, JSON-LD and remove the demo labels; see each README "Replacing the demo branding");
  - sales material (one-page PDF or deck per sector).
