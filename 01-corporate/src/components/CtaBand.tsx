import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ParallaxImage } from "./ParallaxImage";
import { Reveal } from "./Reveal";

export function CtaBand({ locale, t }: { locale: Locale; t: Dictionary["home"]["cta"] }) {
  return (
    <section className="container-x py-20 sm:py-28">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink text-white">
        <ParallaxImage src="/images/cta.jpg" alt="" sizes="(min-width:1320px) 1224px, 100vw" className="absolute inset-0 -z-10 opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <Reveal className="px-7 py-16 sm:px-14 sm:py-24 lg:px-20">
          <h2 className="display max-w-[18ch] text-[clamp(2rem,4.6vw,4rem)]">{t.title}</h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-white/75">{t.lead}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/${locale}/consultation`} className="btn-light group">
              {t.button}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href={`/${locale}/contact`} className="btn border border-white/25 text-white hover:bg-white/10">
              {t.alt}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
