"use client";

import * as React from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  userEmail?: string;
}

export function AdminHeader({
  onOpenMobileMenu,
  userEmail = "admin@portfolio.dev",
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Mode
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="flex items-center gap-2 pl-3 border-l border-border/70">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold leading-tight text-foreground">
              {userEmail.split("@")[0]}
            </p>
            <p className="text-[10px] text-muted-foreground">Portfolio Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
