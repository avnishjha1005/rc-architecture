"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (/^\/(chisel|studio|feedback)(\/|$)/.test(pathname)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const configure = () => {
      lenis?.destroy();
      lenis = preference.matches ? undefined : new Lenis({
        duration: 0.947,
        easing: t => t === 1 ? 1 : 1 - 2 ** (-11.19 * t),
        anchors: true,
        autoRaf: true,
        autoToggle: true,
        stopInertiaOnNavigate: true,
      });
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      preference.removeEventListener("change", configure);
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}
