import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";
import { ParallaxImage } from "@/components/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceList } from "@/components/ServiceList";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "", dict.home.meta.title, dict.home.meta.description);
}

export default async function Home() {
  const { locale, dict } = await getPage();
  const { home, projects, process, testimonials, insights, common } = dict;
  const [featured, ...more] = projects;
  const fmtDate = (d: string) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

  return (
    <>
      {/* HERO */}
      <section className="container-x grid gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="eyebrow animate-[rise_.9s_var(--ease-out-expo)_both]">{home.hero.eyebrow}</p>
          <h1 className="display mt-7 text-[clamp(3rem,8.2vw,7.5rem)]">
            {[home.hero.titleA, home.hero.titleB].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span className="block animate-[line-up_1.1s_var(--ease-out-expo)_both]" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  {line}
                  {i === 1 && <span className="serif-accent text-accent"> {home.hero.titleAccent}</span>}
                </span>
              </span>
            ))}
          </h1>
          <p className="lead mt-8 max-w-[50ch] animate-[rise_1s_.35s_var(--ease-out-expo)_both]">{home.hero.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3 animate-[rise_1s_.45s_var(--ease-out-expo)_both]">
            <Link href={`/${locale}/consultation`} className="btn-primary group">
              {home.hero.primary}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href={`/${locale}/projects`} className="btn-ghost">{home.hero.secondary}</Link>
          </div>
        </div>
        <figure className="relative lg:col-span-5">
          <div className="animate-[unveil_1.4s_.15s_var(--ease-out-expo)_both]">
            <ParallaxImage
              src="/images/hero.jpg"
              alt={home.hero.imageAlt}
              priority
              strength={6}
              sizes="(min-width:1024px) 40vw, 100vw"
              className="aspect-[4/5] rounded-[1.75rem] sm:aspect-[16/11] lg:aspect-[4/5]"
            />
          </div>
          <figcaption className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
            <span>{home.hero.caption}</span>
            <span className="font-serif text-sm normal-case italic tracking-normal">Est. 2008</span>
          </figcaption>
        </figure>
      </section>

      {/* STATS LEDGER */}
      <section aria-label={common.illustrative} className="container-x">
        <RevealGroup className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {home.stats.map((s, i) => (
            <RevealItem key={s.label} className={`px-1 py-8 sm:px-6 sm:py-10 ${i % 2 ? "border-l border-line" : ""} ${i === 2 ? "border-t border-line lg:border-t-0 lg:border-l" : ""} ${i === 3 ? "border-t lg:border-t-0" : ""}`}>
              <p className="text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.04em]">
                <Counter value={s.value} suffix={s.suffix} locale={locale} />
              </p>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-3 text-xs text-muted">* {common.illustrative}</p>
      </section>

      {/* SERVICES */}
      <section className="container-x py-24 sm:py-32">
        <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={home.services.eyebrow} title={home.services.title} className="lg:col-span-7" />
          <Reveal className="lg:col-span-5 lg:pb-2" delay={0.1}>
            <p className="lead">{home.services.lead}</p>
          </Reveal>
        </div>
        <ServiceList locale={locale} services={dict.services} />
      </section>

      {/* FEATURED PROJECTS */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={home.projects.eyebrow} title={home.projects.title} />
            <Link href={`/${locale}/projects`} className="link-underline inline-flex items-center gap-2 font-medium">
              {common.allProjects} <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>

          <Reveal className="mt-14">
            <Link href={`/${locale}/projects/${featured.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="img-zoom relative aspect-[16/10] overflow-hidden rounded-[1.5rem] lg:col-span-7">
                <Image src={featured.image} alt="" fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
              </div>
              <div className="lg:col-span-5 lg:pl-6">
                <p className="text-xs uppercase tracking-[0.18em] text-accent">{featured.sector}</p>
                <h3 className="mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium leading-tight tracking-[-0.03em]">{featured.title}</h3>
                <p className="mt-4 leading-relaxed text-muted">{featured.excerpt}</p>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
                  {featured.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="sr-only">{m.label}</dt>
                      <dd className="text-2xl font-medium tracking-tight">{m.value}</dd>
                      <dd className="mt-1 text-xs text-muted">{m.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Link>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <RevealItem key={p.slug}>
                <Link href={`/${locale}/projects/${p.slug}`} className="group block">
                  <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                    <Image src={p.image} alt="" fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.18em] text-accent">{p.sector}</p>
                  <h3 className="mt-2 text-xl font-medium leading-snug tracking-tight decoration-1 underline-offset-4 group-hover:underline">{p.title}</h3>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-10 text-xs text-muted">* {dict.projectsPage.lead}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={home.process.eyebrow} title={home.process.title} lead={home.process.lead} />
          </div>
        </div>
        <ol className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-line" />
          {process.map((p, i) => (
            <li key={p.step} className="relative pb-14 last:pb-0">
              <Reveal delay={i * 0.05} className="grid grid-cols-[2.75rem_1fr] gap-6">
                <span className="relative z-10 grid size-11 place-items-center rounded-full border border-line bg-paper font-serif italic text-accent">{p.step}</span>
                <div className="pt-1.5">
                  <h3 className="text-2xl font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{p.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-mist py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={home.testimonials.eyebrow} title={home.testimonials.title} />
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <figure className="flex h-full flex-col justify-between rounded-[1.5rem] bg-ink p-8 text-white sm:p-12">
                <Quote className="size-8 text-[#7fa6cc]" aria-hidden />
                <blockquote className="mt-8 font-serif text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.2]">“{testimonials[0].quote}”</blockquote>
                <figcaption className="mt-10 text-sm text-white/70">
                  <span className="font-medium text-white">{testimonials[0].name}</span> — {testimonials[0].role}
                </figcaption>
              </figure>
            </Reveal>
            <div className="grid gap-6 lg:col-span-5">
              {testimonials.slice(1).map((t, i) => (
                <Reveal key={t.name} delay={0.1 + i * 0.08}>
                  <figure className="h-full rounded-[1.5rem] bg-surface p-8">
                    <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
                    <figcaption className="mt-6 text-sm text-muted">
                      <span className="font-medium text-ink">{t.name}</span> — {t.role}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-6 text-xs text-muted">* {common.fictional}</p>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="container-x py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={home.insights.eyebrow} title={home.insights.title} />
          <Link href={`/${locale}/insights`} className="link-underline inline-flex items-center gap-2 font-medium">
            {common.allInsights} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <RevealGroup className="mt-14 border-t border-line">
          {insights.articles.map((a) => (
            <RevealItem key={a.slug}>
              <Link href={`/${locale}/insights/${a.slug}`} className="group grid gap-2 border-b border-line py-8 sm:grid-cols-[8.5rem_15rem_1fr_auto] sm:items-center sm:gap-8">
                <time dateTime={a.date} className="text-sm text-muted">{fmtDate(a.date)}</time>
                <span className="text-xs uppercase tracking-[0.18em] text-accent">{a.category}</span>
                <span className="text-xl font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 sm:text-2xl">{a.title}</span>
                <ArrowUpRight className="hidden size-5 text-muted transition-colors group-hover:text-ink sm:block" aria-hidden />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <CtaBand locale={locale} t={home.cta} />
    </>
  );
}
