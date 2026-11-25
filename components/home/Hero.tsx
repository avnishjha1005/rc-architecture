import Image from "@/components/ui/SiteImage";
import { SitePicture } from "@/components/ui/SitePicture";
import type { CSSProperties } from "react";
import { reviewDisplayUrl, reviewImageKey } from "@/lib/review-media";
import type { HomeContent } from "@/content/home";
import { Header } from "@/components/site/Header";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { StatsBar } from "./StatsBar";
import { urlFor } from "@/sanity/lib/image";

export function Hero({ content }: { content: HomeContent }) {
  const mobile = content.mobileHeroImage ? urlFor(content.mobileHeroImage).quality(85) : undefined;
  const mobileUrl = mobile?.url();
  const desktopKey = reviewImageKey(content.heroImage.src);
  const mobileKey = mobileUrl && reviewImageKey(mobileUrl);
  const hotspot = content.heroImage.hotspot;
  return (
    <section className="hero" aria-labelledby="hero-heading" data-motion-group="hero">
      <div className="hero__review-photo" aria-hidden="true" style={{
        "--hero-photo": `url(${JSON.stringify(desktopKey ? reviewDisplayUrl(desktopKey, 1920) : content.heroImage.src)})`,
        "--hero-mobile-photo": mobileKey
          ? `image-set(url(${JSON.stringify(reviewDisplayUrl(mobileKey, 640))}) 1x, url(${JSON.stringify(reviewDisplayUrl(mobileKey, 1280))}) 2x)`
          : undefined,
        backgroundPosition: hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : "center",
      } as CSSProperties} />
      <SitePicture breakpoint={900} mobileSizes="106vw"
        mobileSrcSet={mobile && [480, 800, 1200, 1600].map(width => `${mobile.width(width).url()} ${width}w`).join(", ")}
        mobileImage={mobileUrl && <Image src={mobileUrl} alt={content.heroImage.alt} className="hero__image" data-motion-image data-motion-parallax fill loading="eager" fetchPriority="high" quality={100} sizes="106vw" />}
      >
        <ResponsiveImage className="hero__image" data-motion-image data-motion-parallax image={content.heroImage} fill loading="eager" fetchPriority="high" quality={85} sizes="106vw" />
      </SitePicture>
      <div className="hero__shade" aria-hidden="true" />
      <Header brandName={content.brandName} navigation={content.navigation} cta={content.cta} />
      <div className="hero__content">
        <h1 id="hero-heading" data-motion-item data-motion-no-split>
          <span className="hero__topline">{content.headlineTop}</span>
          <span className="hero__bottomline">
            <span className="hero__wordmark">
              <Image src="/log_traced.svg" alt={content.headlineAccent} width={466} height={126} />
            </span>
            {content.headlineEnd}
            <span className="hero__trademark" aria-label="Trademark"><Image src="/trademark.svg" alt="" width={23} height={21} /></span>
          </span>
        </h1>
        <p className="hero__intro" data-motion-item>{content.intro}</p>
      </div>
      <StatsBar stats={content.stats} />
    </section>
  );
}
