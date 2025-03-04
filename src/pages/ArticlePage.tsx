import { useParams } from "react-router-dom";
import { useNews } from "@/context/NewsProvider";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { RelatedArticles } from "@/components/news/RelatedArticles";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { articles, loading } = useNews();

  const article = articles.find((a) => a.id === id);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">Loading article...</div>
    );
  }

  if (!article) {
    return (
      <div className="text-center text-red-500 py-10">Article not found</div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <div className="space-y-4 mb-8">
        <Badge>{article.category}</Badge>
        <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium">{article.source}</div>
            <span className="text-muted-foreground">•</span>
            <div className="text-muted-foreground">
              {formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <h4 className="font-semibold">Author</h4>
            <p>{article.author}</p>
          </div>
        </div>
      </div>

      {article.imageUrl && (
        <div className="relative w-full h-[400px] mb-8">
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="object-cover rounded-lg w-full h-full"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl font-medium mb-6">{article.description}</p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <RelatedArticles
          category={article.category}
          currentArticleId={article.id}
        />
      </div>
    </article>
  );
}
