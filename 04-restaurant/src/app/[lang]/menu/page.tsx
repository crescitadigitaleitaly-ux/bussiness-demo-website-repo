import { getPage } from "@/lib/page";
import { pageMetadata, siteUrl } from "@/lib/i18n";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { MenuBrowser } from "@/components/MenuBrowser";
import { PageHero } from "@/components/PageHero";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "menu", dict.menu.meta.title, dict.menu.meta.description, "/images/dish-gamberi.jpg");
}

/** "6,50 / hg" or "4.50 each" → 6.5 / 4.5 for structured data. */
const amount = (price: string) => Number(price.replace(",", ".").match(/[\d.]+/)?.[0]);

export default async function Menu() {
  const { locale, dict } = await getPage();
  const t = dict.menu;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x pb-24 sm:pb-32">
        <MenuBrowser t={t} />
      </div>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Menu",
          name: t.title,
          inLanguage: locale,
          url: `${siteUrl}/${locale}/menu`,
          hasMenuSection: t.sections.map((s) => ({
            "@type": "MenuSection",
            name: s.title,
            hasMenuItem: s.items.map((i) => ({
              "@type": "MenuItem",
              name: i.name.replace(" *", ""),
              description: i.desc,
              offers: { "@type": "Offer", price: amount(i.price), priceCurrency: "EUR" },
              ...(i.tags.includes("gf") && { suitableForDiet: "https://schema.org/GlutenFreeDiet" }),
              ...(i.tags.includes("veg") && { suitableForDiet: "https://schema.org/VegetarianDiet" }),
            })),
          })),
        }}
      />
    </>
  );
}
