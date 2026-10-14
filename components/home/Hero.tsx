import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { Header } from "@/components/site/Header";
import { StatsBar } from "./StatsBar";

export function Hero({ content }: { content: HomeContent }) {
  return (
    <section className="hero" aria-labelledby="hero-heading" data-motion-group="hero">
      <Image className="hero__image" data-motion-image src={content.heroImageUrl} alt={content.heroImageAlt} fill priority sizes="100vw" />
      <div className="hero__shade" />
      <Header brandName={content.brandName} navigation={content.navigation} cta={content.cta} />
      <div className="hero__content">
        <h1 id="hero-heading" data-motion-item>
          <span className="hero__topline">{content.headlineTop}</span>
          <span className="hero__bottomline">
            <span className="hero__wordmark">
              <Image src="/log_traced.svg" alt={content.headlineAccent} width={466} height={126} priority />
            </span>
            {content.headlineEnd}
            <span className="hero__trademark" aria-label="Trademark"><Image src="/trademark.svg" alt="" width={23} height={21} priority /></span>
          </span>
        </h1>
        <p className="hero__intro" data-motion-item>{content.intro}</p>
      </div>
      <StatsBar stats={content.stats} />
    </section>
  );
}
