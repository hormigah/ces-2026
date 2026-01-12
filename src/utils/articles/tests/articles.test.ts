import { getArticlesFromAPI, getArticleFromAPI } from '../articles';
import type { APIArticle } from '@/types';
import { API_BASE_URL, DEFAULT_ARTICLE_IMAGE } from '@/config';

// Mock fetch globally
globalThis.fetch = jest.fn();

describe('Articles Utilities', () => {
  const mockAPIArticle: APIArticle = {
    id: '1',
    slug: '/test-article',
    title: 'Test Article',
    description: 'Test description',
    category: 'Technology',
    author: 'John Doe',
    publishedDate: '2026-01-10',
    imageUrl: '/images/test.jpg',
    imageAlt: 'Test image',
    tags: 'test, article, technology',
    content: '<p>Test content</p>',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getArticlesFromAPI', () => {
    it('should fetch articles successfully with default page', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAPIArticle],
      });

      const result = await getArticlesFromAPI();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        slug: '/test-article',
        title: 'Test Article',
        description: 'Test description',
        category: 'Technology',
        author: 'John Doe',
        publishedDate: '2026-01-10',
        imageUrl: '/images/test.jpg',
        imageAlt: 'Test image',
        tags: ['test', 'article', 'technology'],
        content: '<p>Test content</p>',
      });

      // Verify fetch was called with correct URL
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/articles?page=0`,
        { next: { revalidate: 60 } }
      );
    });

    it('should fetch articles with specific page number', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAPIArticle],
      });

      await getArticlesFromAPI(2);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/articles?page=2`,
        { next: { revalidate: 60 } }
      );
    });

    it('should return multiple articles', async () => {
      const mockArticles: APIArticle[] = [
        mockAPIArticle,
        { ...mockAPIArticle, id: '2', slug: '/article-2', title: 'Article 2' },
        { ...mockAPIArticle, id: '3', slug: '/article-3', title: 'Article 3' },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
      });

      const result = await getArticlesFromAPI();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('3');
    });

    it('should use default image when imageUrl is not provided', async () => {
      const articleWithoutImage: APIArticle = {
        ...mockAPIArticle,
        imageUrl: undefined,
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [articleWithoutImage],
      });

      const result = await getArticlesFromAPI();

      expect(result[0].imageUrl).toBe(DEFAULT_ARTICLE_IMAGE);
    });

    it('should trim whitespace from tags', async () => {
      const articleWithSpacedTags: APIArticle = {
        ...mockAPIArticle,
        tags: '  test  ,  article  ,  technology  ',
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [articleWithSpacedTags],
      });

      const result = await getArticlesFromAPI();

      expect(result[0].tags).toEqual(['test', 'article', 'technology']);
    });

    it('should handle single tag without commas', async () => {
      const articleWithSingleTag: APIArticle = {
        ...mockAPIArticle,
        tags: 'single-tag',
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [articleWithSingleTag],
      });

      const result = await getArticlesFromAPI();

      expect(result[0].tags).toEqual(['single-tag']);
    });

    it('should return empty array when fetch fails', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getArticlesFromAPI();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching articles:',
        expect.any(Error)
      );
    });

    it('should return empty array when response is not ok', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await getArticlesFromAPI();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch articles:',
        500,
        'Internal Server Error'
      );
    });

    it('should handle empty response array', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getArticlesFromAPI();

      expect(result).toEqual([]);
    });

    it('should include revalidate option in fetch', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getArticlesFromAPI();

      const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1]).toEqual({ next: { revalidate: 60 } });
    });
  });

  describe('getArticleFromAPI', () => {
    it('should fetch article by slug successfully', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAPIArticle],
      });

      const result = await getArticleFromAPI('test-article');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('/test-article');
      expect(result[0].title).toBe('Test Article');

      // Verify fetch was called with correct URL
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/article-by-slug/?slug=%2Ftest-article`,
        { next: { revalidate: 60 } }
      );
    });

    it('should prepend slash to slug', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAPIArticle],
      });

      await getArticleFromAPI('my-article');

      // Verify the slug has a leading slash
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('slug=%2Fmy-article'), // %2F is URL encoded /
        expect.any(Object)
      );
    });

    it('should handle URL encoding in slug', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAPIArticle],
      });

      await getArticleFromAPI('article with spaces');

      // Verify the slug is URL encoded properly
      const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toContain('%2Farticle+with+spaces');
    });

    it('should adapt article data correctly', async () => {
      const apiArticle: APIArticle = {
        ...mockAPIArticle,
        tags: 'tag1, tag2, tag3',
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [apiArticle],
      });

      const result = await getArticleFromAPI('test');

      // Check that tags are converted from string to array
      expect(result[0].tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should use default image when imageUrl is not provided', async () => {
      const articleWithoutImage: APIArticle = {
        ...mockAPIArticle,
        imageUrl: undefined,
      };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [articleWithoutImage],
      });

      const result = await getArticleFromAPI('test');

      expect(result[0].imageUrl).toBe(DEFAULT_ARTICLE_IMAGE);
    });

    it('should return empty array when fetch fails', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getArticleFromAPI('test');

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching articles:',
        expect.any(Error)
      );
    });

    it('should return empty array when response is not ok', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await getArticleFromAPI('non-existent');

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch articles:',
        404,
        'Not Found'
      );
    });

    it('should handle empty response', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getArticleFromAPI('test');

      expect(result).toEqual([]);
    });

    it('should include revalidate option in fetch', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getArticleFromAPI('test');

      const fetchCall = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[1]).toEqual({ next: { revalidate: 60 } });
    });

    it('should handle multiple articles in response', async () => {
      const multipleArticles: APIArticle[] = [
        mockAPIArticle,
        { ...mockAPIArticle, id: '2' },
      ];

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => multipleArticles,
      });

      const result = await getArticleFromAPI('test');

      expect(result).toHaveLength(2);
    });

    it('should preserve all article properties during adaptation', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAPIArticle],
      });

      const result = await getArticleFromAPI('test');

      const article = result[0];
      expect(article).toHaveProperty('id', mockAPIArticle.id);
      expect(article).toHaveProperty('title', mockAPIArticle.title);
      expect(article).toHaveProperty('slug', mockAPIArticle.slug);
      expect(article).toHaveProperty('description', mockAPIArticle.description);
      expect(article).toHaveProperty('content', mockAPIArticle.content);
      expect(article).toHaveProperty('category', mockAPIArticle.category);
      expect(article).toHaveProperty('author', mockAPIArticle.author);
      expect(article).toHaveProperty('publishedDate', mockAPIArticle.publishedDate);
      expect(article).toHaveProperty('imageUrl', mockAPIArticle.imageUrl);
      expect(article).toHaveProperty('imageAlt', mockAPIArticle.imageAlt);
      expect(article).toHaveProperty('tags');
    });
  });
});
