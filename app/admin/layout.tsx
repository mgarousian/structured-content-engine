import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminContent from "@/src/components/admin/AdminContent";
import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminSidebar from "@/src/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <AdminContent>{children}</AdminContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
