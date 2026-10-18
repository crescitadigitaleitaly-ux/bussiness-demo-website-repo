"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";

type T = Dictionary["projects"];
type Filter = keyof T["filters"];

/** Filterable project grid. Filters are toggle buttons (aria-pressed); the grid animates between sets. */
export function ProjectGallery({ t, locale, limit, heading: H = "h3" }: { t: T; locale: Locale; limit?: number; heading?: "h2" | "h3" }) {
  const [filter, setFilter] = useState<Filter>("all");
  const items = t.items.filter((p) => filter === "all" || p.category === filter).slice(0, limit);
  const num = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, useGrouping: "always" });

  return (
    <div>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
        {(Object.keys(t.filters) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-paper"
          >
            {t.filters[f]}
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p, i) => (
            <motion.li
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`group card overflow-hidden ${i === 0 && !limit ? "sm:col-span-2" : ""}`}
            >
              <div className="img-zoom relative aspect-[16/10] overflow-hidden">
                <Image src={p.image} alt={p.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-paper/80 px-3 py-1 text-xs font-medium text-accent backdrop-blur">
                  {t.filters[p.category as Filter]}
                </span>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-1.5 text-sm text-muted"><MapPin className="size-4" aria-hidden />{p.place}</p>
                <H className="mt-2 font-display text-xl font-semibold tracking-tight">{p.title}</H>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
                  <div><dt className="text-muted">{t.power}</dt><dd className="mt-0.5 font-medium">{num.format(p.kwp)} kWp</dd></div>
                  <div><dt className="text-muted">{t.storage}</dt><dd className="mt-0.5 font-medium">{p.battery ? `${num.format(p.battery)} kWh` : "—"}</dd></div>
                  <div><dt className="text-muted">{t.year}</dt><dd className="mt-0.5 font-medium">{p.year}</dd></div>
                </dl>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
