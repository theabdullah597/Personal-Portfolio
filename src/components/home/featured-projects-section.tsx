"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Code2, Sparkles, Layers } from "lucide-react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const featuredList = projects
    .filter((p) => p.featured && p.published)
    .sort((a, b) => a.display_order - b.display_order);

  if (featuredList.length === 0) return null;

  return (
    <section className="py-24 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Selected Engineering Case Studies
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Featured Projects
              </h2>
              <p className="text-base text-muted-foreground max-w-xl">
                Production systems, generative AI engines, and full-stack platforms engineered with high standards of reliability and UX.
              </p>
            </div>

            <Link href="/projects">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 rounded-full h-10 px-5 border-border/80 hover:bg-card">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredList.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <div className="group rounded-3xl border border-border/80 bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1.5 flex flex-col justify-between h-full">
                {/* Media Thumbnail */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative block aspect-[16/9] w-full overflow-hidden bg-muted/60 border-b border-border/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="backdrop-blur-md bg-card/90 text-foreground border border-border/80 shadow-xs rounded-full px-3 py-1 text-xs font-medium">
                      {project.category}
                    </Badge>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-normal">
                      {project.short_description}
                    </p>
                  </div>

                  {/* Metrics Highlights if available */}
                  {project.metrics && Object.keys(project.metrics).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-border/40 text-xs">
                      {Object.entries(project.metrics).slice(0, 3).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-[10px] text-muted-foreground block truncate font-medium">{key}</span>
                          <span className="font-bold text-primary font-mono text-sm">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Tags & Deep Dive link */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-xs bg-muted/70 text-foreground/85 font-medium border border-border/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all shrink-0 shadow-xs"
                    >
                      Case Study
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
