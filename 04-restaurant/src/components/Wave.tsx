/** A single hand-drawn wave used as a section rule. Decorative. */
export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 16" preserveAspectRatio="none" className={`wave block h-4 w-full ${className}`} aria-hidden>
      <path pathLength={1} d="M0 8 C 20 0 30 0 50 8 S 80 16 100 8 S 130 0 150 8 S 180 16 200 8 S 230 0 250 8 S 280 16 300 8 S 330 0 350 8 S 380 16 400 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
