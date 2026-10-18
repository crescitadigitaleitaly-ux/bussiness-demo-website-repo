import Image from "next/image";
import { Cpu, ShieldCheck } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "technology", dict.technology.meta.title, dict.technology.meta.description, "/images/tech-scan.jpg");
}

export default async function Technology() {
  const { locale, dict } = await getPage();
  const t = dict.technology;
  const [withImage, withoutImage] = [t.items.filter((i) => "image" in i && i.image), t.items.filter((i) => !("image" in i && i.image))];
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <div className="container-x space-y-6">
        {withImage.map((it, i) => (
          <Reveal key={it.title} className={`grid items-center gap-10 rounded-[2.5rem] bg-surface p-6 sm:p-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
              <Image src={"image" in it ? it.image! : ""} alt={it.title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">{it.title}</h2>
              <p className="lead mt-5">{it.text}</p>
            </div>
          </Reveal>
        ))}
        <div className="grid gap-6 md:grid-cols-2">
          {withoutImage.map((it, i) => {
            const Icon = i ? ShieldCheck : Cpu;
            return (
              <Reveal key={it.title} delay={i * 0.08} className="rounded-[2.5rem] bg-accent-deep p-10 text-white">
                <Icon className="size-8" aria-hidden />
                <h2 className="mt-8 font-serif text-3xl">{it.title}</h2>
                <p className="mt-3 text-lg leading-relaxed text-white/85">{it.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
