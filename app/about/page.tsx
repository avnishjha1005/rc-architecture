import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import { suppliedClientLogos } from "@/content/client-logos";
import { CareersBanner } from "@/components/site/CareersBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillAction } from "@/components/ui/PillAction";
import { Reveal } from "@/components/ui/Reveal";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { getSingletonMetadata } from "@/sanity/lib/metadata";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { resolveImage, type CmsResponsiveImage } from "@/lib/responsive-image";
import { IntroImageCarousel } from "./IntroImageCarousel";
import { AboutStats } from "./AboutStats";
import { PeopleDirectory, type DirectoryPerson } from "./PeopleDirectory";
import { PhilosophyPrinciples } from "./PhilosophyPrinciples";
import styles from "./about.module.css";
import layout from "./about-layout.module.css";

export function generateMetadata() {
  return getSingletonMetadata("aboutPage", {
    title: "About Us — RC Architecture",
    description: "Meet RC Architecture: our studio, philosophy, clients, people, awards, and culture.",
  });
}

const principles = [
  ["Environment", "We do not look at sustainability as something applied to a building. We believe that sustainability should be in the DNA."],
  ["Economy", "Value for money, design, the client, the environment. We understand the importance of economy and how to stretch it."],
  ["Evolve", "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients."],
  ["Emotion", "We value culture, tradition, history and the emotion underlying every project. We create environments that are sensitive to human behaviour."],
];

const awards = [
  ["Ashgrove", "ArchForm Renovation Award", "2023"],
  ["Stonefield", "Modern Home Excellence", "2024"],
  ["Orchard", "Small Space Design Honours", "2022"],
  ["Haywood", "Residential Detail Award", "2024"],
  ["Belmont", "Contemporary Bath Feature", "2023"],
];

