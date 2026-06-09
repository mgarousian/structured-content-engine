"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ContentStatus } from "@/src/types/blocks";

type BlogPostSettingsProps = {
  documentId: string;
  slug: string;
  status: ContentStatus;
  publishedAt?: string;
  onSlugChange: (value: string) => void;
  onStatusChange: (value: ContentStatus) => void;
  onPublishedAtChange: (value: string | null) => void;
};

const supportedStatuses: ContentStatus[] = ["draft", "published"];

const statusLabels: Record<ContentStatus, string> = {
  draft: "پیش‌نویس",
  review: "Review",
  scheduled: "Scheduled",
  published: "منتشرشده",
};

const toDateTimeLocalValue = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - timezoneOffset * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const fromDateTimeLocalValue = (value: string) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
};

export default function BlogPostSettings({
  documentId,
  slug,
  status,
  publishedAt,
  onSlugChange,
  onStatusChange,
  onPublishedAtChange,
}: BlogPostSettingsProps) {
  const previewHref = `/page/blog/${documentId}`;
  const publicHref = slug ? `/blog/${slug}` : null;
  const publishedAtValue = toDateTimeLocalValue(publishedAt);

  return (
    <section className="mt-12 rounded-xl border border-border/60 bg-card/40 p-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            تنظیمات نوشته
          </h2>
          <Badge variant="secondary" className="font-normal">
            Secondary
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          جزئیات انتشار را بدون برهم‌زدن جریان نوشتن مدیریت کنید.
        </p>
      </div>

      <Separator className="my-5" />

      <div className="grid gap-5">
        <div className="grid gap-2">
          <label
            htmlFor="blog-post-slug"
            className="text-sm font-medium text-foreground"
          >
            اسلاگ
          </label>
          <Input
            id="blog-post-slug"
            value={slug}
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="post-slug"
            dir="ltr"
            className="font-mono"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-sm font-medium text-foreground">
              پیش‌نمایش
            </span>
            <Button asChild variant="outline" className="justify-start">
              <Link
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                مشاهده پیش‌نمایش
              </Link>
            </Button>
          </div>

          {status === "published" && publicHref ? (
            <div className="grid gap-2">
              <span className="text-sm font-medium text-foreground">
                لینک عمومی
              </span>
              <Button asChild variant="ghost" className="justify-start">
                <Link
                  href={publicHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  مشاهده صفحه عمومی
                </Link>
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium text-foreground">وضعیت</span>
          <div className="flex flex-wrap gap-2">
            {supportedStatuses.map((option) => {
              const isActive = status === option;

              return (
                <Button
                  key={option}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => onStatusChange(option)}
                >
                  {statusLabels[option]}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="blog-post-published-at"
            className="text-sm font-medium text-foreground"
          >
            تاریخ انتشار
          </label>
          <Input
            id="blog-post-published-at"
            type="datetime-local"
            value={publishedAtValue}
            onChange={(event) =>
              onPublishedAtChange(fromDateTimeLocalValue(event.target.value))
            }
          />
          <p className="text-xs text-muted-foreground">
            اگر برای پیش‌نویس تاریخ انتشار لازم نیست، این فیلد را خالی بگذارید.
          </p>
        </div>
      </div>
    </section>
  );
}
