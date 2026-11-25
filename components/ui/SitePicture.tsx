"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { inReviewFrame } from "@/lib/review-media";

const serverMode = () => "public";

export function SitePicture({ children, className, breakpoint, mobileSrcSet, mobileSizes, mobileImage }: {
  children: ReactNode;
  className?: string;
  breakpoint: number;
  mobileSrcSet?: string;
  mobileSizes?: string;
  mobileImage?: ReactNode;
}) {
  const media = `(max-width:${breakpoint}px)`;
  const subscribe = useCallback((update: () => void) => {
    if (!inReviewFrame() || !mobileSrcSet) return () => {};
    const query = matchMedia(media);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [media, mobileSrcSet]);
  const mode = useSyncExternalStore(subscribe, () => !inReviewFrame() ? "public" : matchMedia(media).matches ? "mobile" : "desktop", serverMode);
  return (
    <picture className={className} data-mobile-asset={mobileSrcSet ? "" : undefined}>
      {mode === "public" && mobileSrcSet && <source media={media} sizes={mobileSizes} srcSet={mobileSrcSet} />}
      {mode === "mobile" && mobileImage ? mobileImage : children}
    </picture>
  );
}
