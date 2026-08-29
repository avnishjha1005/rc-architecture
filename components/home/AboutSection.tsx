import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { headingLines } from "@/components/ui/headingLines";

const ideologyIcons = ["/Top.svg", "/Right.svg", "/Bottom.svg", "/Left.svg"];

export function AboutSection({ content }: { content: HomeContent["about"] }) {
  return (
    <section className="about-section dark-section" id="about">
      <Reveal className="about-lead">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <div className="about-lead__body">
          <h2>{headingLines(content.title, "before-last").map((line) => <span key={line}>{line}</span>)}</h2>
          <p className="about-lead__copy">{content.description}</p>
          <CtaLink link={content.cta} red />
        </div>
      </Reveal>
      <Reveal className="ideologies" delay={100}>
        <Eyebrow>{content.ideologiesLabel}</Eyebrow>
        <div className="ideologies__grid">
          {content.ideologies.map((item, index) => (
            <article className="ideology" key={item.title}>
              <Image
                className="ideology__mark"
                src={ideologyIcons[index % ideologyIcons.length]}
                alt=""
                width={46}
                height={46}
              />
              <h3>{item.title}</h3><p>{item.description}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
