export const textHold = 120;

export type ReviewFrame = HTMLIFrameElement & { rcCurtainFinished?: Promise<void> };

export function destinationUncovered(navigating: boolean): Promise<unknown> | undefined {
  const frame = window.frameElement as ReviewFrame | null;
  if (frame?.hasAttribute("data-chisel-preview")) return frame.rcCurtainFinished;

  const page = document as Document & { activeViewTransition?: ViewTransition | null };
  if (page.activeViewTransition) return page.activeViewTransition.finished.catch(() => {});
  if (!navigating || !document.startViewTransition || "activeViewTransition" in document) return;

  return new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
    const wipe = document.getAnimations().find(a => a instanceof CSSAnimation && (a.animationName === "rc-page-wipe" || a.animationName === "rc-page-fade"));
    if (wipe) void wipe.finished.then(() => resolve(), () => resolve());
    else resolve();
  })));
}
