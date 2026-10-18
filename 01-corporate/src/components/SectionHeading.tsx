import { Reveal } from "./Reveal";

export function SectionHeading({ eyebrow, title, lead, className = "" }: { eyebrow: string; title: string; lead?: string; className?: string }) {
  return (
    <Reveal className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-5 max-w-[20ch] text-[clamp(2rem,4.4vw,3.75rem)]">{title}</h2>
      {lead && <p className="lead mt-6 max-w-[52ch]">{lead}</p>}
    </Reveal>
  );
}
