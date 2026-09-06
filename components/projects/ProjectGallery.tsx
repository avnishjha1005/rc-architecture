"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectDetail } from "@/content/projectDetails";
import styles from "@/app/projects/[slug]/project-detail.module.css";

export function ProjectGallery({ images, title }: { images: ProjectDetail["gallery"]; title: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canNext, setCanNext] = useState(images.length > 1);

  const updateIndex = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maximum = rail.scrollWidth - rail.clientWidth;
    const nextIndex = maximum > 0
      ? Math.round((rail.scrollLeft / maximum) * (images.length - 1))
      : 0;
    setActiveIndex(nextIndex);
    setCanNext(rail.scrollLeft < maximum - 1);
  }, [images.length]);

  function moveNext() {
    const rail = railRef.current;
    if (!rail) return;

    const slides = Array.from(rail.children) as HTMLElement[];
    const current = slides.reduce((nearest, slide, index) =>
      Math.abs(slide.offsetLeft - rail.scrollLeft) < Math.abs(slides[nearest].offsetLeft - rail.scrollLeft)
        ? index
        : nearest, 0);
    const target = slides[Math.min(slides.length - 1, current + 1)];
    rail.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateIndex();
    const observer = new ResizeObserver(updateIndex);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [updateIndex]);

  return (
    <div className={styles.gallery} role="region" aria-label={`${title} image gallery`}>
      <div className={styles.galleryViewport}>
        <div className={styles.galleryRail} ref={railRef} onScroll={updateIndex} tabIndex={0}>
          {images.map((image, index) => <div key={image.imageUrl + index}><Image src={image.imageUrl} alt={image.imageAlt} fill sizes="70vw" /></div>)}
        </div>
        <button className={styles.galleryNext} type="button" disabled={!canNext} onClick={moveNext} aria-label={`Next ${title} image`}>
          <Image src="/Arrow.svg" alt="" width={16} height={14} />
        </button>
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
