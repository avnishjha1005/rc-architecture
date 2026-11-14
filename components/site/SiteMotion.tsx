"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const ITEM_SELECTOR = "[data-motion-item]";

function directMotionItems(group: HTMLElement) {
  const authored = Array.from(group.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (item) => item.closest<HTMLElement>("[data-motion-group]") === group,
  );
  if (authored.length) return authored;
  return Array.from(group.children).filter((item): item is HTMLElement => item instanceof HTMLElement);
}

function headingTargets(group: HTMLElement, items: HTMLElement[]) {
  const authoredLines = Array.from(group.querySelectorAll<HTMLElement>("[data-motion-heading]")).filter(
    (line) => line.closest<HTMLElement>("[data-motion-group]") === group,
  );
  if (authoredLines.length) return authoredLines;

  const candidates = Array.from(group.querySelectorAll<HTMLElement>("h1, h2")).filter(
    (heading) => heading.closest<HTMLElement>("[data-motion-group]") === group,
  );

  return candidates.filter(
    (heading) => !items.some((item) => item === heading || item.contains(heading)) && !heading.hasAttribute("data-motion-no-split"),
  );
}

function itemEntrance(item: HTMLElement, itemIndex: number, groupIndex: number, hero: boolean, itemCount: number) {
  if (item.matches("header")) return { autoAlpha: 0, y: -28 };
  if (item.querySelector("[data-motion-heading]")) return { autoAlpha: 0 };

  const direction = (groupIndex + itemIndex) % 2 === 0 ? -1 : 1;
  const containsTitle = item.matches("h1,h2") || Boolean(item.querySelector("h1,h2"));
  const repeatedContent = itemCount > 3 || item.matches("article,li");
  const label = item.matches(".eyebrow,small") || item.getAttribute("class")?.toLowerCase().includes("label");

  if (hero && containsTitle) {
    return { autoAlpha: 0, y: 68 };
  }
  if (hero) return { autoAlpha: 0, x: direction * 34, y: 12 };
  if (containsTitle) return { autoAlpha: 0, x: direction * 36, y: 18 };
  if (label) return { autoAlpha: 0, x: direction * 30 };
  if (repeatedContent) return { autoAlpha: 0, y: 34, scale: 0.985 };
  return { autoAlpha: 0, x: direction * 42, y: 18 };
}

