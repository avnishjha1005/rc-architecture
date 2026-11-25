import Image from "@/components/ui/SiteImage";
import Link from "next/link";
import type { ArticleItem } from "@/content/home";

export function SpaceLabCard({ article, index, tall = index % 2 === 1, mobileHidden = false }: {
  article: ArticleItem;
  index: number;
  tall?: boolean;
  mobileHidden?: boolean;
}) {
  return <article data-card className={`article-card${tall ? " article-card--tall" : ""}${mobileHidden ? " article-card--mobile-hidden" : ""}`}>
    {article.href === "#"
      ? <div className="article-card__image"><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
      : <Link className="article-card__image" href={article.href}><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></Link>}
    <p>({article.category})</p><h3>{article.href === "#" ? article.title : <Link href={article.href}>{article.title}</Link>}</h3>
  </article>;
}

type SpaceLabsGridProps = {
  articles: ArticleItem[];
  layout?: "grid" | "mosaic";
  mobileVisibleCount?: number;
};

export function SpaceLabsGrid({ articles, layout = "grid", mobileVisibleCount }: SpaceLabsGridProps) {
  const renderArticle = (article: ArticleItem, index: number, useRowPattern = false) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const isTall = useRowPattern ? (row + column) % 2 === 1 : index % 2 === 1;

    return <SpaceLabCard key={article.title} article={article} index={index} tall={isTall} mobileHidden={mobileVisibleCount !== undefined && index >= mobileVisibleCount} />;
  };

  if (layout === "mosaic") {
    return <>
      <div data-card-group className="article-grid article-grid--mosaic-desktop section-shell">
        {[0, 1, 2, 3].map((column) => (
          <div className="article-grid__column" key={column}>
            {articles.map((article, index) => index % 4 === column ? renderArticle(article, index, true) : null)}
          </div>
        ))}
      </div>
      <div data-card-group className="article-grid article-grid--mosaic-mobile section-shell">
        {articles.map((article, index) => renderArticle(article, index))}
      </div>
    </>;
  }

  return (
    <div data-card-group className="article-grid section-shell">
      {articles.map((article, index) => renderArticle(article, index))}
    </div>
  );
}
