import { create } from 'zustand';
import { Page, BlockInstance } from '../types/blocks';

const STORAGE_KEY = 'page-builder:mvp:demo';

type EditorStore = {
  page: Page;
  selectedBlockId: string | null;
  selectBlock: (id: string | null) => void;
  updateBlock: (id: string, data: any) => void;
  addBlock: (type: string, data: any) => void;
  addBlockAt: (type: string, data: any, index: number) => void;
  deleteBlock: (id: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  setPage: (p: Page) => void;
};

const initialPage: Page = {
  id: 'demo-page-1',
  slug: 'demo',
  title: 'صفحه نمونه',
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

const parseStoredPage = (value: string | null): Page | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.id === 'string' &&
      typeof parsed.slug === 'string' &&
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.blocks)
    ) {
      return parsed as Page;
    }
    return null;
  } catch {
    return null;
  }
};

const savePageToStorage = (page: Page) => {
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
      const nextPage: Page = {
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
      const nextPage: Page = {
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
      const nextPage: Page = {
        ...state.page,
        blocks: nextBlocks,
      };
      savePageToStorage(nextPage);
      return { page: nextPage, selectedBlockId: newBlock.id };
    }),
  deleteBlock: (id) =>
    set((state) => {
      const nextPage: Page = {
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
      const nextPage: Page = { ...state.page, blocks: nextBlocks };
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
      const nextPage: Page = { ...state.page, blocks: nextBlocks };
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
