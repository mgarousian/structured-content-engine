import { NextResponse } from 'next/server';
import { fileSystemDocumentAdapter } from '@/src/core/storage/fileSystemDocumentAdapter';
import type { ContentDocument } from '@/src/types/blocks';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const isBlogDocument = (value: any): value is ContentDocument => {
  return (
    value &&
    typeof value === 'object' &&
    value.contentType === 'blogPost' &&
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    Array.isArray(value.blocks)
  );
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const document = await fileSystemDocumentAdapter.getDocument('blog', id);
  if (!document) {
    return NextResponse.json({ error: 'Blog document not found' }, { status: 404 });
  }
  return NextResponse.json(document);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json();
  if (!isBlogDocument(payload) || payload.id !== id) {
    return NextResponse.json({ error: 'Invalid blog document payload' }, { status: 400 });
  }

  const storedDocument = await fileSystemDocumentAdapter.saveDocument(payload);
  if (!storedDocument) {
    return NextResponse.json({ error: 'Failed to save blog document' }, { status: 500 });
  }

  return NextResponse.json(storedDocument);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await fileSystemDocumentAdapter.deleteDocument('blog', id);
  return new NextResponse(null, { status: 204 });
}
