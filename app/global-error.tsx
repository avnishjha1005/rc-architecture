"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="status-page"><p>(Error)</p><h1>We hit a problem.</h1><span>Please refresh the page or try again shortly.</span><div><button type="button" onClick={reset}>Try again</button><Link href="/">Return home</Link></div></main></body></html>;
}
