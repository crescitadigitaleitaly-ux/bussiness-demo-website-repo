"use client";

import { Clock, Plus } from "lucide-react";
import type { CatchData } from "@/lib/cms/schema";
import { BiField, Field, PriceInput, RowTools, SaveBar, move, useEditor } from "./kit";

function romeNow() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
}

export function CatchEditor({ initial }: { initial: CatchData }) {
  const { data, update, save, dirty, pending, result } = useEditor("catch", initial);

  return (
    <>
      <section className="admin-card">
        <Field label="Last updated (Camogli time)" hint="Shown on the website as “Updated at …”.">
          <div className="flex max-w-xs gap-2">
            <input type="time" value={data.updatedAt} onChange={(e) => update((d) => { d.updatedAt = e.target.value; })} className="admin-input tabular" />
            <button type="button" className="admin-btn shrink-0" onClick={() => update((d) => { d.updatedAt = romeNow(); })}>
              <Clock className="size-4" aria-hidden /> Now
            </button>
          </div>
        </Field>
      </section>

      <ol className="mt-6 space-y-4">
        {data.items.map((item, i) => (
          <li key={i} className="admin-card">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Item {i + 1}</h2>
              <RowTools index={i} count={data.items.length} label={`item ${i + 1}`} onMove={(to) => update((d) => move(d.items, i, to))} onRemove={() => update((d) => { d.items.splice(i, 1); })} />
            </div>
            <div className="grid gap-4">
              <BiField label="Fish or dish" max={70} value={item.name} onChange={(v) => update((d) => { d.items[i].name = v; })} />
              <div className="grid items-end gap-4 sm:grid-cols-[12rem_1fr]">
                <Field label="Price">
                  <PriceInput label={`Price of item ${i + 1}`} value={item.price} onChange={(v) => update((d) => { d.items[i].price = v; })} />
                </Field>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" checked={item.byWeight} onChange={(e) => update((d) => { d.items[i].byWeight = e.target.checked; })} className="size-5 accent-ink" />
                  Price is per 100 g (sold by weight)
                </label>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="admin-btn mt-4"
        disabled={data.items.length >= 12}
        onClick={() => update((d) => { d.items.push({ name: { it: "", en: "" }, price: "", byWeight: true }); })}
      >
        <Plus className="size-4" aria-hidden /> Add item
      </button>

      <SaveBar dirty={dirty} pending={pending} result={result} onSave={save} />
    </>
  );
}
