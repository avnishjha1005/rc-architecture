import type { PortfolioProject } from "@/content/projects";
import styles from "@/app/projects/projects.module.css";

export function visibleProjectTags(category: string) {
  return category.split("·").map(tag => tag.trim()).filter(Boolean).slice(0, 3).join(" · ");
}

export function ProjectCategory({ category }: Pick<PortfolioProject, "category">) {
  return <span className={styles.projectCategory}>({category})</span>;
}
