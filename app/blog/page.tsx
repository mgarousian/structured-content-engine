import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { listPublishedBlogSummaries } from '@/src/modules/blog/api/server';
import type { DocumentMetadata } from '@/src/core/storage/documentStorage';

const fallbackAuthorName = 'مسعود گروسیان';

const formatPersianDate = (value?: string) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export default async function Page() {
  const posts: DocumentMetadata[] = (await listPublishedBlogSummaries()).sort((left, right) => {
    const leftDate = left.publishedAt ?? left.updatedAt ?? '';
    const rightDate = right.publishedAt ?? right.updatedAt ?? '';
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 px-6 py-6">
      <main className="mx-auto max-w-3xl text-right">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">بلاگ</h1>
          <p className="mt-2 text-base text-muted-foreground">
            آخرین نوشته‌ها و مقالات
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-muted-foreground shadow-sm">
            هنوز پستی منتشر نشده است.
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => {
              const displayDate = formatPersianDate(post.publishedAt ?? post.updatedAt);
              const authorName =
                ('authorName' in post && typeof post.authorName === 'string' && post.authorName) ||
                ('author' in post && typeof post.author === 'string' && post.author) ||
                fallbackAuthorName;
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  aria-label={`مشاهده پست ${post.title}`}
                  className="block"
                >
                  <article className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md hover:shadow-black/5">
                    <p className="mb-3 text-sm text-muted-foreground">
                      {authorName} | {displayDate}
                    </p>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 mb-5 text-base leading-relaxed text-slate-600">
                        {post.excerpt}
                      </p>
                    )}
                    <Button className='cursor-pointer' style={{ backgroundColor: '#4182E4' }}>
                      ادامه خواندن
                    </Button>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
