import { GET } from './route';
import { revalidatePath } from 'next/cache';

// Mock Next.js modules
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

describe('Revalidate API Route', () => {
  const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;
  const validToken = 'test-secret-token';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_REVALIDATE_PATH_SECRET = validToken;
  });

  afterEach(() => {
    delete process.env.NEXT_REVALIDATE_PATH_SECRET;
  });

  const createMockRequest = (searchParams: Record<string, string>) => {
    const url = new URL('/api/revalidate', 'http://localhost:3000');
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return {
      nextUrl: {
        searchParams: url.searchParams,
      },
    } as any;
  };

  it('should return 401 when token is missing', async () => {
    const request = createMockRequest({});

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Token inválido' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', async () => {
    const request = createMockRequest({ token: 'wrong-token' });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Token inválido' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('should revalidate specified path with valid token', async () => {
    const testPath = '/articles/test-article';
    const request = createMockRequest({
      token: validToken,
      path: testPath,
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      revalidated: true,
      now: expect.any(Number),
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith(testPath);
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
  });

  it('should revalidate root path when path parameter is not provided', async () => {
    const request = createMockRequest({ token: validToken });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      revalidated: true,
      now: expect.any(Number),
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/sitemap.xml');
    expect(mockRevalidatePath).toHaveBeenCalledTimes(2);
  });

  it('should return 500 when revalidatePath throws an error', async () => {
    const testPath = '/articles/test-article';
    const request = createMockRequest({
      token: validToken,
      path: testPath,
    });

    mockRevalidatePath.mockImplementationOnce(() => {
      throw new Error('Revalidation failed');
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ message: 'Error revalidando' });
    expect(mockRevalidatePath).toHaveBeenCalledWith(testPath);
  });

  it('should return timestamp in response on successful revalidation', async () => {
    const request = createMockRequest({
      token: validToken,
      path: '/test',
    });

    const beforeTime = Date.now();
    const response = await GET(request);
    const afterTime = Date.now();
    const data = await response.json();

    expect(data.now).toBeGreaterThanOrEqual(beforeTime);
    expect(data.now).toBeLessThanOrEqual(afterTime);
  });

  it('should handle multiple paths with valid token', async () => {
    const paths = ['/path1', '/path2', '/path3'];

    for (const path of paths) {
      const request = createMockRequest({
        token: validToken,
        path,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
    }

    expect(mockRevalidatePath).toHaveBeenCalledTimes(paths.length);
    paths.forEach((path) => {
      expect(mockRevalidatePath).toHaveBeenCalledWith(path);
    });
  });

  it('should not revalidate when secret environment variable is undefined', async () => {
    delete process.env.NEXT_REVALIDATE_PATH_SECRET;

    const request = createMockRequest({
      token: 'any-token',
      path: '/test',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Token inválido' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
