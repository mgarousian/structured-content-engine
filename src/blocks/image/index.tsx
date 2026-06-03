import React from 'react';
import ImageRenderer from './renderer';
import ImageEditor from './editor';
import { BlockDefinition, ContentType } from '../../types/blocks';
import { registerBlock } from '../registry';

type ImageData = {
  src: string;
  alt: string;
  caption?: string;
};

const imageBlock: BlockDefinition<ImageData> = {
  type: 'image',
  label: 'تصویر',
  persianLabel: 'تصویر',
  description: 'یک تصویر با متن جایگزین و کپشن برای صفحه اضافه می‌کند.',
  availableFor: ['blogPost', 'landingPage'],
  source: 'core',
  defaultData: {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    alt: 'تصویر نمونه',
    caption: 'کپشن تصویر نمونه',
  },
  renderer: (data) => <ImageRenderer data={data as ImageData} />,
  editor: (props) => <ImageEditor {...(props as any)} />,
};

registerBlock(imageBlock);

export default imageBlock;
