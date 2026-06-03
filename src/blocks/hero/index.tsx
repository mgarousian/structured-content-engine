import React from 'react';
import HeroRenderer from './renderer';
import HeroEditor from './editor';
import { BlockDefinition } from '../../types/blocks';
import { registerBlock } from '../registry';
import type { HeroBlockData } from '../../types/blocks';

const heroBlock: BlockDefinition<HeroBlockData> = {
  type: 'hero',
  label: 'هیرو',
  defaultData: {
    title: 'عنوان اصلی لندینگ',
    subtitle: 'اینجا می‌توانید توضیح کوتاهی درباره ارزش پیشنهادی صفحه بنویسید.',
    primaryCtaText: 'شروع کنید',
    primaryCtaHref: '#',
    imageSrc: '',
  },
  renderer: (data) => <HeroRenderer data={data as HeroBlockData} />,
  editor: (props) => <HeroEditor {...(props as any)} />,
};

registerBlock(heroBlock);

export default heroBlock;
