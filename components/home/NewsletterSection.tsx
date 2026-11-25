import Image from "@/components/ui/SiteImage";
import type { NewsletterSectionData } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { headingLines } from "@/components/ui/headingLines";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection({ content }: { content: NewsletterSectionData }) {
  return (
    <section className="newsletter-section light-section" id="newsletter" data-card-group>
      <Reveal className="newsletter-card section-shell">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <div className="newsletter-card__body">
          <h2>{headingLines(content.title, 2).map((line) => <span data-motion-heading key={line}>{line}</span>)}</h2>
          <div className="newsletter-card__form"><p>{content.description}</p><NewsletterForm placeholder={content.placeholder} buttonLabel={content.buttonLabel} /></div>
        </div>
        <div className="newsletter-card__art" data-card><Image src={content.imageUrl} alt="" fill sizes="(max-width: 900px) 180vw, 995px" /></div>
      </Reveal>
    </section>
  );
}
