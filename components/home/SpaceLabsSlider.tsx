"use client";

import { Children, useRef, useSyncExternalStore, type ReactNode } from "react";
import type SwiperCore from "swiper";
import { A11y, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/a11y";
import styles from "./SpaceLabsSlider.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(notify: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

export function SpaceLabsSlider({ children }: { children: ReactNode }) {
  const carousel = useRef<SwiperCore | null>(null);
  const reduceMotion = useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => true);

  return <div className={styles.viewport} data-card-group><div className={`section-shell ${styles.rail}`} onKeyDown={(event) => {
    const slider = carousel.current;
    if (!slider?.enabled || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft") slider.slidePrev();
    else if (event.key === "ArrowRight") slider.slideNext();
    else if (event.key === "Home") slider.slideTo(0);
    else if (event.key === "End") slider.slideTo(slider.slides.length - 1);
    else return;
    event.preventDefault();
  }}>
    <Swiper
      className={styles.slider}
      modules={[A11y, Navigation, Mousewheel]}
      enabled={false}
      breakpoints={{ 901: { enabled: true, slidesPerView: 3.5, spaceBetween: "1.43%" } }}
      navigation={{ addIcons: false }}
      a11y={{ containerRole: "region", containerMessage: "Space Lab articles", prevSlideMessage: "Previous Space Lab articles", nextSlideMessage: "Next Space Lab articles" }}
      mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
      speed={reduceMotion ? 0 : 360}
      grabCursor
      watchOverflow
      onSwiper={(slider) => { carousel.current = slider; }}
      onSlideChange={(slider) => {
        const { prevEl, nextEl } = slider.navigation;
        if (slider.isEnd && nextEl === document.activeElement) prevEl?.focus({ preventScroll: true });
        else if (slider.isBeginning && prevEl === document.activeElement) nextEl?.focus({ preventScroll: true });
      }}
    >
      {Children.map(children, (card) => <SwiperSlide>{card}</SwiperSlide>)}
    </Swiper>
  </div></div>;
}
