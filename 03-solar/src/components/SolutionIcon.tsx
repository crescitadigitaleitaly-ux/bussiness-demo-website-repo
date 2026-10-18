import { BatteryCharging, Building2, House, PlugZap } from "lucide-react";

const icons = { home: House, building: Building2, battery: BatteryCharging, plug: PlugZap };

export function SolutionIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? House;
  return <Icon className={className} aria-hidden />;
}
