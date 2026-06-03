"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDocument } from '@/src/core/storage/documentStorage';
import { isModuleKey } from '@/src/modules/registry';
import { getBlock } from '@/src/blocks/registry';
import BlogPostTemplate from '@/src/modules/blog/components/BlogPostTemplate';
import type { ContentDocument } from '@/src/types/blocks';

type PreviewPageClientProps = {
  moduleKey: string;
  documentId: string;
};

export default function PreviewPageClient({ moduleKey, documentId }: PreviewPageClientProps) {
  const [page, setPage] = useState<ContentDocument | null>(null);
  const [loaded, setLoaded] = useState(false);
  const normalizedModule = moduleKey.toLowerCase();

  useEffect(() => {
    if (!isModuleKey(normalizedModule)) {
      setLoaded(true);
      return;
    }
    const document = getDocument(normalizedModule, documentId);
    setPage(document);
    setLoaded(true);
  }, [normalizedModule, documentId]);

  if (!loaded) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
        <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right' }}>
          <p style={{ color: '#64748b' }}>در حال بارگذاری...</p>
        </main>
      </div>
    );
  }

  if (!isModuleKey(normalizedModule)) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
        <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right' }}>
          <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>ماژول پیدا نشد</h1>
          <p style={{ marginTop: 16, color: '#475569' }}>این صفحه پیش‌نمایش تنها برای بلاگ و لندینگ کار می‌کند.</p>
        </main>
      </div>
    );
  }

  if (!page) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
        <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right', backgroundColor: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
          <p style={{ fontSize: 18, color: '#0f172a' }}>صفحه‌ای برای نمایش وجود ندارد.</p>
          <div style={{ marginTop: 20 }}>
            <Link href={`/admin/${normalizedModule}`}>
              <button style={{ padding: '8px 16px', border: '1px solid #94a3b8', borderRadius: 8, background: 'white', cursor: 'pointer' }}>
                بازگشت به فهرست
              </button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (normalizedModule === 'blog') {
    return (
      <BlogPostTemplate
        post={page}
        backHref={`/builder/${normalizedModule}/${documentId}`}
        backLabel="بازگشت به ویرایشگر"
      />
    );
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>{page.title}</h1>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>{page.status}</p>
          </div>
          <Link href={`/builder/${normalizedModule}/${documentId}`}>
            <button style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
              بازگشت به ویرایشگر
            </button>
          </Link>
        </div>

        <section style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
          {page.blocks.map((block) => {
            const def = getBlock(block.type);
            if (!def || !def.renderer) {
              return (
                <div key={block.id} style={{ marginBottom: 18, color: '#334155' }}>
                  بلاک ناشناخته: {block.type}
                </div>
              );
            }
            return (
              <div key={block.id} style={{ marginBottom: 24 }}>
                {def.renderer(block.data)}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
