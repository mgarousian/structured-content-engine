"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createDocument, listDocuments } from '@/src/core/storage/documentStorage';
import landingConfig from '@/src/modules/landing/config';
import type { DocumentMetadata } from '@/src/core/storage/documentStorage';

const statusLabels: Record<string, string> = {
  draft: 'پیش‌نویس',
  review: 'در بازبینی',
  scheduled: 'زمان‌بندی‌شده',
  published: 'منتشر شده',
};

const createId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().slice(0, 8)
    : `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export default function Page() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const moduleKey = 'landing';

  useEffect(() => {
    setDocuments(listDocuments(moduleKey));
    setLoaded(true);
  }, []);

  const handleCreate = () => {
    const id = createId();
    const document = landingConfig.createDefaultDocument(id);
    createDocument(moduleKey, document);
    router.push(`/builder/${moduleKey}/${id}`);
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 900, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>مدیریت لندینگ‌ها</h1>
            <p style={{ margin: '10px 0 0', color: '#475569' }}>لیست صفحات لندینگ را در اینجا مدیریت کنید.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/admin">
              <button style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
                بازگشت به پنل مدیریت
              </button>
            </Link>
            <button
              onClick={handleCreate}
              style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}
            >
              ساخت لندینگ جدید
            </button>
          </div>
        </div>

        {loaded && documents.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
            هیچ لندینگی پیدا نشد.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>{doc.title}</h2>
                    <p style={{ margin: '6px 0 0', color: '#64748b' }}>
                      {statusLabels[doc.status] ?? doc.status}
                      {doc.updatedAt ? ` • به‌روزرسانی شده در ${new Date(doc.updatedAt).toLocaleString('fa-IR')}` : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link href={`/builder/${moduleKey}/${doc.id}`}>
                      <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
                        ویرایش
                      </button>
                    </Link>
                    <Link href={`/page/${moduleKey}/${doc.id}`}>
                      <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
                        پیش‌نمایش
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
