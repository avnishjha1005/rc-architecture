"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    if (process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === "true") {
      void fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "render-error", message: error.message, digest: error.digest, path: window.location.pathname }),
      });
    }
  }, [error]);

  return <main className="status-page"><p>(Error)</p><h1>Something went wrong.</h1><span>Please try again. If the problem continues, contact the studio directly.</span><div><button type="button" onClick={reset}>Try again</button><Link href="/">Return home</Link></div></main>;
}
