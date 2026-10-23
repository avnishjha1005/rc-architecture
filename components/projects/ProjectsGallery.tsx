"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PortfolioProject } from "@/content/projects";
import { PillAction } from "@/components/ui/PillAction";
import { ProjectCard } from "./ProjectCard";
import { ProjectCategory } from "./ProjectMeta";
import styles from "@/app/projects/projects.module.css";

type View = "image" | "list";
type Filter = "All Projects" | "Architecture" | "Interior Design";
const PAGE_SIZE = 6;
const LIST_PAGE_SIZE = 12;

export function ProjectsGallery({ projects, loadMoreLabel = "Load more" }: { projects: PortfolioProject[]; loadMoreLabel?: string }) {
  const [view, setView] = useState<View>("image");
  const [filter, setFilter] = useState<Filter>("All Projects");
  const [page, setPage] = useState(1);
  const [hovered, setHovered] = useState<PortfolioProject | null>(null);
  const itemsRoot = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const entranceFrom = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);
  const filtered = useMemo(() => filter === "All Projects" ? projects : projects.filter((project) => project.type === filter), [filter, projects]);
  const pageSize = view === "list" ? LIST_PAGE_SIZE : PAGE_SIZE;
  const visibleProjects = filtered.slice(0, page * pageSize);
  const hasMore = visibleProjects.length < filtered.length;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      prefersReducedMotion.current = mediaQuery.matches;
      if (mediaQuery.matches) timeline.current?.progress(1);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
      timeline.current?.kill();
    };
  }, []);

  useLayoutEffect(() => {
    const startIndex = entranceFrom.current;
    const root = itemsRoot.current;
    if (startIndex === null || !root) return;

    entranceFrom.current = null;
    const items = gsap.utils.toArray<HTMLElement>("[data-project-item]", root).slice(startIndex);
    if (!items.length || prefersReducedMotion.current) return;

    timeline.current?.kill();
    timeline.current = gsap.fromTo(
      items,
      { autoAlpha: 0, y: 24, scale: 0.985 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.055,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
      },
    );
  }, [filter, page, view]);

  function swapGallery(update: () => void) {
    const root = itemsRoot.current;
    const items = root ? gsap.utils.toArray<HTMLElement>("[data-project-item]", root) : [];

    timeline.current?.kill();
    if (!items.length || prefersReducedMotion.current) {
      update();
      return;
    }

    timeline.current = gsap.to(items, {
      autoAlpha: 0,
      y: -14,
      scale: 0.99,
      duration: 0.2,
      stagger: 0.025,
      ease: "power2.in",
      onComplete: () => {
        entranceFrom.current = 0;
        update();
      },
    });
  }

  function changeFilter(nextFilter: Filter) {
    if (nextFilter === filter) return;
    swapGallery(() => {
      setFilter(nextFilter);
      setPage(1);
      setHovered(null);
    });
  }

  function changeView(nextView: View) {
    if (nextView === view) return;
    swapGallery(() => {
      setView(nextView);
      setHovered(null);
    });
  }

  function loadMore() {
    entranceFrom.current = visibleProjects.length;
    setPage((current) => current + 1);
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
            onClick={() => changeView(view === "image" ? "list" : "image")}
          ><span /></button>
          <span className={view === "list" ? styles.activeView : ""}>List View</span>
        </div>
      </div>

      {view === "image" ? (
        <div className={styles.imageGrid} ref={itemsRoot}>
          {visibleProjects.map((project) => <ProjectCard project={project} key={project.id} />)}
        </div>
      ) : (
        <div className={styles.listWrap} onMouseLeave={() => setHovered(null)} ref={itemsRoot}>
          <div className={`${styles.hoverReveal} ${hovered ? styles.hoverRevealVisible : ""}`} aria-hidden="true">
            {hovered && <Image key={hovered.id} src={hovered.imageUrl} alt="" fill sizes="32vw" />}
          </div>
          <div className={styles.projectList}>
            {visibleProjects.map((project) => (
              <Link className={styles.listRow} data-project-item href={project.href} key={project.id} onMouseEnter={() => setHovered(project)} onFocus={() => setHovered(project)} onBlur={() => setHovered(null)}>
                <span>{project.title}</span><ProjectCategory category={project.category} /><span>{project.location}</span><span>{project.year}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasMore && (
        <PillAction className={styles.loadMore} arrow={false} onClick={loadMore}>{loadMoreLabel} <span aria-hidden="true">↑</span></PillAction>
      )}
    </section>
  );
}
