import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, Info } from "lucide-react";
import { getPage } from "@/lib/page";
import { describe, getDictionary, pageMetadata, siteUrl, withBrand } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { TreatmentIcon } from "@/components/TreatmentIcon";

export function generateStaticParams() {
  return getDictionary("it").treatments.map((t) => ({ slug: t.slug }));
}

async function load(params: PageProps<"/[lang]/treatments/[slug]">["params"]) {
  const { slug } = await params;
  const page = await getPage();
  const treatment = page.dict.treatments.find((t) => t.slug === slug);
  if (!treatment) notFound();
  return { ...page, treatment };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/treatments/[slug]">) {
  const { locale, treatment, dict } = await load(params);
  return pageMetadata(locale, `treatments/${treatment.slug}`, withBrand(treatment.title, dict.brand.name), describe(treatment.short, treatment.intro), treatment.image);
}

export default async function TreatmentPage({ params }: PageProps<"/[lang]/treatments/[slug]">) {
  const { locale, dict, treatment: t } = await load(params);
  const p = dict.treatmentsPage;
  const others = dict.treatments.filter((o) => o.slug !== t.slug);

  return (
    <article>
      <header className="container-x grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Link href={`/${locale}/treatments`} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> {dict.common.backTo} {dict.nav.treatments}
          </Link>
          <span className="mt-10 grid size-14 place-items-center rounded-full bg-soft text-accent-deep animate-[rise_.9s_var(--ease-out-expo)_both]">
            <TreatmentIcon name={t.icon} className="size-6" />
          </span>
          <h1 className="display mt-6 text-[clamp(2.6rem,6vw,5rem)] animate-[rise_1s_.08s_var(--ease-out-expo)_both]">{t.title}</h1>
          <p className="lead mt-6 max-w-[48ch] animate-[rise_1s_.16s_var(--ease-out-expo)_both]">{t.intro}</p>
          <p className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 text-sm shadow-sm animate-[rise_1s_.24s_var(--ease-out-expo)_both]">
            <Clock3 className="size-4 text-accent-deep" aria-hidden />
            <span className="text-muted">{dict.common.duration}:</span> {t.duration}
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="arch relative mx-auto aspect-[4/5] max-w-md overflow-hidden animate-[unveil_1.3s_.15s_var(--ease-out-expo)_both]">
            <Image src={t.image} alt={t.title} fill priority sizes="(min-width:1024px) 38vw, 90vw" className="object-cover" />
          </div>
        </div>
      </header>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-serif text-3xl">{p.forWhom}</h2>
            <ul className="mt-6 space-y-3">
              {t.forWhom.map((f) => (
                <li key={f} className="flex gap-3 rounded-2xl bg-mist px-5 py-4"><Check className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden />{f}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl">{p.steps}</h2>
            <ol className="mt-6 space-y-5">
              {t.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/40 font-serif text-accent-deep">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <div className="container-x mt-14">
          <p className="flex max-w-3xl gap-3 rounded-2xl border border-line p-5 text-sm leading-relaxed text-muted">
            <Info className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden />
            <span>{t.note} {dict.common.medicalNote}</span>
          </p>
          <Link href={`/${locale}/booking?treatment=${t.slug}`} className="btn-primary group mt-10">
            {p.bookThis}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <h2 className="font-serif text-3xl">{p.other}</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/${locale}/treatments/${o.slug}`} className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-5 py-3 transition-colors hover:border-accent-deep">
                <TreatmentIcon name={o.icon} className="size-4 text-accent-deep" />
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: t.title,
          description: t.short,
          inLanguage: locale,
          url: `${siteUrl}/${locale}/treatments/${t.slug}`,
          about: { "@type": "MedicalProcedure", name: t.title, description: t.intro },
          publisher: { "@id": `${siteUrl}/#organization` },
        }}
      />
    </article>
  );
}
