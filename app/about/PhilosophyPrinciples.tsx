"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./about.module.css";

type PhilosophyPrinciplesProps = {
  items: string[][];
};

export function PhilosophyPrinciples({ items }: PhilosophyPrinciplesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const updateFromScroll = useCallback(() => {
    const viewportTarget = window.innerHeight * 0.5;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - viewportTarget);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateFromScroll);
    };

    frame = requestAnimationFrame(updateFromScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateFromScroll]);

  const activate = (index: number, scroll = false) => {
    setActiveIndex(index);
    if (scroll) {
      itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={styles.philosophyGrid} data-motion-group="section">
      <div className={styles.philosophyMark} aria-hidden="true" data-motion-item>
        <svg className={styles.philosophyMarkImage} viewBox="0 0 475 427">
          <image href="/ex4.svg?v=3" width="475" height="427" />
          <g className={styles.activeEPosition} data-position={activeIndex % 4}>
            <path
              className={styles.activeE}
              d="M233.934 0C285.588.0001 327.462 41.874 327.462 93.5283C327.462 145.183 285.588 187.057 233.934 187.057C195.373 187.057 162.261 163.721 147.953 130.4L174.959 110.583L174.935 110.55L263.467 46.2266C254.903 40.8684 244.78 37.7705 233.934 37.7705C213.669 37.7705 195.929 48.5814 186.167 64.75L152.096 48.2139C168.051 19.4607 198.72 0 233.934 0ZM202.393 139.511C211.363 145.676 222.226 149.285 233.934 149.285C264.727 149.285 289.69 124.322 289.69 93.5283C289.69 88.0422 288.897 82.7412 287.421 77.7334L202.393 139.511Z"
            />
          </g>
        </svg>
      </div>
      <div className={styles.principles}>
        {items.map(([title, copy], index) => (
          <article
            key={title}
            data-motion-item
            ref={(node) => { itemRefs.current[index] = node; }}
            className={index === activeIndex ? styles.activePrinciple : undefined}
            onPointerEnter={() => activate(index)}
          >
            <small>[{String(index + 1).padStart(2, "0")}]</small>
            <div>
              <h3><button type="button" aria-pressed={index === activeIndex} onFocus={() => activate(index)} onClick={() => activate(index, true)}>{title}</button></h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
