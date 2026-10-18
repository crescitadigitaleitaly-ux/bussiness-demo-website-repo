import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "team", dict.team.meta.title, dict.team.meta.description);
}

export default async function Team() {
  const { locale, dict } = await getPage();
  const t = dict.team;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x">
        <RevealGroup as="ul" className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {t.members.map((m) => (
            <RevealItem as="li" key={m.name} className="group">
              <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-mist">
                <Image src={m.image} alt={`${m.name}, ${m.role}`} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover grayscale-[35%] transition-[filter] duration-700 group-hover:grayscale-0" />
              </div>
              <h2 className="mt-5 text-lg font-medium tracking-tight sm:text-xl">{m.name}</h2>
              <p className="mt-1 text-sm text-muted">{m.role} · {m.area}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-8 text-xs text-muted">* {dict.common.demoProfiles}</p>
      </section>
      <section className="container-x py-24 sm:py-32">
        <Reveal className="grid gap-8 rounded-[1.75rem] bg-surface p-8 sm:p-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h2 className="display text-[clamp(1.9rem,3.6vw,3rem)]">{t.joinTitle}</h2>
            <p className="lead mt-4">{t.joinText}</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link href={`/${locale}/contact`} className="btn-primary group">
              {t.joinCta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
