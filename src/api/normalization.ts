import { v4 as uuidv4 } from "uuid";
import { Article } from "../interfaces/interfaces";
import { getGuardianAuthor } from "./utils";

export const normalizeNewsApiArticle = (article: any): Article => ({
  id: uuidv4(),
  title: article.title,
  description: article.description || "",
  content: article.content || "",
  publishedAt: article.publishedAt,
  author:
    article.author && article.author.trim() !== "" ? article.author : "Unknown",
  source: article.source?.name || "Unknown Source",
  category: "General",
  imageUrl: article.urlToImage || "/placeholder.svg",
  trending: false,
});

export const normalizeGuardianArticle = (article: any): Article => ({
  id: uuidv4(),
  title: article.fields.headline || "No Title",
  description: "",
  content: article.fields.body || "",
  publishedAt: article.webPublicationDate || "",
  author: getGuardianAuthor(article),
  source: "The Guardian",
  category: "General",
  imageUrl: article.fields.thumbnail || "/placeholder.svg",
  trending: false,
});

export const normalizeNytArticle = (article: any): Article => ({
  id: uuidv4(),
  title: article.headline?.main || "No Title",
  description: article.snippet || "",
  content: article.snippet || "",
  publishedAt: article.pub_date || "",
  author: article.byline?.original || "Unknown",
  source: "New York Times",
  category: article.section_name || "General",
  imageUrl:
    article.multimedia?.length > 0
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : "/placeholder.svg",
  trending: false,
});
