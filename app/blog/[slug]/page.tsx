import { notFound } from 'next/navigation';
import BlogPostTemplate from '@/src/modules/blog/components/BlogPostTemplate';
import { getPublishedBlogDocumentBySlug } from '@/src/modules/blog/api/server';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogDocumentBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostTemplate post={post} backHref="/blog" backLabel="← بازگشت به بلاگ" />;
}
