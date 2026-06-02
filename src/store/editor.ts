import { create } from 'zustand';
import { Page, BlockInstance } from '../types/blocks';

type EditorStore = {
  page: Page;
  selectedBlockId: string | null;
  selectBlock: (id: string | null) => void;
  updateBlock: (id: string, data: any) => void;
  setPage: (p: Page) => void;
};

const initialPage: Page = {
  id: 'demo-page-1',
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

export const useEditorStore = create<EditorStore>((set) => ({
  page: initialPage,
  selectedBlockId: null,
  selectBlock: (id) => set(() => ({ selectedBlockId: id })),
  updateBlock: (id, data) =>
    set((state) => ({
      page: {
        ...state.page,
        blocks: state.page.blocks.map((b: BlockInstance) => (b.id === id ? { ...b, data } : b)),
      },
    })),
  setPage: (p) => set(() => ({ page: p })),
}));

export default useEditorStore;
