import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { headingLines } from "@/components/ui/headingLines";

export function ContactSection({ content }: { content: HomeContent["contact"] }) {
  return (
    <section className="contact-section" id="contact">
      <Image src={content.imageUrl} alt={content.imageAlt} fill sizes="100vw" />
      <div className="contact-section__shade" />
      <Reveal className="contact-section__content section-shell">
        <p className="eyebrow">({content.eyebrow})</p>
        <div className="contact-section__body">
          <h2>{headingLines(content.title, 3).map((line) => <span key={line}>{line}</span>)}</h2>
          <div className="contact-section__copy"><Image className="contact-section__star" src="/StarIcon.png" alt="" width={21} height={21} /><p>{content.description} {content.description}</p></div>
          <CtaLink link={content.cta} red />
        </div>
      </Reveal>
    </section>
  );
}
