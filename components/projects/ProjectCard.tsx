import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/content/projects";
import styles from "@/app/projects/projects.module.css";

export function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className={styles.card}>
      <Link className={styles.cardImage} href={project.href}>
        <Image src={project.imageUrl} alt={project.imageAlt} fill sizes="(max-width: 720px) 100vw, 33vw" />
      </Link>
      <div className={styles.cardTopline}>
        <p>{project.title}</p>
        <span>({project.category})</span>
      </div>
      <p className={styles.cardMeta}>{project.location} · {project.year}</p>
    </article>
  );
}
