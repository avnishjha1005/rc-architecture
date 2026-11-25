import { ClientIndex, type DirectoryClient } from "@/components/clients/ClientIndex";
import { CountUp } from "@/components/ui/CountUp";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { clientsPageQuery } from "@/sanity/lib/queries";
import { getSingletonMetadata } from "@/sanity/lib/metadata";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { resolveImage, type CmsResponsiveImage } from "@/lib/responsive-image";
import styles from "./clients.module.css";

export function generateMetadata() {
  return getSingletonMetadata("clientsPage", {
    title: "Clients — RC Architecture",
    description: "Explore the private and public clients RC Architecture has partnered with.",
  });
}

export default async function ClientsPage() {
  const sanityClient = await getSanityClient();
  const [data, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<{ page?: { countLabel?: string; heroTitle?: string; heroImageUrl?: string; heroImageAlt?: string; heroImageData?: CmsResponsiveImage; indexTitle?: string; loadMoreLabel?: string }; clients?: DirectoryClient[] } | null>(clientsPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const page = data?.page;
  const clientList = data?.clients ?? [];

  return (
    <main className={styles.page}>
      <section className={styles.hero} data-motion-group="hero">
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <div className={styles.heroCopy} data-motion-item><strong><CountUp value={page?.countLabel || "150+"} /></strong><h1 data-live-heading>{(page?.heroTitle || "Clients. 25+\nYears Of Design.").split("\n").map((line) => <span data-live-mask key={line}><span>{line.split(/(\b\d+\+)/).map((part, i) => /^\d+\+$/.test(part) ? <CountUp value={part} key={i} /> : part)}</span></span>)}</h1></div>
        <div className={styles.heroImage} data-motion-item data-motion-image><ResponsiveImage image={resolveImage(page?.heroImageData, page?.heroImageUrl || "/images/home/service-architecture.jpg", page?.heroImageAlt || "Contemporary RC Architecture building")} fill loading="eager" sizes="(max-width: 900px) 230vw, 80vw" /></div>
        <a className={styles.scrollCue} href="#client-index" aria-label="Scroll to the client index" data-motion-item><svg aria-hidden="true" width="20" height="26" viewBox="0 0 20 26" fill="none"><path d="M10 1v23M1.5 15.5 10 24l8.5-8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      </section>
      <section className={styles.index} id="client-index" data-motion-group="section"><div data-motion-item><ClientIndex clients={clientList} title={page?.indexTitle} loadMoreLabel={page?.loadMoreLabel} /></div></section>
      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={siteFooter(site)} />
    </main>
  );
}
