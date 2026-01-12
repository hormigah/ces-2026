import { MetadataRoute } from 'next';
import { getArticlesFromAPI } from '@/utils';
import { SITE_URL } from '@/config/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all articles from API iterating through all pages
  const allArticles = [];
  let page = 0;
  let hasMorePages = true;

  while (hasMorePages) {
    const articles = await getArticlesFromAPI(page);

    if (articles.length === 0) {
      hasMorePages = false;
    } else {
      allArticles.push(...articles);
      page++;
    }
  }

  // Generate article URLs
  const articleUrls = allArticles.map((article) => {
    // Remove leading slash from slug if present
    const slug = article.slug.startsWith('/') ? article.slug.slice(1) : article.slug;

    return {
      url: `${SITE_URL}/${slug}`,
      lastModified: new Date(article.publishedDate),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  return [...staticPages, ...articleUrls];
}
