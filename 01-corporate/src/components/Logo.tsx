export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${light ? "text-white" : "text-ink"}`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="9" className={light ? "fill-white" : "fill-ink"} />
        <path d="M9 23 16 9l7 14" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={light ? "stroke-ink" : "stroke-white"} />
        <path d="M12 18.5h10.5" strokeWidth="2.2" strokeLinecap="round" className="stroke-[#7fa6cc]" />
      </svg>
      <span className="text-[1.15rem] font-semibold tracking-[-0.03em]">
        Arvenis<span className="font-serif text-[1.2rem] font-normal italic tracking-normal opacity-70"> Group</span>
      </span>
    </span>
  );
}
