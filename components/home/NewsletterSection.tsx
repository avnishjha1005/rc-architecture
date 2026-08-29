import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { headingLines } from "@/components/ui/headingLines";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection({ content }: { content: HomeContent["newsletter"] }) {
  return (
    <section className="newsletter-section light-section" id="newsletter">
      <Reveal className="newsletter-card section-shell">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <div className="newsletter-card__body">
          <h2>{headingLines(content.title, 2).map((line) => <span key={line}>{line}</span>)}</h2>
          <div className="newsletter-card__form"><p>{content.description}</p><NewsletterForm placeholder={content.placeholder} buttonLabel={content.buttonLabel} /></div>
        </div>
        <Image src={content.imageUrl} alt="" width={995} height={346} />
      </Reveal>
    </section>
  );
}
