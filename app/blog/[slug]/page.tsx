import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LatestPostsCarousel } from "@/components/blog/LatestPostsCarousel";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { blogPosts, getBlogPost } from "@/content/blog";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import styles from "./blog-detail.module.css";

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

type BlogPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  return post ? { title: `${post.title} — RC Architecture`, description: post.excerpt } : {};
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const site = await getSiteData();
  const latest = blogPosts.filter((item) => item.slug !== post.slug);
  return <main className={styles.page}>
    <Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" />
    <article>
      <header className={styles.articleHeader}><p>Space Labs&nbsp; / &nbsp;Home Decor&nbsp; / &nbsp;<span>{post.category}</span></p><h1>{post.title}</h1><time>{post.date}</time><div className={styles.heroImage}><Image src={post.imageUrl} alt={post.imageAlt} fill priority sizes="100vw" /></div></header>
      <div className={styles.articleBody}>{post.sections.map((section,index)=><section key={`${section.title}-${index}`}><h2>{section.title}</h2>{section.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map((bullet)=><li key={bullet}>{bullet}</li>)}</ul>}{section.imageUrl&&<div className={styles.bodyImage}><Image src={section.imageUrl} alt={section.imageAlt || ""} fill sizes="(max-width: 760px) 100vw, 65vw" /></div>}{section.quote&&<blockquote>“{section.quote}”</blockquote>}</section>)}</div>
    </article>
    <LatestPostsCarousel posts={latest} />
    <ContactSection content={site.contact} />
    <Footer content={siteFooter(site)} />
  </main>;
}
