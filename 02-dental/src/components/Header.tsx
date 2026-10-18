"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "./Logo";

type Props = { locale: Locale; nav: Dictionary["nav"] };

export function Header({ locale, nav }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "treatments", label: nav.treatments },
    { href: "dentists", label: nav.dentists },
    { href: "technology", label: nav.technology },
    { href: "patient-info", label: nav.patients },
    { href: "faq", label: nav.faq },
    { href: "contact", label: nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation (state reset during render, per React docs) and lock scroll while open.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rest = pathname.replace(/^\/(it|en)(?=\/|$)/, "");
  const isActive = (slug: string) => rest === `/${slug}` || rest.startsWith(`/${slug}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open ? "bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Link href={`/${locale}`} className="relative z-10 shrink-0">
          <Logo />
          <span className="sr-only"> — {nav.home}</span>
        </Link>

        <nav aria-label={nav.primary} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={`/${locale}/${l.href}`}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className="rounded-full px-3.5 py-2 text-[0.93rem] text-ink/75 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:font-medium"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <LangSwitch locale={locale} rest={rest} label={nav.language} />
          <Link href={`/${locale}/booking`} className="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            {nav.cta}
          </Link>
          <button
            ref={menuButton}
            type="button"
            onClick={(e) => {
              // The panel sits under the header; measure where that is right now (demo bar may be visible).
              setMenuTop(e.currentTarget.closest("header")!.getBoundingClientRect().bottom);
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.close : nav.menu}
            className="grid size-11 place-items-center rounded-full border border-line bg-surface/70 xl:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: `calc(100dvh - ${menuTop}px)` }}
            className="absolute inset-x-0 top-full overflow-y-auto bg-paper xl:hidden"
          >
            <nav aria-label={nav.primary} className="container-x flex min-h-full flex-col pb-10 pt-6">
              <ul className="divide-y divide-line border-y border-line">
                {[{ href: "", label: nav.home }, { href: "about", label: nav.about }, ...links].map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={`/${locale}${l.href ? `/${l.href}` : ""}`}
                      aria-current={(l.href ? isActive(l.href) : rest === "") ? "page" : undefined}
                      className="flex items-center justify-between py-4 text-2xl tracking-tight aria-[current=page]:text-accent"
                    >
                      {l.label}
                      <ArrowUpRight className="size-5 text-muted" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link href={`/${locale}/booking`} className="btn-primary mt-8 w-full">
                {nav.cta}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangSwitch({ locale, rest, label }: { locale: Locale; rest: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line bg-surface/70 p-1 text-xs font-medium">
      {(["it", "en"] as const).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className="rounded-full px-2.5 py-1.5 uppercase tracking-wider text-muted transition-colors aria-[current=true]:bg-ink aria-[current=true]:text-white"
        >
          {l}
          <span className="sr-only"> — {l === "it" ? "Italiano" : "English"}</span>
        </Link>
      ))}
    </div>
  );
}
