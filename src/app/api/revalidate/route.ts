import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const secret = process.env.NEXT_REVALIDATE_PATH_SECRET;

  if (token !== secret) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  try {
    const path = request.nextUrl.searchParams.get('path');
    revalidatePath(path || '/');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidando' }, { status: 500 });
  }
}