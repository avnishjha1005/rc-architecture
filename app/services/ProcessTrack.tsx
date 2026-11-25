"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./services.module.css";

export function ProcessTrack({ children }: { children: ReactNode }) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    const track = trackRef.current;
    if (!runway || !track) return;
    const desktopMotion = window.matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    let travel = 0;
    let inset = 0;
    let frame = 0;

    const syncPosition = () => {
      frame = 0;
      if (travel) track.scrollLeft = Math.max(0, Math.min(travel, inset - runway.getBoundingClientRect().top));
    };
    function onScroll() {
      if (travel && !frame) frame = requestAnimationFrame(syncPosition);
    }
    const measure = () => {
      const height = track.offsetHeight;
      inset = (window.innerHeight - height) / 2;
      const wasPinned = travel > 0;
      travel = desktopMotion.matches && inset >= 0 ? Math.max(0, track.scrollWidth - track.clientWidth) : 0;
      runway.toggleAttribute("data-pinned", travel > 0);
      runway.style.setProperty("--process-inset", `${inset}px`);
      runway.style.setProperty("--process-runway", `${height + travel}px`);
      if (!travel && wasPinned) track.scrollLeft = 0;
      onScroll();
    };
    const onKey = (event: KeyboardEvent) => {
      if (!travel || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target !== track) return;
      const step = track.firstElementChild?.getBoundingClientRect().width || track.clientWidth;
      let offset = track.scrollLeft;
      if (event.key === "ArrowRight") offset += step;
      else if (event.key === "ArrowLeft") offset -= step;
      else if (event.key === "Home") offset = 0;
      else if (event.key === "End") offset = travel;
      else return;
      event.preventDefault();
      window.scrollTo({ top: window.scrollY + runway.getBoundingClientRect().top - inset + Math.max(0, Math.min(travel, offset)), behavior: "instant" });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktopMotion.addEventListener("change", measure);
    track.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktopMotion.removeEventListener("change", measure);
      track.removeEventListener("keydown", onKey);
    };
  }, []);

  return <div className={styles.processRunway} ref={runwayRef}>
    <div className={styles.process} data-card-group role="region" aria-label="Design process steps" tabIndex={0} ref={trackRef}>{children}</div>
  </div>;
}
