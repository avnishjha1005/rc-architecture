import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/components/projects/ProjectDetailPage";
import { getProjectDetail, projectDetails, type ProjectDetail } from "@/content/projectDetails";
import { portfolioProjects, selectRelatedProjects, type PortfolioProject } from "@/content/projects";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { projectBySlugQuery } from "@/sanity/lib/queries";
import { getSiteData } from "@/sanity/lib/site";

type CmsProjectCard = {
  _id?: string; title?: string; featuredTitle?: string; slug?: string; type?: string;
  category?: string; location?: string; yearDisplay?: string; imageUrl?: string; imageAlt?: string;
};

type CmsProjectDetail = {
  title?: string;
  featuredTitle?: string;
  slug?: string;
  discipline?: string;
  category?: string;
  location?: string;
  yearDisplay?: string;
  excerpt?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  gallery?: { imageUrl?: string; imageAlt?: string }[];
  relatedProjects?: CmsProjectCard[];
} | null;

function normalizeRelated(projects: CmsProjectCard[] | undefined): PortfolioProject[] {
  return (projects ?? []).flatMap((project, index) => {
    if (!project.title || !project.slug || !project.imageUrl) return [];
    const type = project.type === "Interior Design" ? "Interior Design" : "Architecture";
    return [{
      id: project._id || project.slug || index,
      slug: project.slug,
      title: project.title,
      featuredTitle: project.featuredTitle,
      type,
      category: project.category || type,
      location: project.location || "Location forthcoming",
      year: project.yearDisplay || "Year forthcoming",
      imageUrl: project.imageUrl,
      imageAlt: project.imageAlt || project.title,
      href: `/projects/${project.slug}`,
    }];
  });
}

async function resolveProject(slug: string): Promise<{ project: ProjectDetail; related: PortfolioProject[] } | undefined> {
  const sanityClient = await getSanityClient();
  const cmsProject = isSanityConfigured
    ? await sanityClient.fetch(projectBySlugQuery, { slug }, { next: { revalidate: 60 } }).catch((error) => {
      console.error(`Unable to load project ${slug} from Sanity`, error);
      return null;
    }) as CmsProjectDetail
    : null;

  if (!cmsProject?.title || !cmsProject.slug || !cmsProject.heroImageUrl) {
    const project = getProjectDetail(slug);
    return project ? { project, related: selectRelatedProjects(slug, portfolioProjects) } : undefined;
  }

  const title = cmsProject.featuredTitle || cmsProject.title;
  const discipline = cmsProject.discipline || "Architecture";
  const project: ProjectDetail = {
    slug: cmsProject.slug,
    title,
    eyebrow: cmsProject.category || discipline,
    summary: cmsProject.excerpt || `${discipline} shaped by its setting`,
    introduction: cmsProject.excerpt || `${title} reflects our considered approach to ${discipline.toLowerCase()}, balancing character, function, and a strong sense of place.`,
    heroImageUrl: cmsProject.heroImageUrl,
    heroImageAlt: cmsProject.heroImageAlt || title,
    facts: [
      { label: "Project Name", value: title },
      { label: "Project Location", value: cmsProject.location || "Forthcoming" },
      { label: "Project Type", value: discipline },
      { label: "Project Period", value: cmsProject.yearDisplay || "Forthcoming" },
    ],
    sections: [],
    gallery: (cmsProject.gallery ?? []).flatMap((image) =>
      image.imageUrl ? [{ imageUrl: image.imageUrl, imageAlt: image.imageAlt || title }] : [],
    ),
  };
  const cmsRelated = normalizeRelated(cmsProject.relatedProjects);
  return { project, related: cmsRelated.length ? cmsRelated : selectRelatedProjects(slug, portfolioProjects) };
}

export function generateStaticParams() {
  return Array.from(
    new Set([
      ...projectDetails.map(({ slug }) => slug),
      ...portfolioProjects.map(({ slug }) => slug),
    ]),
    (slug) => ({ slug }),
  );
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveProject(slug);
  return resolved ? { title: `${resolved.project.title} — RC Architecture`, description: resolved.project.summary } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [resolved, site] = await Promise.all([resolveProject(slug), getSiteData()]);
  if (!resolved) notFound();
  return <ProjectDetailPage project={resolved.project} related={resolved.related} site={site} />;
}
