import PreviewPageClient from '@/src/components/PreviewPageClient';

type PageProps = {
  params: Promise<{
    module: string;
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { module, id } = await params;
  return <PreviewPageClient moduleKey={module} documentId={id} />;
}
