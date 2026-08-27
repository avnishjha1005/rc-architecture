"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PortfolioProject } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "@/app/projects/projects.module.css";

type View = "image" | "list";
type Filter = "All Projects" | "Architecture" | "Interior Design";
const PAGE_SIZE = 12;

export function ProjectsGallery({ projects }: { projects: PortfolioProject[] }) {
  const [view, setView] = useState<View>("image");
  const [filter, setFilter] = useState<Filter>("All Projects");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [hovered, setHovered] = useState<PortfolioProject | null>(null);
  const filtered = useMemo(() => filter === "All Projects" ? projects : projects.filter((project) => project.type === filter), [filter, projects]);
  const shown = view === "image" ? filtered.slice(0, visible) : filtered;

  function changeFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    setVisible(PAGE_SIZE);
    setHovered(null);
  }

  return (
    <section className={styles.gallery} aria-label="Project archive">
      <div className={styles.controls}>
        <div className={styles.filters} aria-label="Filter projects">
          {(["All Projects", "Architecture", "Interior Design"] as Filter[]).map((item) => (
            <button className={filter === item ? styles.activeFilter : ""} type="button" key={item} onClick={() => changeFilter(item)}>{item}</button>
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
        <div className={styles.imageGrid}>{shown.map((project) => <ProjectCard project={project} key={project.id} />)}</div>
      ) : (
        <div className={styles.listWrap} onMouseLeave={() => setHovered(null)}>
          <div className={`${styles.hoverReveal} ${hovered ? styles.hoverRevealVisible : ""}`} aria-hidden="true">
            {hovered && <Image key={hovered.id} src={hovered.imageUrl} alt="" fill sizes="32vw" />}
          </div>
          <div className={styles.projectList}>
            {shown.map((project) => (
              <a className={styles.listRow} href={project.href} key={project.id} onMouseEnter={() => setHovered(project)} onFocus={() => setHovered(project)} onBlur={() => setHovered(null)}>
                <span>{project.title}</span><small>({project.category})</small><span>{project.location}</span><span>{project.year}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {view === "image" && visible < filtered.length && (
        <button className={styles.loadMore} type="button" onClick={() => setVisible((count) => count + PAGE_SIZE)}>Load more <span>↑</span></button>
      )}
    </section>
  );
}
