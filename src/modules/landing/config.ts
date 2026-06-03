import { ModuleConfig } from '../registry';
import { ContentType } from '../../types/blocks';

const config: ModuleConfig = {
  contentType: 'landingPage' as ContentType,
  label: 'Landing Page',
  labelFa: 'لندینگ‌پیج',
  allowedBlocks: ['heading', 'paragraph', 'image', 'hero'],
};

export default config;
