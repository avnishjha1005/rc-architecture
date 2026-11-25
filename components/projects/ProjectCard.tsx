import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import type { ProjectItem } from "@/content/home";
import type { PortfolioProject } from "@/content/projects";
import styles from "@/app/projects/projects.module.css";
import relatedStyles from "./NextProjects.module.css";
import { ProjectCategory, visibleProjectTags } from "./ProjectMeta";
import { ProjectImage } from "./ProjectImage";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { legacyImage } from "@/lib/responsive-image";

export type ArchiveProject = PortfolioProject & { mobileArchiveImageUrl?: string };

type ProjectCardProps =
  | { project: ArchiveProject; variant?: "grid"; eager?: boolean }
  | { project: ArchiveProject; variant: "featured" | "related"; eager?: boolean; duplicate?: boolean }
  | { project: ProjectItem; variant: "home"; eager?: boolean };

export function ProjectCard(props: ProjectCardProps) {
  const category = visibleProjectTags(props.project.category);
  if (props.variant === "home") {
    const { project } = props;
    return (
      <article className="project-card" data-card>
        <Link className="project-card__image" href={project.href} aria-label={project.title}><ResponsiveImage image={project.image || legacyImage(project.imageUrl, project.imageAlt)} fill sizes="(max-width: 760px) calc(100vw - 40px), 32vw" /></Link>
        <p className="project-card__category">({category})</p>
        <div className="project-card__title"><h3>{project.title}</h3><Link href={project.href} aria-label={`View ${project.title}`}><Image className="project-card__arrow" src="/ArrowDiagonal.svg" alt="" width={12} height={12} /></Link></div>
      </article>
    );
  }

  if (props.variant === "related") {
    const { project } = props;
    return (
      <article className={relatedStyles.relatedCard} data-card>
        <Link className={relatedStyles.relatedImage} href={project.href}>
          <ResponsiveImage image={project.image || legacyImage(project.imageUrl, project.imageAlt)} fill quality={70} sizes="(max-width:760px) 78vw, 31vw" />
        </Link>
        <p>({category}) <span>{project.year}</span></p>
        <div>
          <h3><Link href={project.href}>{project.title}</Link></h3>
          <Link href={project.href} aria-label={`View ${project.title}`}><Image src="/ArrowDiagonal.svg" alt="" width={12} height={12} /></Link>
        </div>
      </article>
    );
  }

  if (props.variant === "featured") {
    const { project, eager = false } = props;
    return (
      <article className={`${styles.card} ${styles.featuredCard}`} data-card={props.duplicate ? undefined : ""}>
        <Link className={styles.featuredCardLink} href={project.href} tabIndex={props.duplicate ? -1 : undefined}>
          <div className={styles.featuredCardImage}>
            <ResponsiveImage
              image={project.image || legacyImage(project.imageUrl, project.imageAlt)}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 720px) 90vw, 24vw"
            />
          </div>
          <ProjectCategory category={category} />
          <h2>{project.featuredTitle ?? project.title}</h2>
        </Link>
      </article>
    );
  }

  const { project } = props;
  return (
    <article className={styles.card} data-card data-project-item={project.slug}>
      <Link className={styles.gridCardLink} href={project.href}>
        <div className={styles.cardImage}>
          <ProjectImage image={project.image || legacyImage(project.imageUrl, project.imageAlt)} mobileSrc={project.mobileArchiveImageUrl} fill sizes="(max-width: 760px) calc(100vw - 40px), 33vw" />
        </div>
        <div className={styles.cardTopline}>
          <ProjectCategory category={category} />
          <h3>{project.title}</h3>
        </div>
      </Link>
    </article>
  );
}
