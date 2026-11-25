import { NextStudio } from "next-sanity/studio";
import { notFound } from "next/navigation";

import config from "@/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (process.env.RC_STAGING === "1") notFound();
  return <NextStudio config={config} />;
}
