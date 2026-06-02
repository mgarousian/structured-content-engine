import React from 'react';

type ParagraphData = {
  text: string;
};

export default function ParagraphRenderer({ data }: { data: ParagraphData }) {
  return (
    <p dir="rtl" style={{ textAlign: 'right' }}>
      {data.text}
    </p>
  );
}
