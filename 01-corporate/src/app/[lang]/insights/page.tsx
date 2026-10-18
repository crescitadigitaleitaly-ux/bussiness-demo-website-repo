import Image from "next/image";
import Link from "next/link";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { RevealGroup, RevealItem } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "insights", dict.insights.meta.title, dict.insights.meta.description);
}

export default async function Insights() {
  const { locale, dict } = await getPage();
  const t = dict.insights;
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <RevealGroup as="ul" className="container-x grid gap-x-8 gap-y-16 pb-28 md:grid-cols-2 lg:grid-cols-3">
        {t.articles.map((a, i) => (
          <RevealItem as="li" key={a.slug} className={i === 0 ? "md:col-span-2 lg:col-span-3" : ""}>
            <Link href={`/${locale}/insights/${a.slug}`} className={`group grid gap-6 ${i === 0 ? "lg:grid-cols-12 lg:items-center lg:gap-12" : ""}`}>
              <div className={`img-zoom relative overflow-hidden rounded-[1.5rem] ${i === 0 ? "aspect-[16/9] lg:col-span-7" : "aspect-[3/2]"}`}>
                <Image src={a.image} alt="" fill sizes={i === 0 ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 30vw, (min-width:768px) 45vw, 100vw"} className="object-cover" />
              </div>
              <div className={i === 0 ? "lg:col-span-5" : ""}>
                <p className="flex gap-3 text-sm text-muted">
                  <span className="text-accent">{a.category}</span>·<time dateTime={a.date}>{fmt.format(new Date(a.date))}</time>
                </p>
                <h2 className={`mt-3 font-medium tracking-tight group-hover:underline decoration-1 underline-offset-4 ${i === 0 ? "text-[clamp(1.7rem,3vw,2.6rem)] leading-tight" : "text-xl leading-snug"}`}>{a.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{a.excerpt}</p>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
