import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getBlock } from '@/src/blocks/registry';
import '@/src/blocks/registerBlocks';
import { getPublishedBlogDocumentBySlug } from '@/src/modules/blog/api/server';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogDocumentBySlug(slug);

  if (!post) {
    return {
      title: 'Blog',
      description: '',
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt || '';
  const image = post.seo?.image?.trim();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

const fallbackAuthorName = 'مسعود گاروسیان';

const formatPersianDate = (value?: string) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogDocumentBySlug(slug);

  if (!post) {
    notFound();
  }

  const authorName =
    ('authorName' in post && typeof post.authorName === 'string' && post.authorName) ||
    ('author' in post && typeof post.author === 'string' && post.author) ||
    fallbackAuthorName;
  const displayDate = formatPersianDate(post.publishedAt ?? post.updatedAt);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 px-6 py-6">
      <main className="mx-auto max-w-3xl text-right">
        <div className="mb-4 flex justify-start">
          <Button asChild variant="outline">
            <Link href="/blog">بازگشت</Link>
          </Button>
        </div>

        <article className="rounded-2xl bg-white p-8 shadow-sm">
          <header className="mb-8 space-y-4">
            <p className="text-right text-sm text-muted-foreground">
              {authorName} | {displayDate}
            </p>

            <h1 className="text-right text-3xl font-bold leading-relaxed text-slate-900">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-right text-base italic leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            <div className="mt-6 flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </header>

          <div className="mt-8">
            {post.blocks && post.blocks.length > 0 ? (
              <div className="grid gap-5">
                {post.blocks.map((block) => {
                  const def = getBlock(block.type);
                  if (!def || !def.renderer) {
                    return (
                      <div key={block.id} className="rounded-lg bg-red-50 p-3 text-red-600">
                        بلاک نامعلوم: {block.type}
                      </div>
                    );
                  }
                  return <div key={block.id}>{def.renderer(block.data)}</div>;
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400">
                هیچ محتوایی برای این پست وجود ندارد.
              </div>
            )}
          </div>
        </article>

      </main>
    </div>
  );
}
