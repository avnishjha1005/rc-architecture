import Link from "next/link";
import type { LinkItem } from "@/content/home";

export function CtaLink({ link, red = false, className = "" }: { link: LinkItem; red?: boolean; className?: string }) {
  return <Link className={`pill-link${red ? " pill-link--red" : ""} ${className}`} href={link.href}>{link.label}<span aria-hidden="true">→</span></Link>;
}
