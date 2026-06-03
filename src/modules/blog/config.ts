import { ModuleConfig } from '../registry';
import { ContentType } from '../../types/blocks';

const config: ModuleConfig = {
  contentType: 'blogPost' as ContentType,
  label: 'Blog Post',
  labelFa: 'پست بلاگ',
  allowedBlocks: ['heading', 'paragraph', 'image'],
};

export default config;
