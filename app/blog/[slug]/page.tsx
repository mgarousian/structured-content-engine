'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { listDocuments, getDocument } from '@/src/core/storage/documentStorage';
import BlogPostTemplate from '@/src/modules/blog/components/BlogPostTemplate';
import type { ContentDocument } from '@/src/types/blocks';

export default function Page() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [post, setPost] = useState<ContentDocument | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const allDocs = listDocuments('blog');
    const doc = allDocs.find((d) => d.slug === slug);

    if (!doc) {
      setNotFound(true);
      setLoaded(true);
      return;
    }

    if (doc.status !== 'published') {
      setNotFound(true);
      setLoaded(true);
      return;
    }

    const fullDoc = getDocument('blog', doc.id);
    if (fullDoc) {
      setPost(fullDoc);
    } else {
      setNotFound(true);
    }

    setLoaded(true);
  }, [slug]);

  if (!loaded) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc', textAlign: 'center', color: '#64748b' }}>
        درحال بارگذاری...
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
        <main style={{ margin: '0 auto', maxWidth: 700, textAlign: 'right' }}>
          <div style={{ marginBottom: 40 }}>
            <Link href="/blog">
              <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
                ← بازگشت به بلاگ
              </button>
            </Link>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>پست پیدا نشد</h1>
            <p style={{ margin: '12px 0 0', color: '#64748b' }}>متاسفانه این پست وجود ندارد یا منتشر نشده است.</p>
          </div>
        </main>
      </div>
    );
  }

  return <BlogPostTemplate post={post} backHref="/blog" backLabel="← بازگشت به بلاگ" />;
}
