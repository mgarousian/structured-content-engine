import React from 'react';
import BuilderEditor from '@/src/components/BuilderEditor';
import blogConfig from '@/src/modules/blog/config';

export default function Page() {
  return <BuilderEditor storageKey={blogConfig.storageKey} initialPage={blogConfig.defaultDocument} allowedBlocks={blogConfig.allowedBlocks} />;
}
