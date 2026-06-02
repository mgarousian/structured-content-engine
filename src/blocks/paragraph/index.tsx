import React from 'react';
import ParagraphRenderer from './renderer';
import ParagraphEditor from './editor';
import { BlockDefinition } from '../../types/blocks';
import { registerBlock } from '../registry';

type ParagraphData = {
  text: string;
};

const paragraphBlock: BlockDefinition<ParagraphData> = {
  type: 'paragraph',
  label: 'پاراگراف',
  defaultData: {
    text: 'این یک پاراگراف نمونه برای محتوای صفحه است.',
  },
  renderer: (data) => <ParagraphRenderer data={data as ParagraphData} />,
  editor: (props) => <ParagraphEditor {...(props as any)} />,
};

registerBlock(paragraphBlock);

export default paragraphBlock;
