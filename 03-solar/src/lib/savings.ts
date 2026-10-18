// Illustrative savings model. Every figure below is an assumption, listed in full on the
// Energy Savings page; results are non-binding and never a guarantee.
export const assumptions = {
  price: 0.3, // €/kWh paid for electricity from the grid
  exportValue: 0.08, // €/kWh credited for surplus energy fed into the grid
  yieldPerKwp: 1300, // kWh produced per installed kWp per year (northern/central Italy, good orientation)
  selfUse: 0.35, // share of production used on site without a battery
  selfUseBattery: 0.65, // ...and with a battery
  costPerKwp: { home: 1700, business: 1200 }, // € per kWp installed, VAT and incentives excluded
  costPerKwh: 650, // € per kWh of battery capacity
  batteryRatio: 1.2, // kWh of storage per kWp
  co2: 0.25, // kg CO₂ avoided per kWh produced
  spread: 0.15, // ± range shown around the central estimate
  maxKwp: { home: 12, business: 400 },
};

export type PropertyKind = "home" | "business";

export function estimate(monthlyBill: number, kind: PropertyKind, battery: boolean) {
  const a = assumptions;
  const consumption = (monthlyBill * 12) / a.price;
  // Size the system to cover roughly the yearly consumption, in 0.5 kWp steps.
  const kwp = Math.min(Math.max(Math.round((consumption / a.yieldPerKwp) * 2) / 2, 2), a.maxKwp[kind]);
  const production = kwp * a.yieldPerKwp;
  const selfUsed = Math.min(production * (battery ? a.selfUseBattery : a.selfUse), consumption);
  const savings = selfUsed * a.price + (production - selfUsed) * a.exportValue;
  const batteryKwh = battery ? Math.round(kwp * a.batteryRatio) : 0;
  const cost = kwp * a.costPerKwp[kind] + batteryKwh * a.costPerKwh;
  return {
    kwp,
    production,
    batteryKwh,
    savings: [savings * (1 - a.spread), savings * (1 + a.spread)] as const,
    payback: [cost / (savings * (1 + a.spread)), cost / (savings * (1 - a.spread))] as const,
    co2: (production * a.co2) / 1000,
  };
}
