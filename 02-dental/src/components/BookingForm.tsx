"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { RequestForm } from "./RequestForm";

/** Pre-selects the treatment when arriving from a treatment page (?treatment=<slug>). */
export function BookingForm({ slugs, ...props }: ComponentProps<typeof RequestForm> & { slugs: Record<string, string> }) {
  const slug = useSearchParams().get("treatment") ?? "";
  return <RequestForm key={slug} {...props} defaultTreatment={slugs[slug] ?? ""} />;
}
