"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/src/blocks/registerBlocks';
import { getBlock, listBlocks } from '@/src/blocks/registry';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEditorStore, setStorageKey } from '@/src/store/editor';
import type { BlockInstance, ContentDocument, ContentType, ContentStatus } from '@/src/types/blocks';

const isValidContentType = (value: any): value is ContentType => value === 'blogPost' || value === 'landingPage';
const isValidContentStatus = (value: any): value is ContentStatus => ['draft', 'review', 'scheduled', 'published'].includes(value);

const isValidContentDocument = (page: any, expectedContentType: string): page is ContentDocument => {
  if (!page || typeof page !== 'object') return false;
  if (typeof page.id !== 'string' || typeof page.slug !== 'string' || typeof page.title !== 'string') return false;
  if (!isValidContentType(page.contentType)) return false;
  if (page.contentType !== expectedContentType) return false;
  if (!isValidContentStatus(page.status)) return false;
  if (!Array.isArray(page.blocks)) return false;
  return page.blocks.every((block: any) => {
    return (
      block &&
      typeof block === 'object' &&
      typeof block.id === 'string' &&
      typeof block.type === 'string' &&
      typeof block.data === 'object' &&
      block.data !== null &&
      Boolean(getBlock(block.type))
    );
  });
};

export default function BuilderEditor({
  storageKey,
  initialPage,
  allowedBlocks,
}: {
  storageKey: string;
  initialPage: ContentDocument;
  allowedBlocks: string[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingInsertIndex, setPendingInsertIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const storePage = useEditorStore((s) => s.page);
  const page = mounted ? storePage : initialPage;
  const blocks = page?.blocks ?? [];
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const addBlockAt = useEditorStore((s) => s.addBlockAt);
  const deleteBlock = useEditorStore((s) => s.deleteBlock);
  const moveBlockUp = useEditorStore((s) => s.moveBlockUp);
  const moveBlockDown = useEditorStore((s) => s.moveBlockDown);

  const availableBlocks = listBlocks().filter((block) => allowedBlocks.includes(block.type));

  useEffect(() => {
    setMounted(true);
    setStorageKey(storageKey);

    if (typeof window === 'undefined') {
      return;
    }

    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      useEditorStore.getState().setPage(initialPage);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (isValidContentDocument(parsed, initialPage.contentType)) {
        useEditorStore.getState().setPage(parsed);
      } else {
        useEditorStore.getState().setPage(initialPage);
      }
    } catch {
      useEditorStore.getState().setPage(initialPage);
    }
  }, [storageKey, initialPage]);

  const openPickerForIndex = (index: number) => {
    setPendingInsertIndex(index);
    setPickerOpen(true);
  };

  const handleAddBlock = (type: string) => {
    const def = getBlock(type);
    if (!def) return;
    addBlockAt(type, def.defaultData, pendingInsertIndex);
    setPickerOpen(false);
  };

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right', padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Link href="/page/demo">
          <Button variant="outline">مشاهده پیش‌نمایش</Button>
        </Link>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
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

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          {blocks.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 240,
                padding: 24,
                border: '1px solid #eee',
                borderRadius: 8,
                color: '#555',
              }}
            >
              <div style={{ marginBottom: 16 }}>صفحه خالی است</div>
              <Button variant="outline" onClick={() => openPickerForIndex(0)}>
                + افزودن اولین بلوک
              </Button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => openPickerForIndex(0)}
                >
                  + افزودن بلوک
                </Button>
              </div>
              {blocks.map((b, idx) => {
                const def = getBlock(b.type);
                if (!def || !def.renderer) {
                  return (
                    <React.Fragment key={b.id}>
                      <div style={{ padding: 12, border: '1px solid #eee', marginBottom: 12 }}>
                        بلاک ناشناخته: {b.type}
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <Button
                          variant="outline"
                          className="w-full justify-center"
                          onClick={() => openPickerForIndex(idx + 1)}
                        >
                          + افزودن بلوک
                        </Button>
                      </div>
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={b.id}>
                    <div
                      onClick={() => selectBlock(b.id)}
                      style={{
                        padding: 12,
                        border: selectedBlockId === b.id ? '2px solid #3b82f6' : '1px solid #eee',
                        borderRadius: 8,
                        marginBottom: 12,
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <strong>{def.label}</strong>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlockUp(b.id);
                            }}
                            disabled={idx <= 0}
                          >
                            بالا
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlockDown(b.id);
                            }}
                            disabled={idx >= blocks.length - 1}
                          >
                            پایین
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteBlock(b.id);
                            }}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>

                      {def.renderer ? def.renderer(b.data) : null}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => openPickerForIndex(idx + 1)}
                      >
                        + افزودن بلوک
                      </Button>
                    </div>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>

        <aside style={{ width: 340, padding: 12, borderRight: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0 }}>ویرایش بلاک</h3>

          {(() => {
            const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;
            if (selectedBlock) {
              const def = getBlock(selectedBlock.type);
              if (!def || !def.editor) return <div>این بلاک قابلیت ویرایش ندارد.</div>;
              return def.editor({ data: selectedBlock.data, onChange: (d: any) => updateBlock(selectedBlock.id, d) });
            }
            return <div>هیچ بلاکی انتخاب نشده است. روی یک بلاک کلیک کنید.</div>;
          })()}
        </aside>
      </div>
    </div>
  );
}
