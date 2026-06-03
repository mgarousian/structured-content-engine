'use client';

import type { ContentDocument } from '@/src/types/blocks';
import type { DocumentMetadata } from '@/src/core/storage/documentStorage';

const BLOG_API_BASE = '/api/blog-documents';

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Blog API request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const listBlogDocuments = async (): Promise<DocumentMetadata[]> => {
  const response = await fetch(BLOG_API_BASE, { cache: 'no-store' });
  return parseJsonResponse<DocumentMetadata[]>(response);
};

export const getBlogDocument = async (id: string): Promise<ContentDocument | null> => {
  const response = await fetch(`${BLOG_API_BASE}/${id}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  return parseJsonResponse<ContentDocument>(response);
};

export const saveBlogDocument = async (document: ContentDocument): Promise<ContentDocument> => {
  const response = await fetch(`${BLOG_API_BASE}/${document.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(document),
  });
  return parseJsonResponse<ContentDocument>(response);
};

export const createBlogDocument = async (document: ContentDocument): Promise<ContentDocument> => {
  const response = await fetch(BLOG_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(document),
  });
  return parseJsonResponse<ContentDocument>(response);
};

export const deleteBlogDocument = async (id: string): Promise<void> => {
  const response = await fetch(`${BLOG_API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Blog delete failed with status ${response.status}`);
  }
};
