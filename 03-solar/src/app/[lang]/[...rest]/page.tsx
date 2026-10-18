import { notFound } from "next/navigation";

// Unknown URLs under /it or /en render the localized not-found page.
export function generateStaticParams() {
  return [{ rest: ["404"] }];
}

export default function CatchAll() {
  notFound();
}
