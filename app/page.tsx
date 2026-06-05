import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-10 py-48">
        <Card className="w-full">
          <CardHeader className="space-y-4 text-right">
            <CardTitle className="text-center text-3xl leading-tight">
              Structured Content Engine
            </CardTitle>
            <CardDescription className="text-base text-right leading-relaxed">
              نسخه‌ی فعلی این پروژه یک موتور محتوای ساختاریافته برای بلاگ است؛
              با ذخیره‌سازی فایل‌محور، ادیتور بلوکی، پیش‌نمایش داخلی و خروجی
              عمومی.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center gap-3 sm:flex-row-reverse">
            <Button asChild>
              <Link href="/blog">مشاهده بلاگ</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/admin/blog">مدیریت پست‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}