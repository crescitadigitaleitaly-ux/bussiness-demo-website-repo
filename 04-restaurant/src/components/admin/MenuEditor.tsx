"use client";

import { ChevronDown, Plus } from "lucide-react";
import type { MenuData } from "@/lib/cms/schema";
import { BiField, Field, PriceInput, RowTools, SaveBar, move, useEditor } from "./kit";

const ALLERGENS = ["Gluten", "Crustaceans", "Eggs", "Fish", "Peanuts", "Soy", "Milk", "Nuts", "Celery", "Mustard", "Sesame", "Sulphites", "Lupin", "Molluscs"];
const TAGS = [
  { id: "raw", label: "Raw (crudo)" },
  { id: "gf", label: "Gluten-free" },
  { id: "veg", label: "Vegetarian" },
] as const;

type Dish = MenuData["sections"][number]["items"][number];
const emptyDish = (): Dish => ({ name: { it: "", en: "" }, desc: { it: "", en: "" }, price: "", unit: "", allergens: [], tags: [] });

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);

export function MenuEditor({ initial }: { initial: MenuData }) {
  const { data, update, save, dirty, pending, result } = useEditor("menu", initial);

  return (
    <>
      <div className="space-y-4">
        {data.sections.map((s, si) => (
          <details key={si} className="group admin-card p-0 sm:p-0" open={si === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-lg font-semibold">{s.title.en || s.title.it || "New section"}</span>
                <span className="text-sm text-muted">{s.items.length} {s.items.length === 1 ? "dish" : "dishes"}</span>
              </span>
              <ChevronDown className="size-5 text-muted transition-transform group-open:rotate-180" aria-hidden />
            </summary>

            <div className="space-y-5 border-t border-line px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">Section {si + 1} of {data.sections.length}</p>
                <RowTools
                  index={si}
                  count={data.sections.length}
                  label={`section ${s.title.en || si + 1}`}
                  onMove={(to) => update((d) => move(d.sections, si, to))}
                  onRemove={() => {
                    if (window.confirm(`Delete the section “${s.title.en || s.title.it}” and its ${s.items.length} dishes?`)) update((d) => { d.sections.splice(si, 1); });
                  }}
                />
              </div>
              <BiField label="Section title" max={40} value={s.title} onChange={(v) => update((d) => { d.sections[si].title = v; })} />
              <BiField label="Short note under the title (optional)" max={140} value={s.note} onChange={(v) => update((d) => { d.sections[si].note = v; })} />

              <ol className="space-y-4">
                {s.items.map((dish, di) => (
                  <li key={di} className="rounded-lg border border-line bg-white p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{dish.name.en || dish.name.it || "New dish"}</h3>
                      <RowTools index={di} count={s.items.length} label={`dish ${dish.name.en || di + 1}`} onMove={(to) => update((d) => move(d.sections[si].items, di, to))} onRemove={() => update((d) => { d.sections[si].items.splice(di, 1); })} />
                    </div>
                    <div className="grid gap-4">
                      <BiField label="Dish name" max={80} value={dish.name} onChange={(v) => update((d) => { d.sections[si].items[di].name = v; })} />
                      <BiField label="Description (optional)" max={160} value={dish.desc} onChange={(v) => update((d) => { d.sections[si].items[di].desc = v; })} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Price">
                          <PriceInput label={`Price of ${dish.name.en || "dish"}`} value={dish.price} onChange={(v) => update((d) => { d.sections[si].items[di].price = v; })} />
                        </Field>
                        <Field label="Price is">
                          <select value={dish.unit} onChange={(e) => update((d) => { d.sections[si].items[di].unit = e.target.value as Dish["unit"]; })} className="admin-input">
                            <option value="">for the dish</option>
                            <option value="each">per piece</option>
                            <option value="hg">per 100 g (by weight)</option>
                          </select>
                        </Field>
                      </div>
                      <fieldset>
                        <legend className="mb-1.5 text-sm font-medium">Labels</legend>
                        <div className="flex flex-wrap gap-2">
                          {TAGS.map((t) => (
                            <Chip key={t.id} on={dish.tags.includes(t.id)} onToggle={(on) => update((d) => { const tags = d.sections[si].items[di].tags; d.sections[si].items[di].tags = on ? [...tags, t.id] : tags.filter((x) => x !== t.id); })}>{t.label}</Chip>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="mb-1.5 text-sm font-medium">Allergens in this dish</legend>
                        <div className="flex flex-wrap gap-2">
                          {ALLERGENS.map((name, ai) => {
                            const n = ai + 1;
                            return (
                              <Chip key={n} on={dish.allergens.includes(n)} onToggle={(on) => update((d) => { const a = d.sections[si].items[di].allergens; d.sections[si].items[di].allergens = on ? [...a, n].sort((x, y) => x - y) : a.filter((x) => x !== n); })}>
                                <span className="tabular opacity-60">{n}</span> {name}
                              </Chip>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  </li>
                ))}
              </ol>
              <button type="button" className="admin-btn" disabled={s.items.length >= 60} onClick={() => update((d) => { d.sections[si].items.push(emptyDish()); })}>
                <Plus className="size-4" aria-hidden /> Add a dish to {s.title.en || "this section"}
              </button>
            </div>
          </details>
        ))}
      </div>

      <button
        type="button"
        className="admin-btn mt-4"
        disabled={data.sections.length >= 12}
        onClick={() =>
          update((d) => {
            let id = "section";
            for (let n = 2; d.sections.some((x) => x.id === id); n++) id = `section-${n}`;
            d.sections.push({ id, title: { it: "", en: "" }, note: { it: "", en: "" }, items: [emptyDish()] });
          })
        }
      >
        <Plus className="size-4" aria-hidden /> Add a section
      </button>

      <SaveBar
        dirty={dirty}
        pending={pending}
        result={result}
        onSave={() =>
          // New sections get a readable web address (#starters) from their English title.
          save((d) => {
            for (const s of d.sections) if (/^section(-\d+)?$/.test(s.id) && s.title.en) {
              const base = slug(s.title.en);
              if (base.length < 2) continue;
              let id = base;
              for (let n = 2; d.sections.some((x) => x !== s && x.id === id); n++) id = `${base}-${n}`;
              s.id = id;
            }
          })
        }
      />
    </>
  );
}

function Chip({ on, onToggle, children }: { on: boolean; onToggle: (on: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onToggle(!on)}
      className="min-h-9 rounded-full border border-ink/20 bg-white px-3 text-sm text-muted transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-mist"
    >
      {children}
    </button>
  );
}
