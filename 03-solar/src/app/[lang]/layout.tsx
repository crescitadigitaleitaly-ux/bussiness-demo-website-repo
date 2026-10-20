import type { Metadata, Viewport } from "next";
import { Geist, Sora } from "next/font/google";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import "../globals.css";
import { getDictionary, hasLocale, locales, siteUrl } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { JsonLd } from "@/components/JsonLd";
import { MotionProvider } from "@/components/MotionProvider";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const display = Sora({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-sora", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await lang();
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.home.meta.title, template: `%s` },
    description: dict.home.meta.description,
    applicationName: dict.brand.name,
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#0a1118" };

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only z-[60] rounded-full bg-accent px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {dict.nav.skip}
        </a>
        <aside aria-label="Demo" className="border-b border-line bg-[#070c11] px-4 py-2 text-center text-[0.72rem] tracking-wide text-muted">
          <p>{dict.brand.demoBar}</p>
        </aside>
        <MotionProvider>
          <Header locale={locale} nav={dict.nav} />
          <main id="main" className="flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
        </MotionProvider>
        <aside aria-label={dict.common.whatsapp}>
          <WhatsAppFab label={dict.common.whatsapp} message={dict.common.whatsappMessage} />
        </aside>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${siteUrl}/#organization`,
            name: dict.brand.name,
            description: dict.home.meta.description,
            url: `${siteUrl}/${locale}`,
            email: dict.brand.email,
            telephone: dict.brand.phone.replace(/\s/g, ""),
            logo: `${siteUrl}/logo.png`,
            image: `${siteUrl}/images/og.jpg`,
            knowsLanguage: ["it", "en"],
            knowsAbout: dict.solutions.map((s) => s.title),
            areaServed: ["Veneto", "Lombardia"],
            address: { "@type": "PostalAddress", streetAddress: dict.brand.street, postalCode: dict.brand.postal, addressLocality: dict.brand.city, addressCountry: "IT" },
            openingHoursSpecification: [
              { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "18:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "12:30" },
            ],
            disambiguatingDescription: "Fictional solar installer used for a website demonstration.",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: dict.brand.name,
            url: `${siteUrl}/${locale}`,
            inLanguage: locale,
            publisher: { "@id": `${siteUrl}/#organization` },
          }}
        />
      </body>
    </html>
  );
}
