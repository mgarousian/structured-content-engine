import React from 'react';
import { Input } from '@/components/ui/input';

type ImageData = {
  src: string;
  alt: string;
  caption?: string;
};

export default function ImageEditor({
  data,
  onChange,
}: {
  data: ImageData;
  onChange: (d: ImageData) => void;
}) {
  return (
    <div style={{ direction: 'rtl', textAlign: 'right', display: 'grid', gap: 12 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 6 }}>آدرس تصویر</label>
        <Input
          value={data.src}
          onChange={(e) => onChange({ ...data, src: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 6 }}>متن جایگزین</label>
        <Input
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          placeholder="متن تصویر"
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 6 }}>کپشن</label>
        <Input
          value={data.caption ?? ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="کپشن تصویر"
        />
      </div>
    </div>
  );
}
