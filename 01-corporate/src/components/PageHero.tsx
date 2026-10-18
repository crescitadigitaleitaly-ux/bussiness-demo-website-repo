export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="container-x pb-14 pt-16 sm:pt-24 lg:pb-20">
      <p className="eyebrow animate-[rise_.9s_var(--ease-out-expo)_both]">{eyebrow}</p>
      <h1 className="display mt-6 max-w-[16ch] text-[clamp(2.6rem,6.5vw,5.75rem)] animate-[rise_1s_.08s_var(--ease-out-expo)_both]">{title}</h1>
      {lead && <p className="lead mt-8 max-w-[58ch] animate-[rise_1s_.16s_var(--ease-out-expo)_both]">{lead}</p>}
      {children}
    </section>
  );
}
