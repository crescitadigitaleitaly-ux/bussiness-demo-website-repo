import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function CtaBand({ locale, t, phone }: { locale: Locale; t: Dictionary["home"]["cta"]; phone: string }) {
  return (
    <section className="container-x py-20 sm:py-28">
      <Reveal className="relative isolate overflow-hidden rounded-[2.5rem] border border-line">
        <Image src="/images/cta.jpg" alt="" fill sizes="(min-width:1320px) 1224px, 100vw" className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/90 to-paper/40" />
        <div aria-hidden className="absolute -left-24 -top-24 -z-10 size-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="max-w-2xl px-7 py-16 sm:px-14 sm:py-24">
          <h2 className="display text-[clamp(2.3rem,5vw,4.25rem)]">{t.title}</h2>
          <p className="lead mt-5 max-w-[44ch]">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${locale}/quote`} className="btn-primary group">
              {t.button}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn-ghost">
              <Phone className="size-4" aria-hidden /> {t.alt}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
