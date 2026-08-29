import type { Metadata } from "next";
import Image from "next/image";
import { CareersBanner } from "@/components/site/CareersBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
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
  const site = await getSiteData();
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src="/images/home/service-architecture.jpg" alt="Contemporary RC Architecture residence" fill priority sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="dark" />
        <h1>About<br />RC Architecture</h1>
      </section>

      <section className={`${styles.section} ${styles.intro}`}>
        <Eyebrow className={styles.label}>Who we are</Eyebrow>
        <Reveal className={styles.introHeadline}>
          <h2>We’re a studio built on clarity,<br />care, and long-term thinking.<br />Designing and managing homes<br />that hold up over time.</h2>
        </Reveal>
        <div className={styles.photoGarden}><Image src="/images/about/studio-garden.png" alt="Garden residence designed by RC Architecture" fill sizes="50vw" /></div>
        <div className={styles.photoOcean}><Image src="/images/about/studio-ocean.png" alt="A calm concrete home overlooking the water" fill sizes="20vw" /></div>
        <div className={styles.photoKitchen}><Image src="/images/about/studio-kitchen.png" alt="Warm contemporary kitchen and living space" fill sizes="25vw" /></div>
        <div className={styles.introCopy}>
          <p>We don’t follow trends or rush timelines. Every project begins with listening — to how you live, what matters most, and where clarity is missing. It’s not about surface-level change, but understanding the way a space needs to work, feel, and evolve over time. From those conversations, we shape environments with structure, rhythm, and intention.</p>
          <p>From those conversations, we shape environments with structure, rhythm, and intention — built for the people who use them, and made to hold up well beyond the finished photo. With experience across design, building, and project management.</p>
        </div>
      </section>

      <section className={styles.stats} aria-label="Studio statistics">
        {[["Projects we finished", "126+"], ["Our Clients", "80+"], ["Our Partners", "24+"]].map(([name, value]) => <div key={name}><p>{name}</p><strong>{value}</strong></div>)}
      </section>

      <section className={`${styles.section} ${styles.philosophy}`}>
        <Eyebrow className={styles.label}>Our ideology</Eyebrow>
        <div className={styles.philosophyContent}>
          <Reveal><h2>Our Philosophy<br />&amp; Ideologies.</h2><p className={styles.subcopy}>A collective of architects, designers, and specialists growing bold ideas through collaboration and future thinking.</p></Reveal>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyMark} aria-hidden="true"><span>rc</span></div>
            <div className={styles.principles}>{principles.map(([title, copy], index) => <article key={title}><small>[{String(index + 1).padStart(2, "0")}]</small><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
          </div>
        </div>
      </section>

      <section className={`${styles.clients} ${styles.section}`} id="clients">
        <Eyebrow className={styles.label}>Our clients</Eyebrow>
        <div className={styles.clientsBody}>
          <div className={styles.clientsTitle}><h2>Our Clients.</h2><p>Collaborating with organisations who share our belief in purposeful spaces.</p></div>
          <div className={styles.clientGrid}>{["ECHO))", "BAGGU", "◯ BRANCH", "⌁ ClickUp", "ECHO))", "◯ BRANCH", "⌁ ClickUp", "BAGGU", "ECHO))", "BAGGU", "ECHO))", "BAGGU", "◯ BRANCH", "⌁ ClickUp", "◯ BRANCH", "◯ BRANCH", "⌁ ClickUp", "⌁ ClickUp", "+355 more..."].map((client, i) => <span key={`${client}-${i}`}>{client}</span>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.team}`}>
        <Eyebrow className={styles.label}>People</Eyebrow>
        <div className={styles.teamBody}>
          <Reveal><h2>People Behind<br />RC Architecture.</h2></Reveal>
          <div className={styles.peopleGrid}>{people.map((person, index) => <article key={`${person.name}-${index}`}><div className={styles.portrait}><Image src={person.image} alt={person.name} fill sizes="20vw" /></div><div><h3>{person.name}</h3><p>{person.role}</p></div></article>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.awards}`}>
        <Eyebrow className={styles.label}>Awards</Eyebrow>
        <div className={styles.awardsBody}>
          <div className={styles.awardsHeading}><h2>Awards &amp;<br />Recognitions.</h2><p>Explore our awards and see how we bring creativity and expertise to every project.</p></div>
          <div className={styles.awardsTable}>{awards.map(([project, award, year]) => <div key={project}><span>{project}</span><span>{award}</span><span>{year}</span></div>)}</div>
        </div>
      </section>

      <section className={`${styles.careers} ${styles.section}`}>
        <Eyebrow className={styles.label}>Careers</Eyebrow>
        <div className={styles.careersBody}>
          <CareersBanner email={site.email} />
          <div className={styles.valuesIntro}><h3>Our Team Values<br />Discipline &amp; Principles</h3><p>We are excited to get started on new possibilities. We sketch, brainstorm, visualize and hurrah! We believe in a light-hearted workplace that results in some serious excellence.</p></div>
          <div className={styles.values}>{[["Open & Welcoming", "•"], ["Growth at Every Step", "∶"], ["Empathy & Kindness", "♣"]].map(([title, icon]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>We do at look at sustainability as something applied on a building. We believe that sustainability should be in the DNA.</p></article>)}</div>
        </div>
      </section>

      <Footer content={siteFooter(site)} sectionId="contact" />
    </main>
  );
}
