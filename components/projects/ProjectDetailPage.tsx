import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/site/Footer";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FeaturedProjectGrid, getFeaturedProjectSelection } from "@/components/projects/FeaturedProjectGrid";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectImage } from "@/components/projects/ProjectImage";
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
      <section className={styles.hero} data-motion-group="hero">
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" />
        <div className={styles.heroTitle} data-motion-item>
          <p>({project.eyebrow})</p>
          <h1>{project.title}</h1>
        </div>
        <div className={styles.heroImage} data-motion-image data-motion-parallax>
          <ProjectImage image={project.heroImage} mobileSrc={project.mobileHeroUrl} mobileSizes="100vw" fill loading="eager" sizes="(max-width:760px) 100vw, calc(100vw - 40px)" />
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
            <div className={styles.sectionImage} data-motion-image>
              <ProjectImage image={section.image} mobileSrc={section.mobileImageUrl} fill quality={70} sizes="calc(100vw - 40px)" />
            </div>
            <div className={styles.sectionCopy}>
              <h2>{section.title}</h2>
              {section.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </Reveal>
        ))}

        {project.gallery.length > 0 && (
          <Reveal><ProjectGallery images={project.gallery} title={project.title} /></Reveal>
        )}
      </article>

      <FeaturedProjectGrid projects={project.slug === "ge-digital" ? getFeaturedProjectSelection(related) : related} />

      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={footer} sectionId="contact" />
    </main>
  );
}
