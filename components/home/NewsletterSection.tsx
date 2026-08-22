import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { headingLines } from "@/components/ui/headingLines";

export function NewsletterSection({ content }: { content: HomeContent["newsletter"] }) {
  return (
    <section className="newsletter-section light-section" id="newsletter">
      <Reveal className="newsletter-card section-shell">
        <p className="eyebrow">({content.eyebrow})</p>
        <div className="newsletter-card__body">
          <h2>{headingLines(content.title, 2).map((line) => <span key={line}>{line}</span>)}</h2>
          <div className="newsletter-card__form"><p>{content.description} {content.description}</p><form><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder={content.placeholder} required /><button type="submit">{content.buttonLabel}<Image className="cta-arrow" src="/Arrow.svg" alt="" width={16} height={14} /></button></form></div>
        </div>
        <Image src={content.imageUrl} alt="" width={995} height={346} />
      </Reveal>
    </section>
  );
}
