import type { Dictionary } from "@/lib/i18n";

/** "Pescato di oggi": the day's catch, priced per 100 g as Ligurian fish restaurants do. */
export function CatchBoard({ t, perHg, className = "" }: { t: Dictionary["home"]["catch"]; perHg: string; className?: string }) {
  return (
    <section aria-labelledby="catch-title" className={`bg-surface p-6 shadow-[0_30px_60px_-40px_rgb(15_42_58/0.55)] sm:p-7 ${className}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="catch-title" className="font-display text-[1.6rem] leading-none">{t.title}</h2>
        <span className="inline-flex items-center gap-2 text-xs text-muted">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-600 shadow-[0_0_0_4px_rgb(5_150_105/0.18)]" />
          {t.updated}
        </span>
      </header>
      <ul className="mt-5 divide-y divide-line border-y border-line">
        {t.items.map((i) => (
          <li key={i.name} className="flex items-baseline justify-between gap-4 py-2.5">
            <span>{i.name}</span>
            <span className="tabular shrink-0 text-muted">€ {i.price}{i.unit && ` ${perHg}`}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted">{t.note}</p>
    </section>
  );
}
