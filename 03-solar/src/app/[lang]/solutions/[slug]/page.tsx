import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Info, Sparkles } from "lucide-react";
import { getPage } from "@/lib/page";
import { describe, getDictionary, pageMetadata, siteUrl, withBrand } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SolutionIcon } from "@/components/SolutionIcon";

export function generateStaticParams() {
  return getDictionary("it").solutions.map((s) => ({ slug: s.slug }));
}

async function load(params: PageProps<"/[lang]/solutions/[slug]">["params"]) {
  const { slug } = await params;
  const page = await getPage();
  const solution = page.dict.solutions.find((s) => s.slug === slug);
  if (!solution) notFound();
  return { ...page, solution };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/solutions/[slug]">) {
  const { locale, solution: s, dict } = await load(params);
  return pageMetadata(locale, `solutions/${s.slug}`, withBrand(s.title, dict.brand.name), describe(s.short, s.intro), s.image);
}

export default async function SolutionPage({ params }: PageProps<"/[lang]/solutions/[slug]">) {
  const { locale, dict, solution: s } = await load(params);
  const p = dict.solutionsPage;
  const others = dict.solutions.filter((o) => o.slug !== s.slug);

  return (
    <article>
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 animate-[settle_2.4s_var(--ease-out-expo)_both]">
          <Image src={s.image} alt={s.imageAlt} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/85 to-paper/30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-paper to-transparent" />
        <div className="container-x pb-20 pt-12 sm:pb-28 sm:pt-16">
          <Link href={`/${locale}/solutions`} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> {dict.common.backTo} {dict.nav.solutions}
          </Link>
          <span className="mt-12 grid size-14 place-items-center rounded-2xl bg-accent text-paper animate-[rise_.9s_var(--ease-out-expo)_both]">
            <SolutionIcon name={s.icon} className="size-6" />
          </span>
          <h1 className="display mt-6 max-w-[14ch] text-[clamp(2.6rem,6.4vw,5.5rem)] animate-[rise_1s_.08s_var(--ease-out-expo)_both]">{s.title}</h1>
          <p className="lead mt-6 max-w-[52ch] text-ink/80 animate-[rise_1s_.16s_var(--ease-out-expo)_both]">{s.intro}</p>
          <p className="mt-8 inline-flex max-w-full items-start gap-2.5 rounded-2xl border border-line bg-surface/80 px-4 py-3 text-sm backdrop-blur animate-[rise_1s_.24s_var(--ease-out-expo)_both]">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <span><span className="text-muted">{p.ideal}:</span> {s.ideal}</span>
          </p>
        </div>
      </header>

      <section className="container-x grid gap-6 py-16 sm:py-20 lg:grid-cols-2">
        <Reveal className="card p-7 sm:p-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{p.benefits}</h2>
          <ul className="mt-6 space-y-3">
            {s.benefits.map((b) => (
              <li key={b} className="flex gap-3 rounded-2xl bg-paper px-5 py-4"><Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />{b}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="card p-7 sm:p-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{p.includes}</h2>
          <ol className="mt-6 space-y-5">
            {s.includes.map((x, i) => (
              <li key={x} className="flex items-center gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/50 font-display text-sm font-semibold text-accent">{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="container-x pb-16">
        <p className="flex max-w-3xl gap-3 rounded-2xl border border-line p-5 text-sm leading-relaxed text-muted">
          <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
          {p.note}
        </p>
        <Link href={`/${locale}/quote`} className="btn-primary group mt-10">
          {p.quoteThis}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </section>

      <section className="container-x border-t border-line py-16 sm:py-20">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{p.other}</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/${locale}/solutions/${o.slug}`} className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-3 transition-colors hover:border-accent">
                <SolutionIcon name={o.icon} className="size-4 text-accent" />
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.title,
          description: s.intro,
          serviceType: s.title,
          inLanguage: locale,
          url: `${siteUrl}/${locale}/solutions/${s.slug}`,
          areaServed: ["Veneto", "Lombardia"],
          provider: { "@id": `${siteUrl}/#organization` },
        }}
      />
    </article>
  );
}
