import { inReviewFrame } from "@/lib/review-media";

export function observeCards(root: HTMLElement) {
  if (!window.IntersectionObserver || !Element.prototype.animate) return () => {};
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const enabled = () => !preference.matches && (!inReviewFrame() || document.documentElement.dataset.chiselMode === "view");
  const seen = new WeakSet<HTMLElement>();
  const quietRails = new WeakSet<Element>();
  const active = new Map<HTMLElement, Animation>();
  const observer = new IntersectionObserver(entries => {
    const counts = new Map<Element, number>();
    const entering = entries.filter(entry => entry.isIntersecting).sort((a, b) =>
      a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    for (const { target } of entering) {
      const card = target as HTMLElement;
      observer.unobserve(card);
      const group = card.closest("[data-card-group]");
      if (!group || !enabled() || quietRails.has(group) || card.closest("[aria-hidden=true], [inert]") ||
        card.matches(":focus-within") || card.getAnimations().some(a => a.playState === "running")) continue;
      const index = counts.get(group) ?? 0;
      counts.set(group, index + 1);
      const animation = card.animate([{ opacity: .45, translate: "0 16px" }, { opacity: 1, translate: "0 0" }], {
        id: "rc-card-enter", duration: 500, delay: Math.min(index, 4) * 75,
        easing: "cubic-bezier(.22,.75,.25,1)", fill: "backwards",
      });
      active.set(card, animation);
      animation.onfinish = animation.oncancel = () => active.delete(card);
    }
    for (const group of counts.keys()) if (group.getAttribute("data-card-group") === "marquee") quietRails.add(group);
  });
  function visit(node: Element, register: boolean) {
    const cards = node.matches("[data-card]") ? [node as HTMLElement] : node.querySelectorAll<HTMLElement>("[data-card]");
    for (const card of cards) {
      if (!register) {
        observer.unobserve(card);
        active.get(card)?.cancel();
      } else if (!seen.has(card)) {
        seen.add(card);
        observer.observe(card);
      }
    }
  }
  visit(root, true);
  const additions = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.removedNodes) if (node instanceof Element && !node.isConnected) visit(node, false);
      for (const node of record.addedNodes) if (node instanceof Element && node.isConnected) visit(node, true);
    }
  });
  additions.observe(root, { childList: true, subtree: true });

  function interact(event: Event) {
    if (event instanceof WheelEvent && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    const el = event.target instanceof Element ? event.target : null;
    const group = el?.closest("[data-card-group]");
    if (!group) return;
    const slider = group.querySelector<HTMLElement & { swiper?: { enabled: boolean } }>(".swiper");
    const rail = slider?.swiper?.enabled || (group.matches("[role=region]") && group.scrollWidth > group.clientWidth + 1);
    if (rail) quietRails.add(group);
    for (const [card, animation] of active) if (rail ? group.contains(card) : card.contains(el)) animation.cancel();
  }
  const events = ["focusin", "pointerdown", "keydown", "wheel"];
  events.forEach(name => root.addEventListener(name, interact, { passive: true, capture: true }));
  const cancel = () => { if (!enabled()) active.forEach(a => a.cancel()); };
  preference.addEventListener("change", cancel);
  window.addEventListener("chisel:mode", cancel);
  return () => {
    observer.disconnect();
    additions.disconnect();
    active.forEach(a => a.cancel());
    events.forEach(name => root.removeEventListener(name, interact, true));
    preference.removeEventListener("change", cancel);
    window.removeEventListener("chisel:mode", cancel);
  };
}
