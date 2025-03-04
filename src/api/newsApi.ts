"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  normalizeGuardianArticle,
  normalizeNewsApiArticle,
  normalizeNytArticle,
} from "./normalization";
import type { Article, Preferences, Category } from "../interfaces/interfaces";
import type { SearchFilters } from "../interfaces/interfaces";
import { useMemo } from "react";

// Category mapping for different news sources
const CATEGORY_MAPPINGS: Record<string, Record<string, string>> = {
  // Standard categories in our app
  general: {
    newsapi: "general",
    guardian: "news",
    nyt: "news",
  },
  business: {
    newsapi: "business",
    guardian: "business",
    nyt: "business",
  },
  technology: {
    newsapi: "technology",
    guardian: "technology",
    nyt: "technology",
  },
  entertainment: {
    newsapi: "entertainment",
    guardian: "culture",
    nyt: "arts",
  },
  health: {
    newsapi: "health",
    guardian: "lifeandstyle",
    nyt: "health",
  },
  science: {
    newsapi: "science",
    guardian: "science",
    nyt: "science",
  },
  sports: {
    newsapi: "sports",
    guardian: "sport",
    nyt: "sports",
  },
};

const newsApiClient = axios.create({
  baseURL: "https://newsapi.org/v2",
  params: {
    apiKey: import.meta.env.VITE_NEWSAPI_KEY,
  },
});

const guardianApiClient = axios.create({
  baseURL: "https://content.guardianapis.com",
  params: {
    "api-key": import.meta.env.VITE_GUARDIAN_API_KEY,
    "show-fields": "headline,byline,thumbnail,body",
    "show-tags": "contributor",
  },
});

const nytApiClient = axios.create({
  baseURL: "https://api.nytimes.com/svc/search/v2",
  params: {
    "api-key": import.meta.env.VITE_NYTimes_API_KEY,
  },
});

// Helper function to get the appropriate category value for each news source
const getCategoryForSource = (
  category: string,
  source: "newsapi" | "guardian" | "nyt"
): string => {
  if (category === "all" || !category) return "";

  const mapping = CATEGORY_MAPPINGS[category];
  if (!mapping) return category; // If no mapping exists, use the original category

  return mapping[source] || category;
};

