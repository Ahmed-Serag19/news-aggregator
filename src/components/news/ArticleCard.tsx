import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/interfaces/interfaces";
interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/article/${article.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow pt-0">
        <div className="relative h-48 w-full">
          <img
            src={article.imageUrl || "/placeholder.svg?height=200&width=400"}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          {article.trending && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Trending
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{article.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <h3 className="font-bold text-lg line-clamp-2 mb-2 min-h-20">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 min-h-20">
            {article.description}
          </p>
        </CardContent>
        <CardFooter className="px-4 py-3 text-xs border-t flex justify-between">
          <span className="font-medium">{article.source}</span>
          <span className="text-muted-foreground">{article.author}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
