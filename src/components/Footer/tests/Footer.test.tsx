import { renderComponent } from '@/tests';
import Footer from '../Footer';

describe('Footer Component', () => {
  const renderFooter = () => {
    return renderComponent(<Footer />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the footer element with correct role', () => {
    const { container } = renderFooter();

    const footerElement = container.querySelector('footer');

    expect(footerElement).toBeInTheDocument();
    expect(footerElement?.tagName).toBe('FOOTER');
  });

  it('should render the CES 2026 heading and description', () => {
    const { getByText } = renderFooter();

    expect(getByText('CES 2026')).toBeInTheDocument();
    expect(getByText(/Cobertura completa del Consumer Electronics Show 2026/i)).toBeInTheDocument();
  });

  it('should render the navigation section with correct aria-label', () => {
    const { getByRole } = renderFooter();

    const navElement = getByRole('navigation', { name: /Enlaces del pie de página/i });

    expect(navElement).toBeInTheDocument();
  });

  it('should render the navigation heading', () => {
    const { getByText } = renderFooter();

    expect(getByText('Navegación')).toBeInTheDocument();
  });

  it('should render the home link with correct href and text', () => {
    const { getByRole } = renderFooter();

    const homeLink = getByRole('link', { name: /Inicio/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render the "Sobre el CES" section', () => {
    const { getByText } = renderFooter();

    expect(getByText('Sobre el CES')).toBeInTheDocument();
    expect(
      getByText(/El Consumer Electronics Show es el evento de tecnología más influyente/i)
    ).toBeInTheDocument();
  });

  it('should render the copyright notice with current year', () => {
    const { getByText } = renderFooter();

    expect(getByText(/© 2026 CES 2026 - Cobertura informativa/i)).toBeInTheDocument();
  });

  it('should have correct styling classes on footer element', () => {
    const { container } = renderFooter();

    const footerElement = container.querySelector('footer');

    expect(footerElement).toHaveClass('border-t', 'border-gray-300', 'bg-white', 'mt-auto');
  });

  it('should have a responsive grid layout', () => {
    const { container } = renderFooter();

    const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');

    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('gap-8');
  });

  it('should render all three grid columns', () => {
    const { container } = renderFooter();

    const gridContainer = container.querySelector('.grid');
    const gridItems = gridContainer?.children;

    expect(gridItems).toHaveLength(3);
  });

  it('should render navigation links with underline offset styling', () => {
    const { container } = renderFooter();

    // Find the Link component's className in the source
    const linkElement = container.querySelector('nav a');

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');
  });

  it('should have a container with correct padding and margin classes', () => {
    const { container } = renderFooter();

    const containerDiv = container.querySelector('.container.mx-auto');

    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('px-4', 'py-8');
  });

  it('should render headings with correct hierarchy', () => {
    const { container } = renderFooter();

    const h2Elements = container.querySelectorAll('h2');

    // Should have 3 h2 elements
    expect(h2Elements).toHaveLength(3);

    // Check the text content of each heading
    expect(h2Elements[0]).toHaveTextContent('CES 2026');
    expect(h2Elements[1]).toHaveTextContent('Navegación');
    expect(h2Elements[2]).toHaveTextContent('Sobre el CES');
  });

  it('should render the copyright section with border separator', () => {
    const { container } = renderFooter();

    const copyrightSection = container.querySelector('.mt-8.pt-6.border-t');

    expect(copyrightSection).toBeInTheDocument();
    expect(copyrightSection).toHaveClass('border-gray-300');
  });

  it('should center align the copyright text', () => {
    const { getByText } = renderFooter();

    const copyrightText = getByText(/© 2026 CES 2026/i);

    expect(copyrightText).toHaveClass('text-center');
  });

  it('should have semantic HTML structure with navigation list', () => {
    const { container } = renderFooter();

    const navElement = container.querySelector('nav');
    const ulElement = navElement?.querySelector('ul');
    const liElement = ulElement?.querySelector('li');

    expect(navElement).toBeInTheDocument();
    expect(ulElement).toBeInTheDocument();
    expect(liElement).toBeInTheDocument();
  });

  it('should render navigation list with correct spacing', () => {
    const { container } = renderFooter();

    const navList = container.querySelector('nav ul');

    expect(navList).toHaveClass('space-y-2');
  });

  it('should render text with appropriate font sizes and colors', () => {
    const { getByText } = renderFooter();

    const mainHeading = getByText('CES 2026');
    const description = getByText(/Cobertura completa del Consumer Electronics Show 2026/i);

    expect(mainHeading).toHaveClass('text-lg', 'font-bold', 'text-gray-900');
    expect(description).toHaveClass('text-sm', 'text-gray-700');
  });
});
