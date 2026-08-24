import Link from "next/link";
import Image from "next/image";

export function Logo({ name }: { name: string }) {
  return (
    <Link className="brand" href="/" aria-label={`${name} home`}>
      <Image src="/RC LOGO TRANSPARENT 1.png" width={2804} height={408} alt="" priority />
    </Link>
  );
}
