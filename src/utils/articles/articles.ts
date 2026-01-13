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

// Decode HTML entities
export function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  return text.replaceAll(/&[#\w]+;/g, (entity) => {
    // First check our known entities
    if (entities[entity]) {
      return entities[entity];
    }

    // Handle numeric entities like &#039; or &#x27;
    if (entity.startsWith('&#x')) {
      const code = Number.parseInt(entity.slice(3, -1), 16);
      return String.fromCodePoint(code);
    } else if (entity.startsWith('&#')) {
      const code = Number.parseInt(entity.slice(2, -1), 10);
      return String.fromCodePoint(code);
    }

    return entity;
  });
}

function adaptArticles(apiArticles: APIArticle[]): Article[] {
  // Transform API response to match Article type
  return apiArticles.map(({ title, imageUrl, tags, ...rest }) => ({
    ...rest,
    title: decodeHTMLEntities(title),
    imageUrl: imageUrl ?? DEFAULT_ARTICLE_IMAGE,
    tags: tags.split(',').map((tag) => tag.trim()),
  }));
}
