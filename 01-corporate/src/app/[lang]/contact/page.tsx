import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "contact", dict.contact.meta.title, dict.contact.meta.description);
}

export default async function Contact() {
  const { locale, dict } = await getPage();
  const t = dict.contact;
  const b = dict.brand;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x grid gap-14 pb-28 lg:grid-cols-12">
        <Reveal className="space-y-12 lg:col-span-4">
          <section>
            <h2 className="eyebrow">{t.detailsTitle}</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3"><Mail className="mt-0.5 size-5 text-accent" aria-hidden /><a href={`mailto:${b.email}`} className="link-underline">{b.email}</a></li>
              <li className="flex gap-3"><Phone className="mt-0.5 size-5 text-accent" aria-hidden /><span><a href={`tel:${b.phone.replace(/\s/g, "")}`} className="link-underline">{b.phone}</a> <span className="text-sm text-muted">({b.phoneNote})</span></span></li>
              <li className="flex gap-3"><Clock className="mt-0.5 size-5 text-accent" aria-hidden />{b.hours}</li>
            </ul>
          </section>
          <section>
            <h2 className="eyebrow">{t.officesTitle}</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {t.offices.map((o) => (
                <li key={o.city} className="flex gap-3 py-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                  <span><span className="block font-medium">{o.city}</span><span className="text-sm text-muted">{o.address}</span></span>
                </li>
              ))}
            </ul>
          </section>
          <div className="rounded-[1.25rem] bg-ink p-6 text-white">
            <p className="text-white/75">{t.consultationHint}</p>
            <Link href={`/${locale}/consultation`} className="group mt-3 inline-flex items-center gap-2 font-medium">
              {dict.nav.cta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <h2 className="mb-6 text-2xl font-medium tracking-tight">{t.formTitle}</h2>
          <RequestForm locale={locale} t={dict.form} kind="contact" />
        </Reveal>
      </div>
    </>
  );
}
