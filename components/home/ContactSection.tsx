import { getImageProps } from "next/image";
import Image from "@/components/ui/SiteImage";
import { SitePicture } from "@/components/ui/SitePicture";
import type { ContactSectionData } from "@/content/site";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { headingLines } from "@/components/ui/headingLines";

export function ContactSection({ content }: { content: ContactSectionData }) {
  const [firstLine = "", ...remainingLines] = headingLines(content.title, 3);

  return (
    <section className="contact-section" id="contact">
      <SitePicture className="contact-section__picture" breakpoint={900} mobileSizes="100vw"
        mobileSrcSet={content.mobileImageUrl && getImageProps({ src: content.mobileImageUrl, alt: "", width: 790, height: 1330, sizes: "100vw" }).props.srcSet}
        mobileImage={content.mobileImageUrl && <Image src={content.mobileImageUrl} alt={content.imageAlt} data-motion-image fill sizes="100vw" />}
      >
        <Image src={content.imageUrl} alt={content.imageAlt} data-motion-image fill sizes="100vw" />
      </SitePicture>
      <div className="contact-section__shade" />
      <Reveal className="contact-section__content section-shell">
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <div className="contact-section__body">
          <h2>
            <span className="contact-section__first-line" data-motion-heading>
              <span className="contact-section__lead-letter">{firstLine.slice(0, 1)}</span>
              <span className="contact-section__first-rest">{firstLine.slice(1)}</span>
            </span>
            {remainingLines.map((line) => <span className="contact-section__following-line" data-motion-heading key={line}>{line}</span>)}
          </h2>
          <div className="contact-section__copy"><Image className="contact-section__star" src="/StarIcon.png" alt="" width={21} height={21} /><p>{content.description}</p></div>
          <CtaLink link={content.cta} red />
        </div>
      </Reveal>
    </section>
  );
}
