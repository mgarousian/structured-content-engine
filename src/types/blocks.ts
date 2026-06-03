import { ReactNode } from 'react';

export type BlockType = string;

export interface BlockDefinition<Data = any> {
  type: BlockType;
  label: string;
  defaultData: Data;
  renderer?: (data: Data) => ReactNode;
  editor?: (props: { data: Data; onChange: (data: Data) => void }) => ReactNode;
}

export interface BlockInstance<Data = any> {
  id: string;
  type: BlockType;
  data: Data;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  blocks: BlockInstance[];
  meta?: Record<string, any>;
}

export type BlockRegistryMap = Record<BlockType, BlockDefinition<any>>;
