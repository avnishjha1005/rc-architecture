import Image from "@/components/ui/SiteImage";
import { SitePicture } from "@/components/ui/SitePicture";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FeaturedProjectGrid, getFeaturedProjectSelection } from "@/components/projects/FeaturedProjectGrid";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { PortfolioProject } from "@/content/projects";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { servicesPageQuery } from "@/sanity/lib/queries";
import { getSingletonMetadata } from "@/sanity/lib/metadata";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { resolveImage, type CmsResponsiveImage } from "@/lib/responsive-image";
import { ServiceCarousel } from "./ServiceCarousel";
import { ProcessTrack } from "./ProcessTrack";
import styles from "./services.module.css";

export function generateMetadata() {
  return getSingletonMetadata("servicesPage", {
    title: "Services — RC Architecture",
    description: "Architecture and interior design services grounded in collaboration, clarity, and thoughtful delivery.",
  });
}

type ProcessItem = [number: string, title: string, subtitle: string, deliverables: string[]];

const process: ProcessItem[] = [
  ["01", "Design", "Conceptualisation", ["Concept", "Visualisation · 3D Views · AR/VR", "Look & Feel"]],
  ["02", "Define", "Searching for the DNA", ["Interview with senior leadership", "Engagement with project leads", "Observation of employees"]],
  ["03", "Develop", "Developing the DNA into feasibility", ["Tender Drawings", "Specs", "Vendor Finalisation"]],
  ["04", "Deploy", "Executing the DNA", ["Quality Monitoring", "In-time Execution"]],
];

const processMarks = ["/services-1.svg", "/services-3.svg", "/services-2.svg"];

const services = [
  { mark: "(a)", title: "Architectural Design", description: "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients. Design is space-making, and so is technology.", items: [["Residential Architecture", "Designing homes, apartments, and hospitality complexes that balance aesthetics, comfort, and durability.", "/images/home/project-bale-county.jpg"], ["Commercial Architecture", "Spaces designed for business interaction, productivity, and the seamless flow of human activity.", "/images/home/service-architecture.jpg"], ["Workplace Architecture", "Purpose-built workplaces that support collaboration, focus, adaptability, and the culture of each organisation.", "/images/home/project-ge-digital.jpg"]] },
  { mark: "(b)", title: "Interior Design", description: "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients. Design is space-making, and so is technology.", items: [["Residential Interior Design", "Spaces with calming environments, functional planning, and a highly liveable material palette.", "/images/home/project-avalahalli.jpg"], ["Commercial Interior Design", "Curated spaces meant for business, work, hospitality, branding and everyday interaction.", "/images/home/service-interiors.jpg"]] },
];

