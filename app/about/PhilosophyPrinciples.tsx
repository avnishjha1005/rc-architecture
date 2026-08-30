"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./about.module.css";

type PhilosophyPrinciplesProps = {
  items: string[][];
};

export function PhilosophyPrinciples({ items }: PhilosophyPrinciplesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const activeEIds = ["e-top", "e-right", "e-bottom", "e-left"];

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
    <div className={styles.philosophyGrid}>
      <div className={styles.philosophyMark} aria-hidden="true">
        <svg className={styles.philosophyMarkImage} viewBox="0 0 475 427">
          <image href="/ex4.svg?v=3" width="475" height="427" />
          <use
            href={`/ex4.svg?v=3#${activeEIds[activeIndex]}`}
            className={styles.activeE}
          />
        </svg>
      </div>
      <div className={styles.principles}>
        {items.map(([title, copy], index) => (
          <article
            key={title}
            ref={(node) => { itemRefs.current[index] = node; }}
            className={index === activeIndex ? styles.activePrinciple : undefined}
            tabIndex={0}
            aria-current={index === activeIndex ? "step" : undefined}
            onPointerEnter={() => activate(index)}
            onFocus={() => activate(index)}
            onClick={() => activate(index, true)}
          >
            <small>[{String(index + 1).padStart(2, "0")}]</small>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
