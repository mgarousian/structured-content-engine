import BuilderEditor from '@/src/components/BuilderEditor';
import { getModuleConfigByKey } from '@/src/modules/registry';

type BuilderPageProps = {
  params: Promise<{
    module: string;
    id: string;
  }>;
};

export default async function Page({ params }: BuilderPageProps) {
  const { module, id } = await params;
  const normalizedModule = module.toLowerCase();
  const config = getModuleConfigByKey(normalizedModule);

  if (!config) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
        <main style={{ margin: '0 auto', maxWidth: 760, textAlign: 'right' }}>
          <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>ماژول پیدا نشد</h1>
          <p style={{ marginTop: 16, color: '#475569' }}>
            ماژول «{normalizedModule}» پشتیبانی نمی‌شود.
          </p>
        </main>
      </div>
    );
  }

  const initialDocument = config.createDefaultDocument(id);
  const storageKey = `content-engine:doc:${config.moduleKey}:${id}`;

  return <BuilderEditor storageKey={storageKey} initialPage={initialDocument} />;
}
