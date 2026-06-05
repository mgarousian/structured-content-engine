import { getModuleConfig } from '@/src/modules/registry';
import type { ContentDocument, ContentStatus } from '@/src/types/blocks';
import type { ContentModule, DocumentStorageAdapter, DocumentSummary } from './types';

const DOCUMENT_KEY_PREFIX = 'content-engine:doc';
const INDEX_KEY_PREFIX = 'content-engine:index';

const makeDocumentKey = (moduleKey: ContentModule, id: string) => `${DOCUMENT_KEY_PREFIX}:${moduleKey}:${id}`;
const makeIndexKey = (moduleKey: ContentModule) => `${INDEX_KEY_PREFIX}:${moduleKey}`;

const isValidContentStatus = (value: any): value is ContentStatus =>
  ['draft', 'review', 'scheduled', 'published'].includes(value);

const isValidDocument = (value: any): value is ContentDocument => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string' &&
    typeof value.contentType === 'string' &&
    typeof value.status === 'string' &&
    isValidContentStatus(value.status) &&
    Array.isArray(value.blocks)
  );
};

const isValidSummary = (value: any): value is DocumentSummary => {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.status === 'string' &&
    isValidContentStatus(value.status)
  );
};

const parseDocument = (raw: string | null): ContentDocument | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isValidDocument(parsed)) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
};

const parseIndex = (raw: string | null): DocumentSummary[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSummary);
  } catch {
    return [];
  }
};

const saveIndex = (moduleKey: ContentModule, entries: DocumentSummary[]) => {
  try {
    localStorage.setItem(makeIndexKey(moduleKey), JSON.stringify(entries));
  } catch {
    // ignore write errors
  }
};

const getModuleFromDocument = (document: ContentDocument): ContentModule => {
  return getModuleConfig(document.contentType).moduleKey;
};

const toStoredDocument = (document: ContentDocument): ContentDocument => ({
  ...document,
  createdAt: document.createdAt ?? new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const toDocumentSummary = (document: ContentDocument): DocumentSummary => ({
  id: document.id,
  title: document.title,
  slug: document.slug,
  ...(document.excerpt ? { excerpt: document.excerpt } : {}),
  status: document.status,
  ...(document.publishedAt ? { publishedAt: document.publishedAt } : {}),
  ...(document.createdAt ? { createdAt: document.createdAt } : {}),
  ...(document.updatedAt ? { updatedAt: document.updatedAt } : {}),
});

const updateIndexEntry = (moduleKey: ContentModule, document: ContentDocument) => {
  const entries = localStorageDocumentAdapter.listDocuments(moduleKey).filter((item) => item.id !== document.id);
  entries.push(toDocumentSummary(document));
  saveIndex(moduleKey, entries);
};

const removeIndexEntry = (moduleKey: ContentModule, id: string) => {
  const entries = localStorageDocumentAdapter.listDocuments(moduleKey).filter((item) => item.id !== id);
  saveIndex(moduleKey, entries);
};

export const localStorageDocumentAdapter = {
  listDocuments(moduleKey) {
    if (typeof window === 'undefined') return [];
    return parseIndex(localStorage.getItem(makeIndexKey(moduleKey)));
  },

  getDocument(moduleKey, id) {
    if (typeof window === 'undefined') return null;
    return parseDocument(localStorage.getItem(makeDocumentKey(moduleKey, id)));
  },

  saveDocument(document) {
    if (typeof window === 'undefined') return null;
    const moduleKey = getModuleFromDocument(document);
    const storedDocument = toStoredDocument(document);
    try {
      localStorage.setItem(makeDocumentKey(moduleKey, document.id), JSON.stringify(storedDocument));
      updateIndexEntry(moduleKey, storedDocument);
      return storedDocument;
    } catch {
      return null;
    }
  },

  deleteDocument(moduleKey, id) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(makeDocumentKey(moduleKey, id));
      removeIndexEntry(moduleKey, id);
    } catch {
      // ignore
    }
  },
} satisfies DocumentStorageAdapter;

export const parseLocalStorageDocument = parseDocument;
export const makeLocalStorageDocumentKey = makeDocumentKey;
