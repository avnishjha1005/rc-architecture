import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const hankenGrotesk = localFont({
  variable: "--font-hanken-grotesk",
  display: "swap",
  src: [
    { path: "../public/fonts/HankenGrotesk-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/HankenGrotesk-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
});

const chivoMono = localFont({
  variable: "--font-chivo-mono",
  display: "swap",
  src: [
    { path: "../public/fonts/ChivoMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/ChivoMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/ChivoMono-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/ChivoMono-Bold.ttf", weight: "700", style: "normal" },
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
      <body>{children}</body>
    </html>
  );
}
