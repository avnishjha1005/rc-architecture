import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { portfolioProjects, type PortfolioProject } from "@/content/projects";
import { siteFooter } from "@/content/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { projectsPageQuery } from "@/sanity/lib/queries";
import { getSiteData } from "@/sanity/lib/site";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "Projects — RC Architecture",
  description: "Explore RC Architecture's latest architecture and interior design projects.",
};

type CmsProject = {
  _id?: string;
  title?: string;
  featuredTitle?: string;
  slug?: string;
  type?: string;
  category?: string;
  location?: string;
  yearDisplay?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type CmsProjectsPage = {
  navigation?: { label: string; href: string }[];
  cta?: { label?: string; href?: string };
  featuredHeading?: string;
  featuredIntro?: string;
  featuredYearRange?: string;
  featuredProjects?: CmsProject[];
  archiveEyebrow?: string;
  archiveHeading?: string;
  archiveIntro?: string;
  archiveProjects?: CmsProject[];
  loadMoreLabel?: string;
};

type CmsResponse = {
  settings?: { title?: string } | null;
  page?: CmsProjectsPage | null;
  featuredFlagged?: CmsProject[];
  allProjects?: CmsProject[];
} | null;

function normalizeProjects(projects: CmsProject[] | undefined): PortfolioProject[] {
  return (projects ?? []).flatMap((project, index) => {
    if (!project.title || !project.slug || !project.imageUrl) return [];
    const type = project.type === "Interior Design" ? "Interior Design" : "Architecture";
    return [{
      id: project._id ?? project.slug ?? index,
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

export default async function ProjectsPage() {
  const sanityClient = await getSanityClient();
  const [data, site] = await Promise.all([
    isSanityConfigured
      ? sanityClient.fetch(projectsPageQuery, {}, { next: { revalidate: 60 } }).catch((error) => {
        console.error("Unable to load projects from Sanity", error);
        return null;
      }) as Promise<CmsResponse>
      : Promise.resolve(null),
    getSiteData(),
  ]);
  const page = data?.page;
  const selectedFeatured = normalizeProjects(page?.featuredProjects);
  const flaggedFeatured = normalizeProjects(data?.featuredFlagged);
  const sanityArchive = normalizeProjects(
    page?.archiveProjects?.length ? page.archiveProjects : data?.allProjects,
  );
  const featured = selectedFeatured.length
    ? selectedFeatured
    : flaggedFeatured.length
      ? flaggedFeatured
      : [portfolioProjects[0], portfolioProjects[1], portfolioProjects[2], portfolioProjects[4], portfolioProjects[3]];
  const projects = sanityArchive.length ? sanityArchive : portfolioProjects;
  const navigation = site.navigation;
  const cta = site.cta;
  const footer = siteFooter(site);

  return (
    <main className={styles.page}>
      <section className={styles.featured}>
        <Header brandName={site.brandName} navigation={navigation} cta={cta} theme="light" />
        <div className={styles.featuredIntro}>
          <h1>{page?.featuredHeading || "Featured\nWork"}</h1>
          <div><p>{page?.featuredIntro || "Explore our services and see how we bring creativity and expertise to every project."}</p><small>{page?.featuredYearRange || "1999–2023"}</small></div>
        </div>
        <div className={styles.featuredRail}>
          {featured.map((project, index) => (
            <ProjectCard project={project} variant="featured" eager={index === 0} key={project.id} />
          ))}
        </div>
      </section>

      <section className={styles.archive}>
        <div className={styles.archiveHeading}>
          <p>{page?.archiveEyebrow || "(All projects)"}</p>
          <h2>{page?.archiveHeading || "Our Latest\nProjects."}</h2>
          <span>{page?.archiveIntro || "Explore our services and see how we bring creativity and expertise to every project."}</span>
        </div>
        <ProjectsGallery projects={projects} loadMoreLabel={page?.loadMoreLabel || "Load more"} />
      </section>
      <div id="contact"><Footer content={footer} /></div>
    </main>
  );
}
