import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "./Logo";
import { Wave } from "./Wave";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { nav, footer, brand } = dict;
  const l = (p: string) => `/${locale}/${p}`;
  const cols = [
    { title: footer.explore, links: [[nav.menu, "menu"], [nav.kitchen, "kitchen"], [nav.events, "events"], [nav.contact, "contact"], [nav.cta, "booking"]] },
    { title: footer.legal, links: [[footer.privacy, "privacy"], [footer.cookies, "cookies"]] },
  ];
  return (
    <footer className="bg-deep text-mist/75">
      <div className="container-x pt-16 sm:pt-20">
        <Wave className="text-sun/70" />
      </div>
      <div className="container-x grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm font-serif text-xl italic leading-snug text-mist">{footer.about}</p>
          <address className="mt-8 space-y-1 text-sm not-italic">
            <p>{brand.address}</p>
            <p>
              <a className="link-underline inline-block py-1 text-mist" href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a> <span>({brand.phoneNote})</span>
            </p>
            <p><a className="link-underline inline-block py-1 text-mist" href={`mailto:${brand.email}`}>{brand.email}</a></p>
          </address>
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sun">{dict.common.hoursLabel}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {brand.hours.map((h) => (
              <div key={h.days}><dt className="text-mist">{h.days}</dt><dd className="tabular">{h.time}</dd></div>
            ))}
          </dl>
          <p className="mt-4 text-sm">{brand.season}</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sun">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map(([label, path]) => (
                <li key={path}><Link href={l(path)} className="link-underline text-mist/90 hover:text-mist">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-mist/10 pb-16 lg:pb-0">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <p>© 2026 {brand.name}. {footer.rights} {footer.vat}.</p>
          <p>
            {footer.credit}{" "}
            <a href="https://www.crescitadigitaleitalia.com/" className="link-underline text-mist/90" target="_blank" rel="noopener">
              Crescita Digitale Italia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
