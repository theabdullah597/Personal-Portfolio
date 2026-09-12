"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";

interface PublicNavbarProps {
  resumeUrl?: string | null;
  availableForHire?: boolean;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar({
  resumeUrl = "#",
  availableForHire = true,
}: PublicNavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-card/90 backdrop-blur-xl border-b border-border py-3 shadow-soft"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group">
          <BrandLogo
            size="md"
            subtitle={availableForHire ? "Available for work" : undefined}
          />
        </Link>

        {/* Minimal Rounded Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-card/80 border border-border rounded-full px-4 py-1.5 shadow-soft backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/75 hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-border bg-card hover:bg-secondary/60 text-foreground transition-all shadow-soft"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              Resume
            </a>
          )}

          <Link href="/contact">
            <Button
              size="sm"
              className="h-9 px-4 text-xs font-bold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25 transition-transform active:scale-95"
            >
              Let&apos;s Talk
            </Button>
          </Link>
        </div>

        {/* Mobile menu triggers */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-card border border-border text-foreground hover:bg-secondary shadow-soft transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/98 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-soft-lg">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground/80 hover:bg-secondary/70 hover:text-foreground"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && <ArrowRight className="w-4 h-4 text-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border flex items-center gap-3">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Resume
              </a>
            )}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1"
            >
              <Button
                size="sm"
                className="w-full h-10 text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20"
              >
                Let&apos;s Talk
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
