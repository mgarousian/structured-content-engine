import type { ReactNode } from "react";

type AdminContentProps = {
  children: ReactNode;
};

export default function AdminContent({ children }: AdminContentProps) {
  return <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>;
}
