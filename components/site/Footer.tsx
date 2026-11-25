import Image from "@/components/ui/SiteImage";
import { SiteNavLink } from "./SiteNavLink";
import type { SiteFooterContent } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { headingLines } from "@/components/ui/headingLines";
import { toDirectionsHref, toTelephoneHref } from "@/content/site";

type FooterProps = {
  content: SiteFooterContent;
  sectionId?: string;
};

export function Footer({ content, sectionId }: FooterProps) {
  const legal = content.legal.replace(/\s+(?=ACN\b)/, "\n");

  return (
    <footer className="footer dark-section" id={sectionId} data-motion-group="section">
      <div className="footer__grid section-shell">
        <div className="footer__contact" data-motion-item>
          <div className="footer__lead"><Eyebrow>{content.eyebrow}</Eyebrow><h2>{headingLines(content.title, 1).map((line) => <span key={line}>{line}</span>)}</h2></div>
          <p className="footer__blurb">{content.blurb}</p>
          <a className="footer__email" href={`mailto:${content.email}`}><span aria-hidden="true">↳</span><span>{content.email}</span></a>
        </div>
        <nav className="footer__nav" aria-label="Footer navigation" data-motion-item>{content.navigation.map((item, index) => <SiteNavLink href={item.href} label={item.label} key={item.label}><small>[{String(index + 1).padStart(2, "0")}]</small></SiteNavLink>)}</nav>
        <div className="footer__details" data-motion-item><div><small>{content.addressLabel}</small>{content.city && <p>{content.city}</p>}<p><a href={toDirectionsHref(content.address)} target="_blank" rel="noreferrer">{content.address}</a></p><p>Tel: <a href={toTelephoneHref(content.phone)}>{content.phone}</a></p></div><div><small>{content.hoursLabel}</small><p>{content.hours}</p></div><p className="footer__legal footer__legal--desktop">{legal}</p></div>
        <div className="footer__mobile-brand"><Image className="footer__mobile-logo" src="/RC LOGO TRANSPARENT 1.png" width={2804} height={408} alt="RC Architecture" /><p className="footer__mobile-legal">{legal}</p></div>
      </div>
      <Image className="footer__logo footer__logo--desktop" data-motion-item src="/RC LOGO TRANSPARENT 1.png" width={2804} height={408} alt="RC Architecture" />
    </footer>
  );
}
