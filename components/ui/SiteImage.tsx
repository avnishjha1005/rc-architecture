"use client";

import Image, { type ImageProps } from "next/image";
import { useSyncExternalStore } from "react";
import { inReviewFrame, reviewDisplayUrl, reviewImageKey } from "@/lib/review-media";
import { observePhoto } from "./image-wipe";

const subscribe = () => () => {};
const serverSnapshot = () => false;

export default function SiteImage(props: ImageProps) {
  const review = useSyncExternalStore(subscribe, inReviewFrame, serverSnapshot);
  if (!review || typeof props.src !== "string") return <Image {...props} ref={observePhoto} alt={props.alt} />;

  const key = reviewImageKey(props.src);
  if (key) {
    return <Image {...props} ref={observePhoto} alt={props.alt} unoptimized={false} loader={({ width }) => reviewDisplayUrl(key, width)} overrideSrc={`/review-media/${key}/capture.webp`} />;
  }
  const local = props.src.startsWith("/") && !props.src.startsWith("//");
  return <Image {...props} ref={observePhoto} alt={props.alt} overrideSrc={local ? props.src : props.overrideSrc} />;
}
