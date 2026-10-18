import type { Metadata } from "next";
import { it } from "@/content/it";
import { en } from "@/content/en";

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

const dictionaries = { it, en };
export type Dictionary = typeof it;

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Same slug in both languages, so the switcher only swaps the prefix.
// ponytail: shared slugs; add a per-locale slug map + proxy rewrites if Italian URLs are required.
export function href(locale: Locale, path = "") {
  return `/${locale}${path ? `/${path.replace(/^\//, "")}` : ""}`;
}

export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  image = "/images/og.jpg",
): Metadata {
  const dict = getDictionary(locale);
  return {
    title,
    description,
    alternates: {
      canonical: href(locale, path),
      languages: {
        it: href("it", path),
        en: href("en", path),
        "x-default": href(defaultLocale, path),
      },
    },
    openGraph: {
      title,
      description,
      url: href(locale, path),
      siteName: dict.brand.name,
      locale: locale === "it" ? "it_IT" : "en_GB",
      alternateLocale: locale === "it" ? "en_GB" : "it_IT",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: dict.brand.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
