import type { Metadata } from "next";
import Image from "next/image";
import { CareersBanner } from "@/components/site/CareersBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteFooter, toDirectionsHref, toTelephoneHref } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { ContactForm } from "@/components/contact/ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact — RC Architecture",
  description: "Start a project with RC Architecture or find one of our offices.",
};

export default async function ContactPage() {
  const sanityClient = await getSanityClient();
  const [page, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<Record<string, string | undefined> | null>(contactPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" />
        <div className={styles.heroGrid}>
          <h1>{page?.heroTitle || "Let’s Discuss."}</h1>
          <aside className={styles.intro}>
            <p>{page?.heroIntro || "We’re always open to new projects, collaborations, and conversations. Whether you’re starting with a clear brief or just an idea, we’ll be happy to hear from you."}</p>
            <div className={styles.officeImage}><Image src={page?.heroImageUrl || "/images/home/service-interiors.jpg"} alt={page?.heroImageAlt || "RC Architecture office corridor"} fill priority sizes="(max-width: 900px) 100vw, 40vw" /></div>
          </aside>
          <ContactForm className={styles.form} messageClassName={styles.message} />
        </div>
      </section>

      <section className={styles.contactInfo}>
        <Eyebrow className={styles.label}>{page?.infoEyebrow || "Contact info"}</Eyebrow>
        <div className={styles.infoBody}>
          <h2>{(page?.infoHeading || "Get in touch\nwith us.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
          <p className={styles.infoIntro}>{page?.infoIntro || "Whether you’re ready to start planning your dream project or simply want to learn more about how we can assist you, we’re just a phone call or email away."}</p>
          <div className={styles.primaryDetails}>
            <div><small>{page?.phoneLabel || "Phone number"}</small><p><a href={toTelephoneHref(site.phone)}>{site.phone}</a></p></div>
            <div><small>{page?.emailLabel || "Email"}</small><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
            <div className={styles.mainOffice}><small>{page?.mainOfficeLabel || "Main office (Bengaluru)"}</small><p><a href={toDirectionsHref(site.address)} target="_blank" rel="noreferrer">{site.address}</a></p></div>
          </div>
          <a className={styles.map} href={toDirectionsHref(site.address)} target="_blank" rel="noreferrer" aria-label="Open directions to the Bengaluru office"><Image src={page?.mapImageUrl || "/images/contact/bengaluru-map.jpg"} alt={page?.mapImageAlt || "Map showing RC Architecture in Richmond Town, Bengaluru"} fill sizes="(max-width: 900px) 100vw, 65vw" /></a>
          <h3>{page?.satelliteOfficesHeading || "Satellite offices"}</h3>
          <div className={styles.offices}>{site.offices.map((office) => <article key={office.city}><span>{office.city}</span><div><p>{office.address}</p><p>T.: <a href={toTelephoneHref(office.phone)}>{office.phone}</a></p></div></article>)}</div>
          {site.socialLinks.length > 0 && <div className={styles.socials}><small>{page?.socialLabel || "Follow us"}</small><div>{site.socialLinks.map((social) => <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} key={social.label}>{social.shortLabel}</a>)}</div></div>}
        </div>
      </section>

      <section className={styles.careers}>
        <Eyebrow className={styles.label}>{page?.careersEyebrow || "Careers"}</Eyebrow>
        <div className={styles.careersBody}>
          <CareersBanner email={site.email} />
        </div>
      </section>

      <Footer content={siteFooter(site)} sectionId="contact" />
    </main>
  );
}
