import Image from "next/image";
import { Check } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "services", dict.servicesPage.meta.title, dict.servicesPage.meta.description);
}

export default async function Services() {
  const { locale, dict } = await getPage();
  const t = dict.servicesPage;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead}>
        <nav aria-label={t.eyebrow} className="mt-10 flex flex-wrap gap-2 animate-[rise_1s_.25s_var(--ease-out-expo)_both]">
          {dict.services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm transition-colors hover:border-ink">{s.title}</a>
          ))}
        </nav>
      </PageHero>

      <div className="container-x">
        {dict.services.map((s, i) => (
          <section key={s.slug} id={s.slug} className="grid gap-10 border-t border-line py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
            <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
              <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.1} className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : "lg:col-start-7"}`}>
              <span className="font-serif text-2xl italic text-accent">{s.index}</span>
              <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)]">{s.title}</h2>
              <p className="lead mt-5">{s.summary}</p>
              <h3 className="mt-10 text-xs font-medium uppercase tracking-[0.18em] text-muted">{t.includes}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 py-3.5"><Check className="size-4 text-accent" aria-hidden />{p}</li>
                ))}
              </ul>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="bg-surface py-24 sm:py-32">
        <div className="container-x">
          <Reveal><h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.engagementTitle}</h2></Reveal>
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {t.engagements.map((e, i) => (
              <RevealItem key={e.title} className="rounded-[1.5rem] border border-line p-8 transition-colors duration-500 hover:border-accent/40">
                <span className="font-serif text-lg italic text-accent">0{i + 1}</span>
                <h3 className="mt-10 text-2xl font-medium tracking-tight">{e.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{e.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} />
    </>
  );
}
