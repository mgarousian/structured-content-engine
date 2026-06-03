import 'server-only';

import { fileSystemDocumentAdapter, getBlogDocumentBySlug, listBlogDocumentsFromFileSystem } from '@/src/core/storage/fileSystemDocumentAdapter';
import type { ContentDocument } from '@/src/types/blocks';
import type { DocumentMetadata } from '@/src/core/storage/documentStorage';

export const listBlogDocumentSummaries = async (): Promise<DocumentMetadata[]> => {
  return fileSystemDocumentAdapter.listDocuments('blog');
};

export const getBlogDocumentById = async (id: string): Promise<ContentDocument | null> => {
  return fileSystemDocumentAdapter.getDocument('blog', id);
};

export const getPublishedBlogDocumentBySlug = async (slug: string): Promise<ContentDocument | null> => {
  const document = await getBlogDocumentBySlug(slug);
  if (!document || document.status !== 'published') return null;
  return document;
};

export const listPublishedBlogSummaries = async (): Promise<DocumentMetadata[]> => {
  const documents = await listBlogDocumentsFromFileSystem();
  return documents
    .filter((document) => document.status === 'published')
    .map((document) => ({
      id: document.id,
      title: document.title,
      slug: document.slug,
      ...(document.excerpt ? { excerpt: document.excerpt } : {}),
      status: document.status,
      ...(document.publishedAt ? { publishedAt: document.publishedAt } : {}),
      ...(document.createdAt ? { createdAt: document.createdAt } : {}),
      ...(document.updatedAt ? { updatedAt: document.updatedAt } : {}),
    }));
};