export default async function ServicesPage() {
  const sanityClient = await getSanityClient();
  type CmsService = { mark?: string; title?: string; description?: string; items?: { title?: string; description?: string; imageUrl?: string; imageAlt?: string }[] };
  type CmsProject = { _id?: string; slug?: string; title?: string; featuredTitle?: string; type?: string; category?: string; location?: string; yearDisplay?: string; imageUrl?: string; imageAlt?: string };
  type ServicesData = { heroTitle?: string; heroImageUrl?: string; heroImageAlt?: string; heroImageData?: CmsResponsiveImage; mobileHeroImageUrl?: string; processEyebrow?: string; processHeading?: string; processSteps?: { number?: string; title?: string; subtitle?: string; deliverables?: string[] }[]; servicesEyebrow?: string; servicesHeading?: string; services?: CmsService[]; featuredProjects?: CmsProject[]; catalogue?: CmsProject[] } | null;
  const [page, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<ServicesData>(servicesPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const processItems = page?.processSteps?.length ? page.processSteps.map((step, index) => {
    const fallback = process[index]?.[3] as string[] | undefined;
    const providedDeliverables = step.deliverables?.filter(Boolean);
    const deliverables = providedDeliverables?.length ? providedDeliverables : fallback || [];
    return [step.number || String(index + 1).padStart(2, "0"), step.title || "", step.subtitle || "", deliverables] satisfies ProcessItem;
  }) : process;
  const serviceItems = page?.services?.length ? page.services.map((service, index) => ({ mark: service.mark || `(${String.fromCharCode(97 + index)})`, title: service.title || "Service", description: service.description || "", items: (service.items || []).flatMap((item) => item.title && item.imageUrl ? [[item.title, item.description || "", item.imageUrl] as string[]] : []) })) : services;
  const cmsProjects: PortfolioProject[] = (page?.featuredProjects?.length ? page.featuredProjects : page?.catalogue ?? []).flatMap((project, index) => project.title && project.slug && project.imageUrl ? [{ id: project._id || project.slug || index, slug: project.slug, title: project.title, featuredTitle: project.featuredTitle, type: project.type === "Interior Design" ? "Interior Design" as const : "Architecture" as const, category: project.category || project.type || "Architecture", location: project.location || "Location forthcoming", year: project.yearDisplay || "Year forthcoming", imageUrl: project.imageUrl, imageAlt: project.imageAlt || project.title, href: `/projects/${project.slug}` }] : []);
  return (
    <main className={styles.page}>
      <section className={styles.hero} data-motion-group="hero">
        <SitePicture className={styles.heroPicture} breakpoint={760}
          mobileSrcSet={page?.mobileHeroImageUrl && `${page.mobileHeroImageUrl}?w=790&fit=max&auto=format&q=85`}
          mobileImage={page?.mobileHeroImageUrl && <Image src={page.mobileHeroImageUrl} alt={page.heroImageAlt || "RC Architecture studio at night"} fill loading="eager" sizes="100vw" data-motion-image data-motion-parallax />}
        >
          <ResponsiveImage image={resolveImage(page?.heroImageData, page?.heroImageUrl || "/rc-studio-hero.png", page?.heroImageAlt || "RC Architecture studio at night")} fill loading="eager" sizes="100vw" data-motion-image data-motion-parallax />
        </SitePicture>
        <div className={styles.heroShade} />
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <h1 data-motion-item>{(page?.heroTitle || "Experience\nfocused design").split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
      </section>

      <section className={styles.intro} data-motion-group="section">
        <Eyebrow data-motion-item>{page?.processEyebrow || "Process"}</Eyebrow>
        <h2 data-motion-item>{(page?.processHeading || "We bring together architecture, interiors, research and expertise to create thoughtful spaces shaped around people and purpose.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        <ProcessTrack>{processItems.map(([number, title, subtitle, deliverables], index) => <article key={title} data-card data-motion-item><small>({number.replace(/^\(|\)$/g, "")})</small><h3>{title}</h3><p>{subtitle}</p>{processMarks[index] && <div className={styles.processMark} aria-hidden="true"><Image src={processMarks[index]} alt="" fill sizes="200px" /></div>}<ul className={styles.processDeliverables}>{deliverables.filter(Boolean).map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul></article>)}</ProcessTrack>
      </section>

      <section className={styles.services} data-motion-group="section">
        <div className={styles.servicesHeading} data-motion-item><Eyebrow>{page?.servicesEyebrow || "How we do it"}</Eyebrow><h2>{(page?.servicesHeading || "Our\nServices").split("\n").map((line, i) => <span key={line}>{i > 0 && " "}{line}</span>)}</h2></div>
        <div className={styles.serviceList}>{serviceItems.map((service) => <article className={styles.service} key={service.title} data-draw-rule="top"><span className={styles.serviceMark}>{service.mark}</span><div className={styles.serviceBody}><ServiceCarousel items={service.items} label={service.title} description={service.description} /></div></article>)}</div>
      </section>

      <FeaturedProjectGrid projects={page?.featuredProjects?.length ? cmsProjects.slice(0, 4) : getFeaturedProjectSelection(cmsProjects)} />
      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={siteFooter(site)} />
    </main>
  );
}
