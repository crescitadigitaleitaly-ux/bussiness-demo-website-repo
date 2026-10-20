"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { estimate, type PropertyKind } from "@/lib/savings";

type T = Dictionary["savings"]["calc"];

const ranges = { home: [40, 600, 150], business: [200, 20000, 1500] } as const;

export function SavingsCalculator({ t, locale, heading: H = "h3" }: { t: T; locale: Locale; heading?: "h2" | "h3" }) {
  const [kind, setKind] = useState<PropertyKind>("home");
  const [bill, setBill] = useState<number>(ranges.home[2]);
  const [battery, setBattery] = useState(false);
  const r = estimate(bill, kind, battery);
  const [min, max] = ranges[kind];
  const step = kind === "home" ? 10 : 100;

  const n = (v: number, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, useGrouping: "always" }).format(v);
  const eur = (v: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: "always" }).format(Math.round(v / 10) * 10);

  const results = [
    { label: t.kwp, value: `${n(r.kwp, 1)} kWp` },
    { label: t.production, value: `${n(Math.round(r.production / 10) * 10)} kWh` },
    { label: t.batteryKwh, value: r.batteryKwh ? `${n(r.batteryKwh)} kWh` : t.none },
    { label: t.payback, value: `${n(r.payback[0], 1)}–${n(r.payback[1], 1)} ${t.years}` },
    { label: t.co2, value: `${n(r.co2, 1)} ${t.tonnes}` },
  ];

  return (
    <div className="card grid overflow-hidden lg:grid-cols-2">
      <div className="space-y-8 p-6 sm:p-10">
        <H className="font-display text-2xl font-semibold tracking-tight">{t.title}</H>

        <fieldset>
          <legend className="label">{t.property}</legend>
          <div className="inline-flex rounded-full border border-line bg-paper p-1">
            {(["home", "business"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => {
                  setKind(k);
                  setBill(ranges[k][2]);
                }}
                className="rounded-full px-5 py-2 text-sm font-medium text-muted transition-colors aria-pressed:bg-accent aria-pressed:text-paper"
              >
                {t[k]}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="calc-bill" className="label">{t.bill}</label>
            <output htmlFor="calc-bill" className="font-display text-2xl font-semibold text-accent">{eur(bill)}</output>
          </div>
          <input
            id="calc-bill"
            type="range"
            min={min}
            max={max}
            step={step}
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            aria-valuetext={eur(bill)}
            className="mt-3 h-6 w-full cursor-pointer accent-[var(--color-accent)]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted"><span>{eur(min)}</span><span>{eur(max)}</span></div>
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-paper px-5 py-4">
          <span className="font-medium">{t.battery}</span>
          <input type="checkbox" role="switch" checked={battery} onChange={(e) => setBattery(e.target.checked)} className="size-5 accent-[var(--color-accent)]" />
        </label>
      </div>

      <div className="relative border-t border-line bg-raised p-6 sm:p-10 lg:border-l lg:border-t-0">
        <div aria-hidden className="absolute -right-20 -top-20 size-64 rounded-full bg-accent/15 blur-3xl" />
        <div aria-live="polite" className="relative">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">{t.results}</p>
          <p className="mt-4 text-sm text-muted">{t.savings}</p>
          <p className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-tight tracking-[-0.04em] text-accent">
            {eur(r.savings[0])} – {eur(r.savings[1])}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
            {results.map((x) => (
              <div key={x.label}>
                <dt className="text-sm text-muted">{x.label}</dt>
                <dd className="mt-0.5 text-lg font-medium">{x.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="relative mt-8 flex gap-2.5 text-xs leading-relaxed text-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {t.disclaimer}
        </p>
        <Link href={`/${locale}/quote?property=${kind}&battery=${battery ? "yes" : "no"}`} className="btn-primary group relative mt-8 w-full sm:w-auto">
          {t.cta}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
