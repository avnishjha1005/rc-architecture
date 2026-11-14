export type ImageCrop = { top: number; bottom: number; left: number; right: number };
export type ImageHotspot = { x: number; y: number; height: number; width: number };

export type ResponsiveImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lqip?: string;
  crop?: ImageCrop;
  hotspot?: ImageHotspot;
};

export type CmsResponsiveImage = Partial<Omit<ResponsiveImage, "src" | "alt">> & {
  src?: string;
  alt?: string;
};

export function legacyImage(src: string, alt: string): ResponsiveImage {
  return { src, alt };
}

export function resolveImage(
  image: CmsResponsiveImage | null | undefined,
  fallbackSrc: string,
  fallbackAlt: string,
): ResponsiveImage {
  if (!image?.src) return legacyImage(fallbackSrc, fallbackAlt);
  return {
    src: image.src,
    alt: image.alt || fallbackAlt,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    ...(image.lqip ? { lqip: image.lqip } : {}),
    ...(image.crop ? { crop: image.crop } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
  };
}
