import { ModuleConfig } from '../registry';
import type { ContentDocument } from '../../types/blocks';
import { ContentType } from '../../types/blocks';

const defaultDocument: ContentDocument = {
  id: 'blog-demo-page-1',
  contentType: 'blogPost',
  title: 'پست نمونه بلاگ',
  slug: 'blog-demo',
  status: 'draft',
  blocks: [
    { id: 'b1', type: 'heading', data: { text: 'عنوان پست', level: 'h1' } },
    { id: 'b2', type: 'paragraph', data: { text: 'محتوای پاراگراف نمونه برای پست بلاگ.' } },
    { id: 'b3', type: 'image', data: { src: 'https://via.placeholder.com/800x300', alt: 'تصویر نمونه', caption: 'تصویر بلاگ' } },
  ],
};

const createDefaultDocument = (id: string): ContentDocument => ({
  ...defaultDocument,
  id: `blog-${id}`,
  slug: id,
  blocks: defaultDocument.blocks.map((block) => ({
    ...block,
    data: { ...block.data },
  })),
});

const config: ModuleConfig = {
  moduleKey: 'blog',
  contentType: 'blogPost' as ContentType,
  label: 'Blog Post',
  persianLabel: 'پست بلاگ',
  labelFa: 'پست بلاگ',
  allowedBlocks: ['heading', 'paragraph', 'image'],
  storageKey: 'page-builder:mvp:blog-demo',
  defaultDocument,
  createDefaultDocument,
};

export default config;
