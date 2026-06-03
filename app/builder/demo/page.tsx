"use client";
import React, { useEffect } from 'react';
import '../../../src/blocks/heading'; // ensure heading block registers itself
import '../../../src/blocks/paragraph'; // ensure paragraph block registers itself
import { getBlock } from '../../../src/blocks/registry';
import { useEditorStore, loadPageFromStorage } from '../../../src/store/editor';

export default function Page() {
  const page = useEditorStore((s) => s.page);
  const blocks = page?.blocks ?? [];
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  useEffect(() => {
    loadPageFromStorage();
  }, []);

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right', padding: 24 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          {blocks.map((b) => {
            const def = getBlock(b.type);
            if (!def || !def.renderer) {
              return (
                <div key={b.id} style={{ padding: 12, border: '1px solid #eee', marginBottom: 12 }}>
                  بلاک ناشناخته: {b.type}
                </div>
              );
            }

            const isSelected = selectedBlockId === b.id;

            return (
              <div
                key={b.id}
                onClick={() => selectBlock(b.id)}
                style={{
                  padding: 12,
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #eee',
                  borderRadius: 8,
                  marginBottom: 12,
                  cursor: 'pointer',
                }}
              >
                {def.renderer(b.data)}
              </div>
            );
          })}
        </div>

        <aside style={{ width: 340, padding: 12, borderRight: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0 }}>ویرایش بلاک</h3>

          {selectedBlock ? (
            (() => {
              const def = getBlock(selectedBlock.type);
              if (!def || !def.editor) return <div>این بلاک قابلیت ویرایش ندارد.</div>;
              return def.editor({ data: selectedBlock.data, onChange: (d: any) => updateBlock(selectedBlock.id, d) });
            })()
          ) : (
            <div>هیچ بلاکی انتخاب نشده است. روی یک بلاک کلیک کنید.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
