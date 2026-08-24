import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

export function SpaceLabsSection({ content }: { content: HomeContent["labs"] }) {
  return (
    <section className="labs-section light-section" id="space-labs">
      <Reveal className="labs-intro section-shell">
        <p className="eyebrow">({content.eyebrow})</p>
        <div className="labs-intro__body">
          <div className="labs-intro__top">
            <Image className="space-lab-logo" src="/spacelab-logo.svg" alt="Space Lab" width={510} height={142} />
            <p>{content.intro}</p>
          </div>
          <CtaLink link={content.cta} red />
        </div>
      </Reveal>
      <div className="article-grid section-shell">
        {content.articles.map((article, index) => (
          <Reveal className="article-card" key={article.title} delay={index * 60}>
            <Link className="article-card__image" href={article.href}><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></Link>
            <p>({article.category})</p><h3>{article.title}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
