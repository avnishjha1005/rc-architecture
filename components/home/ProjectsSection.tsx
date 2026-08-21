import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ProjectsSection({ content }: { content: HomeContent["projects"] }) {
  return (
    <section className="projects-section light-section" id="projects">
      <Reveal className="section-shell projects-intro"><SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} /><CtaLink link={content.cta} /></Reveal>
      <div className="project-grid section-shell">
        {content.items.map((project, index) => (
          <Reveal className="project-card" key={project.title} delay={(index % 2) * 90}>
            <span className="project-card__year">{project.year}</span>
            <Link className="project-card__image" href={project.href}><Image src={project.imageUrl} alt={project.imageAlt} fill sizes="(max-width: 760px) 100vw, 40vw" /></Link>
            <p className="project-card__category">({project.category})</p>
            <div className="project-card__title"><h3>{project.title}</h3><Link href={project.href} aria-label={`View ${project.title}`}>↗</Link></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
