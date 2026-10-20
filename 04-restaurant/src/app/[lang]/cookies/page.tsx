import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  const t = dict.legal.cookies;
  return { ...pageMetadata(locale, "cookies", t.meta.title, t.meta.description), robots: { index: false } };
}

export default async function Page() {
  const { dict } = await getPage();
  const t = dict.legal.cookies;
  return (
    <article className="container-x max-w-[48rem] pb-28 pt-16 sm:pt-24">
      <h1 className="display text-[clamp(2.4rem,5vw,4rem)]">{t.title}</h1>
      <p className="mt-4 text-sm text-muted">{t.updated}</p>
      <p className="mt-8 border-l-2 border-sun bg-surface px-5 py-4 text-sm">{t.note}</p>
      <div className="mt-12 space-y-10">
        {t.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-medium tracking-tight">{s.h}</h2>
            <p className="mt-3 leading-relaxed text-ink/85">{s.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
