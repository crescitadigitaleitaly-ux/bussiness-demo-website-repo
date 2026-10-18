import Image from "next/image";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { RevealGroup, RevealItem } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "dentists", dict.dentists.meta.title, dict.dentists.meta.description);
}

export default async function Dentists() {
  const { locale, dict } = await getPage();
  const t = dict.dentists;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x">
        <RevealGroup as="ul" className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {t.members.map((m) => (
            <RevealItem as="li" key={m.name} className="group">
              <div className="arch img-zoom relative aspect-[4/5] overflow-hidden bg-soft">
                <Image src={m.image} alt={`${m.name}, ${m.role}`} fill sizes="(min-width:1024px) 23vw, (min-width:640px) 45vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-accent-deep">{m.role}</p>
              <h2 className="mt-2 font-serif text-2xl">{m.name}</h2>
              <p className="mt-2 leading-relaxed text-muted">{m.focus}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-10 text-xs text-muted">* {dict.common.demoProfiles}</p>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
