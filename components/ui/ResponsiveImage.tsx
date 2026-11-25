"use client";

import type { ImageLoaderProps, ImageProps } from "next/image";
import Image from "./SiteImage";
import type { ResponsiveImage as ResponsiveImageData } from "@/lib/responsive-image";

const SANITY_IMAGE_HOST = "cdn.sanity.io";

function sanityLoader({ src, width, quality }: ImageLoaderProps, sourceWidth?: number) {
  const url = new URL(src);
  url.searchParams.set("w", String(sourceWidth ? Math.min(width, sourceWidth) : width));
  url.searchParams.set("q", String(quality || 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

type Props = Omit<ImageProps, "src" | "alt" | "placeholder" | "blurDataURL" | "loader"> & {
  image: ResponsiveImageData;
};

export function ResponsiveImage({ image, style, ...props }: Props) {
  const isSanityImage = image.src.startsWith(`https://${SANITY_IMAGE_HOST}/`);
  const loader = isSanityImage
    ? (loaderProps: ImageLoaderProps) => sanityLoader(loaderProps, image.width)
    : undefined;
  const objectPosition = image.hotspot
    ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`
    : undefined;

  return (
    <Image
      {...props}
      src={image.src}
      alt={image.alt}
      loader={loader}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      style={objectPosition ? { ...style, objectPosition } : style}
    />
  );
}
