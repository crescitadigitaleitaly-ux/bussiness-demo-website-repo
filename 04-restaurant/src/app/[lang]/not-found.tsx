import Link from "next/link";
import { getPage } from "@/lib/page";

export default async function NotFound() {
  const { locale, dict } = await getPage();
  const t = dict.notFound;
  return (
    <section className="container-x grid min-h-[70vh] place-content-center py-24 text-center">
      <title>{t.meta.title}</title>
      <p className="font-display text-[clamp(6rem,20vw,14rem)] leading-none text-ink/90">{t.code}</p>
      <h1 className="display mx-auto mt-6 max-w-[18ch] text-[clamp(2rem,4.5vw,3.5rem)]">{t.title}</h1>
      <p className="lead mx-auto mt-5 max-w-[44ch]">{t.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href={`/${locale}`} className="btn-primary">{t.home}</Link>
        <Link href={`/${locale}/menu`} className="btn-ghost">{t.secondary}</Link>
      </div>
    </section>
  );
}
