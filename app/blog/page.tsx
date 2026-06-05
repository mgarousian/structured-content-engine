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
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 700, textAlign: 'right' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 40, color: '#0f172a', fontWeight: 700 }}>بلاگ</h1>
          <p style={{ margin: '8px 0 0', fontSize: 16, color: '#64748b' }}>
            آخرین نوشته‌ها و مقالات
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', color: '#64748b' }}>
            هنوز پستی منتشر نشده است.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24 }}>
            {posts.map((post) => {
              const displayDate = formatPersianDate(post.publishedAt ?? post.updatedAt);
              const authorName =
                ('authorName' in post && typeof post.authorName === 'string' && post.authorName) ||
                ('author' in post && typeof post.author === 'string' && post.author) ||
                fallbackAuthorName;
              return (
                <article
                  key={post.slug}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                  style={{
                    boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
                  }}
                >
                  <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>
                    {authorName} | {displayDate}
                  </p>
                  <h2 style={{ margin: 0, fontSize: 22, color: '#0f172a', fontWeight: 600 }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ margin: '7px 0 22px', fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                      {post.excerpt}
                    </p>
                  )}
                  <Button asChild style={{ backgroundColor: '#4182E4' }}>
                    <Link href={`/blog/${post.slug}`}>ادامه خواندن</Link>
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
