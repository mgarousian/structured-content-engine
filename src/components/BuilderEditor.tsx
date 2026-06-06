"use client";

import React, { useEffect, useMemo } from "react";
import "@/src/blocks/registerBlocks";
import { getBlock } from "@/src/blocks/registry";
import { useEditorStore, setStorageKey } from "@/src/store/editor";
import { getDocumentByKey } from "@/src/core/storage/documentStorage";
import { getBlogDocument } from "@/src/modules/blog/api/client";
import type {
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

  const page = storePage ?? initialPage;
  const blocks = page.blocks ?? [];

  const firstParagraphBlock = useMemo(
    () => blocks.find((block) => block.type === "paragraph"),
    [blocks],
  );

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
    if (firstParagraphBlock) return;
    if (!allowedBlocks.includes("paragraph")) return;

    const paragraphDefinition = getBlock("paragraph");
    if (!paragraphDefinition) return;

    addBlockAt(
      "paragraph",
      {
        ...paragraphDefinition.defaultData,
        text: "",
      },
      blocks.length,
    );
  }, [firstParagraphBlock, allowedBlocks, addBlockAt, blocks.length]);

  const paragraphText =
    firstParagraphBlock &&
    typeof (firstParagraphBlock.data as { text?: unknown }).text === "string"
      ? ((firstParagraphBlock.data as ParagraphData).text ?? "")
      : "";

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="flex min-h-screen w-full items-start justify-center px-6 py-24">
        <textarea
          value={paragraphText}
          onChange={(event) => {
            if (!firstParagraphBlock) return;

            updateBlock(firstParagraphBlock.id, {
              ...(firstParagraphBlock.data as Record<string, unknown>),
              text: event.target.value,
            });
          }}
          placeholder="شروع به نوشتن کنید..."
          className="min-h-80 w-[600px] max-w-full resize-none rounded-md border border-transparent bg-transparent px-3 py-2 text-base leading-8 text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
        />
      </div>
    </main>
  );
}
