/** Lantern mark + wordmark. `tone` switches between the light (default) and dark backgrounds. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const ink = tone === "dark" ? "text-ink" : "text-mist";
  return (
    <span className={`flex items-center gap-2.5 ${ink}`}>
      <svg viewBox="0 0 28 32" className="h-8 w-7" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M10 4h8l1 3H9l1-3Z" />
        <path d="M9 7h10l-1.2 15H10.2L9 7Z" />
        <path d="M9.6 14.5h8.8" />
        <path d="M7 22h14l-2 6H9l-2-6Z" />
        <circle cx="14" cy="11" r="1.6" className="fill-sun stroke-sun" />
        <path d="M2 11h3M23 11h3M4 6.5l2.2 1.4M24 6.5l-2.2 1.4" className="stroke-sun" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[1.6rem] leading-none tracking-[0.01em]">Lanterna</span>
    </span>
  );
}
