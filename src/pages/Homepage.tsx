import { useState } from "react";
import { ArticleGrid } from "@/components/news/ArticleGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNews } from "@/context/NewsProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useNewsArticles } from "@/api/newsApi";

export default function Homepage() {
  const { preferences } = useNews();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { articles, isLoading } = useNewsArticles(preferences);

  const totalPages = Math.ceil(articles.length / pageSize);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Your News Feed</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news from your preferred sources
        </p>
      </section>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Tabs defaultValue="for-you">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="for-you">For You</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            <TabsContent value="for-you" className="mt-6">
              <ArticleGrid articles={paginatedArticles} />
            </TabsContent>
            <TabsContent value="trending" className="mt-6">
              <ArticleGrid
                articles={paginatedArticles.filter((a) => a.trending)}
              />
            </TabsContent>
            <TabsContent value="latest" className="mt-6">
              <ArticleGrid
                articles={[...paginatedArticles].sort(
                  (a, b) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
                )}
              />
            </TabsContent>
          </Tabs>

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
