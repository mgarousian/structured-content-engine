import React from 'react';
import BuilderEditor from '@/src/components/BuilderEditor';
import blogConfig from '@/src/modules/blog/config';
import type { Page } from '@/src/types/blocks';

const initialPage: Page = {
  id: 'blog-demo-page-1',
  slug: 'blog-demo',
  title: 'پست نمونه بلاگ',
  contentType: 'blogPost',
  blocks: [
    { id: 'b1', type: 'heading', data: { text: 'عنوان پست', level: 'h1' } },
    { id: 'b2', type: 'paragraph', data: { text: 'محتوای پاراگراف نمونه برای پست بلاگ.' } },
  ],
};

export default function Page() {
  return <BuilderEditor storageKey="page-builder:mvp:blog-demo" initialPage={initialPage} allowedBlocks={blogConfig.allowedBlocks} />;
}
