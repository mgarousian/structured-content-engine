import React from 'react';
import BuilderEditor from '@/src/components/BuilderEditor';
import landingConfig from '@/src/modules/landing/config';

export default function Page() {
  return (
    <BuilderEditor storageKey={landingConfig.storageKey} initialPage={landingConfig.defaultDocument} allowedBlocks={landingConfig.allowedBlocks} />
  );
}
