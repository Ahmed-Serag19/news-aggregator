"use client";

import type React from "react";
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import {
  useNewsArticles,
  useNewsSources,
  useNewsCategories,
} from "@/api/newsApi";
import type {
  Article,
  SearchFilters,
  Source,
  Category,
  Preferences,
} from "../interfaces/interfaces";

interface NewsContextProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  searchResults: Article[];
  setSearchResults: React.Dispatch<React.SetStateAction<Article[]>>;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  sources: Source[];
  categories: Category[];
  newsAuthors: string[];
  loading: boolean;
  preferences: Preferences;
  updatePreferences: (newPreferences: Preferences) => void;
  resetPreferences: () => void;
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Default Preferences (Load from localStorage)
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const savedPreferences = localStorage.getItem("newsPreferences");
    return savedPreferences
      ? JSON.parse(savedPreferences)
      : { sources: [], categories: [], authors: [] };
  });

  // ✅ Articles and Search Results State
  const [articlesState, setArticlesState] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);

  // ✅ Search Filters
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    source: "",
    category: "",
    author: "",
    dateFrom: "",
    dateTo: "",
  });

  // ✅ React Query Hooks for API Calls
  const { data: sources = [], isLoading: sourcesLoading } = useNewsSources();
  const { data: categories = [], isLoading: categoriesLoading } =
    useNewsCategories();

  // ✅ Fetch Articles and Authors
  const {
    articles = [],
    authors: newsAuthors = [],
    isLoading: articlesLoading,
  } = useNewsArticles(preferences);

  // ✅ Update articles state when articles from API change
  useEffect(() => {
    if (articles.length > 0) {
      setArticlesState(articles);
    }
  }, [articles]);

  // ✅ Update Preferences
  const updatePreferences = (newPreferences: Preferences) => {
    const updatedPreferences: Preferences = {
      sources: newPreferences.sources ?? [],
      categories: newPreferences.categories ?? [],
      authors: newPreferences.authors ?? [],
    };

    setPreferences(updatedPreferences);
    localStorage.setItem("newsPreferences", JSON.stringify(updatedPreferences));
  };

  // ✅ Reset Preferences
  const resetPreferences = () => {
    localStorage.removeItem("newsPreferences");
    setPreferences({ sources: [], categories: [], authors: [] });
    setFilters({
      query: "",
      source: "",
      category: "",
      author: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const loading = articlesLoading || sourcesLoading || categoriesLoading;

  return (
    <NewsContext.Provider
      value={{
        articles: articlesState,
        setArticles: setArticlesState,
        searchResults,
        setSearchResults,
        filters,
        setFilters,
        sources,
        categories,
        preferences,
        updatePreferences,
        resetPreferences,
        loading,
        newsAuthors,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
