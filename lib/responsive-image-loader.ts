import type { ImageLoaderProps } from "next/image";
import type { ResponsiveImage } from "./responsive-image";

const SANITY_IMAGE_HOST = "cdn.sanity.io";

function cropBounds(image: ResponsiveImage) {
  if (!image.width || !image.height) return undefined;
  const crop = image.crop || { top: 0, bottom: 0, left: 0, right: 0 };
  const left = Math.round(image.width * crop.left);
  const top = Math.round(image.height * crop.top);
  const width = Math.max(1, Math.round(image.width * (1 - crop.left - crop.right)));
  const height = Math.max(1, Math.round(image.height * (1 - crop.top - crop.bottom)));
  return { left, top, width, height, crop };
}

export function responsiveImageLoader(image: ResponsiveImage, aspectRatio?: number) {
  if (!image.src.startsWith(`https://${SANITY_IMAGE_HOST}/`)) return undefined;
  return ({ src, width, quality }: ImageLoaderProps) => {
    const url = new URL(src);
    const bounds = cropBounds(image);
    const maximumWidth = bounds
      ? aspectRatio ? Math.min(bounds.width, Math.floor(bounds.height * aspectRatio)) : bounds.width
      : image.width;
    const outputWidth = maximumWidth ? Math.min(width, maximumWidth) : width;

    if (bounds && image.crop) {
      url.searchParams.set("rect", `${bounds.left},${bounds.top},${bounds.width},${bounds.height}`);
    }
    url.searchParams.set("w", String(outputWidth));
    if (aspectRatio) {
      url.searchParams.set("h", String(Math.max(1, Math.round(outputWidth / aspectRatio))));
      url.searchParams.set("fit", "crop");
      if (image.hotspot && bounds) {
        const x = (image.hotspot.x - bounds.crop.left) / (1 - bounds.crop.left - bounds.crop.right);
        const y = (image.hotspot.y - bounds.crop.top) / (1 - bounds.crop.top - bounds.crop.bottom);
        url.searchParams.set("crop", "focalpoint");
        url.searchParams.set("fp-x", String(Math.min(1, Math.max(0, x))));
        url.searchParams.set("fp-y", String(Math.min(1, Math.max(0, y))));
      } else {
        url.searchParams.set("crop", "center");
      }
    } else {
      url.searchParams.set("fit", "max");
    }
    url.searchParams.set("q", String(quality || 75));
    url.searchParams.set("auto", "format");
    return url.toString();
  };
}
