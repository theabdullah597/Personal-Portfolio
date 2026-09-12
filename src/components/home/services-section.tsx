"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const activeServices = services
    .filter((s) => s.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  if (activeServices.length === 0) return null;

  return (
    <section className="py-24 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                What I Offer
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Services & Capabilities
              </h2>
              <p className="text-base text-muted-foreground max-w-xl">
                Specialized engineering consulting, full-stack application development, and generative AI workflow implementations.
              </p>
            </div>

            <Link href="/services">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 rounded-full h-10 px-5 border-border/80 hover:bg-card">
                All Offerings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeServices.map((srv) => (
            <StaggerItem key={srv.id} className="h-full">
              <div className="p-8 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 flex flex-col justify-between space-y-7 h-full">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-xl font-bold text-foreground">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {srv.description}
                    </p>
                  </div>

                  {srv.features && srv.features.length > 0 && (
                    <ul className="space-y-2.5 pt-3 border-t border-border/50">
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

                <Link href="/contact" className="pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-full h-11 border-border/80 hover:border-primary/50 hover:bg-card shadow-xs">
                    Discuss Project
                  </Button>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
