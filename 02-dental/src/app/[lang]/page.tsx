import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardCheck, Clock3, ScanLine, ShieldCheck } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TreatmentIcon } from "@/components/TreatmentIcon";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "", dict.home.meta.title, dict.home.meta.description);
}

const trustIcons = [Clock3, ClipboardCheck, ShieldCheck, ScanLine];
const gallery = ["/images/clinic-1.jpg", "/images/clinic-2.jpg", "/images/clinic-3.jpg", "/images/clinic-4.jpg"];

export default async function Home() {
  const { locale, dict } = await getPage();
  const { home, treatments, journey, dentists, faq, brand, common } = dict;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute -right-40 -top-40 size-[38rem] rounded-full bg-soft/70 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 pb-20 pt-10 sm:pt-16 lg:grid-cols-12 lg:pb-28">
          <div className="lg:col-span-6">
            <p className="eyebrow animate-[rise_.9s_var(--ease-out-expo)_both]">{home.hero.eyebrow}</p>
            <h1 className="display mt-7 text-[clamp(3rem,7.4vw,6.4rem)]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="block animate-[line-up_1.1s_.1s_var(--ease-out-expo)_both]">{home.hero.titleA}</span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="serif-accent block animate-[line-up_1.1s_.2s_var(--ease-out-expo)_both]">{home.hero.titleAccent}</span>
              </span>
            </h1>
            <p className="lead mt-8 max-w-[46ch] animate-[rise_1s_.35s_var(--ease-out-expo)_both]">{home.hero.lead}</p>
            <div className="mt-10 flex flex-wrap gap-3 animate-[rise_1s_.45s_var(--ease-out-expo)_both]">
              <Link href={`/${locale}/booking`} className="btn-primary group">
                {home.hero.primary}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href={`/${locale}/treatments`} className="btn-ghost">{home.hero.secondary}</Link>
            </div>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8">
            <div className="arch relative mx-auto aspect-[4/5] max-w-md overflow-hidden animate-[unveil_1.4s_.15s_var(--ease-out-expo)_both] lg:max-w-none">
              <Image src="/images/hero.jpg" alt={home.hero.imageAlt} fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </div>
            <p className="absolute -bottom-6 left-0 flex max-w-[15rem] items-center gap-3 rounded-2xl bg-surface p-4 text-sm font-medium shadow-[0_20px_50px_-20px_rgb(25_52_59/0.35)] animate-[rise_1s_.7s_var(--ease-out-expo)_both] sm:left-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-soft text-accent-deep">
                <ClipboardCheck className="size-5" aria-hidden />
              </span>
              {home.hero.badge}
            </p>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-surface">
        <RevealGroup as="ul" className="container-x grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {home.trust.map((t, i) => {
            const Icon = trustIcons[i];
            return (
              <RevealItem as="li" key={t.title} className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-soft text-accent-deep">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-medium">{t.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t.text}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* TREATMENTS */}
      <section className="container-x py-24 sm:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={home.treatments.eyebrow} title={home.treatments.title} className="lg:col-span-7" />
          <Reveal className="lg:col-span-5"><p className="lead">{home.treatments.lead}</p></Reveal>
        </div>
        <RevealGroup as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <RevealItem as="li" key={t.slug}>
              <Link
                href={`/${locale}/treatments/${t.slug}`}
                className="group flex h-full flex-col rounded-[2rem] border border-line bg-surface p-7 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_60px_-35px_rgb(13_104_101/0.45)]"
              >
                <span className="grid size-14 place-items-center rounded-full bg-soft text-accent-deep transition-colors duration-500 group-hover:bg-accent-deep group-hover:text-white">
                  <TreatmentIcon name={t.icon} className="size-6" />
                </span>
                <h3 className="mt-8 font-serif text-2xl">{t.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{t.short}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep">
                  {common.readMore} <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* JOURNEY */}
      <section className="bg-mist py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={home.journey.eyebrow} title={home.journey.title} />
          <RevealGroup as="ol" className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-7 right-7 top-7 hidden border-t-2 border-dashed border-accent/30 md:block" />
            {journey.map((j) => (
              <RevealItem as="li" key={j.step} className="relative">
                <span className="relative grid size-14 place-items-center rounded-full bg-accent-deep font-serif text-xl text-white ring-8 ring-mist">{j.step}</span>
                <h3 className="mt-6 font-serif text-2xl">{j.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{j.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* DENTISTS */}
      <section className="container-x py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={home.dentists.eyebrow} title={home.dentists.title} />
          <Link href={`/${locale}/dentists`} className="link-underline inline-flex items-center gap-2 font-medium">
            {home.dentists.cta} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <RevealGroup as="ul" className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {dentists.members.map((m) => (
            <RevealItem as="li" key={m.name} className="group">
              <div className="arch img-zoom relative aspect-[4/5] overflow-hidden bg-soft">
                <Image src={m.image} alt={`${m.name}, ${m.role}`} fill sizes="(min-width:1024px) 23vw, 45vw" className="object-cover" />
              </div>
              <h3 className="mt-5 font-serif text-xl">{m.name}</h3>
              <p className="mt-1 text-sm text-muted">{m.focus}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-8 text-xs text-muted">* {common.demoProfiles}</p>
      </section>

      {/* GALLERY */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={home.gallery.eyebrow} title={home.gallery.title} />
        </div>
        <ul tabIndex={0} aria-label={home.gallery.title} className="container-x mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {gallery.map((src, i) => (
            <li key={src} className={`arch relative aspect-[4/5] w-[72%] shrink-0 snap-start overflow-hidden sm:w-[42%] lg:w-[calc(25%-15px)] ${i % 2 ? "lg:mt-12" : ""}`}>
              <Image src={src} alt={home.gallery.alts[i]} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 42vw, 72vw" className="object-cover transition-transform duration-[1200ms] ease-out-expo hover:scale-105" />
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={home.faq.eyebrow} title={home.faq.title} />
          <Link href={`/${locale}/faq`} className="link-underline mt-8 inline-flex items-center gap-2 font-medium">
            {home.faq.cta} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <Reveal className="lg:col-span-8">
          <FaqList items={faq.items.slice(0, 4)} />
        </Reveal>
      </section>

      <CtaBand locale={locale} t={home.cta} phone={brand.phone} />
    </>
  );
}
