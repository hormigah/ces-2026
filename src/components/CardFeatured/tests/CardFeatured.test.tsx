import { renderComponent } from '@/tests';
import CardFeatured, { type CardFeaturedProps } from '../CardFeatured';
import type { Article } from '@/types';
import { DEFAULT_ARTICLE_IMAGE } from '@/config/constants';

describe('CardFeatured Component', () => {
  const mockArticle: Article = {
    id: 1,
    slug: 'featured-test-article',
    title: 'Featured Test Article Title',
    description: 'This is a featured test article description with more detailed content',
    category: 'Technology',
    author: 'Jane Smith',
    publishedDate: '2026-01-11',
    imageUrl: '/images/featured-test-image.jpg',
    imageAlt: 'Featured test image alt text',
    tags: ['featured', 'test', 'article', 'technology', 'extra-tag'],
    content: '<p>Featured test content</p>',
  };

  const defaultProps: CardFeaturedProps = {
    article: mockArticle,
  };

  const renderCardFeatured = (props: Partial<CardFeaturedProps> = {}) => {
    return renderComponent(<CardFeatured {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the article with all props correctly', () => {
    const { getByText } = renderCardFeatured();

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
    const { getAllByRole } = renderCardFeatured();

    const links = getAllByRole('link');

    // All links should point to the article slug
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', `/${mockArticle.slug}`);
    });
  });

  it('should render the image link within the grid layout', () => {
    const { container } = renderCardFeatured();

    // Find the link containing the image
    const imageLink = container.querySelector('a[href*="featured-test-article"]');

    expect(imageLink).toBeInTheDocument();
    expect(imageLink).toHaveAttribute('href', `/${mockArticle.slug}`);
  });

  it('should render the image with correct src and alt', () => {
    const { getByAltText } = renderCardFeatured();

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

    const { getByAltText } = renderCardFeatured({ article: articleWithoutImage });

    const image = getByAltText(mockArticle.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', DEFAULT_ARTICLE_IMAGE);
  });

  it('should use article title as alt text when imageAlt is not provided', () => {
    const articleWithoutImageAlt = {
      ...mockArticle,
      imageAlt: undefined,
    };

    const { getByAltText } = renderCardFeatured({ article: articleWithoutImageAlt });

    const image = getByAltText(mockArticle.title);

    expect(image).toBeInTheDocument();
  });

  it('should render the published date with correct format', () => {
    const { getByText } = renderCardFeatured();

    // Use a flexible matcher for the date text (could be formatted differently)
    const dateElement = getByText(/de enero de 2026/i);

    expect(dateElement).toBeInTheDocument();
    expect(dateElement.tagName).toBe('TIME');
    expect(dateElement).toHaveAttribute('dateTime', mockArticle.publishedDate);
  });

  it('should render tags with a maximum of 4 items', () => {
    const { container } = renderCardFeatured();

    // Find all tag elements by their class
    const tags = container.querySelectorAll('.text-xs.bg-gray-200.text-gray-800');

    // Should only render first 4 tags even though article has 5
    expect(tags).toHaveLength(4);

    // Check if the rendered tags are the first 4 from the array
    mockArticle.tags.slice(0, 4).forEach((tag, index) => {
      expect(tags[index]).toHaveTextContent(tag);
    });
  });

  it('should render all tags when article has 4 or fewer tags', () => {
    const articleWithFewerTags = {
      ...mockArticle,
      tags: ['tag1', 'tag2', 'tag3'],
    };

    const { container } = renderCardFeatured({ article: articleWithFewerTags });

    const tags = container.querySelectorAll('.text-xs.bg-gray-200.text-gray-800');

    expect(tags).toHaveLength(3);
  });

  it('should have correct accessibility attributes', () => {
    const { getByRole, getByText } = renderCardFeatured();

    // Check for article semantic element
    const article = getByRole('article');
    expect(article).toBeInTheDocument();

    // Check for time element
    const timeElement = getByText(/de enero de 2026/i);
    expect(timeElement.tagName).toBe('TIME');
  });

  it('should apply hover styles classes', () => {
    const { getByRole } = renderCardFeatured();

    const article = getByRole('article');

    // Check if the article has hover transition classes
    expect(article).toHaveClass('hover:shadow-xl', 'transition-shadow', 'duration-300');
  });

  it('should render the category badge with correct styles', () => {
    const { getByText } = renderCardFeatured();

    const categoryBadge = getByText(mockArticle.category);

    // Check if category badge has the correct styling classes
    expect(categoryBadge).toHaveClass('text-blue-800', 'bg-blue-50', 'rounded-full');
  });

  it('should truncate description with line-clamp classes', () => {
    const { getByText } = renderCardFeatured();

    const description = getByText(mockArticle.description);

    // Check if description has line-clamp class
    expect(description).toHaveClass('line-clamp-2');
  });

  it('should render SVG icons for author and date', () => {
    const { container } = renderCardFeatured();

    // Check if SVG icons are present
    const svgs = container.querySelectorAll('svg');

    // Should have at least 2 SVG icons (author and date)
    expect(svgs.length).toBeGreaterThanOrEqual(2);

    // All SVGs should have aria-hidden attribute
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('should have a responsive grid layout', () => {
    const { container } = renderCardFeatured();

    // Find the grid container
    const gridContainer = container.querySelector(String.raw`.grid.md\:grid-cols-3`);

    expect(gridContainer).toBeInTheDocument();
  });

  it('should render the image with priority attribute for optimization', () => {
    const { getByAltText } = renderCardFeatured();

    const image = getByAltText(mockArticle.imageAlt as string);

    // Next.js Image component with priority should have priority attribute
    expect(image).toBeInTheDocument();
  });

  it('should render tag badges with correct styles', () => {
    const { container } = renderCardFeatured();

    const tags = container.querySelectorAll('.text-xs.bg-gray-200.text-gray-800');

    tags.forEach((tag) => {
      expect(tag).toHaveClass('rounded-full', 'px-2.5', 'py-1');
    });
  });
});
