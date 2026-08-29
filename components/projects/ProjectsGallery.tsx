"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioProject } from "@/content/projects";
import { PillAction } from "@/components/ui/PillAction";
import { ProjectCard } from "./ProjectCard";
import { ProjectCategory } from "./ProjectMeta";
import styles from "@/app/projects/projects.module.css";

type View = "image" | "list";
type Filter = "All Projects" | "Architecture" | "Interior Design";
const PAGE_SIZE = 6;

export function ProjectsGallery({ projects, loadMoreLabel = "Load more" }: { projects: PortfolioProject[]; loadMoreLabel?: string }) {
  const [view, setView] = useState<View>("image");
  const [filter, setFilter] = useState<Filter>("All Projects");
  const [page, setPage] = useState(1);
  const [hovered, setHovered] = useState<PortfolioProject | null>(null);
  const filtered = useMemo(() => filter === "All Projects" ? projects : projects.filter((project) => project.type === filter), [filter, projects]);
  const visibleProjects = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visibleProjects.length < filtered.length;

  function changeFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    setPage(1);
    setHovered(null);
  }

  return (
    <section className={styles.gallery} aria-label="Project archive">
      <div className={styles.controls}>
        <div className={styles.filters} aria-label="Filter projects">
          {(["All Projects", "Architecture", "Interior Design"] as Filter[]).map((item) => (
            <button className={filter === item ? styles.activeFilter : ""} type="button" aria-pressed={filter === item} key={item} onClick={() => changeFilter(item)}>{item}</button>
          ))}
        </div>
        <div className={styles.viewToggle}>
          <span className={view === "image" ? styles.activeView : ""}>Image View</span>
          <button
            className={`${styles.switch} ${view === "list" ? styles.switchList : ""}`}
            type="button"
            role="switch"
            aria-checked={view === "list"}
            aria-label="Toggle list view"
            onClick={() => { setView((current) => current === "image" ? "list" : "image"); setHovered(null); }}
          ><span /></button>
          <span className={view === "list" ? styles.activeView : ""}>List View</span>
        </div>
      </div>

      {view === "image" ? (
        <div className={styles.imageGrid}>
          {visibleProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
        </div>
      ) : (
        <div className={styles.listWrap} onMouseLeave={() => setHovered(null)}>
          <div className={`${styles.hoverReveal} ${hovered ? styles.hoverRevealVisible : ""}`} aria-hidden="true">
            {hovered && <Image key={hovered.id} src={hovered.imageUrl} alt="" fill sizes="32vw" />}
          </div>
          <div className={styles.projectList}>
            {filtered.map((project) => (
              <Link className={styles.listRow} href={project.href} key={project.id} onMouseEnter={() => setHovered(project)} onFocus={() => setHovered(project)} onBlur={() => setHovered(null)}>
                <span>{project.title}</span><ProjectCategory category={project.category} /><span>{project.location}</span><span>{project.year}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {view === "image" && hasMore && (
        <PillAction className={styles.loadMore} arrow={false} onClick={() => setPage((current) => current + 1)}>{loadMoreLabel} <span aria-hidden="true">↓</span></PillAction>
      )}
    </section>
  );
}
