import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { SpaceLabsGrid } from "@/components/home/SpaceLabsGrid";
import { NextProjects } from "@/components/projects/NextProjects";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { blogPosts } from "@/content/blog";
import { portfolioProjects } from "@/content/projects";
import { siteFooter } from "@/content/site";
import { getSiteData } from "@/sanity/lib/site";
import styles from "./blog.module.css";

export const metadata: Metadata = { title: "Space Labs — RC Architecture", description: "Ideas, industry trends, and behind-the-scenes perspectives from RC Architecture." };

export default async function BlogPage() {
  const site = await getSiteData();
  const articles = blogPosts.map((post) => ({
    title: post.title,
    category: post.category,
    href: `/blogs/${post.slug}`,
    imageUrl: post.imageUrl,
    imageAlt: post.imageAlt,
  }));
  return <main className={styles.page}>
    <section className={styles.hero}><Header brandName={site.brandName} navigation={site.navigation} cta={site.cta} theme="light" /><h1>In the<br />Spotlight.</h1><p>Dive into our latest thoughts on design, industry trends, and behind-the-scenes looks at our projects.</p></section>
    <section className={styles.posts}><div className={styles.tabs}><h2>Space Labs <sup>[12]</sup></h2><span>|</span><h2>Space Making <sup>[09]</sup></h2></div><SpaceLabsGrid articles={articles} /></section>
    <NextProjects projects={portfolioProjects.slice(2,6)} />
    <ContactSection content={site.contact} />
    <Footer content={siteFooter(site)} />
  </main>;
}
