export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-ink">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-surface" />
        <circle cx="16" cy="19" r="6" className="fill-accent" />
        <path d="M16 5v4M6.1 9.1l2.8 2.8M25.9 9.1l-2.8 2.8M3 19h4M25 19h4" className="stroke-accent" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 25h20" className="stroke-ink" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[1.3rem] font-semibold leading-none tracking-[-0.04em]">
        Aurevo
        <span className="ml-1.5 hidden font-sans text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted sm:inline">Energia</span>
      </span>
    </span>
  );
}
