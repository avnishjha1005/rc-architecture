import type { Metadata } from "next";
import Image from "next/image";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NextProjects } from "@/components/projects/NextProjects";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { portfolioProjects, type PortfolioProject } from "@/content/projects";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { servicesPageQuery } from "@/sanity/lib/queries";
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
  const sanityClient = await getSanityClient();
  type CmsService = { mark?: string; title?: string; description?: string; items?: { title?: string; description?: string; imageUrl?: string; imageAlt?: string }[] };
  type CmsProject = { _id?: string; slug?: string; title?: string; featuredTitle?: string; type?: string; category?: string; location?: string; yearDisplay?: string; imageUrl?: string; imageAlt?: string };
  type ServicesData = { heroTitle?: string; heroImageUrl?: string; heroImageAlt?: string; processEyebrow?: string; processHeading?: string; processSteps?: { number?: string; title?: string; subtitle?: string; deliverables?: string[] }[]; servicesEyebrow?: string; servicesHeading?: string; services?: CmsService[]; featuredProjects?: CmsProject[] } | null;
  const [page, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<ServicesData>(servicesPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const processItems = page?.processSteps?.length ? page.processSteps.map((step, index) => [step.number || String(index + 1).padStart(2, "0"), step.title || "", step.subtitle || "", step.deliverables?.[0] || "", step.deliverables?.[1] || ""]) : process;
  const serviceItems = page?.services?.length ? page.services.map((service, index) => ({ mark: service.mark || `(${String.fromCharCode(97 + index)})`, title: service.title || "Service", description: service.description || "", items: (service.items || []).flatMap((item) => item.title && item.imageUrl ? [[item.title, item.description || "", item.imageUrl] as string[]] : []) })) : services;
  const cmsProjects: PortfolioProject[] = (page?.featuredProjects || []).flatMap((project, index) => project.title && project.slug && project.imageUrl ? [{ id: project._id || project.slug || index, slug: project.slug, title: project.title, featuredTitle: project.featuredTitle, type: project.type === "Interior Design" ? "Interior Design" as const : "Architecture" as const, category: project.category || project.type || "Architecture", location: project.location || "Location forthcoming", year: project.yearDisplay || "Year forthcoming", imageUrl: project.imageUrl, imageAlt: project.imageAlt || project.title, href: `/projects/${project.slug}` }] : []);
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src={page?.heroImageUrl || "/rc-studio-hero.png"} alt={page?.heroImageAlt || "RC Architecture studio at night"} fill priority sizes="100vw" />
        <div className={styles.heroShade} />
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <h1>{(page?.heroTitle || "Experience\nfocused design.").split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1>
      </section>

      <section className={styles.intro}>
        <Eyebrow>{page?.processEyebrow || "Process"}</Eyebrow>
        <h2>{(page?.processHeading || "Great architecture isn’t just about talent and experience,\nbut collaborations and relationships.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        <div className={styles.process}>{processItems.map(([number, title, subtitle, line1, line2], index) => <article key={title}><small>{number}</small><h3>{title}</h3><p>{subtitle}</p><div className={styles.processMark} aria-hidden="true"><i /><i /><i /></div><span>{line1}<br />{line2}</span><b>{String.fromCharCode(97 + index)}</b></article>)}</div>
      </section>

      <section className={styles.services}>
        <div className={styles.servicesHeading}><Eyebrow>{page?.servicesEyebrow || "What we do"}</Eyebrow><h2>{(page?.servicesHeading || "Our\nServices.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2></div>
        <div className={styles.serviceList}>{serviceItems.map((service) => <article className={styles.service} key={service.title}><span className={styles.serviceMark}>{service.mark}</span><div className={styles.serviceBody}><div className={styles.serviceIntro}><div><h3>{service.title}</h3><p>{service.description}</p></div><div className={styles.roundActions} aria-hidden="true"><span>→</span><span>↗</span></div></div><div className={styles.serviceImages}>{service.items.map(([title, copy, image]) => <div key={title}><div className={styles.serviceImage}><Image src={image} alt={title} fill sizes="(max-width: 800px) 100vw, 32vw" /></div><h4>{title}</h4><p>{copy}</p></div>)}</div></div></article>)}</div>
      </section>

      <NextProjects projects={cmsProjects.length ? cmsProjects : portfolioProjects.slice(1, 5)} eyebrow="Featured projects" />
      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={siteFooter(site)} />
    </main>
  );
}
