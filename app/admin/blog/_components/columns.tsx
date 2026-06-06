"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocumentMetadata } from "@/src/core/storage/documentStorage";

const statusLabels: Record<string, string> = {
  draft: "پیش‌نویس",
  review: "در بازبینی",
  scheduled: "زمان‌بندی‌شده",
  published: "منتشرشده",
};

const statusVariants: Record<string, "secondary" | "outline" | "default"> = {
  draft: "secondary",
  review: "outline",
  scheduled: "outline",
  published: "default",
};

const formatPublishedAt = (value?: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const columns: ColumnDef<DocumentMetadata>[] = [
  {
    accessorKey: "title",
    header: "عنوان",
    cell: ({ row }) => (
      <div className="max-w-xs truncate font-medium">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "excerpt",
    header: "متن توضیح",
    cell: ({ row }) => {
      const excerpt = row.original.excerpt?.trim();
      return (
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {excerpt || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariants[status] ?? "outline"}>
          {statusLabels[status] ?? status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: "تاریخ انتشار",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatPublishedAt(row.original.publishedAt)}
      </span>
    ),
  },
  {
    id: "views",
    header: "بازدید",
    cell: () => <span className="text-sm text-muted-foreground">—</span>,
  },
  {
    id: "actions",
    header: "عملگر",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/builder/blog/${row.original.id}`}>ویرایش</Link>
      </Button>
    ),
  },
];
