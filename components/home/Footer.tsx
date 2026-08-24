import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/content/home";
import { headingLines } from "@/components/ui/headingLines";

export function Footer({ content }: { content: HomeContent["footer"] }) {
  return (
    <footer className="footer dark-section" id="clients">
      <div className="footer__grid section-shell">
        <div className="footer__lead"><p className="eyebrow">({content.eyebrow})</p><h2>{headingLines(content.title, 1).map((line) => <span key={line}>{line}</span>)}</h2></div>
        <p className="footer__blurb">{content.blurb}</p>
        <a className="footer__email" href={`mailto:${content.email}`}>↳&nbsp; {content.email}</a>
        <nav className="footer__nav" aria-label="Footer navigation">{content.navigation.map((item, index) => <Link href={item.href} key={item.label}><small>[{String(index + 1).padStart(2, "0")}]</small><span>{item.label}</span></Link>)}</nav>
        <div className="footer__details"><div><small>{content.addressLabel}</small><p>Bengaluru</p><p>{content.address}</p><p>{content.phone}</p></div><div><small>{content.hoursLabel}</small><p>{content.hours}</p></div><p className="footer__legal">{content.legal}</p></div>
      </div>
      <Image className="footer__logo" src="/RC LOGO TRANSPARENT 1.png" width={2804} height={408} alt="RC Architecture" />
    </footer>
  );
}
