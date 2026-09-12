"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles, Filter, ExternalLink, Code2 } from "lucide-react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PublicProjectsExplorerProps {
  initialProjects: Project[];
}

export function PublicProjectsExplorer({
  initialProjects,
}: PublicProjectsExplorerProps) {
  const [projects] = React.useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...cats];
  }, [projects]);

  const filtered = React.useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-border/80 shadow-soft">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by technology, keyword, or name..."
            className="pl-10 h-11 rounded-2xl bg-background/60 border-border/80 focus-visible:ring-primary text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/70 hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 space-y-3">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No projects match your filter</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search terms or select another category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl border border-border/80 bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 flex flex-col justify-between"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-muted/60 border-b border-border/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3.5 left-3.5">
                  <Badge variant="default" className="backdrop-blur-md bg-card/90 text-foreground border border-border/80 shadow-xs text-xs font-medium rounded-full px-3 py-1">
                    {project.category}
                  </Badge>
                </div>
              </Link>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed font-normal">
                    {project.short_description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full text-[11px] bg-muted/70 text-foreground/85 font-medium border border-border/50"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[11px] text-muted-foreground self-center font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-xs"
                    >
                      Case Study
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        Live Demo
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
