"use client";

import Image from "next/image";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperCore from "swiper";
import { useEffect, useRef, useState } from "react";
import styles from "./services.module.css";

import "swiper/css";

type ServiceCarouselProps = {
  items: string[][];
  label: string;
  description: string;
};

export function ServiceCarousel({ items, label, description }: ServiceCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);
  const [trailingSpace, setTrailingSpace] = useState(0);
  const hasMultipleItems = items.length > 1;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateTrailingSpace = () => {
      const viewportWidth = carousel.clientWidth + 20;
      setTrailingSpace(Math.max(0, viewportWidth - Math.min(630, viewportWidth)));
    };

    updateTrailingSpace();
    const observer = new ResizeObserver(updateTrailingSpace);
    observer.observe(carousel);

    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <div ref={carouselRef} className={styles.serviceCarousel}>
      <div className={styles.serviceIntro}>
        <div>
          <h3>{label}</h3>
          <p>{description}</p>
        </div>
        <div className={styles.roundActions}>
          <button type="button" disabled={!hasMultipleItems} onClick={() => swiper?.slidePrev()} aria-label={`Previous ${label} service`}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" disabled={!hasMultipleItems} onClick={() => swiper?.slideNext()} aria-label={`Next ${label} service`}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <Swiper
        className={styles.serviceImages}
        modules={[A11y, Keyboard]}
        slidesPerView="auto"
        spaceBetween={20}
        slidesOffsetAfter={trailingSpace}
        grabCursor={hasMultipleItems}
        keyboard={{ enabled: true }}
        rewind={hasMultipleItems}
        watchOverflow
        a11y={{ containerMessage: `${label} services carousel` }}
        onSwiper={setSwiper}
      >
        {items.map(([title, copy, image], index) => (
          <SwiperSlide className={styles.serviceSlide} key={`${title}-${index}`}>
            <div className={styles.serviceImage}><Image src={image} alt={title} fill sizes="(max-width: 760px) 100vw, 630px" /></div>
            <h4>{title}</h4>
            <p>{copy}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
