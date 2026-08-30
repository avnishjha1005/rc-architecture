import type { Metadata } from "next";
import Image from "next/image";
import { CareersBanner } from "@/components/site/CareersBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us — RC Architecture",
  description: "Meet RC Architecture: our studio, philosophy, clients, people, awards, and culture.",
};

const principles = [
  ["Environment", "We do not look at sustainability as something applied to a building. We believe that sustainability should be in the DNA."],
  ["Economy", "Value for money, design, the client, the environment. We understand the importance of economy and how to stretch it."],
  ["Evolve", "Design is ever evolving, and so is technology. That is why we intend to keep up with innovation to bring out the best facilities for our clients."],
  ["Emotion", "We value culture, tradition, history and the emotion underlying every project. We create environments that are sensitive to human behaviour."],
];

const people = [
  { name: "Tomás Ortega", role: "Founder & Creative Director", image: "/images/about/team-tomas.png" },
  { name: "Clara Moreau", role: "Lead Architect", image: "/images/about/team-clara.png" },
  { name: "Tomás Ortega", role: "Founder & Creative Director", image: "/images/about/team-tomas.png" },
  { name: "Clara Moreau", role: "Lead Architect", image: "/images/about/team-clara.png" },
  { name: "Tomás Ortega", role: "Founder & Creative Director", image: "/images/about/team-tomas.png" },
  { name: "Clara Moreau", role: "Lead Architect", image: "/images/about/team-clara.png" },
];

const awards = [
  ["Ashgrove", "ArchForm Renovation Award", "2023"],
  ["Stonefield", "Modern Home Excellence", "2024"],
  ["Orchard", "Small Space Design Honours", "2022"],
  ["Haywood", "Residential Detail Award", "2024"],
  ["Belmont", "Contemporary Bath Feature", "2023"],
];

