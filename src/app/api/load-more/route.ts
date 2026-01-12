import { NextRequest, NextResponse } from 'next/server';
import { getArticlesFromAPI } from '@/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  try {
    const articles = await getArticlesFromAPI(page);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error in load-more API:', error);
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}
