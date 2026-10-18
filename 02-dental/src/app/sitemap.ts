import type { MetadataRoute } from "next";
import { getDictionary, locales, siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const dict = getDictionary("it");
  const paths = [
    "", "about", "treatments", "dentists", "technology", "patient-info", "faq", "contact", "booking",
    ...dict.treatments.map((t) => `treatments/${t.slug}`),
  ];
  const url = (l: string, p: string) => `${siteUrl}/${l}${p ? `/${p}` : ""}`;
  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: url(l, p),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, url(x, p)])) },
    })),
  );
}
