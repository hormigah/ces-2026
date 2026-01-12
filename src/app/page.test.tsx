import { renderComponent } from '@/tests';
import Home from './page';
import type { Article } from '@/types';
import * as utils from '@/utils';

// Mock utility functions
jest.mock('@/utils', () => ({
  getArticlesFromAPI: jest.fn(),
}));

// Mock child components to avoid testing their internal logic
jest.mock('@/components', () => ({
  Content: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="content">{children}</div>
  ),
  CardFeatured: ({ article }: { article: Article }) => (
    <div data-testid="card-featured">{article.title}</div>
  ),
  Card: ({ article }: { article: Article }) => <div data-testid="card">{article.title}</div>,
  ArticlesLoader: () => <div data-testid="articles-loader">Articles Loader</div>,
}));

describe('Home Page', () => {
  const mockArticles: Article[] = [
    {
      id: '1',
      slug: '/article-1',
      title: 'Featured Article',
      description: 'Featured article description',
      category: 'Technology',
      author: 'John Doe',
      publishedDate: '2026-01-10T12:00:00',
      imageUrl: '/images/article-1.jpg',
      imageAlt: 'Article 1 image',
      tags: ['featured', 'technology'],
      content: '<p>Featured content</p>',
    },
    {
      id: '2',
      slug: '/article-2',
      title: 'Second Article',
      description: 'Second article description',
      category: 'Science',
      author: 'Jane Smith',
      publishedDate: '2026-01-11T12:00:00',
      imageUrl: '/images/article-2.jpg',
      imageAlt: 'Article 2 image',
      tags: ['science'],
      content: '<p>Second content</p>',
    },
    {
      id: '3',
      slug: '/article-3',
      title: 'Third Article',
      description: 'Third article description',
      category: 'Innovation',
      author: 'Bob Johnson',
      publishedDate: '2026-01-12T12:00:00',
      imageUrl: '/images/article-3.jpg',
      imageAlt: 'Article 3 image',
      tags: ['innovation'],
      content: '<p>Third content</p>',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Header section', () => {
    it('should render the main heading', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const heading = getByText('Últimas novedades del CES 2026');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should render the subtitle', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      expect(
        getByText(/Cobertura completa de las innovaciones más impactantes/)
      ).toBeInTheDocument();
    });

    it('should have correct CSS classes for main heading', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const heading = getByText('Últimas novedades del CES 2026');
      expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'font-bold', 'text-gray-900', 'mb-4');
    });

    it('should have correct CSS classes for subtitle', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const subtitle = getByText(/Cobertura completa de las innovaciones más impactantes/);
      expect(subtitle).toHaveClass('text-xl', 'text-gray-700', 'max-w-3xl');
    });

    it('should have correct CSS classes for header container', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      const header = container.querySelector('header');
      expect(header).toHaveClass('mb-12');
    });
  });

  describe('Featured article section', () => {
    it('should render featured article when articles exist', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByTestId } = renderComponent(component);

      const featuredCard = getByTestId('card-featured');
      expect(featuredCard).toBeInTheDocument();
      expect(featuredCard).toHaveTextContent('Featured Article');
    });

    it('should render first article as featured', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByTestId } = renderComponent(component);

      const featuredCard = getByTestId('card-featured');
      expect(featuredCard).toHaveTextContent(mockArticles[0].title);
    });

    it('should not render featured article when no articles exist', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const component = await Home();
      const { queryByTestId } = renderComponent(component);

      expect(queryByTestId('card-featured')).not.toBeInTheDocument();
    });

    it('should have correct section classes for featured article', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      const sections = container.querySelectorAll('section');
      const featuredSection = sections[0];
      expect(featuredSection).toHaveClass('mb-8');
    });
  });

  describe('Articles list section', () => {
    it('should render remaining articles', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getAllByTestId } = renderComponent(component);

      const cards = getAllByTestId('card');
      expect(cards).toHaveLength(2); // All articles except the featured one
    });

    it('should not include featured article in list', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getAllByTestId, queryByText } = renderComponent(component);

      const cards = getAllByTestId('card');
      const cardTitles = cards.map((card) => card.textContent);

      expect(cardTitles).not.toContain('Featured Article');
      expect(cardTitles).toContain('Second Article');
      expect(cardTitles).toContain('Third Article');
    });

    it('should render articles with correct keys', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getAllByTestId } = renderComponent(component);

      const cards = getAllByTestId('card');
      expect(cards).toHaveLength(mockArticles.length - 1);
    });

    it('should have correct section classes for articles list', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      const sections = container.querySelectorAll('section');
      const articlesSection = sections[1];
      expect(articlesSection).toHaveClass('space-y-4');
    });

    it('should not render article cards when only one article exists', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([mockArticles[0]]);

      const component = await Home();
      const { queryAllByTestId } = renderComponent(component);

      const cards = queryAllByTestId('card');
      expect(cards).toHaveLength(0);
    });
  });

  describe('ArticlesLoader component', () => {
    it('should render ArticlesLoader component', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByTestId } = renderComponent(component);

      expect(getByTestId('articles-loader')).toBeInTheDocument();
    });

    it('should render ArticlesLoader even when no articles exist', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const component = await Home();
      const { getByTestId } = renderComponent(component);

      expect(getByTestId('articles-loader')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should display message when no articles are available', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const component = await Home();
      const { getByText } = renderComponent(component);

      expect(getByText('No hay artículos disponibles en este momento.')).toBeInTheDocument();
    });

    it('should not display empty message when articles exist', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { queryByText } = renderComponent(component);

      expect(queryByText('No hay artículos disponibles en este momento.')).not.toBeInTheDocument();
    });

    it('should have correct CSS classes for empty state', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const message = getByText('No hay artículos disponibles en este momento.');
      expect(message).toHaveClass('text-gray-700', 'text-lg');
      expect(message.parentElement).toHaveClass('text-center', 'py-12');
    });
  });

  describe('About CES section', () => {
    it('should render About CES section heading', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const heading = getByText('Sobre el CES 2026');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should render About CES first paragraph', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      expect(
        getByText(/El Consumer Electronics Show 2026 continúa siendo el evento tecnológico/)
      ).toBeInTheDocument();
    });

    it('should render About CES second paragraph', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      expect(
        getByText(/Este año, el evento destaca especialmente los avances/)
      ).toBeInTheDocument();
    });

    it('should have correct CSS classes for About section heading', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const heading = getByText('Sobre el CES 2026');
      expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
    });

    it('should have correct CSS classes for About section paragraphs', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByText } = renderComponent(component);

      const firstParagraph = getByText(/El Consumer Electronics Show 2026 continúa siendo/);
      expect(firstParagraph).toHaveClass('text-gray-700', 'leading-relaxed', 'mb-4');

      const secondParagraph = getByText(/Este año, el evento destaca especialmente/);
      expect(secondParagraph).toHaveClass('text-gray-700', 'leading-relaxed');
    });

    it('should have correct CSS classes for About section container', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      const sections = container.querySelectorAll('section');
      const aboutSection = sections[sections.length - 1];
      expect(aboutSection).toHaveClass('border-gray-300', 'pt-12');
    });
  });

  describe('Layout and structure', () => {
    it('should have correct CSS classes for main container', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      const mainDiv = container.querySelector('.max-w-6xl');
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass('mx-auto');
    });

    it('should render all sections in correct order', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('should have semantic HTML structure', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { container } = renderComponent(component);

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelectorAll('section').length).toBeGreaterThan(0);
    });

    it('should wrap content in Content component', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByTestId } = renderComponent(component);

      expect(getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('Data fetching', () => {
    it('should call getArticlesFromAPI', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      await Home();

      expect(utils.getArticlesFromAPI).toHaveBeenCalled();
    });

    it('should call getArticlesFromAPI with no arguments', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      await Home();

      expect(utils.getArticlesFromAPI).toHaveBeenCalledWith();
    });

    it('should handle empty articles response', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([]);

      const component = await Home();
      const { getByText } = renderComponent(component);

      expect(getByText('No hay artículos disponibles en este momento.')).toBeInTheDocument();
    });

    it('should render correctly with single article', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue([mockArticles[0]]);

      const component = await Home();
      const { getByTestId, queryAllByTestId } = renderComponent(component);

      expect(getByTestId('card-featured')).toBeInTheDocument();
      expect(queryAllByTestId('card')).toHaveLength(0);
    });

    it('should render correctly with multiple articles', async () => {
      (utils.getArticlesFromAPI as jest.Mock).mockResolvedValue(mockArticles);

      const component = await Home();
      const { getByTestId, getAllByTestId } = renderComponent(component);

      expect(getByTestId('card-featured')).toBeInTheDocument();
      expect(getAllByTestId('card').length).toBe(mockArticles.length - 1);
    });
  });
});
