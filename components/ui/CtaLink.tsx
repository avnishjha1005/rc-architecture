import Image from "next/image";
import Link from "next/link";
import type { LinkItem } from "@/content/home";

export function CtaLink({ link, red = false, className = "" }: { link: LinkItem; red?: boolean; className?: string }) {
  return <Link className={`pill-link${red ? " pill-link--red" : ""} ${className}`} href={link.href}>{link.label}<Image className="cta-arrow" src="/Arrow.svg" alt="" width={16} height={14} /></Link>;
}
