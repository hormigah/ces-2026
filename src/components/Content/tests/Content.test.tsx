import { renderComponent } from '@/tests';
import Content, { type ContentProps } from '../Content';

describe('Content Component', () => {
  const defaultProps: ContentProps = {
    children: <div>Test</div>,
  };

  const renderContent = (props: Partial<ContentProps> = {}) => {
    return renderComponent(<Content {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children correctly', () => {
    const { getByText } = renderComponent(
      <Content>
        <h1>Test Content</h1>
      </Content>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should render multiple children elements', () => {
    const { getByText } = renderComponent(
      <Content>
        <h1>Title</h1>
        <p>Paragraph</p>
        <div>Content</div>
      </Content>
    );

    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Paragraph')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
  });

  it('should render as a main element with correct role', () => {
    const { getByRole } = renderContent();

    const mainElement = getByRole('main');

    expect(mainElement).toBeInTheDocument();
    expect(mainElement.tagName).toBe('MAIN');
  });

  it('should have correct styling classes on main element', () => {
    const { getByRole } = renderContent();

    const mainElement = getByRole('main');

    // Check if main element has the correct classes
    expect(mainElement).toHaveClass('grow', 'bg-gray-50');
  });

  it('should have correct container styling classes', () => {
    const { container } = renderContent();

    // Find the container div
    const containerDiv = container.querySelector('.container.mx-auto');

    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
  });

  it('should render with correct layout structure', () => {
    const { container, getByRole } = renderContent();

    const mainElement = getByRole('main');
    const containerDiv = container.querySelector('.container') as HTMLElement;

    // Main should contain the container div
    expect(mainElement).toContainElement(containerDiv);
  });

  it('should render text content correctly', () => {
    const testText = 'This is a test paragraph with some content';

    const { getByText } = renderComponent(
      <Content>
        <p>{testText}</p>
      </Content>
    );

    expect(getByText(testText)).toBeInTheDocument();
  });

  it('should render complex nested children', () => {
    const { getByText, getByTestId } = renderComponent(
      <Content>
        <div data-testid="wrapper">
          <section>
            <h1>Main Title</h1>
            <article>
              <h2>Article Title</h2>
              <p>Article content</p>
            </article>
          </section>
        </div>
      </Content>
    );

    expect(getByTestId('wrapper')).toBeInTheDocument();
    expect(getByText('Main Title')).toBeInTheDocument();
    expect(getByText('Article Title')).toBeInTheDocument();
    expect(getByText('Article content')).toBeInTheDocument();
  });

  it('should render without errors when children is empty', () => {
    const { getByRole } = renderComponent(<Content>{null}</Content>);

    const mainElement = getByRole('main');

    expect(mainElement).toBeInTheDocument();
  });

  it('should render React fragments as children', () => {
    const { getByText } = renderComponent(
      <Content>
        <>
          <h1>Fragment Title</h1>
          <p>Fragment Paragraph</p>
        </>
      </Content>
    );

    expect(getByText('Fragment Title')).toBeInTheDocument();
    expect(getByText('Fragment Paragraph')).toBeInTheDocument();
  });

  it('should maintain semantic HTML structure', () => {
    const { container } = renderComponent(
      <Content>
        <h1>Title</h1>
      </Content>
    );

    // Check if the structure is: main > div > children
    const mainElement = container.querySelector('main');
    const innerDiv = mainElement?.querySelector('div');

    expect(mainElement).toBeInTheDocument();
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv?.querySelector('h1')).toBeInTheDocument();
  });

  it('should apply responsive container classes', () => {
    const { container } = renderContent();

    const containerDiv = container.querySelector('.container');

    // Check for responsive utility classes
    expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'py-8');
  });
});
