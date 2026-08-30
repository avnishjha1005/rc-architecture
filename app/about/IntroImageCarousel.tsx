"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./about.module.css";

type CarouselImage = {
  imageUrl?: string;
  imageAlt?: string;
};

type IntroImageCarouselProps = {
  images: CarouselImage[];
};

export function IntroImageCarousel({ images }: IntroImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = () => {
    const track = trackRef.current;
    const firstSlide = track?.firstElementChild as HTMLElement | null;
    if (!track || !firstSlide) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = firstSlide.offsetWidth + gap;
    setActiveIndex(Math.min(images.length - 1, Math.round(track.scrollLeft / step)));
  };

  const showNext = () => {
    const track = trackRef.current;
    const firstSlide = track?.firstElementChild as HTMLElement | null;
    if (!track || !firstSlide) return;

    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollTo({ left: nextIndex * (firstSlide.offsetWidth + gap), behavior: "smooth" });
    setActiveIndex(nextIndex);
  };

  return (
    <div className={styles.introCarousel} aria-label="Studio images">
      <div ref={trackRef} className={styles.introCarouselTrack} onScroll={updateIndex}>
        {images.map((image, index) => (
          <div className={styles.introCarouselSlide} key={`${image.imageUrl}-${index}`}>
            <Image
              src={image.imageUrl || ""}
              alt={image.imageAlt || "RC Architecture studio project"}
              fill
              sizes="86vw"
            />
          </div>
        ))}
      </div>
      <button className={styles.introCarouselNext} type="button" onClick={showNext} aria-label="Show next image">
        <span aria-hidden="true">→</span>
      </button>
      <div className={styles.introCarouselProgress} aria-hidden="true">
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
