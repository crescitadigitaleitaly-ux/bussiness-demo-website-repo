import Link from "next/link";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/contact";

/** Always-visible Prenota · Chiama · WhatsApp bar on phones (hidden from lg up, where the header CTA and floating button take over). */
export function MobileActionBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const item = "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em]";
  return (
    <nav aria-label={dict.nav.quick} className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <Link href={`/${locale}/booking`} className={`${item} bg-ink text-mist`}>
        <CalendarDays className="size-5" aria-hidden />
        {dict.nav.cta}
      </Link>
      <a href={`tel:${dict.brand.phone.replace(/\s/g, "")}`} className={`${item} text-ink`}>
        <Phone className="size-5" aria-hidden />
        {dict.nav.call}
      </a>
      <a href={whatsappUrl(dict.common.whatsappMessage)} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
        <MessageCircle className="size-5" aria-hidden />
        {dict.nav.whatsapp}
      </a>
    </nav>
  );
}
