import { renderComponent } from '@/tests';
import Header from '../Header';

describe('Header Component', () => {
  const renderHeader = () => {
    return renderComponent(<Header />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the header element', () => {
    const { container } = renderHeader();

    const headerElement = container.querySelector('header');

    expect(headerElement).toBeInTheDocument();
    expect(headerElement?.tagName).toBe('HEADER');
  });

  it('should render the CES 2026 logo with correct text', () => {
    const { getByText } = renderHeader();

    expect(getByText('CES')).toBeInTheDocument();
    expect(getByText('2026')).toBeInTheDocument();
  });

  it('should render the logo link with correct href', () => {
    const { container } = renderHeader();

    // Find the logo link (first link in the header)
    const logoLink = container.querySelector('a[href="/"]');

    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render the navigation with correct aria-label', () => {
    const { getByRole } = renderHeader();

    const navElement = getByRole('navigation', { name: /Navegación principal/i });

    expect(navElement).toBeInTheDocument();
  });

  it('should render the home navigation link', () => {
    const { getByRole } = renderHeader();

    const homeLink = getByRole('link', { name: /Inicio/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render the descriptive tagline', () => {
    const { getByText } = renderHeader();

    expect(getByText(/Descubre las últimas innovaciones en tecnología/i)).toBeInTheDocument();
  });

  it('should have correct styling classes on header element', () => {
    const { container } = renderHeader();

    const headerElement = container.querySelector('header');

    expect(headerElement).toHaveClass('border-b', 'border-gray-300', 'bg-white', 'shadow-sm');
  });

  it('should have a container with correct classes', () => {
    const { container } = renderHeader();

    const containerDiv = container.querySelector('.container.mx-auto');

    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('px-4', 'py-6');
  });

  it('should have a flex layout for logo and navigation', () => {
    const { container } = renderHeader();

    const flexContainer = container.querySelector('.flex.items-center.justify-between');

    expect(flexContainer).toBeInTheDocument();
  });

  it('should render the logo with correct styling', () => {
    const { container } = renderHeader();

    const logoDiv = container.querySelector('.text-3xl.font-bold.text-gray-900');

    expect(logoDiv).toBeInTheDocument();
    expect(logoDiv).toHaveTextContent('CES');
    expect(logoDiv).toHaveTextContent('2026');
  });

  it('should render the year "2026" with blue styling', () => {
    const { getByText } = renderHeader();

    const yearText = getByText('2026');

    expect(yearText).toHaveClass('text-blue-800');
    expect(yearText.tagName).toBe('SPAN');
  });

  it('should render navigation list with correct structure', () => {
    const { container } = renderHeader();

    const navElement = container.querySelector('nav');
    const ulElement = navElement?.querySelector('ul');
    const liElement = ulElement?.querySelector('li');

    expect(navElement).toBeInTheDocument();
    expect(ulElement).toBeInTheDocument();
    expect(liElement).toBeInTheDocument();
  });

  it('should render navigation list with flex layout', () => {
    const { container } = renderHeader();

    const navList = container.querySelector('nav ul');

    expect(navList).toHaveClass('flex', 'gap-6', 'items-center');
  });

  it('should render the tagline with correct styling', () => {
    const { getByText } = renderHeader();

    const tagline = getByText(/Descubre las últimas innovaciones en tecnología/i);

    expect(tagline).toHaveClass('text-sm', 'text-gray-700', 'max-w-2xl');
    expect(tagline.tagName).toBe('P');
  });

  it('should render the tagline container with correct spacing', () => {
    const { container } = renderHeader();

    const taglineContainer = container.querySelector('.mt-4');

    expect(taglineContainer).toBeInTheDocument();
  });

  it('should have semantic HTML structure', () => {
    const { container } = renderHeader();

    // Check for header > container > flex layout structure
    const headerElement = container.querySelector('header');
    const containerDiv = headerElement?.querySelector('.container');
    const flexDiv = containerDiv?.querySelector('.flex');

    expect(headerElement).toBeInTheDocument();
    expect(containerDiv).toBeInTheDocument();
    expect(flexDiv).toBeInTheDocument();
  });

  it('should render logo as a clickable link', () => {
    const { container } = renderHeader();

    // Find the logo link by checking for the link that contains the logo div
    const logoDiv = container.querySelector('.text-3xl.font-bold.text-gray-900');
    const logoLink = logoDiv?.closest('a');

    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should render multiple links pointing to home', () => {
    const { getAllByRole } = renderHeader();

    const links = getAllByRole('link');

    // Should have at least 2 links (logo link and navigation link)
    expect(links.length).toBeGreaterThanOrEqual(2);

    // All links should point to home
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('should render the logo with proper structure', () => {
    const { container } = renderHeader();

    // Find the logo div
    const logoDiv = container.querySelector('.text-3xl.font-bold.text-gray-900');

    expect(logoDiv).toBeInTheDocument();

    // Check that it contains both CES and 2026
    const spanElement = logoDiv?.querySelector('span');
    expect(spanElement).toBeInTheDocument();
    expect(spanElement).toHaveTextContent('2026');
  });

  it('should render navigation items with proper spacing', () => {
    const { container } = renderHeader();

    const navList = container.querySelector('nav ul');

    // Check for gap-6 between navigation items
    expect(navList).toHaveClass('gap-6');
  });
});
