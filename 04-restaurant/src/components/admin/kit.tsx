"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, Save, Trash2 } from "lucide-react";
import { saveContent, type SaveResult } from "@/lib/cms/actions";
import type { ContentKey } from "@/lib/cms/schema";

export type Bi = { it: string; en: string };

/** Holds the form state, knows when it has unsaved changes, and saves through the server action. */
export function useEditor<T>(key: ContentKey, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const dirty = JSON.stringify(data) !== saved;

  const update = (fn: (draft: T) => void) => {
    setResult(null);
    setData((d) => {
      const next = structuredClone(d);
      fn(next);
      return next;
    });
  };

  /** `prepare` can tidy the data (e.g. fill in generated fields) right before it is sent. */
  const save = (prepare?: (draft: T) => void) =>
    start(async () => {
      const payload = structuredClone(data);
      prepare?.(payload);
      setData(payload);
      const r = await saveContent(key, payload);
      setResult(r);
      if (r.ok) {
        setSaved(JSON.stringify(payload));
        router.refresh();
      }
    });

  return { data, update, save, dirty, pending, result };
}

export function SaveBar({ dirty, pending, result, onSave }: { dirty: boolean; pending: boolean; result: SaveResult | null; onSave: () => void }) {
  return (
    <div className="sticky bottom-4 z-10 mt-10 rounded-xl border border-line bg-surface/95 px-5 py-3 shadow-[0_20px_50px_-30px_rgb(15_42_58/0.55)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite" className="text-sm">
          {result?.ok ? (
            <span className="inline-flex items-center gap-2 font-medium text-emerald-700">
              <Check className="size-4" aria-hidden />
              {result.live === "now" ? "Saved. The website is updated." : "Saved. The website updates in about 2 minutes."}
            </span>
          ) : result && !result.ok ? (
            <span className="block text-red-800">
              <strong className="font-semibold">Not saved. Please check:</strong>
              <ul className="mt-1 list-disc pl-5">{result.errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </span>
          ) : dirty ? (
            <span className="font-medium text-amber">You have unsaved changes</span>
          ) : (
            <span className="text-muted">No changes yet</span>
          )}
        </div>
        <button type="button" onClick={() => onSave()} disabled={!dirty || pending} className="admin-btn-primary">
          <Save className="size-4" aria-hidden />
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

/** Two inputs side by side: Italian and English. */
export function BiField({ label, value, onChange, multiline, max, placeholder }: { label: string; value: Bi; onChange: (v: Bi) => void; multiline?: boolean; max: number; placeholder?: Bi }) {
  const Input = multiline ? "textarea" : "input";
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["it", "en"] as const).map((l) => (
          <label key={l} className="relative block">
            <span className="pointer-events-none absolute top-2.5 left-3 text-[0.65rem] font-bold tracking-wider text-muted">{l === "it" ? "IT" : "EN"}</span>
            <Input
              value={value[l]}
              maxLength={max}
              rows={multiline ? 3 : undefined}
              placeholder={placeholder?.[l]}
              aria-label={`${label} (${l === "it" ? "Italian" : "English"})`}
              onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              className="admin-input pl-10"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Switch({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <span>
        <span className="block font-medium">{label}</span>
        {description && <span className="block text-sm text-muted">{description}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-ink/20 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-ink after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

/** Move up / move down / delete buttons for a row in a list. */
export function RowTools({ index, count, onMove, onRemove, label }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <button type="button" className="admin-icon-btn" disabled={index === 0} onClick={() => onMove(index - 1)} aria-label={`Move ${label} up`}><ArrowUp className="size-4" aria-hidden /></button>
      <button type="button" className="admin-icon-btn" disabled={index === count - 1} onClick={() => onMove(index + 1)} aria-label={`Move ${label} down`}><ArrowDown className="size-4" aria-hidden /></button>
      <button type="button" className="admin-icon-btn hover:bg-red-50 hover:text-red-700" onClick={onRemove} aria-label={`Delete ${label}`}><Trash2 className="size-4" aria-hidden /></button>
    </div>
  );
}

export function move<T>(list: T[], from: number, to: number) {
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

/** Accepts "9,50" as well as "9.50" while typing; the server normalises it. */
export function PriceInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-muted">€</span>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} placeholder="0.00" className="admin-input pl-8 tabular" maxLength={8} />
    </span>
  );
}
