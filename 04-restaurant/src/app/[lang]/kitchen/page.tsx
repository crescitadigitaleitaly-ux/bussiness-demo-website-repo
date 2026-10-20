import Image from "next/image";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "kitchen", dict.kitchen.meta.title, dict.kitchen.meta.description, "/images/chef.jpg");
}

export default async function Kitchen() {
  const { locale, dict } = await getPage();
  const t = dict.kitchen;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x animate-[unveil_1.4s_.2s_var(--ease-out-expo)_both]">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[21/9]">
          <Image src="/images/sala.jpg" alt={t.imageAlt} fill priority sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
        </div>
      </div>

      <section className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="display text-[clamp(2.2rem,4.4vw,3.6rem)]">{t.storyTitle}</h2>
        </Reveal>
        <Reveal delay={0.1} className="space-y-6 lg:col-span-6 lg:col-start-7">
          {t.story.map((p) => <p key={p} className="lead">{p}</p>)}
        </Reveal>
      </section>

      <section className="bg-surface py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="img-zoom relative aspect-[4/5] overflow-hidden lg:col-span-5">
            <Image src="/images/chef.jpg" alt={t.chef.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <blockquote className="font-serif text-[clamp(1.8rem,3.6vw,3rem)] italic leading-[1.15]">“{t.chef.quote}”</blockquote>
            <p className="mt-8 font-display text-2xl">{t.chef.name}</p>
            <p className="text-sm text-muted">{t.chef.role}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-24 sm:py-32">
        <Reveal><h2 className="display max-w-[18ch] text-[clamp(2.2rem,4.4vw,3.6rem)]">{t.suppliersTitle}</h2></Reveal>
        <RevealGroup as="ul" className="mt-14 grid border-t border-ink md:grid-cols-3">
          {t.suppliers.map((s, i) => (
            <RevealItem as="li" key={s.title} className={`py-8 md:px-8 md:first:pl-0 md:last:pr-0 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
              <h3 className="font-serif text-2xl italic text-amber">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="img-zoom relative mt-16 aspect-[16/9] overflow-hidden sm:aspect-[21/8]">
          <Image src="/images/wine.jpg" alt={t.winesAlt} fill sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
        </Reveal>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
