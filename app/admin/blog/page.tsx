"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import blogConfig from '@/src/modules/blog/config';
import { createBlogDocument, deleteBlogDocument, getBlogDocument, listBlogDocuments, saveBlogDocument } from '@/src/modules/blog/api/client';
import type { DocumentMetadata } from '@/src/core/storage/documentStorage';
import type { ContentDocument } from '@/src/types/blocks';

const statusLabels: Record<string, string> = {
  draft: 'پیش‌نویس',
  review: 'در بازبینی',
  scheduled: 'زمان‌بندی‌شده',
  published: 'منتشرشده',
};

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().slice(0, 8)
    : `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export default function Page() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const moduleKey = 'blog';

  const loadDocuments = async () => {
    const allDocuments = await listBlogDocuments();
    const sortedDocuments = [...allDocuments].sort((left, right) => {
      const leftDate = left.updatedAt ?? left.publishedAt ?? left.createdAt ?? '';
      const rightDate = right.updatedAt ?? right.publishedAt ?? right.createdAt ?? '';
      return new Date(rightDate).getTime() - new Date(leftDate).getTime();
    });
    setDocuments(sortedDocuments);
  };

  useEffect(() => {
    loadDocuments().finally(() => setLoaded(true));
  }, []);

  const handleCreate = async () => {
    const id = createId();
    const document = blogConfig.createDefaultDocument(id);
    await createBlogDocument(document);
    router.push(`/builder/blog/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(`آیا مطمئن هستید که می‌خواهید این پست را حذف کنید؟\n\n"${title}"`);
    if (confirmed) {
      deleteBlogDocument(id).then(() => loadDocuments());
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const document = await getBlogDocument(id);
    if (!document) return;
    const publishedAt =
      newStatus === 'published' && !document.publishedAt
        ? new Date().toISOString()
        : document.publishedAt;
    const updatedDocument: ContentDocument = {
      ...document,
      status: newStatus as 'draft' | 'published',
      publishedAt: newStatus === 'published' ? publishedAt : document.publishedAt,
    };
    await saveBlogDocument(updatedDocument);
    await loadDocuments();
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 900, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>مدیریت پست‌های بلاگ</h1>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>لیست اسناد بلاگ را در اینجا مدیریت کنید.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/admin">
              <button style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
                بازگشت به پنل مدیریت
              </button>
            </Link>
            <button
              onClick={handleCreate}
              style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 500 }}
            >
              ساخت پست جدید
            </button>
          </div>
        </div>

        {loaded && documents.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
            هیچ سند بلاگی پیدا نشد.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {documents.map((doc) => {
              const pubDate = doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('fa-IR') : '—';
              const pubTime = doc.publishedAt ? new Date(doc.publishedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '';
              const isPublished = doc.status === 'published';
              const openHref = isPublished && doc.slug ? `/blog/${doc.slug}` : `/page/blog/${doc.id}`;
              const openLabel = isPublished && doc.slug ? 'مشاهده پست' : 'مشاهده پیش‌نمایش';
              return (
                <div key={doc.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>{doc.title}</h2>
                      <p style={{ margin: '6px 0 8px', fontSize: 14, color: '#64748b' }}>
                        {doc.slug}
                      </p>
                      {doc.excerpt && (
                        <p style={{ margin: '0 0 10px', fontSize: 14, color: '#475569' }}>
                          {doc.excerpt}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b', flexWrap: 'wrap' }}>
                        <span>
                          وضعیت: <strong style={{ color: isPublished ? '#10b981' : '#3b82f6' }}>{statusLabels[doc.status] ?? doc.status}</strong>
                        </span>
                        {doc.publishedAt && (
                          <span>
                            منتشر شده: <strong>{pubDate} {pubTime}</strong>
                          </span>
                        )}
                        {doc.updatedAt && (
                          <span>
                            به‌روزرسانی: <strong>{new Date(doc.updatedAt).toLocaleDateString('fa-IR')}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minWidth: 'fit-content' }}>
                      <Link href={`/builder/${moduleKey}/${doc.id}`}>
                        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer', fontSize: 14 }}>
                          ویرایش
                        </button>
                      </Link>
                      <Link href={openHref}>
                        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer', fontSize: 14 }}>
                          {openLabel}
                        </button>
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(doc.id, doc.status)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          border: isPublished ? '1px solid #10b981' : '1px solid #3b82f6',
                          background: isPublished ? '#ecfdf5' : '#eff6ff',
                          color: isPublished ? '#10b981' : '#3b82f6',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {isPublished ? 'پیش‌نویس کردن' : 'منتشر کردن'}
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          border: '1px solid #f87171',
                          background: '#fef2f2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
