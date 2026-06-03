"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../../src/blocks/heading';
import '../../../src/blocks/paragraph';
import { getBlock } from '../../../src/blocks/registry';
import { Button } from '@/components/ui/button';
import type { Page as PageType } from '../../../src/types/blocks';

const STORAGE_KEY = 'page-builder:mvp:demo';

const parsePage = (value: string | null): PageType | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.id === 'string' &&
      typeof parsed.slug === 'string' &&
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.blocks)
    ) {
      return parsed as PageType;
    }
    return null;
  } catch {
    return null;
  }
};

export default function DemoPage() {
  const [page, setPage] = useState<PageType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = parsePage(raw);
    setPage(parsed);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
        <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right' }}>
          <p style={{ color: '#64748b' }}>در حال بارگذاری...</p>
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
            <Link href="/builder/demo">
              <Button variant="outline">بازگشت به ویرایشگر</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1, color: '#0f172a' }}>{page.title}</h1>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>پیش‌نمایش عمومی صفحه شما</p>
          </div>
          <Link href="/builder/demo">
            <Button variant="outline">بازگشت به ویرایشگر</Button>
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
