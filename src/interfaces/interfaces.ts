export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  author: string;
  source: string;
  category: string;
  imageUrl: string;
  trending: boolean;
}

export interface SearchFilters {
  author?: string;
  source: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  query: string;
}

export interface Preferences {
  sources: string[];
  categories: string[];
  authors?: string[];
}

export interface Source {
  id: string;
  name: string;
  authors: string[];
}

export interface Category {
  id: string;
  name: string;
}
