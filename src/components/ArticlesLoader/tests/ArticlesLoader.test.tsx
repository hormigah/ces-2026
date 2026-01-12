import { renderComponent } from '@/tests';
import { fireEvent } from '@testing-library/react';
import ArticlesLoader from '../ArticlesLoader';
import useArticlesLoader from '../hooks/useArticlesLoader';
import type { Article } from '@/types';

// Mock the useArticlesLoader hook
jest.mock('../hooks/useArticlesLoader');

describe('ArticlesLoader Component', () => {
  const mockArticle: Article = {
    id: '1',
    slug: '/test-article',
    title: 'Test Article',
    description: 'Test description',
    category: 'Technology',
    author: 'John Doe',
    publishedDate: '2026-01-10',
    imageUrl: '/images/test.jpg',
    imageAlt: 'Test image',
    tags: ['test', 'article'],
    content: '<p>Test content</p>',
  };

  const mockLoadMoreArticles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render nothing when there are no articles and hasMore is false', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [],
      isLoading: false,
      hasMore: false,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { container } = renderComponent(<ArticlesLoader />);

    // Should not render section or button
    expect(container.querySelector('section')).not.toBeInTheDocument();
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('should render only the load more button when there are no articles but hasMore is true', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole, container } = renderComponent(<ArticlesLoader />);

    // Should not render section with articles
    expect(container.querySelector('section')).not.toBeInTheDocument();

    // Should render the load more button
    const button = getByRole('button', { name: /cargar más artículos/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should render articles when they exist', () => {
    const mockArticles = [mockArticle];

    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: mockArticles,
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByText, container } = renderComponent(<ArticlesLoader />);

    // Should render the article content
    expect(getByText(mockArticle.title)).toBeInTheDocument();
    expect(getByText(mockArticle.description)).toBeInTheDocument();

    // Should render section with correct classes
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('space-y-4', 'mt-4');
  });

  it('should render multiple articles', () => {
    const mockArticles: Article[] = [
      mockArticle,
      { ...mockArticle, id: '2', slug: '/article-2', title: 'Article 2' },
      { ...mockArticle, id: '3', slug: '/article-3', title: 'Article 3' },
    ];

    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: mockArticles,
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByText } = renderComponent(<ArticlesLoader />);

    // Should render all articles
    expect(getByText('Test Article')).toBeInTheDocument();
    expect(getByText('Article 2')).toBeInTheDocument();
    expect(getByText('Article 3')).toBeInTheDocument();
  });

  it('should render load more button when hasMore is true', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole } = renderComponent(<ArticlesLoader />);

    const button = getByRole('button', { name: /cargar más artículos/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should not render load more button when hasMore is false', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: false,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { queryByRole } = renderComponent(<ArticlesLoader />);

    // Button should not be rendered
    const button = queryByRole('button', { name: /cargar más artículos/i });
    expect(button).not.toBeInTheDocument();
  });

  it('should disable button and show loading text when isLoading is true', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: true,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole } = renderComponent(<ArticlesLoader />);

    const button = getByRole('button', { name: /cargando.../i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should call loadMoreArticles when button is clicked', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole } = renderComponent(<ArticlesLoader />);

    const button = getByRole('button', { name: /cargar más artículos/i });
    fireEvent.click(button);

    expect(mockLoadMoreArticles).toHaveBeenCalledTimes(1);
  });

  it('should not call loadMoreArticles when button is disabled', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: true,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole } = renderComponent(<ArticlesLoader />);

    const button = getByRole('button', { name: /cargando.../i });

    // Try to click disabled button
    fireEvent.click(button);

    // Should not be called because button is disabled
    expect(mockLoadMoreArticles).not.toHaveBeenCalled();
  });

  it('should have correct button styling classes', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole } = renderComponent(<ArticlesLoader />);

    const button = getByRole('button', { name: /cargar más artículos/i });

    // Check button has correct styling classes
    expect(button).toHaveClass(
      'px-6',
      'py-3',
      'bg-blue-600',
      'text-white',
      'font-semibold',
      'rounded-lg',
      'hover:bg-blue-700',
      'disabled:bg-gray-400',
      'disabled:cursor-not-allowed',
      'transition-colors',
      'duration-200'
    );
  });

  it('should have correct button container styling', () => {
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { getByRole } = renderComponent(<ArticlesLoader />);

    const button = getByRole('button', { name: /cargar más artículos/i });
    const buttonContainer = button.parentElement;

    // Check container has correct styling classes
    expect(buttonContainer).toHaveClass('mt-8', 'text-center');
  });

  it('should render each article with unique key', () => {
    const mockArticles: Article[] = [
      mockArticle,
      { ...mockArticle, id: '2', slug: '/article-2', title: 'Article 2' },
    ];

    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: mockArticles,
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    const { container } = renderComponent(<ArticlesLoader />);

    // Should render articles without key warnings
    // We can't directly test the key prop, but we can verify both articles are rendered
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(2);
  });

  it('should handle transition from loading to loaded state', () => {
    const { rerender, getByRole } = renderComponent(<ArticlesLoader />);

    // Initial loading state
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [],
      isLoading: true,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    rerender(<ArticlesLoader />);

    let button = getByRole('button', { name: /cargando.../i });
    expect(button).toBeDisabled();

    // After loading completes
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    rerender(<ArticlesLoader />);

    button = getByRole('button', { name: /cargar más artículos/i });
    expect(button).not.toBeDisabled();
  });

  it('should handle transition from hasMore to no more articles', () => {
    const { rerender, queryByRole } = renderComponent(<ArticlesLoader />);

    // Initial state with more articles available
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: true,
      loadMoreArticles: mockLoadMoreArticles,
    });

    rerender(<ArticlesLoader />);

    let button = queryByRole('button', { name: /cargar más artículos/i });
    expect(button).toBeInTheDocument();

    // After loading all articles
    (useArticlesLoader as jest.Mock).mockReturnValue({
      articles: [mockArticle],
      isLoading: false,
      hasMore: false,
      loadMoreArticles: mockLoadMoreArticles,
    });

    rerender(<ArticlesLoader />);

    button = queryByRole('button', { name: /cargar más artículos/i });
    expect(button).not.toBeInTheDocument();
  });
});
