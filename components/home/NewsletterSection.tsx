import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";

export function NewsletterSection({ content }: { content: HomeContent["newsletter"] }) {
  return (
    <section className="newsletter-section light-section" id="newsletter">
      <Reveal className="newsletter-card section-shell">
        <p className="eyebrow">({content.eyebrow})</p>
        <h2>{content.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        <div className="newsletter-card__form"><p>{content.description} {content.description}</p><form><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder={content.placeholder} required /><button type="submit">{content.buttonLabel} <span>→</span></button></form></div>
        <Image src={content.imageUrl} alt="" width={995} height={346} />
      </Reveal>
    </section>
  );
}
