import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { nav, footer, brand } = dict;
  const l = (p: string) => `/${locale}/${p}`;
  const cols = [
    { title: footer.company, links: [[nav.about, "about"], [nav.projects, "projects"], [nav.savings, "savings"], [nav.contact, "contact"], [nav.cta, "quote"]] },
    { title: footer.solutions, links: dict.solutions.map((s) => [s.title, `solutions/${s.slug}`]) },
    { title: footer.legal, links: [[footer.privacy, "privacy"], [footer.cookies, "cookies"]] },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-line bg-[#070c11] text-muted">
      <div aria-hidden className="absolute -bottom-48 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed">{footer.about}</p>
          <address className="mt-8 space-y-1.5 text-sm not-italic">
            <p>{brand.address}</p>
            <p>
              <a className="link-underline text-ink" href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a> <span>({brand.phoneNote})</span>
            </p>
            <p><a className="link-underline text-ink" href={`mailto:${brand.email}`}>{brand.email}</a></p>
          </address>
          <dl className="mt-6 space-y-1 text-sm">
            {brand.hours.map((h) => (
              <div key={h.days} className="flex gap-3"><dt className="w-36">{h.days}</dt><dd className="text-ink">{h.time}</dd></div>
            ))}
          </dl>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="lg:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.2em]">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map(([label, path]) => (
                <li key={path}><Link href={l(path)} className="link-underline text-ink/85 hover:text-ink">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="lg:col-span-2">
          <Link href={l("quote")} className="group inline-flex items-center gap-2 font-display text-lg font-medium text-accent">
            {nav.cta}
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="relative border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <p>© 2026 {brand.name}. {footer.rights} {footer.vat}.</p>
          <p>
            {footer.credit}{" "}
            <a href="https://www.crescitadigitaleitalia.com/" className="link-underline text-ink/85" target="_blank" rel="noopener">
              Crescita Digitale Italia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
