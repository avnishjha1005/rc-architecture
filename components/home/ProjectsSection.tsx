import type { HomeContent } from "@/content/home";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection({ content }: { content: HomeContent["projects"] }) {
  return (
    <section className="projects-section light-section" id="projects">
      <Reveal className="section-shell projects-intro"><SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} /><CtaLink link={content.cta} /></Reveal>
      <div className="project-grid section-shell">
        {content.items.map((project, index) => (
          <Reveal key={project.title} delay={(index % 2) * 90}>
            <ProjectCard project={project} variant="home" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
