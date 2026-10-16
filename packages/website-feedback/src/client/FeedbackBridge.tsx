"use client";

import { useEffect } from "react";
import type { FeedbackClientMessage, FeedbackHostMessage, FeedbackPin, FeedbackTarget } from "../types";

const OVERLAY = "data-rc-feedback-overlay";

function post(message: FeedbackClientMessage) {
  window.parent.postMessage(message, window.location.origin);
}

function selectorFor(element: Element) {
  if (element === document.body) return "body";
  const stable = element.closest<HTMLElement>("[data-feedback-id], [id]");
  const stableSelector = stable?.dataset.feedbackId
    ? `[data-feedback-id="${CSS.escape(stable.dataset.feedbackId)}"]`
    : stable?.id ? `#${CSS.escape(stable.id)}` : "";
  if (stable === element) return stableSelector;
  const parts: string[] = [];
  let node: Element | null = element;
  while (node && node !== stable && node !== document.body) {
    let part = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    if (parent) {
      const same = Array.from(parent.children).filter((child) => child.tagName === node!.tagName);
      if (same.length > 1) part += `:nth-of-type(${same.indexOf(node) + 1})`;
    }
    parts.unshift(part);
    node = parent;
  }
  return `${stableSelector || "body"} > ${parts.join(" > ")}`;
}

function labelFor(element: HTMLElement) {
  return (element.getAttribute("aria-label") || element.getAttribute("alt") || element.textContent || element.tagName)
    .replace(/\s+/g, " ").trim().slice(0, 160) || element.tagName.toLowerCase();
}

function targetFor(element: HTMLElement, event: MouseEvent, breakpoint: string): FeedbackTarget {
  const rect = element.getBoundingClientRect();
  const path = `${window.location.pathname}${window.location.search}`.replace(/([?&])__feedback=1(&|$)/, "$1").replace(/[?&]$/, "") || "/";
  return {
    pagePath: path, pageUrl: `${window.location.origin}${path}`, elementSelector: selectorFor(element), elementLabel: labelFor(element),
    anchorX: rect.width ? (event.clientX - rect.left) / rect.width : .5,
    anchorY: rect.height ? (event.clientY - rect.top) / rect.height : .5,
    fallbackX: event.clientX + window.scrollX, fallbackY: event.clientY + window.scrollY, scrollY: window.scrollY,
    viewportWidth: window.innerWidth, viewportHeight: window.innerHeight, breakpoint,
    browserContext: `${navigator.userAgent} · ${window.innerWidth}×${window.innerHeight} @${window.devicePixelRatio || 1}x`,
  };
}

function blobFromCanvas(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

async function capture(target: HTMLElement | null, options: FeedbackHostMessage & { type: "rc-feedback:capture" }) {
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(document.documentElement, {
    x: window.scrollX, y: window.scrollY, width: window.innerWidth, height: window.innerHeight,
    windowWidth: window.innerWidth, windowHeight: window.innerHeight, scrollX: window.scrollX, scrollY: window.scrollY,
    useCORS: true, logging: false, scale: Math.min(window.devicePixelRatio || 1, 2),
    ignoreElements: (element) => element.hasAttribute(OVERLAY),
  });
  if (target) {
    const rect = target.getBoundingClientRect();
    const scaleX = canvas.width / window.innerWidth;
    const scaleY = canvas.height / window.innerHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.strokeStyle = "#ff3022"; context.lineWidth = Math.max(3, 3 * scaleX);
      context.strokeRect(rect.left * scaleX, rect.top * scaleY, rect.width * scaleX, rect.height * scaleY);
    }
  }
  let output = canvas;
  const largest = Math.max(canvas.width, canvas.height);
  if (largest > options.options.maxDimension) {
    const ratio = options.options.maxDimension / largest;
    output = document.createElement("canvas");
    output.width = Math.round(canvas.width * ratio); output.height = Math.round(canvas.height * ratio);
    output.getContext("2d")?.drawImage(canvas, 0, 0, output.width, output.height);
  }
  let quality = options.options.quality;
  let blob = await blobFromCanvas(output, quality);
  while (blob && blob.size > options.options.maxBytes && quality > .35) {
    quality -= .1; blob = await blobFromCanvas(output, quality);
  }
  if (!blob || blob.size > options.options.maxBytes) throw new Error("Screenshot exceeds the configured size limit.");
  return blob;
}

