import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, MessageCircle, UtensilsCrossed } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { theForkUrl, whatsappUrl } from "@/lib/contact";
import { RevealGroup, RevealItem } from "./Reveal";

/** The three ways to book, side by side: own form (primary), WhatsApp, TheFork. */
export function BookingOptions({ locale, dict, formHref, heading: H = "h3" }: { locale: Locale; dict: Dictionary; formHref?: string; heading?: "h2" | "h3" }) {
  const o = dict.booking.options;
  const options = [
    { key: "form", Icon: CalendarDays, ...o.form, href: formHref ?? `/${locale}/booking#booking-form`, external: false },
    { key: "whatsapp", Icon: MessageCircle, ...o.whatsapp, href: whatsappUrl(dict.common.whatsappMessage), external: true },
    { key: "thefork", Icon: UtensilsCrossed, ...o.thefork, href: theForkUrl, external: true },
  ];
  return (
    <RevealGroup as="ul" aria-label={o.label} className="grid border-y border-ink md:grid-cols-3">
      {options.map(({ key, Icon, title, text, cta, href, external }, i) => {
        const Arrow = external ? ArrowUpRight : ArrowRight;
        const linkClass = `group mt-auto inline-flex items-center gap-2 pt-6 font-semibold ${i === 0 ? "text-ink" : "text-ink/85"}`;
        const label = (
          <>
            <span className="link-underline">{cta}</span>
            <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </>
        );
        return (
          <RevealItem as="li" key={key} className={`flex flex-col gap-3 py-8 md:px-8 md:first:pl-0 md:last:pr-0 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
            <span className={`grid size-12 place-items-center ${i === 0 ? "bg-ink text-mist" : "border border-line text-ink"}`}>
              <Icon className="size-5" aria-hidden />
            </span>
            <H className="mt-3 font-display text-[1.9rem] leading-none">{title}</H>
            <p className="leading-relaxed text-muted">{text}</p>
            {key === "thefork" && <p className="text-xs text-muted">{o.thefork.note}</p>}
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{label}</a>
            ) : (
              <Link href={href} className={linkClass}>{label}</Link>
            )}
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
