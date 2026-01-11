import type { Article } from '@/types';
import articles from '@/data/articles.json';

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getAllArticles(): Article[] {
  return articles;
}
