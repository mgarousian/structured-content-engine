import React from 'react';
import BuilderEditor from '@/src/components/BuilderEditor';
import landingConfig from '@/src/modules/landing/config';
import type { Page } from '@/src/types/blocks';

const initialPage: Page = {
  id: 'landing-demo-page-1',
  slug: 'landing-demo',
  title: 'لندینگ نمونه',
  contentType: 'landingPage',
  blocks: [
    { id: 'h1', type: 'hero', data: { title: 'عنوان اصلی لندینگ', subtitle: 'اینجا می‌توانید توضیح کوتاهی درباره ارزش پیشنهادی صفحه بنویسید.', primaryCtaText: 'شروع کنید', primaryCtaHref: '#', imageSrc: '' } },
    { id: 'h2', type: 'heading', data: { text: 'بخش بعدی', level: 'h2' } },
    { id: 'p1', type: 'paragraph', data: { text: 'متن پاراگراف نمونه برای بخش بعدی.' } },
  ],
};

export default function Page() {
  return (
    <BuilderEditor storageKey="page-builder:mvp:landing-demo" initialPage={initialPage} allowedBlocks={landingConfig.allowedBlocks} />
  );
}
