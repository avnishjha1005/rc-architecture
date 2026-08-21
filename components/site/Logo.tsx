import Link from "next/link";
import Image from "next/image";

export function Logo({ name }: { name: string }) {
  return (
    <Link className="brand" href="/" aria-label={`${name} home`}>
      <Image src="/RCALogo.svg" width={200} height={54} alt="" priority />
    </Link>
  );
}
