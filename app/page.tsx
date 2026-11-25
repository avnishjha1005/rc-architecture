import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SpaceLabsSection } from "@/components/home/SpaceLabsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/site/Footer";
import { fallbackHomeContent, type HomeContent, type Stat } from "@/content/home";
import { featuredProjectSlugs as featuredSlugs } from "@/content/featured-projects.mjs";
import { siteFooter, type SiteData } from "@/content/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { reportSanityError } from "@/sanity/lib/errors";
import { homePageQuery } from "@/sanity/lib/queries";
import { getSiteData } from "@/sanity/lib/site";
import { getSingletonMetadata } from "@/sanity/lib/metadata";
import { resolveImage, type CmsResponsiveImage } from "@/lib/responsive-image";
import "./home-design.css";

export function generateMetadata() {
  return getSingletonMetadata("homePage", {
    title: "RC Architecture — Space Making",
    description: "A Bengaluru-based design studio crafting high-impact spaces with purpose.",
  });
}

type CmsHome = Partial<Omit<HomeContent, "brandName" | "heroImageUrl" | "heroImage" | "stats">> & {
  heroImageData?: CmsResponsiveImage;
  stats?: Array<Partial<Stat> | null>;
};
type CmsResponse = { home?: CmsHome | null; featured?: (HomeContent["projects"]["items"][number] & { slug: string })[] } | null;

function omitNullish<T extends object>(value: T | null | undefined): Partial<T> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined),
  ) as Partial<T>;
}

function resolveContent(data: CmsResponse, site: SiteData): HomeContent {
  const home = data?.home;
  const featured = featuredSlugs.flatMap((slug) => data?.featured?.find((project) => project.slug === slug) ?? []);
  const labsCta = { ...fallbackHomeContent.labs.cta, ...omitNullish(home?.labs?.cta) };
  if (labsCta.href === "/space-labs") labsCta.href = "/blog";
  const stats = home?.stats?.flatMap((stat) => (
    typeof stat?.value === "string" && stat.value.trim() && typeof stat.label === "string" && stat.label.trim()
      ? [{ value: stat.value, label: stat.label }]
      : []
  )) || [];
  return {
    ...fallbackHomeContent,
    ...omitNullish(home),
    brandName: site.brandName,
    heroImageUrl: home?.heroImageData?.src || fallbackHomeContent.heroImageUrl,
    heroImageAlt: home?.heroImageData?.alt || fallbackHomeContent.heroImageAlt,
    heroImage: resolveImage(home?.heroImageData, fallbackHomeContent.heroImageUrl, fallbackHomeContent.heroImageAlt),
    navigation: site.navigation,
    cta: site.cta,
    stats: stats.length ? stats : fallbackHomeContent.stats,
    about: { ...fallbackHomeContent.about, ...omitNullish(home?.about), cta: { ...fallbackHomeContent.about.cta, ...omitNullish(home?.about?.cta) }, ideologies: home?.about?.ideologies?.length ? home.about.ideologies : fallbackHomeContent.about.ideologies },
    services: { ...fallbackHomeContent.services, ...omitNullish(home?.services), cta: { ...fallbackHomeContent.services.cta, ...omitNullish(home?.services?.cta) }, items: home?.services?.items?.length ? home.services.items : fallbackHomeContent.services.items },
    projects: { ...fallbackHomeContent.projects, ...omitNullish(home?.projects), cta: { ...fallbackHomeContent.projects.cta, ...omitNullish(home?.projects?.cta) }, items: home?.projects?.items?.length ? home.projects.items : featured },
    labs: { ...fallbackHomeContent.labs, ...omitNullish(home?.labs), cta: labsCta, articles: home?.labs?.articles?.length ? home.labs.articles : fallbackHomeContent.labs.articles },
    contact: site.contact,
    newsletter: site.newsletter,
    footer: siteFooter(site),
  };
}

export default async function Home() {
  const sanityClient = await getSanityClient();
  const [data, site] = await Promise.all([
    isSanityConfigured
      ? sanityClient.fetch(homePageQuery, { featuredSlugs }, { next: { revalidate: 60 } }).catch((error) => {
        reportSanityError("Unable to load homepage content from Sanity", error);
        return null;
      })
      : null,
    getSiteData(),
  ]);
  const content = resolveContent(data as CmsResponse, site);
  return <main className="home-page"><Hero content={content} /><AboutSection content={content.about} /><ServicesSection content={content.services} /><ProjectsSection content={content.projects} /><SpaceLabsSection content={content.labs} /><ContactSection content={content.contact} /><NewsletterSection content={content.newsletter} /><Footer content={content.footer} sectionId="clients" /></main>;
}
