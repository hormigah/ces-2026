import sitemap from './sitemap';
import type { Article } from '@/types';
import * as utils from '@/utils';
import { SITE_URL } from '@/config/constants';

// Mock utility functions
jest.mock('@/utils', () => ({
  getArticlesFromAPI: jest.fn(),
}));

describe('sitemap.ts', () => {
  const mockArticle1: Article = {
    id: '1',
    slug: '/article-1',
    title: 'Article 1',
    description: 'Description 1',
    category: 'Technology',
    author: 'John Doe',
    publishedDate: '2026-01-10T12:00:00',
    imageUrl: '/images/article-1.jpg',
    imageAlt: 'Article 1 image',
    tags: ['test'],
    content: '<p>Content 1</p>',
  };

  const mockArticle2: Article = {
    id: '2',
    slug: 'article-2',
    title: 'Article 2',
    description: 'Description 2',
    category: 'Science',
    author: 'Jane Smith',
    publishedDate: '2026-01-11T12:00:00',
    imageUrl: '/images/article-2.jpg',
    imageAlt: 'Article 2 image',
    tags: ['test'],
    content: '<p>Content 2</p>',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic function behavior', () => {
    it('should return a promise', () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = sitemap();

      expect(result).toBeInstanceOf(Promise);
    });

    it('should return an array', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should call getArticlesFromAPI', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      await sitemap();

      expect(utils.getArticlesFromAPI).toHaveBeenCalled();
    });
  });

  describe('Static pages', () => {
    it('should include home page in sitemap', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();

      expect(result.some((item) => item.url === SITE_URL)).toBe(true);
    });

    it('should set home page priority to 1', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();
      const homePage = result.find((item) => item.url === SITE_URL);

      expect(homePage?.priority).toBe(1);
    });

    it('should set home page change frequency to daily', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();
      const homePage = result.find((item) => item.url === SITE_URL);

      expect(homePage?.changeFrequency).toBe('daily');
    });

    it('should set home page lastModified to Date', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();
      const homePage = result.find((item) => item.url === SITE_URL);

      expect(homePage?.lastModified).toBeInstanceOf(Date);
    });

    it('should include static pages as first items', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();

      expect(result[0].url).toBe(SITE_URL);
    });
  });

  describe('Article URLs', () => {
    it('should include articles in sitemap', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result.length).toBe(2); // 1 static + 1 article
    });

    it('should generate correct URL for articles with leading slash', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result.some((item) => item.url === `${SITE_URL}/article-1`)).toBe(true);
    });

    it('should generate correct URL for articles without leading slash', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle2])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result.some((item) => item.url === `${SITE_URL}/article-2`)).toBe(true);
    });

    it('should set article priority to 0.8', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();
      const article = result.find((item) => item.url.includes('article-1'));

      expect(article?.priority).toBe(0.8);
    });

    it('should set article change frequency to weekly', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();
      const article = result.find((item) => item.url.includes('article-1'));

      expect(article?.changeFrequency).toBe('weekly');
    });

    it('should use article publishedDate as lastModified', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();
      const article = result.find((item) => item.url.includes('article-1'));

      expect(article?.lastModified).toEqual(new Date(mockArticle1.publishedDate));
    });

    it('should handle multiple articles', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1, mockArticle2])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result.length).toBe(3); // 1 static + 2 articles
    });
  });

  describe('Pagination handling', () => {
    it('should fetch multiple pages', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([mockArticle2])
        .mockResolvedValueOnce([]);

      await sitemap();

      expect(utils.getArticlesFromAPI).toHaveBeenCalledTimes(3);
    });

    it('should call with correct page numbers', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([mockArticle2])
        .mockResolvedValueOnce([]);

      await sitemap();

      expect(utils.getArticlesFromAPI).toHaveBeenNthCalledWith(1, 0);
      expect(utils.getArticlesFromAPI).toHaveBeenNthCalledWith(2, 1);
      expect(utils.getArticlesFromAPI).toHaveBeenNthCalledWith(3, 2);
    });

    it('should combine articles from multiple pages', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([mockArticle2])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result.length).toBe(3); // 1 static + 2 articles
    });

    it('should stop when receiving empty array', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValueOnce([]);

      await sitemap();

      expect(utils.getArticlesFromAPI).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty state handling', () => {
    it('should handle no articles gracefully', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();

      expect(result.length).toBe(1); // Only static page
    });

    it('should still include static pages when no articles', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();

      expect(result[0].url).toBe(SITE_URL);
    });
  });

  describe('URL structure', () => {
    it('should generate valid URLs', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      result.forEach((item) => {
        expect(item.url).toMatch(/^https?:\/\/.+/);
      });
    });

    it('should use SITE_URL constant', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      result.forEach((item) => {
        expect(item.url).toContain(SITE_URL);
      });
    });

    it('should not have double slashes in URLs', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1, mockArticle2])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      result.forEach((item) => {
        const withoutProtocol = item.url.replace(/^https?:\/\//, '');
        expect(withoutProtocol).not.toContain('//');
      });
    });
  });

  describe('Metadata structure', () => {
    it('should include all required fields', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      result.forEach((item) => {
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('lastModified');
        expect(item).toHaveProperty('changeFrequency');
        expect(item).toHaveProperty('priority');
      });
    });

    it('should have valid lastModified dates', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      result.forEach((item) => {
        expect(item.lastModified).toBeInstanceOf(Date);
      });
    });

    it('should have valid priority values', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      result.forEach((item) => {
        expect(item.priority).toBeGreaterThanOrEqual(0);
        expect(item.priority).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Return value structure', () => {
    it('should return static pages first', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result[0].priority).toBe(1);
      expect(result[0].changeFrequency).toBe('daily');
    });

    it('should return articles after static pages', async () => {
      (utils.getArticlesFromAPI as jest.Mock)
        .mockResolvedValueOnce([mockArticle1])
        .mockResolvedValueOnce([]);

      const result = await sitemap();

      expect(result[1].priority).toBe(0.8);
      expect(result[1].changeFrequency).toBe('weekly');
    });

    it('should not return empty array', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const result = await sitemap();

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
