import { ModuleConfig } from '../registry';
import type { ContentDocument } from '../../types/blocks';
import { ContentType } from '../../types/blocks';

const defaultDocument: ContentDocument = {
  id: 'landing-demo-page-1',
  contentType: 'landingPage',
  title: 'لندینگ نمونه',
  slug: 'landing-demo',
  status: 'draft',
  blocks: [
    {
      id: 'h1',
      type: 'hero',
      data: {
        title: 'عنوان اصلی لندینگ',
        subtitle: 'اینجا می‌توانید توضیح کوتاهی درباره ارزش پیشنهادی صفحه بنویسید.',
        primaryCtaText: 'شروع کنید',
        primaryCtaHref: '#',
        imageSrc: '',
      },
    },
    { id: 'h2', type: 'heading', data: { text: 'بخش بعدی', level: 'h2' } },
    { id: 'p1', type: 'paragraph', data: { text: 'متن پاراگراف نمونه برای بخش بعدی.' } },
  ],
};

const config: ModuleConfig = {
  contentType: 'landingPage' as ContentType,
  label: 'Landing Page',
  labelFa: 'لندینگ‌پیج',
  allowedBlocks: ['heading', 'paragraph', 'image', 'hero'],
  storageKey: 'page-builder:mvp:landing-demo',
  defaultDocument,
};

export default config;