// ✅ Fetch NewsAPI Articles
export const useNewsApiArticles = (preferences: Preferences) => {
  return useQuery({
    queryKey: ["newsApiArticles", preferences],
    queryFn: async () => {
      const params: any = {
        q: "news",
        language: "en",
        sortBy: "publishedAt",
      };

      if (preferences.categories?.length) {
        params.q = preferences.categories.join(" OR ");
      }
      if (preferences.sources?.length) {
        params.sources = preferences.sources.join(",");
      }

      const response = await newsApiClient.get("/everything", { params });
      const newsApiArticles = response.data.articles.map(
        normalizeNewsApiArticle
      );

      const newsApiAuthors: string[] = Array.from(
        new Set(
          newsApiArticles
            .map((article: Article) => article.author)
            .filter((author: string) => author !== "Unknown")
        )
      );

      return { articles: newsApiArticles, authors: newsApiAuthors };
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useNewsArticles = (preferences: Preferences) => {
  const {
    data: newsApiData,
    isLoading: isNewsApiLoading,
    error: newsApiError,
  } = useNewsApiArticles(preferences);

  const articles = useMemo(() => {
    return [...(newsApiData?.articles || [])];
  }, [newsApiData]);

  const authors = useMemo(() => {
    return Array.from(new Set([...(newsApiData?.authors || [])]));
  }, [newsApiData]);

  const isLoading = isNewsApiLoading;

  const error = newsApiError;

  return {
    articles,
    authors,
    isLoading,
    error,
  };
};

export const useNewsSources = () => {
  return useQuery({
    queryKey: ["newsSources"],
    queryFn: async () => {
      const response = await newsApiClient.get("/sources");
      return response.data.sources.map((source: any) => ({
        id: source.id,
        name: source.name,
      }));
    },
    staleTime: 60 * 60 * 1000,
  });
};

export const useNewsCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["newsCategories"],
    queryFn: async (): Promise<Category[]> => {
      return [
        { id: "general", name: "General" },
        { id: "business", name: "Business" },
        { id: "technology", name: "Technology" },
        { id: "entertainment", name: "Entertainment" },
        { id: "health", name: "Health" },
        { id: "science", name: "Science" },
        { id: "sports", name: "Sports" },
      ];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useSearchArticles = (query: string, filters: SearchFilters) => {
  return useQuery({
    queryKey: ["searchArticles", query, filters],
    queryFn: async () => {
      console.log("Fetching search results with:", { query, filters });

      const requests = [];

      if (import.meta.env.VITE_NEWSAPI_KEY) {
        const newsApiParams: any = {
          q: query || "news",
          language: "en",
          sortBy: "publishedAt",
        };

        if (filters.source && filters.source !== "all") {
          newsApiParams.sources = filters.source;
        }

        // Apply the mapped category for NewsAPI
        if (filters.category && filters.category !== "all") {
          const newsApiCategory = getCategoryForSource(
            filters.category,
            "newsapi"
          );
          if (newsApiCategory) {
            newsApiParams.category = newsApiCategory;
          }
        }

        if (filters.dateFrom) {
          newsApiParams.from = filters.dateFrom.split("T")[0];
        }

        if (filters.dateTo) {
          newsApiParams.to = filters.dateTo.split("T")[0];
        }

        console.log("NewsAPI params:", newsApiParams);

        requests.push(
          newsApiClient
            .get("/everything", { params: newsApiParams })
            .then((response) => {
              console.log(
                `NewsAPI returned ${response.data.articles.length} articles`
              );
              return response.data.articles.map(normalizeNewsApiArticle);
            })
            .catch((error) => {
              console.error("NewsAPI error:", error);
              return [];
            })
        );
      }

      if (import.meta.env.VITE_GUARDIAN_API_KEY) {
        const guardianParams: any = {
          q: query || "news",
        };

        if (filters.dateFrom) {
          guardianParams["from-date"] = filters.dateFrom.split("T")[0];
        }

        if (filters.dateTo) {
          guardianParams["to-date"] = filters.dateTo.split("T")[0];
        }

        // Apply the mapped category for Guardian
        if (filters.category && filters.category !== "all") {
          const guardianCategory = getCategoryForSource(
            filters.category,
            "guardian"
          );
          if (guardianCategory) {
            guardianParams.section = guardianCategory;
          }
        }

        console.log("Guardian params:", guardianParams);

        requests.push(
          guardianApiClient
            .get("/search", { params: guardianParams })
            .then((response) => {
              console.log(
                `Guardian returned ${response.data.response.results.length} articles`
              );
              return response.data.response.results.map(
                normalizeGuardianArticle
              );
            })
            .catch((error) => {
              console.error("Guardian API error:", error);
              return [];
            })
        );
      }

      if (import.meta.env.VITE_NYTimes_API_KEY) {
        const nytParams: any = {
          q: query || "news",
          sort: "newest",
        };

        if (filters.dateFrom) {
          nytParams.begin_date = filters.dateFrom
            .split("T")[0]
            .replace(/-/g, "");
        }

        if (filters.dateTo) {
          nytParams.end_date = filters.dateTo.split("T")[0].replace(/-/g, "");
        }

        // Apply the mapped category for NYT
        if (filters.category && filters.category !== "all") {
          const nytCategory = getCategoryForSource(filters.category, "nyt");
          if (nytCategory) {
            nytParams.fq = `section_name:${nytCategory}`;
          }
        }

        console.log("NYT params:", nytParams);

        requests.push(
          nytApiClient
            .get("/articlesearch.json", { params: nytParams })
            .then((response) => {
              console.log(
                `NYT returned ${response.data.response.docs.length} articles`
              );
              return response.data.response.docs.map(normalizeNytArticle);
            })
            .catch((error) => {
              console.error("NYT API error:", error);
              return [];
            })
        );
      }

      // Execute all requests in parallel
      const results = await Promise.all(requests);

      // Log the number of articles from each source
      results.forEach((articles, index) => {
        const source =
          index === 0 ? "NewsAPI" : index === 1 ? "Guardian" : "NYT";
        console.log(`${source} returned ${articles.length} articles`);
      });

      const allArticles = results.flat();

      console.log(`Found ${allArticles.length} articles in total`);
      return allArticles;
    },
    enabled: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