export function SiteMotion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      document.documentElement.dataset.motionState = "reduced";
      return;
    }

    let cancelled = false;
    const contexts: gsap.Context[] = [];
    const imageAnimations: gsap.core.Timeline[] = [];
    const parallaxAnimations: gsap.core.Tween[] = [];
    const imageCleanups: Array<() => void> = [];
    let scanFrame = 0;

    const startMotion = () => {
      if (cancelled) return;
      document.documentElement.dataset.motionState = "running";
      const context = gsap.context(() => {
        const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-group]"));

        groups.forEach((group, groupIndex) => {
          if (group.hasAttribute("data-motion-active")) return;
          group.setAttribute("data-motion-active", "");
          const hero = group.dataset.motionGroup === "hero";
          const subtle = group.dataset.motionVariant === "subtle";
          const items = directMotionItems(group);
          const sectionStagger = items.length > 1 ? Math.min(0.065, 0.6 / (items.length - 1)) : 0;
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            ...(hero ? {} : {
              scrollTrigger: {
                trigger: group,
                start: "top 84%",
                once: true,
              },
            }),
          });

          if (subtle && items.length) {
            timeline.fromTo(
              items,
              { autoAlpha: 0, y: hero ? 34 : 26 },
              {
                autoAlpha: 1,
                y: 0,
                duration: hero ? 0.9 : 0.72,
                stagger: Math.min(0.07, items.length > 1 ? 0.35 / (items.length - 1) : 0),
                clearProps: "opacity,visibility,transform",
              },
              hero ? 0.06 : 0,
            );
          } else {
            items.forEach((item, itemIndex) => {
              timeline.fromTo(
                item,
                itemEntrance(item, itemIndex, groupIndex, hero, items.length),
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  duration: hero ? (item.matches("header") ? 0.72 : 1.05) : 0.78,
                  clearProps: "opacity,visibility,transform",
                },
                hero ? (item.matches("header") ? 0 : 0.12 + itemIndex * 0.08) : itemIndex * sectionStagger,
              );
            });
          }

          const headings = headingTargets(group, items);
          if (!subtle) headings.forEach((heading, headingIndex) => {
            const fromLeft = (groupIndex + headingIndex) % 2 === 0;
            timeline.fromTo(
              heading,
              {
                autoAlpha: 0,
                xPercent: fromLeft ? -12 : 12,
              },
              {
                autoAlpha: 1,
                xPercent: 0,
                duration: 0.92,
                clearProps: "opacity,visibility,transform",
              },
              0.04 + headingIndex * 0.08,
            );
          });
        });

        document.querySelectorAll<HTMLElement>("[data-motion-image]").forEach((frame) => {
          if (frame.hasAttribute("data-motion-image-active")) return;
          const image = frame.matches("img") ? frame as HTMLImageElement : frame.querySelector<HTMLImageElement>("img");
          if (!image) return;
          frame.setAttribute("data-motion-image-active", "");
          const isHero = Boolean(
            frame.closest('[data-motion-group="hero"]') || frame.closest("section")?.matches(":first-of-type"),
          );
          const hasParallax = frame.hasAttribute("data-motion-parallax");

          const startParallax = () => {
            if (cancelled || !hasParallax) return;
            const parallax = gsap.to(image, {
              yPercent: 5,
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: frame.closest("section") || frame,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
            parallaxAnimations.push(parallax);
          };

          let revealed = false;
          const revealImage = (fadeIn: boolean) => {
            if (cancelled || revealed) return;
            revealed = true;
            frame.removeAttribute("data-motion-image-loading");
            if (fadeIn) gsap.set(frame, { autoAlpha: 0 });
            frame.setAttribute("data-motion-image-ready", "");
            const reveal = gsap.timeline({
              ...(isHero ? {} : {
                scrollTrigger: { trigger: frame, start: "top 88%", once: true },
              }),
            });
            imageAnimations.push(reveal);
            if (fadeIn) {
              reveal.fromTo(
                frame,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: isHero ? 1.05 : 0.72, ease: "power2.out", clearProps: "opacity,visibility" },
              );
            }
            reveal.fromTo(
                image,
                { scale: hasParallax ? 1.15 : isHero ? 1.08 : 1.045, yPercent: hasParallax ? -5 : 0 },
                {
                  scale: hasParallax ? 1.1 : 1,
                  yPercent: hasParallax ? -4 : 0,
                  duration: isHero ? 1.35 : 0.9,
                  ease: "power3.out",
                  ...(hasParallax ? {} : { clearProps: "transform" }),
                  onComplete: startParallax,
                },
                0,
            );
          };
          const decodeAndReveal = (fadeIn: boolean) => {
            if (typeof image.decode === "function") image.decode().catch(() => undefined).then(() => revealImage(fadeIn));
            else revealImage(fadeIn);
          };
          const onLoad = () => decodeAndReveal(true);
          const onError = () => revealImage(true);

          if (image.complete && image.naturalWidth > 0) decodeAndReveal(false);
          else {
            frame.setAttribute("data-motion-image-loading", "");
            image.addEventListener("load", onLoad, { once: true });
            image.addEventListener("error", onError, { once: true });
            imageCleanups.push(() => {
              image.removeEventListener("load", onLoad);
              image.removeEventListener("error", onError);
            });
          }
        });

        ScrollTrigger.refresh();
      });
      contexts.push(context);
    };

    startMotion();
    const routeRoot = document.querySelector("#main-content");
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(scanFrame);
      scanFrame = requestAnimationFrame(startMotion);
    });
    if (routeRoot) observer.observe(routeRoot, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(scanFrame);
      imageCleanups.forEach((cleanup) => cleanup());
      imageAnimations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
      parallaxAnimations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
      contexts.reverse().forEach((context) => context.revert());
      document.documentElement.removeAttribute("data-motion-state");
      document.querySelectorAll("[data-motion-active]").forEach((group) => group.removeAttribute("data-motion-active"));
      document.querySelectorAll("[data-motion-image-active]").forEach((frame) => {
        frame.removeAttribute("data-motion-image-active");
        frame.removeAttribute("data-motion-image-loading");
        frame.removeAttribute("data-motion-image-ready");
      });
    };
  }, [pathname]);

  return null;
}
