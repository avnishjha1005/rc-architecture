"use client";

import { useEffect, useRef } from "react";
import styles from "./CountUp.module.css";

export function CountUp({ value }: { value: string }) {
  const digits = useRef<HTMLSpanElement>(null);
  const match = /^(\d+(?:,\d{3})*(?:\.\d+)?)(\s*[+%KMB]?)$/i.exec(value);
  const number = match?.[1];

  useEffect(() => {
    const root = digits.current;
    if (!root || !number) return;
    const precision = number.split(".")[1]?.length || 0;
    const target = Number(number.replace(/[,.]/g, ""));
    if (!target || !Number.isSafeInteger(target) || precision > 6) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const format = new Intl.NumberFormat("en-US", {
      useGrouping: number.includes(","),
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    const slots = Array.from(root.children) as HTMLElement[];
    let frame = 0;
    let previous = "";
    let stopped = false;
    function paint(text: string) {
      if (text === previous) return;
      previous = text;
      for (let i = 0; i < slots.length; i++) {
        const char = text[i];
        slots[i].style.visibility = char === " " ? "hidden" : "";
        if (char !== " " && slots[i].textContent !== char) slots[i].textContent = char;
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / 1200));
        if (t === 1) { paint(number); return; }
        const eased = t * t * (3 - 2 * t);
        paint(format.format(Math.round(target * eased) / 10 ** precision).padStart(number.length, " "));
        frame = requestAnimationFrame(tick);
      };
      tick(start);
    }, { threshold: 0.15 });
    void document.fonts.ready.then(() => {
      if (!stopped) observer.observe(root.closest("[data-count-group]") || root);
    });
    const stop = () => { stopped = true; observer.disconnect(); cancelAnimationFrame(frame); paint(number); };
    motion.addEventListener("change", stop);
    return () => { stop(); motion.removeEventListener("change", stop); };
  }, [number]);

  if (!match) return <>{value}</>;
  return <span className={styles.count}>
    <span className="sr-only">{value}</span>
    <span aria-hidden="true"><span ref={digits}>{Array.from(match[1], (char, index) =>
      <span className={/\d/.test(char) ? styles.digit : undefined} key={index}>{char}</span>
    )}</span>{match[2]}</span>
  </span>;
}
