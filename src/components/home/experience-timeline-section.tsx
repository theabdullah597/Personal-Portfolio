"use client";

import Link from "next/link";
import { Briefcase, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Experience } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";

interface ExperienceTimelineSectionProps {
  experiences: Experience[];
}

export function ExperienceTimelineSection({
  experiences,
}: ExperienceTimelineSectionProps) {
  const sorted = [...experiences].sort((a, b) => a.display_order - b.display_order);

  if (sorted.length === 0) return null;

  return (
    <section className="py-24 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                <Briefcase className="w-3.5 h-3.5" />
                Career Journey
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Work Experience
              </h2>
              <p className="text-base text-muted-foreground max-w-xl">
                Professional history leading engineering teams, architecting distributed systems, and shipping production applications.
              </p>
            </div>

            <Link href="/experience">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 rounded-full h-10 px-5 border-border/80 hover:bg-card">
                Full Career History
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Timeline View */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/25 space-y-12 ml-2 sm:ml-4">
          {sorted.map((exp, idx) => (
            <FadeIn key={exp.id} delay={0.1 * (idx % 4)} direction="left">
              <div className="relative group">
                {/* Timeline marker node */}
                <div className="absolute -left-[33px] sm:-left-[41px] top-2 w-5 h-5 rounded-full border-2 border-primary bg-card flex items-center justify-center group-hover:scale-125 transition-transform shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <div className="p-7 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-soft-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-foreground">
                          {exp.role}
                        </h3>
                        <span className="text-sm font-normal text-muted-foreground">
                          at
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {exp.company}
                        </span>
                        {exp.currently_working && (
                          <Badge variant="emerald" className="text-[11px] py-0.5 px-2.5 rounded-full font-semibold">
                            Current Position
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formatDate(exp.start_date)} —{" "}
                          {exp.currently_working ? "Present" : formatDate(exp.end_date)}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line font-normal">
                    {exp.description}
                  </p>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs bg-muted/70 text-foreground/85 font-medium border border-border/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
