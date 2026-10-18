import Image from "next/image";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "about", dict.about.meta.title, dict.about.meta.description, "/images/about.jpg");
}

export default async function About() {
  const { locale, dict } = await getPage();
  const t = dict.about;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x animate-[unveil_1.3s_.2s_var(--ease-out-expo)_both]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[2.5rem] sm:aspect-[21/9]">
          <Image src="/images/about.jpg" alt={t.imageAlt} fill priority sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
        </div>
      </div>
      <section className="container-x py-24 sm:py-32">
        <Reveal><h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.valuesTitle}</h2></Reveal>
        <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.values.map((v) => (
            <RevealItem as="li" key={v.title} className="rounded-[2rem] bg-surface p-8">
              <span aria-hidden className="block size-3 rounded-full bg-accent" />
              <h3 className="mt-8 font-serif text-2xl">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <section className="bg-accent-deep py-20 text-white">
        <div className="container-x">
          <h2 className="font-serif text-3xl">{t.numbersTitle}</h2>
          <dl className="mt-10 grid gap-10 sm:grid-cols-3">
            {t.numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse border-t border-white/20 pt-6">
                <dt className="mt-2 text-white/80">{n.label}</dt>
                <dd className="font-serif text-6xl"><Counter value={n.value} suffix={n.suffix} locale={locale} /></dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-xs text-white/85">* {dict.common.illustrative}</p>
        </div>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
