import { renderComponent } from '@/tests';
import Card, { type CardProps } from '../Card';
import type { Article } from '@/types';
import { DEFAULT_ARTICLE_IMAGE } from '@/config/constants';

describe('Card Component', () => {
  const mockArticle: Article = {
    id: '1',
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'This is a test article description',
    category: 'Technology',
    author: 'John Doe',
    publishedDate: '2026-01-10',
    imageUrl: '/images/test-image.jpg',
    imageAlt: 'Test image alt text',
    tags: ['test', 'article'],
    content: '<p>Test content</p>',
  };

  const defaultProps: CardProps = {
    article: mockArticle,
  };

  const renderCard = (props: Partial<CardProps> = {}) => {
    return renderComponent(<Card {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the article with all props correctly', () => {
    const { getByText } = renderCard();

    // Check if title is rendered
    expect(getByText(mockArticle.title)).toBeInTheDocument();

    // Check if description is rendered
    expect(getByText(mockArticle.description)).toBeInTheDocument();

    // Check if category is rendered
    expect(getByText(mockArticle.category)).toBeInTheDocument();

    // Check if author is rendered
    expect(getByText(mockArticle.author)).toBeInTheDocument();
  });

  it('should render links with correct href', () => {
    const { getAllByRole } = renderCard();

    const links = getAllByRole('link');

    // Both the image link and title link should point to the article slug
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', `/${mockArticle.slug}`);
    });
  });

  it('should render the image with correct src and alt', () => {
    const { getByAltText } = renderCard();

    const image = getByAltText(mockArticle.imageAlt as string);

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockArticle.imageUrl);
  });

  it('should use default image when imageUrl is not provided', () => {
    const articleWithoutImage = {
      ...mockArticle,
      imageUrl: undefined,
      imageAlt: undefined,
    };

    const { getByAltText } = renderCard({ article: articleWithoutImage });

    const image = getByAltText(mockArticle.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', DEFAULT_ARTICLE_IMAGE);
  });

  it('should use article title as alt text when imageAlt is not provided', () => {
    const articleWithoutImageAlt = {
      ...mockArticle,
      imageAlt: undefined,
    };

    const { getByAltText } = renderCard({ article: articleWithoutImageAlt });

    const image = getByAltText(mockArticle.title);

    expect(image).toBeInTheDocument();
  });

  it('should render the published date with correct format', () => {
    const { getByText } = renderCard();

    // Use a flexible matcher for the date text (could be formatted differently)
    const dateElement = getByText(/de enero de 2026/i);

    expect(dateElement).toBeInTheDocument();
    expect(dateElement.tagName).toBe('TIME');
    expect(dateElement).toHaveAttribute('dateTime', mockArticle.publishedDate);
  });

  it('should have correct accessibility attributes', () => {
    const { getByRole, getByText } = renderCard();

    // Check for article semantic element
    const article = getByRole('article');
    expect(article).toBeInTheDocument();

    // Check for time element
    const timeElement = getByText(/de enero de 2026/i);
    expect(timeElement.tagName).toBe('TIME');
  });

  it('should apply hover styles classes', () => {
    const { getByRole } = renderCard();

    const article = getByRole('article');

    // Check if the article has hover transition classes
    expect(article).toHaveClass('hover:shadow-lg', 'transition-shadow', 'duration-300');
  });

  it('should render the category badge with correct styles', () => {
    const { getByText } = renderCard();

    const categoryBadge = getByText(mockArticle.category);

    // Check if category badge has the correct styling classes
    expect(categoryBadge).toHaveClass('text-blue-800', 'bg-blue-50', 'rounded-full');
  });

  it('should truncate long text with line-clamp classes', () => {
    const { getByText } = renderCard();

    const title = getByText(mockArticle.title);
    const description = getByText(mockArticle.description);
    // Check if title and description have line-clamp classes
    expect(title.parentElement).toHaveClass('line-clamp-2');
    expect(description).toHaveClass('line-clamp-2');
  });

  it('should render SVG icon for author', () => {
    const { container } = renderCard();

    // Check if SVG icon is present
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
