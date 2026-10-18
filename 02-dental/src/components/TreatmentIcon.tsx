import { AlignHorizontalSpaceAround, Anchor, Droplet, ShieldPlus, Smile, Sparkles, type LucideProps } from "lucide-react";

const icons = { anchor: Anchor, align: AlignHorizontalSpaceAround, droplet: Droplet, sparkles: Sparkles, shield: ShieldPlus, smile: Smile };

export function TreatmentIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? Smile;
  return <Icon aria-hidden {...props} />;
}
