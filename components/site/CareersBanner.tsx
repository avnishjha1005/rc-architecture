"use client";

import Image from "@/components/ui/SiteImage";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PillAction } from "@/components/ui/PillAction";
import styles from "./CareersBanner.module.css";

const images = [
  { src: "/images/about/team-event.png", alt: "RC Architecture team at an event" },
  { src: "/images/about/team-lunch.png", alt: "RC Architecture team lunch" },
  { src: "/images/about/team-outing.png", alt: "RC Architecture team outdoors" },
];

const aboutImages = [
  { src: "/images/about/careers/balcony.webp", alt: "Three RC Architecture colleagues on a balcony", width: 841, height: 425 },
  { src: "/images/about/careers/event.webp", alt: "Team members at an indoor event", width: 405, height: 322 },
  { src: "/images/about/careers/lunch.webp", alt: "Team members gathered around a table for lunch", width: 627, height: 425 },
  { src: "/images/about/careers/studio-group.webp", alt: "RC Architecture team gathered outside the studio", width: 707, height: 322 },
  { src: "/images/about/careers/tug-of-war.webp", alt: "Colleagues playing tug-of-war on a field", width: 330, height: 425 },
];

function photoStyle(photo: typeof aboutImages[number]): CSSProperties {
  return { "--photo-width": photo.width, aspectRatio: `${photo.width} / ${photo.height}` } as CSSProperties;
}

function AboutTeamMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = ref.current;
    const track = rail?.firstElementChild;
    const group = track?.firstElementChild;
    if (!rail || !(track instanceof HTMLElement) || !(group instanceof HTMLElement)) return;
    const motion = matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let visible = false;
    let frame = 0;
    let last = 0;
    let remainder = 0;
    let groupWidth = group.offsetWidth;
    let start = parseFloat(getComputedStyle(track).paddingLeft);
    const step = (now: number) => {
      const left = rail.scrollLeft + remainder + (last ? Math.min(now - last, 50) : 0) * groupWidth / 36000;
      const target = left >= start + groupWidth ? left - groupWidth : left;
      rail.scrollLeft = target;
      remainder = target - rail.scrollLeft;
      last = now;
      frame = requestAnimationFrame(step);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      remainder = 0;
      if (motion.matches && visible && !document.hidden && groupWidth > rail.clientWidth && !rail.matches(":hover, :focus-within")) frame = requestAnimationFrame(step);
    };
    const resize = new ResizeObserver(() => {
      groupWidth = group.offsetWidth;
      start = parseFloat(getComputedStyle(track).paddingLeft);
      sync();
    });
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    visibility.observe(rail);
    resize.observe(rail);
    resize.observe(group);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    for (const event of ["pointerenter", "pointerleave", "focus", "blur"]) rail.addEventListener(event, sync);
    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      for (const event of ["pointerenter", "pointerleave", "focus", "blur"]) rail.removeEventListener(event, sync);
    };
  }, []);

  return <div className={styles.marqueeFrame}>
    <div ref={ref} className={`${styles.carousel} ${styles.marquee}`} role="region" aria-label="Life at RC Architecture" tabIndex={0} data-lenis-prevent-horizontal>
      <div className={styles.track}>{[0, 1].map((group) => (
        <div className={styles.marqueeGroup} key={group} aria-hidden={group === 1 || undefined}>{aboutImages.map((photo) => (
          <div className={styles.image} style={photoStyle(photo)} data-photo={photo.src} key={photo.src}>
            <Image src={photo.src} alt={group === 0 ? photo.alt : ""} fill sizes={`(min-width: 1440px) ${photo.width}px, ${Math.ceil(photo.width / 14.4)}vw`} />
          </div>
        ))}</div>
      ))}</div>
    </div>
  </div>;
}

export function CareersBanner({ email, showAction = true, marquee = false }: { email: string; showAction?: boolean; marquee?: boolean }) {
  const photos = marquee ? aboutImages : images;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll<HTMLElement>("[data-careers-slide]"));
    if (!slides.length) return;
    const position = carousel.scrollLeft + 1;
    const max = carousel.scrollWidth - carousel.clientWidth;
    setActiveIndex(position >= max ? slides.length - 1 : slides.reduce((best, slide, i) =>
      Math.abs(slide.offsetLeft - slides[0].offsetLeft - position) < Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - position) ? i : best, 0));
  };

  return (
    <div className={`${styles.banner} ${showAction ? "" : styles.actionBelow}`.trim()}>
      <h2>Interested in<br /><span>working with us?</span></h2>
      <p>RCA has always had a young energy. Each and every member of the team possesses curiosity towards the new and exciting. We work and play hard. We believe in delivering excellent results while following extremely ethical business practices.</p>
      {showAction && <PillAction className={styles.button} href={`mailto:${email}?subject=Career%20opportunity`}>Explore opportunities</PillAction>}
      {marquee && <AboutTeamMarquee />}
      <div className={marquee ? styles.mobileGallery : styles.gallery}>
        <div ref={carouselRef} className={styles.carousel} role="region" aria-label="Life at RC Architecture" onScroll={updateIndex} tabIndex={0}>
          <div className={styles.track}>{photos.map((image, i) => (
            <div className={styles.image} key={image.src} style={marquee ? photoStyle(aboutImages[i]) : undefined} data-photo={image.src} data-careers-slide data-motion-image><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 78vw, 45vw" /></div>
          ))}</div>
        </div>
        <button className={styles.next} type="button" aria-label="Next team photograph" onClick={() => {
          const carousel = carouselRef.current;
          if (!carousel) return;
          const slides = carousel.querySelectorAll<HTMLElement>("[data-careers-slide]");
          const next = slides[(activeIndex + 1) % slides.length];
          if (next) carousel.scrollTo({ left: next.offsetLeft - slides[0].offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }}>→</button>
        <div className={styles.progress} aria-hidden="true"><span style={{ width: `${100 / photos.length}%`, transform: `translateX(${activeIndex * 100}%)` }} /></div>
      </div>
    </div>
  );
}
