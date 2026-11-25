import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteMotion } from "@/components/site/SiteMotion";
import { PageTransition } from "@/components/site/PageTransition";
import { FeedbackPreview } from "@rc/website-feedback/preview";
import { ChiselPreview } from "@/components/chisel/ReviewClient";

const hankenGrotesk = localFont({
  variable: "--font-hanken-grotesk",
  display: "swap",
  preload: false,
  src: [
    { path: "../public/fonts/HankenGrotesk-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-SemiBold.woff2", weight: "600", style: "normal" },
  ],
});

const chivoMono = localFont({
  variable: "--font-chivo-mono",
  display: "swap",
  preload: false,
  src: [
    { path: "../public/fonts/ChivoMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/ChivoMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ChivoMono-SemiBold.woff2", weight: "600", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "RC Architecture — Space Making",
  description: "A Bengaluru-based design studio crafting high-impact spaces with purpose.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${chivoMono.variable} h-full antialiased`}
    >
      <body><SiteMotion /><SmoothScroll /><a className="skip-link" href="#main-content">Skip to main content</a><PageTransition><Suspense fallback={<main className="loading-page" aria-label="Loading"><div /><div /><div /><span className="sr-only">Loading page</span></main>}>{children}<noscript data-route-content-ready="" /></Suspense></PageTransition><FeedbackPreview />{process.env.CHISEL_ENABLED === "1" && <ChiselPreview />}</body>
    </html>
  );
}
