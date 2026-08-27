import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/site/Header";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { fallbackHomeContent } from "@/content/home";
import { portfolioProjects, projectNavigation } from "@/content/projects";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects — RC Architecture",
  description: "Explore RC Architecture's latest architecture and interior design projects.",
};

export default function ProjectsPage() {
  const featured = portfolioProjects.slice(0, 5);
  const footer = { ...fallbackHomeContent.footer, navigation: projectNavigation };

  return (
    <main className={styles.page}>
      <section className={styles.featured}>
        <Header brandName="RC Architecture" navigation={projectNavigation} cta={{ label: "Get in touch", href: "#contact" }} theme="light" />
        <div className={styles.featuredIntro}>
          <h1>Featured<br />Work</h1>
          <div><p>Explore our services and see how we bring creativity and expertise to every project.</p><small>1999–2023</small></div>
        </div>
        <div className={styles.featuredRail}>
          {featured.map((project, index) => (
            <article key={project.id} className={styles.featuredCard}>
              <div><Image src={project.imageUrl} alt={project.imageAlt} fill loading={index === 0 ? "eager" : "lazy"} sizes="(max-width: 720px) 90vw, 24vw" /></div>
              <p>({project.category}) <span>{project.year}</span></p>
              <h2>{project.title}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.archive}>
        <div className={styles.archiveHeading}>
          <p>(All projects)</p>
          <h2>Our Latest<br />Projects.</h2>
          <span>Explore our services and see how we bring creativity and expertise to every project.</span>
        </div>
        <ProjectsGallery projects={portfolioProjects} />
      </section>
      <div id="contact"><Footer content={footer} /></div>
    </main>
  );
}
