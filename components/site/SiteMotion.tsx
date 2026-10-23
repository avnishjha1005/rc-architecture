"use client";

import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ITEM_SELECTOR = "[data-motion-item]";

export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    let context: gsap.Context | undefined;
    const start = window.setTimeout(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      context = gsap.context(() => {
        document.querySelectorAll<HTMLElement>("[data-motion-group]").forEach((group) => {
          const items = Array.from(group.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
            (item) => item.closest("[data-motion-group]") === group,
          );
          if (!items.length) return;

          const hero = group.dataset.motionGroup === "hero";
          gsap.set(items, { autoAlpha: 0, y: hero ? 34 : 26 });
          group.setAttribute("data-motion-active", "");

          const reveal = () => {
            gsap.to(items, {
              autoAlpha: 1,
              y: 0,
              duration: hero ? 1 : 0.78,
              stagger: hero ? 0.085 : 0.07,
              delay: hero ? 0.08 : 0,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
            });
          };

          if (hero || group.getBoundingClientRect().top < window.innerHeight * 0.88) {
            reveal();
            return;
          }

          const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            reveal();
            observer.disconnect();
          }, { threshold: 0.08, rootMargin: "0px 0px -7%" });
          observer.observe(group);
          observers.push(observer);
        });

        document.querySelectorAll<HTMLElement>("[data-motion-image]").forEach((frame) => {
          const image = frame.matches("img") ? frame : frame.querySelector<HTMLElement>("img");
          if (!image || image.closest("[data-motion-image]") !== frame) return;

          const mobileHero = image.matches(".hero__image") && window.matchMedia("(max-width: 900px)").matches;
          gsap.set(image, { scale: mobileHero ? 1 : 1.055 });
          frame.setAttribute("data-motion-image-active", "");
          const settle = () => gsap.to(image, {
            scale: 1,
            duration: 1.35,
            ease: "power3.out",
            clearProps: "transform",
          });

          if (frame.getBoundingClientRect().top < window.innerHeight) {
            settle();
            return;
          }

          const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            settle();
            observer.disconnect();
          }, { threshold: 0.16 });
          observer.observe(frame);
          observers.push(observer);
        });
      });
    }, 250);

    return () => {
      window.clearTimeout(start);
      observers.forEach((observer) => observer.disconnect());
      context?.revert();
      document.querySelectorAll("[data-motion-active]").forEach((group) => group.removeAttribute("data-motion-active"));
      document.querySelectorAll("[data-motion-image-active]").forEach((frame) => frame.removeAttribute("data-motion-image-active"));
    };
  }, [pathname]);

  return null;
}
