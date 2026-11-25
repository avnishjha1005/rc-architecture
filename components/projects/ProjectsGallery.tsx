"use client";

import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { PillAction } from "@/components/ui/PillAction";
import { LoadMoreArrow } from "@/components/ui/LoadMoreArrow";
import { ProjectCard, type ArchiveProject } from "./ProjectCard";
import { ProjectList } from "./ProjectList";
import styles from "@/app/projects/projects.module.css";

type View = "image" | "list";
type Filter = "All Projects" | "Architecture" | "Interior Design";
const desktopQuery = "(min-width: 761px)";
const isDesktop = () => window.matchMedia(desktopQuery).matches;
const serverDesktop = () => false;

function subscribeToWidth(notify: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

export function ProjectsGallery({ projects, loadMoreLabel = "Load more" }: { projects: ArchiveProject[]; loadMoreLabel?: string }) {
  const [layout, setLayout] = useState<{ view: View; filter: Filter }>({ view: "image", filter: "All Projects" });
  const [limit, setLimit] = useState<number | null>(null);
  const [pending, setPending] = useState<typeof layout | null>(null);
  const destination = useRef<(typeof layout & { limit: number | null }) | null>(null);
  const layer = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const anchor = useRef<{ slug: string; top: number } | null>(null);
  const enter = useRef(false);
  const desktop = useSyncExternalStore(subscribeToWidth, isDesktop, serverDesktop);
  const filtered = useMemo(() => layout.filter === "All Projects" ? projects : projects.filter(project => project.type === layout.filter), [layout.filter, projects]);
  const pageSize = layout.view === "list" || desktop ? 12 : 6;
  const visibleProjects = filtered.slice(0, Math.max(pageSize, limit ?? 0));
  const hasMore = visibleProjects.length < filtered.length;
  const { view, filter } = pending ?? layout;
  const leaving = pending !== null;

  function commitDestination() {
    const next = destination.current;
    if (!next) return;
    destination.current = null;
    enter.current = true;
    setLayout({ view: next.view, filter: next.filter });
    setLimit(next.limit);
    setPending(null);
  }

  useLayoutEffect(() => {
    if (!layer.current || (!leaving && !enter.current)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(layer.current.querySelectorAll<HTMLElement>("[data-project-item], [data-archive-empty]"));
    if (!leaving) {
      enter.current = false;
      const saved = anchor.current;
      anchor.current = null;
      const item = saved && items.find(node => node.dataset.projectItem === saved.slug);
      if (saved && item) {
        const rect = item.getBoundingClientRect();
        const top = saved.top + rect.height > 0 ? saved.top : 0;
        window.scrollBy({ top: rect.top - top, behavior: "instant" });
      }
    }

    if (media.matches || !items.length) {
      if (leaving) commitDestination();
      return;
    }

    const stagger = Math.min(leaving ? 30 : 44, 220 / Math.max(1, items.length - 1));
    const distance = layout.view === "image" ? 32 : 16;
    const animations = items.map((item, index) => {
      for (const entrance of item.getAnimations()) if (entrance.id === "rc-card-enter") entrance.cancel();
      const frames = leaving ? [
        { opacity: getComputedStyle(item).opacity, transform: getComputedStyle(item).transform },
        { opacity: 0, transform: `translateY(-${distance / 2}px)` },
      ] : [
        { opacity: 0, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ];
      const animation = item.animate(frames, {
        duration: leaving ? 185 : 400,
        delay: index * stagger,
        easing: leaving ? "cubic-bezier(.55,0,.85,.45)" : "cubic-bezier(.18,.8,.22,1)",
        fill: leaving ? "both" : "backwards",
      });
      item.style.removeProperty("opacity");
      item.style.removeProperty("transform");
      return animation;
    });
    const finish = () => animations.forEach(animation => animation.finish());
    const results = layer.current;
    if (!leaving) results.addEventListener("focusin", finish);
    media.addEventListener("change", finish);
    let active = true;
    void Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (active && leaving) commitDestination();
    }, () => {});
    return () => {
      active = false;
      media.removeEventListener("change", finish);
      results.removeEventListener("focusin", finish);
      animations.forEach((animation, index) => {
        if (!leaving && animation.playState !== "finished") {
          const item = items[index];
          const { opacity, transform } = getComputedStyle(item);
          item.style.opacity = opacity;
          item.style.transform = transform;
        }
        animation.cancel();
      });
    };
  }, [layout, leaving]);

  function change(nextView: View, nextFilter: Filter) {
    if (nextView === view && nextFilter === filter) return;
    const nextSize = nextView === "list" || desktop ? 12 : 6;
    destination.current = {
      view: nextView,
      filter: nextFilter,
      limit: nextFilter === layout.filter ? Math.max(nextSize, Math.ceil(visibleProjects.length / nextSize) * nextSize) : null,
    };
    anchor.current = null;
    const controlsRect = controls.current?.getBoundingClientRect();
    const controlsVisible = controlsRect && controlsRect.bottom > 0 && controlsRect.top < window.innerHeight;
    if (!controlsVisible && nextView !== layout.view && nextFilter === layout.filter && layer.current) {
      for (const item of layer.current.querySelectorAll<HTMLElement>("[data-project-item]")) {
        const rect = item.getBoundingClientRect();
        if (item.dataset.projectItem && rect.bottom > 0 && rect.top < window.innerHeight) {
          anchor.current = { slug: item.dataset.projectItem, top: rect.top };
          break;
        }
      }
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) commitDestination();
    else setPending({ view: nextView, filter: nextFilter });
  }

  return (
    <section className={styles.gallery} aria-label="Project archive">
      <div className={styles.controls} ref={controls}>
        <div className={styles.filters} aria-label="Filter projects">
          {(["All Projects", "Architecture", "Interior Design"] as Filter[]).map((item) => (
            <button className={filter === item ? styles.activeFilter : ""} type="button" aria-pressed={filter === item} key={item} onClick={() => change(view, item)}>{item}</button>
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
            onClick={() => change(view === "image" ? "list" : "image", filter)}
          ><span /></button>
          <span className={view === "list" ? styles.activeView : ""}>List View</span>
        </div>
      </div>

      <div className={styles.results} ref={layer} inert={leaving} aria-busy={leaving}>
        {visibleProjects.length === 0 ? (
          <p className={styles.empty} data-archive-empty>No projects match this filter.</p>
        ) : layout.view === "image" ? (
          <div className={styles.imageGrid} data-card-group>
            {visibleProjects.map(project => <ProjectCard project={project} key={project.id} />)}
          </div>
        ) : <ProjectList key={layout.filter} projects={visibleProjects} />}
      </div>

      <p className="sr-only" role="status">{visibleProjects.length} of {filtered.length} projects shown in {layout.view} view. Filter: {layout.filter}.</p>
      {hasMore && (
        <PillAction className={styles.loadMore} arrow={false} disabled={leaving} onClick={() => setLimit(visibleProjects.length + pageSize)}>{loadMoreLabel}<LoadMoreArrow /></PillAction>
      )}
    </section>
  );
}
