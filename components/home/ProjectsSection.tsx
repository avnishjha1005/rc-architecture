import type { HomeContent } from "@/content/home";
import { FeaturedProjectGrid } from "@/components/projects/FeaturedProjectGrid";

export function ProjectsSection({ content }: { content: HomeContent["projects"] }) {
  return <FeaturedProjectGrid content={content} />;
}
