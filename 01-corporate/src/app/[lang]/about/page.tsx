import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { ParallaxImage } from "@/components/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { CtaBand } from "@/components/CtaBand";

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
        <ParallaxImage src="/images/about.jpg" alt={t.imageAlt} priority sizes="(min-width:1320px) 1224px, 100vw" className="aspect-[16/9] rounded-[1.75rem] sm:aspect-[21/9]" />
      </div>

      <section className="container-x grid gap-10 py-24 sm:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-4"><p className="eyebrow">{t.missionTitle}</p></Reveal>
        <Reveal className="lg:col-span-8" delay={0.1}>
          <p className="font-serif text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.15] tracking-[-0.01em]">{t.mission}</p>
        </Reveal>
      </section>

      <section className="bg-surface py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.storyTitle}</h2>
          </Reveal>
          <RevealGroup as="ol" className="lg:col-span-8">
            {t.story.map((s) => (
              <RevealItem as="li" key={s.year} className="grid grid-cols-[5.5rem_1fr] gap-6 border-t border-line py-7 sm:grid-cols-[9rem_1fr]">
                <span className="font-serif text-3xl italic text-accent">{s.year}</span>
                <span className="pt-1.5 text-lg">{s.text}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-x py-24 sm:py-32">
        <Reveal><h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.valuesTitle}</h2></Reveal>
        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.values.map((v, i) => (
            <RevealItem key={v.title} className="bg-paper p-8">
              <span className="font-serif text-lg italic text-accent">0{i + 1}</span>
              <h3 className="mt-8 text-xl font-medium tracking-tight">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <dl className="mt-20 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {dict.home.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              <dd className="text-5xl font-medium tracking-[-0.04em]"><Counter value={s.value} suffix={s.suffix} locale={locale} /></dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs text-muted">* {t.statsNote}</p>
      </section>

      <CtaBand locale={locale} t={dict.home.cta} />
    </>
  );
}
