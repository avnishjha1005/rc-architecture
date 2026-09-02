"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PillAction } from "@/components/ui/PillAction";
import styles from "./CareersBanner.module.css";

const images = [
  { src: "/images/about/team-event.png", alt: "RC Architecture team at an event" },
  { src: "/images/about/team-lunch.png", alt: "RC Architecture team lunch" },
  { src: "/images/about/team-outing.png", alt: "RC Architecture team outdoors" },
];

export function CareersBanner({ email }: { email: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const maximum = carousel.scrollWidth - carousel.clientWidth;
    const nextIndex = maximum > 0
      ? Math.round((carousel.scrollLeft / maximum) * (images.length - 1))
      : 0;
    setActiveIndex(nextIndex);
  };

  return (
    <div className={styles.banner}>
      <h2>Interested in<br /><span>Working with us?</span></h2>
      <p>RCA has always had a young energy. Each and every member of the team possesses curiosity towards the new and exciting. We work and play hard. We believe in delivering excellent results while following extremely ethical business practices.</p>
      <PillAction className={styles.button} href={`mailto:${email}?subject=Career%20opportunity`}>Explore opportunities</PillAction>
      <div
        ref={carouselRef}
        className={styles.carousel}
        role="region"
        aria-label="Life at RC Architecture"
        onScroll={updateIndex}
        tabIndex={0}
      >
        <div className={styles.track}>
          {images.map((image) => (
            <div className={styles.image} key={image.src}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 52vw, 36vw" />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.progress} aria-hidden="true">
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
