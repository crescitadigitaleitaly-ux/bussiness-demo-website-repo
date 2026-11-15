import type { Metadata, Viewport } from "next";
import { Figtree, Libre_Caslon_Display } from "next/font/google";
import "../globals.css";

const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const display = Libre_Caslon_Display({ subsets: ["latin"], weight: "400", variable: "--font-caslon-display", display: "swap" });

export const metadata: Metadata = {
  title: "Lanterna · Admin",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#e9efee" };

// Separate root layout: the admin panel has no site header, footer, WhatsApp button or analytics.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-mist text-ink antialiased">{children}</body>
    </html>
  );
}
