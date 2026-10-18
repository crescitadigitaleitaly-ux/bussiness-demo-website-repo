import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SolutionIcon } from "@/components/SolutionIcon";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "solutions", dict.solutionsPage.meta.title, dict.solutionsPage.meta.description);
}

export default async function Solutions() {
  const { locale, dict } = await getPage();
  const t = dict.solutionsPage;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <ul className="container-x grid gap-6 pb-8 md:grid-cols-2">
        {dict.solutions.map((s, i) => (
          <li key={s.slug}>
            <Reveal delay={(i % 2) * 0.1}>
              <Link href={`/${locale}/solutions/${s.slug}`} className="group card relative flex aspect-[4/5] flex-col justify-end overflow-hidden p-7 sm:aspect-[5/4] sm:p-10">
                <div className="img-zoom absolute inset-0 -z-0">
                  <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-paper/10" />
                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent text-paper"><SolutionIcon name={s.icon} className="size-5" /></span>
                  <h2 className="display mt-6 text-[clamp(1.9rem,3.4vw,2.8rem)]">{s.title}</h2>
                  <p className="mt-3 max-w-[40ch] leading-relaxed text-ink/80">{s.short}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-medium text-accent">
                    {dict.common.readMore} <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
