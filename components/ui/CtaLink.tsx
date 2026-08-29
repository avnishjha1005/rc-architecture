import type { LinkItem } from "@/content/home";
import { PillAction } from "./PillAction";

export function CtaLink({ link, red = false, className = "" }: { link: LinkItem; red?: boolean; className?: string }) {
  return <PillAction className={`pill-link${red ? " pill-link--red" : ""} ${className}`} href={link.href}>{link.label}</PillAction>;
}
