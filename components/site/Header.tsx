"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NavigationItem } from "@/content/home";
import { Logo } from "./Logo";

type HeaderProps = { brandName: string; navigation: NavigationItem[]; cta: NavigationItem; theme?: "light" | "dark" };
const Arrow = () => <Image className="cta-arrow" src="/Arrow.svg" alt="" width={16} height={14} />;

export function Header({ brandName, navigation, cta, theme = "dark" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`site-header site-header--${theme}`}>
      <Logo name={brandName} tone={theme} />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href}>{item.label}</Link>)}
      </nav>
      <Link className="header-cta" href={cta.href}>{cta.label}<Arrow /></Link>
      <div className={`mobile-nav${menuOpen ? " is-open" : ""}`}>
        <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
          <Link className="mobile-nav__cta" href={cta.href} onClick={() => setMenuOpen(false)}>{cta.label} <Arrow /></Link>
        </nav>
      </div>
    </header>
  );
}
