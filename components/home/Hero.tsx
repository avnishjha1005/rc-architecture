import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { Header } from "@/components/site/Header";
import { StatsBar } from "./StatsBar";

export function Hero({ content }: { content: HomeContent }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Image className="hero__image" src={content.heroImageUrl} alt={content.heroImageAlt} fill priority sizes="100vw" />
      <div className="hero__shade" />
      <Header brandName={content.brandName} navigation={content.navigation} cta={content.cta} />
      <div className="hero__content">
        <h1 id="hero-heading">
          <span className="hero__topline">{content.headlineTop}</span>
          <span className="hero__bottomline">
            <span className="hero__wordmark">
              <Image src="/log_traced.svg" alt={content.headlineAccent} width={466} height={126} priority />
            </span>
            {content.headlineEnd}<sup>™</sup>
          </span>
        </h1>
        <p className="hero__intro">{content.intro}</p>
      </div>
      <StatsBar stats={content.stats} />
    </section>
  );
}
