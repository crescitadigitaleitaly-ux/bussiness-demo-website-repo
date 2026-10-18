import Image from "next/image";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "patient-info", dict.patients.meta.title, dict.patients.meta.description, "/images/patient.jpg");
}

export default async function PatientInfo() {
  const { locale, dict } = await getPage();
  const t = dict.patients;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x grid gap-12 pb-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="arch relative aspect-[4/5] overflow-hidden lg:sticky lg:top-32">
            <Image src="/images/patient.jpg" alt={t.imageAlt} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {t.sections.map((s, i) => (
            <RevealItem as="li" key={s.title} className="rounded-[2rem] border border-line bg-surface p-8">
              <span className="font-serif text-lg italic text-accent-deep">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-4 font-serif text-2xl">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
