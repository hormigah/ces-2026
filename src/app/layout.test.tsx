import { renderComponent } from '@/tests';
import RootLayout, { metadata } from './layout';

// Mock Google Fonts
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
    subsets: ['latin'],
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
    subsets: ['latin'],
  })),
}));

// Mock child components to avoid testing their internal logic
jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="children">Test Children</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('should render Header component', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      expect(getByTestId('header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      expect(getByTestId('footer')).toBeInTheDocument();
    });

    it('should render children content', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      expect(getByTestId('children')).toBeInTheDocument();
      expect(getByTestId('children')).toHaveTextContent('Test Children');
    });

    it('should render Header, children, and Footer', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      expect(getByTestId('header')).toBeInTheDocument();
      expect(getByTestId('children')).toBeInTheDocument();
      expect(getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Children rendering', () => {
    it('should render simple text children', () => {
      const { getByText } = renderComponent(
        <RootLayout>
          <div>Simple Text</div>
        </RootLayout>
      );

      expect(getByText('Simple Text')).toBeInTheDocument();
    });

    it('should render complex component children', () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      );

      const { getByTestId, getByText } = renderComponent(
        <RootLayout>
          <ComplexChild />
        </RootLayout>
      );

      expect(getByTestId('complex-child')).toBeInTheDocument();
      expect(getByText('Title')).toBeInTheDocument();
      expect(getByText('Paragraph')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      const { getByText } = renderComponent(
        <RootLayout>
          <div>First Child</div>
          <div>Second Child</div>
        </RootLayout>
      );

      expect(getByText('First Child')).toBeInTheDocument();
      expect(getByText('Second Child')).toBeInTheDocument();
    });

    it('should render fragments as children', () => {
      const { getByText } = renderComponent(
        <RootLayout>
          <>
            <div>Fragment Child 1</div>
            <div>Fragment Child 2</div>
          </>
        </RootLayout>
      );

      expect(getByText('Fragment Child 1')).toBeInTheDocument();
      expect(getByText('Fragment Child 2')).toBeInTheDocument();
    });

    it('should handle nested children components', () => {
      const { getByTestId } = renderComponent(
        <RootLayout>
          <div data-testid="parent">
            <div data-testid="nested-child">Nested Content</div>
          </div>
        </RootLayout>
      );

      expect(getByTestId('parent')).toBeInTheDocument();
      expect(getByTestId('nested-child')).toBeInTheDocument();
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic header element for Header', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      expect(header.tagName).toBe('HEADER');
    });

    it('should use semantic footer element for Footer', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const footer = getByTestId('footer');
      expect(footer.tagName).toBe('FOOTER');
    });

    it('should have proper landmark elements', () => {
      const { container } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      // Header and Footer serve as landmark elements
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should render Header before children', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      const children = getByTestId('children');

      // Compare DOM positions
      expect(header.compareDocumentPosition(children)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should render Footer after children', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const children = getByTestId('children');
      const footer = getByTestId('footer');

      // Compare DOM positions
      expect(children.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe('Metadata', () => {
    it('should export metadata object', () => {
      expect(metadata).toBeDefined();
      expect(typeof metadata).toBe('object');
    });

    it('should have correct title in metadata', () => {
      expect(metadata.title).toBe(
        'Últimas Noticias, Lanzamientos y Tendencias Tecnológicas - CES 2026'
      );
    });

    it('should have correct description in metadata', () => {
      expect(metadata.description).toBe(
        'Sigue en vivo la cobertura del CES 2026. Descubre las innovaciones más impactantes en IA, robótica y gadgets que están definiendo el futuro de la tecnología.'
      );
    });

    it('should have SEO-friendly title', () => {
      expect(metadata.title).toBeTruthy();
      expect(typeof metadata.title).toBe('string');
      expect((metadata.title as string).length).toBeGreaterThan(0);
      expect((metadata.title as string).length).toBeLessThan(200);
    });

    it('should have SEO-friendly description', () => {
      expect(metadata.description).toBeTruthy();
      expect(typeof metadata.description).toBe('string');
      expect((metadata.description as string).length).toBeGreaterThan(50);
      expect((metadata.description as string).length).toBeLessThan(300);
    });

    it('should include brand name in title', () => {
      expect(metadata.title).toContain('CES 2026');
    });

    it('should include relevant keywords in description', () => {
      const description = metadata.description as string;
      expect(description.toLowerCase()).toMatch(/ces|tecnología|innovaciones/);
    });
  });

  describe('Layout structure', () => {
    it('should render Header as first element', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      const children = getByTestId('children');

      // Header should come before children
      expect(header.compareDocumentPosition(children)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should render Footer as last element', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const children = getByTestId('children');
      const footer = getByTestId('footer');

      // Children should come before footer
      expect(children.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('should maintain correct component order', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      const children = getByTestId('children');
      const footer = getByTestId('footer');

      // Verify order by comparing positions
      expect(header.compareDocumentPosition(children)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(children.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe('Component integration', () => {
    it('should integrate Header component', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      expect(header).toHaveTextContent('Header');
    });

    it('should integrate Footer component', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const footer = getByTestId('footer');
      expect(footer).toHaveTextContent('Footer');
    });

    it('should pass children to layout', () => {
      const customChild = <div data-testid="custom">Custom Content</div>;
      const { getByTestId } = renderComponent(<RootLayout>{customChild}</RootLayout>);

      expect(getByTestId('custom')).toHaveTextContent('Custom Content');
    });

    it('should render all components without errors', () => {
      const { container } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      expect(container).toBeInTheDocument();
      expect(container.querySelector('[data-testid="header"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="children"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="footer"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic landmark elements', () => {
      const { container } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = container.querySelector('header');
      const footer = container.querySelector('footer');

      expect(header).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should render Header with semantic meaning', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      expect(header.tagName).toBe('HEADER');
    });

    it('should render Footer with semantic meaning', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const footer = getByTestId('footer');
      expect(footer.tagName).toBe('FOOTER');
    });
  });

  describe('Content wrapping', () => {
    it('should wrap page content between Header and Footer', () => {
      const pageContent = <main data-testid="main-content">Main Content</main>;
      const { getByTestId } = renderComponent(<RootLayout>{pageContent}</RootLayout>);

      const header = getByTestId('header');
      const content = getByTestId('main-content');
      const footer = getByTestId('footer');

      expect(header).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should allow any React node as children', () => {
      const stringChild = 'String Content';
      const { getByText } = renderComponent(<RootLayout>{stringChild}</RootLayout>);

      expect(getByText('String Content')).toBeInTheDocument();
    });

    it('should render children between header and footer', () => {
      const { getByTestId } = renderComponent(<RootLayout>{mockChildren}</RootLayout>);

      const header = getByTestId('header');
      const children = getByTestId('children');
      const footer = getByTestId('footer');

      // Verify children is between header and footer
      const headerPos = header.compareDocumentPosition(children);
      const childrenPos = children.compareDocumentPosition(footer);

      expect(headerPos).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(childrenPos).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });
});
