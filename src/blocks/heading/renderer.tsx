import React from 'react';

type HeadingData = {
  text: string;
  level: 'h1' | 'h2' | 'h3';
};

export default function HeadingRenderer({ data }: { data: HeadingData }) {
  const Tag = data.level as 'h1' | 'h2' | 'h3';
  return (
    <Tag dir="rtl" style={{ textAlign: 'right' }}>
      {data.text}
    </Tag>
  );
}
