import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceLabsGrid } from "./SpaceLabsGrid";

export function SpaceLabsSection({ content }: { content: HomeContent["labs"] }) {
  return (
    <section className="labs-section light-section" id="space-labs">
      <Reveal className="labs-intro section-shell">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <div className="labs-intro__body">
          <div className="labs-intro__top">
            <Image className="space-lab-logo" src="/spacelab-logo.svg" alt="Space Lab" width={510} height={142} />
            <p>{content.intro}</p>
          </div>
          <CtaLink link={content.cta} red />
        </div>
      </Reveal>
      <SpaceLabsGrid articles={content.articles} />
    </section>
  );
}
