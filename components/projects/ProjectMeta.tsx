import type { PortfolioProject } from "@/content/projects";
import styles from "@/app/projects/projects.module.css";

export function ProjectCategory({ category }: Pick<PortfolioProject, "category">) {
  return <span className={styles.projectCategory}>({category})</span>;
}

export function ProjectMeta({
  project,
  variant = "grid",
}: {
  project: PortfolioProject;
  variant?: "featured" | "grid";
}) {
  if (variant === "featured") {
    return (
      <p className={styles.featuredMeta}>
        <ProjectCategory category={project.category} />
        <span>{project.year}</span>
      </p>
    );
  }

  return <p className={styles.cardMeta}>{project.location} · {project.year}</p>;
}
