import type { SanityImageSource } from "@sanity/image-url";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SpaceLabsSection } from "@/components/home/SpaceLabsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/site/Footer";
import { fallbackHomeContent, type HomeContent } from "@/content/home";
import { siteFooter, type SiteData } from "@/content/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { homePageQuery } from "@/sanity/lib/queries";
import { getSiteData } from "@/sanity/lib/site";

type CmsHome = Partial<Omit<HomeContent, "brandName" | "heroImageUrl">> & { heroImage?: SanityImageSource };
type CmsResponse = { home?: CmsHome | null } | null;

function omitNullish<T extends object>(value: T | null | undefined): Partial<T> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined),
  ) as Partial<T>;
}

function resolveContent(data: CmsResponse, site: SiteData): HomeContent {
  const home = data?.home;
  return {
    ...fallbackHomeContent,
    ...omitNullish(home),
    brandName: site.brandName,
    heroImageUrl: home?.heroImage ? urlFor(home.heroImage).width(2400).height(1500).quality(88).url() : fallbackHomeContent.heroImageUrl,
    heroImageAlt: home?.heroImageAlt || fallbackHomeContent.heroImageAlt,
    navigation: site.navigation,
    cta: site.cta,
    stats: home?.stats?.length ? home.stats : fallbackHomeContent.stats,
    about: { ...fallbackHomeContent.about, ...omitNullish(home?.about), cta: { ...fallbackHomeContent.about.cta, ...omitNullish(home?.about?.cta) }, ideologies: home?.about?.ideologies?.length ? home.about.ideologies : fallbackHomeContent.about.ideologies },
    services: { ...fallbackHomeContent.services, ...omitNullish(home?.services), cta: { ...fallbackHomeContent.services.cta, ...omitNullish(home?.services?.cta) }, items: home?.services?.items?.length ? home.services.items : fallbackHomeContent.services.items },
    projects: { ...fallbackHomeContent.projects, ...omitNullish(home?.projects), cta: { ...fallbackHomeContent.projects.cta, ...omitNullish(home?.projects?.cta) }, items: home?.projects?.items?.length ? home.projects.items : fallbackHomeContent.projects.items },
    labs: { ...fallbackHomeContent.labs, ...omitNullish(home?.labs), cta: { ...fallbackHomeContent.labs.cta, ...omitNullish(home?.labs?.cta) }, articles: home?.labs?.articles?.length ? home.labs.articles : fallbackHomeContent.labs.articles },
    contact: site.contact,
    newsletter: site.newsletter,
    footer: siteFooter(site),
  };
}

export default async function Home() {
  const sanityClient = await getSanityClient();
  const [data, site] = await Promise.all([
    isSanityConfigured
      ? sanityClient.fetch(homePageQuery, {}, { next: { revalidate: 60 } }).catch((error) => {
        console.error("Unable to load homepage content from Sanity", error);
        return null;
      })
      : null,
    getSiteData(),
  ]);
  const content = resolveContent(data as CmsResponse, site);
  return <main className="home-page"><Hero content={content} /><AboutSection content={content.about} /><ServicesSection content={content.services} /><ProjectsSection content={content.projects} /><SpaceLabsSection content={content.labs} /><ContactSection content={content.contact} /><NewsletterSection content={content.newsletter} /><Footer content={content.footer} sectionId="clients" /></main>;
}
