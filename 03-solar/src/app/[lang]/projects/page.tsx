import { getPage } from "@/lib/page";
import { pageMetadata } from "@/lib/i18n";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata() {
  const { locale, dict } = await getPage();
  return pageMetadata(locale, "projects", dict.projects.meta.title, dict.projects.meta.description, "/images/project-3.jpg");
}

export default async function Projects() {
  const { locale, dict } = await getPage();
  const t = dict.projects;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="container-x pb-8">
        <Reveal>
          <ProjectGallery t={t} locale={locale} heading="h2" />
        </Reveal>
        <p className="mt-8 text-xs text-muted">* {dict.common.fictionalProjects}</p>
      </section>
      <CtaBand locale={locale} t={dict.home.cta} phone={dict.brand.phone} />
    </>
  );
}
