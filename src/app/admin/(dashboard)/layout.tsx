import { getAdminUser } from "@/actions/auth";
import { getContactMessages } from "@/lib/supabase/data-service";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  // If not authenticated, force redirect to login
  if (!user) {
    redirect("/admin/login");
  }

  const messages = await getContactMessages();
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayoutShell
      unreadCount={unreadCount}
      userEmail={user?.email || "admin@portfolio.dev"}
    >
      {children}
    </AdminLayoutShell>
  );
}
