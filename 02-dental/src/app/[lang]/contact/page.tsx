import Link from "next/link";
import { ArrowRight, Bus, Clock3, Mail, MapPin, Phone } from "lucide-react";
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
        <Reveal className="space-y-6 lg:col-span-5">
          <section className="rounded-[2rem] bg-surface p-8">
            <h2 className="font-serif text-2xl">{t.detailsTitle}</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden />{b.address}</li>
              <li className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden /><span><a href={`tel:${b.phone.replace(/\s/g, "")}`} className="link-underline">{b.phone}</a> <span className="text-sm text-muted">({b.phoneNote})</span></span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden /><a href={`mailto:${b.email}`} className="link-underline">{b.email}</a></li>
            </ul>
          </section>
          <section className="rounded-[2rem] bg-surface p-8">
            <h2 className="flex items-center gap-3 font-serif text-2xl"><Clock3 className="size-5 text-accent-deep" aria-hidden />{t.hoursTitle}</h2>
            <dl className="mt-5 divide-y divide-line">
              {b.hours.map((h) => (
                <div key={h.days} className="flex justify-between py-3"><dt className="text-muted">{h.days}</dt><dd className="font-medium">{h.time}</dd></div>
              ))}
            </dl>
          </section>
          <section className="rounded-[2rem] bg-surface p-8">
            <h2 className="flex items-center gap-3 font-serif text-2xl"><Bus className="size-5 text-accent-deep" aria-hidden />{t.howTitle}</h2>
            <p className="mt-4 leading-relaxed text-muted">{t.how}</p>
          </section>
          <div className="rounded-[2rem] bg-accent-deep p-8 text-white">
            <p className="text-white/85">{t.bookingHint}</p>
            <Link href={`/${locale}/booking`} className="group mt-3 inline-flex items-center gap-2 font-medium">
              {dict.nav.cta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <h2 className="mb-6 font-serif text-3xl">{t.formTitle}</h2>
          <RequestForm locale={locale} t={dict.form} kind="contact" />
        </Reveal>
      </div>
    </>
  );
}
