import type { Metadata } from "next";
import Image from "next/image";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NextProjects } from "@/components/projects/NextProjects";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { portfolioProjects } from "@/content/projects";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services — RC Architecture",
  description: "Architecture and interior design services grounded in collaboration, clarity, and thoughtful delivery.",
};

const process = [
  ["01", "Design", "Conceptualisation", "Visualisation · 3D Views · Fly-through", "Look & Feel"],
  ["02", "Define", "Searching for the DNA", "Interior with colour leadership", "Engagement with project leads"],
  ["03", "Develop", "Developing the DNA into feasibility", "Tender Drawings", "Specs · Vendor Finalisation"],
  ["04", "Deploy", "Executing the DNA", "Quality Monitoring", "In-time Execution"],
];

const services = [
  { mark: "(a)", title: "Architectural Design", description: "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients. Design is space-making, and so is technology.", items: [["Residential Architecture", "Designing homes, apartments, and hospitality complexes that balance aesthetics, comfort, and durability.", "/images/home/project-bale-county.jpg"], ["Commercial Architecture", "Spaces designed for business interaction, productivity, and the seamless flow of human activity.", "/images/home/service-architecture.jpg"]] },
  { mark: "(b)", title: "Interior Design", description: "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients. Design is space-making, and so is technology.", items: [["Residential Interior Design", "Spaces with calming environments, functional planning, and a highly liveable material palette.", "/images/home/project-avalahalli.jpg"], ["Commercial Interior Design", "Curated spaces meant for business, work, hospitality, branding and everyday interaction.", "/images/home/service-interiors.jpg"]] },
];

export default async function ServicesPage() {
  const site = await getSiteData();
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src="/rc-studio-hero.png" alt="RC Architecture studio at night" fill priority sizes="100vw" />
        <div className={styles.heroShade} />
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <h1>Experience<br />focused design.</h1>
      </section>

      <section className={styles.intro}>
        <Eyebrow>Process</Eyebrow>
        <h2>Great architecture isn’t just about talent and experience,<br />but collaborations and relationships.</h2>
        <div className={styles.process}>{process.map(([number, title, subtitle, line1, line2], index) => <article key={title}><small>{number}</small><h3>{title}</h3><p>{subtitle}</p><div className={styles.processMark} aria-hidden="true"><i /><i /><i /></div><span>{line1}<br />{line2}</span><b>{String.fromCharCode(97 + index)}</b></article>)}</div>
      </section>

      <section className={styles.services}>
        <div className={styles.servicesHeading}><Eyebrow>What we do</Eyebrow><h2>Our<br />Services.</h2></div>
        <div className={styles.serviceList}>{services.map((service) => <article className={styles.service} key={service.title}><span className={styles.serviceMark}>{service.mark}</span><div className={styles.serviceBody}><div className={styles.serviceIntro}><div><h3>{service.title}</h3><p>{service.description}</p></div><div className={styles.roundActions} aria-hidden="true"><span>→</span><span>↗</span></div></div><div className={styles.serviceImages}>{service.items.map(([title, copy, image]) => <div key={title}><div className={styles.serviceImage}><Image src={image} alt={title} fill sizes="(max-width: 800px) 100vw, 32vw" /></div><h4>{title}</h4><p>{copy}</p></div>)}</div></div></article>)}</div>
      </section>

      <NextProjects projects={portfolioProjects.slice(1, 5)} eyebrow="Featured projects" />
      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={siteFooter(site)} />
    </main>
  );
}
