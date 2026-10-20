import Image from "next/image";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "events", dict.events.meta.title, dict.events.meta.description, "/images/aperitivo.jpg");
}

export default async function Events() {
  const { locale, dict } = await getPage();
  const t = dict.events;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x space-y-20 pb-24 sm:space-y-28 sm:pb-32">
        {t.items.map((e, i) => (
          <article key={e.title} className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal className={`img-zoom relative aspect-[4/3] overflow-hidden lg:col-span-7 ${i % 2 ? "lg:order-2 lg:col-start-6" : ""}`}>
              <Image src={e.image} alt={e.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
            </Reveal>
            <Reveal delay={0.1} className={`lg:col-span-4 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-amber">{e.detail}</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)]">{e.title}</h2>
              <p className="mt-5 leading-relaxed text-muted">{e.text}</p>
            </Reveal>
          </article>
        ))}
      </section>
      <section aria-labelledby="event-form" className="bg-surface py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="event-form" className="display text-[clamp(2rem,3.6vw,3rem)]">{t.formTitle}</h2>
            <p className="lead mt-5">{t.formLead}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8">
            <RequestForm locale={locale} t={dict.form} kind="contact" placeholder={dict.form.eventPlaceholder} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
