import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

export function ContactSection({ content }: { content: HomeContent["contact"] }) {
  return (
    <section className="contact-section" id="contact">
      <Image src={content.imageUrl} alt={content.imageAlt} fill sizes="100vw" />
      <div className="contact-section__shade" />
      <Reveal className="contact-section__content section-shell">
        <p className="eyebrow">({content.eyebrow})</p>
        <h2>{content.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        <div className="contact-section__copy"><b aria-hidden="true">✱</b><p>{content.description} {content.description}</p></div>
        <CtaLink link={content.cta} red />
      </Reveal>
    </section>
  );
}
