import { useEffect, useState } from "react";
import { useNews } from "@/context/NewsProvider";
import { ArticleCard } from "@/components/news/ArticleCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Article } from "@/interfaces/interfaces";

interface RelatedArticlesProps {
  category: string;
  currentArticleId: string;
}

export function RelatedArticles({
  category,
  currentArticleId,
}: RelatedArticlesProps) {
  const { articles, loading } = useNews();
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!loading) {
      const filteredArticles = articles
        .filter(
          (article: Article) =>
            article.category === category && article.id !== currentArticleId
        )
        .slice(0, 3);

      setRelatedArticles(filteredArticles);
    }
  }, [articles, category, currentArticleId, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (relatedArticles.length === 0) {
    return <p className="text-muted-foreground">No related articles found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
