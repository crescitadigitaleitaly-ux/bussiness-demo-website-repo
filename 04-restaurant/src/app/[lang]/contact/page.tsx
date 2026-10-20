import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { mapsUrl } from "@/lib/contact";
import { OpenStatus } from "@/components/OpenStatus";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "contact", dict.contact.meta.title, dict.contact.meta.description, "/images/village.jpg");
}

export default async function Contact() {
  const { locale, dict } = await getPage();
  const t = dict.contact;
  const b = dict.brand;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x grid gap-14 pb-24 sm:pb-32 lg:grid-cols-12">
        <Reveal className="space-y-12 lg:col-span-5">
          <section>
            <h2 className="font-display text-3xl">{t.detailsTitle}</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden />{b.address}</li>
              <li className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden /><span><a href={`tel:${b.phone.replace(/\s/g, "")}`} className="link-underline">{b.phone}</a> <span className="text-sm text-muted">({b.phoneNote})</span></span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden /><a href={`mailto:${b.email}`} className="link-underline">{b.email}</a></li>
            </ul>
            <a href={mapsUrl(`${b.street}, ${b.postal} ${b.city}`)} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-8">
              {t.mapsLabel} <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </section>
          <section>
            <h2 className="font-display text-3xl">{t.hoursTitle}</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {b.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"><dt className="font-semibold">{h.days}</dt><dd className="tabular text-muted">{h.time}</dd></div>
              ))}
            </dl>
            <OpenStatus t={dict.common} className="mt-4 text-sm text-muted" />
            <p className="mt-2 text-sm text-muted">{b.season}</p>
          </section>
          <section>
            <h2 className="font-display text-3xl">{t.howTitle}</h2>
            <dl className="mt-5 space-y-5">
              {t.how.map((h) => (
                <div key={h.title}><dt className="font-serif text-lg italic text-amber">{h.title}</dt><dd className="mt-1 leading-relaxed text-muted">{h.text}</dd></div>
              ))}
            </dl>
          </section>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <h2 className="mb-6 font-display text-3xl">{t.formTitle}</h2>
          <RequestForm locale={locale} t={dict.form} kind="contact" />
        </Reveal>
      </div>
    </>
  );
}
