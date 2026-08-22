import Image from "next/image";
import Link from "next/link";
import type { NavigationItem } from "@/content/home";
import { Logo } from "./Logo";

type HeaderProps = { brandName: string; navigation: NavigationItem[]; cta: NavigationItem };
const Arrow = () => <Image className="cta-arrow" src="/Arrow.svg" alt="" width={16} height={14} />;

export function Header({ brandName, navigation, cta }: HeaderProps) {
  return (
    <header className="site-header">
      <Logo name={brandName} />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href}>{item.label}</Link>)}
      </nav>
      <Link className="header-cta" href={cta.href}>{cta.label}<Arrow /></Link>
      <details className="mobile-nav">
        <summary aria-label="Open navigation"><span /><span /></summary>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <Link key={`${item.label}-${item.href}`} href={item.href}>{item.label}</Link>)}
          <Link className="mobile-nav__cta" href={cta.href}>{cta.label} <Arrow /></Link>
        </nav>
      </details>
    </header>
  );
}
