'use client';

import React from 'react';
import { generateSlug } from '@/src/core/utils/slug';

interface BlogMetadataEditorProps {
  title: string;
  slug: string;
  excerpt?: string;
  status: 'draft' | 'published';
  onUpdate: (data: { title: string; slug: string; excerpt?: string; status: 'draft' | 'published' }) => void;
}

export default function BlogMetadataEditor({
  title,
  slug,
  excerpt = '',
  status,
  onUpdate,
}: BlogMetadataEditorProps) {
  const handleGenerateSlug = () => {
    onUpdate({
      title,
      slug: generateSlug(title),
      excerpt,
      status,
    });
  };

  return (
    <div style={{ display: 'grid', gap: 16, fontSize: 14 }}>
      <div>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#0f172a' }}>عنوان پست</label>
        <input
          type="text"
          value={title}
          onChange={(e) =>
            onUpdate({
              title: e.target.value,
              slug,
              excerpt,
              status,
            })
          }
          placeholder="عنوان پست..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            fontSize: 14,
            fontFamily: 'inherit',
            direction: 'rtl',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#0f172a' }}>اسلاگ</label>
        <div style={{ display: 'grid', gap: 8 }}>
          <input
            type="text"
            value={slug}
            onChange={(e) =>
              onUpdate({
                title,
                slug: e.target.value,
                excerpt,
                status,
              })
            }
            placeholder="slug-example"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              fontFamily: 'monospace',
              direction: 'ltr',
              textAlign: 'left',
            }}
          />
          <button
            onClick={handleGenerateSlug}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              cursor: 'pointer',
              fontSize: 13,
              color: '#64748b',
            }}
          >
            تولید خودکار
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#0f172a' }}>توضیح کوتاه</label>
        <textarea
          value={excerpt}
          onChange={(e) =>
            onUpdate({
              title,
              slug,
              excerpt: e.target.value,
              status,
            })
          }
          placeholder="خلاصه کوتاه درباره این پست..."
          rows={3}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            fontSize: 14,
            fontFamily: 'inherit',
            direction: 'rtl',
            resize: 'none',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, color: '#0f172a' }}>وضعیت</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() =>
              onUpdate({
                title,
                slug,
                excerpt,
                status: 'draft',
              })
            }
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: status === 'draft' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
              background: status === 'draft' ? '#eff6ff' : '#fff',
              cursor: 'pointer',
              fontSize: 14,
              color: status === 'draft' ? '#3b82f6' : '#64748b',
              fontWeight: status === 'draft' ? 600 : 500,
            }}
          >
            پیش‌نویس
          </button>
          <button
            onClick={() =>
              onUpdate({
                title,
                slug,
                excerpt,
                status: 'published',
              })
            }
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: status === 'published' ? '2px solid #10b981' : '1px solid #cbd5e1',
              background: status === 'published' ? '#ecfdf5' : '#fff',
              cursor: 'pointer',
              fontSize: 14,
              color: status === 'published' ? '#10b981' : '#64748b',
              fontWeight: status === 'published' ? 600 : 500,
            }}
          >
            منتشرشده
          </button>
        </div>
      </div>
    </div>
  );
}
