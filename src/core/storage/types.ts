import type { ModuleKey } from '@/src/modules/registry';
import type { ContentDocument, ContentStatus } from '@/src/types/blocks';

export type ContentModule = ModuleKey;
export type Awaitable<T> = T | Promise<T>;

export type DocumentSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: ContentStatus;
  updatedAt?: string;
  publishedAt?: string;
  createdAt?: string;
};

export type DocumentStorageAdapter = {
  listDocuments(module: ContentModule): Awaitable<DocumentSummary[]>;
  getDocument(module: ContentModule, id: string): Awaitable<ContentDocument | null>;
  saveDocument(document: ContentDocument): Awaitable<ContentDocument | null>;
  deleteDocument(module: ContentModule, id: string): Awaitable<void>;
};
