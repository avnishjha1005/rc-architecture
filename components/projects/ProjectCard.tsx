import Image from "next/image";
import Link from "next/link";
import type { ProjectItem } from "@/content/home";
import type { PortfolioProject } from "@/content/projects";
import styles from "@/app/projects/projects.module.css";
import relatedStyles from "./NextProjects.module.css";
import { ProjectCategory, ProjectMeta } from "./ProjectMeta";

type ProjectCardProps =
  | { project: PortfolioProject; variant?: "grid"; eager?: boolean }
  | { project: PortfolioProject; variant: "featured" | "related"; eager?: boolean }
  | { project: ProjectItem; variant: "home"; eager?: boolean };

export function ProjectCard(props: ProjectCardProps) {
  if (props.variant === "home") {
    const { project } = props;
    return (
      <article className="project-card">
        <span className="project-card__year">{project.year}</span>
        <Link className="project-card__image" href={project.href}><Image src={project.imageUrl} alt={project.imageAlt} fill sizes="(max-width: 760px) 100vw, 40vw" /></Link>
        <p className="project-card__category">({project.category})</p>
        <div className="project-card__title"><h3>{project.title}</h3><Link href={project.href} aria-label={`View ${project.title}`}><Image className="project-card__arrow" src="/ArrowDiagonal.svg" alt="" width={12} height={12} /></Link></div>
      </article>
    );
  }

  if (props.variant === "related") {
    const { project } = props;
    return (
      <article className={relatedStyles.relatedCard}>
        <Link className={relatedStyles.relatedImage} href={project.href}>
          <Image src={project.imageUrl} alt={project.imageAlt} fill sizes="(max-width:760px) 78vw, 31vw" />
        </Link>
        <p>({project.category}) <span>{project.year}</span></p>
        <div>
          <h3><Link href={project.href}>{project.title}</Link></h3>
          <Link href={project.href} aria-label={`View ${project.title}`}>↗</Link>
        </div>
      </article>
    );
  }

  if (props.variant === "featured") {
    const { project, eager = false } = props;
    return (
      <article className={`${styles.card} ${styles.featuredCard}`}>
        <Link className={styles.featuredCardLink} href={project.href}>
          <div className={styles.featuredCardImage}>
            <Image
              src={project.imageUrl}
              alt={project.imageAlt}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 720px) 90vw, 24vw"
            />
          </div>
          <ProjectMeta project={project} variant="featured" />
          <h2>{project.featuredTitle ?? project.title}</h2>
        </Link>
      </article>
    );
  }

  const { project } = props;
  return (
    <article className={styles.card}>
      <Link className={styles.gridCardLink} href={project.href}>
        <div className={styles.cardImage}>
          <Image src={project.imageUrl} alt={project.imageAlt} fill sizes="(max-width: 720px) 100vw, 33vw" />
        </div>
        <div className={styles.cardTopline}>
          <p>{project.title}</p>
          <ProjectCategory category={project.category} />
        </div>
        <ProjectMeta project={project} />
      </Link>
    </article>
  );
}
