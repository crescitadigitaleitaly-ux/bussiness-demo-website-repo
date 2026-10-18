import { CheckCircle2 } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "consultation", dict.consultation.meta.title, dict.consultation.meta.description);
}

export default async function Consultation() {
  const { locale, dict } = await getPage();
  const t = dict.consultation;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x grid gap-14 pb-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 className="eyebrow">{t.expectTitle}</h2>
            <ul className="mt-6 space-y-4">
              {t.expect.map((e) => (
                <li key={e} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />{e}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <RequestForm locale={locale} t={dict.form} kind="consultation" areas={dict.services.map((s) => s.title)} />
        </Reveal>
      </div>
    </>
  );
}
