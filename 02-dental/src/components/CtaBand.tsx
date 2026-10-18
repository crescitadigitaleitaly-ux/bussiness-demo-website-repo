import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function CtaBand({ locale, t, phone }: { locale: Locale; t: Dictionary["home"]["cta"]; phone: string }) {
  return (
    <section className="container-x py-20 sm:py-28">
      <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-accent-deep text-white lg:grid-cols-2">
        <div className="px-7 py-14 sm:px-14 sm:py-20">
          <h2 className="display text-[clamp(2.2rem,4.6vw,3.75rem)]">{t.title}</h2>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-white/85">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/${locale}/booking`} className="btn-light group">
              {t.button}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn border border-white/30 text-white hover:bg-white/10">
              <Phone className="size-4" aria-hidden /> {t.alt}
            </a>
          </div>
        </div>
        <div className="relative hidden min-h-80 lg:block">
          <Image src="/images/cta.jpg" alt="" fill sizes="(min-width:1320px) 612px, 50vw" className="object-cover" />
        </div>
      </Reveal>
    </section>
  );
}
