import Image from "next/image";
import Link from "next/link";
import type { ArticleItem } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";

export function SpaceLabsGrid({ articles }: { articles: ArticleItem[] }) {
  return (
    <div className="article-grid section-shell">
      {articles.map((article, index) => (
        <Reveal className="article-card" key={article.title} delay={(index % 4) * 60}>
          {article.href === "#"
            ? <div className="article-card__image"><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></div>
            : <Link className="article-card__image" href={article.href}><Image src={article.imageUrl} alt={article.imageAlt} fill sizes="(max-width: 760px) 100vw, 25vw" /></Link>}
          <p>({article.category})</p><h3>{article.href === "#" ? article.title : <Link href={article.href}>{article.title}</Link>}</h3>
        </Reveal>
      ))}
    </div>
  );
}

