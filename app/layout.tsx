import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteMotion } from "@/components/site/SiteMotion";

const hankenGrotesk = localFont({
  variable: "--font-hanken-grotesk",
  display: "swap",
  preload: false,
  src: [
    { path: "../public/fonts/HankenGrotesk-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-SemiBold.ttf", weight: "600", style: "normal" },
  ],
});

const chivoMono = localFont({
  variable: "--font-chivo-mono",
  display: "swap",
  preload: false,
  src: [
    { path: "../public/fonts/ChivoMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/ChivoMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/ChivoMono-SemiBold.ttf", weight: "600", style: "normal" },
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
      className={`${hankenGrotesk.variable} ${chivoMono.variable} h-full antialiased motion-ready`}
    >
      <body><SmoothScroll /><a className="skip-link" href="#main-content">Skip to main content</a><div id="main-content" tabIndex={-1}>{children}</div><SiteMotion /><noscript><style>{`.motion-ready [data-motion-item]{opacity:1!important;transform:none!important}.motion-ready [data-motion-image],.motion-ready [data-motion-image] img{transform:none!important}`}</style></noscript></body>
    </html>
  );
}