export default async function AboutPage() {
  type AboutData = { heroTitle?: string; heroImageUrl?: string; heroImageAlt?: string; introEyebrow?: string; introHeading?: string; introParagraphs?: string[]; introImages?: { imageUrl?: string; imageAlt?: string }[]; stats?: { label?: string; value?: string }[]; philosophyEyebrow?: string; philosophyHeading?: string; philosophyIntro?: string; principles?: { title?: string; description?: string }[]; clientsEyebrow?: string; clientsHeading?: string; clientsIntro?: string; clientNames?: string[]; peopleEyebrow?: string; peopleHeading?: string; people?: { name?: string; role?: string; imageUrl?: string; imageAlt?: string }[]; awardsEyebrow?: string; awardsHeading?: string; awardsIntro?: string; awards?: { project?: string; award?: string; year?: string }[]; careersEyebrow?: string; valuesHeading?: string; valuesIntro?: string; values?: { icon?: string; title?: string; description?: string }[] } | null;
  const sanityClient = await getSanityClient();
  const [page, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<AboutData>(aboutPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const introImages = page?.introImages?.filter((image) => image.imageUrl) || [];
  const statItems = page?.stats?.length ? page.stats.flatMap((item) => item.label && item.value ? [[item.label, item.value]] : []) : [["Projects we finished", "126+"], ["Our Clients", "80+"], ["Our Partners", "24+"]];
  const principleItems = page?.principles?.length ? page.principles.flatMap((item) => item.title ? [[item.title, item.description || ""]] : []) : principles;
  const peopleItems = page?.people?.length ? page.people.flatMap((person) => person.name && person.imageUrl ? [{ name: person.name, role: person.role || "", image: person.imageUrl, imageAlt: person.imageAlt || person.name }] : []) : people.map((person) => ({ ...person, imageAlt: person.name }));
  const awardItems = page?.awards?.length ? page.awards.flatMap((item) => item.project && item.award ? [[item.project, item.award, item.year || ""]] : []) : awards;
  const valueItems = page?.values?.length ? page.values.flatMap((item) => item.title ? [{ title: item.title, icon: item.icon || "•", description: item.description || "" }] : []) : [["Open & Welcoming", "•"], ["Growth at Every Step", "∶"], ["Empathy & Kindness", "♣"]].map(([title, icon]) => ({ title, icon, description: "We do at look at sustainability as something applied on a building. We believe that sustainability should be in the DNA." }));
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src={page?.heroImageUrl || "/images/home/service-architecture.jpg"} alt={page?.heroImageAlt || "Contemporary RC Architecture residence"} fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <h1>{(page?.heroTitle || "About\nRC Architecture").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
      </section>

      <section className={`${styles.section} ${styles.intro}`}>
        <Eyebrow className={styles.label}>{page?.introEyebrow || "Who we are"}</Eyebrow>
        <Reveal className={styles.introHeadline}>
          <h2>{(page?.introHeading || "We’re a studio built on clarity,\ncare, and long-term thinking.\nDesigning and managing homes\nthat hold up over time.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
        </Reveal>
        <div className={styles.photoGarden}><Image src={introImages[0]?.imageUrl || "/images/about/studio-garden.png"} alt={introImages[0]?.imageAlt || "Garden residence designed by RC Architecture"} fill sizes="50vw" /></div>
        <div className={styles.photoOcean}><Image src={introImages[1]?.imageUrl || "/images/about/studio-ocean.png"} alt={introImages[1]?.imageAlt || "A calm concrete home overlooking the water"} fill sizes="20vw" /></div>
        <div className={styles.photoKitchen}><Image src={introImages[2]?.imageUrl || "/images/about/studio-kitchen.png"} alt={introImages[2]?.imageAlt || "Warm contemporary kitchen and living space"} fill sizes="25vw" /></div>
        <div className={styles.introCopy}>
          {(page?.introParagraphs?.length ? page.introParagraphs : ["We don’t follow trends or rush timelines. Every project begins with listening — to how you live, what matters most, and where clarity is missing. It’s not about surface-level change, but understanding the way a space needs to work, feel, and evolve over time. From those conversations, we shape environments with structure, rhythm, and intention.", "From those conversations, we shape environments with structure, rhythm, and intention — built for the people who use them, and made to hold up well beyond the finished photo. With experience across design, building, and project management."]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className={styles.stats} aria-label="Studio statistics">
        {statItems.map(([name, value]) => <div key={name}><p>{name}</p><strong>{value}</strong></div>)}
      </section>

      <section className={`${styles.section} ${styles.philosophy}`}>
        <Eyebrow className={styles.label}>{page?.philosophyEyebrow || "Our ideology"}</Eyebrow>
        <div className={styles.philosophyContent}>
          <Reveal><h2>{(page?.philosophyHeading || "Our Philosophy\n& Ideologies.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p className={styles.subcopy}>{page?.philosophyIntro || "A collective of architects, designers, and specialists growing bold ideas through collaboration and future thinking."}</p></Reveal>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyMark} aria-hidden="true"><span>rc</span></div>
            <div className={styles.principles}>{principleItems.map(([title, copy], index) => <article key={title}><small>[{String(index + 1).padStart(2, "0")}]</small><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
          </div>
        </div>
      </section>

      <section className={`${styles.clients} ${styles.section}`} id="clients">
        <Eyebrow className={styles.label}>{page?.clientsEyebrow || "Our clients"}</Eyebrow>
        <div className={styles.clientsBody}>
          <div className={styles.clientsTitle}><h2>{page?.clientsHeading || "Our Clients."}</h2><p>{page?.clientsIntro || "Collaborating with organisations who share our belief in purposeful spaces."}</p></div>
          <div className={styles.clientGrid}>{(page?.clientNames?.length ? page.clientNames : ["ECHO))", "BAGGU", "◯ BRANCH", "⌁ ClickUp", "ECHO))", "◯ BRANCH", "⌁ ClickUp", "BAGGU", "ECHO))", "BAGGU", "ECHO))", "BAGGU", "◯ BRANCH", "⌁ ClickUp", "◯ BRANCH", "◯ BRANCH", "⌁ ClickUp", "⌁ ClickUp", "+355 more..."]).map((client, i) => <span key={`${client}-${i}`}>{client}</span>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.team}`}>
        <Eyebrow className={styles.label}>{page?.peopleEyebrow || "People"}</Eyebrow>
        <div className={styles.teamBody}>
          <Reveal><h2>{(page?.peopleHeading || "People Behind\nRC Architecture.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2></Reveal>
          <div className={styles.peopleGrid}>{peopleItems.map((person, index) => <article key={`${person.name}-${index}`}><div className={styles.portrait}><Image src={person.image} alt={person.imageAlt} fill sizes="20vw" /></div><div><h3>{person.name}</h3><p>{person.role}</p></div></article>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.awards}`}>
        <Eyebrow className={styles.label}>{page?.awardsEyebrow || "Awards"}</Eyebrow>
        <div className={styles.awardsBody}>
          <div className={styles.awardsHeading}><h2>{(page?.awardsHeading || "Awards &\nRecognitions.").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2><p>{page?.awardsIntro || "Explore our awards and see how we bring creativity and expertise to every project."}</p></div>
          <div className={styles.awardsTable}>{awardItems.map(([project, award, year]) => <div key={project}><span>{project}</span><span>{award}</span><span>{year}</span></div>)}</div>
        </div>
      </section>

      <section className={`${styles.careers} ${styles.section}`}>
        <Eyebrow className={styles.label}>{page?.careersEyebrow || "Careers"}</Eyebrow>
        <div className={styles.careersBody}>
          <CareersBanner email={site.email} />
          <div className={styles.valuesIntro}><h3>{(page?.valuesHeading || "Our Team Values\nDiscipline & Principles").split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h3><p>{page?.valuesIntro || "We are excited to get started on new possibilities. We sketch, brainstorm, visualize and hurrah! We believe in a light-hearted workplace that results in some serious excellence."}</p></div>
          <div className={styles.values}>{valueItems.map(({ title, icon, description }) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <Footer content={siteFooter(site)} sectionId="contact" />
    </main>
  );
}
