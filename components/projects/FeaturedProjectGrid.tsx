import type { HomeContent } from "@/content/home";
import type { PortfolioProject } from "@/content/projects";
import { featuredProjectSlugs } from "@/content/featured-projects.mjs";
import { PillAction } from "@/components/ui/PillAction";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import styles from "./FeaturedProjectGrid.module.css";

export function getFeaturedProjectSelection(projects: PortfolioProject[]) {
  const selected = featuredProjectSlugs.flatMap(slug =>
    projects.find(project => project.slug === slug) ?? []
  );
  return [...selected, ...projects.filter(project => !selected.includes(project))].slice(0, 4);
}

type FeaturedProps = { projects: PortfolioProject[] } | { content: HomeContent["projects"] };

export function FeaturedProjectGrid(props: FeaturedProps) {
  const content = "content" in props ? { ...props.content, items: props.content.items.slice(0, 4) } : {
    eyebrow: "Featured projects", title: "Spaces We’ve\nShaped",
    intro: "Explore our services and see how we bring creativity and expertise to every project.",
    cta: { label: "View all projects", href: "/projects" }, items: props.projects,
  };
  if (!content.items.length) return null;
  return (
    <section id="projects" className={styles.section}>
      <Reveal className={styles.intro}>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
        <PillAction className={styles.cta} href={content.cta.href}>
          <span className={styles.wideLabel}>{content.cta.label}</span>
          <span className={styles.smallLabel}>{content.cta.href === "/projects" ? "Know more" : content.cta.label}</span>
        </PillAction>
      </Reveal>
      <div className={styles.grid} data-card-group>
        {content.items.map(project => <Reveal key={project.href}><ProjectCard project={project} variant="home" /></Reveal>)}
      </div>
    </section>
  );
}
