"use client";

import { useLayoutEffect, useRef } from "react";

type StatItem = readonly [label: string, value: string];

function numberParts(value: string) {
  const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
  if (!match || match.index === undefined) return null;

  const rawNumber = match[0];
  const decimalPlaces = rawNumber.split(".")[1]?.length || 0;
  return {
    target: Number(rawNumber.replaceAll(",", "")),
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + rawNumber.length),
    decimalPlaces,
    usesGrouping: rawNumber.includes(","),
  };
}

function displayValue(value: string) {
  const parts = numberParts(value);
  if (!parts || !Number.isFinite(parts.target)) return value;
  return `${parts.prefix}${value.slice(parts.prefix.length, value.length - parts.suffix.length)}${parts.suffix ? `\u2009${parts.suffix}` : ""}`;
}

export function AboutStats({ className, items }: { className: string; items: readonly StatItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parsedItems = items.map(([, value]) => ({ parts: numberParts(value), value }));
    const format = (current: number, parts: NonNullable<ReturnType<typeof numberParts>>) => {
      const numeric = current.toLocaleString("en-US", {
        minimumFractionDigits: parts.decimalPlaces,
        maximumFractionDigits: parts.decimalPlaces,
        useGrouping: parts.usesGrouping,
      });
      return `${parts.prefix}${numeric}${parts.suffix ? `\u2009${parts.suffix}` : ""}`;
    };

    let animationFrame = 0;
    parsedItems.forEach(({ parts }, index) => {
      const node = numberRefs.current[index];
      if (node && parts && Number.isFinite(parts.target)) node.textContent = format(0, parts);
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const duration = 1_500;

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        parsedItems.forEach(({ parts, value }, index) => {
          const node = numberRefs.current[index];
          if (!node || !parts || !Number.isFinite(parts.target)) return;
          const current = parts.decimalPlaces
            ? parts.target * eased
            : Math.round(parts.target * eased);
          node.textContent = progress < 1 ? format(current, parts) : displayValue(value);
        });
        if (progress < 1) animationFrame = requestAnimationFrame(tick);
      };

      animationFrame = requestAnimationFrame(tick);
    }, { threshold: 0.15 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [items]);

  return (
    <section className={className} aria-label="Studio statistics" ref={sectionRef}>
      {items.map(([label, value], index) => <div key={label}><p>{label}</p><strong aria-label={value}><span ref={(node) => { numberRefs.current[index] = node; }} aria-hidden="true">{displayValue(value)}</span></strong></div>)}
    </section>
  );
}
