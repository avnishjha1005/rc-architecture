import Image from "next/image";
import type { HomeContent } from "@/content/home";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ServicesSection({ content }: { content: HomeContent["services"] }) {
  return (
    <section className="services-section light-section" id="services">
      <Reveal className="section-shell services-intro"><SectionHeading eyebrow={content.eyebrow} title={content.title} intro={content.intro} /><CtaLink link={content.cta} /></Reveal>
      <div className="service-list section-shell">
        {content.items.map((service, index) => (
          <Reveal className={`service-card${index % 2 ? " service-card--reverse" : ""}`} key={service.number} delay={index * 80}>
            <span className="service-card__number">{service.number}</span>
            <div className="service-card__image"><Image src={service.imageUrl} alt={service.imageAlt} fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
            <div className="service-card__content"><h3>{service.title}</h3><p>{service.description}</p><ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
