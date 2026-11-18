import { en } from "@/content/en";
import { it } from "@/content/it";
import { siteUrl } from "@/lib/i18n";

/**
 * /llms.txt (https://llmstxt.org): a plain Markdown map of the site for AI assistants and answer engines.
 * Built from the same content files as the pages, so it stays in sync with them.
 */
export function GET() {
  const page = (lang: "it" | "en", path: string, title: string, description: string) =>
    `- [${title}](${siteUrl}/${lang}${path ? `/${path}` : ""}): ${description}`;
  const strip = (title: string) => title.replace(/ — Aurevo Energia.*$/, "");

  const section = (lang: "it" | "en") => {
    const d = lang === "it" ? it : en;
    return [
      page(lang, "", strip(d.home.meta.title), d.home.meta.description),
      page(lang, "solutions", strip(d.solutionsPage.meta.title), d.solutionsPage.meta.description),
      ...d.solutions.map((s) => page(lang, `solutions/${s.slug}`, s.title, s.short)),
      page(lang, "savings", strip(d.savings.meta.title), d.savings.meta.description),
      page(lang, "projects", strip(d.projects.meta.title), d.projects.meta.description),
      page(lang, "about", strip(d.about.meta.title), d.about.meta.description),
      page(lang, "quote", strip(d.quote.meta.title), d.quote.meta.description),
      page(lang, "contact", strip(d.contact.meta.title), d.contact.meta.description),
    ].join("\n");
  };

  const body = `# ${en.brand.name}

> ${en.brand.name} is a fictional solar installer in Verona, Italy, used as a demo website by Crescita Digitale Italia (https://www.crescitadigitaleitalia.com). It presents residential and commercial solar, battery storage and EV charging, a savings estimate and a quote request form. Company details, projects and figures are invented for demonstration; savings figures are non-binding estimates.

The site is available in Italian (default) and English, with the same paths under /it and /en.

## English pages

${section("en")}

## Pagine in italiano

${section("it")}

## Optional

- [Sitemap](${siteUrl}/sitemap.xml): every public page in both languages
- [Privacy notice](${siteUrl}/en/privacy): how form data is processed (demo text)
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
