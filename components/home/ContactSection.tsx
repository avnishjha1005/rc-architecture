import Image from "next/image";
import type { ContactSectionData } from "@/content/site";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { headingLines } from "@/components/ui/headingLines";

export function ContactSection({ content }: { content: ContactSectionData }) {
  return (
    <section className="contact-section" id="contact">
      <Image src={content.imageUrl} alt={content.imageAlt} fill sizes="100vw" />
      <div className="contact-section__shade" />
      <Reveal className="contact-section__content section-shell">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <div className="contact-section__body">
          <h2>{headingLines(content.title, 3).map((line) => <span key={line}>{line}</span>)}</h2>
          <div className="contact-section__copy"><Image className="contact-section__star" src="/StarIcon.png" alt="" width={21} height={21} /><p>{content.description}</p></div>
          <CtaLink link={content.cta} red />
        </div>
      </Reveal>
    </section>
  );
}
