"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="status-page"><p>(Error)</p><h1>Something went wrong.</h1><span>Please try again. If the problem continues, contact the studio directly.</span><div><button type="button" onClick={reset}>Try again</button><Link href="/">Return home</Link></div></main>;
}
