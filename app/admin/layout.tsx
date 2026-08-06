import type { ReactNode } from "react";
import { AdminGateShell } from "@/components/admin/AdminGateShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-screen="admin">
      <AdminGateShell>{children}</AdminGateShell>
    </div>
  );
}
