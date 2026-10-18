import { BatteryCharging, House, SolarPanel, Sun, UtilityPole } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

// Node positions as % of the 400×300 diagram; paths below use the same coordinates.
const nodes = [
  { key: "sun", Icon: Sun, x: 50, y: 12 },
  { key: "panels", Icon: SolarPanel, x: 50, y: 42 },
  { key: "home", Icon: House, x: 16, y: 80 },
  { key: "battery", Icon: BatteryCharging, x: 50, y: 80 },
  { key: "grid", Icon: UtilityPole, x: 84, y: 80 },
] as const;

const paths = [
  "M200 36 V126",
  "M200 126 C200 185 64 175 64 240",
  "M200 126 V240",
  "M200 126 C200 185 336 175 336 240",
  "M200 240 H64",
];

/** Animated diagram of energy moving from the sun to home, battery and grid. Decorative; the text alongside explains it. */
export function EnergyFlow({ labels }: { labels: Dictionary["home"]["battery"]["flow"] }) {
  return (
    <div className="card relative aspect-[4/3] w-full overflow-hidden">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute left-1/2 top-[12%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-2xl animate-[pulse-glow_4s_ease-in-out_infinite]" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" fill="none" aria-hidden>
        {paths.map((d) => (
          <g key={d}>
            <path d={d} stroke="rgb(245 247 248 / 0.12)" strokeWidth="2" />
            <path d={d} className="flow" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      {nodes.map(({ key, Icon, x, y }) => (
        <div key={key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
          <span className={`grid size-11 place-items-center rounded-2xl border sm:size-14 ${key === "sun" ? "border-accent/50 bg-accent text-paper" : "border-line bg-raised text-accent"}`}>
            <Icon className="size-5 sm:size-6" aria-hidden />
          </span>
          <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper/80 px-2 text-xs font-medium text-ink">{labels[key]}</span>
        </div>
      ))}
    </div>
  );
}
