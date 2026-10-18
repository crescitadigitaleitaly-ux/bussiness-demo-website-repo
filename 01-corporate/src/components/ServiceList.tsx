import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { RevealGroup, RevealItem } from "./Reveal";

export function ServiceList({ locale, services }: { locale: Locale; services: Dictionary["services"] }) {
  return (
    <RevealGroup className="border-t border-line">
      {services.map((s) => (
        <RevealItem key={s.slug}>
          <Link
            href={`/${locale}/services#${s.slug}`}
            className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line py-7 transition-colors duration-500 hover:bg-surface sm:grid-cols-[5rem_1.1fr_1fr_auto] sm:gap-8 sm:py-9 sm:pr-4 xl:pr-52"
          >
            <span className="pl-1 font-serif text-xl italic text-accent sm:pl-4">{s.index}</span>
            <span className="text-[clamp(1.35rem,2.4vw,2rem)] font-medium tracking-[-0.025em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
              {s.title}
            </span>
            <span className="col-start-2 text-muted sm:col-start-auto">{s.summary}</span>
            <span className="relative row-start-1 col-start-3 grid size-11 place-items-center rounded-full border border-line transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-white sm:col-start-4">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
            <span className="pointer-events-none absolute right-4 top-1/2 hidden aspect-[4/3] w-44 -translate-y-1/2 rotate-[-3deg] scale-90 overflow-hidden rounded-xl opacity-0 shadow-2xl transition-all duration-500 ease-out-expo group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 xl:block">
              <Image src={s.image} alt="" fill sizes="176px" className="object-cover" />
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
