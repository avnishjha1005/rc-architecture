import { textHold } from "./reveal-timing";

const timing = { duration: 1109, easing: "cubic-bezier(.17,.84,.44,1)", fill: "both" } as const;
const selector = "h1, h2";
const excluded = "nav, form, button, a, [aria-hidden=true], .swiper";
const revealed = new WeakSet<HTMLElement>();

type Fragment = { rect: DOMRect; node: HTMLElement; style: CSSStyleDeclaration; lineTop: number; suffix?: boolean };

function fragmentsOf(heading: HTMLElement, words: boolean) {
  const fragments: Fragment[] = [];
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof HTMLImageElement) {
      const image = document.createElement("img");
      image.src = node.currentSrc || node.src;
      image.alt = "";
      const rect = node.getBoundingClientRect();
      fragments.push({ rect, node: image, style: getComputedStyle(node), lineTop: node.closest(".hero__bottomline")?.getBoundingClientRect().top ?? rect.top, suffix: Boolean(node.closest(".hero__trademark")) });
      continue;
    }
    if (!(node instanceof Text) || !node.parentElement || !node.data.trim()) continue;
    if (node.parentElement.closest("[hidden], .sr-only, [aria-hidden=true]")) continue;
    const style = getComputedStyle(node.parentElement);
    const runs: { start: number; end: number; top: number }[] = [];
    const record = (start: number, end: number) => {
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const last = runs.at(-1);
      if (!words && last && Math.abs(rect.top - last.top) < 1) last.end = end;
      else runs.push({ start, end, top: rect.top });
    };
    for (const match of node.data.matchAll(/\S+/gu)) {
      const start = match.index;
      const end = start + match[0].length;
      range.setStart(node, start);
      range.setEnd(node, end);
      if (words || range.getClientRects().length < 2) record(start, end);
      else {
        let offset = start;
        for (const character of match[0]) {
          range.setStart(node, offset);
          range.setEnd(node, offset + character.length);
          record(offset, offset + character.length);
          offset += character.length;
        }
      }
    }
    for (const run of runs) {
      range.setStart(node, run.start);
      range.setEnd(node, run.end);
      const text = document.createElement("span");
      text.textContent = range.toString();
      Object.assign(text.style, {
        font: style.font, letterSpacing: style.letterSpacing, wordSpacing: style.wordSpacing,
        textTransform: style.textTransform, color: style.color, whiteSpace: "nowrap",
      });
      const rect = range.getBoundingClientRect();
      fragments.push({ rect, node: text, style, lineTop: node.parentElement.closest(".hero__topline, .hero__bottomline")?.getBoundingClientRect().top ?? rect.top });
    }
  }
  return fragments;
}

function animateMeasuredText(heading: HTMLElement, host: HTMLElement, delay: number, support: boolean, done: () => void) {
  const words = heading.matches("#hero-heading, .about-lead h2");
  const fragments = fragmentsOf(heading, words);
  if (!fragments.length) return finishWith([], done);
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.inert = true;
  layer.dataset.headingOverlay = "";
  if (support) layer.dataset.supportOverlay = "";
  host.append(layer);
  const origin = layer.getBoundingClientRect();
  const animations: Animation[] = [];
  const corrections: HTMLElement[] = [];
  const groups: Fragment[][] = [];
  for (const fragment of fragments) {
    const last = groups.at(-1);
    const sameLine = last && (support
      ? Math.min(last[0].rect.bottom, fragment.rect.bottom) - Math.max(last[0].rect.top, fragment.rect.top) > Math.min(last[0].rect.height, fragment.rect.height) / 2
      : Math.abs(last[0].lineTop - fragment.lineTop) < parseFloat(fragment.style.fontSize) / 3);
    if (sameLine) last.push(fragment);
    else groups.push([fragment]);
  }
  const range = document.createRange();
  const units: HTMLElement[] = [];
  for (const group of groups) {
    const mask = document.createElement("div");
    const ink = document.createElement("div");
    const top = Math.min(...group.map(({ rect }) => rect.top));
    const left = Math.min(...group.map(({ rect }) => rect.left)) - 2;
    const width = Math.max(...group.map(({ rect }) => rect.right)) - left + 2;
    const height = Math.max(...group.map(({ rect }) => rect.bottom)) - top;
    mask.dataset.headingMask = "line";
    Object.assign(mask.style, { left: `${left - origin.left}px`, top: `${top - origin.top}px`, width: `${width}px`, height: `${height}px` });
    mask.append(ink);
    layer.append(mask);
    if (!words) units.push(ink);
    for (const fragment of group) {
      const { node, rect } = fragment;
      Object.assign(node.style, { position: "absolute", left: `${rect.left - left}px`, top: `${rect.top - top}px` });
      if (node instanceof HTMLImageElement) Object.assign(node.style, { width: `${rect.width}px`, height: `${rect.height}px` });
      if (words && (!fragment.suffix || !ink.lastElementChild)) {
        const word = document.createElement("div");
        ink.append(word);
        units.push(word);
      }
      (words ? ink.lastElementChild! : ink).append(node);
      if (node instanceof HTMLSpanElement) corrections.push(node);
    }
  }
  const offsets = corrections.map(node => {
    range.selectNodeContents(node);
    return node.getBoundingClientRect().top - range.getBoundingClientRect().top;
  });
  corrections.forEach((node, i) => { node.style.marginTop = `${offsets[i]}px`; });
  units.forEach((unit, index) => {
    if (support) unit.dataset.supportLine = "";
    else unit.dataset.headingUnit = words ? "word" : "line";
    animations.push(unit.animate([{ transform: "translateY(101%)" }, { transform: "translateY(0%)" }], { ...timing, delay: delay + index * 100 }));
  });
  if (support) heading.dataset.textLinesHidden = "";
  return finishWith(animations, () => {
    layer.remove();
    if (support) delete heading.dataset.textLinesHidden;
    done();
  });
}

