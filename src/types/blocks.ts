import { ReactNode } from 'react';

export type BlockType = string;

export interface BlockDefinition<Data = any> {
  type: BlockType;
  label: string;
  persianLabel?: string;
  description?: string;
  availableFor?: ContentType[];
  source?: 'core' | 'custom' | 'thirdParty' | string;
  defaultData: Data;
  renderer?: (data: Data) => ReactNode;
  editor?: (props: { data: Data; onChange: (data: Data) => void }) => ReactNode;
}

export interface BlockInstance<Data = any> {
  id: string;
  type: BlockType;
  data: Data;
}

export type ContentType = 'blogPost' | 'landingPage';
export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published';

export interface ContentDocument {
  id: string;
  contentType: ContentType;
  title: string;
  slug: string;
  excerpt?: string;
  status: ContentStatus;
  publishedAt?: string;
  blocks: BlockInstance[];
  createdAt?: string;
  updatedAt?: string;
}

export type Page = ContentDocument;

export type BlockRegistryMap = Record<BlockType, BlockDefinition<any>>;

// Canonical block data types
export type HeadingBlockData = {
  text: string;
  level: 'h1' | 'h2' | 'h3';
};

export type ParagraphBlockData = {
  text: string;
};

export type ImageBlockData = {
  src: string;
  alt?: string;
  caption?: string;
};

export type HeroBlockData = {
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  imageSrc?: string;
};
