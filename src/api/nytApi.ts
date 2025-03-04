import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Article, Preferences } from "../interfaces/interfaces";
import { normalizeNytArticle } from "./normalization";
const nytApiClient = axios.create({
  baseURL: "https://api.nytimes.com/svc/search/v2",
  params: {
    "api-key": import.meta.env.VITE_NYTimes_API_KEY,
  },
});

export const useNytArticles = (preferences: Preferences) => {
  return useQuery<{ articles: Article[]; authors: string[] }>({
    queryKey: ["nytArticles", preferences],
    queryFn: async () => {
      let params: any = {
        q: preferences.categories?.length
          ? preferences.categories.join(" OR ")
          : "news",
        sort: "newest",
        page: 0,
      };

      const response = await nytApiClient.get("/articlesearch.json", {
        params,
      });

      let nytArticles = response.data.response.docs.map(normalizeNytArticle);

      let nytAuthors: string[] = nytArticles
        .map((article: Article) => article.author)
        .filter(
          (author: any): author is string => !!author && author !== "Unknown"
        );

      return {
        articles: nytArticles,
        authors: Array.from(new Set(nytAuthors)),
      };
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
