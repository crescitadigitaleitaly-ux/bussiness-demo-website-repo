import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { mapsUrl } from "@/lib/contact";
import { BookingOptions } from "@/components/BookingOptions";
import { CatchBoard } from "@/components/CatchBoard";
import { CtaBand } from "@/components/CtaBand";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Wave } from "@/components/Wave";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "", dict.home.meta.title, dict.home.meta.description);
}

export default async function Home() {
  const { locale, dict } = await getPage();
  const { home, brand, common } = dict;
  const [first, ...rest] = home.kitchen.dishes;

  return (
    <>
      {/* HERO — the terrace on the left, today's catch on the right */}
      <section className="grid lg:grid-cols-12">
        <div className="relative min-h-[26rem] overflow-hidden sm:min-h-[34rem] lg:col-span-7 lg:min-h-[44rem]">
          <div className="absolute inset-0 animate-[settle_2.6s_var(--ease-out-expo)_both]">
            <Image src="/images/hero.jpg" alt={home.hero.imageAlt} fill priority sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-deep/70 to-transparent" />
          <p className="absolute bottom-6 left-5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-mist sm:left-8 lg:left-12">
            {brand.city} · {brand.coords}
          </p>
        </div>

        <div className="relative flex flex-col justify-center gap-10 px-5 py-12 sm:px-8 lg:col-span-5 lg:py-16 lg:pl-0 lg:pr-12">
          <div className="lg:-ml-28 lg:bg-mist lg:py-10 lg:pl-12 lg:pr-4">
            <h1 className="display text-[clamp(2.8rem,5.6vw,5rem)] animate-[rise_1s_.15s_var(--ease-out-expo)_both]">
              {home.hero.titleA} <span className="accent">{home.hero.titleAccent}</span> {home.hero.titleB}
            </h1>
            <p className="lead mt-6 max-w-[40ch] animate-[rise_1s_.3s_var(--ease-out-expo)_both]">{home.hero.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3 animate-[rise_1s_.42s_var(--ease-out-expo)_both]">
              <Link href={`/${locale}/booking`} className="btn-primary group">
                {home.hero.primary}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href={`/${locale}/menu`} className="btn-ghost">{home.hero.secondary}</Link>
            </div>
            <OpenStatus t={common} className="mt-6 text-sm text-muted" />
          </div>
          <div className="animate-[rise_1s_.6s_var(--ease-out-expo)_both] lg:-ml-28">
            <CatchBoard t={home.catch} perHg={common.perHg} />
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="container-x">
        <Wave className="text-amber/70" />
        <RevealGroup as="ul" className="grid gap-6 py-10 sm:grid-cols-3 sm:gap-0">
          {home.facts.map((f, i) => (
            <RevealItem as="li" key={f.title} className={`sm:px-8 ${i === 0 ? "sm:pl-0" : "sm:border-l sm:border-line"}`}>
              <h2 className="font-serif text-xl italic text-amber">{f.title}</h2>
              <p className="mt-1 text-muted">{f.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* KITCHEN */}
      <section className="container-x grid gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:items-end">
        <Reveal className="img-zoom relative aspect-[4/5] overflow-hidden lg:col-span-5">
          <Image src="/images/chef.jpg" alt={home.kitchen.chefAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7 lg:pb-8">
          <SectionHeading eyebrow={home.kitchen.eyebrow} title={home.kitchen.title} lead={home.kitchen.text} />
          <Reveal delay={0.1}>
            <Link href={`/${locale}/kitchen`} className="link-underline mt-8 inline-flex items-center gap-2 font-semibold">
              {home.kitchen.cta} <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SIGNATURE DISHES — one large, two stacked */}
      <section className="container-x pb-24 sm:pb-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-4">
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-tight">{home.kitchen.signatureTitle}</h2>
          <Link href={`/${locale}/menu`} className="link-underline inline-flex items-center gap-2 font-semibold">
            {common.fullMenu} <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <Reveal className="group lg:col-span-7">
            <div className="img-zoom relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
              <Image src={first.image} alt={first.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
            </div>
            <Dish {...first} />
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((d, i) => (
              <Reveal key={d.name} delay={0.1 * (i + 1)} className="group">
                <div className="img-zoom relative aspect-[16/10] overflow-hidden">
                  <Image src={d.image} alt={d.alt} fill sizes="(min-width:1024px) 38vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                </div>
                <Dish {...d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE over the coast */}
      <section className="relative isolate overflow-hidden bg-deep">
        <Image src="/images/coast.jpg" alt={home.quote.imageAlt} fill sizes="100vw" className="-z-10 object-cover opacity-70" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-deep/90 via-deep/40 to-deep/10" />
        <Reveal className="container-x flex min-h-[26rem] flex-col justify-end py-16 sm:min-h-[34rem] sm:py-24">
          <blockquote className="max-w-[24ch] font-serif text-[clamp(1.9rem,4.4vw,3.6rem)] italic leading-[1.12] text-mist">“{home.quote.text}”</blockquote>
          <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sun">— {home.quote.by}</p>
        </Reveal>
      </section>

      {/* BOOKING OPTIONS */}
      <section className="container-x py-24 sm:py-32">
        <SectionHeading eyebrow={home.booking.eyebrow} title={home.booking.title} lead={home.booking.lead} className="mb-14" />
        <BookingOptions locale={locale} dict={dict} />
      </section>

      {/* REVIEWS */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={home.reviews.eyebrow} title={home.reviews.title} />
          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <figure>
                <blockquote className="font-serif text-[clamp(1.5rem,2.8vw,2.2rem)] italic leading-snug">“{home.reviews.items[0].quote}”</blockquote>
                <figcaption className="mt-6 text-sm text-muted"><span className="font-semibold text-ink">{home.reviews.items[0].name}</span> · {home.reviews.items[0].from}</figcaption>
              </figure>
            </Reveal>
            <div className="grid gap-10 lg:col-span-4 lg:col-start-9">
              {home.reviews.items.slice(1).map((r, i) => (
                <Reveal key={r.name} delay={0.1 * (i + 1)}>
                  <figure className="border-t border-line pt-6">
                    <blockquote className="leading-relaxed">“{r.quote}”</blockquote>
                    <figcaption className="mt-4 text-sm text-muted"><span className="font-semibold text-ink">{r.name}</span> · {r.from}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
          <p className="mt-12 text-xs text-muted">* {common.fictionalReviews}</p>
        </div>
      </section>

      {/* VISIT */}
      <section className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={home.visit.eyebrow} title={home.visit.title} />
          <Reveal delay={0.1} className="mt-10 space-y-6">
            <p className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-amber" aria-hidden />{brand.address}</p>
            <dl className="divide-y divide-line border-y border-line">
              {brand.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"><dt className="font-semibold">{h.days}</dt><dd className="tabular text-muted">{h.time}</dd></div>
              ))}
            </dl>
            <OpenStatus t={common} className="text-sm text-muted" />
            <a href={mapsUrl(`${brand.street}, ${brand.postal} ${brand.city}`)} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              {home.visit.maps} <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="img-zoom relative aspect-[4/3] overflow-hidden lg:col-span-6 lg:col-start-7">
          <Image src="/images/village.jpg" alt={home.visit.imageAlt} fill sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" />
        </Reveal>
      </section>

      <CtaBand locale={locale} t={home.cta} phone={brand.phone} />
    </>
  );
}

function Dish({ name, text, price }: { name: string; text: string; price: string }) {
  return (
    <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1">
      <h3 className="font-display text-[1.7rem] leading-tight">{name}</h3>
      <p className="tabular pt-1 text-lg font-medium">€ {price}</p>
      <p className="text-muted">{text}</p>
    </div>
  );
}
