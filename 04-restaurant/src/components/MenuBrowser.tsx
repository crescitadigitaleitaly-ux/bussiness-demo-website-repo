"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

type T = Dictionary["menu"];
type Filter = keyof T["filters"];

/** The full menu with dietary filters. Every dish stays in the HTML (filters only hide), so search engines read the whole menu. */
export function MenuBrowser({ t }: { t: T }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = (tags: string[]) => filter === "all" || tags.includes(filter);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <div className="space-y-8 lg:sticky lg:top-28">
          <nav aria-label={t.eyebrow} className="hidden lg:block">
            <ul className="space-y-2.5 text-[0.95rem]">
              {t.sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="link-underline text-muted hover:text-ink">{s.title}</a></li>
              ))}
            </ul>
          </nav>
          <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
            {(Object.keys(t.filters) as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className="min-h-10 border border-line bg-surface px-3.5 text-sm font-medium text-muted transition-colors hover:border-ink/40 hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-mist"
              >
                {t.filters[f]}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">{t.cover}</p>
        </div>
      </aside>

      <div className="space-y-16 lg:col-span-9">
        {t.sections.map((s) => {
          const items = s.items.filter((i) => visible(i.tags));
          return (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink pb-3">
                <h2 id={`${s.id}-title`} className="font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-none">{s.title}</h2>
                {s.note && <p className="font-serif italic text-amber">{s.note}</p>}
              </div>
              {items.length ? (
                <ul className="divide-y divide-line">
                  {items.map((i) => (
                    <li key={i.name} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-5">
                      <h3 className="text-lg font-semibold">
                        {i.name}
                        <span className="sr-only">. {t.allergensTitle}: {i.allergens.map((a) => t.allergens[a - 1]).join(", ")}.</span>
                        <sup aria-hidden className="ml-1.5 align-super text-[0.68rem] font-medium tracking-wide text-amber">{i.allergens.join(" · ")}</sup>
                      </h3>
                      <p className="tabular text-right text-lg font-medium">€ {i.price}</p>
                      <p className="text-muted">{i.desc}</p>
                      {i.tags.length > 0 && (
                        <p className="col-span-2 mt-1 flex flex-wrap gap-1.5">
                          {i.tags.map((tag) => (
                            <span key={tag} className="border border-line px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                              {t.tags[tag as keyof T["tags"]]}
                            </span>
                          ))}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-muted">{t.empty}</p>
              )}
            </section>
          );
        })}

        <section aria-labelledby="allergens-title" className="border border-line bg-surface p-6 sm:p-8">
          <h2 id="allergens-title" className="font-display text-3xl">{t.allergensTitle}</h2>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{t.allergensLead}</p>
          <ol className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {t.allergens.map((a, n) => (
              <li key={a} className="flex gap-3"><span className="tabular w-5 text-right font-semibold text-amber">{n + 1}</span>{a}</li>
            ))}
          </ol>
          <div className="mt-6 space-y-2 border-t border-line pt-5 text-xs leading-relaxed text-muted">
            <p>{t.rawNote}</p>
            <p>{t.frozenNote}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
