import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

const sections = [
  {
    title: "بلاگ",
    description: "مدیریت پست‌های بلاگ",
    path: "/admin/blog",
  },
];

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="داشبورد"
        description="به بخش مدیریت محتوا خوش آمدید."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.path}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ورود به بخش مدیریت ماژول.
              </p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild>
                <Link href={section.path}>ورود</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
