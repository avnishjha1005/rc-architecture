import Link from "next/link";

export default function NotFound() {
  return <main className="status-page"><p>(404)</p><h1>This space doesn’t exist.</h1><span>The page may have moved, or the address may be incorrect.</span><div><Link href="/projects">View projects</Link><Link href="/">Return home</Link></div></main>;
}
