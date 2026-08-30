import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { SpaceLabsGrid } from "@/components/home/SpaceLabsGrid";
import { NextProjects } from "@/components/projects/NextProjects";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { blogPosts } from "@/content/blog";
import { portfolioProjects, type PortfolioProject } from "@/content/projects";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { blogPageQuery } from "@/sanity/lib/queries";
import styles from "./blog.module.css";

export const metadata: Metadata = { title: "Space Labs — RC Architecture", description: "Ideas, industry trends, and behind-the-scenes perspectives from RC Architecture." };

export default async function BlogPage() {
  const sanityClient = await getSanityClient();
  type CmsPost = { title?: string; slug?: string; category?: string; imageUrl?: string; imageAlt?: string };
  type CmsProject = { _id?: string; slug?: string; title?: string; featuredTitle?: string; type?: string; category?: string; location?: string; yearDisplay?: string; imageUrl?: string; imageAlt?: string };
  type BlogData = { page?: { heroTitle?: string; heroIntro?: string; primaryTabLabel?: string; secondaryTabLabel?: string; featuredPosts?: CmsPost[]; featuredProjects?: CmsProject[] }; allPosts?: CmsPost[] } | null;
  const [data, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<BlogData>(blogPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const page = data?.page;
  const cmsPosts = page?.featuredPosts?.length ? page.featuredPosts : data?.allPosts;
  const sourcePosts = cmsPosts?.length ? cmsPosts.flatMap((post) => post.title && post.slug && post.imageUrl ? [{ title: post.title, category: post.category || "Space Labs", slug: post.slug, imageUrl: post.imageUrl, imageAlt: post.imageAlt || post.title }] : []) : blogPosts;
  const articles = sourcePosts.map((post) => ({
    title: post.title,
    category: post.category,
    href: `/blogs/${post.slug}`,
    imageUrl: post.imageUrl,
    imageAlt: post.imageAlt,
  }));
  const cmsProjects: PortfolioProject[] = (page?.featuredProjects || []).flatMap((project, index) => project.title && project.slug && project.imageUrl ? [{ id: project._id || project.slug || index, slug: project.slug, title: project.title, featuredTitle: project.featuredTitle, type: project.type === "Interior Design" ? "Interior Design" as const : "Architecture" as const, category: project.category || project.type || "Architecture", location: project.location || "Location forthcoming", year: project.yearDisplay || "Year forthcoming", imageUrl: project.imageUrl, imageAlt: project.imageAlt || project.title, href: `/projects/${project.slug}` }] : []);
  return <main className={styles.page}>
    <section className={styles.hero}><Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" /><h1>{(page?.heroTitle || "In the\nSpotlight.").split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1><p>{page?.heroIntro || "Dive into our latest thoughts on design, industry trends, and behind-the-scenes looks at our projects."}</p></section>
    <section className={styles.posts}><div className={styles.tabs}><h2>{page?.primaryTabLabel || "Space Labs"} <sup>[{String(articles.length).padStart(2, "0")}]</sup></h2><span>|</span><h2>{page?.secondaryTabLabel || "Space Making"} <sup>[09]</sup></h2></div><SpaceLabsGrid articles={articles} layout="mosaic" /></section>
    <NextProjects projects={cmsProjects.length ? cmsProjects : portfolioProjects.slice(2,6)} />
    <ContactSection content={site.contact} />
    <Footer content={siteFooter(site)} />
  </main>;
}
