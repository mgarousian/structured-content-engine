import 'server-only';

import { mkdir, readFile, readdir, rm, writeFile } from 'fs/promises';
import path from 'path';
import type { ContentDocument, ContentStatus } from '@/src/types/blocks';
import type { DocumentStorageAdapter, DocumentSummary } from './types';

// This adapter is intended for local/self-hosted workflows where the app can
// read and write the project filesystem. It is not durable on serverless
// platforms such as Vercel.
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

type StoredBlogDocument = ContentDocument & {
  module: 'blog';
};

const isValidContentStatus = (value: any): value is ContentStatus =>
  ['draft', 'review', 'scheduled', 'published'].includes(value);

const isValidDocument = (value: any): value is ContentDocument => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    value.contentType === 'blogPost' &&
    typeof value.status === 'string' &&
    isValidContentStatus(value.status) &&
    Array.isArray(value.blocks)
  );
};

const ensureBlogDirectory = async () => {
  await mkdir(BLOG_CONTENT_DIR, { recursive: true });
};

const getFilePathForSlug = (slugOrId: string) => path.join(BLOG_CONTENT_DIR, `${slugOrId}.json`);

const toStoredDocument = (document: ContentDocument): StoredBlogDocument => ({
  ...document,
  module: 'blog',
  createdAt: document.createdAt ?? new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const toSummary = (document: ContentDocument): DocumentSummary => ({
  id: document.id,
  title: document.title,
  slug: document.slug,
  ...(document.excerpt ? { excerpt: document.excerpt } : {}),
  status: document.status,
  ...(document.publishedAt ? { publishedAt: document.publishedAt } : {}),
  ...(document.createdAt ? { createdAt: document.createdAt } : {}),
  ...(document.updatedAt ? { updatedAt: document.updatedAt } : {}),
});

const readBlogFile = async (filePath: string): Promise<ContentDocument | null> => {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return isValidDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const readAllBlogDocuments = async (): Promise<ContentDocument[]> => {
  await ensureBlogDirectory();
  const entries = await readdir(BLOG_CONTENT_DIR, { withFileTypes: true });
  const documents = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => readBlogFile(path.join(BLOG_CONTENT_DIR, entry.name)))
  );
  return documents.filter((document): document is ContentDocument => Boolean(document));
};

export const fileSystemDocumentAdapter: DocumentStorageAdapter = {
  async listDocuments(module) {
    if (module !== 'blog') return [];
    const documents = await readAllBlogDocuments();
    return documents.map(toSummary);
  },

  async getDocument(module, id) {
    if (module !== 'blog') return null;
    const documents = await readAllBlogDocuments();
    return documents.find((document) => document.id === id) ?? null;
  },

  async saveDocument(document) {
    if (document.contentType !== 'blogPost') return null;
    await ensureBlogDirectory();
    const existingDocuments = await readAllBlogDocuments();
    const previousDocument = existingDocuments.find((entry) => entry.id === document.id) ?? null;
    const storedDocument = toStoredDocument({
      ...document,
      createdAt: document.createdAt ?? previousDocument?.createdAt,
    });

    if (previousDocument) {
      const previousFilePath = getFilePathForSlug(previousDocument.slug || previousDocument.id);
      const nextFilePath = getFilePathForSlug(storedDocument.slug || storedDocument.id);
      if (previousFilePath !== nextFilePath) {
        await rm(previousFilePath, { force: true });
      }
    }

    const filePath = getFilePathForSlug(storedDocument.slug || storedDocument.id);
    await writeFile(filePath, JSON.stringify(storedDocument, null, 2), 'utf8');
    return storedDocument;
  },

  async deleteDocument(module, id) {
    if (module !== 'blog') return;
    const document = await this.getDocument(module, id);
    if (!document) return;
    const filePath = getFilePathForSlug(document.slug || document.id);
    await rm(filePath, { force: true });
  },
};

export const getBlogDocumentBySlug = async (slug: string): Promise<ContentDocument | null> => {
  const documents = await readAllBlogDocuments();
  return documents.find((document) => document.slug === slug) ?? null;
};

export const listBlogDocumentsFromFileSystem = async (): Promise<ContentDocument[]> => {
  return readAllBlogDocuments();
};
