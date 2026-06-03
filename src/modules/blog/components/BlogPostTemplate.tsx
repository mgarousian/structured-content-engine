'use client';

import React from 'react';
import Link from 'next/link';
import { getBlock } from '@/src/blocks/registry';
import '@/src/blocks/registerBlocks';
import type { ContentDocument } from '@/src/types/blocks';

type BlogPostTemplateProps = {
  post: ContentDocument;
  backHref: string;
  backLabel: string;
  editorHref?: string;
};

export default function BlogPostTemplate({
  post,
  backHref,
  backLabel,
  editorHref,
}: BlogPostTemplateProps) {
  const pubDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fa-IR') : '—';
  const pubTime = post.publishedAt ? new Date(post.publishedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 700, textAlign: 'right' }}>
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Link href={backHref}>
            <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
              {backLabel}
            </button>
          </Link>
          {editorHref ? (
            <Link href={editorHref}>
              <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
                بازگشت به ویرایشگر
              </button>
            </Link>
          ) : null}
        </div>

        <article style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 20px 50px rgba(15,23,42,0.08)' }}>
          <header style={{ marginBottom: 32 }}>
            <h1 style={{ margin: 0, fontSize: 36, color: '#0f172a', fontWeight: 700, lineHeight: 1.2 }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p style={{ margin: '16px 0 0', fontSize: 18, color: '#475569', fontStyle: 'italic', lineHeight: 1.6 }}>
                {post.excerpt}
              </p>
            )}

            <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#64748b', marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
              <span>{post.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}</span>
              {post.publishedAt && (
                <time>
                  {pubDate}
                  {pubTime ? ` - ${pubTime}` : ''}
                </time>
              )}
            </div>
          </header>

          <div style={{ marginTop: 32 }}>
            {post.blocks && post.blocks.length > 0 ? (
              <div style={{ display: 'grid', gap: 20 }}>
                {post.blocks.map((block) => {
                  const def = getBlock(block.type);
                  if (!def || !def.renderer) {
                    return (
                      <div key={block.id} style={{ padding: 12, backgroundColor: '#fef2f2', borderRadius: 8, color: '#dc2626' }}>
                        بلاک نامعلوم: {block.type}
                      </div>
                    );
                  }
                  return (
                    <div key={block.id}>
                      {def.renderer(block.data)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>
                هیچ محتوایی برای این پست وجود ندارد.
              </div>
            )}
          </div>
        </article>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href={backHref}>
            <button style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #94a3b8', background: 'white', cursor: 'pointer' }}>
              {backLabel}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
