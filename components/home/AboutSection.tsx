import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

export function AboutSection({ content }: { content: HomeContent["about"] }) {
  const explicitLines = content.title.split("\n").map((line) => line.trim()).filter(Boolean);
  const words = content.title.trim().split(/\s+/);
  const titleLines = explicitLines.length > 1
    ? explicitLines
    : words.length > 3
      ? [words.slice(0, -1).join(" "), words.at(-1)!]
      : explicitLines;

  return (
    <section className="about-section dark-section" id="about">
      <Reveal className="about-lead">
        <p className="eyebrow">({content.eyebrow})</p>
        <h2>{titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
        <p className="about-lead__copy">{content.description}</p>
        <CtaLink link={content.cta} red />
      </Reveal>
      <Reveal className="ideologies" delay={100}>
        <p className="eyebrow">({content.ideologiesLabel})</p>
        <div className="ideologies__grid">
          {content.ideologies.map((item) => (
            <article className="ideology" key={item.title}>
              <span className="ideology__mark" aria-hidden="true">e</span>
              <h3>{item.title}</h3><p>{item.description}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
