"use client";

import { A11y, FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { PortfolioProject } from "@/content/projects";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillAction } from "@/components/ui/PillAction";
import { ProjectCard } from "./ProjectCard";
import styles from "./NextProjects.module.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

type NextProjectsProps = {
  projects: PortfolioProject[];
  eyebrow?: string;
  title?: string;
  backHref?: string;
  backLabel?: string;
};

export function NextProjects({
  projects,
  eyebrow = "Featured projects",
  title = "Next Projects.",
  backHref = "/projects",
  backLabel = "Back to all projects",
}: NextProjectsProps) {
  if (!projects.length) return null;

  return (
    <section className={styles.nextProjects} aria-labelledby="next-projects-title">
      <div className={styles.nextHeading}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className={styles.nextHeadingContent}>
          <h2 id="next-projects-title">{title}</h2>
          <PillAction className={styles.backLink} href={backHref}>{backLabel}</PillAction>
        </div>
      </div>

      <div className={styles.swiperOffset}>
        <Swiper
          className={styles.relatedSwiper}
          modules={[A11y, FreeMode, Mousewheel]}
          slidesPerView={1.15}
          spaceBetween={16}
          grabCursor
          watchOverflow
          freeMode={{
            enabled: true,
            momentum: true,
            sticky: false,
          }}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
          }}
          breakpoints={{
            761: { slidesPerView: 3, spaceBetween: 20 },
          }}
          a11y={{ containerMessage: `${eyebrow} carousel` }}
        >
          {projects.map((item) => (
            <SwiperSlide className={styles.relatedSlide} key={item.id}>
              <ProjectCard project={item} variant="related" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
