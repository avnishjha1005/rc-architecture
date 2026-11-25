"use client";

import { A11y, FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import type SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PortfolioProject } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "@/app/projects/projects.module.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

const motionQuery = "(prefers-reduced-motion: no-preference)";
const motionAllowed = () => matchMedia(motionQuery).matches;
const serverMotion = () => false;
function subscribeMotion(update: () => void) {
  const query = matchMedia(motionQuery);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}

export function FeaturedProjectsCarousel({ projects }: { projects: PortfolioProject[] }) {
  const swiper = useRef<SwiperCore | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [tailCopies, setTailCopies] = useState(1);
  const motion = useSyncExternalStore(subscribeMotion, motionAllowed, serverMotion);
  const loop = motion && projects.length > 1;

  useEffect(() => {
    const slider = swiper.current;
    const rail = root.current;
    if (!slider || !rail || !loop) return;
    slider.update();
    let frame = 0, previous = 0, inView = false, dragging = false;
    let hovered = matchMedia("(hover: hover)").matches && rail.matches(":hover");
    let lastY = window.scrollY, lastScroll = performance.now(), direction = 1, boost = 0;

    function tick(time: number) {
      frame = 0;
      if (!slider || slider.destroyed) return;
      const dt = Math.min(time - (previous || time), 50);
      previous = time;
      const period = slider.slidesGrid[projects.length];
      if (period > 0 && !slider.animating) {
        const speed = 34 + boost * Math.exp(-Math.max(0, time - lastScroll) / 240);
        const offset = -slider.translate + direction * speed * dt / 1000;
        slider.setTranslate(-(period + ((offset % period) + period) % period));
        slider.updateActiveIndex();
      }
      frame = requestAnimationFrame(tick);
    }
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (inView && !hovered && !dragging && !document.hidden && !rail.contains(document.activeElement)) frame = requestAnimationFrame(tick);
      else if (!slider.destroyed) slider.updateActiveIndex();
    };
    const scroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (!dy) return;
      const now = performance.now();
      direction = Math.sign(dy);
      boost = Math.min(210, Math.abs(dy) * 160 / Math.min(100, Math.max(now - lastScroll, 8)));
      lastScroll = now;
      lastY = y;
    };
    const enter = (e: PointerEvent) => { if (e.pointerType !== "touch") { hovered = true; sync(); } };
    const leave = () => { hovered = false; sync(); };
    const touchStart = () => { dragging = true; sync(); };
    const touchEnd = () => { dragging = false; sync(); };
    const afterFocus = () => queueMicrotask(sync);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(rail);
    rail.addEventListener("pointerenter", enter);
    rail.addEventListener("pointerleave", leave);
    rail.addEventListener("focusin", sync);
    rail.addEventListener("focusout", afterFocus);
    slider.on("touchStart", touchStart);
    slider.on("touchEnd", touchEnd);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => {
      inView = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("pointerenter", enter);
      rail.removeEventListener("pointerleave", leave);
      rail.removeEventListener("focusin", sync);
      rail.removeEventListener("focusout", afterFocus);
      slider.off("touchStart", touchStart);
      slider.off("touchEnd", touchEnd);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [loop, projects.length]);

  return (
    <div ref={root} className={styles.featuredCarousel} data-no-image-wipe data-card-group="marquee">
      <Swiper
        className={styles.featuredSwiper}
        modules={[A11y, FreeMode, Keyboard, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={16}
        grabCursor
        watchOverflow
        freeMode={{ enabled: true, momentum: true, sticky: false }}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        breakpoints={{ 761: { spaceBetween: 32 } }}
        a11y={{ containerMessage: "Featured projects carousel", wrapperLiveRegion: false, slideLabelMessage: "" }}
        onSwiper={(instance) => { swiper.current = instance; }}
        onSlidesUpdated={(instance) => {
          const period = instance.slidesGrid[projects.length];
          if (loop && period > 0) setTailCopies(Math.max(1, Math.ceil((instance.width + 32) / period)));
        }}
      >
        {(loop ? Array.from({ length: tailCopies + 2 }, (_, i) => i - 1) : [0]).flatMap(copy => projects.map((project, index) => (
          <SwiperSlide className={styles.featuredSlide} key={copy + ":" + project.id} data-shape={index % 4} aria-hidden={copy !== 0 || undefined}>
            <ProjectCard project={project} variant="featured" eager={copy === 0 && index === 0} duplicate={copy !== 0} />
          </SwiperSlide>
        )))}
      </Swiper>
      <button className={styles.featuredNext} type="button" aria-label="Show next featured project" onClick={() => {
        const slider = swiper.current;
        if (!slider) return;
        slider.updateActiveIndex();
        if (slider.isEnd) slider.slideTo(0);
        else slider.slideNext();
      }}>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
