import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { normalizeGuardianArticle } from "./normalization";
import { Category } from "@/interfaces/interfaces";

const guardianApiClient = axios.create({
  baseURL: "https://content.guardianapis.com",
  params: {
    "api-key": import.meta.env.VITE_GUARDIAN_API_KEY,
    "show-fields": "headline,byline,thumbnail,body",
    "show-tags": "contributor",
  },
});

export const useGuardianArticles = (searchQuery: string = "news") => {
  return useQuery({
    queryKey: ["guardianArticles", searchQuery],
    queryFn: async () => {
      const response = await guardianApiClient.get("/search", {
        params: { q: searchQuery },
      });

      return response.data.response.results.map(normalizeGuardianArticle);
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGuardianCategories = () => {
  return useQuery({
    queryKey: ["guardianCategories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await guardianApiClient.get("/sections");
      return response.data.response.results.map((section: any) => ({
        id: section.id,
        name: section.webTitle,
      }));
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGuardianAuthors = () => {
  return useQuery({
    queryKey: ["guardianAuthors"],
    queryFn: async (): Promise<string[]> => {
      const response = await guardianApiClient.get("/tags", {
        params: { type: "contributor", pageSize: 50 },
      });

      return response.data.response.results.map(
        (author: any) =>
          `${author.firstName} ${author.lastName}`.trim() || author.webTitle
      );
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
