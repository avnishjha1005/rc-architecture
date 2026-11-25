import { BlogCategoryToggle, type BlogListingArticle } from "@/components/blog/BlogCategoryToggle";
import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedProjectGrid, getFeaturedProjectSelection } from "@/components/projects/FeaturedProjectGrid";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { blogPosts } from "@/content/blog";
import type { PortfolioProject } from "@/content/projects";
import { resolveImage, type CmsResponsiveImage } from "@/lib/responsive-image";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { blogPageQuery } from "@/sanity/lib/queries";
import { getSingletonMetadata } from "@/sanity/lib/metadata";
import styles from "./blog.module.css";

export function generateMetadata() {
  return getSingletonMetadata("blogPage", {
    title: "Space Labs — RC Architecture",
    description: "Ideas, industry trends, and behind-the-scenes perspectives from RC Architecture.",
  });
}

export default async function BlogPage() {
  const sanityClient = await getSanityClient();
  type CmsPost = { title?: string; slug?: string; category?: string; topics?: string[]; blogCategory?: "spaceLabs" | "spaceMaking"; imageUrl?: string; imageAlt?: string };
  type CmsProject = { _id?: string; slug?: string; title?: string; featuredTitle?: string; type?: string; category?: string; location?: string; yearDisplay?: string; imageUrl?: string; imageAlt?: string; image?: CmsResponsiveImage };
  type BlogData = { page?: { heroTitle?: string; heroIntro?: string; primaryTabLabel?: string; secondaryTabLabel?: string; featuredPosts?: CmsPost[]; featuredProjects?: CmsProject[] }; allPosts?: CmsPost[]; defaultFeaturedProjects?: CmsProject[] } | null;
  const [data, site] = await Promise.all([
    isSanityConfigured ? sanityClient.fetch<BlogData>(blogPageQuery, {}, { next: { revalidate: 60 } }).catch(() => null) : null,
    getSiteData(),
  ]);
  const page = data?.page;
  const cmsPosts = [...(page?.featuredPosts || []), ...(data?.allPosts || [])];
  const seen = new Set<string>();
  const sourcePosts = cmsPosts.length ? cmsPosts.flatMap((post) => {
    if (!post?.slug || !post.title || !post.imageUrl || seen.has(post.slug)) return [];
    seen.add(post.slug);
    return [{ title: post.title, category: post.topics?.join(" · ") || post.category || "Architecture", blogCategory: post.blogCategory || "spaceLabs" as const, slug: post.slug, imageUrl: post.imageUrl, imageAlt: post.imageAlt || post.title }];
  }) : blogPosts;
  const articles: BlogListingArticle[] = sourcePosts.map((post) => ({
    title: post.title,
    category: post.category,
    blogCategory: post.blogCategory,
    href: `/blogs/${post.slug}`,
    imageUrl: post.imageUrl,
    imageAlt: post.imageAlt,
  }));
  const hasFeaturedSelection = Boolean(page?.featuredProjects?.length);
  const cmsProjects: PortfolioProject[] = ((hasFeaturedSelection ? page?.featuredProjects : data?.defaultFeaturedProjects) || []).flatMap((project) => {
    if (!project?.slug || !project.title || !project.imageUrl) return [];
    return [{
      id: project._id || project.slug,
      slug: project.slug,
      title: project.title,
      featuredTitle: project.featuredTitle,
      type: project.type === "Interior Design" ? "Interior Design" : "Architecture",
      category: project.category || project.type || "Architecture",
      location: project.location || "",
      year: project.yearDisplay || "",
      imageUrl: project.imageUrl,
      imageAlt: project.imageAlt || project.title,
      image: resolveImage(project.image, project.imageUrl, project.imageAlt || project.title),
      href: `/projects/${project.slug}`,
    }];
  });
  return <main className={styles.page}>
    <section className={styles.hero} data-motion-group="hero"><Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" /><h1 data-motion-item>{(page?.heroTitle || "In the\nSpotlight").split("\n").map((line, index) => <span key={`${index}-${line}`}>{index > 0 && <br />}{line}</span>)}</h1><p data-motion-item>{page?.heroIntro || "Working across design, research, technology and culture, Spacelab explores ideas through experimentation, collaboration and making, transforming questions into possibilities."}</p></section>
    <div className={styles.listingSurface}>
      <section className={styles.posts} data-motion-group="section"><div data-motion-item><BlogCategoryToggle articles={articles} primaryLabel={page?.primaryTabLabel || "Space Labs"} secondaryLabel={page?.secondaryTabLabel || "Space Making"} tabsClassName={styles.tabs} emptyClassName={styles.empty} viewAllClassName={styles.viewAll} /></div></section>
      <FeaturedProjectGrid projects={hasFeaturedSelection ? cmsProjects.slice(0, 4) : getFeaturedProjectSelection(cmsProjects)} />
    </div>
    <ContactSection content={site.contact} />
    <Footer content={siteFooter(site)} />
  </main>;
}
