import React from 'react';
import HeadingRenderer from './renderer';
import HeadingEditor from './editor';
import { BlockDefinition } from '../../types/blocks';
import { registerBlock } from '../registry';

type HeadingData = {
  text: string;
  level: 'h1' | 'h2' | 'h3';
};

const headingBlock: BlockDefinition<HeadingData> = {
  type: 'heading',
  label: 'عنوان',
  defaultData: {
    text: 'عنوان اصلی صفحه',
    level: 'h1',
  },
  renderer: (data) => <HeadingRenderer data={data as HeadingData} />,
  editor: (props) => <HeadingEditor {...(props as any)} />,
};

registerBlock(headingBlock);

export default headingBlock;
