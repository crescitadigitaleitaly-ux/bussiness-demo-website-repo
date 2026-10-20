import Image from "next/image";
import { Sun } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { BookingOptions } from "@/components/BookingOptions";
import { FaqList } from "@/components/FaqList";
import { OpenStatus } from "@/components/OpenStatus";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "booking", dict.booking.meta.title, dict.booking.meta.description, "/images/table.jpg");
}

export default async function Booking() {
  const { locale, dict } = await getPage();
  const t = dict.booking;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x">
        <BookingOptions locale={locale} dict={dict} formHref="#booking-form" heading="h2" />
      </section>

      <section id="booking-form" aria-labelledby="booking-form-title" className="container-x grid scroll-mt-24 gap-12 py-20 sm:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-28">
            <h2 id="booking-form-title" className="display text-[clamp(2rem,3.6vw,3rem)]">{t.formTitle}</h2>
            <p className="flex gap-3 border-l-2 border-sun pl-4 text-muted"><Sun className="mt-0.5 size-5 shrink-0 text-amber" aria-hidden />{t.season}</p>
            <dl className="divide-y divide-line border-y border-line text-sm">
              {dict.brand.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3"><dt className="font-semibold">{h.days}</dt><dd className="tabular text-muted">{h.time}</dd></div>
              ))}
            </dl>
            <OpenStatus t={dict.common} className="text-sm text-muted" />
            <div className="relative hidden aspect-[4/3] overflow-hidden lg:block">
              <Image src="/images/table.jpg" alt="" fill sizes="30vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <RequestForm locale={locale} t={dict.form} kind="booking" />
        </Reveal>
      </section>

      <section aria-labelledby="faq-title" className="container-x grid gap-10 pb-24 sm:pb-32 lg:grid-cols-12">
        <h2 id="faq-title" className="display text-[clamp(2rem,3.6vw,3rem)] lg:col-span-4">{t.faqTitle}</h2>
        <div className="lg:col-span-8"><FaqList items={t.faq} /></div>
      </section>
    </>
  );
}
