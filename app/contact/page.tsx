import { CareersBanner } from "@/components/site/CareersBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteFooter, toDirectionsHref, toGoogleMapsEmbedHref, toTelephoneHref } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { getSingletonMetadata } from "@/sanity/lib/metadata";
import { SocialIcon } from "@/components/contact/SocialIcon";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { resolveImage, type CmsResponsiveImage } from "@/lib/responsive-image";
import styles from "./contact.module.css";

export function generateMetadata() {
  return getSingletonMetadata("contactPage", {
    title: "Contact — RC Architecture",
    description: "Start a project with RC Architecture or find one of our offices.",
  });
}

export default async function ContactPage() {
  type ContactData = {
    heroTitle?: string; heroIntro?: string; heroImageUrl?: string; heroImageAlt?: string; heroImageData?: CmsResponsiveImage;
    infoEyebrow?: string; infoHeading?: string; infoIntro?: string; additionalPhones?: string[]; phoneLabel?: string; emailLabel?: string;
    mainOfficeLabel?: string; satelliteOfficesHeading?: string; satelliteOfficeOrder?: string[]; socialLabel?: string; careersEyebrow?: string;
  };
  const sanityClient = await getSanityClient();
  const [page, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<ContactData | null>(contactPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const mapLink = toDirectionsHref(site.address);
  const mapEmbedUrl = toGoogleMapsEmbedHref(site.address);
  const phones = [...new Set([site.phone, ...(page?.additionalPhones ?? [])].filter(Boolean))];
  const officeOrder = new Map(page?.satelliteOfficeOrder?.map((city, index) => [city, index]));
  const satellites = site.offices
    .filter((office) => office.address.trim().toLowerCase() !== site.address.trim().toLowerCase())
    .sort((a, b) => (officeOrder.get(a.city) ?? Infinity) - (officeOrder.get(b.city) ?? Infinity));

  return (
    <main className={styles.page}>
      <section className={styles.hero} data-motion-group="hero">
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" />
        <div className={styles.heroGrid}>
          <h1 data-motion-item>{page?.heroTitle || "Let’s Discuss"}</h1>
          <aside className={styles.intro} data-motion-item>
            <p>{page?.heroIntro || "We’re always open to new projects, collaborations, and conversations. Whether you’re starting with a clear brief or just an idea, we’ll be happy to hear from you."}</p>
            <div className={styles.officeImage} data-motion-image><ResponsiveImage image={resolveImage(page?.heroImageData, page?.heroImageUrl || "/images/home/service-interiors.jpg", page?.heroImageAlt || "RC Architecture office corridor")} fill loading="eager" sizes="(max-width: 900px) 100vw, 40vw" /></div>
          </aside>
          <ContactForm className={styles.form} messageClassName={styles.message} motionItem />
        </div>
      </section>

      <section className={styles.contactInfo} data-motion-group="section">
        <Eyebrow className={styles.label} data-motion-item>{page?.infoEyebrow || "Contact info"}</Eyebrow>
        <div className={styles.infoBody}>
          <h2 data-motion-item>{(page?.infoHeading || "Get In Touch\nWith Us").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
          <p className={styles.infoIntro} data-motion-item>{page?.infoIntro || "Whether you’re ready to start planning your dream project or simply want to learn more about how we can assist you, we’re just a phone call or email away."}</p>
          <div className={styles.primaryDetails} data-motion-item>
            <div><small>{page?.phoneLabel || "Phone number"}</small><p className={styles.phones}>{phones.map((phone) => <a key={phone} href={toTelephoneHref(phone)}>{phone}</a>)}</p></div>
            <div><small>{page?.emailLabel || "Email"}</small><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
            <div className={styles.mainOffice}><small>{page?.mainOfficeLabel || "Main office (Bengaluru)"}</small><p>{site.address}</p><p><a href={mapLink} target="_blank" rel="noreferrer">Get directions on Google Maps</a></p></div>
          </div>
          <OfficeMap src={mapEmbedUrl} />
          <h3 data-motion-item>{page?.satelliteOfficesHeading || "Satellite offices"}</h3>
          <div className={styles.offices}>{satellites.map((office) => <article key={office.city} data-motion-item><span>{office.city}</span><div><p>{office.address}</p><p>T.: <a href={toTelephoneHref(office.phone)}>{office.phone}</a></p></div></article>)}</div>
          {site.socialLinks.length > 0 && <div className={styles.socials}><small>{page?.socialLabel || "Follow us"}</small><div>{site.socialLinks.map((social) => <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} key={social.label}><SocialIcon label={social.label} fallback={social.shortLabel} /></a>)}</div></div>}
        </div>
      </section>

      <section className={styles.careers} data-motion-group="section">
        <Eyebrow className={styles.label} data-motion-item>{page?.careersEyebrow || "Careers"}</Eyebrow>
        <div className={styles.careersBody}>
          <div data-motion-item><CareersBanner email={site.email} /></div>
        </div>
      </section>

      <Footer content={siteFooter(site)} sectionId="contact" />
    </main>
  );
}
