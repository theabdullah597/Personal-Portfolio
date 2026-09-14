import Link from "next/link";
import { getSocialLinks } from "@/lib/supabase/data-service";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SocialIcon } from "@/components/ui/social-icon";
import { ShieldCheck } from "lucide-react";

export async function PublicFooter() {
  const socialLinks = await getSocialLinks();

  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md pt-16 pb-10 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <BrandLogo size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Full-Stack Software Engineer & AI Systems Architect. Crafting high-performance web platforms, intelligent agents, and creative digital products.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-primary transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links & CMS Login */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks
                .filter((s) => s.is_active)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-border/80 bg-background/60 hover:border-primary hover:text-primary text-muted-foreground transition-all shadow-xs flex items-center justify-center hover:scale-105"
                    title={link.platform}
                    aria-label={link.platform}
                  >
                    <SocialIcon platform={link.platform} className="w-4 h-4" />
                  </a>
                ))}
            </div>

            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >

              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Abdullah. Crafted with Next.js, Tailwind CSS & Supabase.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px]">System Status: Available for Projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
