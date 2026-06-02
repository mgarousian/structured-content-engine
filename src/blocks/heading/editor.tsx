import React from 'react';
import { Input } from "@/components/ui/input";

type HeadingData = {
  text: string;
  level: 'h1' | 'h2' | 'h3';
};

export default function HeadingEditor({
  data,
  onChange,
}: {
  data: HeadingData;
  onChange: (d: HeadingData) => void;
}) {
  return (
    <div style={{ direction: 'rtl', textAlign: 'right' }}>
      <div style={{ marginBottom: 8 }}>
        <Input
          value={data.text}
          onChange={(e: any) => onChange({ ...data, text: e.target.value })}
          placeholder="متن عنوان"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 6 }}>سطح عنوان</label>
        <select
          value={data.level}
          onChange={(e) => onChange({ ...data, level: e.target.value as any })}
          style={{ padding: '6px 8px', borderRadius: 6 }}
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
      </div>
    </div>
  );
}
