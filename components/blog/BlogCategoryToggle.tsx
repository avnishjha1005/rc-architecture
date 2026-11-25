"use client";

import { useMemo, useState } from "react";
import type { ArticleItem } from "@/content/home";
import { SpaceLabsGrid } from "@/components/home/SpaceLabsGrid";
import { LoadMoreArrow } from "@/components/ui/LoadMoreArrow";

export type BlogListingArticle = ArticleItem & {
  blogCategory: "spaceLabs" | "spaceMaking";
};

type BlogCategoryToggleProps = {
  articles: BlogListingArticle[];
  primaryLabel: string;
  secondaryLabel: string;
  tabsClassName: string;
  emptyClassName: string;
  viewAllClassName: string;
};

export function BlogCategoryToggle({ articles, primaryLabel, secondaryLabel, tabsClassName, emptyClassName, viewAllClassName }: BlogCategoryToggleProps) {
  const [activeCategory, setActiveCategory] = useState<BlogListingArticle["blogCategory"]>("spaceLabs");
  const [batches, setBatches] = useState(1);
  const counts = useMemo(() => ({
    spaceLabs: articles.filter((article) => article.blogCategory === "spaceLabs").length,
    spaceMaking: articles.filter((article) => article.blogCategory === "spaceMaking").length,
  }), [articles]);
  const visibleArticles = articles.filter((article) => article.blogCategory === activeCategory);
  const desktopLimit = batches * 8;
  const mobileLimit = batches * 4;

  const tab = (category: BlogListingArticle["blogCategory"], label: string) => (
    <button
      aria-controls="blog-post-list"
      aria-selected={activeCategory === category}
      id={`blog-tab-${category}`}
      onClick={() => { setActiveCategory(category); setBatches(1); }}
      role="tab"
      type="button"
    >
      {label} <sup>({String(counts[category]).padStart(2, "0")})</sup>
    </button>
  );

  return <>
    <div className={tabsClassName} role="tablist" aria-label="Blog categories">
      {tab("spaceLabs", primaryLabel)}
      <span aria-hidden="true">|</span>
      {tab("spaceMaking", secondaryLabel)}
    </div>
    <div id="blog-post-list" role="tabpanel" aria-labelledby={`blog-tab-${activeCategory}`}>
      {visibleArticles.length
        ? <><SpaceLabsGrid key={activeCategory} articles={visibleArticles.slice(0, desktopLimit)} layout="mosaic" mobileVisibleCount={mobileLimit} />
          {visibleArticles.length > mobileLimit && <button className={viewAllClassName} data-desktop={visibleArticles.length > desktopLimit} type="button" onClick={() => setBatches((count) => count + 1)}>Load more <LoadMoreArrow /></button>}</>
        : <p className={emptyClassName}>No posts have been added to this category yet.</p>}
    </div>
  </>;
}
