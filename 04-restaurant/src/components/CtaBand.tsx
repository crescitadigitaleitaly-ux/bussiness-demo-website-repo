import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function CtaBand({ locale, t, phone }: { locale: Locale; t: Dictionary["home"]["cta"]; phone: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-deep text-mist">
      <Image src="/images/coast.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-deep/80 to-deep/20" />
      <Reveal className="container-x py-24 sm:py-32">
        <h2 className="display max-w-[16ch] text-[clamp(2.4rem,5.4vw,4.6rem)]">{t.title}</h2>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-mist/80">{t.lead}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${locale}/booking`} className="btn-light group">
            {t.button}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn border border-mist/40 text-mist hover:bg-mist/10">
            <Phone className="size-4" aria-hidden /> {t.alt}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
