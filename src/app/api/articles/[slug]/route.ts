import { NextResponse } from 'next/server';
import { articles } from '../route';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
  }

  return NextResponse.json(article);
}
