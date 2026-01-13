import { GET } from './route';
import { getArticlesFromAPI } from '@/utils';
import type { Article } from '@/types';

// Mock utilities
jest.mock('@/utils', () => ({
  getArticlesFromAPI: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

describe('Load More API Route', () => {
  const mockGetArticlesFromAPI = getArticlesFromAPI as jest.MockedFunction<
    typeof getArticlesFromAPI
  >;

  const mockArticles: Article[] = [
    {
      id: '1',
      slug: '/article-1',
      title: 'Test Article 1',
      description: 'Description 1',
      category: 'Technology',
      author: 'John Doe',
      publishedDate: '2026-01-10',
      imageUrl: '/images/test-1.jpg',
      imageAlt: 'Test image 1',
      tags: ['test', 'article'],
      content: '<p>Content 1</p>',
    },
    {
      id: '2',
      slug: '/article-2',
      title: 'Test Article 2',
      description: 'Description 2',
      category: 'Science',
      author: 'Jane Smith',
      publishedDate: '2026-01-11',
      imageUrl: '/images/test-2.jpg',
      imageAlt: 'Test image 2',
      tags: ['science', 'research'],
      content: '<p>Content 2</p>',
    },
  ];

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL('/api/load-more', 'http://localhost:3000');
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return {
      nextUrl: {
        searchParams: url.searchParams,
      },
    } as any;
  };

  it('should return articles for a specific page', async () => {
    mockGetArticlesFromAPI.mockResolvedValue(mockArticles);
    const request = createMockRequest({ page: '2' });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockArticles);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(2);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledTimes(1);
  });

  it('should use page 1 as default when page parameter is not provided', async () => {
    mockGetArticlesFromAPI.mockResolvedValue(mockArticles);
    const request = createMockRequest();

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockArticles);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(1);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no articles are found', async () => {
    mockGetArticlesFromAPI.mockResolvedValue([]);
    const request = createMockRequest({ page: '5' });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(5);
  });

  it('should return 500 error when getArticlesFromAPI throws an error', async () => {
    const errorMessage = 'Database connection failed';
    mockGetArticlesFromAPI.mockRejectedValue(new Error(errorMessage));
    const request = createMockRequest({ page: '1' });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to load articles' });
    expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in load-more API:', expect.any(Error));
  });

  it('should handle page parameter as string and convert to number', async () => {
    mockGetArticlesFromAPI.mockResolvedValue(mockArticles);
    const request = createMockRequest({ page: '10' });

    const response = await GET(request);
    await response.json();

    expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(10);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledTimes(1);
  });

  it('should handle negative page numbers', async () => {
    mockGetArticlesFromAPI.mockResolvedValue(mockArticles);
    const request = createMockRequest({ page: '-1' });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockArticles);
    expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(-1);
  });

  it('should handle multiple sequential requests', async () => {
    const pages = [1, 2, 3];

    for (const page of pages) {
      mockGetArticlesFromAPI.mockResolvedValue(mockArticles);
      const request = createMockRequest({ page: page.toString() });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockArticles);
    }

    expect(mockGetArticlesFromAPI).toHaveBeenCalledTimes(pages.length);
    pages.forEach((page) => {
      expect(mockGetArticlesFromAPI).toHaveBeenCalledWith(page);
    });
  });

  it('should return articles with correct structure', async () => {
    mockGetArticlesFromAPI.mockResolvedValue(mockArticles);
    const request = createMockRequest({ page: '1' });

    const response = await GET(request);
    const data = (await response.json()) as Article[];

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);

    // Verify first article structure
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('slug');
    expect(data[0]).toHaveProperty('description');
    expect(data[0]).toHaveProperty('content');
    expect(data[0]).toHaveProperty('category');
    expect(data[0]).toHaveProperty('author');
    expect(data[0]).toHaveProperty('publishedDate');
    expect(data[0]).toHaveProperty('tags');
    expect(Array.isArray(data[0].tags)).toBe(true);
  });

  it('should log error to console when exception occurs', async () => {
    const testError = new Error('Network timeout');
    mockGetArticlesFromAPI.mockRejectedValue(testError);
    const request = createMockRequest({ page: '1' });

    await GET(request);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in load-more API:', testError);
  });
});
