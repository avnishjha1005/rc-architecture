"use client";

import type { ImageProps } from "next/image";
import Image from "./SiteImage";
import type { ResponsiveImage as ResponsiveImageData } from "@/lib/responsive-image";
import { responsiveImageLoader } from "@/lib/responsive-image-loader";

type Props = Omit<ImageProps, "src" | "alt" | "placeholder" | "blurDataURL" | "loader"> & {
  image: ResponsiveImageData;
  aspectRatio?: number;
  showPlaceholder?: boolean;
};

export function ResponsiveImage({ image, aspectRatio, showPlaceholder = true, style, ...props }: Props) {
  const loader = responsiveImageLoader(image, aspectRatio);
  const objectPosition = image.hotspot
    ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`
    : undefined;

  return (
    <Image
      {...props}
      src={image.src}
      alt={image.alt}
      loader={loader}
      placeholder={showPlaceholder && image.lqip ? "blur" : "empty"}
      blurDataURL={showPlaceholder ? image.lqip : undefined}
      style={objectPosition ? { ...style, objectPosition } : style}
    />
  );
}
