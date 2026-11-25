"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore, ViewTransition, type MouseEvent, type ReactNode } from "react";

const subscribe = () => () => {};
const isReviewFrame = () => window.frameElement?.hasAttribute("data-chisel-preview") === true;
const allowSiteTransition = () => !isReviewFrame();
const serverSnapshot = () => false;

function captureHeader() {
  const header = document.querySelector("[data-site-header]");
  document.documentElement.toggleAttribute("data-rc-pin-navbar", Boolean(header && Math.abs(header.getBoundingClientRect().top) < 1));
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const siteTransition = useSyncExternalStore(subscribe, allowSiteTransition, serverSnapshot);
  const status = useRef<HTMLSpanElement>(null);
  const pendingTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const label = status.current;
    function clear() {
      clearTimeout(pendingTimer.current);
      if (label) label.textContent = "";
    }
    window.addEventListener("pageshow", clear);
    window.addEventListener("popstate", captureHeader);
    return () => {
      clear();
      window.removeEventListener("pageshow", clear);
      window.removeEventListener("popstate", captureHeader);
    };
  }, [pathname]);

  function handleLink(event: MouseEvent<HTMLDivElement>) {
    const mode = document.documentElement.dataset.chiselMode;
    const review = isReviewFrame();
    if ((review && mode && mode !== "view") || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self") ||
        link.origin !== location.origin || (link.pathname === location.pathname && link.search === location.search)) return;
    captureHeader();
    if (link.pathname !== location.pathname) {
      clearTimeout(pendingTimer.current);
      pendingTimer.current = window.setTimeout(() => {
        if (status.current) status.current.textContent = "Loading page";
        pendingTimer.current = window.setTimeout(() => { if (status.current) status.current.textContent = ""; }, 12000);
      }, 200);
    }
    if (review) {
      document.dispatchEvent(new Event("rc:close-navigation"));
      event.stopPropagation();
      if (mode === "view") window.frameElement?.dispatchEvent(new Event("rc:preview-navigation", { bubbles: true }));
    }
  }

  return (
    <>
      {siteTransition && !/^\/(chisel|studio|feedback)(\/|$)/.test(pathname) && (
        <ViewTransition key={pathname} name="rc-route-signal" share="auto" default="none">
          <span className="rc-route-signal" aria-hidden="true" />
        </ViewTransition>
      )}
      <span className="rc-navigation-status" role="status"><span className="sr-only" ref={status} /></span>
      <div id="main-content" tabIndex={-1} onClickCapture={handleLink}>{children}</div>
    </>
  );
}
