import { ContentType } from '../types/blocks';
import blogConfig from './blog/config';
import landingConfig from './landing/config';

import type { ContentDocument } from '../types/blocks';

export type ModuleKey = 'blog' | 'landing';

export type ModuleConfig = {
  moduleKey: ModuleKey;
  contentType: ContentType;
  label: string;
  persianLabel: string;
  labelFa: string;
  allowedBlocks: string[];
  storageKey: string;
  adminPath: string;
  adminListLabel: string;
  defaultDocument: ContentDocument;
  createDefaultDocument: (id: string) => ContentDocument;
};

const moduleConfigs: Record<ModuleKey, ModuleConfig> = {
  blog: blogConfig,
  landing: landingConfig,
};

const configsByContentType: Record<ContentType, ModuleConfig> = {
  blogPost: blogConfig,
  landingPage: landingConfig,
};

export const getModuleConfigByKey = (moduleKey: string): ModuleConfig | undefined => {
  const normalized = moduleKey.toLowerCase();
  if (!isModuleKey(normalized)) return undefined;
  return moduleConfigs[normalized];
};

export const getModuleConfig = (contentType: ContentType): ModuleConfig => configsByContentType[contentType];

export const isModuleKey = (value: any): value is ModuleKey => value === 'blog' || value === 'landing';

export default configsByContentType;
