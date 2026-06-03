"use client";
import React, { useEffect, useState } from 'react';
import '../../../src/blocks/heading'; // ensure heading block registers itself
import '../../../src/blocks/paragraph'; // ensure paragraph block registers itself
import { getBlock, listBlocks } from '../../../src/blocks/registry';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEditorStore, loadPageFromStorage } from '../../../src/store/editor';

export default function Page() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const page = useEditorStore((s) => s.page);
  const blocks = page?.blocks ?? [];
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const addBlock = useEditorStore((s) => s.addBlock);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;
  const availableBlocks = listBlocks().filter((block) => block.type === 'heading' || block.type === 'paragraph');

  useEffect(() => {
    loadPageFromStorage();
  }, []);

  const handleAddBlock = (type: string) => {
    const def = getBlock(type);
    if (!def) return;
    addBlock(type, def.defaultData);
    setPickerOpen(false);
  };

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right', padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogTrigger asChild>
            <Button>+ افزودن بلوک</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>افزودن بلاک جدید</DialogTitle>
            <DialogDescription>یک نوع بلاک را انتخاب کنید تا به صفحه اضافه شود.</DialogDescription>
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {availableBlocks.map((block) => (
                <Button
                  key={block.type}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleAddBlock(block.type)}
                >
                  {block.label}
                  <span style={{ opacity: 0.7 }}>{block.type}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
