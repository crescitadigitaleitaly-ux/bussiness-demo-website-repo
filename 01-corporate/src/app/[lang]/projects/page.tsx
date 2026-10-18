import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "projects", dict.projectsPage.meta.title, dict.projectsPage.meta.description);
}

export default async function Projects() {
  const { locale, dict } = await getPage();
  const t = dict.projectsPage;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x grid gap-x-10 gap-y-20 pb-12 md:grid-cols-2">
        {dict.projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.1} className={i % 2 ? "md:mt-24" : ""}>
            <Link href={`/${locale}/projects/${p.slug}`} className="group block">
              <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[5/4] md:aspect-[4/5]">
                <Image src={p.image} alt="" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
                <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-medium backdrop-blur">{p.sector}</span>
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-medium leading-snug tracking-tight sm:text-[1.75rem]">{p.title}</h2>
                  <p className="mt-3 leading-relaxed text-muted">{p.excerpt}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <CtaBand locale={locale} t={dict.home.cta} />
    </>
  );
}
