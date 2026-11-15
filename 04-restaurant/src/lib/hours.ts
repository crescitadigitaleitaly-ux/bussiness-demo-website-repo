import { openingHours as cmsHours } from "@/lib/cms/content";

// Opening hours in restaurant local time (Europe/Rome). Days: 0 = Sunday … 6 = Saturday.
// Edited in the admin panel (src/content/cms/hours.json).
const { days: OPEN_DAYS, slots: SLOTS } = cmsHours;

export const openingHours = cmsHours;

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** Weekday and minutes since midnight in Rome, whatever the visitor's own time zone. */
function romeClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type Status = { open: true; until: string } | { open: false; dayOffset: number; day: number; at: string };

export function getStatus(date: Date): Status {
  const { day, minutes } = romeClock(date);
  if (OPEN_DAYS.includes(day)) {
    for (const [from, to] of SLOTS) {
      if (minutes >= toMin(from) && minutes < toMin(to)) return { open: true, until: to };
      if (minutes < toMin(from)) return { open: false, dayOffset: 0, day, at: from };
    }
  }
  for (let offset = 1; offset <= 7; offset++) {
    const d = (day + offset) % 7;
    if (OPEN_DAYS.includes(d)) return { open: false, dayOffset: offset, day: d, at: SLOTS[0][0] };
  }
  throw new Error("No opening days configured");
}
