import React from 'react';
import { Textarea } from '@/components/ui/textarea';

type ParagraphData = {
  text: string;
};

export default function ParagraphEditor({
  data,
  onChange,
}: {
  data: ParagraphData;
  onChange: (d: ParagraphData) => void;
}) {
  return (
    <div style={{ direction: 'rtl', textAlign: 'right' }}>
      <Textarea
        value={data.text}
        onChange={(e: any) => onChange({ ...data, text: e.target.value })}
        placeholder="متن پاراگراف"
      />
    </div>
  );
}
