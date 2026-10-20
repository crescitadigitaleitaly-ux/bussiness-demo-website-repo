import type { Metadata, Viewport } from "next";
import { Figtree, Libre_Caslon_Display, Libre_Caslon_Text } from "next/font/google";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import "../globals.css";
import { getDictionary, hasLocale, locales, siteUrl } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { JsonLd } from "@/components/JsonLd";
import { MotionProvider } from "@/components/MotionProvider";
import { MobileActionBar } from "@/components/MobileActionBar";
import { openingHours } from "@/lib/hours";

const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const display = Libre_Caslon_Display({ subsets: ["latin"], weight: "400", variable: "--font-caslon-display", display: "swap" });
const text = Libre_Caslon_Text({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-caslon-text", display: "swap" });

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

export const viewport: Viewport = { themeColor: "#e9efee" };

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable} ${text.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <a href="#main" className="sr-only z-[60] bg-ink px-5 py-3 text-mist focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {dict.nav.skip}
        </a>
        <aside aria-label="Demo" className="bg-deep px-4 py-2 text-center text-[0.72rem] tracking-wide text-mist/80">
          <p>{dict.brand.demoBar}</p>
        </aside>
        <MotionProvider>
          <Header locale={locale} nav={dict.nav} />
          <main id="main" className="flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
        </MotionProvider>
        <MobileActionBar locale={locale} dict={dict} />
        <aside aria-label={dict.common.whatsapp}>
          <WhatsAppFab label={dict.common.whatsapp} message={dict.common.whatsappMessage} />
        </aside>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "@id": `${siteUrl}/#organization`,
            name: dict.brand.full,
            description: dict.home.meta.description,
            url: `${siteUrl}/${locale}`,
            email: dict.brand.email,
            telephone: dict.brand.phone.replace(/\s/g, ""),
            logo: `${siteUrl}/logo.png`,
            image: `${siteUrl}/images/og.jpg`,
            servesCuisine: ["Seafood", "Ligurian", "Italian"],
            priceRange: "€€€",
            acceptsReservations: `${siteUrl}/${locale}/booking`,
            hasMenu: `${siteUrl}/${locale}/menu`,
            knowsLanguage: ["it", "en"],
            address: { "@type": "PostalAddress", streetAddress: dict.brand.street, postalCode: dict.brand.postal, addressLocality: dict.brand.city, addressRegion: "GE", addressCountry: "IT" },
            openingHoursSpecification: openingHours.slots.map(([opens, closes]) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: openingHours.days.map((d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]),
              opens,
              closes,
            })),
            disambiguatingDescription: "Fictional restaurant used for a website demonstration.",
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
