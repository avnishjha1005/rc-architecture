"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProjectDetail } from "@/content/projectDetails";
import styles from "@/app/projects/[slug]/project-detail.module.css";

export function ProjectGallery({ images, title }: { images: ProjectDetail["gallery"]; title: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateIndex() {
    const rail = railRef.current;
    if (!rail) return;
    const maximum = rail.scrollWidth - rail.clientWidth;
    const nextIndex = maximum > 0
      ? Math.round((rail.scrollLeft / maximum) * (images.length - 1))
      : 0;
    setActiveIndex(nextIndex);
  }

  return (
    <div className={styles.gallery} role="region" aria-label={`${title} image gallery`}>
      <div className={styles.galleryRail} ref={railRef} onScroll={updateIndex} tabIndex={0}>
        {images.map((image, index) => <div key={image.imageUrl + index}><Image src={image.imageUrl} alt={image.imageAlt} fill sizes="70vw" /></div>)}
      </div>
      <div className={styles.galleryIndicator} aria-hidden="true">
        <span
          style={{
            width: `${100 / images.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
