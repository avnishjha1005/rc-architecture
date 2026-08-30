import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LatestPostsCarousel } from "@/components/blog/LatestPostsCarousel";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { blogPosts, getBlogPost, type BlogPost } from "@/content/blog";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/lib/client";
import { blogPostBySlugQuery } from "@/sanity/lib/queries";
import styles from "./blog-detail.module.css";

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

type BlogPageProps = { params: Promise<{ slug: string }> };

type CmsPost = { title?: string; slug?: string; category?: string; blogCategory?: "spaceLabs" | "spaceMaking"; publishedAt?: string; excerpt?: string; imageUrl?: string; imageAlt?: string; sections?: { title?: string; body?: string[]; bullets?: string[]; imageUrl?: string; imageAlt?: string; quote?: string }[]; relatedPosts?: CmsPost[] };

function normalizePost(post: CmsPost): BlogPost | undefined {
  if (!post.title || !post.slug || !post.imageUrl) return undefined;
  return {
    slug: post.slug, title: post.title, category: post.category || "Architecture", blogCategory: post.blogCategory || "spaceLabs",
    date: post.publishedAt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.publishedAt)) : "",
    imageUrl: post.imageUrl, imageAlt: post.imageAlt || post.title,
    excerpt: post.excerpt || "Ideas, observations, and practical lessons from our architecture and design studio.",
    sections: (post.sections || []).flatMap((section) => section.title ? [{ title: section.title, body: section.body || [], bullets: section.bullets, imageUrl: section.imageUrl, imageAlt: section.imageAlt, quote: section.quote }] : []),
  };
}

async function resolvePost(slug: string): Promise<{ post: BlogPost; related: BlogPost[] } | undefined> {
  const sanityClient = await getSanityClient();
  const cms = isSanityConfigured ? await sanityClient.fetch<CmsPost | null>(blogPostBySlugQuery, { slug }, { next: { revalidate: 60 } }).catch(() => null) : null;
  const post = cms ? normalizePost(cms) : undefined;
  if (post) {
    const related = (cms?.relatedPosts || []).flatMap((item) => { const normalized = normalizePost(item); return normalized ? [normalized] : []; });
    return { post, related };
  }
  const fallback = getBlogPost(slug);
  return fallback ? { post: fallback, related: blogPosts.filter((item) => item.slug !== slug) } : undefined;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const resolved = await resolvePost((await params).slug);
  return resolved ? { title: `${resolved.post.title} — RC Architecture`, description: resolved.post.excerpt } : {};
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const [resolved, site] = await Promise.all([resolvePost((await params).slug), getSiteData()]);
  if (!resolved) notFound();
  const { post } = resolved;
  const latest = resolved.related.length ? resolved.related : blogPosts.filter((item) => item.slug !== post.slug);
  return <main className={styles.page}>
    <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" />
    <article>
      <header className={styles.articleHeader}><p>{post.blogCategory === "spaceMaking" ? "Space Making" : "Space Labs"}&nbsp; / &nbsp;<span>{post.category}</span></p><h1>{post.title}</h1><time>{post.date}</time><div className={styles.heroImage}><Image src={post.imageUrl} alt={post.imageAlt} fill priority sizes="100vw" /></div></header>
      <div className={styles.articleBody}>{post.sections.map((section,index)=><section key={`${section.title}-${index}`}><h2>{section.title}</h2>{section.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map((bullet)=><li key={bullet}>{bullet}</li>)}</ul>}{section.imageUrl&&<div className={styles.bodyImage}><Image src={section.imageUrl} alt={section.imageAlt || ""} fill sizes="(max-width: 760px) 100vw, 65vw" /></div>}{section.quote&&<blockquote>“{section.quote}”</blockquote>}</section>)}</div>
    </article>
    <LatestPostsCarousel posts={latest} />
    <ContactSection content={site.contact} />
    <Footer content={siteFooter(site)} />
  </main>;
}
