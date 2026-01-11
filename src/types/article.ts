export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  author: string;
  publishedDate: string;
  imageUrl?: string;
  imageAlt?: string;
  tags: string[];
}

export interface APIArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  author: string;
  publishedDate: string;
  imageUrl?: string;
  imageAlt?: string;
  tags: string;
}
