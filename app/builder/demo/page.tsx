import React from 'react';
import { Page as PageType } from '../../../src/types/blocks';
import '../../../src/blocks/heading'; // ensure heading block registers itself
import '../../../src/blocks/paragraph'; // ensure paragraph block registers itself
import { getBlock } from '../../../src/blocks/registry';

const demoPage: PageType = {
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

export default function Page() {
  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right', padding: 24 }}>
      {demoPage.blocks.map((b) => {
        const def = getBlock(b.type);
        if (!def || !def.renderer) {
          return (
            <div key={b.id}>
              بلاک ناشناخته: {b.type}
            </div>
          );
        }
        return <div key={b.id}>{def.renderer(b.data)}</div>;
      })}
    </div>
  );
}
