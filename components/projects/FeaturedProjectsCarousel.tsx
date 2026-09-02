"use client";

import { A11y, FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import type SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import type { PortfolioProject } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "@/app/projects/projects.module.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";

export function FeaturedProjectsCarousel({ projects }: { projects: PortfolioProject[] }) {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  return (
    <div className={styles.featuredCarousel}>
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
        a11y={{ containerMessage: "Featured projects carousel" }}
        onSwiper={setSwiper}
      >
        {projects.map((project, index) => (
          <SwiperSlide className={styles.featuredSlide} key={project.id}>
            <ProjectCard project={project} variant="featured" eager={index === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={styles.featuredNext} type="button" aria-label="Show next featured project" onClick={() => swiper?.slideNext()}>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
