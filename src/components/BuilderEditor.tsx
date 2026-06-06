"use client";

import React, { useEffect, useMemo, useRef } from "react";
import "@/src/blocks/registerBlocks";
import { getBlock } from "@/src/blocks/registry";
import { useEditorStore, setStorageKey } from "@/src/store/editor";
import { getDocumentByKey } from "@/src/core/storage/documentStorage";
import { getBlogDocument } from "@/src/modules/blog/api/client";
import type {
  BlockInstance,
  ContentDocument,
  ContentStatus,
  ContentType,
} from "@/src/types/blocks";

const isValidContentType = (value: unknown): value is ContentType =>
  value === "blogPost";

const isValidContentStatus = (value: unknown): value is ContentStatus =>
  ["draft", "review", "scheduled", "published"].includes(String(value));

const isValidContentDocument = (
  page: unknown,
  expectedContentType: string,
): page is ContentDocument => {
  if (!page || typeof page !== "object") return false;

  const candidate = page as Partial<ContentDocument>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.slug !== "string" ||
    typeof candidate.title !== "string"
  ) {
    return false;
  }

  if (!isValidContentType(candidate.contentType)) return false;
  if (candidate.contentType !== expectedContentType) return false;
  if (!isValidContentStatus(candidate.status)) return false;
  if (!Array.isArray(candidate.blocks)) return false;

  return candidate.blocks.every((block) => {
    return (
      block &&
      typeof block === "object" &&
      typeof block.id === "string" &&
      typeof block.type === "string" &&
      typeof block.data === "object" &&
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
  const storePage = useEditorStore((state) => state.page);
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const addBlockAt = useEditorStore((state) => state.addBlockAt);
  const deleteBlock = useEditorStore((state) => state.deleteBlock);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);

  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const pendingFocusBlockId = useRef<string | null>(null);
  const focusSelectedBlockOnNextRender = useRef(false);
  const pendingCaretPosition = useRef<number | null>(null);

  const page = storePage ?? initialPage;
  const blocks = page.blocks ?? [];

  const paragraphBlocks = useMemo(
    () => blocks.filter((block) => block.type === "paragraph"),
    [blocks],
  );

  const getParagraphText = (block: BlockInstance) =>
    typeof (block.data as { text?: unknown }).text === "string"
      ? ((block.data as ParagraphData).text ?? "")
      : "";

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const createEmptyParagraph = (insertIndex: number) => {
    const paragraphDefinition = getBlock("paragraph");
    if (!paragraphDefinition) return;

    focusSelectedBlockOnNextRender.current = true;
    pendingCaretPosition.current = 0;

    addBlockAt(
      "paragraph",
      {
        ...paragraphDefinition.defaultData,
        text: "",
      },
      insertIndex,
    );
  };

  useEffect(() => {
    setStorageKey(storageKey);

    const parsedKey = /^content-engine:doc:([^:]+):([^:]+)$/.exec(storageKey);

    if (parsedKey?.[1] === "blog") {
      void getBlogDocument(parsedKey[2]).then((storedDocument) => {
        if (
          storedDocument &&
          isValidContentDocument(storedDocument, initialPage.contentType)
        ) {
          useEditorStore.getState().setPage(storedDocument);
        } else {
          useEditorStore.getState().setPage(initialPage);
        }
      });

      return;
    }

    const storedDocument = getDocumentByKey(storageKey);

    if (
      storedDocument &&
      isValidContentDocument(storedDocument, initialPage.contentType)
    ) {
      useEditorStore.getState().setPage(storedDocument);
    } else {
      useEditorStore.getState().setPage(initialPage);
    }
  }, [storageKey, initialPage]);

  useEffect(() => {
    if (paragraphBlocks.length > 0) return;
    if (!allowedBlocks.includes("paragraph")) return;

    createEmptyParagraph(blocks.length);
  }, [paragraphBlocks.length, allowedBlocks, blocks.length]);

  useEffect(() => {
    paragraphBlocks.forEach((block) => {
      resizeTextarea(textareaRefs.current[block.id]);
    });
  }, [paragraphBlocks]);

  useEffect(() => {
    const targetBlockId = focusSelectedBlockOnNextRender.current
      ? selectedBlockId
      : pendingFocusBlockId.current;

    if (!targetBlockId) return;

    const target = textareaRefs.current[targetBlockId];
    if (!target) return;

    target.focus();

    const position = pendingCaretPosition.current;
    if (typeof position === "number") {
      target.setSelectionRange(position, position);
    }

    focusSelectedBlockOnNextRender.current = false;
    pendingFocusBlockId.current = null;
    pendingCaretPosition.current = null;
  }, [paragraphBlocks, selectedBlockId]);

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="flex min-h-screen w-full items-start justify-center px-6 py-24">
        <div className="flex w-[600px] max-w-full flex-col gap-3">
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
                rows={1}
                onChange={(event) => {
                  updateBlock(block.id, {
                    ...(block.data as Record<string, unknown>),
                    text: event.target.value,
                  });

                  resizeTextarea(event.currentTarget);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();

                    const currentIndex = blocks.findIndex(
                      (candidate) => candidate.id === block.id,
                    );

                    if (currentIndex < 0) return;

                    createEmptyParagraph(currentIndex + 1);
                    return;
                  }

                  if (
                    event.key === "Backspace" &&
                    text === "" &&
                    paragraphBlocks.length > 1
                  ) {
                    event.preventDefault();

                    const previousParagraph = paragraphBlocks[index - 1];

                    if (previousParagraph) {
                      pendingFocusBlockId.current = previousParagraph.id;
                      pendingCaretPosition.current =
                        getParagraphText(previousParagraph).length;
                    }

                    deleteBlock(block.id);
                  }
                }}
                placeholder={index === 0 ? "شروع به نوشتن کنید..." : ""}
                className="min-h-10 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-base leading-8 text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}