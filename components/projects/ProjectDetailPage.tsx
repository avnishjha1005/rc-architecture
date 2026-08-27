import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/home/Footer";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/ui/Reveal";
import { fallbackHomeContent } from "@/content/home";
import type { ProjectDetail } from "@/content/projectDetails";
import { portfolioProjects, projectNavigation } from "@/content/projects";
import styles from "@/app/projects/[slug]/project-detail.module.css";

export function ProjectDetailPage({ project }: { project: ProjectDetail }) {
  const related = portfolioProjects.slice(1, 4);
  const contact = {
    ...fallbackHomeContent.contact,
    title: "Get in touch\nwith us for projects.",
    imageUrl: "/images/home/project-ge-digital.jpg",
    imageAlt: "GE Digital workplace corridor",
  };
  const footer = { ...fallbackHomeContent.footer, navigation: projectNavigation };

  return (
    <main className={styles.page} id="top">
      <section className={styles.hero}>
        <Header brandName="RC Architecture" navigation={projectNavigation} cta={{ label: "Get in touch", href: "#contact" }} theme="light" />
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
            <p>Inspired by urban spaces and grouped activities, we design workplace experiences that spark creativity, enable learning, and drive performance.</p>
          </div>
          <dl>{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        </Reveal>

        {project.sections.map((section) => (
          <Reveal className={`${styles.section} ${styles[section.layout]}`} key={section.title}>
            <div className={styles.sectionImage}><Image src={section.imageUrl} alt={section.imageAlt} fill sizes="(max-width: 760px) 100vw, 72vw" /></div>
            <div className={styles.sectionCopy}><h2>{section.title}</h2><p>{section.body}</p></div>
          </Reveal>
        ))}

        <Reveal className={styles.gallery}>
          <div className={styles.galleryRail}>{project.gallery.map((image, index) => <div key={image.imageUrl + index}><Image src={image.imageUrl} alt={image.imageAlt} fill sizes="70vw" /></div>)}</div>
          <div className={styles.progress}><span /></div>
        </Reveal>
      </article>

      <section className={styles.nextProjects}>
        <div className={styles.nextHeading}>
          <p>(Featured projects)</p>
          <div><h2>Next Projects.</h2><Link href="/projects">Back to all projects <span>→</span></Link></div>
        </div>
        <div className={styles.relatedGrid}>
          {related.map((item) => (
            <article key={item.id}>
              <Link className={styles.relatedImage} href="/projects"><Image src={item.imageUrl} alt={item.imageAlt} fill sizes="(max-width:760px) 100vw, 31vw" /></Link>
              <p>({item.category}) <span>{item.year}</span></p>
              <div><h3>{item.title}</h3><Link href="/projects" aria-label={`View ${item.title}`}>↗</Link></div>
            </article>
          ))}
        </div>
      </section>

      <ContactSection content={contact} />
      <NewsletterSection content={fallbackHomeContent.newsletter} />
      <Footer content={footer} />
    </main>
  );
}
