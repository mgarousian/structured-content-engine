"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import {
  Command,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";

const DEFAULT_IMAGE_SRC =
  "https://placehold.co/1200x675/e5e7eb/6b7280?text=Blog+Image";

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

type TextBlockType = "paragraph" | "heading";
type WritingBlockType = TextBlockType | "image";

type TextBlockData = {
  text?: string;
  level?: number;
};

type ImageBlockData = {
  src?: string;
  alt?: string;
  caption?: string;
};

type SlashMenuState = {
  blockId: string;
  index: number;
  selectedIndex: number;
} | null;

const textBlockTypes: TextBlockType[] = ["paragraph", "heading"];
const writingBlockTypes: WritingBlockType[] = ["paragraph", "heading", "image"];

const slashMenuOptions: Array<{
  type: WritingBlockType;
  label: string;
}> = [
  {
    type: "paragraph",
    label: "پاراگراف",
  },
  {
    type: "heading",
    label: "عنوان",
  },
  {
    type: "image",
    label: "تصویر",
  },
];

const isTextBlock = (
  block: BlockInstance,
): block is BlockInstance & { type: TextBlockType } => {
  return textBlockTypes.includes(block.type as TextBlockType);
};

const isWritingBlock = (
  block: BlockInstance,
): block is BlockInstance & { type: WritingBlockType } => {
  return writingBlockTypes.includes(block.type as WritingBlockType);
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
  const setPageMetadata = useEditorStore((state) => state.setPageMetadata);

  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const pendingFocusBlockId = useRef<string | null>(null);
  const focusSelectedBlockOnNextRender = useRef(false);
  const pendingCaretPosition = useRef<number | null>(null);

  const [slashMenu, setSlashMenu] = useState<SlashMenuState>(null);

  const page = storePage ?? initialPage;
  const blocks = page.blocks ?? [];

  const writingBlocks = useMemo(
    () => blocks.filter(isWritingBlock),
    [blocks],
  );

  const getTextBlockText = (block: BlockInstance) =>
    typeof (block.data as TextBlockData).text === "string"
      ? ((block.data as TextBlockData).text ?? "")
      : "";

  const getImageSrc = (block: BlockInstance) => {
    const src = (block.data as ImageBlockData).src;

    if (typeof src === "string" && src.trim() !== "") {
      return src.trim();
    }

    return DEFAULT_IMAGE_SRC;
  };

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const createWritingBlock = (
    type: WritingBlockType,
    insertIndex: number,
  ) => {
    if (!allowedBlocks.includes(type)) return;

    const blockDefinition = getBlock(type);
    if (!blockDefinition) return;

    const defaultData = {
      ...(blockDefinition.defaultData as Record<string, unknown>),
    };

    const data =
      type === "image"
        ? {
            ...defaultData,
            src:
              typeof defaultData.src === "string" &&
              defaultData.src.trim() !== ""
                ? defaultData.src
                : DEFAULT_IMAGE_SRC,
            alt:
              typeof defaultData.alt === "string"
                ? defaultData.alt
                : "",
            caption:
              typeof defaultData.caption === "string"
                ? defaultData.caption
                : "",
          }
        : {
            ...defaultData,
            text: "",
          };

    if (textBlockTypes.includes(type as TextBlockType)) {
      focusSelectedBlockOnNextRender.current = true;
      pendingCaretPosition.current = 0;
    } else {
      focusSelectedBlockOnNextRender.current = false;
      pendingFocusBlockId.current = null;
      pendingCaretPosition.current = null;
    }

    addBlockAt(type, data, insertIndex);
  };

  const focusTextBlock = (block: BlockInstance | undefined) => {
    if (!block || !isTextBlock(block)) return;

    pendingFocusBlockId.current = block.id;
    pendingCaretPosition.current = getTextBlockText(block).length;
  };

  const handleSlashSelect = (
    type: WritingBlockType,
    currentBlock: BlockInstance,
  ) => {
    const currentIndex = blocks.findIndex(
      (candidate) => candidate.id === currentBlock.id,
    );

    if (currentIndex < 0) return;

    const currentText = isTextBlock(currentBlock)
      ? getTextBlockText(currentBlock)
      : "";

    if (isTextBlock(currentBlock) && currentText === "") {
      if (currentBlock.type === type) {
        setSlashMenu(null);
        focusTextBlock(currentBlock);
        return;
      }

      deleteBlock(currentBlock.id);
      createWritingBlock(type, currentIndex);
      setSlashMenu(null);
      return;
    }

    createWritingBlock(type, currentIndex + 1);
    setSlashMenu(null);
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
    if (writingBlocks.length > 0) return;
    if (!allowedBlocks.includes("paragraph")) return;

    createWritingBlock("paragraph", blocks.length);
  }, [writingBlocks.length, allowedBlocks, blocks.length]);

  useEffect(() => {
    writingBlocks.forEach((block) => {
      if (!isTextBlock(block)) return;
      resizeTextarea(textareaRefs.current[block.id]);
    });
  }, [writingBlocks]);

  useEffect(() => {
    const targetBlockId = focusSelectedBlockOnNextRender.current
      ? selectedBlockId
      : pendingFocusBlockId.current;

    if (!targetBlockId) return;

    const target = textareaRefs.current[targetBlockId];

    if (!target) {
      focusSelectedBlockOnNextRender.current = false;
      pendingFocusBlockId.current = null;
      pendingCaretPosition.current = null;
      return;
    }

    target.focus();

    const position = pendingCaretPosition.current;
    if (typeof position === "number") {
      target.setSelectionRange(position, position);
    }

    focusSelectedBlockOnNextRender.current = false;
    pendingFocusBlockId.current = null;
    pendingCaretPosition.current = null;
  }, [writingBlocks, selectedBlockId]);

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="flex min-h-screen w-full items-start justify-center px-6 py-24">
        <div className="flex w-[800px] max-w-full flex-col gap-3">
          <header className="mb-8 space-y-3">
            <input
              value={page.title}
              onChange={(event) => {
                setPageMetadata({ title: event.target.value });
              }}
              placeholder="عنوان پست"
              className="w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-4xl font-bold leading-tight text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
            />

            <textarea
              value={page.excerpt ?? ""}
              rows={2}
              onChange={(event) => {
                setPageMetadata({ excerpt: event.target.value });
              }}
              placeholder="متن توضیحی کوتاه برای این پست..."
              className="w-full resize-none rounded-md border border-transparent bg-transparent px-3 py-2 text-lg leading-8 text-muted-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
            />
          </header>

          <div className="mb-8 flex justify-center" aria-hidden="true">
            <span className="text-xl leading-none tracking-widest text-muted-foreground/60">
              ...
            </span>
          </div>

          {writingBlocks.map((block, index) => {
            if (block.type === "image") {
              return (
                <figure key={block.id} className="my-6">
                  <img
                    src={getImageSrc(block)}
                    alt={
                      typeof (block.data as ImageBlockData).alt === "string"
                        ? ((block.data as ImageBlockData).alt ?? "")
                        : ""
                    }
                    className="h-auto w-full rounded-xl object-cover"
                  />
                </figure>
              );
            }

            const text = getTextBlockText(block);
            const isHeading = block.type === "heading";
            const isSlashMenuOpenForBlock = slashMenu?.blockId === block.id;

            return (
              <div key={block.id} className="relative">
                <textarea
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
                    if (event.key === "Escape" && isSlashMenuOpenForBlock) {
                      event.preventDefault();
                      setSlashMenu(null);
                      return;
                    }

                    if (
                      isSlashMenuOpenForBlock &&
                      event.key === "ArrowDown"
                    ) {
                      event.preventDefault();

                      setSlashMenu((currentMenu) => {
                        if (
                          !currentMenu ||
                          currentMenu.blockId !== block.id
                        ) {
                          return currentMenu;
                        }

                        return {
                          ...currentMenu,
                          selectedIndex:
                            (currentMenu.selectedIndex + 1) %
                            slashMenuOptions.length,
                        };
                      });

                      return;
                    }

                    if (isSlashMenuOpenForBlock && event.key === "ArrowUp") {
                      event.preventDefault();

                      setSlashMenu((currentMenu) => {
                        if (
                          !currentMenu ||
                          currentMenu.blockId !== block.id
                        ) {
                          return currentMenu;
                        }

                        return {
                          ...currentMenu,
                          selectedIndex:
                            (currentMenu.selectedIndex -
                              1 +
                              slashMenuOptions.length) %
                            slashMenuOptions.length,
                        };
                      });

                      return;
                    }

                    if (isSlashMenuOpenForBlock && event.key === "Enter") {
                      event.preventDefault();

                      const selectedOption =
                        slashMenuOptions[slashMenu.selectedIndex];

                      if (selectedOption) {
                        handleSlashSelect(selectedOption.type, block);
                      }

                      return;
                    }

                    if (event.key === "/") {
                      event.preventDefault();

                      setSlashMenu({
                        blockId: block.id,
                        index,
                        selectedIndex: 0,
                      });

                      return;
                    }

                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();

                      const currentIndex = blocks.findIndex(
                        (candidate) => candidate.id === block.id,
                      );

                      if (currentIndex < 0) return;

                      createWritingBlock("paragraph", currentIndex + 1);
                      setSlashMenu(null);
                      return;
                    }

                    if (
                      event.key === "Backspace" &&
                      text === "" &&
                      writingBlocks.length > 1
                    ) {
                      event.preventDefault();

                      const previousTextBlock = [...writingBlocks]
                        .slice(0, index)
                        .reverse()
                        .find(isTextBlock);

                      if (previousTextBlock) {
                        focusTextBlock(previousTextBlock);
                      }

                      setSlashMenu(null);
                      deleteBlock(block.id);
                    }
                  }}
                  placeholder={index === 0 ? "شروع به نوشتن کنید..." : ""}
                  className={
                    isHeading
                      ? "min-h-12 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-3xl font-bold leading-tight text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
                      : "min-h-10 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-base leading-8 text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0"
                  }
                />

                {isSlashMenuOpenForBlock && (
                  <div className="absolute right-3 top-full z-10 mt-2 w-56">
                    <Command className="rounded-md border border-border bg-popover text-popover-foreground shadow-md">
                      <CommandList>
                        <CommandGroup>
                          {slashMenuOptions.map((option, optionIndex) => (
                            <button
                              key={option.type}
                              type="button"
                              role="option"
                              aria-selected={
                                slashMenu.selectedIndex === optionIndex
                              }
                              className={
                                slashMenu.selectedIndex === optionIndex
                                  ? "flex w-full items-center rounded-sm bg-accent px-2 py-1.5 text-sm text-accent-foreground outline-none"
                                  : "flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                              }
                              onMouseEnter={() => {
                                setSlashMenu((currentMenu) => {
                                  if (
                                    !currentMenu ||
                                    currentMenu.blockId !== block.id
                                  ) {
                                    return currentMenu;
                                  }

                                  return {
                                    ...currentMenu,
                                    selectedIndex: optionIndex,
                                  };
                                });
                              }}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                handleSlashSelect(option.type, block);
                              }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}