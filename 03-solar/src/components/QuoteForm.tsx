"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { RequestForm } from "./RequestForm";

/** Upper limit in euro of each bill range, in the same order as `form.bills`; the last range is open-ended. */
const billLimits = [80, 150, 300, 1000];

/** Pre-fills property type, battery interest and bill range when arriving from the savings calculator (?property=home&battery=yes&bill=150). */
export function QuoteForm(props: ComponentProps<typeof RequestForm>) {
  const q = useSearchParams();
  const { properties, batteryOptions, bills } = props.t;
  const property = { home: properties[0], business: properties[2] }[q.get("property") ?? ""];
  const battery = { yes: batteryOptions[0], no: batteryOptions[1] }[q.get("battery") ?? ""];
  const amount = Number(q.get("bill"));
  const billIndex = billLimits.findIndex((limit) => amount <= limit);
  const bill = amount > 0 ? bills[billIndex === -1 ? bills.length - 1 : billIndex] : undefined;
  return <RequestForm key={q.toString()} {...props} defaults={{ property, battery, bill }} />;
}
