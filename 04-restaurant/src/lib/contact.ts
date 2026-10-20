// ponytail: placeholder number from env until the client supplies an approved one.
const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "390000000000").replace(/\D/g, "");

export const whatsappUrl = (message: string) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

// Demo: TheFork home page. On a real site, the restaurant's own TheFork page.
export const theForkUrl = process.env.NEXT_PUBLIC_THEFORK_URL ?? "https://www.thefork.it/";

export const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
