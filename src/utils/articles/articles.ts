import type { APIArticle, Article } from '@/types';
import { API_BASE_URL, DEFAULT_ARTICLE_IMAGE } from '@/config';

// Fetch all articles from API
export async function getArticlesFromAPI(page: number = 0): Promise<Article[]> {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });
    const fullUrl = `${API_BASE_URL}/api/articles?${queryParams}`;

    const response = await fetch(fullUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch articles:', response.status, response.statusText);
      return [];
    }

    const data: APIArticle[] = await response.json();
    return adaptArticles(data);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fetch an article from API
export async function getArticleFromAPI(slug: string): Promise<Article[]> {
  // Define parameters as an object
  const queryParams = {
    slug: `/${slug}`,
  };

  // Create a URLSearchParams object
  const queryString = new URLSearchParams(queryParams).toString();

  // Combine the base URL and the query string
  const fullUrl = `${API_BASE_URL}/api/article-by-slug/?${queryString}`;

  try {
    const response = await fetch(fullUrl, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error('Failed to fetch articles:', response.status, response.statusText);
      return [];
    }

    const data: APIArticle[] = await response.json();
    return adaptArticles(data);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

function adaptArticles(apiArticles: APIArticle[]): Article[] {
  // Transform API response to match Article type
  return apiArticles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    content: article.content,
    category: article.category,
    author: article.author,
    publishedDate: article.publishedDate,
    imageUrl: article.imageUrl ? article.imageUrl : DEFAULT_ARTICLE_IMAGE,
    imageAlt: article.imageAlt,
    tags: article.tags.split(',').map((tag) => tag.trim()),
  }));
}
