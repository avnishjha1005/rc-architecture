"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/content/home";
import { PillAction } from "@/components/ui/PillAction";
import { Logo } from "./Logo";

type HeaderProps = { brandName: string; navigation: NavigationItem[]; cta: NavigationItem; theme?: "light" | "dark" };

export function Header({ brandName, navigation, cta, theme = "dark" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const firstLink = menu?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    function onPointerDown(event: PointerEvent) {
      if (!menu?.contains(event.target as Node)) setMenuOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && menu) {
        const focusable = Array.from(menu.querySelectorAll<HTMLElement>("button, a[href]"));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function current(href: string) {
    const linkPath = href.split("#")[0] || "/";
    return linkPath === pathname ? "page" as const : undefined;
  }

  return (
    <header className={`site-header site-header--${theme}`}>
      <Logo name={brandName} tone={theme} />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href} aria-current={current(item.href)}>{item.label}</Link>)}
      </nav>
      <PillAction className="header-cta" href={cta.href}>{cta.label}</PillAction>
      <div className={`mobile-nav${menuOpen ? " is-open" : ""}`} ref={menuRef}>
        <button ref={triggerRef} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls={menuId} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <nav id={menuId} aria-label="Mobile navigation">
          {navigation.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href} aria-current={current(item.href)} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
          <PillAction className="mobile-nav__cta" href={cta.href} onClick={() => setMenuOpen(false)}>{cta.label}</PillAction>
        </nav>
      </div>
    </header>
  );
}
