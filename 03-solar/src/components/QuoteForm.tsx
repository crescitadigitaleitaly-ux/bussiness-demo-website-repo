"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { RequestForm } from "./RequestForm";

/** Pre-fills property type and battery interest when arriving from the savings calculator (?property=home&battery=yes). */
export function QuoteForm(props: ComponentProps<typeof RequestForm>) {
  const q = useSearchParams();
  const { properties, batteryOptions } = props.t;
  const property = { home: properties[0], business: properties[2] }[q.get("property") ?? ""];
  const battery = { yes: batteryOptions[0], no: batteryOptions[1] }[q.get("battery") ?? ""];
  return <RequestForm key={q.toString()} {...props} defaults={{ property, battery }} />;
}
