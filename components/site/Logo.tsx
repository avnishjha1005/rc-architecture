import Link from "next/link";
import Image from "next/image";
import styles from "./Logo.module.css";

export function Logo({ name, tone = "light" }: { name: string; tone?: "light" | "dark" }) {
  const isDarkBackground = tone === "dark";

  return (
    <Link className={styles.brand} href="/" aria-label={`${name} home`}>
      <Image
        className={styles.image}
        src={isDarkBackground ? "/RC_White.png" : "/RC LOGO TRANSPARENT 1.png"}
        width={isDarkBackground ? 359 : 2804}
        height={isDarkBackground ? 64 : 408}
        alt=""
        priority
      />
    </Link>
  );
}
