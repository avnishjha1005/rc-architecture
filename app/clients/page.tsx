import type { Metadata } from "next";
import Image from "next/image";
import { ClientIndex } from "@/components/clients/ClientIndex";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { clients } from "@/content/clients";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { clientsPageQuery } from "@/sanity/lib/queries";
import styles from "./clients.module.css";

export const metadata: Metadata = {
  title: "Clients — RC Architecture",
  description: "Explore the private and public clients RC Architecture has partnered with.",
};

export default async function ClientsPage() {
  const sanityClient = await getSanityClient();
  const [data, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<{ page?: { countLabel?: string; heroTitle?: string; heroImageUrl?: string; heroImageAlt?: string; indexTitle?: string; loadMoreLabel?: string }; clients?: typeof clients } | null>(clientsPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const page = data?.page;
  const clientList = data?.clients?.length ? data.clients : clients;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <div className={styles.heroCopy}><strong>{page?.countLabel || "150+"}</strong><h1>{(page?.heroTitle || "Private &\nPublic Clients").split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1></div>
        <div className={styles.heroImage}><Image src={page?.heroImageUrl || "/images/home/service-architecture.jpg"} alt={page?.heroImageAlt || "Contemporary RC Architecture building"} fill priority sizes="(max-width: 900px) 100vw, 36vw" /></div>
        <a className={styles.scrollCue} href="#client-index" aria-label="Scroll to the client index"><span aria-hidden="true">↓</span></a>
      </section>
      <section className={styles.index} id="client-index"><ClientIndex clients={clientList} title={page?.indexTitle} loadMoreLabel={page?.loadMoreLabel} /></section>
      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={siteFooter(site)} />
    </main>
  );
}
