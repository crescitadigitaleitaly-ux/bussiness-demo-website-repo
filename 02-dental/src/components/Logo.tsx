export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${light ? "text-white" : "text-ink"}`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="16" className={light ? "fill-white" : "fill-accent-deep"} />
        <path
          d="M10 13c0-3 2.4-5 6-5s6 2 6 5c0 3-1.2 4.5-1.8 7.5-.4 2-1 3.5-2 3.5-1.4 0-1.3-4.5-2.2-4.5s-.8 4.5-2.2 4.5c-1 0-1.6-1.5-2-3.5C11.2 17.5 10 16 10 13Z"
          className={light ? "fill-accent-deep" : "fill-white"}
        />
      </svg>
      <span className="font-serif text-[1.45rem] leading-none tracking-[-0.01em]">
        Lumea{" "}
        <span className={`ml-0.5 hidden font-sans text-[0.68rem] font-medium uppercase tracking-[0.18em] sm:inline ${light ? "text-white/85" : "text-muted"}`}>Clinica Dentale</span>
      </span>
    </span>
  );
}
