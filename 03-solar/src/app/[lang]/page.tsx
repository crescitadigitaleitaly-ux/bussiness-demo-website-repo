import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";
import { EnergyFlow } from "@/components/EnergyFlow";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { SectionHeading } from "@/components/SectionHeading";
import { SolutionIcon } from "@/components/SolutionIcon";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "", dict.home.meta.title, dict.home.meta.description);
}

// Flowing "energy" lines across the bottom of the hero.
const waves = ["M0 60 C 240 10, 480 110, 720 60 S 1200 10, 1440 60", "M0 80 C 260 40, 520 120, 760 80 S 1220 40, 1440 85", "M0 40 C 220 90, 500 0, 740 45 S 1180 95, 1440 40"];

export default async function Home() {
  const { locale, dict } = await getPage();
  const { home, solutions, process, projects, brand, common, savings } = dict;

  return (
    <>
      {/* HERO */}
      <section className="relative isolate -mt-[4.5rem] flex min-h-[92svh] items-end overflow-hidden pt-[4.5rem]">
        <div className="absolute inset-0 -z-20 animate-[settle_2.4s_var(--ease-out-expo)_both]">
          <Image src="/images/hero.jpg" alt={home.hero.imageAlt} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-paper/85 via-paper/30 to-transparent" />
        <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
        <div aria-hidden className="absolute right-[8%] top-[18%] -z-10 size-72 rounded-full bg-accent/25 blur-3xl animate-[pulse-glow_5s_ease-in-out_infinite] sm:size-96" />
        <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 -z-10 h-28 w-full opacity-70">
          {waves.map((d, i) => (
            <path key={d} d={d} fill="none" stroke="var(--color-accent)" strokeWidth={1.5 - i * 0.3} className="flow" style={{ animationDuration: `${1.6 + i * 0.5}s`, opacity: 0.8 - i * 0.2 }} />
          ))}
        </svg>

        <div className="container-x pb-20 pt-24 sm:pb-28">
          <p className="eyebrow animate-[rise_.9s_.2s_var(--ease-out-expo)_both]">{home.hero.eyebrow}</p>
          <h1 className="display mt-7 max-w-[13ch] text-[clamp(3rem,8.6vw,7.5rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="block animate-[line-up_1.1s_.3s_var(--ease-out-expo)_both]">{home.hero.titleA}</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="block text-accent animate-[line-up_1.1s_.42s_var(--ease-out-expo)_both]">{home.hero.titleAccent}</span>
            </span>
          </h1>
          <p className="lead mt-8 max-w-[52ch] text-ink/80 animate-[rise_1s_.6s_var(--ease-out-expo)_both]">{home.hero.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3 animate-[rise_1s_.72s_var(--ease-out-expo)_both]">
            <Link href={`/${locale}/quote`} className="btn-primary group">
              {home.hero.primary}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href={`/${locale}/savings`} className="btn-ghost">{home.hero.secondary}</Link>
          </div>
        </div>
        <a href="#stats" className="absolute bottom-8 right-5 hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink sm:right-8 md:flex lg:right-12">
          {home.hero.scroll} <ArrowDown className="size-4 animate-bounce" aria-hidden />
        </a>
      </section>

      {/* STATS */}
      <section id="stats" aria-label={common.illustrative} className="container-x">
        <RevealGroup as="ul" className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {home.stats.map((s, i) => (
            <RevealItem as="li" key={s.label} className={`px-1 py-9 sm:px-6 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <p className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-none tracking-[-0.05em]">
                <Counter value={s.value} suffix={s.suffix} locale={locale} />
              </p>
              <p className="mt-3 text-sm text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-3 text-xs text-muted">* {common.illustrative}</p>
      </section>

      {/* RESIDENTIAL / COMMERCIAL */}
      <section className="container-x grid gap-6 py-24 sm:py-32 lg:grid-cols-2">
        {home.split.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.1} className="group card relative flex flex-col overflow-hidden">
            <div className="img-zoom relative aspect-[16/10] overflow-hidden">
              <Image src={s.image} alt={s.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
            </div>
            <div className="relative -mt-16 flex flex-1 flex-col p-7 sm:p-10">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="display mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)]">{s.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{s.text}</p>
              <ul className="mt-6 space-y-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3"><Check className="size-4 text-accent" aria-hidden />{p}</li>
                ))}
              </ul>
              <Link href={`/${locale}/${s.href}`} className="link-underline mt-8 inline-flex w-fit items-center gap-2 font-medium text-accent">
                {common.readMore}<span className="sr-only">: {s.title}</span> <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        ))}
      </section>

      {/* SOLUTIONS */}
      <section className="relative overflow-hidden border-y border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={home.solutions.eyebrow} title={home.solutions.title} />
            <Link href={`/${locale}/solutions`} className="link-underline inline-flex items-center gap-2 font-medium">
              {common.allSolutions} <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <RevealGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <RevealItem as="li" key={s.slug}>
                <Link
                  href={`/${locale}/solutions/${s.slug}`}
                  className="group card flex h-full flex-col p-7 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_rgb(183_227_90/0.35)]"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-paper">
                    <SolutionIcon name={s.icon} className="size-6" />
                  </span>
                  <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{s.short}</p>
                  <ArrowUpRight className="mt-6 size-5 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* BATTERY STORAGE */}
      <section className="container-x grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={home.battery.eyebrow} title={home.battery.title} lead={home.battery.lead} />
          <RevealGroup as="ul" className="mt-10 space-y-6">
            {home.battery.points.map((p) => (
              <RevealItem as="li" key={p.title} className="border-l-2 border-accent/60 pl-5">
                <h3 className="font-medium">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Link href={`/${locale}/solutions/battery-storage`} className="btn-ghost group mt-10">
            {home.battery.cta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <EnergyFlow labels={home.battery.flow} />
        </Reveal>
      </section>

      {/* PROJECTS */}
      <section className="border-y border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-x">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={home.projects.eyebrow} title={home.projects.title} />
            <Link href={`/${locale}/projects`} className="link-underline inline-flex items-center gap-2 font-medium">
              {common.allProjects} <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <Reveal>
            <ProjectGallery t={projects} locale={locale} limit={3} />
          </Reveal>
          <p className="mt-8 text-xs text-muted">* {common.fictionalProjects}</p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-x py-24 sm:py-32">
        <SectionHeading eyebrow={home.process.eyebrow} title={home.process.title} />
        <RevealGroup as="ol" className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
          <span aria-hidden className="absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-accent via-accent/40 to-transparent md:block" />
          {process.map((p) => (
            <RevealItem as="li" key={p.step} className="relative">
              <span className="relative grid size-12 place-items-center rounded-full border border-accent/50 bg-paper font-display text-sm font-semibold text-accent shadow-[0_0_24px_-4px_rgb(183_227_90/0.5)]">{p.step}</span>
              <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* SAVINGS CALCULATOR */}
      <section className="container-x pb-8">
        <SectionHeading eyebrow={home.calculator.eyebrow} title={home.calculator.title} lead={home.calculator.lead} className="mb-12" />
        <Reveal>
          <SavingsCalculator t={savings.calc} locale={locale} />
        </Reveal>
        <Link href={`/${locale}/savings#assumptions`} className="link-underline mt-5 inline-flex min-h-6 items-center gap-2 text-sm text-muted hover:text-ink">
          {savings.assumptionsTitle} <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </section>

      <CtaBand locale={locale} t={home.cta} phone={brand.phone} />
    </>
  );
}
