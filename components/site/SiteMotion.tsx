"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { observeHeadings } from "./heading-reveals";
import { destinationUncovered } from "./reveal-timing";
import { observeSectionSupport, supportBootstrap } from "./section-support";
import { observeCards } from "./card-entrances";
import "./heading-reveals.css";

export function SiteMotion() {
  const pathname = usePathname();
  const headingHost = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (/^\/(chisel|studio|feedback)(\/|$)/.test(pathname)) return;
    const root = document.getElementById("main-content");
    if (!root || !headingHost.current) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const uncovered = preference.matches ? undefined : destinationUncovered(previousPath.current !== pathname);
    previousPath.current = pathname;
    const stopHeadings = observeHeadings(root, headingHost.current, uncovered);
    const stopSupport = observeSectionSupport(root, headingHost.current, uncovered);
    const stopCards = observeCards(root);
    return () => {
      stopHeadings();
      stopSupport();
      stopCards();
    };
  }, [pathname]);

  return /^\/(chisel|studio|feedback)(\/|$)/.test(pathname) ? null : <><style>{supportBootstrap}</style><div ref={headingHost} data-heading-host="" aria-hidden="true" inert /></>;
}
