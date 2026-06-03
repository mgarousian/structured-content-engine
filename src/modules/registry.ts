import { ContentType } from '../types/blocks';
import blogConfig from './blog/config';
import landingConfig from './landing/config';

import type { ContentDocument } from '../types/blocks';

export type ModuleConfig = {
  contentType: ContentType;
  label: string;
  labelFa: string;
  allowedBlocks: string[];
  storageKey: string;
  defaultDocument: ContentDocument;
};

const configs: Record<ContentType, ModuleConfig> = {
  blogPost: blogConfig,
  landingPage: landingConfig,
};

export const getModuleConfig = (contentType: ContentType): ModuleConfig => configs[contentType];

export default configs;
