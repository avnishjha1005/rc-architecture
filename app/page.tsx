import type { SanityImageSource } from "@sanity/image-url";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SpaceLabsSection } from "@/components/home/SpaceLabsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/home/Footer";
import { fallbackHomeContent, type HomeContent } from "@/content/home";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { homePageQuery } from "@/sanity/lib/queries";

type CmsHome = Partial<Omit<HomeContent, "brandName" | "heroImageUrl">> & { heroImage?: SanityImageSource };
type CmsResponse = { settings?: { title?: string } | null; home?: CmsHome | null } | null;

function omitNullish<T extends object>(value: T | null | undefined): Partial<T> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== null && fieldValue !== undefined),
  ) as Partial<T>;
}

function resolveContent(data: CmsResponse): HomeContent {
  const home = data?.home;
  return {
    ...fallbackHomeContent,
    ...omitNullish(home),
    brandName: data?.settings?.title || fallbackHomeContent.brandName,
    heroImageUrl: home?.heroImage ? urlFor(home.heroImage).width(2400).height(1500).quality(88).url() : fallbackHomeContent.heroImageUrl,
    heroImageAlt: home?.heroImageAlt || fallbackHomeContent.heroImageAlt,
    navigation: home?.navigation?.length ? home.navigation : fallbackHomeContent.navigation,
    cta: home?.cta?.label && home.cta.href ? home.cta : fallbackHomeContent.cta,
    stats: home?.stats?.length ? home.stats : fallbackHomeContent.stats,
    about: { ...fallbackHomeContent.about, ...omitNullish(home?.about), cta: { ...fallbackHomeContent.about.cta, ...omitNullish(home?.about?.cta) }, ideologies: home?.about?.ideologies?.length ? home.about.ideologies : fallbackHomeContent.about.ideologies },
    services: { ...fallbackHomeContent.services, ...omitNullish(home?.services), cta: { ...fallbackHomeContent.services.cta, ...omitNullish(home?.services?.cta) }, items: home?.services?.items?.length ? home.services.items : fallbackHomeContent.services.items },
    projects: { ...fallbackHomeContent.projects, ...omitNullish(home?.projects), cta: { ...fallbackHomeContent.projects.cta, ...omitNullish(home?.projects?.cta) }, items: home?.projects?.items?.length ? home.projects.items : fallbackHomeContent.projects.items },
    labs: { ...fallbackHomeContent.labs, ...omitNullish(home?.labs), cta: { ...fallbackHomeContent.labs.cta, ...omitNullish(home?.labs?.cta) }, articles: home?.labs?.articles?.length ? home.labs.articles : fallbackHomeContent.labs.articles },
    contact: { ...fallbackHomeContent.contact, ...omitNullish(home?.contact), cta: { ...fallbackHomeContent.contact.cta, ...omitNullish(home?.contact?.cta) } },
    newsletter: { ...fallbackHomeContent.newsletter, ...omitNullish(home?.newsletter) },
    footer: { ...fallbackHomeContent.footer, ...omitNullish(home?.footer), navigation: home?.footer?.navigation?.length ? home.footer.navigation : fallbackHomeContent.footer.navigation },
  };
}

export default async function Home() {
  const data = isSanityConfigured ? await client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }) : null;
  const content = resolveContent(data as CmsResponse);
  return <main><Hero content={content} /><AboutSection content={content.about} /><ServicesSection content={content.services} /><ProjectsSection content={content.projects} /><SpaceLabsSection content={content.labs} /><ContactSection content={content.contact} /><NewsletterSection content={content.newsletter} /><Footer content={content.footer} /></main>;
}
