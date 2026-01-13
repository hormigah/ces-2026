import { renderComponent } from '@/tests';
import ArticlePage, { generateMetadata, generateStaticParams } from './page';
import type { Article } from '@/types';
import { DEFAULT_ARTICLE_IMAGE } from '@/config/constants';
import * as utils from '@/utils';
import { notFound } from 'next/navigation';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

// Mock utility functions
jest.mock('@/utils', () => ({
  getArticleFromAPI: jest.fn(),
  getArticlesFromAPI: jest.fn(),
  formatDate: jest.fn(),
}));

describe('ArticlePage', () => {
  const mockArticle: Article = {
    id: '1',
    slug: '/test-article',
    title: 'Test Article Title',
    description: 'This is a test article description',
    category: 'Technology',
    author: 'John Doe',
    publishedDate: '2026-01-10T12:00:00',
    imageUrl: '/images/test-image.jpg',
    imageAlt: 'Test image alt text',
    tags: ['test', 'article', 'technology'],
    content: '<p>This is the article content with <strong>HTML</strong> markup.</p>',
  };

  const mockParams = {
    params: Promise.resolve({ slug: 'test-article' }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (utils.formatDate as jest.Mock).mockReturnValue('10 de enero de 2026');
  });

  describe('Component rendering', () => {
    it('should render article with all content correctly', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getAllByText, getByText, getByRole } = renderComponent(component);

      // Check main elements
      expect(getByRole('article')).toBeInTheDocument();
      expect(getAllByText(mockArticle.title).length).toBeGreaterThan(0);
      expect(getByText(mockArticle.description)).toBeInTheDocument();
      expect(getByText(mockArticle.category)).toBeInTheDocument();
    });

    it('should render breadcrumb navigation', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText, getByLabelText } = renderComponent(component);

      const breadcrumb = getByLabelText('Breadcrumb');
      expect(breadcrumb).toBeInTheDocument();
      expect(getByText('Inicio')).toBeInTheDocument();
    });

    it('should render author information', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText } = renderComponent(component);

      expect(getByText(mockArticle.author)).toBeInTheDocument();
      expect(getByText(/Por/i)).toBeInTheDocument();
    });

    it('should render formatted published date', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText } = renderComponent(component);

      expect(getByText('10 de enero de 2026')).toBeInTheDocument();
      expect(utils.formatDate).toHaveBeenCalledWith(mockArticle.publishedDate, 'long');
    });

    it('should render article image with correct attributes', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByAltText } = renderComponent(component);

      const image = getByAltText(mockArticle.imageAlt as string);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockArticle.imageUrl);
    });

    it('should use default image when imageUrl is not provided', async () => {
      const articleWithoutImage = { ...mockArticle, imageUrl: undefined };
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([articleWithoutImage]);

      const component = await ArticlePage(mockParams);
      const { getByAltText } = renderComponent(component);

      const image = getByAltText(mockArticle.imageAlt as string);
      expect(image).toHaveAttribute('src', DEFAULT_ARTICLE_IMAGE);
    });

    it('should use title as alt text when imageAlt is not provided', async () => {
      const articleWithoutImageAlt = { ...mockArticle, imageAlt: undefined };
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([articleWithoutImageAlt]);

      const component = await ArticlePage(mockParams);
      const { getByAltText } = renderComponent(component);

      const image = getByAltText(mockArticle.title);
      expect(image).toBeInTheDocument();
    });

    it('should render article content with HTML', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { container } = renderComponent(component);

      const contentDiv = container.querySelector('.prose');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv?.innerHTML).toContain(mockArticle.content);
    });

    it('should render all tags', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText } = renderComponent(component);

      mockArticle.tags.forEach((tag) => {
        expect(getByText(tag)).toBeInTheDocument();
      });
    });

    it('should render back to home link', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText } = renderComponent(component);

      const backLink = getByText('Volver al inicio');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('should render time element with correct dateTime attribute', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { container } = renderComponent(component);

      const timeElement = container.querySelector('time');
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveAttribute('dateTime', mockArticle.publishedDate);
    });

    it('should render JSON-LD structured data', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { container } = renderComponent(component);

      const jsonLdScript = container.querySelector('script[type="application/ld+json"]');
      expect(jsonLdScript).toBeInTheDocument();

      const jsonLd = JSON.parse(jsonLdScript?.textContent || '{}');
      expect(jsonLd['@type']).toBe('Article');
      expect(jsonLd.headline).toBe(mockArticle.title);
      expect(jsonLd.description).toBe(mockArticle.description);
      expect(jsonLd.author.name).toBe(mockArticle.author);
    });
  });

  describe('Error handling', () => {
    it('should call notFound when article does not exist', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([]);

      await expect(ArticlePage(mockParams)).rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound when article is not found by slug', async () => {
      const differentArticle = { ...mockArticle, slug: '/different-article' };
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([differentArticle]);

      await expect(ArticlePage(mockParams)).rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });

    it('should handle article with leading slash in slug', async () => {
      const articleWithSlash = { ...mockArticle, slug: '/test-article' };
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([articleWithSlash]);

      const component = await ArticlePage(mockParams);
      const { getAllByText } = renderComponent(component);

      expect(getAllByText(mockArticle.title).length).toBeGreaterThan(0);
      expect(notFound).not.toHaveBeenCalled();
    });

    it('should handle article without leading slash in slug', async () => {
      const articleWithoutSlash = { ...mockArticle, slug: 'test-article' };
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([articleWithoutSlash]);

      const paramsWithSlug = {
        params: Promise.resolve({ slug: 'test-article' }),
      };

      const component = await ArticlePage(paramsWithSlug);
      const { getAllByText } = renderComponent(component);

      expect(getAllByText(mockArticle.title).length).toBeGreaterThan(0);
      expect(notFound).not.toHaveBeenCalled();
    });
  });

  describe('Styling and accessibility', () => {
    it('should have correct CSS classes for article container', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByRole } = renderComponent(component);

      const article = getByRole('article');
      expect(article).toHaveClass('max-w-4xl', 'mx-auto', 'bg-white', 'rounded-lg', 'shadow-sm');
    });

    it('should have correct CSS classes for category badge', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText } = renderComponent(component);

      const categoryBadge = getByText(mockArticle.category);
      expect(categoryBadge).toHaveClass('text-blue-800', 'bg-blue-50', 'rounded-full');
    });

    it('should have correct CSS classes for tag badges', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByText } = renderComponent(component);

      const firstTag = getByText(mockArticle.tags[0]);
      expect(firstTag).toHaveClass('bg-gray-200', 'text-gray-800', 'rounded-full');
    });

    it('should render SVG icons with aria-hidden attribute', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { container } = renderComponent(component);

      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should have semantic HTML structure', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const component = await ArticlePage(mockParams);
      const { getByRole, container } = renderComponent(component);

      expect(getByRole('article')).toBeInTheDocument();
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
      expect(container.querySelector('nav[aria-label="Breadcrumb"]')).toBeInTheDocument();
    });
  });

  describe('generateMetadata', () => {
    it('should generate correct metadata for existing article', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const metadata = await generateMetadata(mockParams);

      expect(metadata.title).toBe(`${mockArticle.title} - CES 2026`);
      expect(metadata.description).toBe(mockArticle.description);
      expect(metadata.keywords).toBe(mockArticle.tags.join(', '));
    });

    it('should generate OpenGraph metadata', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const metadata = await generateMetadata(mockParams);

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe(mockArticle.title);
      expect(metadata.openGraph?.description).toBe(mockArticle.description);
    });

    it('should generate Twitter metadata', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const metadata = await generateMetadata(mockParams);

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.title).toBe(mockArticle.title);
    });

    it('should return 404 metadata when article not found', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([]);

      const metadata = await generateMetadata(mockParams);

      expect(metadata.title).toBe('Artículo no encontrado - CES 2026');
      expect(metadata.description).toBe('El artículo solicitado no existe.');
    });

    it('should include image in OpenGraph when imageUrl is provided', async () => {
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([mockArticle]);

      const metadata = await generateMetadata(mockParams);

      expect(metadata.openGraph?.images).toBeDefined();
      expect(metadata.openGraph?.images).toHaveLength(1);
    });

    it('should not include image in OpenGraph when imageUrl is not provided', async () => {
      const articleWithoutImage = { ...mockArticle, imageUrl: undefined };
      (utils.getArticleFromAPI as jest.Mock).mockResolvedValue([articleWithoutImage]);

      const metadata = await generateMetadata(mockParams);

      expect(metadata.openGraph?.images).toBeUndefined();
    });
  });

  describe('generateStaticParams', () => {
    it('should generate static params for all articles', async () => {
      const mockArticles: Article[] = [
        mockArticle,
        { ...mockArticle, id: '2', slug: '/article-2' },
        { ...mockArticle, id: '3', slug: '/article-3' },
      ];

      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const params = await generateStaticParams();

      expect(params).toHaveLength(3);
      expect(params[0]).toEqual({ slug: 'test-article' });
      expect(params[1]).toEqual({ slug: 'article-2' });
      expect(params[2]).toEqual({ slug: 'article-3' });
    });

    it('should remove leading slash from slugs', async () => {
      const mockArticles: Article[] = [
        { ...mockArticle, slug: '/test-article' },
        { ...mockArticle, id: '2', slug: '/another-article' },
      ];

      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const params = await generateStaticParams();

      params.forEach((param) => {
        expect(param.slug).not.toMatch(/^\//);
      });
    });

    it('should handle empty articles array', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const params = await generateStaticParams();

      expect(params).toEqual([]);
    });

    it('should handle articles without leading slash', async () => {
      const mockArticles: Article[] = [{ ...mockArticle, slug: 'article-without-slash' }];

      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const params = await generateStaticParams();

      expect(params[0]).toEqual({ slug: 'article-without-slash' });
    });
  });
});
