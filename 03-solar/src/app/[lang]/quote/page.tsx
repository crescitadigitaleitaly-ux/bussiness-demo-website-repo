import { Suspense } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "quote", dict.quote.meta.title, dict.quote.meta.description);
}

export default async function Quote() {
  const { locale, dict } = await getPage();
  const t = dict.quote;
  const props = { locale, t: dict.form, kind: "quote" as const };
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x grid gap-14 pb-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">{t.expectTitle}</h2>
              <ol className="mt-6 space-y-4">
                {t.expect.map((e) => (
                  <li key={e} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />{e}</li>
                ))}
              </ol>
            </div>
            <a href={`tel:${dict.brand.phone.replace(/\s/g, "")}`} className="card flex items-center gap-3 p-5 transition-colors hover:border-accent/50">
              <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent"><Phone className="size-5" aria-hidden /></span>
              <span>
                <span className="block font-medium">{dict.brand.phone}</span>
                <span className="text-sm text-muted">{dict.brand.phoneNote}</span>
              </span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <Suspense fallback={<RequestForm {...props} />}>
            <QuoteForm {...props} />
          </Suspense>
        </Reveal>
      </div>
    </>
  );
}
