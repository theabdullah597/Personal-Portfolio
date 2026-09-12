"use client";

import * as React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface AdminLayoutShellProps {
  children: React.ReactNode;
  unreadCount?: number;
  userEmail?: string;
}

export function AdminLayoutShell({
  children,
  unreadCount = 0,
  userEmail = "admin@portfolio.dev",
}: AdminLayoutShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        unreadMessagesCount={unreadCount}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
