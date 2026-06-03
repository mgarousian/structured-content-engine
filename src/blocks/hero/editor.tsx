import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { HeroBlockData } from '../../types/blocks';

export default function HeroEditor({
  data,
  onChange,
}: {
  data: HeroBlockData;
  onChange: (d: HeroBlockData) => void;
}) {
  return (
    <div style={{ direction: 'rtl', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>عنوان</label>
        <Input
          value={data.title}
          onChange={(e: any) => onChange({ ...data, title: e.target.value })}
          placeholder="عنوان اصلی لندینگ"
          dir="rtl"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>زیرعنوان</label>
        <Textarea
          value={data.subtitle || ''}
          onChange={(e: any) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="توضیح کوتاهی درباره ارزش پیشنهادی صفحه"
          dir="rtl"
          style={{ minHeight: '80px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>متن دکمه CTA</label>
        <Input
          value={data.primaryCtaText || ''}
          onChange={(e: any) => onChange({ ...data, primaryCtaText: e.target.value })}
          placeholder="شروع کنید"
          dir="rtl"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>لینک دکمه CTA</label>
        <Input
          value={data.primaryCtaHref || ''}
          onChange={(e: any) => onChange({ ...data, primaryCtaHref: e.target.value })}
          placeholder="https://..."
          dir="rtl"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>URL تصویر پس‌زمینه</label>
        <Input
          value={data.imageSrc || ''}
          onChange={(e: any) => onChange({ ...data, imageSrc: e.target.value })}
          placeholder="https://..."
          dir="rtl"
        />
      </div>
    </div>
  );
}
