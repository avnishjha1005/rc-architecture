import { inReviewFrame } from "@/lib/review-media";

const excluded = "[data-card], [data-no-image-wipe], [aria-hidden=true], [inert]";
const photos = new WeakMap<HTMLImageElement, { armed: boolean }>();
const active = new Map<HTMLImageElement, Animation>();
let observer: IntersectionObserver | undefined;
let preference: MediaQueryList;

function allowWipe() {
  return !preference.matches && (!inReviewFrame() || document.documentElement.dataset.chiselMode === "view");
}

function stopIfDisabled() {
  if (!allowWipe()) active.forEach(animation => animation.cancel());
}

export function observePhoto(image: HTMLImageElement | null) {
  if (!image || !image.closest("[data-motion-image]") || image.closest(excluded) ||
    !("IntersectionObserver" in window) || !image.animate || !image.decode) return;

  if (!observer) {
    preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", stopIfDisabled);
    window.addEventListener("chisel:mode", stopIfDisabled);
    observer = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        const img = entry.target as HTMLImageElement;
        const photo = photos.get(img);
        if (!photo) continue;
        if (!entry.isIntersecting) {
          photo.armed = true;
          continue;
        }
        observer.unobserve(img);
        if (!photo.armed || !allowWipe() || img.closest(excluded)) continue;
        const source = img.currentSrc;
        void img.decode().then(() => {
          if (photos.get(img) !== photo || !allowWipe() || (source && source !== img.currentSrc) || img.closest(excluded)) return;
          const rect = img.getBoundingClientRect();
          if (rect.bottom <= 0 || rect.top >= innerHeight || rect.right <= 0 || rect.left >= innerWidth || !rect.width || !rect.height) return;
          const animation = img.animate(
            [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }],
            { id: "rc-image-wipe", duration: 800, easing: "cubic-bezier(.22,.75,.25,1)" },
          );
          active.set(img, animation);
          animation.onfinish = animation.oncancel = () => active.delete(img);
        }).catch(() => {});
      }
    });
  }
  photos.set(image, { armed: false });
  observer.observe(image);
  return () => {
    observer?.unobserve(image);
    photos.delete(image);
    active.get(image)?.cancel();
  };
}
