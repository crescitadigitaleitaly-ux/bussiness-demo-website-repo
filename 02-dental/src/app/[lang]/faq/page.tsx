import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand } from "@/components/CtaBand";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "faq", dict.faq.meta.title, dict.faq.meta.description);
}

export default async function Faq() {
  const { locale, dict } = await getPage();
  const t = dict.faq;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x max-w-4xl">
        <FaqList items={t.items} />
        <p className="mt-8 text-sm text-muted">{dict.common.medicalNote}</p>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: t.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
        }}
      />
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
