import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPage } from "@/lib/page";
import { describe, getDictionary, pageMetadata, withBrand } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export function generateStaticParams() {
  return getDictionary("it").projects.map((p) => ({ slug: p.slug }));
}

async function load(params: PageProps<"/[lang]/projects/[slug]">["params"]) {
  const { slug } = await params;
  const page = await getPage();
  const project = page.dict.projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return { ...page, project };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { locale, project, dict } = await load(params);
  return pageMetadata(locale, `projects/${project.slug}`, withBrand(project.title, dict.brand.name), describe(project.excerpt, project.challenge), project.image);
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { locale, dict, project } = await load(params);
  const t = dict.projectsPage;
  const others = dict.projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <article>
      <header className="container-x pb-12 pt-12 sm:pt-20">
        <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> {dict.common.backTo} {dict.nav.projects}
        </Link>
        <p className="eyebrow mt-10 animate-[rise_.9s_var(--ease-out-expo)_both]">{project.sector}</p>
        <h1 className="display mt-6 max-w-[22ch] text-[clamp(2.3rem,5.5vw,4.75rem)] animate-[rise_1s_.08s_var(--ease-out-expo)_both]">{project.title}</h1>
        <dl className="mt-12 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-3 animate-[rise_1s_.16s_var(--ease-out-expo)_both]">
          <div><dt className="text-muted">{t.client}</dt><dd className="mt-1">{project.client}</dd></div>
          <div><dt className="text-muted">{t.sector}</dt><dd className="mt-1">{project.sector}</dd></div>
          <div><dt className="text-muted">{t.duration}</dt><dd className="mt-1">{project.duration}</dd></div>
        </dl>
      </header>
      <div className="container-x animate-[unveil_1.3s_.2s_var(--ease-out-expo)_both]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem]">
          <Image src={project.image} alt={project.title} fill priority sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="container-x grid gap-16 py-20 sm:py-28 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-7">
          {([[t.challenge, project.challenge], [t.approach, project.approach], [t.outcome, project.outcome]] as const).map(([h, p]) => (
            <Reveal key={h}>
              <h2 className="eyebrow">{h}</h2>
              <p className="mt-5 text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">{p}</p>
            </Reveal>
          ))}
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <Reveal className="rounded-[1.5rem] bg-ink p-8 text-white lg:sticky lg:top-32">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">{t.results}</h2>
            <dl className="mt-6 divide-y divide-white/10">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse py-5">
                  <dt className="mt-1 text-sm text-white/70">{m.label}</dt>
                  <dd className="text-4xl font-medium tracking-[-0.03em]">{m.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-white/55">* {dict.common.illustrative}</p>
          </Reveal>
        </aside>
      </div>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)]">{t.more}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {others.map((p) => (
              <Link key={p.slug} href={`/${locale}/projects/${p.slug}`} className="group grid grid-cols-[7rem_1fr] items-center gap-5 sm:grid-cols-[10rem_1fr]">
                <div className="img-zoom relative aspect-square overflow-hidden rounded-xl">
                  <Image src={p.image} alt="" fill sizes="160px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">{p.sector}</p>
                  <h3 className="mt-2 text-lg font-medium leading-snug group-hover:underline">{p.title}</h3>
                  <ArrowUpRight className="mt-2 size-4 text-muted" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} />
    </article>
  );
}
