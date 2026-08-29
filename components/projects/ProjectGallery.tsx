"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProjectDetail } from "@/content/projectDetails";
import styles from "@/app/projects/[slug]/project-detail.module.css";

export function ProjectGallery({ images, title }: { images: ProjectDetail["gallery"]; title: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  function updateProgress() {
    const rail = railRef.current;
    if (!rail) return;
    const maximum = rail.scrollWidth - rail.clientWidth;
    setProgress(maximum > 0 ? rail.scrollLeft / maximum : 1);
  }

  function move(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * 0.72, behavior: "smooth" });
  }

  return (
    <div className={styles.gallery} role="region" aria-label={`${title} image gallery`}>
      <div className={styles.galleryRail} ref={railRef} onScroll={updateProgress} tabIndex={0}>
        {images.map((image, index) => <div key={image.imageUrl + index}><Image src={image.imageUrl} alt={image.imageAlt} fill sizes="70vw" /></div>)}
      </div>
      <div className={styles.galleryControls}>
        <button type="button" onClick={() => move(-1)} aria-label="Previous gallery images">←</button>
        <div className={styles.progress} aria-hidden="true"><span style={{ width: `${Math.max(12, progress * 100)}%` }} /></div>
        <button type="button" onClick={() => move(1)} aria-label="Next gallery images">→</button>
      </div>
    </div>
  );
}
