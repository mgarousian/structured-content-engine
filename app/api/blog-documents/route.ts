import { NextResponse } from 'next/server';
import { fileSystemDocumentAdapter } from '@/src/core/storage/fileSystemDocumentAdapter';
import type { ContentDocument } from '@/src/types/blocks';

export const dynamic = 'force-dynamic';

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

export async function GET() {
  const documents = await fileSystemDocumentAdapter.listDocuments('blog');
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (!isBlogDocument(payload)) {
    return NextResponse.json({ error: 'Invalid blog document payload' }, { status: 400 });
  }

  const storedDocument = await fileSystemDocumentAdapter.saveDocument(payload);
  if (!storedDocument) {
    return NextResponse.json({ error: 'Failed to save blog document' }, { status: 500 });
  }

  return NextResponse.json(storedDocument, { status: 201 });
}
