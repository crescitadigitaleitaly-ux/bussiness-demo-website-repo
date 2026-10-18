import { Suspense } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RequestForm } from "@/components/RequestForm";
import { BookingForm } from "@/components/BookingForm";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "booking", dict.booking.meta.title, dict.booking.meta.description);
}

export default async function Booking() {
  const { locale, dict } = await getPage();
  const t = dict.booking;
  const props = { locale, t: dict.form, kind: "booking" as const, treatments: dict.treatments.map((tr) => tr.title) };
  const slugs = Object.fromEntries(dict.treatments.map((tr) => [tr.slug, tr.title]));
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x grid gap-14 pb-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-32">
            <div>
              <h2 className="font-serif text-2xl">{t.expectTitle}</h2>
              <ol className="mt-6 space-y-4">
                {t.expect.map((e) => (
                  <li key={e} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-deep" aria-hidden />{e}</li>
                ))}
              </ol>
            </div>
            <a href={`tel:${dict.brand.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-2xl bg-surface p-5 transition-colors hover:bg-soft">
              <span className="grid size-11 place-items-center rounded-full bg-soft text-accent-deep"><Phone className="size-5" aria-hidden /></span>
              <span>
                <span className="block font-medium">{dict.brand.phone}</span>
                <span className="text-sm text-muted">{dict.brand.phoneNote}</span>
              </span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <Suspense fallback={<RequestForm {...props} />}>
            <BookingForm {...props} slugs={slugs} />
          </Suspense>
        </Reveal>
      </div>
    </>
  );
}
