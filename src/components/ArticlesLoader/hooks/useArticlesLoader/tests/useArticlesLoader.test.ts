import { renderHook } from '@/tests';
import { waitFor } from '@testing-library/react';
import useArticlesLoader from '../useArticlesLoader';
import type { Article } from '@/types';

// Mock fetch globally
globalThis.fetch = jest.fn();

describe('useArticlesLoader Hook', () => {
  const mockArticles: Article[] = [
    {
      id: '1',
      slug: '/article-1',
      title: 'Article 1',
      description: 'Description 1',
      category: 'Technology',
      author: 'John Doe',
      publishedDate: '2026-01-10',
      imageUrl: '/images/article-1.jpg',
      imageAlt: 'Article 1 image',
      tags: ['test'],
      content: '<p>Content 1</p>',
    },
    {
      id: '2',
      slug: '/article-2',
      title: 'Article 2',
      description: 'Description 2',
      category: 'Science',
      author: 'Jane Smith',
      publishedDate: '2026-01-11',
      imageUrl: '/images/article-2.jpg',
      imageAlt: 'Article 2 image',
      tags: ['test'],
      content: '<p>Content 2</p>',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useArticlesLoader());

    // Check initial state
    expect(result.current.articles).toEqual([]);
    expect(result.current.page).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loadMoreArticles).toBeInstanceOf(Function);
  });

  it('should load articles successfully', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    const { result } = renderHook(() => useArticlesLoader());

    // Trigger load more articles
    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.articles).toEqual(mockArticles);
      expect(result.current.page).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasMore).toBe(false); // Less than 5 articles
    });

    // Verify fetch was called with correct URL
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/load-more?page=1');
  });

  it('should set hasMore to true when loading 5 or more articles', async () => {
    const manyArticles = [
      ...mockArticles,
      { ...mockArticles[0], id: '3', slug: '/article-3' },
      { ...mockArticles[0], id: '4', slug: '/article-4' },
      { ...mockArticles[0], id: '5', slug: '/article-5' },
    ];

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => manyArticles,
    });

    const { result } = renderHook(() => useArticlesLoader());

    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.articles).toEqual(manyArticles);
      expect(result.current.hasMore).toBe(true); // 5 or more articles
    });
  });

  it('should append new articles to existing ones', async () => {
    const firstBatch = [mockArticles[0]];
    const secondBatch = [mockArticles[1]];

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstBatch,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondBatch,
      });

    const { result } = renderHook(() => useArticlesLoader());

    // Load first batch
    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.articles).toEqual(firstBatch);
      expect(result.current.page).toBe(2);
    });

    // Load second batch
    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.articles).toEqual([...firstBatch, ...secondBatch]);
      expect(result.current.page).toBe(3);
    });
  });

  it('should set hasMore to false when no articles are returned', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useArticlesLoader());

    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.articles).toEqual([]);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.page).toBe(1); // Page should not increment
    });
  });

  it('should handle fetch errors gracefully', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useArticlesLoader());

    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.articles).toEqual([]);
    });

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error loading more articles:',
      expect.any(Error)
    );
  });

  it('should handle non-ok response gracefully', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useArticlesLoader());

    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.articles).toEqual([]);
    });

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith('Failed to load more articles');
  });

  it('should set isLoading correctly during fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (globalThis.fetch as jest.Mock).mockReturnValueOnce(promise);

    const { result } = renderHook(() => useArticlesLoader());

    // Start loading
    const loadPromise = result.current.loadMoreArticles();

    // Should be loading immediately
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Resolve the fetch
    resolvePromise!({
      ok: true,
      json: async () => mockArticles,
    });

    await loadPromise;

    // Should not be loading after fetch completes
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should increment page number on successful load', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticles,
    });

    const { result } = renderHook(() => useArticlesLoader());

    expect(result.current.page).toBe(1);

    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    // Verify next fetch would use page 2
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await result.current.loadMoreArticles();

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/load-more?page=2');
    });
  });

  it('should use correct page number in fetch URL', async () => {
    const batches = [
      [mockArticles[0]],
      [mockArticles[1]],
      [{ ...mockArticles[0], id: '3' }],
    ];

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => batches[0],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => batches[1],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => batches[2],
      });

    const { result } = renderHook(() => useArticlesLoader());

    // First call with page 1
    await result.current.loadMoreArticles();
    await waitFor(() => expect(result.current.page).toBe(2));
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/load-more?page=1');

    // Second call with page 2
    await result.current.loadMoreArticles();
    await waitFor(() => expect(result.current.page).toBe(3));
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/load-more?page=2');

    // Third call with page 3
    await result.current.loadMoreArticles();
    await waitFor(() => expect(result.current.page).toBe(4));
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/load-more?page=3');
  });
});
