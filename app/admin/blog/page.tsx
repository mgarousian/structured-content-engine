"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import type { DocumentMetadata } from "@/src/core/storage/documentStorage";
import blogConfig from "@/src/modules/blog/config";
import {
  createBlogDocument,
  listBlogDocuments,
} from "@/src/modules/blog/api/client";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().slice(0, 8)
    : `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export default function Page() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const loadDocuments = async () => {
    const allDocuments = await listBlogDocuments();
    const sortedDocuments = [...allDocuments].sort((left, right) => {
      const leftDate = left.updatedAt ?? left.publishedAt ?? left.createdAt ?? "";
      const rightDate =
        right.updatedAt ?? right.publishedAt ?? right.createdAt ?? "";
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

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="مدیریت پست‌های بلاگ"
        // description="لیست اسناد بلاگ را در اینجا مدیریت کنید."
        actions={
          <>
            <Button size="lg" onClick={handleCreate}>ساخت پست جدید</Button>
          </>
        }
      />

      {!loaded ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
          </CardContent>
        </Card>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">هیچ سند بلاگی پیدا نشد.</p>
          </CardContent>
        </Card>
      ) : (
        <DataTable columns={columns} data={documents} />
      )}
    </div>
  );
}
