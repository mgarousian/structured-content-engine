import { create } from 'zustand';
import { ContentDocument, ContentType, ContentStatus, BlockInstance } from '../types/blocks';

let STORAGE_KEY = 'page-builder:mvp:demo';

export const setStorageKey = (key: string) => {
  STORAGE_KEY = key;
};

type EditorStore = {
  page: ContentDocument;
  selectedBlockId: string | null;
  selectBlock: (id: string | null) => void;
  updateBlock: (id: string, data: any) => void;
  addBlock: (type: string, data: any) => void;
  addBlockAt: (type: string, data: any, index: number) => void;
  deleteBlock: (id: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  setPage: (p: ContentDocument) => void;
};

const initialPage: ContentDocument = {
  id: 'demo-page-1',
  slug: 'demo',
  title: 'صفحه نمونه',
  contentType: 'blogPost',
  status: 'draft',
  blocks: [
    {
      id: 'block-1',
      type: 'heading',
      data: {
        text: 'عنوان اصلی صفحه',
        level: 'h1',
      },
    },
    {
      id: 'block-2',
      type: 'paragraph',
      data: {
        text: 'این یک پاراگراف نمونه برای محتوای صفحه است.',
      },
    },
  ],
};

const isContentType = (value: any): value is ContentType => value === 'blogPost' || value === 'landingPage';
const isContentStatus = (value: any): value is ContentStatus => ['draft', 'review', 'scheduled', 'published'].includes(value);

const parseStoredPage = (value: string | null): ContentDocument | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.id === 'string' &&
      typeof parsed.slug === 'string' &&
      typeof parsed.title === 'string' &&
      typeof parsed.contentType === 'string' &&
      isContentType(parsed.contentType) &&
      typeof parsed.status === 'string' &&
      isContentStatus(parsed.status) &&
      Array.isArray(parsed.blocks)
    ) {
      return parsed as ContentDocument;
    }
    return null;
  } catch {
    return null;
  }
};

const savePageToStorage = (page: ContentDocument) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(page));
  } catch {
    // ignore write errors
  }
};

const createBlockId = () =>
  `block-${typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;

export const useEditorStore = create<EditorStore>((set) => ({
  page: initialPage,
  selectedBlockId: null,
  selectBlock: (id) => set(() => ({ selectedBlockId: id })),
  updateBlock: (id, data) =>
    set((state) => {
      const nextPage: ContentDocument = {
        ...state.page,
        blocks: state.page.blocks.map((b: BlockInstance) => (b.id === id ? { ...b, data } : b)),
      };
      savePageToStorage(nextPage);
      return { page: nextPage };
    }),
  addBlock: (type, data) =>
    set((state) => {
      const newBlock = {
        id: createBlockId(),
        type,
        data,
      };
      const nextPage: ContentDocument = {
        ...state.page,
        blocks: [...state.page.blocks, newBlock],
      };
      savePageToStorage(nextPage);
      return { page: nextPage, selectedBlockId: newBlock.id };
    }),
  addBlockAt: (type, data, index) =>
    set((state) => {
      const newBlock = {
        id: createBlockId(),
        type,
        data,
      };
      const nextBlocks = [...state.page.blocks];
      const insertIndex = Math.max(0, Math.min(index, nextBlocks.length));
      nextBlocks.splice(insertIndex, 0, newBlock);
      const nextPage: ContentDocument = {
        ...state.page,
        blocks: nextBlocks,
      };
      savePageToStorage(nextPage);
      return { page: nextPage, selectedBlockId: newBlock.id };
    }),
  deleteBlock: (id) =>
    set((state) => {
      const nextPage: ContentDocument = {
        ...state.page,
        blocks: state.page.blocks.filter((b: BlockInstance) => b.id !== id),
      };
      savePageToStorage(nextPage);
      return {
        page: nextPage,
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    }),
  moveBlockUp: (id) =>
    set((state) => {
      const idx = state.page.blocks.findIndex((b: BlockInstance) => b.id === id);
      if (idx <= 0) return state;
      const nextBlocks = [...state.page.blocks];
      const tmp = nextBlocks[idx - 1];
      nextBlocks[idx - 1] = nextBlocks[idx];
      nextBlocks[idx] = tmp;
      const nextPage: ContentDocument = { ...state.page, blocks: nextBlocks };
      savePageToStorage(nextPage);
      return { page: nextPage };
    }),
  moveBlockDown: (id) =>
    set((state) => {
      const idx = state.page.blocks.findIndex((b: BlockInstance) => b.id === id);
      if (idx < 0 || idx >= state.page.blocks.length - 1) return state;
      const nextBlocks = [...state.page.blocks];
      const tmp = nextBlocks[idx + 1];
      nextBlocks[idx + 1] = nextBlocks[idx];
      nextBlocks[idx] = tmp;
      const nextPage: ContentDocument = { ...state.page, blocks: nextBlocks };
      savePageToStorage(nextPage);
      return { page: nextPage };
    }),
  setPage: (p) => {
    savePageToStorage(p);
    return set(() => ({ page: p }));
  },
}));

export const loadPageFromStorage = () => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  const page = parseStoredPage(stored);
  if (page) {
    useEditorStore.getState().setPage(page);
  }
};

export default useEditorStore;
