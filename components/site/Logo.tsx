import Link from "next/link";
import Image from "next/image";

export function Logo({ name, tone = "light" }: { name: string; tone?: "light" | "dark" }) {
  const isDarkBackground = tone === "dark";

  return (
    <Link className={`brand brand--${tone}`} href="/" aria-label={`${name} home`}>
      <Image
        src={isDarkBackground ? "/RC_White.png" : "/RC LOGO TRANSPARENT 1.png"}
        width={isDarkBackground ? 359 : 2804}
        height={isDarkBackground ? 64 : 408}
        alt=""
        priority
      />
    </Link>
  );
}