export default async function AboutPage() {
  type AboutData = { heroTitle?: string; heroEyebrow?: string; heroImageUrl?: string; heroImageAlt?: string; heroImageData?: CmsResponsiveImage; introEyebrow?: string; introHeading?: string; introParagraphs?: string[]; introImages?: { imageUrl?: string; imageAlt?: string }[]; stats?: { label?: string; value?: string }[]; philosophyEyebrow?: string; philosophyHeading?: string; philosophyIntro?: string; principles?: { title?: string; description?: string }[]; clientsEyebrow?: string; clientsHeading?: string; clientsIntro?: string; clientLogos?: { imageUrl?: string; imageAlt?: string; website?: string }[]; peopleEyebrow?: string; peopleHeading?: string; people?: (DirectoryPerson & { imageUrl?: string; imageAlt?: string })[]; awardsEyebrow?: string; awardsHeading?: string; awardsIntro?: string; awards?: { project?: string; award?: string; year?: string }[]; careersEyebrow?: string; valuesHeading?: string; valuesIntro?: string; values?: { icon?: string; title?: string; description?: string }[] } | null;
  const sanityClient = await getSanityClient();
  const [page, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<AboutData>(aboutPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const introImages = page?.introImages?.filter((image) => image.imageUrl) || [];
  const introCarouselImages = [
    { imageUrl: introImages[0]?.imageUrl || "/images/about/studio-garden.png", imageAlt: introImages[0]?.imageAlt || "Garden residence designed by RC Architecture" },
    { imageUrl: introImages[1]?.imageUrl || "/images/about/studio-ocean.png", imageAlt: introImages[1]?.imageAlt || "A calm concrete home overlooking the water" },
    { imageUrl: introImages[2]?.imageUrl || "/images/about/studio-kitchen.png", imageAlt: introImages[2]?.imageAlt || "Warm contemporary kitchen and living space" },
  ];
  const statItems: Array<readonly [string, string]> = page?.stats?.length ? page.stats.flatMap((item): Array<readonly [string, string]> => item.label && item.value ? [[item.label, item.value]] : []) : [["Projects we finished", "126+"], ["Our Clients", "80+"], ["Our Partners", "24+"]];
  const principleItems = page?.principles?.length ? page.principles.flatMap((item) => item.title ? [[item.title, item.description || ""]] : []) : principles;
  const cmsLogos = page?.clientLogos?.flatMap((logo) => {
    if (!logo.imageUrl) return [];
    const known = suppliedClientLogos.find(item => item.imageAlt.toLowerCase() === logo.imageAlt?.trim().toLowerCase());
    const website = logo.website && /^https?:\/\//i.test(logo.website) ? logo.website : known?.website;
    return [{ imageUrl: logo.imageUrl, imageAlt: logo.imageAlt || "Client logo", website }];
  });
  const clientLogos: { imageUrl: string; imageAlt: string; width?: number; website?: string }[] = cmsLogos?.length ? cmsLogos : suppliedClientLogos;
  const people = page?.people?.filter((person) => person.name?.trim()) || [];
  const portraits = people.filter((person) => person.imageUrl);
  const directory = people.filter((person) => !person.imageUrl);
  const awardItems = page?.awards?.length ? page.awards.flatMap((item) => item.project && item.award ? [[item.project, item.award, item.year || ""]] : []) : awards;
  const valueItems = page?.values?.length ? page.values.flatMap((item) => item.title ? [{ title: item.title, icon: item.icon || "•", description: item.description || "" }] : []) : [["Open & Welcoming", "•"], ["Growth at Every Step", "∶"], ["Empathy & Kindness", "♣"]].map(([title, icon]) => ({ title, icon, description: "We do at look at sustainability as something applied on a building. We believe that sustainability should be in the DNA." }));
  const heroImage = resolveImage(page?.heroImageData, page?.heroImageUrl || "/images/home/service-architecture.jpg", page?.heroImageAlt || "Contemporary RC Architecture residence");
  const heroSizes = heroImage.width && heroImage.height ? `max(100vw, ${Math.ceil(100 * heroImage.width / heroImage.height)}svh)` : "100vw";
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${layout.hero}`} data-motion-group="hero">
        <div className={layout.heroMedia}>
          <ResponsiveImage image={heroImage} fill loading="eager" sizes={heroSizes} className={styles.heroImage} data-motion-image data-motion-parallax />
        </div>
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <div className={layout.heroTitle}>
          {page?.heroEyebrow && <p className={layout.heroCaption}>{page.heroEyebrow}</p>}
          <h1 data-motion-item>{page?.heroTitle || "About\nRC Architecture"}</h1>
        </div>
      </section>

      <section className={`${styles.section} ${styles.intro} ${layout.intro}`} id="who-we-are" data-motion-group="section">
        <Eyebrow className={styles.label} data-motion-item>{page?.introEyebrow || "Who we are"}</Eyebrow>
        <Reveal className={`${styles.introHeadline} ${layout.introHeadline}`}>
          <h2>{(page?.introHeading || "We’re a studio built on clarity,\ncare, and long-term thinking.\nDesigning and managing homes\nthat hold up over time.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        </Reveal>
        <div className={`${styles.photoGarden} ${layout.garden}`} style={{ position: "absolute" }} data-motion-item data-motion-image><Image src={introImages[0]?.imageUrl || "/images/about/studio-garden.png"} alt={introImages[0]?.imageAlt || "Garden residence designed by RC Architecture"} fill sizes="(max-width: 900px) 84vw, 54vw" /></div>
        <div className={`${styles.photoOcean} ${layout.ocean}`} style={{ position: "absolute" }} data-motion-item data-motion-image><Image src={introImages[1]?.imageUrl || "/images/about/studio-ocean.png"} alt={introImages[1]?.imageAlt || "A calm concrete home overlooking the water"} fill sizes="(max-width: 900px) 84vw, 25vw" /></div>
        <div className={`${styles.photoKitchen} ${layout.kitchen}`} style={{ position: "absolute" }} data-motion-item data-motion-image><Image src={introImages[2]?.imageUrl || "/images/about/studio-kitchen.png"} alt={introImages[2]?.imageAlt || "Warm contemporary kitchen and living space"} fill sizes="(max-width: 900px) 84vw, 32vw" /></div>
        <div className={`${styles.introCopy} ${layout.introCopy}`} data-motion-item>
          {(page?.introParagraphs?.length ? page.introParagraphs : ["We don’t follow trends or rush timelines. Every project begins with listening — to how you live, what matters most, and where clarity is missing. It’s not about surface-level change, but understanding the way a space needs to work, feel, and evolve over time. From those conversations, we shape environments with structure, rhythm, and intention.", "From those conversations, we shape environments with structure, rhythm, and intention — built for the people who use them, and made to hold up well beyond the finished photo. With experience across design, building, and project management."]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <IntroImageCarousel images={introCarouselImages} />
      </section>

      <AboutStats className={`${styles.stats} ${layout.stats}`} items={statItems} />

      <section className={`${styles.section} ${styles.philosophy} ${layout.philosophy}`}>
        <Eyebrow className={styles.label}>{page?.philosophyEyebrow || "Our ideology"}</Eyebrow>
        <div className={styles.philosophyContent}>
          <Reveal><h2>{(page?.philosophyHeading || "Our Philosophy\n& Ideologies.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p className={styles.subcopy}>{page?.philosophyIntro || "A collective of architects, designers, and specialists growing bold ideas through collaboration and future thinking."}</p></Reveal>
          <PhilosophyPrinciples items={principleItems} />
        </div>
      </section>

      <section className={`${styles.clients} ${styles.section} ${layout.clients}`} id="clients" data-motion-group="section">
        <Eyebrow className={styles.label} data-motion-item>{page?.clientsEyebrow || "Our clients"}</Eyebrow>
        <div className={styles.clientsBody}>
          <div className={styles.clientsTitle} data-motion-item><h2>{page?.clientsHeading || "Our Clients."}</h2><p>{page?.clientsIntro || "Collaborating with organisations who share our belief in purposeful spaces."}</p></div>
          {clientLogos.length > 0 && <div className={`${styles.clientGrid} ${layout.clientGrid}`}>
            {clientLogos.map((logo) => {
              const image = logo.width ? <span className={layout.localLogo} style={{ width: `${logo.width / 560 * 100}%`, maxWidth: logo.width / 2 }}>
                <Image src={logo.imageUrl} alt={logo.imageAlt} fill unoptimized />
              </span> : <Image src={logo.imageUrl} alt={logo.imageAlt} fill sizes="(max-width: 900px) 32vw, 20vw" />;
              return <div key={logo.imageUrl} data-motion-item>
                {logo.website ? <a className={layout.logoLink} href={logo.website} target="_blank" rel="noopener noreferrer" aria-label={`${logo.imageAlt} website (opens in a new tab)`}>{image}</a> : image}
              </div>;
            })}
            <div className={styles.clientMore} data-motion-item><Link href="/clients">View all clients →</Link></div>
          </div>}
        </div>
      </section>

      {people.length > 0 && <section className={`${styles.section} ${styles.team} ${layout.team}`} data-motion-group="section" data-people-preview="">
        <Eyebrow className={styles.label} data-motion-item>{page?.peopleEyebrow || "People"}</Eyebrow>
        <div className={styles.teamBody}>
          <Reveal><h2 className={layout.peopleHeading}>{page?.peopleHeading || "People Behind\nRC Architecture."}</h2></Reveal>
          {portraits.length > 0 && <div className={`${styles.peopleGrid} ${layout.peopleGrid}`} data-card-group>{portraits.map((person, index) => (
            <article key={`${person.name}-${index}`} data-card data-motion-item>
              <div className={styles.portrait}><Image src={person.imageUrl!} alt={person.imageAlt || person.name || ""} fill sizes="(max-width: 900px) 58vw, 16vw" /></div>
              <div><h3>{person.name}</h3><p>{person.role}</p></div>
            </article>
          ))}</div>}
          {directory.length > 0 && <PeopleDirectory people={directory} />}
        </div>
      </section>}

      <section className={`${styles.section} ${styles.awards} ${layout.awards}`} data-motion-group="section">
        <Eyebrow className={styles.label} data-motion-item>{page?.awardsEyebrow || "Awards"}</Eyebrow>
        <div className={styles.awardsBody}>
          <div className={styles.awardsHeading} data-motion-item><h2>{(page?.awardsHeading || "Awards &\nRecognitions.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p>{page?.awardsIntro || "Explore our awards and see how we bring creativity and expertise to every project."}</p></div>
          <table className={layout.awardsTable} aria-label="Awards and recognitions">
            <thead><tr><th scope="col">Projects</th><th scope="col">Award</th><th scope="col">Year</th></tr></thead>
            <tbody>{awardItems.map(([project, award, year]) => <tr key={project} data-draw-rule="bottom"><td>{project}</td><td>{award}</td><td>{year}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className={`${styles.careers} ${styles.section}`} data-motion-group="section">
        <Eyebrow className={styles.label} data-motion-item>{page?.careersEyebrow || "Careers"}</Eyebrow>
        <div className={styles.careersBody}>
          <CareersBanner email={site.email} showAction={false} marquee />
          <div className={styles.valuesIntro} data-motion-item><h3>{(page?.valuesHeading || "Our Team Values\nDiscipline & Principles").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h3><p>{page?.valuesIntro || "We are excited to get started on new possibilities. We sketch, brainstorm, visualize and hurrah! We believe in a light-hearted workplace that results in some serious excellence."}</p></div>
          <div className={styles.values} data-card-group>{valueItems.map(({ title, description }) => <article key={title} data-card data-motion-item><span className={styles.valueIcon} aria-hidden="true"><i /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
          <div className={`${styles.careersAction} ${layout.careersAction}`}>
            <PillAction href={`mailto:${site.email}?subject=Career%20opportunity`}>Explore opportunities</PillAction>
          </div>
        </div>
      </section>

      <Footer content={siteFooter(site)} sectionId="contact" />
    </main>
  );
}
