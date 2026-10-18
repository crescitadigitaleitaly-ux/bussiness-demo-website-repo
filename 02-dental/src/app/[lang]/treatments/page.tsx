import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { TreatmentIcon } from "@/components/TreatmentIcon";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "treatments", dict.treatmentsPage.meta.title, dict.treatmentsPage.meta.description);
}

export default async function Treatments() {
  const { locale, dict } = await getPage();
  const t = dict.treatmentsPage;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <ul className="container-x grid gap-6 md:grid-cols-2">
        {dict.treatments.map((tr, i) => (
          <li key={tr.slug}>
            <Reveal delay={(i % 2) * 0.08}>
              <Link href={`/${locale}/treatments/${tr.slug}`} className="group grid overflow-hidden rounded-[2rem] border border-line bg-surface sm:grid-cols-[1fr_1.1fr]">
                <div className="img-zoom relative aspect-[4/3] sm:aspect-auto sm:min-h-64">
                  <Image src={tr.image} alt="" fill sizes="(min-width:768px) 25vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col p-7">
                  <span className="grid size-11 place-items-center rounded-full bg-soft text-accent-deep"><TreatmentIcon name={tr.icon} className="size-5" /></span>
                  <h2 className="mt-5 font-serif text-2xl">{tr.title}</h2>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{tr.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep">
                    {dict.common.readMore} <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="container-x mt-10 max-w-3xl text-sm text-muted">{dict.common.medicalNote}</p>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
