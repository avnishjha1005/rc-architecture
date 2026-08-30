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
import styles from "./clients.module.css";

export const metadata: Metadata = {
  title: "Clients — RC Architecture",
  description: "Explore the private and public clients RC Architecture has partnered with.",
};

export default async function ClientsPage() {
  const site = await getSiteData();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <div className={styles.heroCopy}><strong>150+</strong><h1>Private &amp;<br />Public Clients</h1></div>
        <div className={styles.heroImage}><Image src="/images/home/service-architecture.jpg" alt="Contemporary RC Architecture building" fill priority sizes="(max-width: 900px) 100vw, 36vw" /></div>
        <a className={styles.scrollCue} href="#client-index" aria-label="Scroll to the client index"><span aria-hidden="true">↓</span></a>
      </section>
      <section className={styles.index} id="client-index"><ClientIndex clients={clients} /></section>
      <ContactSection content={site.contact} />
      <NewsletterSection content={site.newsletter} />
      <Footer content={siteFooter(site)} />
    </main>
  );
}
