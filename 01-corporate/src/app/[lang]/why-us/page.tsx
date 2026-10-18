import { Check, Minus } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "why-us", dict.whyUs.meta.title, dict.whyUs.meta.description);
}

export default async function WhyUs() {
  const { locale, dict } = await getPage();
  const t = dict.whyUs;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <RevealGroup className="container-x grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {t.reasons.map((r, i) => (
          <RevealItem key={r.title} className="border-b border-line py-10">
            <span className="font-serif text-lg italic text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-6 text-2xl font-medium tracking-tight">{r.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{r.text}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <section className="container-x py-24 sm:py-32">
        <Reveal><h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.compareTitle}</h2></Reveal>
        <Reveal delay={0.1} className="mt-12 space-y-4 md:hidden">
          {t.compare.rows.map((r) => (
            <div key={r.label} className="rounded-[1.25rem] border border-line bg-surface p-5">
              <h3 className="font-medium">{r.label}</h3>
              <p className="mt-3 flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /><span><span className="sr-only">{t.compare.us}: </span>{r.us}</span></p>
              <p className="mt-2 flex gap-2.5 text-muted"><Minus className="mt-0.5 size-4 shrink-0" aria-hidden /><span><span className="sr-only">{t.compare.them}: </span>{r.them}</span></p>
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.1} className="mt-12 hidden overflow-hidden rounded-[1.5rem] border border-line bg-surface md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-sm">
                <th scope="col" className="w-1/3 p-6 font-normal text-muted"><span className="sr-only">{t.compareTitle}</span></th>
                <th scope="col" className="w-1/3 bg-ink p-6 font-medium text-white">{t.compare.us}</th>
                <th scope="col" className="w-1/3 p-6 font-medium text-muted">{t.compare.them}</th>
              </tr>
            </thead>
            <tbody>
              {t.compare.rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-6 font-medium">{r.label}</th>
                  <td className="bg-ink/[0.03] p-6"><span className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{r.us}</span></td>
                  <td className="p-6 text-muted"><span className="flex gap-2.5"><Minus className="mt-0.5 size-4 shrink-0" aria-hidden />{r.them}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} />
    </>
  );
}
