import Image from "@/components/ui/SiteImage";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SpaceLabCard } from "./SpaceLabsGrid";
import { SpaceLabsSlider } from "./SpaceLabsSlider";

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
      {content.articles.length > 0 && <SpaceLabsSlider>
        {content.articles.map((article, index) => <SpaceLabCard key={article.title} article={article} index={index} />)}
      </SpaceLabsSlider>}
    </section>
  );
}
