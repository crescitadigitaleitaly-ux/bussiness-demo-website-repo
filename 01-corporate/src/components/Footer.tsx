import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { nav, footer, brand } = dict;
  const l = (p: string) => `/${locale}/${p}`;
  const cols = [
    { title: footer.company, links: [[nav.about, "about"], [nav.whyUs, "why-us"], [nav.team, "team"], [nav.contact, "contact"]] },
    { title: footer.explore, links: [[nav.services, "services"], [nav.projects, "projects"], [nav.insights, "insights"], [nav.cta, "consultation"]] },
    { title: footer.legal, links: [[footer.privacy, "privacy"], [footer.cookies, "cookies"]] },
  ];
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm leading-relaxed">{footer.about}</p>
          <address className="mt-8 space-y-1.5 text-sm not-italic">
            <p>{brand.address}</p>
            <p>
              <a className="link-underline text-white" href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>{" "}
              <span className="text-white/50">({brand.phoneNote})</span>
            </p>
            <p><a className="link-underline text-white" href={`mailto:${brand.email}`}>{brand.email}</a></p>
          </address>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="lg:col-span-2 lg:col-start-auto">
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">{c.title}</h2>
            <ul className="mt-5 space-y-3">
              {c.links.map(([label, path]) => (
                <li key={path}><Link href={l(path)} className="link-underline text-white/85 hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="lg:col-span-2">
          <Link href={l("consultation")} className="group inline-flex items-center gap-2 text-lg text-white">
            {nav.cta}
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>© 2026 {brand.name}. {footer.rights} {footer.vat}</p>
          <p>
            {footer.credit}{" "}
            <a href="https://www.crescitadigitaleitalia.com/" className="link-underline text-white/85" target="_blank" rel="noopener">
              Crescita Digitale Italia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
