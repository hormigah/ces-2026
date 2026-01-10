export interface Article {
  id: number;
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
