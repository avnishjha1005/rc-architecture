import Image from "next/image";
import { PillAction } from "@/components/ui/PillAction";
import styles from "./CareersBanner.module.css";

const images = [
  { src: "/images/about/team-event.png", alt: "RC Architecture team at an event" },
  { src: "/images/about/team-lunch.png", alt: "RC Architecture team lunch" },
  { src: "/images/about/team-outing.png", alt: "RC Architecture team outdoors" },
];

function ImageSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className={styles.imageSet} aria-hidden={duplicate || undefined}>
      {images.map((image) => (
        <div className={styles.image} key={`${duplicate ? "duplicate-" : ""}${image.src}`}>
          <Image src={image.src} alt={duplicate ? "" : image.alt} fill sizes="(max-width: 900px) 52vw, 36vw" />
        </div>
      ))}
    </div>
  );
}

export function CareersBanner({ email }: { email: string }) {
  return (
    <div className={styles.banner}>
      <h2>Interested in<br /><span>Working with us?</span></h2>
      <p>RCA has always had a young energy. Each and every member of the team possesses curiosity towards the new and exciting. We work and play hard. We believe in delivering excellent results while following extremely ethical business practices.</p>
      <PillAction className={styles.button} href={`mailto:${email}?subject=Career%20opportunity`}>Explore opportunities</PillAction>
      <div className={styles.carousel} aria-label="Life at RC Architecture">
        <div className={styles.track}>
          <ImageSet />
          <ImageSet duplicate />
        </div>
      </div>
    </div>
  );
}
