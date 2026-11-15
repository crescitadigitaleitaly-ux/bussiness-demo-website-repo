"use client";

import { Plus, Trash2 } from "lucide-react";
import type { HoursData } from "@/lib/cms/schema";
import { Field, SaveBar, useEditor } from "./kit";

// Monday first. Values follow JavaScript: 0 = Sunday … 6 = Saturday.
const DAYS = [
  { n: 1, label: "Monday" }, { n: 2, label: "Tuesday" }, { n: 3, label: "Wednesday" }, { n: 4, label: "Thursday" },
  { n: 5, label: "Friday" }, { n: 6, label: "Saturday" }, { n: 0, label: "Sunday" },
];

export function HoursEditor({ initial }: { initial: HoursData }) {
  const { data, update, save, dirty, pending, result } = useEditor("hours", initial);

  return (
    <>
      <section className="admin-card">
        <h2 className="text-lg font-semibold">Open days</h2>
        <p className="mt-1 text-sm text-muted">Tick the days the restaurant is open. Unticked days show as “Closed”.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {DAYS.map((d) => (
            <label key={d.n} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-ink/15 bg-white px-3 has-checked:border-ink">
              <input
                type="checkbox"
                checked={data.days.includes(d.n)}
                onChange={(e) => update((x) => { x.days = e.target.checked ? [...x.days, d.n].sort((a, b) => a - b) : x.days.filter((v) => v !== d.n); })}
                className="size-5 accent-ink"
              />
              {d.label}
            </label>
          ))}
        </div>
      </section>

      <section className="admin-card mt-6">
        <h2 className="text-lg font-semibold">Opening times</h2>
        <p className="mt-1 text-sm text-muted">The same times apply to every open day. Lunch and dinner are separate slots.</p>
        <ol className="mt-4 space-y-3">
          {data.slots.map((s, i) => (
            <li key={i} className="flex flex-wrap items-end gap-3">
              <Field label="Opens"><input type="time" value={s.from} onChange={(e) => update((x) => { x.slots[i].from = e.target.value; })} className="admin-input w-36 tabular" /></Field>
              <Field label="Closes"><input type="time" value={s.to} onChange={(e) => update((x) => { x.slots[i].to = e.target.value; })} className="admin-input w-36 tabular" /></Field>
              <button type="button" className="admin-icon-btn mb-0.5 hover:bg-red-50 hover:text-red-700" disabled={data.slots.length === 1} onClick={() => update((x) => { x.slots.splice(i, 1); })} aria-label={`Delete time slot ${i + 1}`}>
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="admin-btn mt-4" disabled={data.slots.length >= 3} onClick={() => update((x) => { x.slots.push({ from: "12:00", to: "15:00" }); })}>
          <Plus className="size-4" aria-hidden /> Add a time slot
        </button>
      </section>

      <p className="mt-6 text-sm text-muted">These hours also drive the live “Open now / Closed” badge and the opening hours Google reads from the site.</p>

      <SaveBar dirty={dirty} pending={pending} result={result} onSave={save} />
    </>
  );
}
