import Image from "next/image";
import Link from "next/link";
import type { ArticleItem } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";

type SpaceLabsGridProps = {
  articles: ArticleItem[];
  layout?: "grid" | "mosaic";
};

export function SpaceLabsGrid({ articles, layout = "grid" }: SpaceLabsGridProps) {
  const renderArticle = (article: ArticleItem, index: number, useRowPattern = false) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const isTall = useRowPattern ? (row + column) % 2 === 1 : index % 2 === 1;

    return <Reveal className={`article-card${isTall ? " article-card--tall" : ""}`} key={article.title} delay={(index % 4) * 60}>
      {article.href === "#"
        ? <div className="article-card__image"><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
        : <Link className="article-card__image" href={article.href}><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></Link>}
      <p>({article.category})</p><h3>{article.href === "#" ? article.title : <Link href={article.href}>{article.title}</Link>}</h3>
    </Reveal>;
  };

  if (layout === "mosaic") {
    return <>
      <div className="article-grid article-grid--mosaic-desktop section-shell">
        {[0, 1, 2, 3].map((column) => (
          <div className="article-grid__column" key={column}>
            {articles.map((article, index) => index % 4 === column ? renderArticle(article, index, true) : null)}
          </div>
        ))}
      </div>
      <div className="article-grid article-grid--mosaic-mobile section-shell">
        {articles.map((article, index) => renderArticle(article, index))}
      </div>
    </>;
  }

  return (
    <div className="article-grid section-shell">
      {articles.map((article, index) => renderArticle(article, index))}
    </div>
  );
}
