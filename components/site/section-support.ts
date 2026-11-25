import { textHold } from "./reveal-timing";
import { animateTextLines } from "./heading-reveals";

const excluded = "[data-card], nav, form, button, h1, h2, [data-site-header], [aria-hidden=true], [aria-live], [data-count-group], [data-motion-image], .swiper, [role=tablist], [role=tabpanel], [role=region], .sr-only";
const label = ".eyebrow, .service-card__number, .project-card__category, time[data-motion-item], [data-motion-item] > h1 + div > small, [data-motion-group=hero] p:has(+ h1), [data-motion-item] > p:has(+ h2), [data-motion-item] > div > small, #client-index [role=group] > div:first-child > span";
const title = ".ideology h3, .service-card__content h3, [data-support-intro] h3, h3[data-motion-item], [data-motion-item] > h3";
const copy = ".hero__intro, .about-lead__copy, .section-heading__intro, .labs-intro__top p, .contact-section__copy p, .newsletter-card__form > p, .ideology p, .service-card__content p, p[data-motion-item], [data-motion-item] > p, [data-motion-item] > h1 + div > p, [data-motion-item] > h2 + span, [data-motion-group] h2 ~ p, [data-support-intro] p, blockquote[data-motion-item]";
const detail = ".service-card__content li, ul[data-motion-item] > li, main > article [data-motion-group] dl > div > :is(dt,dd)";
const action = "a.pill-link, a[data-support-action], a[data-motion-item][href], .footer__email";
const rule = "[data-draw-rule]";
const text = `:where(${label}, ${title}, ${copy}, ${detail}):not(a *, [tabindex], [contenteditable], :has(a, button, input, select, textarea, summary, [tabindex], [contenteditable], img, svg, [aria-live], .sr-only))`;
const selection = `:is(${text}, ${rule}, ${action}):not(:is(${excluded}), :is(${excluded}) *)`;
const bootstrapText = `[data-heading-host]:not([data-support-managed]) ~ #main-content main ${text}:not(:is(${excluded}), :is(${excluded}) *)`;

export const supportBootstrap = `
@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  ${bootstrapText} { animation: rc-support-bootstrap 0s 1800ms both; }
  [data-support-waiting="text"] { opacity: 0; }
  [data-support-waiting="action"]:not(:focus-visible) { opacity: .8; }
  [data-support-waiting="rule"] { background-size: 0% 1px; }
}
@keyframes rc-support-bootstrap { from { opacity: 0; } to { opacity: 1; } }
`;

export function observeSectionSupport(root: HTMLElement, host: HTMLElement, uncovered?: Promise<unknown>) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pending = new Set<HTMLElement>();
  const seen = new WeakSet<HTMLElement>();
  const active = new Map<HTMLElement, () => void>();
  let stopped = false;
  let observer: IntersectionObserver;

  const reveal = (element: HTMLElement) => {
    if (!pending.delete(element) || reduced.matches || stopped) return;
    const kind = element.dataset.supportWaiting;
    delete element.dataset.supportWaiting;
    if (!element.isConnected || element.matches(":focus-within")) return;
    const isRule = kind === "rule";
    const isAction = kind === "action";
    const isLabel = element.matches(label);
    const isTitle = element.matches(title);
    const isDetail = element.matches(detail);
    const row = element.closest("li, dl > div");
    const rowIndex = isDetail && row?.parentElement ? Math.min(3, Array.prototype.indexOf.call(row.parentElement.children, row)) : 0;
    const delay = textHold + (isRule || isLabel ? 0 : isTitle ? 40 : isDetail ? 155 + rowIndex * 40 : isAction ? 210 : 100);
    if (!isRule && !isAction) {
      try {
        active.set(element, animateTextLines(element, host, delay, () => active.delete(element)));
      } catch {
        active.delete(element);
      }
      return;
    }
    const frames: Keyframe[] = isRule
      ? [{ backgroundSize: "0% 1px" }, { backgroundSize: "100% 1px" }]
      : [{ opacity: .8 }, { opacity: 1 }];
    const animation = element.animate(frames, { duration: isRule ? 650 : 480, delay, easing: "cubic-bezier(.17,.84,.44,1)", fill: "backwards" });
    animation.id = isRule ? "rc-section-rule" : "rc-section-action";
    active.set(element, () => animation.cancel());
    animation.onfinish = animation.oncancel = () => active.delete(element);
  };

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting);
      entering.forEach(({ target }) => observer.unobserve(target));
      if (entering.length) void Promise.all([document.fonts.ready, uncovered]).then(() => {
        for (const { target } of entering) reveal(target as HTMLElement);
      });
    }, { rootMargin: innerWidth < 768 ? "0px" : `0px 0px -${Math.round(innerHeight * .15)}px 0px` });
    pending.forEach(target => observer.observe(target));
  };
  const register = (element: HTMLElement) => {
    if (seen.has(element) || !element.closest("main")) return;
    seen.add(element);
    if (element.getAnimations().some(animation => animation instanceof CSSAnimation && animation.animationName === "rc-support-bootstrap" && animation.playState === "finished")) {
      const box = element.getBoundingClientRect();
      if (box.top < innerHeight && box.bottom > 0) return;
    }
    element.dataset.supportWaiting = element.matches(rule) ? "rule" : element.matches(action) ? "action" : "text";
    pending.add(element);
    observer.observe(element);
  };
  const show = (element: HTMLElement) => {
    pending.delete(element);
    observer?.unobserve(element);
    delete element.dataset.supportWaiting;
    active.get(element)?.();
  };
  const additions = new MutationObserver(records => {
    for (const record of records) {
      if (record.target instanceof HTMLElement) {
        const changed = record.target.closest<HTMLElement>("[data-text-lines-hidden], [data-support-waiting='text']");
        if (changed) show(changed);
      }
      for (const node of record.removedNodes) {
        if (!(node instanceof HTMLElement) || node.isConnected) continue;
        show(node);
        node.querySelectorAll<HTMLElement>("[data-support-waiting], [data-text-lines-hidden]").forEach(show);
      }
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement) || node.closest(excluded)) continue;
        if (node.matches(selection)) register(node);
        node.querySelectorAll<HTMLElement>(selection).forEach(register);
      }
    }
  });
  const enterFocus = (event: FocusEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const element = target.closest<HTMLElement>(`[data-text-lines-hidden], [data-support-waiting], ${action}`);
    if (element) show(element);
  };
  const clear = () => {
    additions.disconnect();
    observer?.disconnect();
    pending.forEach(element => { delete element.dataset.supportWaiting; });
    pending.clear();
    active.forEach(stop => stop());
    active.clear();
  };
  const configure = () => {
    clear();
    if (!reduced.matches) {
      observe();
      root.querySelectorAll<HTMLElement>(selection).forEach(register);
      additions.observe(root, { childList: true, subtree: true });
    }
    host.dataset.supportManaged = "";
  };
  const resize = () => {
    active.forEach(stop => stop());
    if (!reduced.matches) observe();
  };
  configure();
  root.addEventListener("focusin", enterFocus);
  reduced.addEventListener("change", configure);
  window.addEventListener("resize", resize);
  return () => {
    stopped = true;
    clear();
    root.removeEventListener("focusin", enterFocus);
    reduced.removeEventListener("change", configure);
    window.removeEventListener("resize", resize);
    delete host.dataset.supportManaged;
  };
}
