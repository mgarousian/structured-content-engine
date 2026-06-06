"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import '@/src/blocks/registerBlocks';
import { getBlock } from '@/src/blocks/registry';
import { useEditorStore, setStorageKey } from '@/src/store/editor';
import { getDocumentByKey } from '@/src/core/storage/documentStorage';
import { getBlogDocument } from '@/src/modules/blog/api/client';
import BlogMetadataEditor from './BlogMetadataEditor';
import type { BlockInstance, ContentDocument, ContentType, ContentStatus } from '@/src/types/blocks';
import { cn } from '@/lib/utils';

const isValidContentType = (value: any): value is ContentType => value === 'blogPost';
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

type ParagraphData = {
  text: string;
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
  const [mounted, setMounted] = useState(false);
  const storePage = useEditorStore((s) => s.page);
  const page = mounted ? storePage : initialPage;
  const blocks = page?.blocks ?? [];
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const addBlockAt = useEditorStore((s) => s.addBlockAt);
  const deleteBlock = useEditorStore((s) => s.deleteBlock);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const setPageMetadata = useEditorStore((s) => s.setPageMetadata);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const pendingFocusBlockId = useRef<string | null>(null);
  const focusSelectedBlockOnNextRender = useRef(false);
  const pendingCaretPosition = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setStorageKey(storageKey);

    const parsedKey = /^content-engine:doc:([^:]+):([^:]+)$/.exec(storageKey);
    if (parsedKey?.[1] === 'blog') {
      void getBlogDocument(parsedKey[2]).then((storedDocument) => {
        if (storedDocument && isValidContentDocument(storedDocument, initialPage.contentType)) {
          useEditorStore.getState().setPage(storedDocument);
        } else {
          useEditorStore.getState().setPage(initialPage);
        }
      });
      return;
    }

    const storedDocument = getDocumentByKey(storageKey);
    if (storedDocument && isValidContentDocument(storedDocument, initialPage.contentType)) {
      useEditorStore.getState().setPage(storedDocument);
    } else {
      useEditorStore.getState().setPage(initialPage);
    }
  }, [storageKey, initialPage]);

  const paragraphBlocks = useMemo(
    () => blocks.filter((block) => block.type === 'paragraph'),
    [blocks]
  );

  useEffect(() => {
    if (!mounted || !page || paragraphBlocks.length > 0) return;
    const paragraphDefinition = getBlock('paragraph');
    if (!paragraphDefinition || !allowedBlocks.includes('paragraph')) return;
    focusSelectedBlockOnNextRender.current = true;
    pendingCaretPosition.current = 0;
    addBlockAt('paragraph', { ...paragraphDefinition.defaultData, text: '' }, blocks.length);
  }, [mounted, page, paragraphBlocks.length, allowedBlocks, addBlockAt, blocks.length]);

  useEffect(() => {
    paragraphBlocks.forEach((block) => {
      const textarea = textareaRefs.current[block.id];
      if (!textarea) return;
      textarea.style.height = '0px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [paragraphBlocks]);

  useEffect(() => {
    const targetBlockId = focusSelectedBlockOnNextRender.current ? selectedBlockId : pendingFocusBlockId.current;
    if (!targetBlockId) return;
    const target = textareaRefs.current[targetBlockId];
    if (!target) return;
    target.focus();
    const position = pendingCaretPosition.current;
    if (typeof position === 'number') {
      target.setSelectionRange(position, position);
    }
    focusSelectedBlockOnNextRender.current = false;
    pendingFocusBlockId.current = null;
    pendingCaretPosition.current = null;
  }, [paragraphBlocks, selectedBlockId]);

  const getParagraphText = (block: BlockInstance) =>
    typeof (block.data as { text?: unknown }).text === 'string'
      ? ((block.data as ParagraphData).text ?? '')
      : '';

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const focusParagraphByRelativeIndex = (currentIndex: number, direction: -1 | 1) => {
    const targetBlock = paragraphBlocks[currentIndex + direction];
    if (!targetBlock) return;
    pendingFocusBlockId.current = targetBlock.id;
    pendingCaretPosition.current = getParagraphText(targetBlock).length;
  };

  const createEmptyParagraph = (insertIndex: number) => {
    const paragraphDefinition = getBlock('paragraph');
    if (!paragraphDefinition) return;
    focusSelectedBlockOnNextRender.current = true;
    pendingCaretPosition.current = 0;
    addBlockAt('paragraph', { ...paragraphDefinition.defaultData, text: '' }, insertIndex);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-muted/30 text-right">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:flex-row">
        <aside className="w-full shrink-0 self-start rounded-2xl border border-border bg-background p-5 lg:sticky lg:top-6 lg:w-80 lg:overflow-y-auto">
          {page.contentType === 'blogPost' && (
            <>
              <h3 className="mb-4 text-lg font-semibold">تنظیمات پست</h3>
              <p className="mb-4 text-sm text-muted-foreground">تغییرات به‌صورت خودکار ذخیره می‌شوند</p>
              <BlogMetadataEditor
                title={page.title}
                slug={page.slug}
                excerpt={page.excerpt}
                status={page.status === 'published' ? 'published' : 'draft'}
                onUpdate={(data) => setPageMetadata(data)}
              />
              <div className="my-5 border-t border-border" />
            </>
          )}
        </aside>

        <section className="flex flex-1 justify-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="flex w-full max-w-[600px] flex-col gap-3">
            {paragraphBlocks.map((block, index) => {
              const text = getParagraphText(block);

              return (
                <textarea
                  key={block.id}
                  ref={(node) => {
                    textareaRefs.current[block.id] = node;
                    resizeTextarea(node);
                  }}
                  value={text}
                  onChange={(event) => {
                    updateBlock(block.id, {
                      ...(block.data as Record<string, unknown>),
                      text: event.target.value,
                    });
                    resizeTextarea(event.target);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      const currentIndex = blocks.findIndex((candidate) => candidate.id === block.id);
                      if (currentIndex < 0) return;
                      createEmptyParagraph(currentIndex + 1);
                      return;
                    }

                    if (event.key === 'Backspace' && text === '' && paragraphBlocks.length > 1 && index > 0) {
                      event.preventDefault();
                      focusParagraphByRelativeIndex(index, -1);
                      deleteBlock(block.id);
                    }
                  }}
                  placeholder={index === 0 ? 'شروع به نوشتن کنید...' : ''}
                  rows={1}
                  className={cn(
                    'block w-full min-h-0 resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-3 py-3 text-base leading-8 outline-none shadow-none transition-colors placeholder:text-muted-foreground',
                    'hover:border-border/80 hover:ring-2 hover:ring-border/40',
                    'focus:border-border focus:ring-2 focus:ring-border/60'
                  )}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
