import { Plus } from "lucide-react";

/** Native <details> accordion: keyboard and screen-reader support for free, works without JS. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="card divide-y divide-line">
      {items.map((it) => (
        <details key={it.q} className="group px-6 sm:px-8 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium">
            {it.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-open:rotate-45">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="-mt-2 max-w-prose pb-6 leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
