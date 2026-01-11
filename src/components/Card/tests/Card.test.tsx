import { render, screen } from '@testing-library/react';
import Card from '../Card';
import type { Article } from '@/types';
import { DEFAULT_ARTICLE_IMAGE } from '@/config/constants';

describe('Card Component', () => {
  const mockArticle: Article = {
    id: 1,
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

  it('should render the article with all props correctly', () => {
    render(<Card article={mockArticle} />);

    // Check if title is rendered
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();

    // Check if description is rendered
    expect(screen.getByText(mockArticle.description)).toBeInTheDocument();

    // Check if category is rendered
    expect(screen.getByText(mockArticle.category)).toBeInTheDocument();

    // Check if author is rendered
    expect(screen.getByText(mockArticle.author)).toBeInTheDocument();
  });

  it('should render links with correct href', () => {
    render(<Card article={mockArticle} />);

    const links = screen.getAllByRole('link');

    // Both the image link and title link should point to the article slug
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', `/${mockArticle.slug}`);
    });
  });

  it('should render the image with correct src and alt', () => {
    render(<Card article={mockArticle} />);

    const image = screen.getByAltText(mockArticle.imageAlt as string);

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockArticle.imageUrl);
  });

  it('should use default image when imageUrl is not provided', () => {
    const articleWithoutImage = {
      ...mockArticle,
      imageUrl: undefined,
      imageAlt: undefined,
    };

    render(<Card article={articleWithoutImage} />);

    const image = screen.getByAltText(mockArticle.title);

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', DEFAULT_ARTICLE_IMAGE);
  });

  it('should use article title as alt text when imageAlt is not provided', () => {
    const articleWithoutImageAlt = {
      ...mockArticle,
      imageAlt: undefined,
    };

    render(<Card article={articleWithoutImageAlt} />);

    const image = screen.getByAltText(mockArticle.title);

    expect(image).toBeInTheDocument();
  });

  it('should render the published date with correct format', () => {
    render(<Card article={mockArticle} />);

    // Use a flexible matcher for the date text (could be formatted differently)
    const dateElement = screen.getByText(/de enero de 2026/i);

    expect(dateElement).toBeInTheDocument();
    expect(dateElement.tagName).toBe('TIME');
    expect(dateElement).toHaveAttribute('dateTime', mockArticle.publishedDate);
  });

  it('should have correct accessibility attributes', () => {
    render(<Card article={mockArticle} />);

    // Check for article semantic element
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();

    // Check for time element
    const timeElement = screen.getByText(/de enero de 2026/i);
    expect(timeElement.tagName).toBe('TIME');
  });

  it('should apply hover styles classes', () => {
    render(<Card article={mockArticle} />);

    const article = screen.getByRole('article');

    // Check if the article has hover transition classes
    expect(article).toHaveClass('hover:shadow-lg', 'transition-shadow', 'duration-300');
  });

  it('should render the category badge with correct styles', () => {
    render(<Card article={mockArticle} />);

    const categoryBadge = screen.getByText(mockArticle.category);

    // Check if category badge has the correct styling classes
    expect(categoryBadge).toHaveClass('text-blue-800', 'bg-blue-50', 'rounded-full');
  });

  it('should truncate long text with line-clamp classes', () => {
    render(<Card article={mockArticle} />);

    const title = screen.getByText(mockArticle.title);
    const description = screen.getByText(mockArticle.description);

    // Check if title and description have line-clamp classes
    expect(title.parentElement).toHaveClass('line-clamp-2');
    expect(description).toHaveClass('line-clamp-2');
  });

  it('should render SVG icon for author', () => {
    const { container } = render(<Card article={mockArticle} />);

    // Check if SVG icon is present
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
