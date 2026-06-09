import type { BlockInstance } from "@/src/types/blocks";

export const DEFAULT_IMAGE_SRC =
  "https://placehold.co/1200x675/e5e7eb/6b7280?text=Blog+Image";

export type TextBlockType =
  | "paragraph"
  | "heading"
  | "heading-one"
  | "heading-two"
  | "heading-three";

export type WritingBlockType = TextBlockType | "image";

export const textBlockTypes: TextBlockType[] = [
  "paragraph",
  "heading",
  "heading-one",
  "heading-two",
  "heading-three",
];

export const writingBlockTypes: WritingBlockType[] = [
  "paragraph",
  "heading",
  "heading-one",
  "heading-two",
  "heading-three",
  "image",
];

const paragraphTextareaClassName =
  "min-h-10 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-base leading-8 text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0";

const headingOneTextareaClassName =
  "min-h-14 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-5xl font-bold leading-tight text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0";

const headingTwoTextareaClassName =
  "min-h-12 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-4xl font-bold leading-tight text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0";

const headingThreeTextareaClassName =
  "min-h-10 w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2 text-3xl font-semibold leading-tight text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-border focus-visible:ring-0";

export const isTextBlock = (
  block: BlockInstance,
): block is BlockInstance & { type: TextBlockType } => {
  return textBlockTypes.includes(block.type as TextBlockType);
};

export const isWritingBlock = (
  block: BlockInstance,
): block is BlockInstance & { type: WritingBlockType } => {
  return writingBlockTypes.includes(block.type as WritingBlockType);
};

export const getTextBlockClassName = (block: BlockInstance) => {
  if (block.type === "heading-one") return headingOneTextareaClassName;
  if (block.type === "heading-two") return headingTwoTextareaClassName;
  if (block.type === "heading-three") return headingThreeTextareaClassName;

  if (block.type === "heading") {
    const level = (block.data as { level?: unknown }).level;

    if (level === "h2") return headingTwoTextareaClassName;
    if (level === "h3") return headingThreeTextareaClassName;

    return headingOneTextareaClassName;
  }

  return paragraphTextareaClassName;
};
