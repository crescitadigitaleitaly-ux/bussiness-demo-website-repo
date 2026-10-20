"use client";

import { useSyncExternalStore } from "react";
import { getStatus } from "@/lib/hours";
import type { Dictionary } from "@/lib/i18n";

// A clock that ticks once a minute. On the server (and during hydration) it reads null,
// so the badge shows the neutral label first and the live status right after.
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);

export function OpenStatus({ t, className = "" }: { t: Dictionary["common"]; className?: string }) {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => null);
  if (minute === null) return <span className={className}>{t.hoursLabel}</span>;

  const s = getStatus(new Date(minute * 60_000));
  const when = s.open ? "" : s.dayOffset === 0 ? t.today : s.dayOffset === 1 ? t.tomorrow : `${t.on} ${t.weekdays[s.day]}`.trim();
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className={`size-2 rounded-full ${s.open ? "bg-emerald-600 shadow-[0_0_0_4px_rgb(5_150_105/0.18)]" : "bg-muted/60"}`} />
      {s.open ? `${t.open} · ${t.until} ${s.until}` : `${t.closed} · ${t.reopens} ${when} ${s.at}`}
    </span>
  );
}