export function FeedbackBridge() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (window.parent === window || query.get("__feedback") !== "1") return;
    let mode: "browse" | "comment" = "browse";
    let breakpoint = "desktop";
    let pins: FeedbackPin[] = [];
    let hovered: HTMLElement | null = null;
    let selected: HTMLElement | null = null;
    let active = true;
    let resizeObserver: ResizeObserver | undefined;

    const root = document.createElement("div"); root.setAttribute(OVERLAY, "");
    Object.assign(root.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "2147483000" });
    const outline = document.createElement("div"); outline.setAttribute(OVERLAY, "");
    Object.assign(outline.style, { display: "none", position: "fixed", border: "2px solid #ff3022", background: "rgba(255,48,34,.08)", pointerEvents: "none" });
    root.append(outline); document.body.append(root);

    function resolve(selector: string) { try { return selector ? document.querySelector<HTMLElement>(selector) : null; } catch { return null; } }
    function positionOutline(element: HTMLElement | null) {
      if (!element) { outline.style.display = "none"; return; }
      const rect = element.getBoundingClientRect();
      Object.assign(outline.style, { display: "block", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    }
    function renderPins() {
      root.querySelectorAll("button").forEach((node) => node.remove());
      pins.forEach((pin) => {
        const element = resolve(pin.elementSelector);
        const rect = element?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width * pin.anchorX : pin.fallbackX - window.scrollX;
        const y = rect ? rect.top + rect.height * pin.anchorY : pin.fallbackY - window.scrollY;
        const button = document.createElement("button"); button.type = "button"; button.textContent = String(pin.number); button.setAttribute(OVERLAY, "");
        button.title = element ? `Feedback ${pin.number}` : `Feedback ${pin.number} · anchor unavailable`;
        Object.assign(button.style, { position: "fixed", left: `${x}px`, top: `${y}px`, transform: "translate(-50%,-50%)", width: "28px", height: "28px", borderRadius: "50%", border: "2px solid white", background: pin.status === "resolved" ? "#777" : "#ff3022", color: "white", font: "700 11px Arial", cursor: "pointer", pointerEvents: "auto", boxShadow: "0 2px 10px #0005" });
        button.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); post({ type: "rc-feedback:pin-focus", id: pin.id }); });
        root.append(button);
      });
    }
    function updatePositions() { positionOutline(selected || (mode === "comment" ? hovered : null)); renderPins(); }
    function onMove(event: PointerEvent) {
      if (mode !== "comment") return;
      const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      hovered = element?.closest<HTMLElement>(`[${OVERLAY}]`) ? null : element;
      positionOutline(hovered);
    }
    function onClick(event: MouseEvent) {
      const element = event.target as HTMLElement | null;
      if (!element || element.closest(`[${OVERLAY}]`)) return;
      if (mode === "comment") {
        event.preventDefault(); event.stopPropagation(); selected = element; positionOutline(selected);
        post({ type: "rc-feedback:target", target: targetFor(element, event, breakpoint) });
        return;
      }
      const anchor = element.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || anchor.target === "_blank") return;
      event.preventDefault(); post({ type: "rc-feedback:navigate", path: `${url.pathname}${url.search}${url.hash}` });
    }
    async function onMessage(event: MessageEvent<FeedbackHostMessage>) {
      if (event.origin !== window.location.origin || event.source !== window.parent || !active) return;
      const message = event.data;
      if (message.type === "rc-feedback:state") { mode = message.mode; pins = message.pins; breakpoint = message.breakpoint; if (mode === "browse") hovered = null; updatePositions(); }
      if (message.type === "rc-feedback:clear-target") { selected = null; positionOutline(mode === "comment" ? hovered : null); }
      if (message.type === "rc-feedback:capture") {
        try { post({ type: "rc-feedback:capture-result", requestId: message.requestId, blob: await capture(selected, message) }); }
        catch (error) { post({ type: "rc-feedback:capture-result", requestId: message.requestId, error: error instanceof Error ? error.message : "Capture failed" }); }
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        selected = null; hovered = null; positionOutline(null); post({ type: "rc-feedback:cancel" });
      }
    }

    fetch("/api/feedback/session", { cache: "no-store" }).then((response) => {
      if (!response.ok) return;
      window.addEventListener("message", onMessage); window.addEventListener("scroll", updatePositions, { passive: true });
      window.addEventListener("resize", updatePositions); document.addEventListener("pointermove", onMove, true);
      document.addEventListener("click", onClick, true); document.addEventListener("keydown", onKey, true);
      resizeObserver = new ResizeObserver(updatePositions); resizeObserver.observe(document.body);
      post({ type: "rc-feedback:ready", path: `${window.location.pathname}${window.location.search}`.replace(/([?&])__feedback=1(&|$)/, "$1").replace(/[?&]$/, "") || "/" });
    });
    return () => { active = false; resizeObserver?.disconnect(); root.remove(); window.removeEventListener("message", onMessage); window.removeEventListener("scroll", updatePositions); window.removeEventListener("resize", updatePositions); document.removeEventListener("pointermove", onMove, true); document.removeEventListener("click", onClick, true); document.removeEventListener("keydown", onKey, true); };
  }, []);
  return null;
}
