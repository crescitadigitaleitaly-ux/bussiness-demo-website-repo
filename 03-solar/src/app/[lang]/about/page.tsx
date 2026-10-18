import Image from "next/image";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
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
        <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] sm:aspect-[21/9]">
          <Image src="/images/about.jpg" alt={t.imageAlt} fill priority sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
        </div>
      </div>

      <section className="container-x grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-2">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.storyTitle}</h2>
          {t.story.map((p) => (
            <p key={p} className="lead mt-6">{p}</p>
          ))}
        </Reveal>
        <Reveal delay={0.1} className="img-zoom relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
          <Image src="/images/install.jpg" alt={t.installAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-x">
          <Reveal><h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.valuesTitle}</h2></Reveal>
          <RevealGroup as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((v) => (
              <RevealItem as="li" key={v.title} className="card p-8">
                <span aria-hidden className="block size-3 rounded-full bg-accent shadow-[0_0_16px_3px_rgb(183_227_90/0.6)]" />
                <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-x py-24">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{t.numbersTitle}</h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-3">
          {t.numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse border-t border-accent/40 pt-6">
              <dt className="mt-2 text-muted">{n.label}</dt>
              <dd className="font-display text-6xl font-semibold tracking-[-0.05em] text-accent"><Counter value={n.value} suffix={n.suffix} locale={locale} /></dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-xs text-muted">* {dict.common.illustrative}</p>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
