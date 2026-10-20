import { Plus } from "lucide-react";

/** Native <details> accordion: keyboard and screen-reader support for free, works without JS. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => (
        <details key={it.q} className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium">
            {it.q}
            <Plus className="size-5 shrink-0 text-amber transition-transform duration-300 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="-mt-1 max-w-prose pb-6 leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
