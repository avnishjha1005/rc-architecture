import Image from "next/image";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/site/Footer";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NextProjects } from "@/components/projects/NextProjects";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/ui/Reveal";
import type { ProjectDetail } from "@/content/projectDetails";
import type { PortfolioProject } from "@/content/projects";
import { siteFooter, type SiteData } from "@/content/site";
import styles from "@/app/projects/[slug]/project-detail.module.css";

export function ProjectDetailPage({ project, related, site }: { project: ProjectDetail; related: PortfolioProject[]; site: SiteData }) {
  const footer = siteFooter(site);

  return (
    <main className={styles.page} id="top">
      <section className={styles.hero}>
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" />
        <div className={styles.heroTitle}>
          <p>({project.eyebrow})</p>
          <h1>{project.title}</h1>
        </div>
        <div className={styles.heroImage}>
          <Image src={project.heroImageUrl} alt={project.heroImageAlt} fill loading="eager" sizes="100vw" />
        </div>
      </section>

      <article className={styles.story}>
        <Reveal className={styles.intro}>
          <div>
            <h2>{project.summary}</h2>
            <p>{project.introduction}</p>
          </div>
          <dl>{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        </Reveal>

        {project.sections.map((section) => (
          <Reveal className={`${styles.section} ${styles[section.layout]}`} key={section.title}>
            <div className={styles.sectionImage}><Image src={section.imageUrl} alt={section.imageAlt} fill sizes="(max-width: 760px) 100vw, 72vw" /></div>
            <div className={styles.sectionCopy}><h2>{section.title}</h2><p>{section.body}</p></div>
          </Reveal>
        ))}

        {project.gallery.length > 0 && (
          <Reveal><ProjectGallery images={project.gallery} title={project.title} /></Reveal>
        )}
      </article>

      <NextProjects projects={related} />

      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={footer} sectionId="contact" />
    </main>
  );
}
