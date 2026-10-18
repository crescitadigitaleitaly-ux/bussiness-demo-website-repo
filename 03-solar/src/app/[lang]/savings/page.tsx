import Image from "next/image";
import { BatteryCharging, ListChecks } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { CtaBand } from "@/components/CtaBand";
import { EnergyFlow } from "@/components/EnergyFlow";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SavingsCalculator } from "@/components/SavingsCalculator";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "savings", dict.savings.meta.title, dict.savings.meta.description, "/images/savings.jpg");
}

export default async function Savings() {
  const { locale, dict } = await getPage();
  const t = dict.savings;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x">
        <Reveal>
          <SavingsCalculator t={t.calc} locale={locale} heading="h2" />
        </Reveal>
      </section>

      <section id="assumptions" className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <ListChecks className="size-8 text-accent" aria-hidden />
          <h2 className="display mt-6 text-[clamp(2rem,4vw,3.25rem)]">{t.assumptionsTitle}</h2>
          <p className="lead mt-5">{t.assumptionsLead}</p>
          <div className="relative mt-10 hidden aspect-[16/10] overflow-hidden rounded-[1.75rem] lg:block">
            <Image src="/images/savings.jpg" alt={t.imageAlt} fill sizes="(min-width:1320px) 480px, 40vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <ol className="card divide-y divide-line">
            {t.assumptions.map((a, i) => (
              <li key={a} className="flex gap-5 p-6 leading-relaxed">
                <span className="font-display text-sm font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink/85">{a}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="border-y border-line bg-surface/40 py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <BatteryCharging className="size-8 text-accent" aria-hidden />
            <h2 className="display mt-6 text-[clamp(2rem,4vw,3.25rem)]">{t.batteryTitle}</h2>
            <p className="lead mt-5 max-w-[50ch]">{t.batteryText}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <EnergyFlow labels={dict.home.battery.flow} />
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">{t.faqTitle}</h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <FaqList items={t.faq} />
        </Reveal>
      </section>

      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
