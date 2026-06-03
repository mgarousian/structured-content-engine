import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import blogConfig from '@/src/modules/blog/config';
import landingConfig from '@/src/modules/landing/config';

const sections = [
  {
    title: 'بلاگ',
    description: 'مدیریت پست‌های بلاگ',
    path: blogConfig.adminPath,
    label: blogConfig.persianLabel,
  },
  {
    title: 'لندینگ‌پیج',
    description: 'مدیریت صفحات لندینگ',
    path: landingConfig.adminPath,
    label: landingConfig.persianLabel,
  },
];

export default function Page() {
  return (
    <div dir="rtl" style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f8fafc' }}>
      <main style={{ margin: '0 auto', maxWidth: 900, textAlign: 'right' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 32, color: '#0f172a' }}>پنل مدیریت</h1>
          <p style={{ margin: '10px 0 0', color: '#475569' }}>به بخش مدیریت محتوا خوش آمدید.</p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {sections.map((section) => (
            <Card key={section.path} style={{ padding: 20, borderRadius: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, color: '#0f172a' }}>{section.title}</h2>
                  <p style={{ margin: '8px 0 0', color: '#475569' }}>{section.description}</p>
                </div>
                <Link href={section.path}>
                  <Button>ورود</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
