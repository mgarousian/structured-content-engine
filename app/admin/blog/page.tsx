"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import blogConfig from '@/src/modules/blog/config';
import AdminPageHeader from '@/src/components/admin/AdminPageHeader';
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
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="مدیریت پست‌های بلاگ"
        description="لیست اسناد بلاگ را در اینجا مدیریت کنید."
        actions={(
          <>
            <Button asChild variant="outline">
              <Link href="/admin">بازگشت به پنل مدیریت</Link>
            </Button>
            <Button onClick={handleCreate}>ساخت پست جدید</Button>
          </>
        )}
      />

      {loaded && documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">هیچ سند بلاگی پیدا نشد.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => {
            const pubDate = doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('fa-IR') : '—';
            const pubTime = doc.publishedAt ? new Date(doc.publishedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '';
            const isPublished = doc.status === 'published';
            const openHref = isPublished && doc.slug ? `/blog/${doc.slug}` : `/page/blog/${doc.id}`;
            const openLabel = isPublished && doc.slug ? 'مشاهده پست' : 'مشاهده پیش‌نمایش';
            return (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <CardTitle>{doc.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doc.slug}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {doc.excerpt ? (
                    <p className="text-sm text-muted-foreground">{doc.excerpt}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      وضعیت: <strong>{statusLabels[doc.status] ?? doc.status}</strong>
                    </span>
                    {doc.publishedAt ? (
                      <span>
                        منتشر شده: <strong>{pubDate} {pubTime}</strong>
                      </span>
                    ) : null}
                    {doc.updatedAt ? (
                      <span>
                        به‌روزرسانی: <strong>{new Date(doc.updatedAt).toLocaleDateString('fa-IR')}</strong>
                      </span>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-start gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/builder/${moduleKey}/${doc.id}`}>ویرایش</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={openHref}>{openLabel}</Link>
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(doc.id, doc.status)}
                      variant="outline"
                    >
                      {isPublished ? 'پیش‌نویس کردن' : 'منتشر کردن'}
                    </Button>
                    <Button
                      onClick={() => handleDelete(doc.id, doc.title)}
                      variant="destructive"
                    >
                      حذف
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
