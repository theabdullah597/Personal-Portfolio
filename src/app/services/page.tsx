import { getServices, getProfile } from "@/lib/supabase/data-service";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Engineering Services & Specialized Offerings",
  description:
    "Full-stack web application development, custom AI & RAG system integration, and cloud backend engineering.",
};

export default async function ServicesPage() {
  const [services, profile] = await Promise.all([
    getServices(true),
    getProfile(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-canvas text-foreground">
      <PublicNavbar
        resumeUrl={profile.resume_url}
        availableForHire={profile.available_for_hire}
      />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
          <div className="space-y-3 text-center sm:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Technical Solutions
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Services & Consulting
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              Specialized engineering consulting, full-stack application development, and generative AI workflow implementations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-8 rounded-3xl border border-border/80 bg-card flex flex-col justify-between space-y-7 shadow-soft hover:shadow-soft-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <div className="space-y-2.5">
                    <h2 className="text-xl font-bold text-foreground">
                      {srv.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {srv.description}
                    </p>
                  </div>

                  {srv.features && srv.features.length > 0 && (
                    <ul className="space-y-2.5 pt-4 border-t border-border/60">
                      {srv.features.map((f, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-muted-foreground flex items-start gap-2.5 font-normal"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-2">
                  <Link href="/contact">
                    <Button className="w-full text-xs font-semibold rounded-full h-11 gap-2 shadow-soft hover:shadow-soft-lg">
                      Get Started
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
