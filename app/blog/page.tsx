import Link from 'next/link';
import { listPublishedBlogSummaries } from '@/src/modules/blog/api/server';
import type { DocumentMetadata } from '@/src/core/storage/documentStorage';

export default async function Page() {
  const posts: DocumentMetadata[] = (await listPublishedBlogSummaries()).sort((left, right) => {
    const leftDate = left.publishedAt ?? left.updatedAt ?? '';
    const rightDate = right.publishedAt ?? right.updatedAt ?? '';
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 700, textAlign: 'right' }}>
        <div style={{ marginBottom: 40 }}>
          <Link href="/">
            <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
              ← صفحه اصلی
            </button>
          </Link>
        </div>

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
              const pubDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fa-IR') : '—';
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <article
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                    style={{
                      boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: 22, color: '#0f172a', fontWeight: 600 }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ margin: '12px 0 16px', fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                        {post.excerpt}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#64748b' }}>
                      <span>{pubDate}</span>
                      <span style={{ color: '#3b82f6' }}>ادامه خواندن →</span>
                    </div>
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
