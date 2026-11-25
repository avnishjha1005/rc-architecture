"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { HostedChisel } from "use-chisel/hosted";
import type { ReviewFrame } from "@/components/site/reveal-timing";
import { navbarStill } from "./navbar-still";
import styles from "./ReviewWorkspace.module.css";

export default function HostedWorkspace(props: ComponentProps<typeof HostedChisel>) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const updatePhoto = (image: HTMLImageElement) => {
      const src = image.getAttribute("src") || "";
      if (!image.matches(".chisel-avatar > img") || !/^https:\/\/lh3\.googleusercontent\.com\/a-?\/[a-zA-Z0-9_=-]+$/.test(src)) return;
      image.src = `/_next/image?url=${encodeURIComponent(src)}&w=64&q=75`;
    };
    root.querySelectorAll<HTMLImageElement>(".chisel-avatar > img").forEach(updatePhoto);
    const photos = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "attributes" && record.target instanceof HTMLImageElement) updatePhoto(record.target);
        for (const node of record.addedNodes) {
          if (node instanceof HTMLImageElement) updatePhoto(node);
          else if (node instanceof Element) node.querySelectorAll<HTMLImageElement>(".chisel-avatar > img").forEach(updatePhoto);
        }
      }
    });
    photos.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    let clear: (() => void) | undefined;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function begin(event: Event) {
      if (!(event.target instanceof HTMLIFrameElement) || !event.target.matches("[data-chisel-preview]")) return;
      const frame: ReviewFrame = event.target;
      clear?.();
      const mobile = frame.clientWidth <= 760;
      const previousDocument = frame.contentDocument;
      const outgoing = previousDocument?.querySelector<HTMLElement>("[data-site-header]");
      let uncover: () => void;
      frame.rcCurtainFinished = new Promise<void>(resolve => { uncover = resolve; });
      const curtain = document.createElement("div");
      curtain.className = "rc-review-curtain";
      curtain.setAttribute("aria-hidden", "true");
      curtain.hidden = true;
      if (outgoing?.dataset.siteHeader === "light") curtain.style.backgroundColor = "#fff";
      const pinNavbar = outgoing && Math.abs(outgoing.getBoundingClientRect().top) < 1;
      frame.after(curtain);
      const outgoingWindow = previousDocument?.defaultView;
      let nextFrame = 0;
      let timeout: number | undefined;
      const cover = () => {
        curtain.hidden = false;
        if (pinNavbar && outgoing.getBoundingClientRect().width) {
          curtain.append(navbarStill(outgoing));
        }
        nextFrame = requestAnimationFrame(waitForDestination);
        timeout = window.setTimeout(cleanup, 12000);
      };
      outgoingWindow?.addEventListener("pagehide", cover, { once: true });
      function waitForDestination() {
        const destination = frame.contentDocument;
        const header = destination?.querySelector<HTMLElement>("[data-site-header]");
        const painted = header ? header.getBoundingClientRect().height > 0 : destination?.readyState === "complete";
        if (!destination || destination === previousDocument || !painted || destination.querySelector("main.loading-page")?.getBoundingClientRect().height) {
          nextFrame = requestAnimationFrame(waitForDestination);
          return;
        }
        window.clearTimeout(timeout);
        if (motion.matches) { cleanup(); return; }
        const animation = curtain.animate(mobile
          ? [{ opacity: 1 }, { opacity: 0 }]
          : [{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }], {
          duration: mobile ? 300 : 850, easing: mobile ? "ease-out" : "cubic-bezier(.8,0,.2,1)", fill: "forwards",
        });
        animation.onfinish = cleanup;
      }
      function cleanup() {
        window.clearTimeout(timeout);
        cancelAnimationFrame(nextFrame);
        outgoingWindow?.removeEventListener("pagehide", cover);
        motion.removeEventListener("change", cleanup);
        for (const animation of curtain.getAnimations()) {
          animation.onfinish = null;
          animation.cancel();
        }
        curtain.remove();
        delete frame.rcCurtainFinished;
        uncover();
        clear = undefined;
      }
      motion.addEventListener("change", cleanup, { once: true });
      clear = cleanup;
    }
    root.addEventListener("rc:preview-navigation", begin);
    return () => { photos.disconnect(); root.removeEventListener("rc:preview-navigation", begin); clear?.(); };
  }, []);

  return <div ref={host} className={styles.workspace} style={{ display: "contents" }}><HostedChisel {...props} /></div>;
}
