"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteNavLink({ href, label, children, onClick }: { href: string; label: string; children?: ReactNode; onClick?: () => void }) {
  const path = usePathname();
  return <Link className="site-nav-link" href={href} aria-current={path === href ? "page" : undefined} onClick={onClick}>{children}<span className="site-nav-label">{label}</span></Link>;
}
