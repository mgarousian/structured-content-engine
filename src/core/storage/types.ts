import type { ModuleKey } from '@/src/modules/registry';
import type { ContentDocument, ContentStatus } from '@/src/types/blocks';

export type ContentModule = ModuleKey;

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
  listDocuments(module: ContentModule): DocumentSummary[];
  getDocument(module: ContentModule, id: string): ContentDocument | null;
  saveDocument(document: ContentDocument): ContentDocument | null;
  deleteDocument(module: ContentModule, id: string): void;
};
