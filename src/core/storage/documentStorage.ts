import type { ContentDocument, ContentStatus } from '@/src/types/blocks';
import { localStorageDocumentAdapter, parseLocalStorageDocument } from './localStorageDocumentAdapter';
import type { ContentModule, DocumentSummary } from './types';

export type DocumentMetadata = DocumentSummary;

const parseDocumentKey = (value: string) => {
  const match = /^content-engine:doc:([^:]+):([^:]+)$/.exec(value);
  if (!match) return null;
  return { moduleKey: match[1] as ContentModule, id: match[2] };
};

const activeAdapter = localStorageDocumentAdapter;

export const listDocuments = (moduleKey: ContentModule): DocumentMetadata[] => {
  return activeAdapter.listDocuments(moduleKey);
};

export const getDocument = (moduleKey: ContentModule, id: string): ContentDocument | null => {
  return activeAdapter.getDocument(moduleKey, id);
};

export const getDocumentByKey = (storageKey: string): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  const parsedKey = parseDocumentKey(storageKey);
  if (parsedKey) {
    return getDocument(parsedKey.moduleKey, parsedKey.id);
  }
  return parseLocalStorageDocument(localStorage.getItem(storageKey));
};

export const saveDocument = (_moduleKey: ContentModule, document: ContentDocument): ContentDocument | null => {
  return activeAdapter.saveDocument(document);
};

export const saveDocumentByKey = (storageKey: string, document: ContentDocument): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  const parsedKey = parseDocumentKey(storageKey);
  if (parsedKey) {
    return saveDocument(parsedKey.moduleKey, document);
  }

  const storedDocument = {
    ...document,
    createdAt: document.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(storedDocument));
    return storedDocument;
  } catch {
    return null;
  }
};

export const createDocument = (moduleKey: ContentModule, document: ContentDocument): ContentDocument | null => {
  return saveDocument(moduleKey, document);
};

export const deleteDocument = (moduleKey: ContentModule, id: string) => {
  activeAdapter.deleteDocument(moduleKey, id);
};

export const updateDocumentStatus = (
  moduleKey: ContentModule,
  id: string,
  status: ContentStatus
): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  const document = getDocument(moduleKey, id);
  if (!document) return null;

  const publishedAt =
    status === 'published' && !document.publishedAt
      ? new Date().toISOString()
      : document.publishedAt;

  const updatedDocument: ContentDocument = {
    ...document,
    status,
    publishedAt: status === 'published' ? publishedAt : document.publishedAt,
  };

  return activeAdapter.saveDocument(updatedDocument);
};
