"use client";

import type { HomeData } from "@/lib/cms/schema";
import { BiField, SaveBar, Switch, useEditor } from "./kit";

const SECTIONS: { key: keyof HomeData["sections"]; label: string; description: string }[] = [
  { key: "catchBoard", label: "Today's catch board", description: "The price list next to the main photo" },
  { key: "facts", label: "Three short facts", description: "Terrace, aperitivo, ways to book" },
  { key: "kitchen", label: "Our kitchen", description: "Chef photo and short story" },
  { key: "signature", label: "Signature dishes", description: "Three dishes with photos" },
  { key: "quote", label: "Quote over the sea", description: "Large photo with a short quote" },
  { key: "booking", label: "Ways to book", description: "Online form, WhatsApp, TheFork" },
  { key: "reviews", label: "Guest reviews", description: "Three short reviews" },
  { key: "visit", label: "Find us", description: "Address, opening hours and map link" },
];

export function HomeEditor({ initial }: { initial: HomeData }) {
  const { data, update, save, dirty, pending, result } = useEditor("home", initial);
  const h = data.hero;

  return (
    <>
      <section className="admin-card space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Main headline</h2>
          <p className="mt-1 text-sm text-muted">The big text visitors see first. The middle part is shown in gold italics.</p>
        </div>
        <div className="rounded-lg bg-mist px-5 py-6" aria-label="Preview">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Preview (English)</p>
          <p className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">
            {h.titleA.en} <span className="accent">{h.titleAccent.en}</span> {h.titleB.en}
          </p>
          <p className="mt-3 max-w-[50ch] text-muted">{h.lede.en}</p>
        </div>
        <BiField label="Headline start" max={40} value={h.titleA} onChange={(v) => update((d) => { d.hero.titleA = v; })} />
        <BiField label="Headline highlight (gold)" max={30} value={h.titleAccent} onChange={(v) => update((d) => { d.hero.titleAccent = v; })} />
        <BiField label="Headline end" max={40} value={h.titleB} onChange={(v) => update((d) => { d.hero.titleB = v; })} />
        <BiField label="Intro text" max={220} multiline value={h.lede} onChange={(v) => update((d) => { d.hero.lede = v; })} />
      </section>

      <section className="admin-card mt-6">
        <h2 className="text-lg font-semibold">Homepage sections</h2>
        <p className="mt-1 text-sm text-muted">Switch a section off to hide it from the homepage. You can switch it back on at any time.</p>
        <div className="mt-2 divide-y divide-line">
          {SECTIONS.map((s) => (
            <Switch key={s.key} label={s.label} description={s.description} checked={data.sections[s.key]} onChange={(v) => update((d) => { d.sections[s.key] = v; })} />
          ))}
        </div>
      </section>

      <SaveBar dirty={dirty} pending={pending} result={result} onSave={save} />
    </>
  );
}
