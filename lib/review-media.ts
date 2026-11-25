import { dataset, projectId } from "@/sanity/env";

const publicImageBase = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;
const widths = [32, 64, 128, 256, 384, 640, 828, 1080, 1280, 1920, 2560];

export function inReviewFrame() {
  return window.frameElement?.hasAttribute("data-chisel-preview") === true;
}

export function reviewImageKey(src: string) {
  if (!src.startsWith(publicImageBase)) return undefined;
  const url = new URL(src);
  const name = url.pathname.split("/").pop();
  const rect = url.searchParams.get("rect");
  const key = rect ? `${name}~${rect}` : name;
  return key && reviewImageSource(key) ? key : undefined;
}

export function reviewDisplayUrl(key: string, width: number) {
  const size = widths.find(candidate => candidate >= width) ?? widths[widths.length - 1];
  return `/review-media/${key}/capture.webp?w=${size}`;
}

export function reviewImageSource(key: string, displayWidth?: number) {
  if (displayWidth !== undefined && !widths.includes(displayWidth)) return undefined;
  const match = /^([a-f0-9]{40}-([1-9]\d{0,4})x([1-9]\d{0,4})\.(?:jpe?g|png|webp|gif|avif|svg))(?:~(\d{1,5},\d{1,5},[1-9]\d{0,4},[1-9]\d{0,4}))?$/.exec(key);
  if (!match) return undefined;
  const [, filename, width, height, rect] = match;
  const url = new URL(filename, publicImageBase);
  url.search = `w=${displayWidth ?? 1280}&h=${displayWidth === undefined ? 1280 : 2560}&q=75&fm=webp&fit=max`;
  if (rect) {
    const [x, y, w, h] = rect.split(",").map(Number);
    if (x + w > Number(width) || y + h > Number(height)) return undefined;
    url.searchParams.set("rect", rect);
  }
  return url;
}