function finishWith(animations: Animation[], done: () => void) {
  let stopped = false;
  const finish = () => {
    if (stopped) return;
    stopped = true;
    for (const animation of animations) animation.cancel();
    done();
  };
  void Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);
  return finish;
}

export function animateTextLines(element: HTMLElement, host: HTMLElement, delay: number, done: () => void): () => void {
  const interactive = "a, button, input, select, textarea, summary, [tabindex], [contenteditable=true], [role=button], [role=link]";
  if (!element.isConnected || !host.isConnected || !element.animate || matchMedia("(prefers-reduced-motion: reduce)").matches ||
      element.closest("h1, h2, a, button, summary, [contenteditable=true], [role=link], [role=button]") ||
      element.matches(interactive) || element.querySelector(`h1, h2, svg, img, ${interactive}`)) return finishWith([], done);
  return animateMeasuredText(element, host, delay, true, done);
}

export function observeHeadings(root: HTMLElement, host: HTMLElement, uncovered?: Promise<unknown>) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const breakpoint = matchMedia("(max-width: 767.98px)");
  const pending = new Map<Element, HTMLElement>();
  const playing = new Map<HTMLElement, () => void>();
  const observed = new WeakSet<HTMLElement>();
  const hidden = new Map<HTMLElement, Animation[]>();
  const show = (heading: HTMLElement) => {
    hidden.get(heading)?.forEach(animation => animation.cancel());
    hidden.delete(heading);
  };
  let observer: IntersectionObserver;
  let stopped = false;

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        const heading = pending.get(target);
        if (!isIntersecting || !heading) continue;
        pending.delete(target);
        observer.unobserve(target);
        void Promise.all([document.fonts.ready, uncovered]).then(() => {
          if (stopped || !heading.isConnected || preference.matches || !hidden.has(heading)) return;
          try {
            const done = () => {
              revealed.add(heading);
              show(heading);
              playing.delete(heading);
            };
            if (heading.hasAttribute("data-live-heading")) {
              const animations = [...heading.querySelectorAll("[data-live-mask] > span")].map((line, index) =>
                line.animate([{ transform: "translateY(101%)" }, { transform: "translateY(0%)" }], { ...timing, delay: textHold + index * 100 }));
              show(heading);
              playing.set(heading, finishWith(animations, done));
            } else {
              playing.set(heading, animateMeasuredText(heading, host, textHold, false, done));
            }
          } catch {
            show(heading);
          }
        });
      }
    }, { rootMargin: breakpoint.matches ? "0px" : `0px 0px -${Math.round(innerHeight * .15)}px 0px` });
    for (const target of pending.keys()) observer.observe(target);
  };
  const register = (heading: HTMLElement) => {
    if (observed.has(heading) || !heading.closest("main") || heading.closest(excluded) || heading.querySelector("a, button, input")) return;
    observed.add(heading);
    if (preference.matches || revealed.has(heading)) return;
    const boxes = getComputedStyle(heading).display === "contents" ? [...heading.children] : [heading];
    const target = boxes[0];
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0 && boxes.some(box => box.getAnimations().some(animation =>
      animation instanceof CSSAnimation && animation.animationName === "rc-heading-bootstrap" && animation.playState === "finished"))) {
      revealed.add(heading);
      return;
    }
    hidden.set(heading, boxes.map(box => box.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: "both" })));
    pending.set(target, heading);
    observer.observe(target);
  };
  observe();
  root.querySelectorAll<HTMLElement>(selector).forEach(register);
  host.dataset.headingManaged = "";
  const additions = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.matches(selector)) register(node);
      node.querySelectorAll<HTMLElement>(selector).forEach(register);
    }
  });
  additions.observe(root, { childList: true, subtree: true });
  const resize = () => {
    for (const finish of playing.values()) finish();
    observe();
  };
  const reduce = () => {
    if (!preference.matches) return;
    for (const finish of playing.values()) finish();
    pending.clear();
    observer.disconnect();
    for (const heading of hidden.keys()) show(heading);
  };
  preference.addEventListener("change", reduce);
  window.addEventListener("resize", resize);
  return () => {
    stopped = true;
    observer.disconnect();
    additions.disconnect();
    preference.removeEventListener("change", reduce);
    window.removeEventListener("resize", resize);
    for (const finish of playing.values()) finish();
    for (const heading of hidden.keys()) show(heading);
    delete host.dataset.headingManaged;
  };
}
