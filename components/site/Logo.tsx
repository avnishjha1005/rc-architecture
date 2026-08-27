import Link from "next/link";
import Image from "next/image";

export function Logo({ name, tone = "light" }: { name: string; tone?: "light" | "dark" }) {
  return (
    <Link className={`brand brand--${tone}`} href="/" aria-label={`${name} home`}>
      <Image src="/RC LOGO TRANSPARENT 1.png" width={2804} height={408} alt="" priority />
    </Link>
  );
}
