import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPage } from "@/lib/page";
import { describe, getDictionary, pageMetadata, siteUrl, withBrand } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";

export function generateStaticParams() {
  return getDictionary("it").insights.articles.map((a) => ({ slug: a.slug }));
}

async function load(params: PageProps<"/[lang]/insights/[slug]">["params"]) {
  const { slug } = await params;
  const page = await getPage();
  const article = page.dict.insights.articles.find((a) => a.slug === slug);
  if (!article) notFound();
  return { ...page, article };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/insights/[slug]">) {
  const { locale, article, dict } = await load(params);
  const meta = pageMetadata(locale, `insights/${article.slug}`, withBrand(article.title, dict.brand.name), describe(article.excerpt, article.body[0]), article.image);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: article.date } };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/insights/[slug]">) {
  const { locale, dict, article } = await load(params);
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.date));
  return (
    <article>
      <header className="container-x max-w-[60rem] pb-12 pt-12 sm:pt-20">
        <Link href={`/${locale}/insights`} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> {dict.common.backTo} {dict.nav.insights}
        </Link>
        <p className="mt-10 flex flex-wrap gap-3 text-sm text-muted animate-[rise_.9s_var(--ease-out-expo)_both]">
          <span className="text-accent">{article.category}</span>·<time dateTime={article.date}>{date}</time>·<span>{article.readTime} {dict.common.minRead}</span>
        </p>
        <h1 className="display mt-5 text-[clamp(2.2rem,5vw,4.25rem)] animate-[rise_1s_.08s_var(--ease-out-expo)_both]">{article.title}</h1>
        <p className="lead mt-6 animate-[rise_1s_.16s_var(--ease-out-expo)_both]">{article.excerpt}</p>
      </header>
      <div className="container-x animate-[unveil_1.3s_.2s_var(--ease-out-expo)_both]">
        <div className="relative aspect-[21/9] overflow-hidden rounded-[1.75rem]">
          <Image src={article.image} alt={article.title} fill priority sizes="(min-width:1320px) 1224px, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="container-x max-w-[44rem] space-y-6 py-20 text-lg leading-[1.8] text-ink/90">
        {article.body.map((p, i) => (
          <Reveal key={i} y={16}>
            <p className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.85] first-letter:text-accent" : ""}>{p}</p>
          </Reveal>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified: article.date,
          inLanguage: locale,
          image: [`${siteUrl}${article.image}`],
          author: { "@type": "Organization", name: dict.brand.name, url: `${siteUrl}/${locale}` },
          publisher: {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: dict.brand.name,
            logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png`, width: 512, height: 512 },
          },
          mainEntityOfPage: `${siteUrl}/${locale}/insights/${article.slug}`,
        }}
      />
      <CtaBand locale={locale} t={dict.home.cta} />
    </article>
  );
}
