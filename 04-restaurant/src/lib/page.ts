import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./i18n";

export async function getPage() {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return { locale, dict: getDictionary(locale) };
}
