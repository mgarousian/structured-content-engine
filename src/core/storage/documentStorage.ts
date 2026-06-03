import type { ContentDocument, ContentStatus } from '@/src/types/blocks';

export type DocumentMetadata = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  updatedAt?: string;
};

const DOCUMENT_KEY_PREFIX = 'content-engine:doc';
const INDEX_KEY_PREFIX = 'content-engine:index';

const makeDocumentKey = (moduleKey: string, id: string) => `${DOCUMENT_KEY_PREFIX}:${moduleKey}:${id}`;
const makeIndexKey = (moduleKey: string) => `${INDEX_KEY_PREFIX}:${moduleKey}`;

const parseDocumentKey = (value: string) => {
  const match = /^content-engine:doc:([^:]+):([^:]+)$/.exec(value);
  if (!match) return null;
  return { moduleKey: match[1], id: match[2] };
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
    typeof value.contentType === 'string' &&
    typeof value.status === 'string' &&
    isValidContentStatus(value.status) &&
    Array.isArray(value.blocks)
  );
};

const isValidMetadata = (value: any): value is DocumentMetadata => {
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

const parseIndex = (raw: string | null): DocumentMetadata[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMetadata);
  } catch {
    return [];
  }
};

const saveIndex = (moduleKey: string, entries: DocumentMetadata[]) => {
  try {
    localStorage.setItem(makeIndexKey(moduleKey), JSON.stringify(entries));
  } catch {
    // ignore write errors
  }
};

const updateIndexEntry = (moduleKey: string, document: ContentDocument) => {
  const entries = listDocuments(moduleKey).filter((item) => item.id !== document.id);
  const metadata: DocumentMetadata = {
    id: document.id,
    title: document.title,
    slug: document.slug,
    status: document.status,
    updatedAt: new Date().toISOString(),
  };
  entries.push(metadata);
  saveIndex(moduleKey, entries);
};

const removeIndexEntry = (moduleKey: string, id: string) => {
  const entries = listDocuments(moduleKey).filter((item) => item.id !== id);
  saveIndex(moduleKey, entries);
};

export const listDocuments = (moduleKey: string): DocumentMetadata[] => {
  if (typeof window === 'undefined') return [];
  return parseIndex(localStorage.getItem(makeIndexKey(moduleKey)));
};

export const getDocument = (moduleKey: string, id: string): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  return parseDocument(localStorage.getItem(makeDocumentKey(moduleKey, id)));
};

export const getDocumentByKey = (storageKey: string): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  const parsedKey = parseDocumentKey(storageKey);
  if (parsedKey) {
    return getDocument(parsedKey.moduleKey, parsedKey.id);
  }
  return parseDocument(localStorage.getItem(storageKey));
};

export const saveDocument = (moduleKey: string, document: ContentDocument): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  const storedDocument = {
    ...document,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(makeDocumentKey(moduleKey, document.id), JSON.stringify(storedDocument));
    updateIndexEntry(moduleKey, storedDocument);
    return storedDocument;
  } catch {
    return null;
  }
};

export const saveDocumentByKey = (storageKey: string, document: ContentDocument): ContentDocument | null => {
  if (typeof window === 'undefined') return null;
  const parsedKey = parseDocumentKey(storageKey);
  if (parsedKey) {
    return saveDocument(parsedKey.moduleKey, document);
  }

  const storedDocument = {
    ...document,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(storageKey, JSON.stringify(storedDocument));
    return storedDocument;
  } catch {
    return null;
  }
};

export const createDocument = (moduleKey: string, document: ContentDocument): ContentDocument | null => {
  return saveDocument(moduleKey, document);
};

export const deleteDocument = (moduleKey: string, id: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(makeDocumentKey(moduleKey, id));
    removeIndexEntry(moduleKey, id);
  } catch {
    // ignore
  }
};
